import { Router } from "express";

import { protectUser } from "../middleware/auth.middleware";
import { addStore, allStores, deleteStore, editStore, singleStore } from "../controllers/store.controller";

const router = Router();

router.get("/", allStores);
router.get("/:id", singleStore);
router.use(protectUser);
router.post("/", addStore);
router.patch("/:id", editStore);
router.delete("/:id", deleteStore);


export default router;
