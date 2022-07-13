"use strict"

const fs = require("fs")
const path = require("path")
const src = require(path.resolve(__dirname, "assets/podcasts.json"))

const LIST_OF_WORDS = [
  "dave",
  "[ __ ]",
  "nazi",
  "meat",
  "caroline",
  "butterfield",
  "ferret",
  "lockdown",
  "poo",
]

const START_TIME_BUFFER = 100
const END_TIME_BUFFER = 500

function formatTime(time, type) {
  if (type === "start") {
    return parseInt(((parseInt(time) - START_TIME_BUFFER) / 1000).toFixed())
  } else {
    return parseInt(((parseInt(time) + END_TIME_BUFFER) / 1000).toFixed())
  }
}

const byKeyword = {
  wordsList: LIST_OF_WORDS,
  list: {},
}

const byID = []
const allIDs = {}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function writeData() {
  const body = JSON.stringify({ byKeyword, allIDs })

  fs.writeFileSync(path.resolve(`${__dirname}/data`, `data.json`), body)
}

function parseData(path, id) {
  const file = fs.readFileSync(path, "utf8")

  const data = JSON.parse(file)

  for (const [key, value] of Object.entries(data.events)) {
    const startTime = parseInt(value.tStartMs)
    let cc = ""
    if (value.segs && value.segs.length > 1) {
      let currentCount = 1
      const len = value.segs.length

      const endTime = value.segs[value.segs.length - 1]
        ? parseInt(value.segs[value.segs.length - 1].tOffsetMs)
        : 0

      for (const [keyVal, val] of Object.entries(value.segs)) {
        currentCount++

        if (val !== "\n" || val !== "") {
          const word = val.utf8

          cc = cc + word

          if (currentCount === len) {
            if (
              LIST_OF_WORDS.some(v => cc.includes(v)) &&
              LIST_OF_WORDS.find(v => cc.includes(v)) !== cc
            ) {
              const keyword = LIST_OF_WORDS.find(v => cc.includes(v))
              const word = val.utf8
              const offsetFromStart = val.tOffsetMs || 0

              const uuid = uuidv4()
              if (!byKeyword.list[keyword]) {
                byKeyword.list[keyword] = []
              }

              const holder = {}

              holder[uuid] = {}

              holder[uuid].id = uuid
              holder[uuid].sentence = cc
              byKeyword.list[keyword].push(holder[uuid])

              allIDs[uuid] = {}
              allIDs[uuid].cc = cc
              allIDs[uuid].pod_id = id
              allIDs[uuid].sentence = cc
              allIDs[uuid].startTime = formatTime(startTime, "start")
              allIDs[uuid].endTime = formatTime(startTime + endTime, "end")
            }
          }
        }
      }
    }
  }
}

function init() {
  for (const [key, value] of Object.entries(src.podcasts)) {
    if (
      fs.existsSync(path.resolve(`${__dirname}/podcasts`, `${value.id}.json`))
    ) {
      parseData(
        path.resolve(`${__dirname}/podcasts`, `${value.id}.json`),
        value.id
      )
    }
  }
  writeData()
}

init()
