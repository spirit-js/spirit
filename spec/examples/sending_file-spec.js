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
  const expected_body = /<h2>This is a test html/

  it("-> get /", (done) => {
    request.get(base_url).end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.text).toMatch(expected_body)
      expect(res.headers["content-type"]).toBe("text/html; charset=utf-8")
      done()
    })
  })

  it("-> get /bluebird", (done) => {
    // same thing as the -> get /
    request.get(base_url + "/bluebird").end((err, res) => {
      expect(res.status).toBe(200)
      expect(res.text).toMatch(expected_body)
      expect(res.headers["content-type"]).toBe("text/html; charset=utf-8")
      done()
    })
  })

})
