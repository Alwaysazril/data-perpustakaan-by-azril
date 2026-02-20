const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Halaman Utama - Tampilan Sesuai Gambar Kamu
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; background: #1a1a2f; color: white; padding: 20px; margin: 0; }
        .container { max-width: 400px; margin: auto; background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h2 { text-align: center; color: #00c6ff; margin-bottom: 20px; font-size: 24px; }
        input { width: 100%; padding: 12px; margin: 6px 0; border-radius: 8px; border: none; box-sizing: border-box; background: white; color: #333; }
        button { width: 100%; padding: 15px; background: #2ecc71; color: white; border: none; border-radius: 10px; font-weight: bold; margin-top: 15px; cursor: pointer; }
        .btn-cek { display: block; text-align: center; margin-top: 20px; color: #aaa; text-decoration: none; font-size: 12px; text-transform: uppercase; }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 INPUT DATA</h2>
        <form action="/tambah" method="POST">
            <input type="text" name="namaPeminjam" placeholder="Nama Peminjam" required>
            <input type="text" name="judulBuku" placeholder="Judul Buku" required>
            <input type="text" name="nomorBuku" placeholder="Nomor Buku">
            <input type="text" name="idBuku" placeholder="ID Buku">
            <input type="text" name="penerbit" placeholder="Penerbit">
            <input type="text" name="tahun" placeholder="Tahun Terbit">
            <input type="text" name="kurikulum" placeholder="Kurikulum">
            <button type="submit">SIMPAN DATA</button>
        </form>
        <a href="/cek-data" class="btn-cek">LIHAT DATA</a>
    </div>
</body>
</html>
    `);
});

// Halaman Lihat Data
app.get('/cek-data', (req, res) => {
    let log = "Belum ada data.";
    if (fs.existsSync('data_peminjaman.txt')) {
        log = fs.readFileSync('data_peminjaman.txt', 'utf8');
    }
    res.send(\`
        <body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;">
            <pre style="white-space:pre; font-size:11px;">\${log}</pre>
            <hr style="border:0.5px solid #333; margin:20px 0;">
            <a href="/" style="color:white; text-decoration:none; background:#444; padding:10px 20px; border-radius:5px;">⬅ KEMBALI</a>
        </body>
    \`);
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    
    // Jika file kosong/baru dihapus, buatkan header kolom otomatis
    if (!fs.existsSync('data_peminjaman.txt') || fs.readFileSync('data_peminjaman.txt').length < 10) {
        const h = "PEMINJAM       | JUDUL BUKU           | NO. BUKU | ID BUKU | PENERBIT   \\n" +
                  "--------------------------------------------------------------------------\\n";
        fs.writeFileSync('data_peminjaman.txt', h);
    }

    // Mengatur spasi agar lurus persis seperti tabel
    const baris = \`\${(d.namaPeminjam || '').padEnd(14)} | \${(d.judulBuku || '').padEnd(20)} | \${(d.nomorBuku || '').padEnd(8)} | \${(d.idBuku || '').padEnd(7)} | \${d.penerbit || ''}\\n\`;
    
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/cek-data');
});

app.listen(port, "0.0.0.0", () => { console.log("Server ON"); });
