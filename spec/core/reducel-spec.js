const core = require("../../lib/core/core")
const reducel = core.reducel
const adapter = core.adapter

describe("core.reducel", () => {
  let list
  let handlers

  beforeEach(() => {
    list = {
      list: []
    }
  })

  it("modification to argument refs get passed along (not immutable)", (done) => {
    list.list = [
      (arg) => {
        expect(arg.a).toBe(1)
        expect(arg.b).toBe("hi")
        arg.a = 2
        arg.b = ["hi"]
      },
      (arg) => {
        expect(arg.a).toBe(2)
        expect(arg.b).toEqual(["hi"])
      }
    ]
    reducel(list, [{a: 1, b: "hi"}])
      .then((v) => {
        expect(v).toBe(undefined)
        done()
      })
  })

  it("passing in an array of arguments, gets passed to every fn being iterated", (done) => {
    list.list = [
      (a, b) => {
        expect(a).toBe(1)
        expect(b).toBe("2")
        a = 3 // obviously doesn't work
      },
      (a, b) => {
        expect(a).toBe(1)
        expect(b).toBe("2")
      }
    ]
    reducel(list, [1, "2"])
      .then((v) => {
        expect(v).toBe(undefined)
        done()
      })
  })

  it("starts at specified index", (done) => {
    let called = 0
    list.list = [
      () => {
        called += 1
        throw "should never run"
      },
      () => {
        called += 1
        return 2
      },
      () => { // this func becomes a no-op & essentially doesn't run, because the previous func returned something
        called += 1
        return 3
      }
    ]

    reducel(list, [], "name", 1)
      .then((val) => {
        expect(called).toBe(1)
        expect(val).toBe(2)
        done()
      })
  })

  it("if index is larger than list, will work as expected", (done) => {
    // expectation here is it'll basically iterate over nothing
    // but still return a promise
    let called = 0

    // none of these get run, not even becoming no-ops!
    list.list = [
      () => {
        called += 1
        return 1
      },
      () => {
        called += 1
        return 2
      },
      () => {
        called += 1
        return 3
      }
    ]

    reducel(list, [], "name", 100)
      .then((val) => {
        expect(called).toBe(0)
        expect(val).toBe(undefined)
        done()
      })
  })

  it("never getting a returned value is ok, keeps moving until done", (done) => {
    list.list = [
      () => {},
      () => {},
      () => {}
    ]

    reducel(list, [])
      .then((val) => {
        // everything runs normally as expected
        // and it's up to the handler here to decide if
        // an undefined value is an error
        expect(val).toBe(undefined)
        done()
      })
      .catch((err) => {
        throw "should not error or get here"
      })
  })

  it("returning a value means exit early, remaining functions are not called", (done) => {
    list.list = [
      () => {
      },
      () => {
        return "final-value"
      },
      () => {
        return "doesn't get here"
      },
      () => {
        throw "remaining functions are not called"
      }
    ]

    reducel(list, [])
      .then((val) => {
        expect(val).toBe("final-value")
        done()
      })
  })

  it("moves sequentially, no return means keep moving", (done) => {
    let called = 0
    list.list = [
      (c) => {
        expect(called).toBe(0)
        called += 1
      },
      (c) => {
        expect(called).toBe(1)
        called += 1
      },
      (c) => {
        expect(called).toBe(2)
        called += 1
        return "ok"
      }
    ]

    reducel(list, [])
      .then((val) => {
        expect(val).toBe("ok")
        expect(called).toBe(3)
        done()
      })
  })

  it("if error thrown it stops early and exits to catch handler", (done) => {
    list.list = [
      () => {},
      () => {
        throw "test error"
      },
      () => {
        throw "should not run"
      }
    ]

    reducel(list, [])
      .catch((err) => {
        expect(err).toBe("test error")
        done()
      })
  })

  it("empty list is ok", (done) => {
    list.list = []
    reducel(list, [])
      .then((v) => {
        expect(v).toBe(undefined)
        done()
    })
  })

  it("1 item list is ok", (done) => {
    list.list = [
      () => {}
    ]
    reducel(list, [])
      .then((v) => {
        expect(v).toBe(undefined)
        done()
      })
  })
})
