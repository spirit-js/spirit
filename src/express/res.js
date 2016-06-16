/*
 * Express helper functions that get attached to http.Response
 *
 * Behaviour should be the same as outlined at:
 * http://expressjs.com/en/4x/api.html#res
 *
 */
const send = require("../core/response").send
const response_map = require("../router/response-map")

const sendFile = () => {
  
}

const redirect = function(status, url) {
  const rmap = response_map.redirect(status, url)
  if (rmap.headers["Location"] === "back") {
    url = this.req.headers["Referrer"] || "/"
    rmap.location(url)
  }
  send(this, rmap)
}

module.exports = {
  sendFile,
  redirect
}
