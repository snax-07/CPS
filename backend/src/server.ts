import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import connectDB from './config/db.ts';
import router from './routes/index.ts';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin : "http://localhost:3000",
    credentials : true
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("CPS"))
// Database Connection
connectDB();

// Routes
app.use('/api/v1', router);

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'active' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));