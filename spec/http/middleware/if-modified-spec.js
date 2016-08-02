const if_mod = require("../../../lib/http/middleware/if-modified")
const Promise = require("bluebird")

describe("middleware - if-modified", () => {

  const req = {
    headers: {
      "if-modified-since": new Date()
    }
  }

  const req_ts = req.headers["if-modified-since"]

  it("sends 304 with empty body when last-mod matches", (done) => {
    const mw = if_mod((request) => {
      const resp = {
        status: 200,
        headers: {"Last-Modified": req_ts},
        body: "abc123"
      }
      return Promise.resolve(resp)
    })

    mw(req).then((response) => {
      expect(response.status).toBe(304)
      expect(response.headers).toEqual({
        "Last-Modified": req_ts
      })
      expect(response.body).toBe(undefined)
      done()
    })
  })

  it("leaves as-is when last-mod doesn't match", (done) => {
    const mw = if_mod((request) => {
      const resp = {
        status: 200,
        headers: {"Last-Modified": new Date()},
        body: "abc123"
      }
      return Promise.resolve(resp)
    })

    mw(req).then((response) => {
      expect(response.status).toBe(200)
      expect(response.headers["Last-Modified"]).not.toBe(req_ts)
      expect(response.body).toBe("abc123")
      done()
    })
  })

  it("leaves as-is if no last-mod", (done) => {
    const mw = if_mod((request) => {
      const resp = {
        status: 200,
        headers: {},
        body: "abc123"
      }
      return Promise.resolve(resp)
    })

    mw(req).then((response) => {
      expect(response.status).toBe(200)
      expect(Object.keys(response.headers).length).toBe(0)
      expect(response.body).toBe("abc123")
      done()
    })
  })

})
