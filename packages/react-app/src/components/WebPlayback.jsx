import { Progress, Button } from "antd";
import { green } from "@ant-design/colors";
import React, { useState, useEffect } from "react";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);

  // useEffect (() => {
  //     if(!trackToplay) return;
  //     setTrack(trackToplay)

  // },[trackToplay])

  //https://api.spotify.com/v1/me/player/queue
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "ScaffoldEth Jukebox",
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 1,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", state => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        console.log("player satate : ", state);
        console.log(current_track);

        player.getCurrentState().then(state => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b> Instance not active. Transfer your playback using your Spotify app </b>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="flex flex-row justify-between mb-10">
          <div className="flex flex-row mt-5">
            <div className="flex align-middle h-10 w-10 mr-2">
              <img
                style={{ borderRadius: "50%" }}
                src={current_track?.album?.images[0]?.url}
                alt={current_track?.name}
              />
            </div>
            <div className="mr-2">
              <Button
                className=""
                // disabled={}
                onClick={() => {
                  console.log("play/pause");
                  player.togglePlay();
                }}
              >
                {is_paused ? "Play" : "Pause"}
              </Button>
            </div>
            <div className="mt-1">
              <Progress
                className="mx-2 h-6"
                size="small"
                percent={55.5}
                steps={50}
                strokeWidth={6}
                strokeColor={green[6]}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;
