// import Player from "../components/Player";
import { List } from "antd";
import SpotifyPlayer from "react-spotify-player";

function ArtistList({ artists }) {
  const renderArtistCard = artist => {
    return (
      <div>
        <span style={{ padding: "5px" }}>{artist.name}</span>
        <div
          style={{
            height: "100px",
            width: "100px",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
          }}
          key={artist.id}
        >
          <div style={{ borderRadius: "5px" }}>
            {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
          </div>
        </div>
        <div style={{ padding: "5px" }}>
          {artist.uri ? (
            <div>
              <SpotifyPlayer uri={artist.uri} size={{ width: "100%", height: 80 }} view="list" theme="black" />
              {/* todo: <Player artist={artist} isPlaying={false} progressMs={0} /> */}
            </div>
          ) : (
            <span>No URI</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <List
      itemLayout="horizontal"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 6,
      }}
      style={{ margin: "0 auto" }}
      renderItem={item => renderArtistCard(item)}
      dataSource={artists}
    />
  );
}

export default ArtistList;
