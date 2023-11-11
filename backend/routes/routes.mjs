// routes.js
import express from "express";
import { pipeline } from "@xenova/transformers";
import wavefile from "wavefile";
import fs from "fs";
import cors from "cors";
import { randomUUID } from "crypto";

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.static("public"));

router.post("/generate", async (req, res) => {
  const { phrase } = req.body;

  const EMBED =
    "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin";

  const synthesizer = await pipeline("text-to-speech", "Xenova/speecht5_tts", {
    quantized: false,
  });

  try {
    const output = await synthesizer(phrase, { speaker_embeddings: EMBED });

    const wav = new wavefile.WaveFile();
    wav.fromScratch(1, output.sampling_rate, "32f", output.audio);
    const id = randomUUID();
    const filePath = `public/audio-${id}.wav`;
    fs.writeFileSync(filePath, wav.toBuffer());

    res.json({
      url: `http://localhost:3000/audio-${id}.wav`,
    });
  } catch (error) {
    console.error("Error synthesizing:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/recuperate", (req, res) => {
  fs.readdir("public", (err, files) => {
    if (err) {
      console.error("Error reading public folder:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const audioFiles = files.filter((file) => file.endsWith(".wav"));
      res.json({ audioFiles });
    }
  });
});

export { router };
