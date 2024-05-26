const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const methodOverride = require('method-override');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('./public'));
const mongoURI = 'mongodb+srv://alanqwerty:qwerty123@cluster0.cjvb1q8.mongodb.net/mydatabase?retryWrites=true&w=majority'; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB udh konek'))
  .catch(err => console.error(err));
const fileSchema = new mongoose.Schema({
  filename: String,
  originalname: String,
  buffer: Buffer,
  size: Number,
  mimetype: String,
  uploadDate: { type: Date, default: Date.now }
});
const File = mongoose.model('File', fileSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newFile = new File({
      filename: req.file.originalname,
          originalname: req.file.originalname,
            buffer: req.file.buffer,
         size: req.file.size,
      mimetype: req.file.mimetype
    });
    await newFile.save();
    res.redirect(`/files/${newFile._id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ err: 'No file exists' });
    }

    res.set('Content-Type', file.mimetype);
    res.send(file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serper jalan di http://localhost:${PORT}`);
});
