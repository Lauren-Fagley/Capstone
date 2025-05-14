const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { Dragoneye } = require('dragoneye-node');
const { File } = require('node:buffer');

// === Import database functions ===
const { speciesGuide, MigrationData, getData, post_submission } = require('./database');

const app = express();
const port = 3000;

// === Middleware ===
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// === Multer Setup for in-memory image uploads ===
const upload = multer({ storage: multer.memoryStorage() });

// === Dragoneye client ===
const dragoneyeClient = new Dragoneye({
  apiKey: "6JJClVKMn2qxACuK35qNQbbOlti-AolUpSRs6ZxEpqCos-4XQQ7kW5Mt4UMqLATkPbSC405Vocmx8-QQyt0A9aolCQN2q9OoX6pgSXoNkhtx5Of_u1SA2hxwFCCur1sl-5bEXwH5EvYAPW68qTnutVWpZY1M6wHHzKNKcXl_ZCs="
});

// === Report Sighting + AI Verification Only ===
app.post('/api/report-sighting', upload.single('image'), async (req, res) => {
  try {
    const { type, species, location, date } = req.body;
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({ success: false, message: "No image uploaded." });
    }

    const modelName = type === "plant" ? "dragoneye/plants" : "dragoneye/animals";

    const imageFile = new File([file.buffer], file.originalname || 'upload.jpg', { type: file.mimetype });
    
    const prediction = await dragoneyeClient.classification.predict({
      image: { blob: imageFile },
      modelName: modelName
    });

    console.dir(prediction, { depth: null });

    const topPrediction = prediction?.predictions?.[0]?.category?.children?.[0]?.children?.[0]?.name?.toLowerCase();
    if (!topPrediction) {
      console.warn("Could not extract top prediction from nested structure.");
    }

    const submittedSpecies = species.toLowerCase();

    if (topPrediction && topPrediction === submittedSpecies) {
      console.log("AI match:", topPrediction);
      post_submission(species, location, file.buffer, date);
      return res.json({ success: true, predicted: topPrediction });
    } else {
      console.log("AI mismatch: predicted", topPrediction, "but got", submittedSpecies);
      return res.json({
        success: false,
        message: `AI predicted "${topPrediction}", not "${submittedSpecies}".`,
        predicted: topPrediction
      });
    }
  } catch (err) {
    console.error("Prediction Error:", err);
    res.status(500).json({ success: false, message: "Server error during prediction." });
  }
});

// === Species Guide Endpoint ===
app.get('/api/species', async (req, res) => {
  try {
    const type = req.query.type || "All";
    const species = await speciesGuide(type, "");
    res.json(species);
  } catch (err) {
    console.error("Error fetching species:", err);
    res.status(500).json({ error: "Failed to load species data." });
  }
});

// === Explore Data Endpoint ===
app.get('/api/explore-data', async (req, res) => {
  try {
    const result = await getData("SubmissionName", "");
    res.json(result);
  } catch (err) {
    console.error("Error fetching explore data:", err);
    res.status(500).json({ error: "Failed to load explore data." });
  }
});

// === Migration Data Route ===
app.get('/api/migration-data', async (req, res) => {
  try {
    const year = req.query.year;
    const species = req.query.species;

    const rawData = await MigrationData(year, species); // Returns array of objects with { Date, Count }

    const result = rawData.map(entry => entry?.Count || 0); // Flatten into [Jan, Feb, ..., Dec]
    res.json(result);
  } catch (err) {
    console.error("Error fetching migration data:", err);
    res.status(500).json({ error: "Failed to load migration data." });
  }
});

// === Start Server ===
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});