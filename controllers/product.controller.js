const mongoose = require("mongoose");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const productService = require("../service/product.service");
const productModel = require("../models/product.model");

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(buffer, originalName) {
  const ext = path.extname(originalName);
  const key = `products/${uuidv4()}${ext}`;
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: `image/${ext.slice(1)}`,
      })
    );
  } catch (err) {
    console.error("Error uploading to S3:", err); // Add this
    throw err;
  }

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/** POST /api/products */
async function createProductHandler(req, res, next) {
  try {
    const sellerId = req.query.sellerId;
    if (!sellerId) return res.status(400).json({ message: "Missing sellerId" });

    // Multer parsed files
    const files = req.files || [];
    // Upload each file to S3
    const imageUrls = await Promise.all(
      files.map((f) => uploadToS3(f.buffer, f.originalname))
    );

    // Normalize array fields
    let { materials_Made, countries_Available, tags, ...rest } = req.body;
    if (typeof materials_Made === "string") {
      materials_Made = materials_Made
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof countries_Available === "string") {
      countries_Available = countries_Available
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const data = {
      ...rest,
      materials_Made,
      countries_Available,
      tags,
      seller: sellerId,
      images: imageUrls,
    };

    const product = await productService.createProduct(data);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products */
async function listProductsHandler(req, res, next) {
  try {
    const filter = {};
    // your existing filter logic...
    const result = await productService.listProducts(filter, {
      sortBy: req.query.sortBy,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 16,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/:id */
async function getProductHandler(req, res, next) {
  try {
    const prod = await productService.getProductById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Product not found" });
    res.json(prod);
  } catch (err) {
    next(err);
  }
}

/** PUT /api/products/:id */
async function updateProductHandler(req, res, next) {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/** DELETE /api/products/:id */
async function deleteProductHandler(req, res, next) {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/** GET /api/products/seller/:sellerId */
async function getProductsBySellerHandler(req, res, next) {
  try {
    const { sellerId } = req.params;
    if (!sellerId)
      return res
        .status(400)
        .json({ message: "sellerId path parameter is required" });
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res.status(400).json({ message: "Invalid sellerId format" });
    }
    const products = await productModel.find({ seller: sellerId });
    return res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProductHandler,
  listProductsHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductsBySellerHandler,
};
