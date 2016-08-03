const proxy = require("../../../lib/http/middleware/proxy")
const Promise = require("bluebird")

describe("Middleware: X-Forwarded-For proxy", () => {

  const handler = (request) => {
    return Promise.resolve(request.ip)
  }

  it("it sets the value of X-Forwarded-For", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {
        "x-forwarded-for": "127.0.0.1"
      }
    }

    app(req).then((response) => {
      expect(response).toBe("127.0.0.1")
      done()
    })
  })

  it("it sets the value of X-Forwarded-For (multiple ips)", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {
        "x-forwarded-for": "127.0.0.2, 1.1.1.1, 2.2.2.2"
      }
    }

    app(req).then((response) => {
      expect(response).toBe("127.0.0.2")
      done()
    })
  })


  it("if there is no X-Forwarded-For or Forwarded header, it simply returns", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {}
    }

    app(req).then((response) => {
      expect(response).toBe("0.0.0.0")
      done()
    })
  })

  // below are tests for RFC-7239
  it("Forwarded header", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {
        "forwarded": "for=4.2.1.1; proto=http; by=2.1.1.2"
      }
    }

    app(req).then((response) => {
      expect(response).toBe("4.2.1.1")
      done()
    })
  })

  it("Forwarded header, multiple for fields", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {
        "forwarded": "for=192.0.2.43, for=198.51.100.17;by=203.0.113.60;proto=http;host=example.com"
      }
    }

    app(req).then((response) => {
      expect(response).toBe("192.0.2.43")
      done()
    })
  })

  it("Forwarded and X-Forwarded-For exists, Forwarded is given priority", (done) => {
    const app = proxy(handler)
    const req = {
      ip: "0.0.0.0",
      headers: {
        "forwarded": "for=4.2.1.1; proto=http; by=2.1.1.2",
        "x-forwarded-for": "127.0.0.2, 1.1.1.1, 2.2.2.2"
      }
    }

    app(req).then((response) => {
      expect(response).toBe("4.2.1.1")
      done()
    })
  })

})
