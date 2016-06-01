const response = require("../../lib/router/response")
const res = require("../support/mock-response")

describe("respond", () => {

  beforeEach(() => {
    res._map = {}
  })

  it("accepts string with default status and headers", () => {
    response.respond(res, "hello world")
    expect(res._map).toEqual({
      status: 200,
      headers: {},
      body: "hello world"
    })
  })

  it("accepts a map (leaf http map)", () => {
    const testmap = {
      status: 205,
      headers: {
        "Content-Type": "application/json"
      },
      body: "testing blah"
    }

    response.respond(res, testmap)

    expect(res._map).toEqual(testmap)
  })

  it("throws on unexpected type or unknown object type", () => {
    const f = (arg) => {
      return () => {
        response.respond(res, arg)
      }
    }

    // empty
    expect(f()).toThrow()
    // function
    expect(f(function(){})).toThrow()
  })

  it("accepts shorthand for json response")
})
