const {define, spirit, routes} = require("../../index")
const http = require("http")

// use bluebird to make node's fs module return a Promise
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"), { suffix: "Promise" });

const index = () => {
  return fs.readFilePromise(__dirname + "/index.html")
}

const app = define([
  routes.get("/", [], index)
])

const server = http.createServer(spirit([routes.route(app)]))
const io = require("socket.io")(server)

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg)
  })
})

server.listen(3000)

