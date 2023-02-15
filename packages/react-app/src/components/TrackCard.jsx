import { List, Progress, Button } from "antd";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect } from "react";

const spotifyApi = new SpotifyWebApi({
  client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
});

function TrackCard({ track, token }) {
  useEffect(() => {
    if (!token) return;
    spotifyApi.setAccessToken(token);
    console.log(token);
  }, [token]);

  async function addToQueue(track) {
    console.log("play :", track.uri);
    try {
      spotifyApi.addToQueue([track.uri]);
    } catch (err) {
      console.error(err);
    }
  }

  async function play(track) {
    try {
      spotifyApi.play({ uris: [track.uri] });
    } catch (err) {
      console.error(err);
    }
  }

  function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  console.log("track", track);
  const { id, artists, album, duration_ms: duration, name } = track;
  return (
    <List.Item
      key={id}
      style={{ padding: "5px", fontSize: "0.9em" }}
      extra={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img style={{ borderRadius: "50%", overflow: "hidden" }} width={40} alt={name} src={album.images[0].url} />
          <span style={{ fontSize: "0.75em" }}>Duration: {millisToMinutesAndSeconds(duration)}</span>
        </div>
      }
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 28% 24% 28% 10%",
          justifyContent: "space-evenly",
          textAlign: "left",
          alignItems: "center",
        }}
      >
        <div style={{ width: "75px" }}>
          <Progress percent={track.popularity} />
        </div>
        <div style={{ cursor: "pointer" }}>
          <span>{name}</span>
        </div>
        <div>
          <span>{artists[0].name}</span>
        </div>
        <div>
          <span>{album.name}</span>
        </div>
        <div className="flex">
          <Button alt={"Add to Queue"} onClick={() => addToQueue(track)}>
            Add
          </Button>
          <Button alt={"Play"} onClick={() => play(track)}>
            Play
          </Button>
        </div>
      </div>
    </List.Item>
  );
}

export default TrackCard;
