import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("✅ Cloudinary connected:", process.env.CLOUDINARY_CLOUD_NAME);
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "tripshare_reviews",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploader = multer({ storage });

export default uploader;