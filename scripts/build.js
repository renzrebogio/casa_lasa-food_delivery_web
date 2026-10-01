import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('===> Starting Unified Production Build for Casa Lasa <===');

// 1. Build frontend
console.log('\n[1/3] Building Customer Frontend...');
execSync('npm run build', {
  cwd: path.join(rootDir, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

// 2. Build admin
console.log('\n[2/3] Building Admin Dashboard...');
execSync('npm run build', {
  cwd: path.join(rootDir, 'admin'),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    VITE_BASE_PATH: '/admin/',
  },
});

// 3. Assemble unified dist folder
console.log('\n[3/3] Assembling Unified Output in dist/ ...');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy frontend dist to root dist
const frontendDist = path.join(rootDir, 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  fs.cpSync(frontendDist, distDir, { recursive: true });
  console.log('  -> Copied frontend dist to dist/');
}

// Copy admin dist to dist/admin
const adminDist = path.join(rootDir, 'admin', 'dist');
const adminTarget = path.join(distDir, 'admin');
if (fs.existsSync(adminDist)) {
  fs.cpSync(adminDist, adminTarget, { recursive: true });
  console.log('  -> Copied admin dist to dist/admin/');
}

// Ensure food images from backend uploads are in dist/images
const uploadsDir = path.join(rootDir, 'backend', 'uploads');
const imagesTarget = path.join(distDir, 'images');
if (fs.existsSync(uploadsDir)) {
  fs.mkdirSync(imagesTarget, { recursive: true });
  fs.cpSync(uploadsDir, imagesTarget, { recursive: true });
  console.log('  -> Mirrored backend/uploads to dist/images/');
}

console.log('\n=== Unified Build Complete! Ready for Vercel Deployment ===\n');
