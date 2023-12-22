import { Router } from "express";
import {
    createCategory, deleteCategory, getCategories, getCategory, updateCategory
} from "../controller/category.js";
import categoryValidator from "../middleware/validators/category/category.js"
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router()

router.route('/')
    .get(getCategories)
    .post(authenticate, categoryValidator.categorySchema, createCategory)

router.route('/:id')
    .get(getCategory)
    .put(authenticate, categoryValidator.categorySchema, updateCategory)
    .delete(authenticate, deleteCategory)

export default router