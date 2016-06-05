const type_string = (status, headers, body) => {
  if (typeof body === "string") {
    return {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body
    }
  }
}

const type_number = (status, headers, body) => {
  if (typeof body === "number") {
    return type_string(status, headers, body.toString())
  }
}

const type_file = (status, headers, body) => {
  
}

module.exports = {
  type_string,
  type_number,
  type_file
}
