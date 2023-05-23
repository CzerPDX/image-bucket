const multer  = require('multer');
const express = require('express');
const router = express.Router();

// Middleware

// Set the multer settings
// Save the upload to img/ with its original filename.
// Eventually the handling for duplicate filenames will be more robust but for now this will overwrite existing filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'art/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage }).single('file');

// Take an upload request
router.put('/', async (req, res) => {
// module.exports = async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.status(500).send({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      res.status(500).send({ message: `Unknown error: ${err.message}` });
    } else {
      if (req.file) {
        // Everything went fine and file is uploaded
        const filename = req.file.originalname;
        const fileUrl = `${process.env.FRONTEND_URL}/${filename}`;

        const response = {
          message: `Successfully uploaded ${req.file.originalname}!`,
          file: {
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: fileUrl
          }
        }

        res.send(response);
      } else {
        res.status(400).send({message: 'No file was uploaded to the bucket.'});
      }
    }
  })
});


// Export the entire router
module.exports = router;