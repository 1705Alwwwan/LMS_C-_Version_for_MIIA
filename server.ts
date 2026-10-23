import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distServer = path.resolve(__dirname, 'dist', 'server.js');

const isTsx = process.execArgv.some((arg) => arg.includes('tsx'));

if (!isTsx && fs.existsSync(distServer)) {
  // Production runtime with standard node
  import('./dist/server.js');
} else if (process.env.NODE_ENV === 'production' && fs.existsSync(distServer)) {
  // Production environment explicitly requested
  import('./dist/server.js');
} else {
  // In development with tsx
  import('./src/server/index.ts');
}
