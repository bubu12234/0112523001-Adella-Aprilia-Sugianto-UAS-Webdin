"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const kategoriRoutes_1 = __importDefault(require("./routes/kategoriRoutes"));
const barangRoutes_1 = __importDefault(require("./routes/barangRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files for uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Register Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/kategori', kategoriRoutes_1.default);
app.use('/api/barang', barangRoutes_1.default);
app.get('/', (req, res) => {
    res.send('UAS Webdin API is running...');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
