import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..', 'src');

function readFiles(dir, filter) {
  return fs.readdirSync(dir).filter(filter).map((f) => path.join(dir, f));
}

function extractExports(file) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)];
  return new Set(matches.map((m) => m[1]));
}

function extractImports(file) {
  const content = fs.readFileSync(file, 'utf8');
  const imports = [];
  const re = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+validator\.js)['"]/g;
  let m;
  while ((m = re.exec(content))) {
    const names = m[1]
      .split(',')
      .map((s) => s.trim().split(/\s+as\s+/)[0].trim())
      .filter(Boolean);
    imports.push({ from: m[2], names, importer: file });
  }
  return imports;
}

const validatorsDir = path.join(root, 'validators');
const routesDir = path.join(root, 'routes');
const servicesDir = path.join(root, 'services');
const controllersDir = path.join(root, 'controllers');

const validatorFiles = readFiles(validatorsDir, (f) => f.endsWith('.validator.js'));
const routeFiles = readFiles(routesDir, (f) => f.endsWith('.routes.js'));
const serviceFiles = readFiles(servicesDir, (f) => f.endsWith('.js'));
const controllerFiles = readFiles(controllersDir, (f) => f.endsWith('.js'));

const exportsByFile = new Map();
for (const file of validatorFiles) {
  exportsByFile.set(path.basename(file), extractExports(file));
}

let problems = 0;
const allImporters = [...routeFiles, ...serviceFiles, ...controllerFiles];

for (const file of allImporters) {
  const imports = extractImports(file);
  for (const { from, names } of imports) {
    const base = path.basename(from);
    const available = exportsByFile.get(base);
    if (!available) {
      console.log(`[MISSING FILE] ${path.relative(root, file)} imports from missing ${base}`);
      problems++;
      continue;
    }
    for (const name of names) {
      if (!available.has(name)) {
        console.log(
          `[MISSING EXPORT] ${path.relative(root, file)} imports "${name}" from ${base}, but ${base} doesn't export it.`
        );
        problems++;
      }
    }
  }
}

console.log('');
if (problems === 0) {
  console.log('✓ All validator imports match exports.');
} else {
  console.log(`✗ Found ${problems} problem(s) above.`);
}

process.exit(problems === 0 ? 0 : 1);