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
  const data = await fetchFromLastFm("album.getinfo", {
    artist: artistName,
    album: albumName,
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

const searchAlbum = async (albumName, limit = 5) => {
  const data = await fetchFromLastFm("album.search", {
    album: albumName,
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

const getAlbumTopTags = async (artistName, albumName, limit = 5) => {
  const data = await fetchFromLastFm("album.gettoptags", {
    artist: artistName,
    album: albumName,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name,
    url: tag.url,
  }));
};

// ----- Artist Methods ------
const getArtistInfo = async (artistName) => {
  const data = await fetchFromLastFm("artist.getinfo", {
    artist: artistName,
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
  const data = await fetchFromLastFm("artist.getTopAlbums", {
    artist: artistName,
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
  const data = await fetchFromLastFm("artist.gettoptracks", {
    artist: artistName,
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
  const data = await fetchFromLastFm("artist.search", {
    artist: artistName,
    limit,
    page: 1,
  });

  const artists = data?.results?.artistmatches?.artist || [];

  return artists.map((artist) => ({
    artist: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    images: artist.image || [],
  }));
};

const getSimilarArtists = async (artistName, limit = 5) => {
  const data = await fetchFromLastFm("artist.getSimilar", {
    artist: artistName,
    limit,
    page: 1,
  });

  const artists = data?.similarartists?.artist || [];

  return artists.map((artist) => ({
    artist: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    images: artist.image || [],
  }));
};

const getArtistTopTags = async (artistName, limit = 5) => {
  const data = await fetchFromLastFm("artist.gettoptags", {
    artist: artistName,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name || "Unknown Tag",
    url: tag.url || "#",
  }));
};

// ----- Tag Methods -----
const getTagTopArtists = async (tagName, limit = 20) => {
  const data = await fetchFromLastFm("tag.gettopartists", {
    tag: tagName,
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
  const data = await fetchFromLastFm("tag.getTopAlbums", {
    tag: tagName,
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
  const data = await fetchFromLastFm("tag.getTopTags", {
    tag: tagName,
    limit,
    page: 1,
  });

  const topTags = data?.toptags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name || "Unknown Tag",
    tagCount: tag.count || 0,
  }));
};

const getSimilarTags = async (tagName, limit = 10) => {
  const data = await fetchFromLastFm("tag.getSimilar", {
    tag: tagName,
    limit,
    page: 1,
  });

  const similarTags = data?.similartags?.tag || [];

  return similarTags.map((tag) => ({
    name: tag.name || "Unknown Tag",
    url: tag.url || "#",
  }));
};

const searchTags = async (tagName, limit = 10) => {
  const data = await fetchFromLastFm("tag.gettopartists", {
    tag: tagName,
    limit,
    page: 1,
  });

  const topArtists = data?.topartists?.artist || [];

  return topArtists.map((artist) => ({
    name: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    artistRank: artist["@attr"]?.rank || 0,
    tagName,
  }));
};

// ----- Chart Methods -----
const getChartTopArtists = async (limit = 10) => {
  const data = await fetchFromLastFm("chart.gettopartists", {
    limit,
    page: 1,
  });

  const topArtists = data?.artists?.artist || [];

  return topArtists.map((artist) => ({
    name: artist.name || "Unknown Artist",
    mbid: artist.mbid || "Not available",
    url: artist.url || "#",
    artistRank: artist["@attr"]?.rank || 0,
  }));
};

const getChartTopTracks = async (limit = 10) => {
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

const getChartTopTags = async (limit = 10) => {
  const data = await fetchFromLastFm("chart.gettoptags", {
    limit,
    page: 1,
  });

  const topTags = data?.tags?.tag || [];

  return topTags.map((tag) => ({
    name: tag.name || "Unknown Tag",
    url: tag.url || "#",
    tagCount: tag.count || 0,
  }));
};

const getChartTopAlbums = async (limit = 10) => {
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
  const data = await fetchFromLastFm("track.getinfo", {
    artist: artistName,
    track: trackName,
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

const searchTrack = async (trackName, limit = 10) => {
  const data = await fetchFromLastFm("track.search", {
    track: trackName,
    limit,
    page: 1,
  });

  const tracks = data?.results?.trackmatches?.track || [];

  return tracks.map((track) => ({
    name: track.name || "Unknown Track",
    artist: track.artist || "Unknown Artist",
    mbid: track.mbid || "Not available",
    url: track.url || "#",
    images: track.image || [],
  }));
};

const getTrackTopTags = async (artistName, trackName, limit = 5) => {
  const data = await fetchFromLastFm("track.gettoptags", {
    artist: artistName,
    track: trackName,
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

// --------------------------------
// UI: Home, Search, Results, Pages
// --------------------------------

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");
const resultsContainer = document.getElementById("results-container");

const setHidden = (element, hidden = true) => {
  if (!element) return;
  element.classList.toggle("hidden", hidden);
  element.setAttribute("aria-hidden", hidden ? "true" : "false");
};

setHidden(resultsContainer, true);

const displaySearchResults = (results, type) => {
  resultsContainer.innerHTML = "";
  setHidden(resultsContainer, false);
  resultsContainer.focus();

  setHidden(document.getElementById("artist-section"), true);
  setHidden(document.getElementById("album-section"), true);
  setHidden(document.getElementById("track-section"), true);
  setHidden(document.getElementById("tag-section"), true);
  setHidden(document.getElementById("home-section"), true);

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p>No results found.</p>";
    return;
  }
  const list = document.createElement("ul");
  list.classList.add("results-list");
  list.setAttribute("role", "listbox"); // ARIA role
  list.setAttribute("aria-label", `Search results for ${type}`);
  if (type === "tag") {
    const topArtistsHeading = document.createElement("h2");
    topArtistsHeading.textContent = `Top Artists For Tag: ${results[0].tagName}`;
    list.appendChild(topArtistsHeading);
  }

  results.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("result-item");
    li.setAttribute("role", "option");
    li.setAttribute("tabindex", "0"); // make focusable
    li.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" || e.key === " ") {
        li.click(); // allow keyboard selection
      }
    });

    const decodedName = decodeURIComponent(item.name || item.artist || "");
    const decodedArtist = decodeURIComponent(
      item.artist || item.artist?.name || ""
    );

    if (type === "artist") {
      li.textContent = decodedName;
    } else if (type === "album") {
      li.textContent = `${decodedName} — ${decodedArtist}`;
    } else if (type === "track") {
      li.textContent = `${decodedName} — ${decodedArtist}`;
    } else if (type === "tag") {
      li.textContent = decodedName;
    }

    li.addEventListener("click", async () => {
      // Hide results and all sections first
      setHidden(resultsContainer, true);
      setHidden(document.getElementById("artist-section"), true);
      setHidden(document.getElementById("album-section"), true);
      setHidden(document.getElementById("track-section"), true);
      setHidden(document.getElementById("tag-section"), true);
      setHidden(document.getElementById("home-section"), true);
      setHidden(document.getElementById("user-section"), true);

      if (type === "artist" || type === "tag") {
        const info = await getArtistInfo(item.artist || item.name);
        const section = document.getElementById("artist-section");
        if (section) {
          section.innerHTML = `
        <h2>${info.artist}</h2>
        <p><strong>Listeners:</strong> ${info.listeners}</p>
        <p><strong>Playcount:</strong> ${info.playcount}</p>
        <div><strong>Bio:</strong> ${info.bioSummary}</div>
        <div><strong>Tags:</strong> ${info.tags
          .map((tag) => tag.name)
          .join(", ")}</div>
        <div><strong>Similar Artists:</strong> ${info.similarArtists
          .map((artist) => artist.name)
          .join(", ")}</div>
        <a href="${info.url}" target="_blank">View on Last.fm</a>
      `;
          setHidden(section, false);
          section.focus();
        }
      } else if (type === "album") {
        const info = await getAlbumInfo(item.artist, item.name);
        const section = document.getElementById("album-section");
        if (section) {
          section.innerHTML = `
        <h2>${info.name}</h2>
        <p><strong>Artist:</strong> ${info.artist}</p>
        <p><strong>Playcount:</strong> ${info.playcount}</p>
        <p><strong>Release Date:</strong> ${info.releaseDate}</p>
        <div><strong>Tracks:</strong> ${info.tracks
          .map((track) => track.name)
          .join(", ")}</div>
        <div><strong>Bio:</strong> ${info.wikiSummary}</div>
        <div><strong>Tags:</strong> ${info.tags
          .map((tag) => tag.name)
          .join(", ")}</div>
        <a href="${info.url}" target="_blank">View on Last.fm</a>
      `;
          setHidden(section, false);
          section.focus();
        }
      } else if (type === "track") {
        const info = await getTrackInfo(item.artist, item.name);
        const section = document.getElementById("track-section");
        if (section) {
          section.innerHTML = `
        <h2>${info.name}</h2>
        <p><strong>Artist:</strong> ${info.artist}</p>
        <p><strong>Album:</strong> ${info.album}</p>
        <p><strong>Listeners:</strong> ${info.listeners}</p>
        <p><strong>Playcount:</strong> ${info.playcount}</p>
        <div><strong>Tags:</strong> ${info.tags
          .map((tag) => tag.name)
          .join(", ")}</div>
        <a href="${info.url}" target="_blank">View on Last.fm</a>
      `;
          setHidden(section, false);
          section.focus();
        }
      }
    });

    list.appendChild(li);
  });

  resultsContainer.appendChild(list);
};

const performSearch = async (query, type) => {
  let results = [];
  if (type === "artist") {
    results = await searchArtist(query);
  } else if (type === "album") {
    results = await searchAlbum(query);
  } else if (type === "track") {
    results = await searchTrack(query);
  } else if (type === "tag") {
    results = await searchTags(query);
  }
  return { results, type };
};

searchBtn.replaceWith(searchBtn.cloneNode(true));
const newSearchBtn = document.getElementById("search-btn");

newSearchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  const type = searchType.value;
  searchInput.value = "";

  if (!query) return;

  const { results, type: searchTypeUsed } = await performSearch(query, type);
  displayEnhancedSearchResults(results, searchTypeUsed);
});

const renderHomeChart = (items, chartType) => {
  const container = document.getElementById("home-chart-container");
  container.innerHTML = "";

  const list = document.createElement("ol");
  list.classList.add("home-chart-list");

  if (chartType === "tag") {
    const heading = document.createElement("h2");
    heading.textContent = `Top Artists for Tag: ${results.tagName}`;
    resultsContainer.appendChild(heading);

    const list = document.createElement("ul");
    list.classList.add("results-list");

    results.topArtists.forEach((artist) => {
      const li = document.createElement("li");
      li.classList.add("result-item");
      li.textContent = artist.name;
      list.appendChild(li);
    });

    resultsContainer.appendChild(list);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("home-chart-item");

    if (chartType === "artists") {
      li.textContent = item.name;
    } else if (chartType === "tracks") {
      li.textContent = `${item.name} — ${item.artist}`;
    } else if (chartType === "tags") {
      li.textContent = item.name;
    }

    li.addEventListener("click", async () => {
      if (chartType === "artists") {
        const info = await getArtistInfo(item.name);
        const section = document.getElementById("artist-section");
        if (section) {
          section.innerHTML = `
            <h2>${info.artist}</h2>
            <p><strong>Listeners:</strong> ${info.listeners}</p>
            <p><strong>Playcount:</strong> ${info.playcount}</p>
            <div><strong>Bio:</strong> ${info.bioSummary}</div>
            <div><strong>Tags:</strong> ${info.tags
              .map((tag) => tag.name)
              .join(", ")}</div>
            <div><strong>Similar Artists:</strong> ${info.similarArtists
              .map((artist) => artist.name)
              .join(", ")}</div>
            <a href="${info.url}" target="_blank">View on Last.fm</a>
          `;
          setHidden(document.getElementById("home-section"), true);
          setHidden(section, false);
          section.focus();
        }
      } else if (chartType === "tracks") {
        getTrackInfo(item.artist, item.name);
        const section = document.getElementById("track-section");
        if (section) {
          const info = await getTrackInfo(item.artist, item.name);
          section.innerHTML = `
            <h2>${info.name}</h2>
            <p><strong>Artist:</strong> ${info.artist}</p>
            <p><strong>Album:</strong> ${info.album}</p>
            <p><strong>Listeners:</strong> ${info.listeners}</p>
            <p><strong>Playcount:</strong> ${info.playcount}</p>
            <div><strong>Tags:</strong> ${info.tags
              .map((tag) => tag.name)
              .join(", ")}</div>
            <a href="${info.url}" target="_blank">View on Last.fm</a>
          `;
          setHidden(document.getElementById("home-section"), true);
          setHidden(section, false);
          section.focus();
        }
      } else if (chartType === "tags") {
        const tagName = item.name;
        const tagTopArtists = await getTagTopArtists(tagName);
        const section = document.getElementById("tag-section");
        if (section) {
          section.innerHTML = `
            <h2>Top Artists for Tag: ${tagName}</h2>
            <ol>
              ${tagTopArtists
                .map((artist) => `<li>${artist.artist}</li>`)
                .join("")}
            </ol>
            <a href="https://www.last.fm/tag/${encodeURIComponent(
              tagName
            )}" target="_blank">View on Last.fm</a>
          `;
          setHidden(document.getElementById("home-section"), true);
          setHidden(section, false);
          section.focus();
        }
      }
    });

    list.appendChild(li);
  });

  container.appendChild(list);
};

document.addEventListener("DOMContentLoaded", () => {
  setHidden(document.getElementById("home-section"), false);
  searchInput.focus();
});

document.querySelectorAll(".home-buttons button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const chartType = btn.getAttribute("data-chart");

    setHidden(document.getElementById("artist-section"), true);
    setHidden(document.getElementById("album-section"), true);
    setHidden(document.getElementById("track-section"), true);
    setHidden(document.getElementById("user-section"), true);

    let items = [];
    const limit = 10;

    if (chartType === "artists") {
      items = await getChartTopArtists(limit);
    } else if (chartType === "tracks") {
      items = await getChartTopTracks(limit);
    } else if (chartType === "tags") {
      items = await getChartTopTags(limit);
    }

    renderHomeChart(items, chartType);
  });
});

const homeButton = document.getElementById("home-btn");
const siteLogo = document.getElementById("site-logo");
[homeButton, siteLogo].forEach((el) => {
  el.style.cursor = "pointer";
  el.addEventListener("click", () => {
    searchInput.value = "";
    setHidden(document.getElementById("artist-section"), true);
    setHidden(document.getElementById("album-section"), true);
    setHidden(document.getElementById("track-section"), true);
    setHidden(document.getElementById("tag-section"), true);
    setHidden(document.getElementById("user-section"), true);
    setHidden(resultsContainer, true);
    setHidden(document.getElementById("home-section"), false);
    document.getElementById("home-chart-container").innerHTML = "";
  });
});

// ----- ENHANCED SEARCH RESULTS DISPLAY -----
const displayEnhancedSearchResults = (results, type) => {
  resultsContainer.innerHTML = "";
  setHidden(resultsContainer, false);

  // Hide all main sections
  setHidden(document.getElementById("artist-section"), true);
  setHidden(document.getElementById("album-section"), true);
  setHidden(document.getElementById("track-section"), true);
  setHidden(document.getElementById("user-section"), true);
  setHidden(document.getElementById("home-section"), true);

  if (!results || results.length === 0) {
    resultsContainer.innerHTML = "<p class='no-results'>No results found.</p>";
    return;
  }

  // Create results header
  const header = document.createElement("div");
  header.classList.add("results-header");
  header.innerHTML = `
    <h2>Search Results for "${searchInput.value}"</h2>
    <p class="results-count">${results.length} ${type}${results.length !== 1 ? 's' : ''} found</p>
  `;
  resultsContainer.appendChild(header);

  const list = document.createElement("ul");
  list.classList.add("enhanced-results-list");

  // Helper function to get best image
  const getBestImage = (images) => {
    if (!images || images.length === 0) return null;
    
    const sizes = ["extralarge", "large", "medium", "small"];
    for (const size of sizes) {
      const image = images.find(img => img.size === size);
      if (image && image["#text"]) return image["#text"];
    }
    return images[0]?.["#text"] || null;
  };

  results.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("enhanced-result-item");

    const decodedName = decodeURIComponent(item.name || item.artist || "");
    const decodedArtist = decodeURIComponent(item.artist || item.artist?.name || "");
    const imageUrl = getBestImage(item.images) || 'https://via.placeholder.com/150x150?text=No+Image';

    li.innerHTML = `
      <div class="enhanced-result-content">
        <img src="${imageUrl}" alt="${decodedName}" class="enhanced-result-image" 
             onerror="this.src='https://via.placeholder.com/150x150?text=No+Image'">
        <div class="enhanced-result-details">
          <h3 class="enhanced-result-title">${decodedName}</h3>
          ${type !== 'artist' ? `<p class="enhanced-result-artist">${decodedArtist}</p>` : ''}
          <div class="enhanced-result-meta">
            ${item.playcount ? `<span class="meta-item">🎵 ${item.playcount.toLocaleString()} plays</span>` : ''}
            ${item.listeners ? `<span class="meta-item">👥 ${item.listeners.toLocaleString()} listeners</span>` : ''}
            ${item.releaseDate ? `<span class="meta-item">📅 ${item.releaseDate}</span>` : ''}
          </div>
        </div>
        <div class="enhanced-result-action">
          <button class="view-details-btn" data-type="${type}" data-name="${decodedName}" data-artist="${decodedArtist}">
            View Details
          </button>
        </div>
      </div>
    `;

    list.appendChild(li);
  });

  resultsContainer.appendChild(list);

  // Add event listeners to view details buttons
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const type = btn.dataset.type;
      const name = btn.dataset.name;
      const artist = btn.dataset.artist;

      await showEnhancedDetails(type, name, artist);
    });
  });

  // Also make the entire result item clickable
  document.querySelectorAll('.enhanced-result-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      if (!e.target.closest('.view-details-btn')) {
        const btn = item.querySelector('.view-details-btn');
        const type = btn.dataset.type;
        const name = btn.dataset.name;
        const artist = btn.dataset.artist;

        await showEnhancedDetails(type, name, artist);
      }
    });
  });
};

// ----- ENHANCED DETAILS DISPLAY -----
const showEnhancedDetails = async (type, name, artist) => {
  // Hide search results and other sections
  setHidden(resultsContainer, true);
  setHidden(document.getElementById("home-section"), true);
  setHidden(document.getElementById("user-section"), true);

  let section, content;

  const getBestImage = (images) => {
    if (!images || images.length === 0) return null;
    const sizes = ["extralarge", "large", "medium", "small"];
    for (const size of sizes) {
      const image = images.find(img => img.size === size);
      if (image && image["#text"]) return image["#text"];
    }
    return images[0]?.["#text"] || null;
  };

  if (type === "artist") {
    section = document.getElementById("artist-section");
    const info = await getArtistInfo(name);
    const imageUrl = getBestImage(info.images) || 'https://via.placeholder.com/300x300?text=No+Image';
    
    content = `
      <div class="enhanced-artist-header">
        <img class="enhanced-artist-image" src="${imageUrl}" alt="${info.artist}">
        <div class="enhanced-artist-info">
          <h2 class="enhanced-artist-name">${info.artist}</h2>
          <div class="enhanced-artist-stats">
            <div class="stat">
              <span class="stat-number">${info.listeners.toLocaleString()}</span>
              <span class="stat-label">Listeners</span>
            </div>
            <div class="stat">
              <span class="stat-number">${info.playcount.toLocaleString()}</span>
              <span class="stat-label">Plays</span>
            </div>
          </div>
          ${info.tags.length > 0 ? `
            <div class="enhanced-tags">
              ${info.tags.slice(0, 5).map(tag => `<span class="enhanced-tag">${tag.name}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="enhanced-artist-bio">
        <h3>About</h3>
        <p>${info.bioSummary}</p>
      </div>
      <a href="${info.url}" target="_blank" class="enhanced-external-link">View on Last.fm</a>
    `;

  } else if (type === "album") {
    section = document.getElementById("album-section");
    const info = await getAlbumInfo(artist, name);
    const imageUrl = getBestImage(info.images) || 'https://via.placeholder.com/300x300?text=No+Image';
    
    content = `
      <div class="enhanced-album-header">
        <img class="enhanced-album-image" src="${imageUrl}" alt="${info.name}">
        <div class="enhanced-album-info">
          <h2 class="enhanced-album-name">${info.name}</h2>
          <p class="enhanced-album-artist">by ${info.artist}</p>
          <div class="enhanced-album-stats">
            <div class="stat">
              <span class="stat-number">${info.playcount.toLocaleString()}</span>
              <span class="stat-label">Plays</span>
            </div>
            <div class="stat">
              <span class="stat-number">${info.tracks.length}</span>
              <span class="stat-label">Tracks</span>
            </div>
          </div>
          ${info.tags.length > 0 ? `
            <div class="enhanced-tags">
              ${info.tags.slice(0, 5).map(tag => `<span class="enhanced-tag">${tag.name}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="enhanced-album-details">
        <div class="detail-item">
          <strong>Release Date:</strong> ${info.releaseDate}
        </div>
        <div class="enhanced-album-description">
          <h3>About this album</h3>
          <p>${info.wikiSummary}</p>
        </div>
        ${info.tracks.length > 0 ? `
          <div class="enhanced-tracklist">
            <h3>Tracklist</h3>
            <ol class="enhanced-tracks">
              ${info.tracks.map(track => `<li>${track.name}</li>`).join('')}
            </ol>
          </div>
        ` : ''}
      </div>
      <a href="${info.url}" target="_blank" class="enhanced-external-link">View on Last.fm</a>
    `;

  } else if (type === "track") {
    section = document.getElementById("track-section");
    const info = await getTrackInfo(artist, name);
    const imageUrl = getBestImage(info.images) || 'https://via.placeholder.com/300x300?text=No+Image';
    
    content = `
      <div class="enhanced-track-header">
        <img class="enhanced-track-image" src="${imageUrl}" alt="${info.name}">
        <div class="enhanced-track-info">
          <h2 class="enhanced-track-name">${info.name}</h2>
          <p class="enhanced-track-artist">by ${info.artist}</p>
          <p class="enhanced-track-album">from ${info.album}</p>
          <div class="enhanced-track-stats">
            <div class="stat">
              <span class="stat-number">${info.listeners.toLocaleString()}</span>
              <span class="stat-label">Listeners</span>
            </div>
            <div class="stat">
              <span class="stat-number">${info.playcount.toLocaleString()}</span>
              <span class="stat-label">Plays</span>
            </div>
            ${info.duration ? `
              <div class="stat">
                <span class="stat-number">${Math.floor(info.duration / 60000)}:${((info.duration % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                <span class="stat-label">Duration</span>
              </div>
            ` : ''}
          </div>
          ${info.tags.length > 0 ? `
            <div class="enhanced-tags">
              ${info.tags.slice(0, 5).map(tag => `<span class="enhanced-tag">${tag.name}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <a href="${info.url}" target="_blank" class="enhanced-external-link">View on Last.fm</a>
    `;
  }

  if (section) {
    section.innerHTML = content;
    setHidden(section, false);
  }
};