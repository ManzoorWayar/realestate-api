import { Router } from "express";
import { createEstate, deleteEstate, getEstate, getEstates, likeOrDislike, updateEstate }
    from "../controller/estates.js";
import estateValidator from "../middleware/validators/estates/estates.js"
import { authenticate } from "../middleware/authMiddleware.js";
import mediaUploader from "../utils/mediaUploader.js"

const router = Router()

router.route('/')
    .get(getEstates)
    .post(authenticate, mediaUploader.array('images', 5), estateValidator.createEstate, createEstate)

router.route('/:id')
    .get(getEstate)
    .put(authenticate, mediaUploader.array('images', 5), estateValidator.updateEstate, updateEstate)
    .delete(authenticate, deleteEstate)

router.put('/:id/like', authenticate, likeOrDislike)

export default router