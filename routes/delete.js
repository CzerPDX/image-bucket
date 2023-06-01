/*
  References:
  https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObject.html
*/

const express = require('express');
const router = express.Router();
const fs = require('fs');


// Deletes file from file bucket
// If bucket doesn't exist it returns an error
// If file doesn't exist it returns success to mirror AWS handling
router.delete('/:bucketName/:filename', async (req, res) => {
  const bucketName = req.params.bucketName;
  const filepath = `${req.params.bucketName}/${req.params.filename}`;

  // Check if the bucket exists
  if (!fs.existsSync(bucketName)) {
    return res.status(404).send({
      Error: {
        Code: 'NoSuchBucket',
        Message: 'The specified bucket does not exist',
        BucketName: bucketName,
      }
    });
  }

  // If the file doesn't exist we return success
  if (!fs.existsSync(filepath)) {
    return res.status(204).end();
  }

  // Delete the file from the server
  try {
    fs.unlinkSync(filepath);
    return res.status(204).end();
  } catch (error) {
    return res.status(500).send({
      Error: {
        Code: 'InternalFailure',
        Message: 'An unknown error occurred when deleting the file from the bucket',
        BucketName: bucketName,
      }
    });
  }
});


module.exports = router;