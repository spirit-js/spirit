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

  it("middlewares can decide to stop passing data forward (input), data 'rewinds' and flows back out through all middleware called along the way", (done) => {
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

  it("a adapter transforms data between spirit and another interface. an adapter controls the first entry point and last exit point, it can also catch any uncaught errors along the way", (done) => {
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
        done()
      })
    }

    adapter()
  })

})

describe("spirit exported API", () => {
  it("core", () => {
    const api = Object.keys(spirit)
    expect(api).toEqual([
      "compose",
      "callp",
      "is_promise", // not documented as exported
      "node"
    ])
    expect(api.length).toEqual(4)
    api.forEach((f) => {
      if (f === "node") {
        return expect(typeof spirit[f]).toBe("object")
      }
      expect(typeof spirit[f]).toBe("function")
    })
  })

  it("node", () => {
    const api = Object.keys(spirit.node).sort()
    const test_api = [
      "adapter",
      "response",
      "redirect",
      "make_stream",
      "is_response",
      "file_response",
      "err_response",
      "Response",
      "utils"
    ]

    // add in camelCase aliases
    const test_aliases = test_api.reduce((ta, api_name) => {
      const t = api_name.split("_")
      if (t.length === 2) {
        const alias = t[0] + t[1][0].toUpperCase() + t[1].slice(1)
        ta.push(alias)
      }
      return ta
    }, [])

    expect(api).toEqual(test_api.concat(test_aliases).sort())

    api.forEach((f) => {
      if (f === "utils") {
        return expect(typeof spirit.node[f]).toBe("object")
      }
      expect(typeof spirit.node[f]).toBe("function")
    })
  })

  it("node.utils", () => {
    const api = Object.keys(spirit.node.utils).sort()
    expect(api).toEqual([
      "callp_response",
      "is_Response",
      "size_of",
      "type_of"
    ])

    api.forEach((f) => {
      expect(typeof spirit.node.utils[f]).toBe("function")
    })
  })
})
