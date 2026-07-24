import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import kategoriRoutes from './routes/kategoriRoutes';
import barangRoutes from './routes/barangRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/kategori', kategoriRoutes);
app.use('/api/barang', barangRoutes);

app.get('/', (req, res) => {
    res.send('UAS Webdin API is running...');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
