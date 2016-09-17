const {Response} = require("./response-class")

const fs = require("fs")
const path = require("path")
const Promise = require("bluebird")

const stream = require("stream") // for make_stream

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
 * Returns a new Response with `body` as it's body
 * and by default a 200 status code
 * Additionally if `body` is a (non-empty) string, it will
 * set content type to html and it's content length
 *
 * If it's already a Response it will recreate it.
 * If it's a response map, it is converted into a Response.
 * Leaving the status code and headers untouched.
 *
 * @param {*} body - the body for a response, or a response map
 * @return {Response}
 */
const response = (body) => {
  let rmap
  if (is_response(body)) {
    // just convert or recreate but don't touch!
    rmap = new Response(body.body)
    rmap.status = body.status
    rmap.headers = body.headers
  } else {
    rmap = new Response(body)
    if (typeof body === "string" && body !== "") {
      rmap.type("html")
    }
  }
  return rmap
}

/**
 * Creates a writable stream that can be used with response()
 *
 * @return {stream.Transform}
 */
const make_stream = () => {
  return new stream.Transform({
    transform(data, encoding, callback) {
      this.push(data)
      callback()
    }
  })
}

/**
 * Returns a Promise of a Response of the file
 * Where the body of the Response is a stream
 *
 * A Content-Type is guessed from the file extension.
 *
 * It will set a Content-Length header of the size
 * of the file. As well as the Last-Modified header.
 * NOTE that it is susceptible to time for both fields,
 * so it can be inaccurate. That is, since it is a
 * file stream, there is a moment in time (nanoseconds)
 * where the file is being modified but after the headers
 * are set and before the response is sent.
 * For volatile files, it's recommended to:
 * - strip the Content-Length header and/or switch
 * to chunk transfer
 * - not use this and instead create a Response with
 * the file data as a Buffer
 *
 * @param  {string} file_path path to file
 * @return {Promise} Promise of a Response
 */
const file_response = (file) => {
  const resp = response()

  if (typeof file !== "string") {
    if (typeof file.path !== "string" || typeof file.pipe !== "function") {
      throw new TypeError("Expected a file path (string) or a file stream for `file_response`")
    }
    resp.body = file
    file = file.path
  }

  return new Promise((resolve, reject) => {
    fs.stat(file, (err, fdata) => {
      if (err || !fdata.isFile()) {
        if (!err) err = new TypeError(file + " is not a file.")
        return reject(err)
      }

      resp._file = fdata
      resp._file.filepath = file
      if (!resp.body) {
        resp.body = fs.createReadStream(file)
      }
      resp.type(path.extname(file))
        .len(fdata.size)
        .set("Last-Modified", fdata.mtime.toUTCString())
      resolve(resp)
    })
  })
}

/**
 * returns a Response for a http redirect based
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
 * @return {Response}
 */
const redirect = (status, url) => {
  if (!url) {
    url = status
    status = 302
  }

  if (typeof status !== "number" || typeof url !== "string") {
    throw TypeError("invalid arguments to `redirect`, need (number, string) or (string). number is a optional argument for a valid redirect status code, string is required for the URL to redirect")
  }

  return new Response()
    .status_(status)
    .set("Location", url)
}

/**
 * returns a 500 Response with `err`
 *
 * @param {*} err - typically a Error
 * @return {Response}
 */
const err_response = (err) => {
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
}

module.exports = {
  is_response,
  make_stream,
  response,
  file_response,
  redirect,
  err_response
}
