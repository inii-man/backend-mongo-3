# Playground Node.js dan MongoDB II

Repositori ini berfungsi sebagai tempat belajar (playground) dan referensi untuk materi "Node.js and MongoDB II", yang berfokus pada penggunaan Express.js dan MongoDB untuk membuat Web Service.

## Fitur yang Dicakup

1. **Registrasi Membership (Pendaftaran)**: 
   - Menggunakan `crypto` (SHA1) untuk melakukan hash pada password sebelum disimpan ke MongoDB.
   - Validasi sisi klien untuk format email dan panjang password.
2. **Passport.js & Login**: 
   - Menggunakan strategi `passport-local` untuk autentikasi.
   - Mengelola sesi (session) menggunakan `serializeUser` dan `deserializeUser`.
3. **Session Store**: 
   - Menggunakan `express-session` dikombinasikan dengan `connect-mongo` untuk menyimpan data sesi di dalam MongoDB, sehingga sesi tetap bertahan meskipun server di-restart.
4. **Menghubungkan Member dan Postingan**: 
   - Skema `Post` mereferensikan skema `User` menggunakan `ObjectId`.
   - Menggunakan `.populate()` dari Mongoose untuk mengambil detail lengkap penulis saat melakukan query pada postingan.
   - Membatasi penghapusan/pengeditan postingan hanya untuk penulis asli.
   - Penambahan indexing pada field `author` untuk performa.
5. **Client-Side Rendering (CSR) untuk Komentar**: 
   - Komentar diimplementasikan sebagai array sub-skema di dalam model `Post`.
   - Form komentar menggunakan tag `<template>` HTML dan API `fetch` untuk menambahkan dan memuat komentar tanpa memuat ulang (refresh) halaman.
   - Backend menyediakan endpoint RESTful API (`/api/posts/:shortId/comments`) yang mengembalikan data JSON, bukan HTML.
6. **MongoDB Aggregation (Agregasi)**: 
   - Mencontohkan pipeline agregasi dasar (`$group`, `$match`, `$lookup`) untuk mendapatkan jumlah postingan per penulis beserta detail profilnya. (Bisa dicek di route `/aggregation`).

## Persyaratan (Prerequisites)

- Node.js (v14 atau lebih baru)
- MongoDB berjalan di lokal pada `localhost:27017`

## Cara Instalasi

1. Clone atau buka repositori ini di terminal.
2. Instal dependensi:
   ```bash
   npm install
   ```

## Cara Menjalankan Aplikasi

Jalankan aplikasi dalam mode development (menggunakan nodemon):
```bash
npm run dev
```
Atau dalam mode standar:
```bash
npm start
```

Server akan berjalan pada `http://localhost:3000`.

## Cara Pakai (Cara Menggunakan Repositori Ini)

1. Buka browser dan arahkan ke `http://localhost:3000`.
2. Klik **Sign Up** untuk membuat akun pengguna baru.
3. Klik **Login** untuk masuk ke akun yang sudah dibuat.
4. Setelah login, klik **Create New Post** untuk menambahkan postingan baru.
5. Buka postingan tersebut, lalu gulir ke bawah dan cobalah menambahkan komentar. Perhatikan bahwa halaman tidak memuat ulang (Ini adalah penerapan CSR).
6. Klik nama penulis di sebelah judul postingan pada daftar postingan untuk melihat hanya postingan dari penulis tersebut (misalnya route `/users/.../posts`).
7. Buka tab baru di `http://localhost:3000/aggregation` untuk melihat output JSON dari pipeline agregasi MongoDB.

## Penjelasan Kode

Setiap baris logika di file `.js` dan `.pug` telah diberi komentar penjelasan yang mendetail. Komentar-komentar ini menjelaskan tujuan kode dan kaitannya dengan materi yang ada di PDF.
