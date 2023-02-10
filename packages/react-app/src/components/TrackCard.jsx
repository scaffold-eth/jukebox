import { List, Progress } from "antd";
import Player from "./Player";

function TrackCard({ track }) {
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
        <Player artist={track} isPlaying={false} progressMs={500000} />
      </div>
    </List.Item>
  );
}

export default TrackCard;
