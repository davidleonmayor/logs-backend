import { Router } from "express";
import multer from "multer";
import { ProductsCnt } from "./Controller";
import { validateProduct } from "./schema";
import {
  isActiveCompanie,
  isAuthenticatedUser,
} from "../common/middleware/userPermissions";

const router = Router();

// Configuración básica de multer para almacenamiento temporal
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Verificar que sea una imagen
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
    cb(null, true);
  },
});

router.post(
  "/:companieId/product",
  upload.single("file"),
  validateProduct,
  isAuthenticatedUser,
  isActiveCompanie,
  ProductsCnt.create
);

router.get("/:id", (req, res) => {
  res.send("Hello world...");
});

// router.delete("/:id", CompanieCnt.remove);

// router.put("/:id", validateInputs(CreateCompanie), CompanieCnt.update);

export { router as ProductsRouter };
