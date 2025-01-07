import { mkdir } from "fs/promises"; // Use promise-based mkdir
import path from "path";
import { exec } from "child_process";
import { Status, Upload } from "@prisma/client";
import db from "./db";

let isTranscoding = false;

async function Transcode(upload: Upload) {
  isTranscoding = true;
  const baseOutPath = path.join(
    __dirname,
    "..",
    "transcoded",
    upload.id,
    "360p"
  );

  try {
    // Ensure the directory exists
    await mkdir(baseOutPath, { recursive: true });

    const command = `ffmpeg -i ${upload.uploadUrl} -s 640x360 -c:v h264 -b:v 800k -c:a aac -b:a 128k -hls_time 6 -hls_playlist_type vod -hls_segment_filename "${baseOutPath}/360p_%03d.ts" ${baseOutPath}/360p.m3u8`;

    exec(command, async (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (err) {
        console.error("FFmpeg error:", err);
        isTranscoding = false;
        return;
      }

      // Update status in database
      await db.upload.update({
        where: { id: upload.id },
        data: { status: Status.processed },
      });
      isTranscoding = false;
    });
  } catch (err) {
    console.error("Directory creation failed:", err);
    isTranscoding = false;
  }
}

async function main() {
  while (true) {
    const upload = await db.upload.findFirst({
      where: { status: "pending" },
    });

    if (!upload || isTranscoding) {
      await new Promise((r) => setTimeout(r, 1000));
      continue;
    }

    await db.upload.update({
      where: { id: upload.id },
      data: { status: Status.processing },
    });

    Transcode(upload);
  }
}

main();
