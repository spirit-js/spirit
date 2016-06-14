const {define, spirit, routes} = require("../../index")

const http = require("http")
// use bluebird to make node's fs module return a Promise
const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"), { suffix: "Promise" });

const jade = require("jade")

// write a simple function to render jade templates
//
// NOTE: you will want to write caching normally, which this
// example doesn't cover.
// There is probably a package that does this already on npm
const render = (file, local) => {
  return fs.readFilePromise(__dirname + "/" + file)
    .then((data) => {
      return jade.compile(data)(local)
    })
}

const index = () => {
  return render("test.jade", {
    pageTitle: "title from spirit",
    name: "spirit + jade !",
    text: "Hi from spirit"
  })
}

const app = define([
  routes.get("/", [], index)
])

const server = http.createServer(spirit([routes.route(app)]))
server.listen(3000)
