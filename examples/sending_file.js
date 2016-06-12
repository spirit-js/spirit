const {define, leaf, routes, response} = require("../index")
const http = require("http")

const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"), { suffix: "Promise" });

/*
 * Both are equivalent and show how it's possible
 * to return a file as a Promise
 */

// normal way
const file = () => {
  return new Promise((resolve, reject) => {
    fs.readFile("../index.js", (err, data) => {
      (err) ? reject(err) : resolve(data)
    })
  })
}

// with bluebird promisify 'readFilePromise' returns a Promise already
const promised_file = () => {
  return fs.readFilePromise("../index.js")
}

// returning just the file may not always be desirable
// as sometimes you may want to set certain headers so the browser
// displays it propery
//
// in which case, use the response helper
const as_response = () => {
  const file = fs.readFilePromise("../index.js")
  return response(file).type("html")
}

const app = define([
  routes.get("/", [], file),
  routes.get("/bluebird", [], promised_file)
  routes.get("/response", [], as_response)
])

const server = http.createServer(leaf([routes.route(app)]))
server.listen(3000)
