"use client";

import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";

interface TrailerProps {
  trailerUrl: string;
}

class Trailer extends React.Component<TrailerProps> {
  _onReady(event: any) {
    event.target.pauseVideo();
  }

  render() {
    const { trailerUrl } = this.props;

    // Extract the video ID from a full YouTube URL
    const videoId = trailerUrl.split("v=")[1]?.split("&")[0] || trailerUrl;

    const options: YouTubeProps["opts"] = {
      height: "250",
      width: "400",
      playerVars: {
        autoplay: 0,
        controls: 1,
      },
    };

    return (
      <YouTube
        videoId={videoId}
        opts={options}
        onReady={this._onReady}
        id="video"
      />
    );
  }
}

export default Trailer;
