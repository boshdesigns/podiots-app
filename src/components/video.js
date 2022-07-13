import React from "react"

const Video = ({ dataById, dataByPod }) => {
  const { startTime = "", endTime = "", cc = "" } = dataById
  const { yt_id = "", episode_number = "", title = "" } = dataByPod

  return (
    <div className="video-wrapper">
      <div className="video-container">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${yt_id}?start=${startTime}&end=${endTime}&autoplay=1&cc_load_policy=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay"
        ></iframe>
      </div>

      <div className="video-wrapper__caption">
        <div className="sentence">{cc}</div>
        <div className="podiots_id">
          <a
            href={`https://www.youtube.com/watch?v=${yt_id}`}
          >{`Episode ${episode_number} - ${title}`}</a>
        </div>
      </div>
    </div>
  )
}

export default Video
