const {callp, is_promise} = require("../../index")
const Promise = require("bluebird")

describe("promise utils", () => {

  describe("callp", () => {
    it("accepts values instead of a function, returns value back wrapped as Promise", (done) => {
      const vals = ["string", 123, {a:1}, [1, 2, 3]]
      const _args = [1, 2] // shouldn't actually be used

      const test = (idx, next) => {
        const v = vals[idx]
        const r = callp(v, _args)
        expect(typeof r.then).toBe("function")
        r.then((resolved_v) => {
          expect(resolved_v).toBe(v)
          if (idx === vals.length - 1) {
            return done()
          }
          test(idx + 1)
        })
      }
      test(0)
    })

    it("if passed function, will call fn with `args`", (done) => {
      const fn = (a, b) => {
        expect(a).toBe(1)
        expect(b).toEqual({ a: 1, b: 2 })
        done()
      }
      const args = [1, { a: 1, b: 2 }]
      callp(fn, args)
    })

    it("sync funcs will have their values wrapped as Promise", (done) => {
      const fn = () => {
        return "ok"
      }

      const r = callp(fn)
      expect(typeof r.then).toBe("function")
      r.then((v) => {
        expect(v).toBe("ok")
        done()
      })
    })

    it("if func returns (rejected) Promise, returns it as-is", (done) => {
      const fn = () => {
        return new Promise((resolve, reject) => {
          reject("err")
        })
      }
      const r = callp(fn)
      expect(typeof r.then).toBe("function")
      r.catch((v) => {
        expect(v).toBe("err")
        done()
      })
    })

    it("if func returns (resolved) Promise, returns it as-is", (done) => {
      const fn = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("ok promise")
          }, 1)
        })
      }
      const r = callp(fn)
      expect(typeof r.then).toBe("function")
      r.then((v) => {
        expect(v).toBe("ok promise")
        done()
      })
    })
  })

  describe("is_promise", () => {
    it("returns true for promise", () => {
      const ok = [new Promise(()=>{}), Promise.resolve()]
      ok.forEach((p) => {
        expect(is_promise(p)).toBe(true)
      })

      // this will return true (unfortunately)
      const not_promise = { then: () => {} }
      expect(is_promise(not_promise)).toBe(true)
    })

    it("returns false for non-promise", () => {
      const not_ok = ["abc", { b: 1 }, () => { return Promise.resolve() }, [Promise.resolve()]]

      not_ok.forEach((not_p) => {
        expect(is_promise(not_p)).toBe(false)
      })
    })
  })

})
