const express = require('express');
const router = express.Router();
const fs = require('fs');

router.delete('/:bucketName/:filename', async (req, res) => {
  try {

    const bucketName = req.params.bucketName;
    const filepath = `${req.params.bucketName}/${req.params.filename}`;

    // If the bucket doesn't exist or wasn't included in the request parameters
    if (!fs.existsSync(bucketName) || !req.params.bucketName) {
      return res.status(404).send({
        Error: {
          Code: 'NoSuchBucket',
          Message: 'The specified bucket does not exist',
          BucketName: bucketName,
        }
      });
    }

    // If the filename was not included in the request parameters
    if (!req.params.filename) {
      return res.status(400).send({
        Error: {
          Code: 'MethodNotAllowed',
          Message: 'The filename was not included in the request.',
          BucketName: bucketName,
        }
      });
    }

    // If the file doesn't exist return success (it's already gone!)
    if (!fs.existsSync(filepath)) {
      console.log('file does not exist on the server');
      return res.status(204).end();
    }

    // Delete the file from the server
    fs.unlinkSync(filepath);
    return res.status(204).end();
  } catch (error) {
    
    // Log the error for debugging purposes
    console.error(error);

    return res.status(500).send({
      Error: {
        Code: 'InternalFailure',
        Message: error.message,
        BucketName: req.params.bucketName,
      }
    });
  }
});

module.exports = router;
