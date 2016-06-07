const core = require("../../lib/core/core")
const mock_response = require("../support/mock-response")
// used by send()
const stream = require("stream")

describe("core", () => {

  describe("define", () => {
    it("returns a List", () => {
      const r = core.define([1,2,3,4,5])
      expect(r.list).toEqual([1,2,3,4,5])
    })

    it("makes a copy of the array being passed in", () => {
      const l = [1,2,3]
      const r = core.define(l)
      l.push(5)
      expect(l).toEqual([1,2,3,5])
      expect(r.list).toEqual([1,2,3])
})

    it("optionally takes a name argument", () => {
      const r = core.define("hi", [1,2,3])
      expect(r.name).toBe("hi")
      expect(r.list).toEqual([1,2,3])
    })

    it("is then-able and catch-able", () => {
      const f = () => {}
      core.define([1,2]).then(f)
      core.define([1,2]).catch(f)
      const list = core.define([1,2]).then(f).catch(f)
      expect(list.list).toEqual([1,2])
      expect(list._then).toBe(f)
      expect(list._catch).toBe(f)
    })

    it("then & catch throw if called without function argument", () => {
      const invalid_types = [
        "", 123, [], {}, undefined, null
      ]

      invalid_types.forEach((typ) => {
        const list = core.define([1,2])
        expect(() => {
          list.then(typ)
        }).toThrow()
        expect(() => {
          list.catch(typ)
        }).toThrow()
      })
    })

    it("throws with wrong argument types", () => {
      const inv_list_types = [
        123, "", null, undefined, {}, ()=>{}, []
      ]
      const inv_name_types = [
        123, null, undefined, {}, ()=>{}, ["hi"]
      ]

      inv_name_types.forEach((name) => {
        expect(() => {
          core.define(name, [1,2,3])
        }).toThrow()
      })

      inv_list_types.forEach((list) => {
        expect(() => {
          core.define("name", list)
        }).toThrow()
      })
    })
  })

  describe("leaf", () => {
    it("throws if a List or an array is not passed in", () => {
      const inv = [()=>{}, "hi", 123, undefined, null, { list: 123 }, {}, { list: () => {} }]

      inv.forEach((arg) => {
        expect(() => {
          core.leaf(arg)
        }).toThrow()
      })
    })
  })

  it("throws when passing uncompiled Route for core._handler", () => {
    const site = core.define([
      ["/", [], () => { return "not ok" }]
    ])
    expect(() => {
      core.leaf(site)
    }).toThrowError(/core.adapter/)
  })


  it("adapter, wraps express middleware as Promise", (done) => {
    const express_mw = (req, res, next) => {
      req.a = 123
      next()
    }

    const wrapped_fn = core.adapter(express_mw)
    expect(wrapped_fn.length).toBe(2)

    const mock_req = { a: 1 }
    wrapped_fn(mock_req, {})
      .then((result) => {
        expect(mock_req.a).toBe(123)
        expect(result).toBe(undefined)
        done()
      })
  })

  it("adapter, handles express middleware errors as rejected Promise", (done) => {
    const express_mw = (req, res, next) => {
      next("an error")
    }
    const wrapped_fn = core.adapter(express_mw)

    wrapped_fn({}, {})
      .then((result) => {
        throw "should never get here"
      })
      .catch((err) => {
        expect(err).toBe("an error")
        done()
      })
  })

  it("mapl, maps over List.list with pred arg and retains _then & _catch & name", () => {
    let list = {
      _catch: 1,
      _then: 2,
      name: "hi",
      list: [1, 2, 3]
    }

    const pred = (list_item) => {
      return list_item + 1
    }

    let r = core.mapl(list, pred)
    // doesn't mutate list passed in
    expect(list.list).toEqual([1, 2, 3])
    expect(r.list).toEqual([2, 3, 4])
    expect(r._catch).toBe(1)
    expect(r._then).toBe(2)
    expect(r.name).toBe("hi")

    list = {
      list: [1, 2, 3]
    }
    r = core.mapl(list, pred)
    expect(r._catch).toBe(undefined)
    expect(r._then).toBe(undefined)
    expect(r.name).toBe(undefined)
  })

  describe("_err_handler", () => {
    it("")
  })

  describe("send", () => {
    it("writes a response map (string)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(123)
        expect(result.body).toBe("hi")
        expect(result.headers).toEqual({
          a: 1
        })
        done()
      })

      core.send(res, {
        status: 123,
        headers: {"a": 1},
        body: "hi"
      })
    })

    it("writes a response map with piping (stream)", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(100)
        expect(result.headers).toEqual({
          a: 2
        })
        expect(result.body).toBe("hi from streamhi from stream")
        done()
      })

      const rs = new stream.Readable({
        read(n) {
          this.push("hi from stream")
          this.push("hi from stream")
          this.push(null)
        }
      })

      core.send(res, {
        status: 100,
        headers: {"a": 2},
        body: rs
      })
    })

    it("buffer ok", (done) => {
      const res = mock_response((result) => {
        expect(result.status).toBe(1)
        expect(result.body).toBe("hi from buffer")
        done()
      })

      const buf = new Buffer("hi from buffer")
      core.send(res, {
        status: 1, headers: {}, body: buf
      })
    })

    it("supports http2 api")
  })
})
