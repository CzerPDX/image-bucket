const express = require('express');
const app = express();
const { validateAPI } = require('./utilities/security');

require('dotenv').config();

// Figure out the port
// In live environment the NODE_ENV will be set to "production"
const port = process.env.ENVIRONMENT === 'production' ? null : process.env.ART_IMAGE_BUCKET_PORT;

//  Validate request's api key before proceeding
app.use(validateAPI);


// Art Upload Routes
const uploadRoutes = require('./routes/upload');
app.put('/', uploadRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Art image bucket server started on port ${port ? port : 'assigned by A2 Hosting'}...`);
});
