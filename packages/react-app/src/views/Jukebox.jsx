import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

function Jukebox() {
  const [results, setResults] = useState([]);
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

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

  const searchArtists = async () => {
    // todo: move to backend
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });

    setArtists(data.artists.items);
  };

  const onQueryChange = e => {
    console.log("e.target.value", e.target.value);
    setSearchKey(e.target.value);
  };

  const submitSearch = e => {
    e.preventDefault();
    console.log("searching for", searchKey);
    searchArtists(searchKey);
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

  const renderArtists = () => {
    return artists.map(artist => {
      console.log("artist", artist);
      return (
        <div style={{ height: "200px", width: "200px" }} key={artist.id}>
          {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
          {artist.name}
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
          <h1>Search for an Artist</h1>
          <p>
            Type an artist name and click on "Search". Then, click on any album from the results to play 30 seconds of
            its first track.
          </p>
          <div id="search-form">
            <input
              style={{ color: "black" }}
              type="text"
              onChange={e => {
                onQueryChange(e);
              }}
              value={searchKey}
              placeholder="Type an Artist Name"
            />
            <Button
              onClick={e => {
                submitSearch(e);
              }}
            >
              Search
            </Button>
          </div>
          <div style={{ flex: "auto", flexDirection: "row" }}>{renderArtists()}</div>
        </div>
      )}
    </div>
  );
}

export default Jukebox;
