async function fetchJikan(query) {
  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=3`);
  const data = await res.json();
  return data.data.map(anime => ({
    title: anime.title,
    image_url: anime.images.jpg.image_url,
    source: 'Jikan'
  }));
}

async function fetchKitsu(query) {
  const res = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=3`);
  const data = await res.json();
  return data.data.map(anime => ({
    title: anime.attributes.titles.en || anime.attributes.titles.en_jp || anime.attributes.titles.jp || "Sem título",
    image_url: anime.attributes.posterImage.small,
    source: 'Kitsu'
  }));
};

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
};

async function fetchTMDbMovies(query) {
  if (!query) return [];

  const res = await fetch(`https://assistidinhos.onrender.com/api/tmdb/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (!data.results) return [];

  return data.results.slice(0, 5).map(movie => ({
    title: movie.title,
    image_url: movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://placehold.co/200x300?text=Sem+Imagem',
  }));
};

export {fetchAniList, fetchJikan, fetchKitsu, fetchTMDbMovies};