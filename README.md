# Petualangan Robot Hijaiyah

Game belajar 29 huruf hijaiyah dengan 6 level harakat, pilihan robot, latihan, dan suara pelafalan.

## Persiapan

- Node.js 22 (disarankan)
- npm yang sudah terpasang bersama Node.js

## Menjalankan di komputer

```bash
npm ci
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di terminal.

## Build untuk hosting

```bash
npm ci
npm run build
npm run preview
```

Hasil build berada di folder `dist/`. Aplikasi dikonfigurasi menjadi satu file HTML: gambar latar, robot, CSS, dan JavaScript ditanam ke hasil build. Karena itu, aset visual tidak membutuhkan folder gambar terpisah saat dihosting.

## Hosting otomatis di GitHub Pages

1. Buat repository baru di GitHub.
2. Ekstrak ZIP ini, lalu unggah seluruh isi folder proyek ke repository (bukan file ZIP-nya). Pastikan `package.json`, `package-lock.json`, `index.html`, `src/`, dan terutama folder tersembunyi `.github/workflows/` ikut terunggah. GitHub Desktop atau Git lebih aman untuk memastikan folder tersembunyi ikut terkirim.
3. Pastikan nama branch utama adalah `main`. Workflow `.github/workflows/deploy.yml` akan memasang dependency, membangun aplikasi, dan deploy setiap kali ada push ke branch `main`. Pemeriksaan tipe opsional dapat dijalankan dengan `npm run typecheck`.
4. Di repository GitHub, buka **Settings → Pages**. Pada bagian **Build and deployment**, pilih **GitHub Actions** sebagai Source.
5. Buka tab **Actions** dan tunggu workflow **Deploy to GitHub Pages** selesai dengan status berhasil. Alamat situs akan tampil pada **Settings → Pages**.

Setelah konfigurasi awal, setiap perubahan yang di-push ke branch `main` akan dipublikasikan otomatis.

## Catatan aset

- Semua aset gambar runtime berada di `src/assets/` dan diimpor menggunakan `?inline`.
- Nama file impor disimpan dengan huruf kecil dan harus sama persis dengan nama file di folder aset (GitHub Pages berjalan pada server yang membedakan huruf besar dan kecil).
- Tidak ada gambar runtime yang dipanggil dari URL pihak ketiga.
- Font Arab untuk tampilan game tertanam di `src/index.css`; saat mengunduh SVG dari Kamus Hijaiyah, aplikasi menyalin deklarasi font lokal yang sama ke dalam file SVG. Font judul Baloo 2 bersifat opsional dan dimuat dari Google Fonts, dengan font sistem sebagai fallback.
- Progress permainan disimpan di penyimpanan lokal browser perangkat yang digunakan.
