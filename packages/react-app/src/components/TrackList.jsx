import { List } from "antd";
import TrackCard from "./TrackCard";

function TrackList({ tracks, token }) {
  return (
    <List
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
      }}
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 5,
      }}
      dataSource={tracks}
      renderItem={item => <TrackCard track={item} token={token} />}
    />
  );
}

export default TrackList;
