/**
 * writes back to HTTP Response obj the result of
 * a map {status, headers, body}
 *
 * @param {http.Response} res - node http Response object
 * @param {(string|string{})} output - a leaf http map
 */
const respond = (res, output) => {
  let r = {
    status: 200,
    headers: {},
    body: ""
  }

  // guard
  const typ_output = typeof output

  if (typ_output === "undefined") {
    throw "Invalid return from route function"
  }

  if (typ_output === "object" && !Array.isArray(output)) {
    if (true) { // valid map
      r = Object.assign(r, output)
    } else {
      // throw or could be user wants us to send as JSON
      throw("Invalid return from route function")
    }
  } else {
    // if not an object, coerce to string
    if (output && output.toString && typ_output !== "function") {
      r.body = output.toString()
    } else {
      throw("Invalid return from route function")
    }
  }

  // make assumptions of content type based on output IF
  // the headers were not set by user
  //
  // based on the body, make assumption whether to chunk resp
  res.writeHead(r.status, r.headers)
  res.write(r.body)
  res.end()
}

module.exports = {
  respond
}
