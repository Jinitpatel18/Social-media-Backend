import express from 'express';
import { verifyToken } from '../Middleware/auth.middleware.js';
import { upload } from '../Middleware/multer.middleware.js';
import { createPost, deletePost, getAllPosts, getPostById, likePost, updatePost } from '../Controllers/post.controller.js';

const router = express.Router();

router.post('/', verifyToken, upload.single("image"), createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.patch('/:id', verifyToken, upload.single("image"), updatePost);
router.delete('/:id', verifyToken, deletePost);
router.post('/:id/like', verifyToken, likePost);

export default router;