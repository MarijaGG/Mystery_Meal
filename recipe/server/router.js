function router(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/search" && req.method === "GET") {
        const ingredients = parsedUrl.query.ingredients;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Working!", ingredients }));
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
}