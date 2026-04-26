import express from 'express';
import { verifyToken } from '../Middleware/auth.middleware.js';
import { createComment, deleteComment, getAllCommentsOfPost } from '../Controllers/comment.controller.js';

const router = express.Router()

router.post('/:id/comments', verifyToken, createComment);
router.get('/:id/comments', getAllCommentsOfPost);
router.delete('/:postId/comments/:commentId', verifyToken, deleteComment)

export default router;