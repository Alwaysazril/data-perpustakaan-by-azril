const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    let isiFile = "Belum ada data tersimpan.";
    if (fs.existsSync('data_peminjaman.txt')) {
        isiFile = fs.readFileSync('data_peminjaman.txt', 'utf8');
    }

    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Azril Perpus Panel</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1a1a2f, #2d1d44); color: white; padding: 20px; margin: 0; }
        .container { max-width: 500px; margin: auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
        h2 { text-align: center; background: linear-gradient(to right, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        label { font-size: 12px; color: #aaa; margin-left: 5px; display: block; margin-top: 10px; }
        input { width: 100%; padding: 12px; margin: 5px 0; border-radius: 10px; border: none; background: rgba(255,255,255,0.05); color: white; box-sizing: border-box; }
        button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: linear-gradient(to right, #2ecc71, #27ae60); color: white; font-weight: bold; cursor: pointer; margin-top: 20px; }
        
        /* CSS KHUSUS AGAR TABEL TETAP LURUS */
        .data-box { 
            margin-top: 25px; 
            background: rgba(0,0,0,0.5); 
            color: #0f0; 
            padding: 15px; 
            border-radius: 10px; 
            border: 1px solid #444;
            overflow-x: auto; /* Bisa geser samping kalau layar sempit */
        }
        pre {
            margin: 0;
            font-family: 'Courier New', Courier, monospace; /* Wajib font ini agar kolom lurus */
            font-size: 11px;
            white-space: pre; /* Mencegah teks turun ke bawah */
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>📚 INPUT DATA PEMINJAMAN BUKU</h2>
        <form action="/tambah" method="POST">
            <input type="text" name="namaPeminjam" placeholder="Nama Peminjam" required>
            <input type="text" name="judulBuku" placeholder="Judul Buku" required>
            <input type="text" name="nomorBuku" placeholder="No. Buku">
            <input type="text" name="idBuku" placeholder="ID Buku">
            <input type="text" name="penerbit" placeholder="Penerbit">
            <input type="text" name="tahunTerbit" placeholder="Tahun">
            <input type="text" name="kurikulum" placeholder="Kurikulum">
            <button type="submit">💾 SIMPAN DATA KE TABEL</button>
        </form>
        <h3 style="font-size:14px; margin-top:20px;">📋 Laporan Database:</h3>
        <div class="data-box">
            <pre>${isiFile}</pre>
        </div>
    </div>
</body>
</html>
    `);
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    
    // Header tabel jika file baru dibuat (Otomatis)
    if (!fs.existsSync('data_peminjaman.txt') || fs.readFileSync('data_peminjaman.txt').length === 0) {
        const header = "PEMINJAM     | JUDUL BUKU      | NO. BUKU | ID BUKU | PENERBIT   | TAHUN     | KURIKULUM\\n" +
                       "------------------------------------------------------------------------------------------\\n";
        fs.writeFileSync('data_peminjaman.txt', header);
    }

    // Mengatur lebar kolom agar rapi dan lurus
    const baris = \`\${d.namaPeminjam.padEnd(12)} | \${d.judulBuku.padEnd(15)} | \${(d.nomorBuku || '').padEnd(8)} | \${(d.idBuku || '').padEnd(7)} | \${(d.penerbit || '').padEnd(10)} | \${(d.tahunTerbit || '').padEnd(9)} | \${d.kurikulum || ''}\\n\`;
    
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/');
});

app.listen(port, () => {
    console.log("Server Running");
});
