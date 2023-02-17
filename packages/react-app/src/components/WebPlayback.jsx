import { Progress, Button } from "antd";
import { green } from "@ant-design/colors";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import { useThemeSwitcher } from "react-css-theme-switcher";

const track = {
  name: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

const spotifyApi = new SpotifyWebApi({
  client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

function WebPlayback({ token }) {
  const [player, setPlayer] = useState(undefined);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState(track);
  const [showQueue, toggelShowQueue] = useState(false);
  const [queued, setQueued] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0); //in %
  const [state, setState] = useState(); //in %

  var bgColor = "bg-slate-50";
  const theme = useThemeSwitcher();
  if (theme.currentTheme == "dark") {
    bgColor = "bg-black";
  }

  useEffect(() => {
    if (!token) return;
    spotifyApi.setAccessToken(token);
    console.log(token);
  }, [token]);

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

  useEffect(() => {
    let timeId;
    let position;
    let duration;
    async function getPosition() {
      const currentState = await player.getCurrentState();
      duration = currentState.duration;
      position = currentState.position;
      const percent = (position / duration) * 100;
      setCurrentPosition(percent);
    }
    if (is_active) {
      if (!is_paused) {
        timeId = setInterval(() => {
          getPosition();
        }, 1000); //every sec
      } else {
        clearInterval(timeId);
      }
    }
  }, [is_active, is_paused]);

  //https://api.spotify.com/v1/me/player/queue
  async function getQueued() {
    const newQueue = await axios.get("https://api.spotify.com/v1/me/player/queue", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // const newQueue = await spotifyApi.getMyCurrentPlayingTrack();
    console.log(newQueue);
    setQueued(newQueue.data.queue);
  }

  // if (!is_active) {
  //   return (
  //     <>
  //       <div className="container">
  //         <div className="main-wrapper">
  //           <b> Instance not active. Transfer your playback using your Spotify app </b>
  //         </div>
  //       </div>
  //     </>
  //   );
  // } else {
  return (
    <>
      <div
        className={`flex flex-row justify-between mb-10 py-1 px-5 rounded-full ${bgColor} border-solid border border-[#1890ff]`}
      >
        <div className=" relative flex flex-row items-center">
          <div className="flex align-middle h-10 w-10 mr-2">
            <img style={{ borderRadius: "50%" }} src={current_track?.album?.images[0]?.url} alt={current_track?.name} />
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
          <div className="mt-1 px-8">
            <Progress
              className="mx-2 h-6"
              size="small"
              percent={currentPosition}
              steps={100}
              strokeWidth={6}
              strokeColor={green[6]}
              showInfo={false}
            />
          </div>
          {showQueue ? (
            <div
              className={`absolute top-[-280px] w-64 h-64 right-0 overflow-auto flex flex-row justify-start mb-10 py-1 px-5 rounded-lg ${bgColor} border-solid border border-[#1890ff]`}
            >
              <ul>
                {queued.map(track => (
                  <li key={track.id}>{track.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button
            onClick={() => {
              getQueued();
              toggelShowQueue(!showQueue);
            }}
          >
            Queue
          </Button>
        </div>
      </div>
    </>
  );
}
// }

export default WebPlayback;
