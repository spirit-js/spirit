const utils = require("../../lib/http/utils")

const stream = require("stream")
const fs = require("fs")

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
