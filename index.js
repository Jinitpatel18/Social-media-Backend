import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./src/app.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";

const PORT = process.env.PORT || 3000
app.use(cookieParser())

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.error("Server Failed", error)
    })