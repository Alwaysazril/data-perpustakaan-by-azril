const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// Path database yang aman untuk Railway
const dataFile = path.join(__dirname, 'data_peminjaman.txt');

// Inisialisasi Database
const inisialisasi = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// TAMPILAN UTAMA (HTML disatukan agar tidak error path)
app.get('/', (req, res) => {
    inisialisasi();
    const isiData = fs.readFileSync(dataFile, 'utf8');
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Perpus Azril</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Courier New', monospace; background: #1a1a2f; color: white; padding: 20px; }
        .card { background: #252545; padding: 20px; border-radius: 15px; max-width: 800px; margin: auto; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        input { width: 100%; padding: 10px; margin: 5px 0; border-radius: 5px; border: none; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px; }
        .db-box { background: #000; padding: 15px; border-radius: 10px; overflow-x: auto; white-space: pre; color: #00ff00; font-size: 12px; border: 1px solid #444; margin-top: 20px; }
        h2 { text-align: center; color: #00c6ff; }
    </style>
</head>
<body>
    <div class="card">
        <h2>📚 INPUT DATA PERPUS</h2>
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
        <div class="db-box">${isiData}</div>
    </div>
</body>
</html>`);
});

// LOGIKA SIMPAN
app.post('/pinjam', (req, res) => {
    const d = req.body;
    const nama = (d.nama || '').toUpperCase().substring(0, 14).padEnd(14);
    const buku = (d.buku || '').toUpperCase().substring(0, 20).padEnd(20);
    const no   = (d.no_buku || '').substring(0, 10).padEnd(10);
    const id   = (d.id_buku || '').substring(0, 7).padEnd(7);
    const pen  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const thn  = (d.tahun || '').substring(0, 9).padEnd(9);
    const kur  = (d.kurikulum || '').toUpperCase();

    const baris = \`\${nama} | \${buku} | \${no} | \${id} | \${pen} | \${thn} | \${kur}\\n\`;
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

app.listen(port, "0.0.0.0", () => console.log("Online!"));
