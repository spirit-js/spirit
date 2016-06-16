const {define, spirit, routes, response} = require("../index")
const http = require("http")

const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"), { suffix: "Promise" });

/*
 * Both are equivalent and show how it's possible
 * to return a file as a Promise
 */

// regular Promise way
const regular_example = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/test-file.html", (err, data) => {
      (err) ? reject(err) : resolve(data)
    })
  })
}

// with bluebird promisify 'readFilePromise' returns a Promise already
const bluebird_example = () => {
  return fs.readFilePromise(__dirname + "/test-file.html")
}

const app = define([
  routes.get("/", [], regular_example),
  routes.get("/bluebird", [], bluebird_example)
])

const server = http.createServer(spirit([routes.route(app)]))
server.listen(3000)
