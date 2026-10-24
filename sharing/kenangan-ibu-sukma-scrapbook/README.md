# Album Kenangan untuk Ibu Sukma

Website scrapbook kenangan berbasis HTML, CSS, dan JavaScript. Tidak perlu database atau framework.

## Menjalankan
- Ekstrak ZIP.
- Buka `index.html` di Chrome/Edge, atau buka folder di VS Code dan jalankan dengan Live Server.
- Koneksi internet diperlukan untuk memuat font Google; tanpa internet website tetap berfungsi dengan font cadangan.

## Masukkan foto dan video asli
Letakkan file berikut pada folder dan nama yang persis sama:
- Foto Ibu: `assets/foto-ibu-sukma.jpg`
- Video kenangan: `assets/video/kenangan-ibu-sukma.mp4`
- Foto angkatan: `assets/foto-angkatan/angkatan-01.jpg` sampai `angkatan-04.jpg`

Foto dan video belum disertakan karena belum diberikan. Jika nama file berbeda, sesuaikan atribut `src` di `index.html`.

## Menambah foto angkatan
Salin salah satu blok `<article class="album-card ...">` di bagian galeri, kemudian ubah teks dan nama file fotonya.

## Mengubah tulisan
Buka `index.html`. Nama sekolah dan tahun angkatan sengaja belum dicantumkan karena informasinya belum tersedia.

## Publikasi
Website dapat diunggah ke hosting statis seperti GitHub Pages atau Netlify. Sebelum dibagikan, pastikan semua orang dalam foto/video setuju dokumentasinya digunakan.
