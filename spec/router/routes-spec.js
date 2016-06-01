const routes = require("../../lib/router/routes")

describe("router.routes", () => {

  it("exports some default shortcut http verb fn for compiling", () => {
    const r = routes.verbs
    expect(typeof r.get).toEqual("function")
    expect(typeof r.put).toEqual("function")
    expect(typeof r.post).toEqual("function")
    expect(typeof r.delete).toEqual("function")
    expect(r.notexist).toBe(undefined)

    // basically returns an array of it's argument plus .method
    const fn = function() {}
    let route = r.get("/path", [], fn)
    expect(route).toEqual(["get", "/path", [], fn])

    route = r.delete("/path/:name", ["a"], fn)
    expect(route).toEqual(["delete", "/path/:name", ["a"], fn])
  })

  it("verb - returns an array of it's arguments", () => {
    const fn = function() {}
    const r = routes.verb("Balsf2", "/1/2/3", [], fn)
    expect(r instanceof Array).toBe(true)
    expect(Array.isArray(r)).toBe(true)
    expect(r).toEqual(["Balsf2", "/1/2/3", [], fn])
  })

  describe("compile", () => {
    it("turns arguments useful for determining a route into a Route object", () => {
      const fn = (a)=>{}
      const Route = routes.compile("GeT", "/some/path", ["blAh"], fn)
      expect(Object.keys(Route)).toEqual(["method", "path", "args", "body"])
      expect(Route.method).toBe("GeT")
      expect(Route.args).toEqual(["blAh"])
      expect(Route.body).toBe(fn)
      expect(Route.path.path).toBe("/some/path")
      expect(Route.path.keys).toEqual([])
      expect(Route.path.re instanceof RegExp).toBe(true)
    })

    const call_test = (invalid) => {
      const valid = ["string", "string", ["array"], ()=>{}]
      invalid.forEach((inv, idx) => {
        const tmp_valid = valid.slice()
        tmp_valid[idx] = inv
        expect(routes.compile.bind(null, ...tmp_valid)).toThrow()
      })
    }

    it("throws for invalid type arguments", () => {
      call_test([123, 123, "a", {}])
    })

    it("throws for empty arguments", () => {
      // can only test for first 2 arguments
      call_test(["", ""])
    })
  })


  describe("decompile", () => {
    it("converts a Route and matched regexp of it's path to a map", () => {
      // paths match but there's nothing to extract
      let Route = routes.compile("get", "/path", ["a"], ()=>{})
      let r = routes.decompile(Route, Route.path.re.exec("/path"))
      expect(r).toEqual(undefined)

      // paths don't match so nothing interesting happens
      Route = routes.compile("get", "/ok/:path", ["a"], ()=>{})
      r = routes.decompile(Route, Route.path.re.exec("/path"))
      expect(r).toEqual(undefined)

      // there's :path but no a
      Route = routes.compile("get", "/ok/:path", ["path", "a"], ()=>{})
      r = routes.decompile(Route, Route.path.re.exec("/ok/123hi"))
      expect(r).toEqual({
        path: "123hi"
      })

      // 'a', and 'no_match' don't work here
      Route = routes.compile("get", "/:super/:duper/:test", ["a", "super", "duper", "test", "no_match"], ()=>{})
      r = routes.decompile(Route, Route.path.re.exec("/a/b/c/"))
      expect(r).toEqual({
        super: "a",
        duper: "b",
        test: "c"
      })
    })
  })

})
