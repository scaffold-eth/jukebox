function Jukebox() {
  // const templateSource = document.getElementById("results-template").innerHTML;
  // const template = Handlebars.compile(templateSource);
  const resultsPlaceholder = document.getElementById("results");
  const playingCssClass = "playing";
  const audioObject = null;

  const fetchTracks = (albumId, callback) => {
    fetch({
      url: "https://api.spotify.com/v1/albums/" + albumId,
      success: function (response) {
        callback(response);
      },
    });
  };

  const searchAlbums = query => {
    fetch({
      url: "https://api.spotify.com/v1/search",
      data: {
        q: query,
        type: "album",
      },
      success: function (response) {
        // resultsPlaceholder.innerHTML = template(response);
        console.log("response", response);
      },
    });
  };

  // document.getElementById("search-form").addEventListener(
  //   "submit",
  //   function (e) {
  //     e.preventDefault();
  //     searchAlbums(document.getElementById("query").value);
  //   },
  //   false,
  // );

  return (
    <div>
      <div class="container">
        <h1>Search for an Artist</h1>
        <p>
          Type an artist name and click on "Search". Then, click on any album from the results to play 30 seconds of its
          first track.
        </p>
        <form id="search-form">
          <input type="text" id="query" value="" class="form-control" placeholder="Type an Artist Name" />
          <input type="submit" id="search" class="btn btn-primary" value="Search" />
        </form>
        <div id="results"></div>
      </div>
      {/* loop over the results */}
    </div>
  );
}

export default Jukebox;
