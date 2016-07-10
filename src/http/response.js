const {Response} = require("./response-map")
const {size_of} = require("./utils")

/**
 * checks if `resp` is a valid response map
 * this test will return true for a Response too
 *
 * @param {*} resp - object to check
 * @return {boolean}
 */
const is_response = (resp) => {
  if (typeof resp === "object"
      && resp !== null
      && typeof resp.status === "number"
      && typeof resp.headers === "object"
      && !Array.isArray(resp.headers)) {
    return true
  }
  return false
}

/**
 * returns a 404 Response with `body`
 *
 * @param {*} body - the body of a response-map
 * @return {Response}
 */
const not_found = (body) => {
  return new Response(body)
    .status_(404)
    .len(size_of(body))
}

/**
 * returns a 500 response map with `err`
 *
 * @param {*} err - typically an Errors
 * @return {response-map}
 */
const internal_err = (err) => {
  if (!err) {
    err = ""
  }
  let body = err.toString()
  if (err instanceof Error) {
    body += "\n\n" + err.stack
  }
  if (!body) {
    body = "An error occured, but there was no error message given."
  }
  return new Response(body)
    .status_(500)
    .len(size_of(body))
}

module.exports = {
  internal_err,
  not_found,
  is_response
}
