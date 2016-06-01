const http = require("http")

function handler(req, res) {
  res.writeHead(200)
  res.write("Hello World")
  res.end()
}

const s = http.createServer(handler)
s.listen(3009)
