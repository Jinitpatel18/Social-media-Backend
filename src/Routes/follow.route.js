import express from 'express'
import { verifyToken } from '../Middleware/auth.middleware.js'
import { followToggle, getFollower, getFollowing } from '../Controllers/follow.controller.js'

const router = express.Router()

router.post('/:id', verifyToken, followToggle);
router.get('/:id/following', getFollowing)
router.get('/:id/follower', getFollower)

export default router