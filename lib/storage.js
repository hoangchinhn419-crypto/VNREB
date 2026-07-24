import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

function safeName(name="file") {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9._-]+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"") || "file";
}

export async function saveUploadedFile(file, folder="projects") {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name || "");
  const base = safeName(path.basename(file.name || "file", ext));
  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${base}${ext}`;

  const uploadEndpoint = process.env.MEDIA_UPLOAD_ENDPOINT;
  if (uploadEndpoint) {
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        "content-type": file.type || "application/octet-stream",
        "x-file-key": key,
        ...(process.env.MEDIA_UPLOAD_TOKEN ? { authorization: `Bearer ${process.env.MEDIA_UPLOAD_TOKEN}` } : {}),
      },
      body: bytes,
    });
    if (!response.ok) throw new Error(`Kho media trả về lỗi ${response.status}`);
    const result = await response.json();
    if (!result.url) throw new Error("Kho media không trả về URL");
    return { url: result.url, provider: result.provider || "S3", size: bytes.length, mime: file.type || null, name: file.name || path.basename(key) };
  }

  const localDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(localDir, { recursive: true });
  const localName = path.basename(key);
  await writeFile(path.join(localDir, localName), bytes);
  return { url: `/uploads/${folder}/${localName}`, provider: "LOCAL", size: bytes.length, mime: file.type || null, name: file.name || localName };
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
