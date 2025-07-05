import { fetchJikan, fetchAniList, fetchKitsu, fetchTMDbMovies } from "./fetch.js";

async function handleInput() {
  const nameInput = document.querySelector(".name");
  const imageInput = document.querySelector(".URLimage");
  const searchBox = document.querySelector(".searchBox");
  const query = nameInput.value.trim() || imageInput.value.trim();
  
  if (query === "") {
    searchBox.innerHTML = "";
    searchBox.style.display = "none";
    return;
  }

  try {
    const [jikan, kitsu, anilist, tmdb] = await Promise.all([
      fetchJikan(query),
      fetchKitsu(query),
      fetchAniList(query),
      fetchTMDbMovies(query)
    ]);

    const allResults = [...jikan, ...kitsu, ...anilist, ...tmdb];

    renderSuggestions(allResults);
  } catch(err) {
    console.error("Erro na busca múltipla:", err);
    searchBox.innerHTML = "";
    searchBox.style.display = "none";
  }

  function renderSuggestions(items) {
    searchBox.innerHTML = "";

    if (!items || items.length === 0) {
      searchBox.style.display = "none";
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("searchImg");

      div.innerHTML = `
        <img src="${item.image_url || 'https://via.placeholder.com/50'}" alt="${item.title}">
        <p>${item.title} <small style="color:gray;">[${item.source}]</small></p>
      `;

      div.addEventListener("click", () => {
        nameInput.value = item.title;
        imageInput.value = item.image_url;

        searchBox.innerHTML = "";
        searchBox.style.display = "none";
      });

      searchBox.appendChild(div);
    });

    searchBox.style.display = "block";
  }
}

function debounce(func, wait = 1000) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function suggestions() {
  const nameInput = document.querySelector(".name");
  const imageInput = document.querySelector(".URLimage");
  const searchBox = document.querySelector(".searchBox");

  async function fetchJikan(query) {
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`);
    const data = await res.json();
    return data.data.map(anime => ({
      title: anime.title,
      image_url: anime.images.jpg.image_url,
      source: 'Jikan'
    }));
  }

  async function fetchKitsu(query) {
    const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=10`);
    const data = await res.json();
    return data.data.map(anime => ({
      title: anime.attributes.titles.en || anime.attributes.titles.en_jp || anime.attributes.titles.jp || "Sem título",
      image_url: anime.attributes.posterImage.small,
      source: 'Kitsu'
    }));
  }

  async function fetchAniList(query) {
    const queryGraphQL = `
      query ($search: String) {
        Page(perPage: 3) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
            }
            coverImage {
              medium
            }
          }
        }
      }
    `;

    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryGraphQL,
        variables: { search: query }
      })
    });
    const json = await res.json();
    if (!json.data?.Page?.media) return [];

    return json.data.Page.media.map(anime => ({
      title: anime.title.english || anime.title.romaji || "Sem título",
      image_url: anime.coverImage.medium,
      source: 'AniList'
    }));
  }

  function renderSuggestions(items) {
    searchBox.innerHTML = "";

    if (!items || items.length === 0) {
      searchBox.style.display = "none";
      return;
    }

    items.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("searchImg");

      div.innerHTML = `
        <img src="${item.image_url || 'https://via.placeholder.com/50'}" alt="${item.title}">
        <p>${item.title} <small style="color:gray;">[${item.source}]</small></p>
      `;

      div.addEventListener("click", () => {
          nameInput.value = item.title;
          imageInput.value = item.image_url;
});

      searchBox.appendChild(div);
    });

    searchBox.style.display = "block";
  }
  const handleInputDebounced = debounce(handleInput, 800);
  nameInput.addEventListener("input", handleInput);
  imageInput.addEventListener("input", handleInput);
}

export {handleInput, debounce, suggestions};