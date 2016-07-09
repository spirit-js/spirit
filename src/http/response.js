/**
 * checks if `resp` is a valid response map
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
 * returns a 404 response map with `body`
 *
 * @param {*} body - the body of a response-map
 * @return {response-map}
 */
const not_found = (body) => {
  return { status: 404, headers: {}, body }
}

/**
 * returns a 500 response map with `body`
 *
 * @param {*} err - an Error or string
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
  return { status: 500, headers: {}, body }
}

module.exports = {
  internal_err,
  not_found,
  is_response
}
