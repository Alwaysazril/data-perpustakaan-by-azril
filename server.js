const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Fungsi penyelarasan kolom agar lurus
const pad = (str, len) => {
    let s = (str || "").toString().toUpperCase();
    if (s.length > len) return s.substring(0, len);
    return s + " ".repeat(len - s.length);
};

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile) || fs.readFileSync(dataFile, 'utf8').trim() === "") {
        const h = pad("PEMINJAM", 15) + " | " + pad("JUDUL BUKU", 20) + " | " + pad("NO. BUKU", 12) + " | " + pad("ID BUKU", 8) + " | " + pad("PENERBIT", 12) + " | " + pad("TAHUN", 10) + " | " + "KURIKULUM\n";
        const l = "-".repeat(105) + "\n";
        fs.writeFileSync(dataFile, h + l, 'utf8');
    }
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/halaman-cari', (req, res) => res.sendFile(path.join(__dirname, 'cari.html')));

// ROUTE LIHAT DATA DENGAN TOMBOL KEMBALI
app.get('/cek-data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { background: #1a1a2f; color: #00ff00; font-family: 'Courier New', monospace; padding: 20px; margin: 0; }
                .btn-back { display: inline-block; background: #3d3d5c; color: white; padding: 8px 15px; text-decoration: none; 
                            border-radius: 5px; font-family: sans-serif; font-weight: bold; font-size: 12px; margin-bottom: 15px; border: 1px solid #555; }
                pre { background: #000; padding: 15px; border-radius: 10px; border: 1px solid #333; overflow-x: auto; white-space: pre; line-height: 1.5; font-size: 11px; }
            </style>
        </head>
        <body>
            <a href="/" class="btn-back">← KEMBALI</a>
            <pre>${content}</pre>
        </body>
        </html>
    `);
});

// Digunakan oleh index.html untuk preview di bawah form
app.get('/data-raw', (req, res) => {
    inisialisasiData();
    res.setHeader('Content-Type', 'text/plain');
    res.send(fs.readFileSync(dataFile, 'utf8'));
});

app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    const baris = pad(d.nama, 15) + " | " + pad(d.buku, 20) + " | " + pad(d.no_buku, 12) + " | " + pad(d.id_buku, 8) + " | " + pad(d.penerbit, 12) + " | " + pad(d.tahun, 10) + " | " + (d.kurikulum || "").toUpperCase() + "\n";
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

app.get('/cari', (req, res) => {
    const q = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const lines = fs.readFileSync(dataFile, 'utf8').split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.filter(l => l.includes('|') && l.toUpperCase().includes(q) && !l.includes('PEMINJAM'));
    const hasil = results.length > 0 ? header + "\n" + results.join('\n') : "DATA TIDAK DITEMUKAN.";

    res.send(`
        <body style="background:#1a1a2f; color:white; font-family:sans-serif; display:flex; justify-content:center; padding:20px;">
            <div style="width:100%; max-width:900px; text-align:center;">
                <h2 style="color:#00d4ff;">🔍 HASIL PENCARIAN</h2>
                <div style="background:#000; padding:15px; border-radius:10px; border:1px solid #333; overflow-x:auto; text-align:left;">
                    <pre style="color:#00ff00; font-family:'Courier New', monospace; font-size:12px; margin:0; white-space:pre;">${hasil}</pre>
                </div>
                <br><a href="/" style="color:#aaa; text-decoration:none; font-weight:bold;">← KEMBALI</a>
            </div>
        </body>
    `);
});

app.listen(port, "0.0.0.0", () => console.log("Server Running..."));
