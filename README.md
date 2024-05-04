# e-Library
## Introduction (English)

Welcome to the ePerpustakaan website, a project created by Triple Trouble for the Back End Programming exam. This website serves as a eLibrary for providing reviews of books, and reviewers can sell the book to viewers (if they physically own it).

## Our Developers
- Jafier Andreas (535220013)
- Timothy Wahyudi Pakpahan (535220043)
- Richard Christian (535220018)

## Website Display:
Coming soon!

## Project Guide
To run the project u need to add .env file and add these following code:
1. MONGODB_URI = your_mongodb_uri
2. GOOGLECLIENTID = your_google_client_id
3. GOOGLECLIENTSECRET = your_google_client_secret

After adding that code, now u have to change callbackURL on auth.js to your callbackURL from your google dev

You can get:
1. Your mongodb uri from your database (website/compass)
2. Your google client id/secret from your google dev api & services credentials

Or if u want to run the porject without Login via Google feature, u can comment/delete these following code:
1. On authController.js comment/delete from line 122-179
2. On authRoutes.js comment/delete from line 20-24

From commenting/deleting those code will disabled feature Login via Google

Then type on terminal(make sure the direction is correct) "npm run start"

## Link Demo Program Video
(link)


## Pengantar (Indonesia)

Selamat datang di situs web e-Library, sebuah proyek yang dibuat oleh Triple Trouble untuk ujian Pemrograman Back End. Situs web ini berfungsi sebagai perpustakaan elektronik untuk memberikan ulasan tentang buku, dan para pengulas dapat menjual buku kepada penonton (jika mereka memiliki buku tersebut secara fisik).

## Pengembang Kami
- Jafier Andreas (535220013)
- Timothy Wahyudi Pakpahan (535220043)
- Richard Christian (535220018)

## Tampilan Situs Web


## Panduan Proyek
Untuk menjalankan proyek, Anda perlu menambahkan file .env dan menambahkan kode-kode berikut:

1. MONGODB_URI = uri_mongodb_anda
2. GOOGLECLIENTID = id_klien_google_anda
3. GOOGLECLIENTSECRET = rahasia_klien_google_anda
Setelah menambahkan kode tersebut, sekarang Anda harus mengubah callbackURL pada auth.js ke callbackURL Anda dari pengembang Google Anda

Anda dapat mendapatkan:
1. URI mongodb Anda dari database Anda (situs web/compass)
2. ID/rahasia klien Google Anda dari pengembang API & layanan Google Anda

Atau jika Anda ingin menjalankan proyek tanpa fitur Login melalui Google, Anda dapat mengomentari/menghapus kode-kode berikut:

1. Pada authController.js, komentari/hapus dari baris 122-179
2. Pada authRoutes.js, komentari/hapus dari baris 20-24
Dengan mengomentari/menghapus kode-kode tersebut akan menonaktifkan fitur Login melalui Google

Kemudian ketik di terminal (pastikan arahannya benar) "npm run start"

## Link Video Demo Program
(link)