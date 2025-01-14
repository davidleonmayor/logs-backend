import { v2 as cloudinary } from "cloudinary";

// console.log("Cloudinary Config:", {
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET?.slice(0, 5) + "...", // Solo mostrar los primeros 5 caracteres por seguridad
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
