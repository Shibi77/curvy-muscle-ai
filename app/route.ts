import OpenAI, { toFile } from "openai";

export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `
Edit the supplied photograph as a realistic fitness-physique transformation.
Preserve the person's identity, face, age, hairstyle, skin texture, clothing, pose,
camera angle, lighting, environment, and background as faithfully as possible.
Change only the physique: create a naturally curvy, muscular build with fuller hips,
glutes, thighs, stronger shoulders, chest and arms, plus realistic anatomical muscle
definition. Keep proportions believable and integrated with the original pose and
clothing. Do not change facial identity. Do not add people, props, text, logos,
watermarks, tattoos, or fantasy anatomy. The final image must look like a real
photograph, with natural skin texture, shadows and fabric behavior.
`;

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY belum dipasang di environment Vercel." },
      { status: 500 }
    );
  }

  try {
    const form = await req.formData();
    const image = form.get("image");
    if (!(image instanceof File)) {
      return Response.json({ error: "Foto belum dipilih." }, { status: 400 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const edited = await openai.images.edit({
      model: "gpt-image-2",
      image: await toFile(bytes, image.name || "photo.png", {
        type: image.type || "image/png",
      }),
      prompt: PROMPT,
      quality: "high",
      size: "auto",
      output_format: "png",
    });

    const b64 = edited.data?.[0]?.b64_json;
    if (!b64) throw new Error("OpenAI tidak mengembalikan gambar.");

    return Response.json({ image: b64, mime: "image/png" });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "OpenAI image edit gagal.";
    return Response.json({ error: message }, { status: 500 });
  }
}