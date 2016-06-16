/**
 * integration tests for core._handler
 */

const core = require("../../lib/core/core")
const express = require("../../lib/express/compat")
const mock_response = require("../support/mock-response")

describe("_handler", () => {

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

    const list = core.mapl({list: middlewares}, express.adapter)
    core._handler(list, [], mock_response())
  })


  it("errors when nothing left to handle request", (done) => {
    const middlewares = [
      express.adapter((req, res, next) => { next() })
    ]
    const res = mock_response()
    core._handler({ list: middlewares }, undefined, res)
      .then(() => {
        expect(res._result.status).toBe(500)
        done()
      })
  })

  it("middleware errors halts handler", () => {
    const middlewares = [
      express.adapter((req, res, next) => {
        next("an error")
      }),
      express.adapter(() => {
        throw("should not run")
      })
    ]
    core._handler({ list: middlewares }, undefined, mock_response())
  })

  it("handles middleware errors", (done) => {
    const middlewares = [
      express.adapter((req, res, next) => {
        next()
      }),
      express.adapter((req, res, next) => {
        next("an error")
      }),
      express.adapter((req, res, next) => {
        throw "should not run"
      })
    ]

    let called = false

    const res = mock_response((result) => {
      expect(res._result.status).toBe(500)
      expect(called).toBe(true)
      done()
    })

    core._handler({ list: middlewares }, undefined, res)
      .then((v) => {
        expect(v).toBe(undefined)
        called = true
      })
  })

  it("can recover from a user's catch", (done) => {
    let list = [
      (req, res, next) => {
        next("error")
      }
    ]

    list = { list: list }

    list._catch = (err) => {
      expect(err).toBe("error")
      return "recover"
    }

    const res = mock_response((result) => {
      expect(result.status).toBe(200)
      expect(result.body).toBe("recover")
      done()
    })

    list = core.mapl(list, express.adapter)
    core._handler(list, {}, res)
  })

  it("accepts a Promise from a user's catch", (done) => {
    let list = [
      (req, res, next) => {
        next("error")
      }
    ]

    list = { list: list }

    list._catch = (err) => {
      expect(err).toBe("error")
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject("oops")
        }, 1)
      })
    }

    const res = mock_response((result) => {
      expect(result.status).toBe(500)
      expect(result.body).toBe("oops")
      done()
    })

    list = core.mapl(list, express.adapter)
    core._handler(list, {}, res)
  })

  it("calls user's catch when an error occurs", (done) => {
    let list = [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        setTimeout(() => {
          next("error")
        })
      },
    ]

    list = { list: list }

    list._catch = (err) => {
      expect(err).toBe("error")
      throw "new error"
    }

    const res = mock_response((result) => {
      expect(result.status).toBe(500)
      expect(result.body).toBe("new error")
      done()
    })

    list = core.mapl(list, express.adapter)
    core._handler(list, {}, res)
  })

  it("ignores user's then", (done) => {
    let list = [
      (req, res, next) => {
        next()
      },
      (req, res, next) => {
        setTimeout(() => {
          next()
        })
      },
    ]

    list = {
      list: list
    }

    list._then = () => {
      throw "should never be called"
    }

    const res = mock_response((result) => {
      expect(result.status).toBe(500)
      done()
    })

    list = core.mapl(list, express.adapter)
    core._handler(list, {}, res)
  })
})
