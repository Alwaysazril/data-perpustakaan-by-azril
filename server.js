const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; background: #1a1a2f; color: white; padding: 20px; }
        .container { max-width: 400px; margin: auto; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; }
        input { width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #2ecc71; color: white; border: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
        .btn-cek { display: block; text-align: center; margin-top: 15px; color: #aaa; text-decoration: none; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h2 style="text-align:center; color:#00c6ff;">📚 INPUT DATA</h2>
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

app.get('/cek-data', (req, res) => {
    let log = "Belum ada data.";
    if (fs.existsSync('data_peminjaman.txt')) {
        log = fs.readFileSync('data_peminjaman.txt', 'utf8');
    }
    res.send("<body style='background:#1a1a2f; color:#00ff00; padding:20px;'><pre>" + log + "</pre><br><a href='/' style='color:white;'>KEMBALI</a></body>");
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    const baris = (d.namaPeminjam || '').padEnd(15) + " | " + (d.judulBuku || '').padEnd(20) + " | " + (d.nomorBuku || '') + "\n";
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/cek-data');
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Running on " + port);
});
