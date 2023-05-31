const express = require('express');
const router = express.Router();
const fs = require('fs');


router.delete('/:bucketName/*', async (req, res) => {
  const bucketName = req.params.bucketName;

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

  const response = {
    message: 'hello you have reached delete'
  }

  res.send(response);
});


module.exports = router;