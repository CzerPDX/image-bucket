const multer  = require('multer');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const { validateFileType } = require('../utilities/security');

// Wrap multer's upload in a promise-based function
const uploadAsync = (req, res, upload) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Multer storage and upload settings (disk storage to bucket name directory)
const setStorage = (bucketName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${bucketName}/`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
}


router.put('/:bucketName', async (req, res) => {
  const bucketName = req.params.bucketName;

  // Check if the bucket exists
  if (!fs.existsSync(`buckets/${bucketName}`)) {
    const errMsg = `The specified bucket does not exist`;
    console.error(errMsg);
    return res.status(404).send({
      Error: {
        Code: 'NoSuchBucket',
        Message: errMsg,
        BucketName: bucketName,
      }
    });
  }

  // Multer must take the file in using "upload" before it can be checked below
  const upload = multer({ storage: setStorage(`buckets/${bucketName}`) }).single('file');
  try {
    await uploadAsync(req, res, upload);
  } catch (error) {
    const errMsg = `An error occurred while uploading the file.`;
    console.error(`${errMsg}: ${error.message}`);
    return res.status(500).send({
      Error: {
        Code: 'ServerError',
        Message: errMsg,
      },
    });
  }

  // If no file was sent in the request, return an error
  if (!req.file) {
    return res.status(400).send({
      Error: {
        Code: 'NoFileUploaded',
        Message: 'No file was sent to the bucket.',
      }
    });
  }


  const fileBuffer = fs.readFileSync(req.file.path);

  // Check if the filetype is valid
  if (!validateFileType(fileBuffer)) {
    // Delete the file from the server if it is an invalid filetype
    fs.unlinkSync(req.file.path);
    return res.status(400).send({
      Error: {
        Code: 'AccessDenied',
        Message: 'Bucket policies prevent this type of file from being uploaded.',
      }
    });
  }
  
  // Send a success response
  const filename = req.file.originalname;
  const fileUrl = `${process.env.FILE_BUCKET_URL}/${bucketName}/${filename}`;

  const response = {
    Location: fileUrl,
    key: filename,
    Bucket: bucketName
  }

  res.send(response);
});

module.exports = router;
