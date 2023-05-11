const express = require('express');
// Set the port number for the server to listen on
const port =  4000;
const app = express();
//to allow resource sharing
const cors = require("cors");
// Import and use bodyParser to parse request bodies
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Import the userRoute module and mount it at the "/api" endpoint
const userRoute = require("./routes/userRoute.route");
app.use("/api", userRoute)
// Start the server and listen for incoming requests on the specified port
app.listen(port , () => {
  console.log('listen on http://localhost:' + port);
});