import express from 'express'
import { registerUser, loginUser, profileUser, refreshAccessToken, logoutUser, updateProfile, updateAvatar, updateCoverImage, changePassword } from '../Controllers/user.controller.js';
import { verifyToken } from '../Middleware/auth.middleware.js';
import { upload } from '../Middleware/multer.middleware.js';
import { authLimiter } from '../Utils/rateLimits.js';

const router = express.Router();

router.post('/register', upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]),  authLimiter, registerUser);
router.post('/login', authLimiter, loginUser)
router.get("/profile", verifyToken, profileUser);
router.post("/logout", verifyToken, logoutUser)
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyToken, changePassword);

router.patch("/update-profile", verifyToken, updateProfile)
router.patch("/update-avatar", verifyToken, upload.single("avatar"), updateAvatar)
router.patch("/update-coverImage", verifyToken, upload.single("coverImage"), updateCoverImage)


export default router;