import { Router } from "express";

import { protectUser } from "../middleware/auth.middleware";
import { addProduct, allProduct, deleteProduct, editProduct, singleProduct } from "../controllers/product.controller";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.use(upload.single("image"));
router.get("/", allProduct);
router.get("/:id", singleProduct);
router.use(protectUser);
router.post("/", addProduct);
router.patch("/:id",editProduct)
router.delete("/:id", deleteProduct);


export default router;
