const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

// Fungsi Inisialisasi: Membuat header otomatis jika file tidak ada
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// 1. LIHAT DATA (Halaman Utama)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. AMBIL DATA (Untuk ditampilkan di box hijau bawah)
app.get('/data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(content);
});

// 3. SIMPAN DATA
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
    
    // Logika pemotongan karakter (Padding) persis seperti video Anda
    const fmt = (val, len) => (val || '').toUpperCase().substring(0, len).padEnd(len);

    const baris = `${fmt(d.nama, 14)} | ${fmt(d.buku, 20)} | ${fmt(d.no_buku, 10)} | ${fmt(d.id_buku, 7)} | ${fmt(d.penerbit, 10)} | ${fmt(d.tahun, 9)} | ${fmt(d.kurikulum, 10)}\n`;
    
    fs.appendFileSync(dataFile, baris);
    res.redirect('/');
});

// 4. CARI DATA (Fitur yang sebelumnya error)
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    
    // Header untuk tampilan hasil pencarian
    const headerTabel = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n----------------------------------------------------------------------------------------------------\n";
    
    // Mencari kata kunci di setiap baris yang mengandung karakter '|' (baris data)
    const results = lines.filter(l => l.includes('|') && l.toUpperCase().includes(query));
    
    const hasilFinal = results.length > 0 ? headerTabel + results.join('\n') : "Data tidak ditemukan untuk kata kunci: " + query;

    res.send(`
        <body style="background:#1a1a2f; color:white; font-family:sans-serif; padding:20px; display:flex; justify-content:center;">
            <div style="width:100%; max-width:500px; text-align:center;">
                <h2 style="color:#00d4ff;">🔍 HASIL PENCARIAN</h2>
                <div style="background:#000; padding:15px; border-radius:10px; text-align:left; overflow-x:auto; border:1px solid #333;">
                    <pre style="color:#00ff00; font-family:monospace; font-size:11px; margin:0;">${hasilFinal}</pre>
                </div>
                <br>
                <a href="/" style="color:#00d4ff; text-decoration:none; font-weight:bold;">[ KEMBALI KE INPUT ]</a>
            </div>
        </body>
    `);
});

app.listen(port, "0.0.0.0", () => console.log("Server Berjalan..."));
