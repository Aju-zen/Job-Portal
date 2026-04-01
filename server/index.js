require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── DOC/DOCX preview — convert to HTML on the fly ────────────────────────────
const mammoth = require('mammoth');
const fs = require('fs');
app.get('/api/preview/:filename', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    if (!fs.existsSync(filePath)) return res.status(404).send('File not found');
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      return res.send(fs.readFileSync(filePath));
    }
    if (ext === '.docx' || ext === '.doc') {
      const result = await mammoth.convertToHtml({ path: filePath });
      return res.send(`
        <!DOCTYPE html><html><head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.7; color: #1f2937; }
          h1,h2,h3 { color: #1e1b4b; } table { border-collapse: collapse; width: 100%; } td,th { border: 1px solid #e5e7eb; padding: 0.5rem; }
        </style></head><body>${result.value}</body></html>
      `);
    }
    res.status(400).send('Unsupported file type');
  } catch (err) {
    res.status(500).send('Preview error: ' + err.message);
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('MongoDB error:', err));
