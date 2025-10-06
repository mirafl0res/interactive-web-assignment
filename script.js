// ----- 1. CONFIG AND SETUP ----- 
const API_KEY = "a6358f7b486c982d7b033fff0ff5581d";
const API_ROOT_LASTFM = "https://ws.audioscrobbler.com/2.0/";
const API_ROOT_MB = "https://musicbrainz.org/ws/2/";
const headers = {
  "User-Agent":
    "Good Vibrations/1.0 (https://github.com/mirafl0res/interactive-web-assignment.git)",
};

// ----- 2. GENERIC HELP FETCHERS -----
const fetchFromLastFm = async (method, params = {}) => {
  const queryParams = new URLSearchParams({
    method,
    api_key: API_KEY,
    format: "json",
    autocorrect: 1,
    ...params,
  });

  const url = `${API_ROOT_LASTFM}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Good Vibrations/1.0 (https://github.com/mirafl0res/interactive-web-assignment.git)",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Last.fm (${method})`, error);
  }
};

const fetchFromMusicBrainz = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    fmt: "json",
    ...params,
  });

  const url = `${API_ROOT_MB}${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`MusicBrainz API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from MusicBrainz (${endpoint}):`, error);
  }
};

// ----- 3. API specific functions -----


/*
const getTopAlbums = async (artistName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.gettopalbums", {
    artist: encodedArtist,
  });

  return data.topalbums?.album || [];
};

const getAlbumInfo = async (artistName, albumName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedAlbum = encodeURIComponent(albumName);
  const data = await fetchFromLastFm("album.getinfo", {
    artist: encodedArtist,
    album: encodedAlbum,
  });

  // Handle missing fields safely
  const album = data.album || {};

  const name = album.name || "Unknown Album";
  const artist = album.artist || "Unknown Artist";
  const playcount = album.playcount || 0;
  const wikiSummary = album.wiki?.summary || "No description available";
  const releaseDate = album.releaseDate || "Unknown";
  const mbid = album.mbid || "Not available";

  // console.log(data.album);

  return { name, artist, playcount, wikiSummary, releaseDate, mbid };
};

// -- 4. DATA MERGING LOGIC ---

// --- 5. APP LOGIC ---

// --- 6. TESTING UTILITIES ---
const testMethod = async (method, params) => {
  const data = await fetchFromLastFm(method, params);
  console.log(`--- Response for ${method} ---`);
  console.dir(data, { depth: null }); // Show entire object
};

// Example usage:

(async () => {
  await testMethod("album.getinfo", {
    artist: "Kanye West",
    album: "Graduation",
  });

  await testMethod("artist.gettopalbums", {
    artist: "Kanye West",
  });

  await testMethod("track.getInfo", {
    artist: "Kanye West",
    track: "Stronger",
  });

  await testMethod("artist.getsimilar", {
    artist: "Kanye West",
    limit: 5,
  });
})();

*/