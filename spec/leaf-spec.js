/**
 * integration test for leaf as visible to a user's perspective
 */

const request = require("superagent")
const {leaf, define, routes} = require("../index")
const http = require("http")


describe("leaf", () => {

  it("simple example", (done) => {
    const app = define([
      routes.get("/", [], () => {
        return "Hello World"
      })
    ])

    const s = http.createServer(leaf(define([
      routes.route(app)
    ])))

    s.listen(3001)

    request.get("http://localhost:3001/")
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.text).toBe("Hello World")

        request.get("http://localhost:3001/")
          .end((err, res) => {
            expect(res.status).toBe(200)
            expect(res.text).toBe("Hello World")
            s.close()
            done()
          })
      })
  })

})
