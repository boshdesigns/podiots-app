import React, { useState } from "react"
import "../css/dropdown.scss"

const Dropdown = ({
  options,
  active,
  callback,
  type,
  updateSelectDropdown,
  isActive,
}) => {
  console.log("isActive", isActive)
  const setIsActiveState = () => {
    updateSelectDropdown(type)

    document.body.style.overflow = !isActive ? "hidden" : ""
    document.body.style.height = !isActive ? "100%" : "auto"
    document.getElementsByTagName("html")[0].style.height = !isActive
      ? "100%"
      : "auto"
  }

  const setTitle = () => {
    let title = active == "" ? type : active

    if (type === "sentence" && options.length > 0) {
      options.find((option, index) => {
        const { sentence, id, pod_id } = option
        if (id === active) {
          title = sentence
          return
        }
      })
    }

    return title === "[ __ ]" ? "[ __ ] (naughty word)" : title
  }

  return (
    <div className={`dropdown dropdown--${type}`}>
      <p className="dropdown__title">{`Choose a ${type}`}</p>
      <div
        className={
          `dropdown__wrapper` + (isActive ? " dropdown__wrapper--active" : "")
        }
      >
        <div className="dropdown__active" onClick={setIsActiveState}>
          {setTitle()}
        </div>
        <div className="dropdown__list__wrapper">
          <ul
            className={
              "dropdown__list" + (!isActive ? " dropdown__list--hidden" : "")
            }
          >
            {options.length > 0 &&
              options.map((option, index) => {
                if (typeof option === "object") {
                  const { sentence, id, pod_id } = option

                  if (active === sentence) return

                  return (
                    <li
                      key={index}
                      onClick={() => {
                        callback(id)
                        setIsActiveState()
                      }}
                    >
                      {sentence}
                    </li>
                  )
                }

                if (active === option) return

                return (
                  <li
                    key={index}
                    onClick={() => {
                      callback(option)
                      setIsActiveState()
                    }}
                  >
                    {option === "[ __ ]" ? "[ __ ] (naughty word)" : option}
                  </li>
                )
              })}
          </ul>
        </div>
        <div className="dropdown__arrow" onClick={setIsActiveState}></div>
      </div>
    </div>
  )
}

export default Dropdown
