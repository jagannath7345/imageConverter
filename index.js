const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const upload = require("./middleware/imageAuth");
const sharp = require("sharp");
const PORT = process.env.PORT || 5000;

// for creating folder for image uploading
let dir = "public";
let subDir = "public/uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
  fs.mkdirSync(subDir);
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/convertImage", upload.single("file"), (req, res) => {
  let format = req.body.format;
  let outputFile = Date.now() + "output." + format;
  if (req.file) {
    sharp(req.file.path).toFile(outputFile, (err, data) => {
      if (err) throw err;
      res.download(outputFile, (err) => {
        if (err) throw err;
        fs.unlinkSync(req.file.path);
        fs.unlinkSync(outputFile);
      });
    });
  }
});

app.listen(PORT, () => {
  console.log(`App Runing at ${PORT}`);
});
