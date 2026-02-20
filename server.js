const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Halaman Utama: Menampilkan semua input (Tahun & Kurikulum kembali)
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1a1a2f, #2d1d44); color: white; padding: 20px; margin: 0; }
        .container { max-width: 500px; margin: auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
        h2 { text-align: center; color: #00c6ff; display: flex; align-items: center; justify-content: center; gap: 10px; }
        label { font-size: 12px; color: #aaa; display: block; margin-top: 10px; }
        input { width: 100%; padding: 12px; margin: 5px 0; border-radius: 10px; border: none; background: rgba(255,255,255,0.05); color: white; box-sizing: border-box; outline: none; }
        button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: #2ecc71; color: white; font-weight: bold; cursor: pointer; margin-top: 25px; }
        .btn-cek { background: rgba(255,255,255,0.1); margin-top: 10px; text-decoration: none; color: #aaa; font-size: 11px; display: block; text-align: center; padding: 10px; border-radius: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 INPUT DATA PEMINJAMAN</h2>
        <form action="/tambah" method="POST">
            <label>Nama Peminjam</label><input type="text" name="namaPeminjam" required>
            <label>Judul Buku</label><input type="text" name="judulBuku" required>
            <label>Nomor Buku</label><input type="text" name="nomorBuku">
            <label>ID Buku</label><input type="text" name="idBuku">
            <label>Penerbit</label><input type="text" name="penerbit">
            <label>Tahun Terbit</label><input type="text" name="tahunTerbit">
            <label>Kurikulum</label><input type="text" name="kurikulum">
            <button type="submit">💾 SIMPAN DATA</button>
        </form>
        <a href="/cek-data" class="btn-cek">🔍 LIHAT & KELOLA DATA</a>
    </div>
</body>
</html>
    `);
});

// Halaman Lihat Data: Menampilkan tabel hijau yang lurus
app.get('/cek-data', (req, res) => {
    let log = "Belum ada data.";
    if (fs.existsSync('data_peminjaman.txt')) {
        log = fs.readFileSync('data_peminjaman.txt', 'utf8');
    }
    res.send(`
        <body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;">
            <pre style="white-space:pre; font-size:10px;">` + log + `</pre>
            <hr style="border:0.5px solid #333; margin:20px 0;">
            <div style="display:flex; gap:10px;">
                <a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px; font-family:sans-serif;">⬅ KEMBALI</a>
                <form action="/hapus-semua" method="POST" onsubmit="return confirm('Hapus semua data?')">
                    <button type="submit" style="background:#e74c3c; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">🗑️ HAPUS SEMUA</button>
                </form>
            </div>
        </body>
    `);
});

// Fungsi Hapus Data di Server Railway
app.post('/hapus-semua', (req, res) => {
    if (fs.existsSync('data_peminjaman.txt')) {
        fs.unlinkSync('data_peminjaman.txt');
    }
    res.redirect('/cek-data');
});

// Fungsi Simpan Data: Mengatur spasi agar lurus masuk kolom
app.post('/tambah', (req, res) => {
    const d = req.body;
    if (!fs.existsSync('data_peminjaman.txt')) {
        const h = "PEMINJAM       | JUDUL BUKU           | NO | ID | PENERBIT   | TAHUN | KURIKULUM\n" +
                  "--------------------------------------------------------------------------------\n";
        fs.writeFileSync('data_peminjaman.txt', h);
    }
    const baris = (d.namaPeminjam || '').padEnd(14) + " | " + 
                  (d.judulBuku || '').padEnd(20) + " | " + 
                  (d.nomorBuku || '').padEnd(2) + " | " + 
                  (d.idBuku || '').padEnd(2) + " | " + 
                  (d.penerbit || '').padEnd(10) + " | " + 
                  (d.tahunTerbit || '').padEnd(5) + " | " + 
                  (d.kurikulum || '') + "\n";
    
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/cek-data');
});

app.listen(port, "0.0.0.0", () => { console.log("Server Aktif"); });
