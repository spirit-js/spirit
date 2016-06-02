const {leaf, define, routes} = require("../../index")
const mock_response = require("../support/mock-response")
/*
 integration tests for control flow and propagation
 for then & catch

 tests define's then and catch
 tests core._handler & router.route and it's use of core.reducep
 */

describe("control flow", () => {

  it("promises in catch ok")

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

    handler(mock_req, mock_response)
  })

  it("then")
})
