console.log('Testing script execution...');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

try {
  const fs = require('fs');
  const path = require('path');

  // Check if HTML files exist
  const shopPath = path.join(__dirname, '../E-commerce-main/shop.html');
  const indexPath = path.join(__dirname, '../E-commerce-main/index.html');

  console.log('Shop.html exists:', fs.existsSync(shopPath));
  console.log('Index.html exists:', fs.existsSync(indexPath));

  // Try to read a small portion of shop.html
  if (fs.existsSync(shopPath)) {
    const content = fs.readFileSync(shopPath, 'utf8');
    console.log('Shop.html length:', content.length);
    console.log('First 200 chars:', content.substring(0, 200));
  }

  console.log('Test completed successfully!');
} catch (error) {
  console.error('Error:', error.message);
}
