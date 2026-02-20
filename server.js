const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Inisialisasi file agar tidak error saat dibaca pertama kali
const inisialisasiData = () => {
    try {
        if (!fs.existsSync(dataFile)) {
            const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                           "----------------------------------------------------------------------------------------------------\n";
            fs.writeFileSync(dataFile, header, 'utf8');
        }
    } catch (err) {
        console.error("Gagal inisialisasi file:", err.message);
    }
};

// HALAMAN UTAMA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// FITUR AMBIL DATA
app.get('/data', (req, res) => {
    try {
        inisialisasiData();
        if (fs.existsSync(dataFile)) {
            const content = fs.readFileSync(dataFile, 'utf8');
            res.send(content);
        } else {
            res.send("Database belum siap.");
        }
    } catch (err) {
        res.status(500).send("Error membaca database: " + err.message);
    }
});

// FITUR SIMPAN (Dengan penanganan error agar tidak CRASH)
app.post('/pinjam', (req, res) => {
    try {
        inisialisasiData();
        const d = req.body;
        
        [span_1](start_span)// Formatting data (tetap mempertahankan logika lama Anda)[span_1](end_span)
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
    } catch (err) {
        console.error("Gagal simpan data:", err.message);
        res.status(500).send("Gagal menyimpan data. Pastikan izin akses file tersedia.");
    }
});

// FITUR CARI
app.get('/cari', (req, res) => {
    try {
        const query = (req.query.q || '').toUpperCase();
        inisialisasiData();
        const content = fs.readFileSync(dataFile, 'utf8');
        const lines = content.split('\n');
        const header = lines.slice(0, 2).join('\n');
        const results = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
        const hasil = results.length > 0 ? header + "\n" + results.join('\n') : "Data tidak ditemukan.";
        
        res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:20px; font-family:monospace;">
            <h3>Hasil Pencarian: "${query}"</h3>
            <pre>${hasil}</pre>
            <hr><a href="/" style="color:white;">Kembali</a>
        </body>`);
    } catch (err) {
        res.status(500).send("Error saat mencari data.");
    }
});

// FITUR CEK DATA FULL
app.get('/cek-data', (req, res) => {
    try {
        inisialisasiData();
        const log = fs.readFileSync(dataFile, 'utf8');
        res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre>${log}</pre><hr><a href="/" style="color:white;">Kembali</a></body>`);
    } catch (err) {
        res.status(500).send("Gagal memuat log.");
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server Aktif di port ${port}`);
});
