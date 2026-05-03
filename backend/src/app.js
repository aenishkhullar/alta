import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

// 1. CORS (Must be at the top to handle preflight OPTIONS requests)
app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5173", "https://alta-silk.vercel.app", "http://127.0.0.1:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    })
);

// 2. Body Parsers
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/chat', chatRoutes);

app.get("/", (req, res) => {
    res.send("API Running");
});

export default app;
