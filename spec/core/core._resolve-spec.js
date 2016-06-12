const core = require("../../lib/core/core")

describe("_resolve", () => {
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

    core._resolvep_rmap(p).then((result) => {
      expect(result).toEqual({
        status: 123,
        headers: {},
        body: "hi!"
      })
      done()
    })
  })

  it("returns the promise passed in if it's resolved value is a response map but non-promise body", (done) => {
    const p = Promise.resolve({
      status: 123,
      headers: {a:1},
      body: "yay"
    })

    core._resolvep_rmap(p).then((result) => {
      expect(result).toEqual({
        status: 123,
        headers: {a:1},
        body: "yay"
      })
      done()
    })
  })

  it("returns the promise passed in if it's resolved value is not a response map", (done) => {
    const p = Promise.resolve(123)
    core._resolvep_rmap(p).then((result) => {
      expect(result).toBe(123)
      done()
    })
  })
})
