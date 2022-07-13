"use strict"

const fs = require("fs")
const path = require("path")
const https = require("https")
const data = require(path.resolve(__dirname, "assets/podcasts.json"))

function fetchURL(url) {
  console.log(`trying to fetch from : ${url}`)
  return new Promise(resolve => {
    https.get(url, res => {
      res.setEncoding("utf8")
      let body = ""
      res.on("data", data => {
        body += data
      })
      res.on("end", () => {
        resolve(body)
      })
    })
  })
}

async function init() {
  for (const [key, value] of Object.entries(data.podcasts)) {
    var body = await fetchURL(value.transcript_url)

    console.log(`writing response to: ${value.id}.json`)
    fs.writeFileSync(
      path.resolve(`${__dirname}/podcasts`, `${value.id}.json`),
      body
    )
  }

  console.log("completed!")
}

init()
