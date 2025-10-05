const API_KEY = "a6358f7b486c982d7b033fff0ff5581d"
const API_ROOT = "https://ws.audioscrobbler.com/2.0/";

const fetchAlbums = async (artistName) => {
  const encodedArtist = encodeURIComponent(artistName);
  const url = `${API_ROOT}?method=artist.gettopalbums&artist=${encodedArtist}&autocorrect=1&api_key=${API_KEY}&format=json`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Good Vibrations/1.0 (https://github.com/mirafl0res/interactive-web-assignment.git)",
      },
    });

    const parsedData = await response.json();
    const topAlbums = parsedData.topalbums.album;
    console.log(topAlbums);

    const albumContainer = document.createElement("div");
    topAlbums.forEach((album) => {
      const albumName = document.createElement("p");
      albumName.textContent = album.name;
      albumContainer.appendChild(albumName);
    });

    const container = document.getElementsByClassName("container")[0];
    container.appendChild(albumContainer);
  } catch (error) {
    console.error("Error fetching albums:", error);
  }
};

document.getElementById("search-btn").addEventListener("click", () => {
  const artist = document.getElementById("artist-input").value.trim();
  if (artist) fetchAlbums(artist);
});

// console.log("hello");
// fetchAlbums("The Beatles");
