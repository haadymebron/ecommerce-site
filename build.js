const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log('=== ECOMMERCE BUILD SCRIPT ===');
console.log('Platform:', os.platform());
console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

try {
  // Run the build
  console.log('\n1. Building client...');
  execSync('cd client && npm install && npm run build', { stdio: 'inherit', shell: true });

  // Copy dist to root
  console.log('\n2. Copying dist folder to root...');
  const src = path.join(__dirname, 'client', 'dist');
  const dst = path.join(__dirname, 'dist');
  
  console.log('Source path:', src);
  console.log('Destination path:', dst);
  console.log('Source exists:', fs.existsSync(src));
  
  if (fs.existsSync(src)) {
    console.log('✓ Source directory found');
    if (fs.existsSync(dst)) {
      console.log('Removing existing destination...');
      fs.rmSync(dst, { recursive: true, force: true });
    }
    console.log('Copying files...');
    fs.cpSync(src, dst, { recursive: true });
    console.log('✓ Successfully copied client/dist to ./dist');
    
    // Verify destination
    if (fs.existsSync(dst)) {
      const files = fs.readdirSync(dst);
      console.log('✓ Dist folder contents:', files.join(', '));
      console.log('\n=== BUILD SUCCESSFUL ===');
    } else {
      throw new Error('Destination dist folder not found after copy');
    }
  } else {
    throw new Error('Source client/dist folder not found after build');
  }
} catch (error) {
  console.error('\n✗ BUILD FAILED:');
  console.error(error.message);
  if (error.stdout) console.error('STDOUT:', error.stdout.toString());
  if (error.stderr) console.error('STDERR:', error.stderr.toString());
  process.exit(1);
}

