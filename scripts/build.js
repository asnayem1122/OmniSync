import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Running Omnisync production build...');

// 1. Run Vite build in client
execSync('npm --prefix client run build', { stdio: 'inherit' });

const rootDist = path.resolve('dist');
const clientDist = path.resolve('client/dist');

// 2. Mirror dist to both root and client/dist so Vercel can never miss it
if (fs.existsSync(rootDist)) {
  if (!fs.existsSync(clientDist)) {
    fs.cpSync(rootDist, clientDist, { recursive: true });
    console.log('✅ Mirrored build output to client/dist');
  }
} else if (fs.existsSync(clientDist)) {
  fs.cpSync(clientDist, rootDist, { recursive: true });
  console.log('✅ Mirrored build output to root dist');
}

console.log('🎉 Production build completed successfully!');
