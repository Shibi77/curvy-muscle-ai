"use client";

import { useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function choose(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return setError("Pilih file gambar JPG, PNG, WEBP, atau HEIC.");
    if (f.size > 15 * 1024 * 1024) return setError("Ukuran foto maksimal 15 MB.");
    setError("");
    setFile(f);
    setResult("");
    setPreview(URL.createObjectURL(f));
  }

  async function generate() {
    if (!file) return;
    setBusy(true);
    setError("");
    setResult("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/edit", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memproses foto.");
      setResult(`data:${data.mime};base64,${data.image}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="badge">OPENAI IMAGE EDITOR</div>
        <h1>Curvy Muscle <span>AI</span></h1>
        <p>Ubah bentuk tubuh menjadi lebih curvy dan berotot dengan hasil yang tetap realistis.</p>
      </section>

      <section className="card">
        <div
          className="drop"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); choose(e.dataTransfer.files?.[0]); }}
        >
          <input ref={inputRef} type="file" accept="image/*" hidden
            onChange={(e) => choose(e.target.files?.[0])} />
          {preview ? <img src={preview} alt="Foto asli" /> : (
            <>
              <div className="uploadIcon">＋</div>
              <strong>Upload foto</strong>
              <small>JPG, PNG, WEBP — maksimal 15 MB</small>
            </>
          )}
        </div>

        <div className="controls">
          <div>
            <label>Transformasi</label>
            <div className="preset">Curvy + Muscular <span>AI</span></div>
          </div>
          <button disabled={!file || busy} onClick={generate}>
            {busy ? "Memproses…" : "Generate"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div className="resultHead">
              <strong>Hasil</strong>
              <a href={result} download="curvy-muscle-result.png">Download</a>
            </div>
            <img src={result} alt="Hasil edit AI" />
          </div>
        )}
      </section>

      <footer>Foto diproses melalui server dan API key tidak pernah dikirim ke browser.</footer>
    </main>
  );
}