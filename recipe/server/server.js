const http = require("http");
const router = require("./router");

const server = http.createServer((req, res) => {
    router(req, res);
});

server.listen(3001, () => {
    console.log("Server running on http://localhost:3000");
});