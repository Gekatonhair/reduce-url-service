const app = require("./app");
const config = require('./config/config');

const LISTEN_PORT = config.server.port;

app.listen(LISTEN_PORT, '0.0.0.0', () => {
    console.log("Server started successfully on port " + LISTEN_PORT);
});