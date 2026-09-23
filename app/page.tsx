"use client";

import { useState } from "react";

const transformations = [
  {
    name: "Natural",
    description: "Perubahan ringan dan tetap natural",
  },
  {
    name: "Curvy",
    description: "Bentuk tubuh lebih curvy dengan proporsi realistis",
  },
  {
    name: "Curvy + Muscular",
    description: "Curvy dengan otot paha, glute, bahu, dada dan lengan lebih berkembang",
  },
  {
    name: "Muscular",
    description: "Fokus pada massa dan definisi otot",
  },
];

const focuses = [
  "Balanced",
  "Lower Body",
  "Upper Body",
  "Definition",
];

function buildPrompt(transformation: string, focus: string) {
  return `Edit the uploaded photograph as a realistic fitness physique transformation.

TRANSFORMATION:
${transformation}

FOCUS:
${focus}

Preserve the person's identity, face, facial features, age, hairstyle, skin tone,
skin texture, clothing, pose, camera angle, lighting, environment and background.

Change only the physique.

Create a realistic and anatomically believable result:
- naturally curvy proportions
- fuller hips and glutes
- fuller and stronger thighs
- stronger shoulders
- stronger chest
- stronger arms
- realistic muscle definition
- natural body proportions
- realistic anatomy
- natural skin texture
- realistic shadows
- realistic clothing behavior

For Lower Body focus, emphasize thighs, glutes and hips.

For Upper Body focus, emphasize shoulders, chest and arms.

For Definition focus, emphasize visible but natural muscle definition
without making the physique look artificial.

For Balanced focus, distribute the transformation naturally across the body.

Keep the original person's identity unchanged.
Do not change the face.
Do not add another person.
Do not add text, logos, watermarks or tattoos.
Do not create fantasy anatomy.

The final image must look like a real photograph taken with a real camera,
with natural skin texture, realistic lighting and believable proportions.`;
}

export default function Home() {
  const [transformation, setTransformation] = useState("Curvy + Muscular");
  const [focus, setFocus] = useState("Balanced");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  function generatePrompt() {
    const result = buildPrompt(transformation, focus);
    setPrompt(result);
    setCopied(false);
  }

  async function copyPrompt() {
    if (!prompt) return;

    await navigator.clipboard.writeText(prompt);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="container">
      <div className="badge">OPENAI IMAGE WORKFLOW</div>

      <h1>
        Curvy Muscle <span>AI</span>
      </h1>

      <p className="subtitle">
        Buat prompt transformasi tubuh yang realistis untuk digunakan
        langsung di ChatGPT.
      </p>

      <section className="card">
        <div className="sectionTitle">Transformasi</div>

        <div className="options">
          {transformations.map((item) => (
            <button
              key={item.name}
              className={`option ${
                transformation === item.name ? "selected" : ""
              }`}
              onClick={() => setTransformation(item.name)}
            >
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>

        <div className="sectionTitle focusTitle">Fokus tubuh</div>

        <div className="focusGrid">
          {focuses.map((item) => (
            <button
              key={item}
              className={`focus ${
                focus === item ? "selected" : ""
              }`}
              onClick={() => setFocus(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="generate" onClick={generatePrompt}>
          Generate Prompt
        </button>
      </section>

      {prompt && (
        <section className="result card">
          <div className="resultHeader">
            <div>
              <div className="sectionTitle">Prompt siap digunakan</div>
              <p>
                Salin prompt ini lalu gunakan bersama foto kamu di ChatGPT.
              </p>
            </div>

            <button className="copy" onClick={copyPrompt}>
              {copied ? "Copied ✓" : "Copy Prompt"}
            </button>
          </div>

          <textarea
            value={prompt}
            readOnly
            onClick={(e) => e.currentTarget.select()}
          />

          <a
            className="chatgpt"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka ChatGPT →
          </a>
        </section>
      )}

      <p className="footer">
        Foto tidak dikirim ke server aplikasi ini. Gunakan foto langsung di
        ChatGPT untuk melakukan proses edit gambar.
      </p>
    </main>
  );
}
