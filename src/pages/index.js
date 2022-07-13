import React, { useState } from "react"
import { StaticImage } from "gatsby-plugin-image"

import data from "../../data/data.json"
import podcasts_data from "../../assets/podcasts.json"

import "../css/browser_reset.css"
import "../css/generic.scss"
import "../css/layout.scss"

import { shuffle } from "../utils/utils.js"

import Video from "../components/video.js"
import Dropdown from "../components/dropdown.js"

export default function Home() {
  const { byKeyword, allIDs } = data
  const { wordsList, list } = byKeyword

  const { podcasts } = podcasts_data
  const [activeKeyword, setActiveKeyword] = useState("")
  const [activeSentence, setActiveSentence] = useState("")
  const [activeDropdown, setActiveDropdown] = useState("")

  const updateSelectDropdown = type => {
    setActiveDropdown(type === activeDropdown ? "" : type)
  }

  const selectChange = value => {
    setActiveSentence("")
    setActiveKeyword(value === "default" ? "" : value)
  }

  const sentenceChange = value => {
    setActiveSentence(value === "default" ? "" : value)
  }

  return (
    <main>
      <div className="left-col">
        <div className="logo">
          <span>Unoffical</span>
          <StaticImage
            src="../media/images/logo.png"
            placeholder="blurred"
            quality={100}
            alt="Podiots"
          />
          <span className="subtitle">Out of context</span>
        </div>
      </div>
      <div className="right-col">
        <div className="select-wrapper select-wrapper--keyword">
          <Dropdown
            options={wordsList}
            active={activeKeyword}
            callback={selectChange}
            type={"keyword"}
            updateSelectDropdown={updateSelectDropdown}
            isActive={activeDropdown == "keyword"}
          />
        </div>

        <div
          className={
            "select-wrapper select-wrapper--sentence" +
            (activeKeyword !== "" ? "" : " select-wrapper--hidden")
          }
        >
          {activeKeyword !== "" && (
            <Dropdown
              options={activeKeyword !== "" ? shuffle(list[activeKeyword]) : []}
              active={activeSentence}
              callback={sentenceChange}
              type={"sentence"}
              updateSelectDropdown={updateSelectDropdown}
              isActive={activeDropdown == "sentence"}
            />
          )}
        </div>

        <div
          className={
            "video-wrapper" +
            (activeSentence !== "" ? "" : " video-wrapper--hidden")
          }
        >
          {activeSentence !== "" && (
            <Video
              dataByPod={podcasts[allIDs[activeSentence].pod_id]}
              dataById={allIDs[activeSentence]}
            />
          )}
        </div>
      </div>
    </main>
  )
}
