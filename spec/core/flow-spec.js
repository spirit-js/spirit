const {leaf, define, routes} = require("../../index")
const mock_response = require("../support/mock-response")
/*
 integration tests for control flow and propagation
 for then & catch

 tests define's then and catch
 tests core._handler & router.route and it's use of core.reducep
 */

describe("control flow", () => {

  // errors will bubble up if not handled by any of the catch's
  it("error propagation, errors bubble back up if unhandled", (done) => {
    const generic_mw = (req, res, next) => {
      req.mw_count += 1
      next()
    }

    const app2 = define([
      generic_mw, // mw_count = 3
      // this will match /test
      routes.get("/test", [], () => {
        throw "err"
      })
    ]).catch((err) => {
      // first stop for error catch
      expect(err).toBe("err")
      mock_req.catch_count += 1
      // throwing here causes a new error to bubble up
      throw "new err"
    })

    const app = define([
      routes.get("/", [], ()=>{ return "123" }), // doesn't get called
      generic_mw, // mw_count = 2
      routes.route(app2), // -> app2
      generic_mw, // doesn't get called
    ]).catch((err) => {
      // second stop, gets bubble back to here
      expect(err).toBe("new err")
      mock_req.catch_count += 1
      // not returning anything means "pass" on handling this err
    })

    const site = define([
      generic_mw, // mw_count = 1
      routes.route(app), // -> app
      generic_mw  // doesn't get called
    ]).catch((err) => {
      expect(mock_req.mw_count).toBe(3)
      expect(mock_req.catch_count).toBe(2)
      expect(err).toBe("new err")
      done()
    })

    const handler = leaf(site)

    // req, res
    const mock_req = {
      method: "GET",
      url: "/test",
      mw_count: 0,
      catch_count: 0
    }

    handler(mock_req, mock_response())
  })

  it("route then does not propogate", (done) => {
    const generic_mw = (req, res, next) => {
      req.mw_count += 1
      next()
    }

    const app2 = define([
      generic_mw,
      routes.get("/test", [], () => {
        return "ok!"
      }),
      generic_mw
    ]).then((result) => {
      expect(result).toBe("ok!")
      expect(mock_req.mw_count).toBe(3)
    }).catch((err) => {
      expect(err).toBe("Expected then to return a valid response")
    })

    const app = define([
      generic_mw,
      routes.route(app2)
    ]).then((result) => {
      throw "shouldn't get here"
    }).catch((err) => {
      done()
    })

    const site = define([
      generic_mw,
      routes.route(app),
      generic_mw
    ]).then((result) => {
      throw "shouldn't get here"
    })

    const mock_req = {
      method: "GET",
      url: "/test",
      mw_count: 0
    }
    const handler = leaf(site)
    handler(mock_req, mock_response())
  })

  it("non-route List then never gets called", (done) => {
    const generic_mw = (req, res, next) => {
      req.mw_count += 1
      next()
      return "hi"
    }

    const site = define([
      generic_mw,
      generic_mw
    ]).then((result) => {
      throw "never gets called"
    }).catch((err) => {
      expect(err).toBe(undefined)
      done()
    })

    const mock_req = {
      method: "GET",
      url: "/test",
      mw_count: 0
    }
    const handler = leaf(site)
    handler(mock_req, mock_response())
  })

})
