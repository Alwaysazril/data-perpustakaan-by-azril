const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Fungsi pembantu agar kolom teks lurus sempurna
const formatBaris = (teks, lebar) => (teks || "").toString().toUpperCase().substring(0, lebar).padEnd(lebar);

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile) || fs.readFileSync(dataFile, 'utf8').trim() === "") {
        const header = formatBaris("PEMINJAM", 15) + " | " +
                       formatBaris("JUDUL BUKU", 20) + " | " +
                       formatBaris("NO. BUKU", 10) + " | " +
                       formatBaris("ID BUKU", 8) + " | " +
                       formatBaris("PENERBIT", 12) + " | " +
                       formatBaris("THN", 5) + " | " +
                       "KURIKULUM\n" +
                       "-".repeat(90) + "\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/halaman-cari', (req, res) => res.sendFile(path.join(__dirname, 'cari.html')));

app.get('/data', (req, res) => {
    inisialisasiData();
    res.send(fs.readFileSync(dataFile, 'utf8'));
});

app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    const baris = formatBaris(d.nama, 15) + " | " +
                  formatBaris(d.buku, 20) + " | " +
                  formatBaris(d.no_buku, 10) + " | " +
                  formatBaris(d.id_buku, 8) + " | " +
                  formatBaris(d.penerbit, 12) + " | " +
                  formatBaris(d.tahun, 5) + " | " +
                  (d.kurikulum || "").toUpperCase() + "\n";
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const lines = fs.readFileSync(dataFile, 'utf8').split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.filter(l => l.includes('|') && l.toUpperCase().includes(query) && !l.includes('PEMINJAM'));
    const hasilFinal = results.length > 0 ? header + "\n" + results.join('\n') : "Data tidak ditemukan.";

    res.send(`
        <body style="background:#1a1a2f; color:white; font-family:sans-serif; padding:20px; display:flex; justify-content:center;">
            <div style="width:100%; max-width:800px; text-align:center;">
                <h2 style="color:#00d4ff;">🔍 HASIL PENCARIAN</h2>
                <div style="background:#000; padding:15px; border-radius:10px; text-align:left; overflow-x:auto; border:1px solid #333;">
                    <pre style="color:#00ff00; font-family:'Courier New', monospace; font-size:12px; margin:0; white-space:pre;">${hasilFinal}</pre>
                </div>
                <br><a href="/" style="color:#00d4ff; text-decoration:none; font-weight:bold;">[ KEMBALI KE BERANDA ]</a>
            </div>
        </body>
    `);
});

app.listen(port, "0.0.0.0", () => console.log("Server Aktif!"));
