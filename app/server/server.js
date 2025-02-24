const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const basicAuth = require("express-basic-auth");
const serverDomain = "https://schuelerzeitung-gew.glitch.me";
const app = express();
const PORT = 3000;
const showDeletePage = false;
app.use(express.json());// Verzeichnisse definieren
const oldDir = path.join(__dirname, "../public/assets");
const uploadDir = path.join(__dirname, "../public/uploads");
app.use(express.static(path.join(__dirname, "../public")))

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Alle vorhandenen Dateien verschieben
fs.readdir(oldDir, (err, files) => {
  if (!err) {
    files.forEach((file) => {
      const oldPath = path.join(oldDir, file);
      const newPath = path.join(uploadDir, file);
      fs.rename(oldPath, newPath, (err) => {
        if (err) console.error(`Fehler beim Verschieben von ${file}:`, err);
      });
    });
  }
});

// Multer-Konfiguration für Datei-Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Passwortschutz für Upload-Seite
const authMiddleware = basicAuth({
  users: { admin: "schueler2011" }, // Ändere das Passwort hier!
  challenge: true,
});

// API zum Hochladen von PDFs (nur für authentifizierte Nutzer)
app.post("/upload", authMiddleware, upload.single("pdf"), (req, res) => {
  res.redirect(path.join('.', '?success=true'));
  console.log('uploaded')
});

app.get('/passwords', (req, res) => {
  const origin = req.get("Origin") || req.get("Referer"); // Check for Origin or Referer header
  if (!origin && !origin.startsWith(serverDomain)) {
    res.status(403).json({ error: "Request origin is not allowed" });
    console.log('attemptet access')
  }
  const passwordsPath = path.join(__dirname, "../hidden", "passwords.json");
  
  // Read the file and send its contents to the client
  fs.readFile(passwordsPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read passwords file" });
    }
    res.json(JSON.parse(data));
  });
});

// API zum Abrufen der Liste der PDFs
app.get("/list", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Fehler beim Laden der Bibliothek" });
    res.json(files.filter((f) => f.endsWith(".pdf")));
  });
});

const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination folder where the file will be uploaded
    const uploadDir = "./uploads";

    // Create the 'uploads' directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Retain the original file name
    cb(null, file.originalname);
  },
});

// Serve the secret file when requested
app.get('/upload', (req, res) => {
    const origin = req.get("Origin") || req.get("Referer"); // Check for Origin or Referer header
    if (origin && origin.startsWith(serverDomain)) {
        res.sendFile(path.join(__dirname, '../hidden', 'upload.html'));
    } else {
      res.status(403).json({ error: "Request origin is not allowed" });
    }
});

app.get('/dashboard', (req, res) => {

    const origin = req.get("Origin") || req.get("Referer"); // Check for Origin or Referer header

    if (origin && origin.startsWith(serverDomain)) {

        res.sendFile(path.join(__dirname, '../hidden', 'dashboard.html'));

    } else {

      res.status(403).json({ error: "Request origin is not allowed" });

    }

});

app.get('/delete', (req, res) => {
    const origin = req.get("Origin") || req.get("Referer"); // Check for Origin or Referer header
    if (origin && origin.startsWith(serverDomain)) {
        res.sendFile(path.join(__dirname, '../hidden', 'delete.html'));
    } else {
      res.status(403).json({ error: "Request origin is not allowed" });
    }
});
app.delete("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: "Unable to delete file" });
    res.json({ message: `File ${filename} deleted successfully` });
  });
});

app.listen(PORT, () =>
  console.log(`Server läuft auf http://localhost:${PORT}`)
);
