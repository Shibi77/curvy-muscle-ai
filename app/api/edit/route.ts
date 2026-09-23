import OpenAI, { toFile } from "openai";

export const runtime = "nodejs";
export const maxDuration = 120;

const PROMPT = `
Edit the supplied photograph as a realistic fitness-physique transformation.

Preserve the person's identity, face, age, hairstyle, skin texture, clothing,
pose, camera angle, lighting, environment, and background as faithfully as possible.

Change only the physique:
- create a naturally curvy, muscular build
- fuller hips, glutes, and thighs
- stronger shoulders, chest, and arms
- realistic anatomical muscle definition
- believable proportions
- natural integration with the original pose and clothing

Do not change facial identity.
Do not add people, props, text, logos, watermarks, tattoos, or fantasy anatomy.

The final image must look like a real photograph with natural skin texture,
realistic shadows, realistic fabric behavior, and consistent lighting.
`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return Response.json(
        { error: "No image was uploaded." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const bytes = Buffer.from(await image.arrayBuffer());

    const result = await openai.images.edit({
      model: "gpt-image-2",
      image: await toFile(
        bytes,
        image.name || "photo.png",
        {
          type: image.type || "image/png",
        }
      ),
      prompt: PROMPT,
      quality: "high",
      size: "auto",
      output_format: "png",
    });

    const base64 = result.data?.[0]?.b64_json;

    if (!base64) {
      return Response.json(
        { error: "The image API returned no image." },
        { status: 500 }
      );
    }

    return Response.json({
      image: `data:image/png;base64,${base64}`,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image generation failed.",
      },
      { status: 500 }
    );
  }
}
