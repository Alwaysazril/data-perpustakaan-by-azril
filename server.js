const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

[span_1](start_span)// Path file data[span_1](end_span)
const dataFile = path.resolve(__dirname, 'data_peminjaman.txt');

[span_2](start_span)// Fungsi inisialisasi dengan lebar kolom yang konsisten[span_2](end_span)
const inisialisasiData = () => {
    if (!fs.existsSync(dataFile)) {
        const header = "PEMINJAM       | JUDUL BUKU           | NO. BUKU   | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\n" +
                       "----------------------------------------------------------------------------------------------------\n";
        fs.writeFileSync(dataFile, header, 'utf8');
    }
};

[span_3](start_span)// --- HALAMAN UTAMA ---[span_3](end_span)
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
            <a href="/cek-data" class="btn-nav">📄 LIHAT DATA</a>
            <a href="/cari" class="btn-nav">🔍 CARI DATA</a>
        </div>
    </div>
</body>
</html>`);
});

[span_4](start_span)// --- FITUR CARI ---[span_4](end_span)
app.get('/cari', (req, res) => {
    const query = (req.query.q || '').toUpperCase();
    inisialisasiData();
    const content = fs.readFileSync(dataFile, 'utf8');
    const lines = content.split('\n');
    const header = lines.slice(0, 2).join('\n');
    const filtered = lines.slice(2).filter(line => line.includes(query) && line.trim() !== "");
    
    let hasil = filtered.length > 0 ? header + "\n" + filtered.join('\n') : "Data tidak ditemukan.";
    
    res.send(`
    <body style="background:#1a1a2f; color:white; font-family:sans-serif; padding:20px;">
        <div style="max-width:400px; margin:auto;">
            <h2 style="color:#00c6ff;">🔍 HASIL CARI</h2>
            <form action="/cari" method="GET">
                <input type="text" name="q" placeholder="Cari..." style="width:100%; padding:10px; margin-bottom:10px;">
                <button style="width:100%; padding:10px; background:#00c6ff; border:none; color:white;">CARI</button>
            </form>
            <pre style="background:#000; color:#00ff00; padding:10px; font-size:9px; overflow:auto; margin-top:20px;">${hasil}</pre>
            <a href="/" style="display:block; text-align:center; margin-top:20px; color:#aaa;">🔙 KEMBALI</a>
        </div>
    </body>`);
});

[span_5](start_span)// --- CEK DATA ---[span_5](end_span)
app.get('/cek-data', (req, res) => {
    inisialisasiData();
    const log = fs.readFileSync(dataFile, 'utf8');
    res.send(`<body style="background:#1a1a2f; color:#00ff00; padding:15px; font-family:monospace;"><pre style="font-size:9px;">${log}</pre><hr><a href="/" style="color:white; text-decoration:none; background:#444; padding:10px; border-radius:5px;">🔙 KEMBALI</a></body>`);
});

[span_6](start_span)// --- TAMBAH DATA (Perbaikan Baris Rapi) ---[span_6](end_span)
app.post('/tambah', (req, res) => {
    inisialisasiData();
    const d = req.body;

    // Menentukan lebar tetap untuk setiap kolom (Padding)
    const nama      = (d.namaPeminjam || '').toUpperCase().substring(0, 14).padEnd(14);
    const judul     = (d.judulBuku || '').toUpperCase().substring(0, 20).padEnd(20);
    const noBuku    = (d.nomorBuku || '').substring(0, 10).padEnd(10);
    const idBuku    = (d.idBuku || '').substring(0, 7).padEnd(7);
    const penerbit  = (d.penerbit || '').toUpperCase().substring(0, 10).padEnd(10);
    const tahun     = (d.tahunTerbit || '').substring(0, 9).padEnd(9);
    const kurikulum = (d.kurikulum || '').toUpperCase();

    // Menggabungkan data dengan pemisah pipa (|) agar sejajar secara vertikal
    const baris = `${nama} | ${judul} | ${noBuku} | ${idBuku} | ${penerbit} | ${tahun} | ${kurikulum}\n`;

    fs.appendFileSync(dataFile, baris);
    res.redirect('/cek-data');
});

[span_7](start_span)// Jalankan Server[span_7](end_span)
app.listen(port, "0.0.0.0", () => {
    console.log("================================");
    console.log("SERVER AZRIL PERPUS ACTIVE");
    console.log("PORT: " + port);
    console.log("================================");
});
