import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '..', 'src');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jsx?|mjs)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function extractExports(file) {
  const content = fs.readFileSync(file, 'utf8');
  const names = new Set();
  let hasDefault = false;
  if (/export\s+default\s+/.test(content)) hasDefault = true;
  for (const m of content.matchAll(/export\s+(?:function|const|class)\s+([A-Za-z0-9_$]+)/g)) {
    names.add(m[1]);
  }
  // export { A, B as C }
  for (const m of content.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const piece of m[1].split(',')) {
      const cleaned = piece.trim().split(/\s+as\s+/).pop().trim();
      if (cleaned) names.add(cleaned);
    }
  }
  return { names, hasDefault };
}

function extractImports(file) {
  const content = fs.readFileSync(file, 'utf8');
  const results = [];
  const re = /import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content))) {
    const clause = m[1].trim();
    const source = m[2];
    if (!source.startsWith('.') && !source.startsWith('/src')) continue;
    const defaultMatch = clause.match(/^([A-Za-z0-9_$]+)\s*(?:,|$)/);
    const namedMatch = clause.match(/\{([^}]+)\}/);
    results.push({
      source,
      hasDefault: !!defaultMatch,
      defaultName: defaultMatch ? defaultMatch[1] : null,
      named: namedMatch
        ? namedMatch[1]
            .split(',')
            .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
            .filter(Boolean)
        : []
    });
  }
  return results;
}

function resolveSource(fromFile, source) {
  let base;
  if (source.startsWith('/src/')) base = path.resolve(srcRoot, source.slice(5));
  else base = path.resolve(path.dirname(fromFile), source);
  const candidates = [base, base + '.jsx', base + '.js', base + '.mjs',
    path.join(base, 'index.jsx'), path.join(base, 'index.js')];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

const files = walk(srcRoot);
const problems = [];

for (const file of files) {
  for (const imp of extractImports(file)) {
    const target = resolveSource(file, imp.source);
    if (!target) {
      problems.push(`[MISSING FILE] ${path.relative(srcRoot, file)} → ${imp.source}`);
      continue;
    }
    const { names, hasDefault } = extractExports(target);
    if (imp.hasDefault && !hasDefault) {
      problems.push(
        `[NO DEFAULT EXPORT] ${path.relative(srcRoot, file)} imports default from ${path.relative(srcRoot, target)} but that file has no export default`
      );
    }
    for (const name of imp.named) {
      if (!names.has(name)) {
        problems.push(
          `[MISSING NAMED EXPORT] ${path.relative(srcRoot, file)} imports { ${name} } from ${path.relative(srcRoot, target)} but that file doesn't export it`
        );
      }
    }
  }
}

console.log('');
if (problems.length === 0) {
  console.log('✓ All imports resolve to real exports.');
} else {
  console.log(`✗ Found ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(p);
}

process.exit(problems.length === 0 ? 0 : 1);