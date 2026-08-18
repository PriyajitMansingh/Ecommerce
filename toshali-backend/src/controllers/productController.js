import Product from "../models/Product.js";
import AdminAuditLog from "../models/AdminAuditLog.js";
import Category from "../models/Category.js";

const toNumberOrFallback = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      slug,
      categoryId,
      subcategoryId,
      shortDescription,
      longDescription,
      weight,
      headingDescription,
      productDetails,
      price,
      mrpPrice,
      discountPercent,
      stockQty,
      isFeatured,
      isUpcoming,
      imageUrl,
    } = req.body;

    if (!name || !sku || !slug || !categoryId || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, SKU, slug, category and price are required." });
    }

    const productCount = await Product.countDocuments();
    
    if (productCount >= 30) {
      return res.status(400).json({
        message:
          "Product limit reached. You cannot add more than 30 products. Please contact the support team.",
      });
    }

    if (productCount >= 25) {
      const remainingProducts = 30 - productCount;

      return res.status(200).json({
        message: `You have already added ${productCount} products. You can add only ${remainingProducts} more product${remainingProducts > 1 ? "s" : ""}.`,
        remainingProducts,
      });
    }

    const normalizedPrice = toNumberOrFallback(price);
    const normalizedMrpPrice = toNumberOrFallback(mrpPrice, normalizedPrice);
    const normalizedDiscountPercent = toNumberOrFallback(discountPercent, 0);

    if (normalizedPrice < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    if (normalizedMrpPrice < 0) {
      return res.status(400).json({ message: "MRP cannot be negative." });
    }

    if (normalizedDiscountPercent < 0 || normalizedDiscountPercent > 100) {
      return res
        .status(400)
        .json({ message: "Discount percent must be between 0 and 100." });
    }

    if (subcategoryId) {
      const subcategory = await Category.findById(subcategoryId);
      if (!subcategory) {
        return res
          .status(404)
          .json({ message: "Selected subcategory not found." });
      }
    }

    const existing = await Product.findOne({ $or: [{ sku }, { slug }] });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Product with this SKU or slug already exists." });
    }

    const product = await Product.create({
      name,
      sku,
      slug,
      categoryId,
      subcategoryId: subcategoryId || null,
      shortDescription,
      longDescription,
      weight: weight?.trim() || "",
      headingDescription: headingDescription || "",
      productDetails: productDetails || {},
      price: normalizedPrice,
      mrpPrice: normalizedMrpPrice,
      discountPercent: normalizedDiscountPercent,
      stockQty: toNumberOrFallback(stockQty, 0),
      isFeatured: Boolean(isFeatured),
      isUpcoming: Boolean(isUpcoming),
      imageUrl: imageUrl || "",
    });

    await AdminAuditLog.create({
      actorId: req.user._id,
      action: "CREATE",
      entityType: "Product",
      entityId: product._id,
      before: null,
      after: product.toObject(),
      ipAddress: req.ip,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("createProduct error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug");
    res.status(200).json(products);
  } catch (error) {
    console.error("getAllProducts error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getUpcomingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isUpcoming: true })
      .populate("categoryId", "name slug")
      .select("name imageUrl mrpPrice headingDescription categoryId isUpcoming")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("getUpcomingProducts error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    })
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("getProductBySlug error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug")
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("getAllProductsAdmin error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getProductByIdAdmin = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("getProductByIdAdmin error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getProductHistory = async (req, res) => {
  try {
    const logs = await AdminAuditLog.find({
      entityType: "Product",
      entityId: req.params.id,
    })
      .populate("actorId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error("getProductHistory error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const before = {
      name: product.name,
      categoryId: product.categoryId,
      subcategoryId: product.subcategoryId,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      weight: product.weight,
      headingDescription: product.headingDescription,
      productDetails: product.productDetails,
      price: product.price,
      mrpPrice: product.mrpPrice,
      discountPercent: product.discountPercent,
      stockQty: product.stockQty,
      imageUrl: product.imageUrl,
      isFeatured: product.isFeatured,
      isUpcoming: product.isUpcoming,
    };

    const {
      name,
      categoryId,
      subcategoryId,
      shortDescription,
      longDescription,
      weight,
      headingDescription,
      productDetails,
      price,
      mrpPrice,
      discountPercent,
      stockQty,
      isFeatured,
      isUpcoming,
      imageUrl,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (categoryId !== undefined) product.categoryId = categoryId;
    if (subcategoryId !== undefined) {
      if (subcategoryId) {
        const subcategory = await Category.findById(subcategoryId);
        if (!subcategory) {
          return res
            .status(404)
            .json({ message: "Selected subcategory not found." });
        }
      }
      product.subcategoryId = subcategoryId || null;
    }
    if (shortDescription !== undefined)
      product.shortDescription = shortDescription;
    if (longDescription !== undefined)
      product.longDescription = longDescription;
    if (weight !== undefined) product.weight = weight?.trim() || "";
    if (headingDescription !== undefined)
      product.headingDescription = headingDescription;
    if (productDetails !== undefined)
      product.productDetails = { ...product.productDetails, ...productDetails };
    if (price !== undefined) {
      const normalizedPrice = toNumberOrFallback(price);
      if (normalizedPrice < 0) {
        return res.status(400).json({ message: "Price cannot be negative." });
      }
      product.price = normalizedPrice;
    }
    if (mrpPrice !== undefined) {
      const normalizedMrpPrice = toNumberOrFallback(mrpPrice);
      if (normalizedMrpPrice < 0) {
        return res.status(400).json({ message: "MRP cannot be negative." });
      }
      product.mrpPrice = normalizedMrpPrice;
    }
    if (discountPercent !== undefined) {
      const normalizedDiscountPercent = toNumberOrFallback(discountPercent);
      if (normalizedDiscountPercent < 0 || normalizedDiscountPercent > 100) {
        return res
          .status(400)
          .json({ message: "Discount percent must be between 0 and 100." });
      }
      product.discountPercent = normalizedDiscountPercent;
    }
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (stockQty !== undefined) {
      const normalizedStockQty = toNumberOrFallback(stockQty);
      if (normalizedStockQty < 0) {
        return res
          .status(400)
          .json({ message: "Stock quantity cannot be negative." });
      }
      product.stockQty = normalizedStockQty;
    }
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isUpcoming !== undefined) product.isUpcoming = isUpcoming;

    const updated = await product.save();

    const after = {
      name: updated.name,
      categoryId: updated.categoryId,
      subcategoryId: updated.subcategoryId,
      shortDescription: updated.shortDescription,
      longDescription: updated.longDescription,
      weight: updated.weight,
      headingDescription: updated.headingDescription,
      productDetails: updated.productDetails,
      price: updated.price,
      mrpPrice: updated.mrpPrice,
      discountPercent: updated.discountPercent,
      stockQty: updated.stockQty,
      imageUrl: updated.imageUrl,
      isFeatured: updated.isFeatured,
      isUpcoming: updated.isUpcoming,
    };

    await AdminAuditLog.create({
      actorId: req.user._id,
      action: "UPDATE",
      entityType: "Product",
      entityId: updated._id,
      before,
      after,
      ipAddress: req.ip,
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("updateProduct error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const toggleProductActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const before = { isActive: product.isActive };
    product.isActive = !product.isActive;
    await product.save();
    const after = { isActive: product.isActive };

    await AdminAuditLog.create({
      actorId: req.user._id,
      action: "TOGGLE_ACTIVE",
      entityType: "Product",
      entityId: product._id,
      before,
      after,
      ipAddress: req.ip,
    });

    res
      .status(200)
      .json({
        message: `Product ${product.isActive ? "activated" : "deactivated"}.`,
        product,
      });
  } catch (error) {
    console.error("toggleProductActive error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "name slug")
      .populate("subcategoryId", "name slug");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("getProductByIdAdmin error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const toggleProductSale = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    const before = { isOnSale: product.isOnSale };
    product.isOnSale = !product.isOnSale;
    await product.save();
    const after = { isOnSale: product.isOnSale };

    await AdminAuditLog.create({
      actorId: req.user._id,
      action: "TOGGLE_SALE",
      entityType: "Product",
      entityId: product._id,
      before,
      after,
      ipAddress: req.ip,
    });

    res.status(200).json({
      message: `Sale ${product.isOnSale ? "enabled" : "disabled"} for "${product.name}".`,
      product,
    });
  } catch (error) {
    console.error("toggleProductSale error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    await AdminAuditLog.create({
      actorId: req.user._id,
      action: "DELETE",
      entityType: "Product",
      entityId: product._id,
      before: product.toObject(),
      after: null,
      ipAddress: req.ip,
    });

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Product "${product.name}" deleted.` });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }
    // Build a URL the frontend can use: /uploads/products/<filename>
    const url = `/uploads/products/${req.file.filename}`;
    res.status(200).json({ url, filename: req.file.filename });
  } catch (error) {
    console.error("uploadProductImage error:", error);
    res.status(500).json({ message: "Image upload failed." });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json([]);
    }

    const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixPattern = new RegExp("^" + escaped, "i");

    const matchingCategories = await Category.find({
      name: prefixPattern,
    }).select("_id");
    const categoryIds = matchingCategories.map((c) => c._id);

    const products = await Product.find({
      isActive: true,
      $or: [{ name: prefixPattern }, { categoryId: { $in: categoryIds } }],
    })
      .select("name slug imageUrl price") // ← only what a suggestion row needs to render
      .limit(10);

    res.status(200).json(products);
  } catch (error) {
    console.error("searchProducts error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
