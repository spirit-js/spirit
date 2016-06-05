/**
 * checks if `resp` is a valid leaf response map
 *
 * @param {*} resp - object to check
 * @return {boolean}
 */
const is_response = (resp) => {
  if (typeof resp === "object"
      && typeof resp.status === "number"
      && typeof resp.headers === "object") {
    return true
  }
  return false
}

/**
 * returns a response map for a http redirect based
 * on status code and url, default status code is 302
 *
 * moved-permanently 301
 * found 302
 * see-other 303
 * temporary-redirect 307
 * permanent-redirect 308
 *
 * @param {number} status - http status code
 * @param {string} url - url to redirect to
 * @return {response-map}
 */
const redirect = (status=302, url) => {
  if (typeof status !== "number" || typeof url !== "string") {
    throw TypeError("invalid arguments to `redirect`, need (number, string) or (string). number is a optional argument for a valid redirect status code, string is required for the URL to redirect")
  }
  return { status, headers: { "Location": url }, body: "" }
}

/**
 * Sets the content type of a response map to json
 *
 * @param {response-map} resp - leaf response map
 * @return {response-map}
 */
const json = (resp) => {
  return content_type(resp, "application/json")
}

/**
 * sets the content type of a response map to `type`
 *
 * @param {response-map} resp - leaf response map
 * @param {string} type - a http Content-Type value
 * @return {response-map}
 */
const content_type = (resp, type) => {
  resp.headers["Content-Type"] = type
  return resp
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
 * @param {*} body - the body of a response-map
 * @return {response-map}
 */
const internal_err = (body) => {
  return { status: 500, headers: {}, body }
}

/**
 * returns a 200 response map with `body`
 *
 * @param {*} body - the body of a response-map
 * @return {response-map}
 */
const response = (body) => {
  return {
    status: 200,
    headers: {},
    body
  }
}


