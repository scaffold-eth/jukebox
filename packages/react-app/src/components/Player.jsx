import "./Player.css";

const Player = ({ artist, isPlaying, progressMs }) => {
  const backgroundStyles = {
    backgroundImage: `url(${artist.album?.images[0]?.url})`,
  };

  const progressBarStyles = {
    width: (progressMs * 100) / artist.duration_ms + "%",
  };

  return (
    <div className="player">
      <div className="now-playing__img">
        <img src={artist.album?.images[0]?.url} alt={artist.name} />
      </div>
      <div className="now-playing__side">
        <div className="now-playing__name">{artist.name}</div>
        <div className="now-playing__artist">{artist.artists[0]?.name}</div>
        <div className="now-playing__status">{isPlaying ? "Playing" : "Paused"}</div>
        <div className="progress">
          <div className="progress__bar" style={progressBarStyles} />
        </div>
      </div>
      <div className="background" style={backgroundStyles} />{" "}
    </div>
  );
};

export default Player;
