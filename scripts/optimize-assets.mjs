/**
 * Aura & Ood — asset optimisation pipeline.
 *
 *  Images  ->  compressed .webp in /public/optimized  (via sharp)
 *  Videos  ->  compressed .mp4 + .webm + poster .jpg   (via ffmpeg)
 *
 * Source of truth: /resources.  Re-run any time with `npm run assets`.
 */
import sharp from "sharp";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "resources");
const OUT = path.join(ROOT, "public", "optimized");
const VID = path.join(ROOT, "public", "video");

for (const dir of [OUT, VID]) if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

// Semantic map: source file -> output slug
const IMAGES = {
  "1000144534-fix.png": "hero-forest-dawn",
  "1000144534.png": "dawn-sea",
  "1000144495.png": "bottle-blue",
  "1000144487-fix.png.png": "forest-green",
  "1000144483.png": "snow-sunrise",
  "1000144480-fix.png": "bottle-silk",
  "1000144481.png": "autumn-forest",
  "1000144533.png": "bottle-studio",
  "1000144430.png": "package-studio",
  "1000144474.jpg": "package-float",
  "1000144488.png": "package-gold",
  "1000144491.png": "package-spotlight",
  "1000144536.png": "package-rock",
  "1000145796.png": "bottle-desert",
  "1000145797.png": "bottle-beach",
  "1000144482.png": "package-bubbles",
  "1000144485.png": "package-desert",
};

// source -> slug ; poster taken at `ss` seconds
const VIDEOS = {
  "1000142288.mp4": { slug: "hero-ambient", ss: 1, height: 1280 },
  "1000144549.mp4": { slug: "bottle-rotate", ss: 2, height: 720 },
};

async function processImages() {
  console.log("→ Optimising images…");
  for (const [file, slug] of Object.entries(IMAGES)) {
    const input = path.join(SRC, file);
    if (!existsSync(input)) {
      console.warn(`  ! missing ${file}`);
      continue;
    }
    const out = path.join(OUT, `${slug}.webp`);
    await sharp(input)
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(out);
    console.log(`  ✓ ${slug}.webp`);
  }
}

async function processVideos() {
  console.log("→ Transcoding videos…");
  for (const [file, cfg] of Object.entries(VIDEOS)) {
    const input = path.join(SRC, file);
    if (!existsSync(input)) {
      console.warn(`  ! missing ${file}`);
      continue;
    }
    const mp4 = path.join(VID, `${cfg.slug}.mp4`);
    const webm = path.join(VID, `${cfg.slug}.webm`);
    const poster = path.join(VID, `${cfg.slug}-poster.jpg`);
    const scale = `scale=-2:${cfg.height}`;

    // H.264 mp4 — broad compatibility
    await execFileP("ffmpeg", [
      "-v", "error", "-y", "-i", input,
      "-vf", scale, "-an",
      "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-crf", "27", "-preset", "veryslow", "-movflags", "+faststart",
      mp4,
    ]);
    console.log(`  ✓ ${cfg.slug}.mp4`);

    // VP9 webm — smaller for modern browsers
    await execFileP("ffmpeg", [
      "-v", "error", "-y", "-i", input,
      "-vf", scale, "-an",
      "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "36", "-row-mt", "1",
      webm,
    ]);
    console.log(`  ✓ ${cfg.slug}.webm`);

    // Poster frame -> webp-ish jpg
    await execFileP("ffmpeg", [
      "-v", "error", "-y", "-ss", String(cfg.ss), "-i", input,
      "-frames:v", "1", "-vf", scale, "-q:v", "4",
      poster,
    ]);
    console.log(`  ✓ ${cfg.slug}-poster.jpg`);
  }
}

(async () => {
  try {
    await processImages();
    await processVideos();
    console.log("\n✔ Assets ready in /public/optimized and /public/video");
  } catch (err) {
    console.error("Asset pipeline failed:", err);
    process.exit(1);
  }
})();
