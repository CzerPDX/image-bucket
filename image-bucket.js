const express = require('express');
const app = express();
const { validateAPI, apiLimiter } = require('./utilities/security');

require('dotenv').config();

// Figure out the port
// In live environment the NODE_ENV will be set to "production"
const port = process.env.ENVIRONMENT === 'production' ? null : process.env.FILE_BUCKET_PORT;

// Statically serve contents of buckets
app.use(express.static('buckets'));


app.use((req, res, next) => {
  console.log(`Static file not found for ${req.method} request on ${req.path}`);
  next();
});

//  Validate request's api key before proceeding
app.use(validateAPI);

app.use(apiLimiter);



// Log all requests
app.all('*', (req, res, next) => {
  console.log(`${new Date().toString()}: Received ${req.method} request on ${req.path}`);
  next();
});



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
