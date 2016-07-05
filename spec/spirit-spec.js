const spirit = require("../index")

describe("spirit spec", () => {

  it("it wraps a handler and middlewares into a reducer function which reduces through the middlewares and handler and 'rewinds' flowing backwards returning the result; the order -> last middleware is the first input, last output. the first middleware is the last input, first output", (done) => {
    const handler = (input) => {
      expect(input).toBe("abc")
      return "out"
    }

    const middlewares = [
      (handler) => {
        return (input) => {
          input += "b"
          return handler(input).then((result) => {
            return result + "1"
          })
        }
      },
      (handler) => {
        return (input) => {
          input += "c"
          return handler(input).then((result) => {
            return result + "2"
          })
        }
      }
    ]

    const reducer = spirit.compose(handler, middlewares)
    reducer("a").then((result) => {
      expect(result).toBe("out21")
      done()
    })
  })

  it("the handler can return a Promise, or plain values will be converted to a Promise", (done) => {
    const handler = (input) => {
      return new Promise((resolve, reject) => {
        resolve("ok")
      })
    }

    const middleware = [
      (handler) => {
        return (input) => {
          return handler(input).then((result) => {
            return result + "2"
          })
        }
      }
    ]

    const reducer = spirit.compose(handler, middleware)
    reducer("a").then((result) => {
      expect(result).toBe("ok2")
      done()
    })
  })

  it("middlewares can decide to stop passing data forward (input), data 'rewinds' and flows back out through all middleware called along the way", () => {
    const handler = (input) => {
      throw "never gets run"
    }
    const middlewares = [
      (handler) => {
        return (input) => {
          input += "b"
          return handler(input).then((result) => {
            return result + "2"
          })
        }
      },
      (handler) => {
        return (input) => {
          expect(input).toBe("ab")
          return Promise.resolve("stop")
        }
      }
    ]
    const reducer = spirit.compose(handler, middlewares)
    reducer("a").then((result) => {
      expect(result).toBe("stop2")
      done()
    })
  })

  it("a adapter transforms data between spirit and another interface. an adapter controls the first entry point and last exit point, it can also catch any uncaught errors along the way", () => {
    const handler = (input) => {
      throw "catch"
    }

    const middlewares = [
      (handler) => {
        return (input) => {
          return handler(input)
        }
      }
    ]

    const reducer = spirit.compose(handler, middlewares)
    const adapter = () => {
      reducer("hi").catch((err) => {
        expect(err).toBe("catch")
      })
    }
  })

})
