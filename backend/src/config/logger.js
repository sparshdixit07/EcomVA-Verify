const levels = ['error', 'warn', 'info', 'debug'];

function ts() {
  return new Date().toISOString();
}

function make(level) {
  return (...args) => {
    // eslint-disable-next-line no-console
    console[level === 'debug' ? 'log' : level](`[${ts()}] [${level.toUpperCase()}]`, ...args);
  };
}

export const logger = levels.reduce((acc, level) => {
  acc[level] = make(level);
  return acc;
}, {});