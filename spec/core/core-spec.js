const reduce = require("../../index").compose

describe("core - compose", () => {
  it("order", (done) => {
    const handler = (request) => {
      expect(request.called).toBe(".abc")
      return Promise.resolve({ resp: "." })
    }

    const middleware = [
      (handler) => {
        return (request) => {
          request.called += "a"
          return handler(request).then((response) => {
            response.resp += "1"
            return response
          })
        }
      },
      (handler) => {
        return (request) => {
          request.called += "b"
          return handler(request).then((response) => {
            response.resp += "2"
            return response
          })
        }
      },
      (handler) => {
        return (request) => {
          request.called += "c"
          return handler(request).then((response) => {
            response.resp += "3"
            return response
          })
        }
      }
    ]

    const mock_req = { called: "." }

    const route = reduce(handler, middleware)
    const resp = route(mock_req)
    resp.then((response) => {
      expect(response).toEqual({
        resp: ".321"
      })
      done()
    })
  })

  it("ok with no middleware, empty array []", (done) => {
    const handler = (request) => {
      return Promise.resolve("ok")
    }
    const route = reduce(handler, [])
    route({}).then((resp) => {
      expect(resp).toBe("ok")
      done()
    })
  })

  it("converts the result of handler to Promise if it isn't", (done) => {
    const handler = (request) => {
      return "ok"
    }
    const route = reduce(handler, [
      (handler) => {
        return (request) => {
          return handler(request).then((resp) => {
            resp += "ok"
            return resp
          })
        }
      }
    ])
    route({}).then((resp) => {
      expect(resp).toBe("okok")
      done()
    })
  })

  it("converts the result of middleware to Promise if it isn't", (done) => {
    const handler = () => {}

    const route = reduce(handler, [
      (handler) => {
        return () => {
          return "ok"
        }
      }
    ])
    route().then((resp) => {
      expect(resp).toBe("ok")
      done()
    })
  })

  it("can exit early and does not call remaining middlewares/handler", (done) => {
    let free = "a"

    const handler = () => {
      free += "_final"
    }

    const route = reduce(handler, [
      (handler) => {
        return () => {
          return "ok"
        }
      },
      (handler) => {
        return () => {
          free += "_mw2"
          return handler()
        }
      }
    ])
    route().then((resp) => {
      expect(resp).toBe("ok")
      setTimeout(() => {
        expect(free).toBe("a")
        done()
      }, 10)
    })
  })

  it("each middleware will correctly call the next func with arguments", (done) => {
    const handler = function() {
      return Array.prototype.slice.call(arguments).join(",")
    }
    const route = reduce(handler, [
      (handler) => {
        return (a, b, c) => {
          expect(a).toBe(1)
          expect(b).toBe(2)
          expect(c).toBe(undefined)
          return handler(a, b, 3)
        }
      },
      (handler) => {
        return (a, b, c, d) => {
          expect(a).toBe(1)
          expect(b).toBe(2)
          expect(c).toBe(3)
          expect(d).toBe(undefined)
          return handler(a, b, c, 4)
        }
      }
    ])
    route(1, 2).then((result) => {
      expect(result).toBe("1,2,3,4")
      done()
    })
  })

  it("promises ok", (done) => {
    const handler = () => {
      return new Promise((resolve, reject) => {
        resolve("ok")
      })
    }

    const middleware = (_handler) => {
      return () => {
        return new Promise((resolve, reject) => {
          const result = _handler()
          resolve(result)
        })
      }
    }

    const fn = reduce(handler, [middleware, middleware])
    fn().then((result) => {
      expect(result).toBe("ok")
      done()
    })
  })
})
