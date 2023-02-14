import { Button, Progress } from "antd";
import { green } from "@ant-design/colors";

const Player = ({ artist, isPlaying, progressMs }) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-row mt-5">
        <div className="flex align-middle h-10 w-10 mr-2">
          <img src={artist.album?.images[0]?.url} alt={artist.name} />
        </div>
        <div className="mr-2">
          <Button
            className=""
            onClick={() => {
              console.log("play/pause");
            }}
          >
            {isPlaying ? "Pause" : "Play"}
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
  );
};

export default Player;
