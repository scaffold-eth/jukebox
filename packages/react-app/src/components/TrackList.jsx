import { List } from "antd";
import TrackCard from "./TrackCard";

function TrackList({ tracks, token }) {
  return (
    <List
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        width: "100%",
        maxWidth: "1040px",
      }}
      header={
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10% 30% 30% 30%",
            justifyContent: "space-evenly",
            paddingRight: "100px",
            textAlign: "left",
          }}
        >
          <div>
            <b>Pop</b>
          </div>
          <div>
            <b>Title</b>
          </div>
          <div>
            <b>Artist</b>
          </div>
          <div>
            <b>Album</b>
          </div>
        </div>
      }
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={tracks}
      renderItem={item => <TrackCard track={item} token={token} />}
    />
  );
}

export default TrackList;
