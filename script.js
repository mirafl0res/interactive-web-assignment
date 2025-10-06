// ----- 1. CONFIG AND SETUP -----
const API_KEY = "a6358f7b486c982d7b033fff0ff5581d";
const API_ROOT_LASTFM = "https://ws.audioscrobbler.com/2.0/";
const API_ROOT_MB = "https://musicbrainz.org/ws/2/";
const headers = {
  "User-Agent":
    "Good Vibrations/1.0 (https://github.com/mirafl0res/interactive-web-assignment.git)",
};

const METHODS = {
  album: ["getInfo", "search", "getTopTags"],
  artist: [
    "getInfo",
    "getSimilar",
    "getTopAlbums",
    "getTopTracks",
    "search",
    "getTopTags",
  ],
  chart: ["getTopArtists", "getTopTracks", "getTopTags"],
  geo: ["getTopArtists", "getTopTracks"],
  tag: [
    "getInfo",
    "getSimilar",
    "getTopAlbums",
    "getTopArtists",
    "getTopTags",
    "getTopTracks",
    "getWeeklyChartList",
  ],
  track: ["getInfo", "getSimilar", "getTopTags", "search"],
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

// ----- 3. API SPECIFIC FUNCTIONS -----

// ----- Album Methods -----
const getAlbumInfo = async (artistName, albumName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedAlbum = encodeURIComponent(albumName);

  const data = await fetchFromLastFm("album.getinfo", {
    artist: encodedArtist,
    album: encodedAlbum,
  });

  const album = data?.album || {};

  return {
    name: album.name || "Unknown Album",
    artist: album.artist || "Unknown Artist",
    playcount: album.playcount || 0,
    wikiSummary: album.wiki?.summary || "No description available",
    releaseDate: album.releasedate || "Unknown",
    mbid: album.mbid || "Not available",
    tags: album.tags?.tag || [],
    url: album.url || "#",
    images: album.image || [],
  };
};

const searchAlbum = async (albumName, limit = 30) => {
  const encodedAlbum = encodeURIComponent(albumName);
  const data = await fetchFromLastFm("album.search", {
    album: encodedAlbum,
    limit,
    page: 1,
  });

  return data?.results?.albummatches?.album || [];
};

// ----- Artist Methods ------
const getArtistInfo = async (artistName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.getinfo", {
    artist: encodedArtist,
  });

  const artist = data?.artist || {};

  return {
    artist: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    listeners: artist.stats?.listeners || 0,
    playcount: artist.stats?.playcount || 0,
    bioSummary: artist.bio?.summary || "No description available",
    similarArtists: artist.similar?.artist || [],
    tags: artist.tags?.tag || [],
    url: artist.url || "#",
    images: artist.image || [],
  };
};

const getArtistTopAlbums = async (artistName, limit = 20) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.getTopAlbums", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  const albums = data?.topalbums?.album || [];

  return albums.map((album) => ({
    name: album.name || "Unknown Album",
    artist: album.artist?.name || "Unknown Artist",
    mbid: album.mbid || "Not available",
    playcount: album.playcount || 0,
    url: album.url || "#",
    images: album.image || [],
    albumRank: album["@attr"]?.rank || 0,
  }));
};

const getArtistTopTracks = async (artistName, limit = 10) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.gettoptracks", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  const tracks = data?.toptracks?.track || [];

  return tracks.map((track) => ({
    name: track.name || "Unknown Track",
    artist: track.artist?.name || "Unknown Artist",
    playcount: track.playcount || 0,
    url: track.url || "#",
    rank: track["@attr"]?.rank || 0,
  }));
};

const searchArtist = async (artistName, limit = 5) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.search", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  return data?.results?.artistmatches?.artist || [];
};

// ----- Tag Methods -----
const getTagTopArtists = async (tagName, limit = 10) => {
  const encodedtagName = encodeURIComponent(tagName);
  const data = await fetchFromLastFm("tag.gettopartists", {
    tag: encodedtagName,
    limit,
    page: 1,
  });

  return data?.topartists?.artist || [];
};
// ====== TESTING ======

const main = async () => {
  // const info = await getAlbumInfo("Kanye West", "Graduation");
  // console.log(info);

  // const results = await searchAlbum("Graduation");
  // console.log(results);
  const findArtist = await searchArtist("James Brown");
  console.log(findArtist);

  // const artistInfo = await getArtistInfo("James Brown");
  // console.log(artistInfo);
  // const tags = await getAlbumTopTags("Kanye West", "Graduation");
  // console.log(tags);
};

main();

/*
// Album methods
album.getInfo
album.search
album.getTopTags

// Artist methods
artist.getInfo
artist.getSimilar
artist.getTopAlbums
artist.getTopTracks
artist.search
artist.getTopTags

// Chart methods
chart.getTopArtists
chart.getTopTracks
chart.getTopTags

// Geo methods
geo.getTopArtists
geo.getTopTracks

// Tag methods
tag.getInfo
tag.getSimilar
tag.getTopAlbums
tag.getTopArtists
tag.getTopTags
tag.getTopTracks
tag.getWeeklyChartList

// Track methods
track.getInfo
track.getSimilar
track.getTopTags
track.search
*/

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

*/
// --- 6. TESTING UTILITIES ---
// const testMethod = async (method, params) => {
//   const data = await fetchFromLastFm(method, params);
//   console.log(`--- Response for ${method} ---`);
//   console.dir(data, { depth: null }); // Show entire object
// };

// Example usage:

// (async () => {
//   await testMethod("album.getinfo", {
//     artist: "Kanye West",
//     album: "Graduation",
//   });

// await testMethod("artist.gettopalbums", {
//   artist: "Kanye West",
// });

// await testMethod("track.getInfo", {
//   artist: "Kanye West",
//   track: "Stronger",
// });

// await testMethod("artist.getsimilar", {
//   artist: "Kanye West",
//   limit: 5,
// });
// })();
