const spirit = require("../../index")

const handler = (request) => {
  return { status: 200, headers: {}, body: "Hello World" }
}

const site = spirit.node(handler, [])

const http = require("http")
http.createServer(site).listen(3009)
