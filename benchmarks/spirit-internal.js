/*
 * This file is for running internal benchmarks
 * against different commits
 *
 * The point is not to gauge overall speed, but relative
 * speed between each commit to know when certain changes
 * introduced drastic performance dips.
 * Which could be the result of a bug or needing better implementation.
 */
const Benchmark = require("benchmark")
const suite = new Benchmark.Suite

const {define, routes, spirit} = require("../index")
const mock_response = require("../spec/support/mock-response")

const assert = require("assert")

const other = define("/other", [
  routes.get("/a", [], () => { return "nope" }),
  routes.get("/b", [], () => { return "nope" })
])

const long_routes = define([
  routes.get("/a", [], () => { return "nope" }),
  routes.get("/b", [], () => { return "nope" }),
  routes.get("/c", [], () => { return "nope" }),
  routes.get("/c", [], () => { return "nope" }),
  routes.get("/d", [], () => { return "nope" }),
  routes.get("/e", [], () => { return "nope" }),
  routes.get("/f", [], () => { return "nope" }),
  routes.get("/g", [], () => { return "nope" }),
  routes.get("/h", [], () => { return "nope" }),
  routes.get("/i", [], () => { return "nope" }),
  routes.get("/j", [], () => { return "nope" }),
  routes.get("/", [], () => { return "Hello World" })
])

const single_route = define([
  routes.get("/", [], () => { return "Hello World" })
])

const test_long_route = function(cb) {
  const handler = spirit(define([
    (req, res, next) => {
      next()
    },
    routes.route(other),
    routes.route(long_routes)
  ]))
  handler({ method: "GET", url: "/" }, mock_response(cb))
}

const test_single_route = function(cb) {
  const handler = spirit(define([
    (req, res, next) => {
      next()
    },
    routes.route(single_route)
  ]))
  handler({ method: "GET", url: "/" }, mock_response(cb))
}

// tests the benchmark tests before actually running
test_long_route(function(result) {
  assert.strictEqual(result.status, 200)
  assert.strictEqual(result.body, "Hello World")
})

test_single_route(function(result) {
  assert.strictEqual(result.status, 200)
  assert.strictEqual(result.body, "Hello World")
})





suite.add("long routes", function(deferred) {
  test_long_route(function() {
    deferred.resolve()
  })
}, { defer: true })
  .add("single route", function(deferred) {
    test_single_route(function() {
      deferred.resolve()
    })
  }, { defer: true })
  .on("cycle", function(event) {
    console.log(String(event.target))
  })
  .run({ "async": true })
