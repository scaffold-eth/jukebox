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
      extra={
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img width={100} alt={name} src={album.images[0].url} />
          <span>Duration: {millisToMinutesAndSeconds(duration)}</span>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div>
          <span>Popularity:</span>
          <Progress percent={track.popularity} />
        </div>
        <div>
          <span>Track: {name}</span>
        </div>
        <div>
          <span>Artist: {artists[0].name}</span>
        </div>
        <div>
          <span>Album: {album.name}</span>
        </div>
        <Button onClick={() => addToQueue(track)}>Add to Queue</Button>
        <Button onClick={() => play(track)}>Play</Button>
      </div>
    </List.Item>
  );
}

export default TrackCard;
