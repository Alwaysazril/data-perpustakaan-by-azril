const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Inisialisasi Header Tabel
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// --- TAMPILAN UTAMA (Gabungan HTML + CSS) ---
app.get('/', (req, res) => {
    inisialisasiData();
    const isiData = fs.readFileSync(dataFile, 'utf8');
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Perpus Azril</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Courier New', monospace; background: #1a1a2f; color: white; padding: 20px; }
        .container { max-width: 900px; margin: auto; }
        .card { background: #252545; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        input { width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .db-box { background: #000; padding: 15px; border-radius: 10px; overflow-x: auto; white-space: pre; color: #00ff00; font-size: 12px; border: 1px solid #444; }
        h2 { text-align: center; color: #00c6ff; }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 SISTEM DATA PERPUS</h2>
        
        <div class="card">
            <form action="/pinjam" method="POST">
                <input type="text" name="nama" placeholder="Nama Peminjam" required>
                <input type="text" name="buku" placeholder="Judul Buku" required>
                <input type="text" name="no_buku" placeholder="Nomor Buku">
                <input type="text" name="id_buku" placeholder="ID Buku">
                <input type="text" name="penerbit" placeholder="Penerbit">
                <input type="text" name="tahun" placeholder="Tahun Terbit">
                <input type="text" name="kurikulum" placeholder="Kurikulum">
                <button type="submit">SIMPAN DATA</button>
            </form>
        </div>

        <h3>📋 LAPORAN DATABASE</h3>
        <div class="db-box">${isiData}</div>
    </div>
</body>
</html>`);
});

// --- LOGIKA SIMPAN DATA (DENGAN PADDING RAPI) ---
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;

    // Proses merapikan kolom
    const nama      = (d.nama || '').toUpperCase().substring(0, 14).padEnd(14);
    const judul     = (d.buku || '').toUpperCase().substring(0, 20).padEnd(20);
    const noBuku    = (d.no_buku || '').substring(0, 10).padEnd(10);
    const idBuku    = (d.id_buku || '').substring(0, 7).padEnd(7);
    const penerbit  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const tahun     = (d.tahun || '').substring(0, 9).padEnd(9);
    const kurikulum = (d.kurikulum || '').toUpperCase();

    const baris = `${nama} | ${judul} | ${noBuku} | ${idBuku} | ${penerbit} | ${tahun} | ${kurikulum}\n`;

    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Berjalan di Port " + port);
});
