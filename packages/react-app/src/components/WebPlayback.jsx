import React, { useState, useEffect } from "react";
import Player from "./Player";
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
        volume: 0.5,
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
        <Player artist={track} isPlaying={false} progressMs={500} />

        <button
          className="btn-spotify"
          onClick={() => {
            player.previousTrack();
          }}
        >
          &lt;&lt;
        </button>

        <button
          className="btn-spotify"
          onClick={() => {
            player.togglePlay();
          }}
        >
          {is_paused ? "PLAY" : "PAUSE"}
        </button>

        <button
          className="btn-spotify"
          onClick={() => {
            player.nextTrack();
          }}
        >
          &gt;&gt;
        </button>
      </>
    );
  }
}

export default WebPlayback;
