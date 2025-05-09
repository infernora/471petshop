// import path from "path";
// import express from "express";
// import multer from "multer";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = /jpe?g|png|webp/;
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extname = path.extname(file.originalname).toLowerCase();
//   const mimetype = file.mimetype;

//   if (filetypes.test(extname) && mimetypes.test(mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Images only"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });
// const uploadSingleImage = upload.single("image");

// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     } else if (req.file) {
//       res.status(200).send({
//         message: "Image uploaded successfully",
//         image: `/${req.file.path}`,
//       });
//     } else {
//       res.status(400).send({ message: "No image file provided" });
//     }
//   });
// });

// export default router;

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import cors from "cors";  // ✅ add this

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING',
//   nodeenv: process.env.NODE_ENV,
// });

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary,
  folder: "471petshop",
  params: {
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  }
});

const upload = multer({ storage });
const router = express.Router();

// ✅ Apply CORS locally for this route
const allowedOrigins = ['http://localhost:5173', 'https://471petshop-3.vercel.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// ✅ Handle preflight requests
router.options("/", cors(corsOptions));

// ✅ Upload Route
router.post("/", cors(corsOptions), upload.single("image"), (req, res) => {
  if (req.file) {
    return res.status(200).send({
      message: "Image uploaded successfully",
      image: req.file.path,
    });
  } else {
    console.error("Upload error:", req.error || "No file provided");
    return res.status(400).send({ message: "No image file provided or error occurred" });
  }
});

export default router;

