import express from 'express';
import { verifyRoles, verifyToken } from '../Middleware/auth.middleware.js';
import { getAllUsers, deleteUser, updateUserRole } from '../Controllers/admin.controller.js';

const router = express.Router();

router.get("/users", verifyToken, verifyRoles("admin"), getAllUsers);
router.delete("/users/:id", verifyToken, verifyRoles("admin"), deleteUser);
router.patch("/users/:id/role", verifyToken, verifyRoles("admin"), updateUserRole);

export default router;