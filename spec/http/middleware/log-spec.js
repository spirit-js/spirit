const log = require("../../../index").node.middleware.log
const Promise = require("bluebird")

describe("Middleware: log", () => {
  const orig_log = console.log

  afterEach(() => {
    console.log = orig_log
  })

  it("console logs a request once for incoming, and once for when outgoing", (done) => {
    let called = 0
    console.log = (prefix, tag, x, y) => {
      if (!called) {
        called = 1
        expect(x).toBe("TEST")
        expect(y).toBe("/test/path")
        return
      }

      const ms = parseInt(y.substr(0, y.length))
      expect(ms).not.toBe(NaN)
      // the time it took to run the test should
      // at least be 3ms but probably not greater than 7ms
      if (ms < 3 && ms > 7) {
        throw new Error("time in milliseconds seems unlikely")
      }
      expect(x).toBe(123)
      called = 2
    }

    const handler = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 123, headers: {}, body: "hi" })
        }, 3)
      })
    }

    log(handler)({ method: "TEST", url: "/test/path" }).then((response) => {
      expect(response).toEqual({
        status: 123,
        headers: {},
        body: "hi"
      })
      expect(called).toBe(2)
      done()
    })
  })

  it("console logs for outgoing errors", (done) => {
    let called = 0
    console.log = (prefix, tag, x, y) => {
      if (!called) {
        called = 1
        expect(x).toBe("TEST")
        expect(y).toBe("/test/path")
        return
      }

      const ms = parseInt(y.substr(0, y.length))
      expect(ms).not.toBe(NaN)
      if (ms < 2 && ms > 6) {
        throw new Error("time in milliseconds seems unlikely")
      }
      expect(x).toBe("err")
      called = 2
    }

    const handler = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("an error")
        }, 2)
      })
    }

    log(handler)({ method: "TEST", url: "/test/path" }).catch((err) => {
      expect(err).toBe("an error")
      expect(called).toBe(2)
      done()
    })
  })

  it("does not do anything if production env set", (done) => {
    process.env.NODE_ENV = "production"
    console.log = () => {
      throw new Error("should not be called")
    }
    const handler = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(123)
        }, 3)
      })
    }
    log(handler)({ method: "TEST", url: "/test/path" }).then((resp) => {
      expect(resp).toBe(123)
      process.env.NODE_ENV = ""
      done()
    })
  })
})

describe("visual test", () => {
  it("output", (done) => {
    console.log("\nvisual test for log middleware (4 lines will be outputted):")
    let called = false

    const handler = () => {
      return new Promise((resolve, reject) => {
        if (called) {
          return reject("simulating error")
        }

        called = true
        setTimeout(() => {
          resolve({ status: 123, headers: {}, body: "hi" })
        }, 1)
      })
    }

    log(handler)({ method: "TEST", url: "/test/path" }).then(() => {
      log(handler)({ method: "TEST", url: "/test/path" }).catch(done)
    })
  })
})

