const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const redisClient = require('../config/redis');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const cacheKey = `products:${JSON.stringify(query)}:${limit}:${page}`;

    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (err) {
      console.error('Redis Error:', err);
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(query);

    const responseData = {
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      }
    };

    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
    } catch (err) {
      console.error('Redis Cache Error:', err);
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cacheKey = `product:${req.params.id}`;

    try {
      const cachedProduct = await redisClient.get(cacheKey);
      if (cachedProduct) {
        return res.status(200).json(JSON.parse(cachedProduct));
      }
    } catch (err) {
      console.error('Redis Error:', err);
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const responseData = {
      success: true,
      product
    };

    try {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData));
    } catch (err) {
      console.error('Redis Cache Error:', err);
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, image, brand, category, stock } = req.body;

    if (!name || !description || !price || !image) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image,
      brand,
      category,
      stock
    });

    // Invalidate products list cache (simple approach: clear all products keys if possible, or just let them expire. 
    // For now, we won't implement complex pattern matching deletion as it requires scanning. 
    // Ideally, we should clear relevant list keys.)

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    try {
      // Invalidate specific product cache
      await redisClient.del(`product:${req.params.id}`);
    } catch (err) {
      console.error('Redis Error:', err);
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted'
    });

    try {
      // Invalidate specific product cache
      await redisClient.del(`product:${req.params.id}`);
    } catch (err) {
      console.error('Redis Error:', err);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
