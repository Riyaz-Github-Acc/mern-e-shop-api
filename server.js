import http from "http";

import app from "./app/app.js";

// SERVER Config
const port = process.env.PORT || 8800;
const server = http.createServer(app);
server.listen(port, console.log("SERVER Started and Running!🏃"));
