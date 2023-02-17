/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

const express = require("express"); // Express web server framework
const request = require("request"); // "Request" library
const querystring = require("querystring");
const cookieParser=require("cookie-parser");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.SPOTIFY_CALLBACK_URI; // Your redirect uri

var accessToken; 
var refreshToken;
var expires_in;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function (length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";


const app = express();

app.use(cookieParser());

app.get("/auth/login", function (req, res) {
  const state = generateRandomString(16);
  // res.cookie(stateKey, state);

  // your application requests authorization
  const scope = "streaming user-read-email user-read-private user-read-playback-state user-read-playback-position user-library-read user-library-modify user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private user-top-read playlist-read-collaborative ugc-image-upload user-follow-read user-follow-modify user-modify-playback-state user-read-currently-playing user-read-recently-played";

  res.redirect("https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
      state
    }));
});

app.get("/auth/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  
    const code = req.query.code || null;
  
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code,
        redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          // eslint-disable-next-line no-buffer-constructor
          new Buffer(client_id + ":" + clientSecret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log(body)
         accessToken = body.access_token;
        //  refreshToken = body.refresh_token;
        //  expires_in = body.expires_in;

      

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/"  //to be replaced by the front url
            // + querystring.stringify({
            //   access_token: accessToken,
            //   refresh_token: refreshToken,
            //   expires_in: expires_in,
            // })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  });

app.get("/auth/token", (req, res) => {
  res.json({
    accessToken: accessToken,
    // refreshToken: refresh_token,
    // expires_in: expires_in,
  })
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  const refreshToken = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        // eslint-disable-next-line no-buffer-constructor
        new Buffer(client_id + ":" + clientSecret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refreshToken,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const accessToken = body.access_token;
      res.send({
        access_token: accessToken,
      });
    }
  });
});

console.log("Listening on 8888");
app.listen(8888);
