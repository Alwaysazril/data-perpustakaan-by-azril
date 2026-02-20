const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

// Warna untuk animasi di Termux
const rainbow = ["\x1b[31m", "\x1b[33m", "\x1b[32m", "\x1b[36m", "\x1b[34m", "\x1b[35m"];
const reset = "\x1b[0m";
const bold = "\x1b[1m";

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
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1e1e2f, #2d2d44); color: white; min-height: 100vh; padding: 15px; margin: 0; }
                .container { max-width: 500px; margin: auto; background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                h2 { text-align: center; background: linear-gradient(to right, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
                label { font-size: 12px; color: #aaa; margin-left: 5px; }
                input { width: 100%; padding: 12px; margin: 5px 0 15px 0; border-radius: 10px; border: none; background: rgba(255,255,255,0.2); color: white; box-sizing: border-box; }
                button { width: 100%; padding: 15px; border-radius: 10px; border: none; background: linear-gradient(to right, #28a745, #218838); color: white; font-weight: bold; cursor: pointer; font-size: 16px; box-shadow: 0 4px 15px rgba(40,167,69,0.3); }
                .data-box { margin-top: 25px; background: rgba(0,0,0,0.5); color: #0f0; padding: 15px; border-radius: 10px; font-family: monospace; font-size: 10px; overflow-x: auto; white-space: pre; border: 1px solid #444; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>📚 INPUT DATA PEMINJAMAN BUKU</h2>
                <form action="/tambah" method="POST">
                    <label>Nama Peminjam</label>
                    <input type="text" name="namaPeminjam" required>
                    
                    <label>Judul Buku</label>
                    <input type="text" name="judulBuku" required>
                    
                    <label>Nomor Buku</label>
                    <input type="text" name="nomorBuku">
                    
                    <label>ID Buku</label>
                    <input type="text" name="idBuku">
                    
                    <label>Penerbit</label>
                    <input type="text" name="penerbit">
                    
                    <label>Tahun Terbit</label>
                    <input type="text" name="tahunTerbit">
                    
                    <label>Kurikulum</label>
                    <input type="text" name="kurikulum">
                    
                    <button type="submit">💾 SIMPAN DATA LENGKAP</button>
                </form>
                <h3 style="font-size:14px; margin-top:20px;">📋 Laporan Database:</h3>
                <div class="data-box">${isiFile}</div>
            </div>
        </body>
        </html>
    `);
});

app.post('/tambah', (req, res) => {
    const d = req.body;
    // Mempertahankan struktur data lengkap dari perpus.ts
    const baris = `${d.namaPeminjam.padEnd(12)} | ${d.judulBuku.padEnd(15)} | ${d.nomorBuku.padEnd(6)} | ${d.idBuku.padEnd(6)} | ${d.penerbit.padEnd(10)} | ${d.tahunTerbit.padEnd(6)} | ${d.kurikulum}\n`;
    
    fs.appendFileSync('data_peminjaman.txt', baris);
    res.redirect('/');
});

app.listen(port, () => {
    let i = 0;
    setInterval(() => {
        const color = rainbow[i % rainbow.length];
        // Animasi pesan server di Termux
        process.stdout.write(`\r${bold}${color}✅ BERHASIL ALWAYS AZRIL SERVER IS RUNNING 🚀 | LINK: http://localhost:${port}${reset}`);
        i++;
    }, 200);
});
