const utils = require("../../index").node.utils

const stream = require("stream")
const fs = require("fs")
const Promise = require("bluebird")

describe("resolve_response", () => {
  const resolve = utils.resolve_response

  it("returns the value when giving a response map with a promise as it's body", (done) => {
    const p = new Promise((resolve, reject) => {
      const bodyp = {
        status: 123,
        headers: {},
        body: new Promise((resolve, reject) => {
          resolve("hi!")
        })
      }
      resolve(bodyp)
    })

    resolve(p).then((result) => {
      expect(result).toEqual({
        status: 123,
        headers: {},
        body: "hi!"
      })
      done()
    })
  })

  it("returns the promise passed in, if it's resolved value is a response map but non-promise body", (done) => {
    const p = Promise.resolve({
      status: 123,
      headers: {a:1},
      body: "yay"
    })

    resolve(p).then((result) => {
      expect(result).toEqual({
        status: 123,
        headers: {a:1},
        body: "yay"
      })
      done()
    })
  })

  it("returns the promise passed in, if it's resolved value is not a response map", (done) => {
    const p = Promise.resolve(123)
    resolve(p).then((result) => {
      expect(result).toBe(123)
      done()
    })
  })

  it("if the response body is a rejected promise, it ignores the responses and returns the rejected promise", (done) => {
    const p = Promise.reject("error")

    const resp = {
      status: 123,
      headers: {a:1},
      body: p
    }

    resolve(Promise.resolve(resp)).catch((err) => {
      expect(err).toBe("error")
      done()
    })
  })
})

describe("size_of", () => {
  it("returns the size in bytes of a string", () => {
    let size = utils.size_of("1abcdé")
    expect(size).toBe(7)
    size = utils.size_of("")
    expect(size).toBe(0)
  })

  it("returns the size in bytes of a Buffer", () => {
    const size = utils.size_of(new Buffer("123"))
    expect(size).toBe(3)
  })

  it("returns undefined if unable to determine size", () => {
    let size = utils.size_of([1,2,3,4,5])
    expect(size).toBe(undefined)
    size = utils.size_of()
    expect(size).toBe(undefined)
    size = utils.size_of(0)
    expect(size).toBe(undefined)
  })
})

describe("type_of", () => {
  it("returns the type of obj as string (just like `typeof`)", () => {
    const test = ["string", 123, true, undefined, () => {}]
    test.forEach((t) => {
      expect(typeof t).toBe(utils.type_of(t))
    })
  })

  it("null", () => {
    expect(utils.type_of(null)).toBe("null")
  })

  it("array", () => {
    expect(utils.type_of([1,2,3])).toBe("array")
  })

  it("buffer", () => {
    expect(utils.type_of(new Buffer(""))).toBe("buffer")
  })

  it("stream", () => {
    const s = new stream.Writable()
    expect(utils.type_of(s)).toBe("stream")
  })

  it("file-stream", () => {
    const f = fs.createReadStream(__dirname + "/node_adapter-spec.js")
    expect(utils.type_of(f)).toBe("file-stream")
  })

})
