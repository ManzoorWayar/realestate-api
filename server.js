import path from "path"
import http from "http"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import xss from "xss-clean"
import express from "express"
import { Server } from "socket.io"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"

import chat from "./webSocket/chat.js"
import connectDB from "./config/db.js"
import { corsOptions } from "./config/corsOptions.js"
import localization from "./middleware/localization.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"

// import userRoutes
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import estatesRoutes from './routes/estates.js';
import categoryRoutes from './routes/category.js';

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Initialize Express
const app = express();
const server = http.createServer(app)
const __dirname = path.resolve()

// Prevent XSS attacks
app.use(xss())
app.use(cors(corsOptions))

// Set security headers
app.use(helmet())

//  Initialize Socket.io
const io = new Server(server, { cors: corsOptions })
chat(io)

// Multil-language
app.use(localization)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(cookieParser())

// Sanitize data
app.use(mongoSanitize())

// set up the routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/estates', estatesRoutes);
app.use('/api/v1/category', categoryRoutes);

// Make static dir
app.use("/public", express.static(path.join(__dirname, "/public")))
app.use("/locals", express.static(path.join(__dirname, "/locals")))

// Error Handling Middlewares
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));