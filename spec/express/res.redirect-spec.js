const express_res = require("../../lib/express/res")
const mock_response = require("../support/mock-response")

describe("res.redirect", () => {

//  const orig_send = express_res.__get__("send")

  it("sends a redirect", (done) => {
    const mock_res = mock_response((resp) => {
      expect(resp).toEqual(jasmine.objectContaining({
        status: 303,
        headers: {
          "Location": "booger"
        },
        body: ""
      }))
      done()
    })
    express_res.redirect.call(mock_res, 303, "booger")
  })

  it("url 'back' will goto request's referrerr", (done) => {
    const mock_res = mock_response((resp) => {
      expect(resp).toEqual(jasmine.objectContaining({
        status: 302,
        headers: {
          "Location": "http://blah.com"
        },
        body: ""
      }))
      done()
    })

    mock_res.req = {
      headers: {
        "Referrer": "http://blah.com"
      }
    }
    express_res.redirect.call(mock_res, "back")
  })

  it("url 'back' goes to '/' if no request referrer", (done) => {
    const mock_res = mock_response((resp) => {
      expect(resp).toEqual(jasmine.objectContaining({
        status: 302,
        headers: {
          "Location": "/"
        },
        body: ""
      }))
      done()
    })

    mock_res.req = {
      headers: {}
    }
    express_res.redirect.call(mock_res, "back")
  })

})
