import { Button, Radio } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import TrackList from "../components/TrackList";
import ArtistList from "../components/ArtistList";
import { SpotifyLogin } from "../components";
import WebPlayback from "../components/WebPlayback";
import Search from "antd/lib/input/Search";

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
          type: searchType ?? "",
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

  const submitSearch = () => {
    console.log("searching for", searchKey);
    search(searchKey);
  };

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  useEffect(() => {
    async function getToken() {
      //todo to move in a hook or something
      const response = await fetch("/auth/token");
      const json = await response.json();
      setToken(json.accessToken);
      window.localStorage.setItem("token", json.accessToken);
    }
    //todo manage refresh token
    getToken();
  }, []);

  const searchTypeChanged = e => {
    setSearchKey("");
    setSearchType(e.target.value);
    search(searchKey);
  };

  return (
    <div className="">
      {!token ? (
        <SpotifyLogin />
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
          <div id="search-form" style={{ maxWidth: "1040px", margin: "auto" }}>
            {/* todo: add a select for which type of search they want ie: artist, track, etc. */}
            <Search
              className="text-black focus:outline-none focus:border-[2px] m-[10px]"
              type="text"
              onChange={e => {
                onQueryChange(e);
              }}
              onSearch={() => {
                submitSearch();
              }}
              value={searchKey}
              placeholder={`Type ${searchType} name...`}
            />
            <Radio.Group
              onChange={e => {
                searchTypeChanged(e);
              }}
              defaultValue=""
              buttonStyle="solid"
            >
              <Radio.Button value="">All</Radio.Button>
              <Radio.Button value="artist">Artist</Radio.Button>
              <Radio.Button value="track">Track</Radio.Button>
            </Radio.Group>
          </div>
          <div className="flex flex-wrap justify-center items-center  mt-[15px] p-[5px]">
            {searchType === "artist" && artists.length ? <ArtistList artists={artists} /> : null}
            {searchType === "track" && tracks.length ? <TrackList token={token} tracks={tracks} /> : null}
          </div>
          <div className="flex justify-center">
            <WebPlayback token={token} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Jukebox;
