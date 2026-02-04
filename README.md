# CHALLENGE LOGIN PAGE IQMAL DZAKY YUSWANDA

# CARA MENJALANKAN PROJECT
1. pastikan kode program sudah sesuai, tidak error, dan database telah dibuat
2. buka XAMPP, lalu nyalakan Apache dan MySQL
3. jalankan pnpm run dev pada terminal VSCODE
4. salin link localhost:3000 yang muncul setelah anda menjalankan perintah sebelumnya
5. halaman login akan muncul (dilengkapi fitur dark mode toggle, animasi loading, validasi form, dan rate limit login)
6. masukkan username/email (iqmaldz@gmail.com) dan password (iqmaldz123)
7. register dahulu jika belum punya akun
8. setelah login, anda akan diarahkan ke halaman dashboard
9. klik logout.
*tambahan: anda bisa cek rate limit login pada bagian Inspect-Network-fetch/XHR (ditandai status 429), atau ditandai dengan alert merah yang muncul diatas tanda sign in.  

# TECH STACK
Node.js, Next.js, React.js, MySQL, TailwindCSS

# ARSITEKTUR
|lib/
    |db.js
    |rateLimit.js
    |theme.js
|node_modules/
|pages/
    |api/
        |login.js
        |logout.js
        |me.js
        |register.js
    |_app.js
    |dashboard.js
    |index.js
    |login.js
    |register.js
|public/
    |images/
        |bg.jpg
        |btg.png
        |btgp.png
|scripts/
    |init_db.sql
|styles/
    |global.css
|.env.local
|.gitignore
|package-lock.json
|package.json
|postcss.config.js
|README.md
|tailwind.config.js