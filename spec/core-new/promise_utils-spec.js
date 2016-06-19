const p_utils = require("../../lib/core/promise_utils")

describe("promise utils", () => {

  describe("callp", () => {
    const callp = p_utils.callp

    it("accepts string, array values ok", (done) => {
      callp("hi", [1, 2]).then((result) => {
        expect(result).toBe("hi")

        callp([1, 2, "a"], []).then((result) => {
          expect(result).toEqual([1, 2, "a"])
          done()
        })
      })
    })


  })

})
