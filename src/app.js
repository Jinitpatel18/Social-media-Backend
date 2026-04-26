import cookieParser from 'cookie-parser'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import userRouter from './Routes/user.route.js';
import { errorMiddleware } from './Utils/err.middleware.js';
import adminRouter from './Routes/admin.route.js';
import { generalLimiter } from './Utils/rateLimits.js';
import postRouter from './Routes/post.route.js';
import commentRouter from './Routes/comment.route.js'
import followRouter from './Routes/follow.route.js'

const app = express()
app.use(helmet())
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}))

app.use(generalLimiter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/follow', followRouter);

app.use(errorMiddleware);
export default app