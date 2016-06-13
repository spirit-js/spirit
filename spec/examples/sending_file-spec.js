const request = require("superagent")
const rewire = require("rewire")
const example = rewire("../../examples/sending_file")
const server = example.__get__("server")

const base_url = "http://localhost:3000"

describe("sending_file example", () => {

  afterAll(() => {
    server.close()
  })

  // all the tests have the same response body, so set it here
  const expected_body = /\/\/ router & route/

  it("-> get /", (done) => {
    request.get(base_url).end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.text).toMatch(expected_body)

      // headers aren't too interesting, mainly that there
      // is no content-type set
      expect(Object.keys(res.headers)).toEqual([
        "date", "connection", "transfer-encoding"
      ])

      done()
    })
  })

  it("-> get /bluebird", (done) => {
    // same thing as the -> get /
    request.get(base_url + "/bluebird").end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.text).toMatch(expected_body)
      expect(Object.keys(res.headers)).toEqual([
        "date", "connection", "transfer-encoding"
      ])
      done()
    })
  })

  it("-> get /response", (done) => {
    request.get(base_url + "/response").end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.text).toMatch(expected_body)

      // expect there to be a content-type header
      expect(res.headers["content-type"]).toBe("text/html; charset=utf-8")
      done()
    })
  })

})
