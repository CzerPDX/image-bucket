const express = require('express');
const app = express();
const { validateAPI, apiLimiter } = require('./utilities/security');

require('dotenv').config();

// Figure out the port
// In live environment the NODE_ENV will be set to "production"
const port = process.env.ENVIRONMENT === 'production' ? null : process.env.FILE_BUCKET_PORT;

//  Validate request's api key before proceeding
app.use(validateAPI);

app.use(apiLimiter);


// Upload Routes
const uploadRoutes = require('./routes/upload');
app.put('/*', uploadRoutes);


// Delete Routes
const deleteRoutes = require('./routes/delete');
app.delete('/*', deleteRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Art image bucket server started on port ${port ? port : 'assigned by A2 Hosting'}...`);
});
