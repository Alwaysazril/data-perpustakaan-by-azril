const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Menggunakan path absolute agar sistem cloud tidak bingung
const dataFile = path.join(__dirname, 'data_peminjaman.txt');

// Fungsi pembantu untuk memastikan file data selalu ada
const inisialisasiFile = () => {
    if (!fs.existsSync(dataFile)) {
        const h = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, h);
    }
};

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; background: #1a1a2f; color: white; padding: 20px; margin: 0; }
        .container { max-width: 400px; margin: auto; background: rgba(255,255,255,0.1); padding: 25px; border-radius: 20px; }
        h2 { text-align: center; color: #00c6ff; }
        input { width: 100%; padding: 12px; margin: 6px 0; border-radius: 8px; border: none; box-sizing: border-box; }
        button { width: 100%; padding: 15px; background: #2ecc71; color: white; border: none; border-radius: 10px; font-weight: bold; margin-top: 15px; cursor: pointer; }
        .menu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .btn-nav { text-align: center; color: #fff; text-decoration: none; font-size: 12px; background: #444; padding: 10px; border-radius: 8px; }
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
            <input type="text" name="tahunTerbit" placeholder="Tahun Terbit">
            <input type="text" name="kurikulum" placeholder="Kurikulum">
            <button type="submit">SIMPAN DATA</button>
        </form>
        <div class="menu-grid">
            <a href="/cek-data" class="btn-nav">📋 LIHAT DATA</a>
            <a href="/cari" class="btn-nav">🔍 CARI DATA</a>
        </div>
    </div>
</body>
</html>`);
});

app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiFile();
    const lines = fs.readFileSync(dataFile, 'utf8').split('\n');
    const header = lines.slice(0, 2).join('\n');
    const matches = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
    let hasil = matches.length > 0 ? header + "\n" + matches.join('\n') : "Data tidak ditemukan.";
    res.send(`<body style="background:#1a1a2f; color:white; padding:20px;"><div style="max-width:400px; margin:auto;"><h2 style="color:#00c6ff;">🔍 CARI</h2><form action="/cari" method="GET"><input type="text" name="q" placeholder="Cari..." style="width:100%; padding:10px;"><button style="width:100%; background:#00c6ff; border:none; padding:10px; color:white; margin-top:5px;">CARI</button></form><pre style="background:#000; color:#00ff00; padding:10px; margin-top:20px; font-size:9px; overflow:auto;">${hasil}</pre><a href="/" style="display:block; text-align:center; color:#aaa; margin-top:20px;">⬅ KEMBALI</a></div></body>`);
});

app.get('/cek-data', (req, res) => {
    inisialisasiFile();
    const log = fs.readFileSync(dataFile, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px;"><pre style="font-size:9px;">${log}</pre><hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">⬅ KEMBALI</a></body>`);
});

app.post('/tambah', (req, res) => {
    inisialisasiFile();
    const d = req.body;
    const baris = (d.namaPeminjam || '').toUpperCase().padEnd(14) + " | " + (d.judulBuku || '').toUpperCase().padEnd(20) + " | " + (d.nomorBuku || '').padEnd(10) + " | " + (d.idBuku || '').padEnd(7) + " | " + (d.penerbit || '').toUpperCase().padEnd(10) + " | " + (d.tahunTerbit || '').padEnd(9) + " | " + (d.kurikulum || '').toUpperCase() + "\n";
    fs.appendFileSync(dataFile, baris);
    res.redirect('/cek-data');
});

app.listen(port, "0.0.0.0", () => {
    console.log(`\x1b[36m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\x1b[0m`);
    console.log(`\x1b[36m┃\x1b[0m  \x1b[32m✨ SERVER AZRIL PERPUS AKTIF ✨\x1b[0m                      \x1b[36m┃\x1b[0m`);
    console.log(`\x1b[36m┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m`);
});
