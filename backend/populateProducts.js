const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
require('dotenv').config();

const Product = require('./models/Product');

// Function to parse price from "Rs. 400" format
function parsePrice(priceString) {
  const match = priceString.match(/Rs\.?\s*([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, ''));
  }
  return 0;
}

// Function to determine category based on product details
function determineCategory(name, imagePath, brand) {
  const lowerName = name.toLowerCase();
  const lowerBrand = brand ? brand.toLowerCase() : '';

  // Electronics category
  if (imagePath.includes('/elect/') ||
      lowerName.includes('phone') ||
      lowerName.includes('iphone') ||
      lowerName.includes('samsung') ||
      lowerName.includes('alexa') ||
      lowerName.includes('camera') ||
      lowerName.includes('headphone') ||
      lowerName.includes('earphone') ||
      lowerName.includes('watch') ||
      lowerName.includes('charger') ||
      lowerName.includes('powerbank') ||
      lowerName.includes('laptop') ||
      lowerName.includes('bulb') ||
      lowerName.includes('light') ||
      lowerName.includes('iron') ||
      lowerName.includes('toaster') ||
      lowerName.includes('guitar') ||
      lowerName.includes('trimer') ||
      lowerName.includes('mixer') ||
      lowerName.includes('cleaner') ||
      lowerName.includes('cctv') ||
      lowerName.includes('hair dryer') ||
      lowerName.includes('coffe') ||
      lowerName.includes('jar') ||
      lowerBrand.includes('amazon') ||
      lowerBrand.includes('canon') ||
      lowerBrand.includes('sony') ||
      lowerBrand.includes('huawei') ||
      lowerBrand.includes('nokia') ||
      lowerBrand.includes('realme') ||
      lowerBrand.includes('infinix') ||
      lowerBrand.includes('oneplus') ||
      lowerBrand.includes('oppo') ||
      lowerBrand.includes('rolex') ||
      lowerBrand.includes('philips') ||
      lowerBrand.includes('usha') ||
      lowerBrand.includes('techno') ||
      lowerBrand.includes('ktm') ||
      lowerBrand.includes('meta') ||
      lowerBrand.includes('angebot') ||
      lowerBrand.includes('artstudio') ||
      lowerBrand.includes('kemei') ||
      lowerBrand.includes('nutripto') ||
      lowerBrand.includes('mucklily') ||
      lowerBrand.includes('nespro') ||
      lowerBrand.includes('tp-link') ||
      lowerBrand.includes('surya') ||
      lowerBrand.includes('robotek')) {
    return 'Electronics';
  }

  // T-Shirts category
  if (lowerName.includes('t-shirt') ||
      lowerName.includes('shirt') ||
      lowerName.includes('pant') ||
      lowerName.includes('jeans')) {
    return 'T-Shirts';
  }

  // Accessories category
  if (lowerName.includes('watch') ||
      lowerName.includes('earbuds') ||
      lowerName.includes('earphone') ||
      lowerName.includes('headphone') ||
      lowerName.includes('smartwatch')) {
    return 'Accessories';
  }

  return 'Other';
}

// Function to generate description based on product details
function generateDescription(name, brand) {
  const descriptions = [
    "High-quality product with excellent features and modern design.",
    "Premium item offering great value and superior performance.",
    "Stylish and functional product perfect for everyday use.",
    "Reliable and durable item with outstanding quality.",
    "Innovative design meets practical functionality in this amazing product.",
    "Experience the best in class with this top-rated item.",
    "Crafted with care to deliver exceptional results every time.",
    "A must-have item that combines style, quality, and affordability.",
    "Engineered for excellence with cutting-edge technology.",
    "Discover the perfect blend of innovation and reliability."
  ];

  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  return brand ? `${brand} ${name}. ${randomDesc}` : `${name}. ${randomDesc}`;
}

// Function to extract products from HTML content
function extractProductsFromHTML(htmlContent, sourceFile) {
  const $ = cheerio.load(htmlContent);
  const products = [];

  $('.pro').each((index, element) => {
    const $element = $(element);

    // Extract product details
    const imageSrc = $element.find('img').attr('src');
    const brand = $element.find('.des span').text().trim();
    const name = $element.find('.des h5').text().trim();
    const priceText = $element.find('.des h4').text().trim();
    const price = parsePrice(priceText);

    // Count stars for rating
    const starCount = $element.find('.star .fa-star').length;
    const rating = starCount || 5; // Default to 5 if no stars found

    // Skip if essential data is missing
    if (!name || !imageSrc || price === 0) {
      console.log(`Skipping product ${index + 1} in ${sourceFile} - missing essential data`);
      return;
    }

    // Determine category
    const category = determineCategory(name, imageSrc, brand);

    // Generate description
    const description = generateDescription(name, brand);

    // Generate stock (random between 10-100)
    const stock = Math.floor(Math.random() * 91) + 10;

    const product = {
      name,
      description,
      price,
      image: imageSrc,
      brand: brand || 'Generic',
      category,
      stock,
      rating
    };

    products.push(product);
  });

  return products;
}

// Main function to populate database
async function populateProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const allProducts = [];

    // Read and parse shop.html
    const shopHtmlPath = path.join(__dirname, '../E-commerce-main/shop.html');
    if (fs.existsSync(shopHtmlPath)) {
      console.log('Reading shop.html...');
      const shopHtml = fs.readFileSync(shopHtmlPath, 'utf8');
      const shopProducts = extractProductsFromHTML(shopHtml, 'shop.html');
      allProducts.push(...shopProducts);
      console.log(`Extracted ${shopProducts.length} products from shop.html`);
    }

    // Read and parse index.html
    const indexHtmlPath = path.join(__dirname, '../E-commerce-main/index.html');
    if (fs.existsSync(indexHtmlPath)) {
      console.log('Reading index.html...');
      const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      const indexProducts = extractProductsFromHTML(indexHtml, 'index.html');
      allProducts.push(...indexProducts);
      console.log(`Extracted ${indexProducts.length} products from index.html`);
    }

    console.log(`Total products extracted: ${allProducts.length}`);

    // Remove duplicates based on name and image
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.name === product.name && p.image === product.image)
    );

    console.log(`Unique products: ${uniqueProducts.length}`);

    // Clear existing products (optional - comment out if you want to keep existing data)
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Insert products in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < uniqueProducts.length; i += batchSize) {
      const batch = uniqueProducts.slice(i, i + batchSize);
      try {
        await Product.insertMany(batch);
        insertedCount += batch.length;
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} products`);
      } catch (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      }
    }

    console.log(`Successfully inserted ${insertedCount} products into database`);

    // Display summary by category
    const categorySummary = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    console.log('\nProducts by category:');
    categorySummary.forEach(cat => {
      console.log(`${cat._id}: ${cat.count} products`);
    });

  } catch (error) {
    console.error('Error populating products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  populateProducts();
}

module.exports = { populateProducts };
