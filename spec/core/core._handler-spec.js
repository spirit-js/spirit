/**
 * integration tests for core._handler
 */

const core = require("../../lib/core/core")

describe("_handler", () => {
  const mock_res = require("../support/mock-response")

  beforeEach(() => {
    mock_res._map = {} // reset
  })

  it("sequentially calls each middleware", (done) => {
    const middlewares = [
      (req, res, next) => { // basic example
        req.push(1)
        next()
      },
      (req, res, next) => { // async
        setTimeout(() => {
          req.push(2)
          next()
        })
      },
      (req, res, next) => { // promise
        new Promise((resolve, reject) => {
          resolve(3)
        }).then((n) => {
          req.push(n)
          next()
        })
      },
      (req, res) => {
        expect(req).toEqual([1, 2, 3])
        done()
      }
    ]

    const list = core.mapl({list: middlewares}, core.adapter)
    core._handler(list, [], mock_res)
  })


  it("errors when nothing left to handle request", (done) => {
    const middlewares = [ core.adapter((req, res, next) => { next() }) ]
    core._handler({ list: middlewares }, undefined, mock_res)
      .then(() => {
        expect(mock_res._map.status).toBe(500)
        done()
      })
  })

  it("middleware errors halts handler", () => {
    const middlewares = [
      core.adapter((req, res, next) => {
        next("an error")
      }),
      core.adapter(() => {
        throw("should not run")
      })
    ]
    core._handler({ list: middlewares }, undefined, mock_res)
  })

  it("handles middleware errors", (done) => {
    const middlewares = [
      core.adapter((req, res, next) => {
        next()
      }),
      core.adapter((req, res, next) => {
        next("an error")
      }),
      core.adapter((req, res, next) => {
        throw "should not run"
      })
    ]

    core._handler({ list: middlewares }, undefined, mock_res)
      .then((v) => {
        expect(v).toBe(undefined)
        // core._handler already catches the error and calls
        // _err_handler on response object
        expect(mock_res._map.status).toBe(500)
        done()
      })
  })

  it("handler calls user's catch when an error occurs")

  it("handler ignores user's then")
})
