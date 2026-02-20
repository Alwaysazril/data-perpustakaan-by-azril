const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Path file database
const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Inisialisasi file agar rapi
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// --- HALAMAN UTAMA (Gabungan HTML + CSS Anda) ---
app.get('/', (req, res) => {
    inisialisasiData();
    const currentData = fs.readFileSync(dataFile, 'utf8');
    res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perpus Online Azril</title>
    <style>
        body { font-family: sans-serif; background: #2c3e50; color: white; padding: 15px; margin: 0; }
        .container { max-width: 600px; margin: auto; }
        .input-group { background: #34495e; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        input { width: 93%; padding: 12px; margin: 8px 0; border-radius: 6px; border: none; background: #ecf0f1; font-size: 14px; }
        button { width: 100%; padding: 12px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 16px; margin-top: 10px; }
        .db-box { background: #1e1e1e; padding: 15px; border-radius: 8px; overflow-x: auto; margin-top: 20px; border: 1px solid #444; }
        pre { color: #00ff00; font-family: 'Courier New', monospace; font-size: 11px; margin: 0; white-space: pre; }
        .nav-link { display: inline-block; margin-top: 15px; color: #3498db; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h3>📒 Form Input Perpus</h3>
        <div class="input-group">
            <form action="/pinjam" method="POST">
                <input type="text" name="nama" placeholder="Nama Peminjam" required>
                <input type="text" name="buku" placeholder="Judul Buku" required>
                <input type="text" name="no_buku" placeholder="Nomor Buku">
                <input type="text" name="id_buku" placeholder="ID Buku">
                <input type="text" name="penerbit" placeholder="Penerbit">
                <input type="text" name="tahun" placeholder="Tahun Terbit">
                <input type="text" name="kurikulum" placeholder="Kurikulum">
                <button type="submit">💾 SIMPAN DATA LENGKAP</button>
            </form>
            <a href="/cari-halaman" class="nav-link">🔍 Cari Data</a> | 
            <a href="/cek-data" class="nav-link">📋 Cek Full Data</a>
        </div>

        <h3>📋 Laporan Database:</h3>
        <div class="db-box">
            <pre>${currentData}</pre>
        </div>
    </div>
</body>
</html>`);
});

// --- FITUR TAMBAH DATA ---
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    
    // Format agar kolom lurus (Padding)
    const nama = (d.nama || '').toUpperCase().substring(0, 14).padEnd(14);
    const buku = (d.buku || '').toUpperCase().substring(0, 20).padEnd(20);
    const no   = (d.no_buku || '').substring(0, 10).padEnd(10);
    const id   = (d.id_buku || '').substring(0, 7).padEnd(7);
    const pen  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const thn  = (d.tahun || '').substring(0, 9).padEnd(9);
    const kur  = (d.kurikulum || '').toUpperCase();

    const baris = `${nama} | ${buku} | ${no} | ${id} | ${pen} | ${thn} | ${kur}\n`;
    
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

// --- FITUR CARI DATA ---
app.get('/cari-halaman', (req, res) => {
    res.send(`
    <body style="background:#1a1a2f; color:white; font-family:sans-serif; padding:20px; text-align:center;">
        <h2>🔍 Cari Data Peminjam</h2>
        <form action="/cari-proses" method="GET">
            <input type="text" name="q" placeholder="Masukkan nama..." style="padding:10px; width:250px;">
            <button style="padding:10px; background:#3498db; color:white; border:none;">Cari</button>
        </form>
        <br><a href="/" style="color:white;">Kembali</a>
    </body>`);
});

app.get('/cari-proses', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
    
    const output = results.length > 0 ? header + "\n" + results.join('\n') : "Data tidak ditemukan.";
    res.send(`<body style="background:#000; color:#00ff00; padding:20px;"><pre>${output}</pre><hr><a href="/" style="color:white;">Kembali</a></body>`);
});

// --- FITUR CEK DATA FULL ---
app.get('/cek-data', (req, res) => {
    const log = fs.readFileSync(dataFile, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre style="font-size:10px;">${log}</pre><hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">🔙 KEMBALI</a></body>`);
});

app.listen(port, "0.0.0.0", () => {
    console.log("Aplikasi Perpus Azril Aktif!");
});
