const {define, spirit, routes, response} = require("../index")
const http = require("http")

const Promise = require("bluebird")
const fs = Promise.promisifyAll(require("fs"), { suffix: "Promise" });

const working_path = __dirname + "/../"

/*
 * Both are equivalent and show how it's possible
 * to return a file as a Promise
 */

// regular Promise way
const file = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(working_path + "index.js", (err, data) => {
      (err) ? reject(err) : resolve(data)
    })
  })
}

// with bluebird promisify 'readFilePromise' returns a Promise already
const promised_file = () => {
  return fs.readFilePromise(working_path + "index.js")
}

// returning just the file may not always be desirable
// as sometimes you may want to set certain headers so the browser
// displays it propery
//
// in which case, use the response helper
const as_response = () => {
  // since all routes are just functions,
  // we can re-use a existing route function to make a new route
  const file = promised_file()
  return response(file).type("html")
}

const app = define([
  routes.get("/", [], file),
  routes.get("/bluebird", [], promised_file),
  routes.get("/response", [], as_response)
])

const server = http.createServer(spirit([routes.route(app)]))
server.listen(3000)
