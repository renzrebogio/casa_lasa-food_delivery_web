import foodModel from "../models/foodModel.js";
import fs from 'fs';
import path from 'path';

// add food item
const addFood = async (req, res) => {
  try {
    let image_filename = "";

    if (req.file) {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        // Option 1: Vercel Blob storage (when BLOB_READ_WRITE_TOKEN is configured in Vercel)
        try {
          const { put } = await import('@vercel/blob');
          const cleanFilename = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const blob = await put(`foods/${Date.now()}_${cleanFilename}`, req.file.buffer, {
            access: 'public',
          });
          image_filename = blob.url;
        } catch (blobErr) {
          console.error("Vercel Blob upload failed, falling back to base64:", blobErr);
          image_filename = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        }
      } else if (process.env.VERCEL) {
        // Option 2: Running in serverless without external blob storage: store directly as data URI
        image_filename = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else {
        // Option 3: Local development fallback: write buffer to uploads directory
        const uploadDir = path.resolve(process.cwd(), "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${Date.now()}${req.file.originalname.replace(/\s+/g, '_')}`;
        fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
        image_filename = filename;
      }
    }

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error in addFood:", error);
    res.json({ success: false, message: "Error" });
  }
};

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error in listFood:", error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food list
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // If local file, unlink safely
    if (food.image && !food.image.startsWith("http") && !food.image.startsWith("data:")) {
      const filePath = path.resolve(process.cwd(), "uploads", food.image);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Could not delete local file:", e.message);
        }
      }
    } else if (food.image && food.image.includes("vercel-storage.com") && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { del } = await import('@vercel/blob');
        await del(food.image);
      } catch (blobDelErr) {
        console.warn("Could not delete from Vercel Blob:", blobDelErr.message);
      }
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error in removeFood:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { addFood, listFood, removeFood };