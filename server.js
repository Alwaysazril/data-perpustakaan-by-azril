const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

// HALAMAN UTAMA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// HALAMAN KHUSUS CARI (Tampilan input putih + tombol biru)
app.get('/halaman-cari', (req, res) => {
    res.sendFile(path.join(__dirname, 'cari.html'));
});

// FITUR AMBIL DATA
app.get('/data', (req, res) => {
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    res.send(content);
});

// FITUR SIMPAN
app.post('/pinjam', (req, res) => {
    inisialisasiData();
    const d = req.body;
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

// FITUR PROSES CARI
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    const results = lines.slice(2).filter(l => l.includes(query) && l.trim() !== "");
    const hasil = results.length > 0 ? header + "\n" + results.join('\n') : "Data tidak ditemukan.";
    
    res.send(`
        <body style="background:#1a1a2f; color:white; font-family:sans-serif; padding:20px; display:flex; justify-content:center;">
            <div style="width:100%; max-width:400px; text-align:center;">
                <h2 style="color:#00d4ff;">🔍 CARI DATA</h2>
                <form action="/cari" method="GET">
                    <input type="text" name="q" value="${query}" style="width:100%; padding:12px; border-radius:8px; border:none; margin-bottom:10px;">
                    <button type="submit" style="width:100%; padding:12px; background:#00d4ff; color:white; border:none; border-radius:8px; font-weight:bold;">CARI SEKARANG</button>
                </form>
                <div style="margin-top:20px; background:#000; padding:10px; border-radius:10px; text-align:left; overflow-x:auto; border:1px solid #333;">
                    <pre style="color:#00ff00; font-family:monospace; font-size:10px; margin:0;">${hasil}</pre>
                </div>
                <a href="/" style="display:block; margin-top:20px; color:#aaa; text-decoration:none;">← KEMBALI</a>
            </div>
        </body>
    `);
});

app.listen(port, "0.0.0.0", () => console.log(`Server nyala di port ${port}`));
