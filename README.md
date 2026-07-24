**UAS Webdin - Sistem Inventaris Lab**
Nama: Adella Aprilia Sugianto  
NIM: 0112523001  

**Cara Jalanin Programnya**

1. Database
- Buka phpmyadmin terus bikin db namanya `uas_webdin`
- Import file `db.sql` yang ada di folder `backend/src/models/`

2. Setup Backend
- buka terminal, masuk ke folder backend (`cd backend`)
- ketik `npm install`
- bikin file `.env` isinya:  
PORT=3000  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=  
DB_NAME=uas_webdin  
JWT_SECRET=supersecretjwtkey123  
- kalo udah, ketik `npm run dev`

3. Setup Frontend
- buka terminal baru, masuk ke folder frontend (`cd frontend`)
- ketik `npm install`
- ketik `npm run dev`

**Akun Buat Testing**
- Admin: admin@gmail.com (pass: admin123)
- Operator: operator@gmail.com (pass: operator123)
- Viewer: viewer@gmail.com (pass: viewer123)

**Daftar Endpoint API**
- Auth:  
  POST /api/auth/register, POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
- Barang:  
  GET /api/barang?search=&filter=&page=&limit=, GET /api/barang/:id, POST /api/barang, PUT /api/barang/:id, DELETE /api/barang/:id, POST /api/barang/:id/upload
- Kategori:  
  GET /api/kategori, GET /api/kategori/:id, POST /api/kategori, PUT /api/kategori/:id, DELETE /api/kategori/:id
- User:  
  GET /api/users, POST /api/users, PUT /api/users/:id, DELETE /api/users/:id, POST /api/users/:id/reset-password
