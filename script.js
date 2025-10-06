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
/*
const main = async () => {
  const info = await getAlbumInfo("Kanye West", "Graduation");
  console.log(info);

  const results = await searchAlbum("Graduation");
  console.log(results);
  const findArtist = await searchArtist("James Brown");
  console.log(findArtist);

  const artistInfo = await getArtistInfo("James Brown");
  console.log(artistInfo);
  const tags = await getAlbumTopTags("Kanye West", "Graduation");
  console.log(tags);
};
main();
*/
// ======================
// Display artist page
const displayArtistPage = async (artistName) => {
  // Fetch artist info
  const artist = await getArtistInfo(artistName);
  document.querySelector(".artist-page .artist-name").textContent = artist.artist;
  document.querySelector(".artist-page .artist-bio").textContent = artist.bioSummary;

  // Artist image: pick medium size
  const artistImg = artist.images.find(img => img.size === "medium")?.["#text"] || "";
  document.querySelector(".artist-page .artist-image").src = artistImg;

  // Top albums
  const topAlbums = await getArtistTopAlbums(artistName);
  const albumsContainer = document.querySelector(".artist-top-albums");
  albumsContainer.innerHTML = ""; // clear previous
  topAlbums.forEach((album) => {
    const albumImg = album.images.find(img => img.size === "medium")?.["#text"] || "";
    const div = document.createElement("div");
    div.className = "album-card";

    // Create elements instead of inline JS
    const imgEl = document.createElement("img");
    imgEl.src = albumImg;
    imgEl.alt = album.name;

    const pEl = document.createElement("p");
    pEl.textContent = album.name;

    div.appendChild(imgEl);
    div.appendChild(pEl);
    albumsContainer.appendChild(div);
  });

  // Top tracks
  const topTracks = await getArtistTopTracks(artistName);
  const tracksContainer = document.querySelector(".artist-top-tracks");
  tracksContainer.innerHTML = "";
  topTracks.forEach((track) => {
    const div = document.createElement("div");
    div.className = "track-card";
    div.textContent = `${track.name} (${track.playcount} plays)`;
    tracksContainer.appendChild(div);
  });
};

// ----- EVENT LISTENER FOR SEARCH -----
const searchBtn = document.getElementById("search-btn");
const artistInput = document.getElementById("artist-input");

searchBtn.addEventListener("click", () => {
  const artistName = artistInput.value.trim();
  if (artistName) {
    displayArtistPage(artistName);
  }
});

// Optionally, allow pressing Enter in the input field
artistInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const artistName = artistInput.value.trim();
    if (artistName) {
      displayArtistPage(artistName);
    }
  }
});



// ----- DEFAULT ARTIST ON PAGE LOAD -----
// document.addEventListener("DOMContentLoaded", () => {
//   const defaultArtist = "Radiohead"; // or any artist you want
//   displayArtistPage(defaultArtist);
// });
