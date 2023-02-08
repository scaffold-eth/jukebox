import { Button, Radio } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-player";
import TrackList from "../components/TrackList";
// import Player from "../components/Player";

function Jukebox() {
  // const [results, setResults] = useState([]);
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchType, setSearchType] = useState("artist");
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

  // const fetchTracks = (albumId, callback) => {
  //   fetch({
  //     url: "https://api.spotify.com/v1/albums/" + albumId,
  //     success: function (response) {
  //       callback(response);
  //     },
  //   });
  // };

  // const searchAlbums = query => {
  //   fetch({
  //     url: "https://api.spotify.com/v1/search",
  //     data: {
  //       q: query,
  //       type: "album",
  //     },
  //     success: function (response) {
  //       // todo: add error handling
  //       console.log("response", response);
  //       setResults(response);
  //     },
  //   });
  // };

  const search = async () => {
    // todo: add track search
    // if (searchType === "track") {
    //   fetchTracks(albumId, () => {});
    // }
    // todo: move to backend
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: searchType ?? "artist",
      },
    });

    if (searchType === "artist") {
      setArtists(data.artists.items);
    }
    if (searchType === "track") {
      setTracks(data.tracks.items);
    }
  };

  const onQueryChange = e => {
    console.log("e.target.value", e.target.value);
    setSearchKey(e.target.value);
  };

  const submitSearch = e => {
    e.preventDefault();
    console.log("searching for", searchKey);
    search(searchKey);
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find(elem => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const searchTypeChanged = e => {
    setSearchType(e.target.value);
  };

  const renderArtists = () => {
    return artists.map(artist => {
      console.log("artist", artist);
      return (
        <div>
          <div
            style={{ height: "200px", width: "200px", padding: "5px", display: "flex", flexGrow: "initial" }}
            key={artist.id}
          >
            <div style={{ borderRadius: "5px" }}>
              {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
            </div>
            <span style={{ padding: "5px" }}>{artist.name}</span>
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
    });
  };

  return (
    <div class="container">
      {!token ? (
        <a
          style={{ marginTop: "20px" }}
          href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <div>
          <button style={{ marginTop: "20px", color: "black" }} onClick={logout}>
            Logout
          </button>
          <h1>
            Search for {searchType === "artist" ? "an" : "a"} {searchType}
          </h1>
          <p>
            Type {searchType === "artist" ? "an" : "a"} {searchType} name and click on "Search".
          </p>
          <div id="search-form">
            <Radio.Group
              onChange={e => {
                searchTypeChanged(e);
              }}
              defaultValue="artist"
              buttonStyle="solid"
            >
              <Radio.Button value="artist">Artist</Radio.Button>
              <Radio.Button value="track">Track</Radio.Button>
            </Radio.Group>
            {/* todo: add a select for which type of search they want ie: artist, track, etc. */}
            <input
              style={{ color: "black", margin: "10px" }}
              type="text"
              onChange={e => {
                onQueryChange(e);
              }}
              value={searchKey}
              placeholder={`Type ${searchType} name...`}
            />
            <Button
              onClick={e => {
                submitSearch(e);
              }}
            >
              Search
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: "15px",
              padding: "5px",
            }}
          >
            {searchType === "artist" && artists.length ? renderArtists() : null}
            {searchType === "track" && tracks.length ? <TrackList tracks={tracks} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jukebox;
