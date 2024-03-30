// multer.js

const multer = require('multer');

// Configurez Multer pour stocker les images dans le dossier 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg'); // Vous pouvez spécifier une extension différente si nécessaire
  },
});

const upload = multer({ storage });

module.exports = upload;
