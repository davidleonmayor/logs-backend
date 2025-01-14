import { Router } from "express";
import multer from "multer";
import { ProductsCnt } from "./Controller";
import { getProducts, validateProduct } from "./schema";
import {
  isActiveCompanie,
  isAuthenticatedUser,
} from "../common/middleware/userPermissions";
import { validateInputs } from "../common/middleware/resourceInputs";

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
router.get(
  "/products",
  validateInputs(getProducts),
  isAuthenticatedUser,
  isActiveCompanie,
  ProductsCnt.get
);

// router.delete("/:id", CompanieCnt.remove);

// router.put("/:id", validateInputs(CreateCompanie), CompanieCnt.update);

export { router as ProductsRouter };
