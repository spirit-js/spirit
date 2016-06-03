/**
 * integration tests for core._handler
 */

const core = require("../../lib/core/core")
const mock_res = require("../support/mock-response")

describe("_handler", () => {

  beforeEach(() => {
    mock_res._reset()
  })

  afterEach(() => {
    mock_res._reset()
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

    mock_res._done = () => {
      expect(mock_res._map.status).toBe(200)
      expect(mock_res._map.body).toBe("recover")
      done()
    }

    list = core.mapl(list, core.adapter)
    core._handler(list, {}, mock_res)
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

    mock_res._done = () => {
      expect(mock_res._map.status).toBe(500)
      expect(mock_res._map.body).toBe("oops")
      done()
    }

    list = core.mapl(list, core.adapter)
    core._handler(list, {}, mock_res)
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

    mock_res._done = () => {
      expect(mock_res._map.status).toBe(500)
      expect(mock_res._map.body).toBe("new error")
      done()
    }

    list = core.mapl(list, core.adapter)
    core._handler(list, {}, mock_res)
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

    mock_res._done = () => {
      expect(mock_res._map.status).toBe(500)
      done()
    }

    list = core.mapl(list, core.adapter)
    core._handler(list, {}, mock_res)
  })
})
