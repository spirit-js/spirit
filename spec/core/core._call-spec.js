const core = require("../../lib/core/core")
const _call = core._call

process.on('unhandledRejection', function(reason, p) {
  throw("unhandled rejection for Promise: " + reason)
});

describe("_call", () => {

  it("returns ok string", (done) => {
    const args = []
    const route = () => {
      return "test"
    }

   _call(route, args).then((result) => {
      expect(result).toEqual("test")
      done()
    })
  })

  it("returns ok map", (done) => {
    const args = []
    const route = () => {
      return { status: 201, body: "test2" }
    }

    _call(route, args).then((result) => {
      expect(result).toEqual({
        status: 201,
        body: "test2"
      })
      done()
    })
 })

  it("returns ok resolved promise", (done) => {
    const args = []
    const route = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ status: 202, body: "test 3" })
        }, 1)
      })
    }

    _call(route, args).then((result) => {
      expect(result).toEqual({
        status: 202,
        body: "test 3"
      })
      done()
    })
 })

  it("returns ok rejected promise", (done) => {
    const args = []
    const route = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject({ status: 123, body: "hi" })
        }, 1)
      })
    }

    _call(route, args).catch((err) => {
      expect(err).toEqual({
        status: 123,
        body: "hi"
      })
      done()
    })
 })

})
