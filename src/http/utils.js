/**
 * the size of in bytes of a string or buffer
 * utf-8 assumed
 *
 * @param {string|Buffer} v - a string or buffer to check
 * @return {number|undefined} size in bytes
 */
const size_of = (v) => {
  if (typeof v === "string") {
    if (v === "") return 0
    return Buffer.byteLength(v)
  }

  if (Buffer.isBuffer(v)) return v.length
  return undefined
}

/**
 * function to get better type information than typeof
 *
 * As with common primitive types:
 * undefined, string, number, symbol, function, boolean
 *
 * It will also identify correctly:
 * null, array, buffer, stream, file-stream
 *
 * And of course, "object" when all else fails
 *
 * @param {*} v - value to extract type information from
 * @return {string} type represented as string
 */
const type_of = (v) => {
  let t = typeof v
  if (t === "object") {
    if (v === null) return "null"

    if (Buffer.isBuffer(v)) return "buffer"

    if (typeof v.pipe === "function") {
      if (typeof v.path === "string") return "file-stream"
      return "stream"
    }

    if (Array.isArray(v)) return "array"
  }
  return t
}

module.exports = {
  type_of,
  size_of
}
