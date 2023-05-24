const rateLimit = require('express-rate-limit');

const JPG_TYPE = 'image/jpeg';
const PNG_TYPE = 'image/png';
const GIF_TYPE = 'image/gif';

const ALLOWED_FILETYPES = [JPG_TYPE, PNG_TYPE, GIF_TYPE];

// Checks the file type based on the first 4 bytes of the file
const checkFileType = (buffer) => {
  try {
    // Convert the first 4 bytes of the file into a hexadecimal string
    const magicNumber = buffer.toString('hex', 0, 4);

    switch (magicNumber) {
      // JPEG Cases
      case 'ffd8ffe0':
      case 'ffd8ffe1':
      case 'ffd8ffe2':
        return JPG_TYPE;

      // PNG Case
      case '89504e47':
        return PNG_TYPE;

      // GIF Cases
      case '47494638':
        return GIF_TYPE;

      // Else
      default:
        return 'unknown';
    }
  } catch (error) {
    console.error('Error checking file type:', error);
    throw error;
  }
};

// Returns true or false based on whether the filetype is allowed
const validateFileType = (incomingFile) => {
  const fileType = checkFileType(incomingFile);
  console.log(`fileType = ${fileType}`);
  return ALLOWED_FILETYPES.includes(fileType);
};

//  Validate request's api key before proceeding
const validateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  // If there is no api key or the key doesn't match the expected one, kick them out
  if (!apiKey) {
    return res.status(403).json({message: 'Forbidden: No bucket API key provided.'});
  } else if (apiKey !== process.env.ART_API_KEY) {
    return res.status(403).json({message: 'Forbidden: invalid bucket API key.'});
  }

  next();
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests created from this IP, please try again after 15 minutes."
});

module.exports = {
  validateFileType,
  apiLimiter,
  validateAPI,
};