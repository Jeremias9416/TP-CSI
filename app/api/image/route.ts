import { NextRequest } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file") as File;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const { secure_url }: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            tags: ["nextjs-route-handlers-upload-sneakers"],
          },
          function (error, result) {
            if (error) {
              reject(error);

              return;
            }
            resolve(result);
          },
        )
        .end(buffer);
    });

    return new Response(JSON.stringify({ secure_url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
