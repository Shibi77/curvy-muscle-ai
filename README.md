# Curvy Muscle AI — OpenAI + Vercel

Web app untuk mengedit foto menjadi physique yang lebih curvy dan muscular dengan tetap mempertahankan identitas dan konteks foto.

## Setup lokal

1. Install Node.js 20+.
2. `npm install`
3. Salin `.env.example` menjadi `.env.local`.
4. Isi `OPENAI_API_KEY`.
5. Jalankan `npm run dev`.

## Deploy ke Vercel

Import repository/folder ini ke Vercel, lalu tambahkan environment variable:

`OPENAI_API_KEY=...`

Jangan menaruh API key di kode frontend.

## Catatan

Aplikasi memakai `gpt-image-2` melalui OpenAI Images API. API usage dan billing mengikuti akun/project OpenAI yang memiliki API key.
