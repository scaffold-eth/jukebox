// import Player from "../components/Player";
import { List } from "antd";
import SpotifyPlayer from "react-spotify-player";

function ArtistList({ artists }) {
  const renderArtistCard = artist => {
    return (
      <div className="w-[500px] min-h-[400px] overflow-hidden mt-4">
        <span className="p-[5px] text-lg">{artist.name}</span>
        <div className="  p-[5px] flex gap-2 flex-row justify-between" key={artist.id}>
          <div className="rounded w-[200px]">
            {artist.images.length ? (
              <img className="w-full rounded" src={artist.images[0].url} alt="" />
            ) : (
              <div>No Image</div>
            )}
          </div>
          <div>{artist.uri ? <p>todo</p> : <span>No URI</span>}</div>
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
        pageSize: 10,
      }}
      className=""
      renderItem={item => renderArtistCard(item)}
      dataSource={artists}
    />
  );
}

export default ArtistList;
