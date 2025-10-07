// ----- 1. CONFIG AND SETUP -----
const API_KEY = "a6358f7b486c982d7b033fff0ff5581d";
const API_ROOT_LASTFM = "https://ws.audioscrobbler.com/2.0/";
const API_ROOT_MB = "https://musicbrainz.org/ws/2/";
const headers = {
  "User-Agent":
    "Good Vibrations/1.0 (https://github.com/mirafl0res/interactive-web-assignment.git)",
};

/*
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
*/

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
/*
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
*/
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
    tracks: album.tracks?.track || [],
  };
};

const searchAlbum = async (albumName, limit = 20) => {
  const encodedAlbum = encodeURIComponent(albumName);
  const data = await fetchFromLastFm("album.search", {
    album: encodedAlbum,
    limit,
    page: 1,
  });

  const albums = data?.results?.albummatches?.album || [];

  return albums.map((album) => ({
    name: album.name,
    artist: album.artist,
    mbid: album.mbid || "Not available",
    url: album.url,
    images: album.image || [],
  }));
};

const getAlbumTopTags = async (artistName, albumName, limit = 10) => {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedAlbum = encodeURIComponent(albumName);
  const data = await fetchFromLastFm("album.gettoptags", {
    artist: encodedArtist,
    album: encodedAlbum,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
  }));
}

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

const getArtistTopTracks = async (artistName, limit = 20) => {
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

const searchArtist = async (artistName, limit = 20) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.search", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  const artists = data?.results?.artistmatches?.artist || [];

  return artists.map((artist) => ({
    artist: artist.name,
    mbid: artist.mbid || "Not available",
    url: artist.url,
    images: artist.image || [],
  }));
};

const getSimilarArtists = async (artistName, limit = 20) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.getSimilar", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  const artists = data?.similarartists?.artist || [];

  return artists.map((artist) => ({
    artist: artist.name || "Unknown Artist",
    mbid: artist.mbid,
    url: artist.url || "#",
    images: artist.image || [],
  }));
};

const getArtistTopTags = async (artistName, limit = 10) => {
  const encodedArtist = encodeURIComponent(artistName);
  const data = await fetchFromLastFm("artist.gettoptags", {
    artist: encodedArtist,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
  }));
};

// ----- Tag Methods -----
const getTagTopArtists = async (tagName, limit = 20) => {
  const encodedTagName = encodeURIComponent(tagName);
  const data = await fetchFromLastFm("tag.gettopartists", {
    tag: encodedTagName,
    limit,
    page: 1,
  });

  const tagTopArtists = data?.topartists?.artist || [];

  return tagTopArtists.map((artist) => ({
    artist: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    artistRank: artist["@attr"]?.rank || 0,
  }));
};

const getTagTopAlbums = async (tagName, limit = 20) => {
  const encodedTagName = encodeURIComponent(tagName);
  const data = await fetchFromLastFm("tag.getTopAlbums", {
    tag: encodedTagName,
    limit,
    page: 1,
  });

  const topAlbums = data?.albums?.album || [];

  return topAlbums.map((album) => ({
    name: album.name || "Unknown album",
    mbid: album.mbid || "Not available",
    url: album.url || "#",
    artist: album.artist?.name || "Unknown Artist",
    albumRank: album["@attr"]?.rank || 0,
  }));
};

const getTopTags = async (tagName, limit = 20) => {
  const encodedTagName = encodeURIComponent(tagName);
  const data = await fetchFromLastFm("tag.getTopTags", {
    tag: encodedTagName,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    tagCount: tag.count,
  }));
};

const getSimilarTags = async (tagName, limit = 20) => {
  const encodedTagName = encodeURIComponent(tagName);
  const data = await fetchFromLastFm("tag.getSimilar", {
    tag: encodedTagName,
    limit,
    page: 1,
  });

  const similarTags = data?.similartags?.tag || [];

  return similarTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
  }));
};

// ----- Chart Methods -----
const getChartTopArtists = async (limit = 20) => {
  const data = await fetchFromLastFm("chart.gettopartists", {
    limit,
    page: 1,
  });

  const topArtists = data?.artists?.artist || [];

  return topArtists.map((artist) => ({
    name: artist.name,
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    artistRank: artist["@attr"]?.rank || 0,
  }));
};



const getChartTopTracks = async (limit = 20) => {
  const data = await fetchFromLastFm("chart.gettoptracks", {
    limit,
    page: 1,
  });

  const topTracks = data?.tracks?.track || [];

  return topTracks.map((track) => ({
    name: track.name || "Unknown Track",
    artist: track.artist?.name || "Unknown Artist",
    mbid: track.mbid || "Not available",
    url: track.url || "#",
    trackRank: track["@attr"]?.rank || 0,
  }));
};

const getChartTopTags = async (limit = 20) => {
  const data = await fetchFromLastFm("chart.gettoptags", {
    limit,
    page: 1,
  });

  const topTags = data?.tags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
    tagCount: tag.count || 0,
  }));
};

const getChartTopAlbums = async (limit = 20) => {
  const data = await fetchFromLastFm("chart.gettopalbums", {
    limit,
    page: 1,
  });

  const topAlbums = data?.albums?.album || [];

  return topAlbums.map((album) => ({
    name: album.name || "Unknown Album",
    artist: album.artist?.name || album.artist || "Unknown Artist",
    mbid: album.mbid || "Not available",
    url: album.url || "#",
    images: album.image || [],
    albumRank: album["@attr"]?.rank || 0,
  }));
};

// ----- Track Methods -----
const getTrackInfo = async (artistName, trackName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedTrack = encodeURIComponent(trackName);

  const data = await fetchFromLastFm("track.getinfo", {
    artist: encodedArtist,
    track: encodedTrack,
  });

  const track = data?.track || {};

  return {
    name: track.name || "Unknown Track",
    artist: track.artist?.name || "Unknown Artist",
    album: track.album?.title || "Unknown Album",
    playcount: track.playcount || 0,
    listeners: track.listeners || 0,
    duration: track.duration || 0,
    mbid: track.mbid || "Not available",
    tags: track.toptags?.tag || [],
    url: track.url || "#",
    images: track.album?.image || [],
  };
};

const searchTrack = async (trackName, limit = 20) => {
  const encodedTrack = encodeURIComponent(trackName);
  const data = await fetchFromLastFm("track.search", {
    track: encodedTrack,
    limit,
    page: 1,
  });

  const tracks = data?.results?.trackmatches?.track || [];

  return tracks.map((track) => ({
    name: track.name,
    artist: track.artist,
    mbid: track.mbid || "Not available",
    url: track.url,
    images: track.image || [],
  }));
};

const getTrackTopTags = async (artistName, trackName, limit = 10) => {
  const encodedArtist = encodeURIComponent(artistName);
  const encodedTrack = encodeURIComponent(trackName);
  const data = await fetchFromLastFm("track.gettoptags", {
    artist: encodedArtist,
    track: encodedTrack,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
  }));
};



// ----- 5. APP LOGIC -----

// ====== TESTING ======
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

