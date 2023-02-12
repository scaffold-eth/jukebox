import { Button, Radio } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TrackList from "../components/TrackList";
import ArtistList from "../components/ArtistList";

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
    await axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: searchType ?? "artist",
        },
      })
      .then(res => {
        console.log("res", res);
        if (searchType === "artist") {
          setArtists(res.data.artists.items);
        }
        if (searchType === "track") {
          setTracks(res.data.tracks.items);
        }
      })
      .catch(err => {
        console.log("err", { err });
        alert(err.message);
        return err.message;
      });
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
    setSearchKey("");
    setSearchType(e.target.value);
  };

  return (
    <div className="">
      {!token ? (
        <a
          className="mt-5"
          href={`${process.env.REACT_APP_AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=${process.env.REACT_APP_RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <div>
          <button className="mt-5 text-black" onClick={logout}>
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
              className="text-black focus:outline-none focus:border-[2px] m-[10px]"
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
          <div className="flex flex-wrap justify-center items-center  mt-[15px] p-[5px]">
            {searchType === "artist" && artists.length ? <ArtistList artists={artists} /> : null}
            {searchType === "track" && tracks.length ? <TrackList tracks={tracks} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jukebox;
