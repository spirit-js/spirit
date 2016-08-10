const log = require("../../../index").node.middleware.log
const Promise = require("bluebird")

describe("Middleware: log", () => {
  const orig_log = console.log

  afterEach(() => {
    console.log = orig_log
  })

  it("outputs a request", (done) => {
    let called = 0
    console.log = (prefix, method, url, status, time) => {
      expect(method).toBe("TEST")
      expect(url).toBe("/test/path")

      if (!called) {
        called = 1
        expect(status).toBe(undefined)
        expect(time).toBe(undefined)
        return
      }

      const ms = parseInt(time.substr(0, time.length))
      expect(ms).not.toBe(NaN)
      // the time it took to run the test should
      // at least be 3ms but probably not greater than 7ms
      if (ms < 3 && ms > 7) {
        throw new Error("time in milliseconds seems unlikely")
      }
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

  it("visual test", (done) => {
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
        }, 3)
      })
    }

    log(handler)({ method: "TEST", url: "/test/path" }).then(() => {
      log(handler)({ method: "TEST", url: "/test/path" }).catch(done)
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
