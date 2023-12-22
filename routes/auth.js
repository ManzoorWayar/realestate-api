import { Router } from "express";
import mediaUploader from "../utils/mediaUploader.js"
import { login, register, resendToken, verifyEmail, forgotPassword, resetPassword, logout } from "../controller/auth.js";
import authValidator from "../middleware/validators/users/auth.js"

const router = Router()

router.post("/login", authValidator.login, login)
router.post("/register", mediaUploader.single("image"), authValidator.register, register)

router.post("/resendToken", authValidator.resendToken, resendToken)
router.put("/verify", authValidator.verifyEmail, verifyEmail)

router.post("/forgot-password", authValidator.forgotPassword, forgotPassword)
router.put("/reset-password", authValidator.resetPassword, resetPassword)

router.post("/verify", logout)

export default router