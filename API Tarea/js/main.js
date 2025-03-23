const header = document.querySelector("header");
const logoMenu = header.lastElementChild;
const menu = document.querySelector(".menu__Lista");
logoMenu.addEventListener("click", () => {
    menu.classList.toggle("show");
    console.log("clcik");
})

const createShowCard = (show) => {
    const card = document.createElement("section");
    card.classList.add("show-card");
    card.dataset.showId = show.id;

    const image = document.createElement("img");
    image.classList.add("show-image");
    image.src = show.image?.medium || "";
    image.alt = show.name;

    const showInfo = document.createElement("section");
    showInfo.classList.add("show-info");

    const name = document.createElement("h2");
    name.classList.add("show-name");
    name.textContent = show.name;

    const genres = document.createElement("p");
    genres.classList.add("show-genres");
    genres.textContent = `Géneros: ${show.genres.join(", ")}`;

    const premiered = document.createElement("p");
    premiered.classList.add("show-premiered");
    premiered.textContent = `Estrenado: ${show.premiered || "Desconocido"}`;

    const summary = document.createElement("div");
    summary.classList.add("show-summary");
    summary.innerHTML = show.summary || "<em>Sin descripción disponible.</em>";

    showInfo.appendChild(name);
    showInfo.appendChild(genres);
    showInfo.appendChild(premiered);
    showInfo.appendChild(summary);

    card.appendChild(image);
    card.appendChild(showInfo);

    card.addEventListener("click", () => {
        loadEpisodes(show.id);
    });

    return card;
};

const loadShows = async (query = "girls") => {
    const showGrid = document.getElementById("show-grid");
    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
        const shows = response.data;

        showGrid.innerHTML = "";

        for (const item of shows) {
            const show = item.show;
            const showCard = createShowCard(show);
            showGrid.appendChild(showCard);
        }
    } catch (error) {
        console.error("Error", error);
    }
};

const loadEpisodes = async (showId) => {
    const showGrid = document.getElementById("show-grid");
    try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${showId}/episodes`);
        const episodes = response.data;

        showGrid.innerHTML = "<h2>Lista de episodios</h2>";

        episodes.forEach((ep) => {
            const epCard = document.createElement("div");
            epCard.classList.add("show-card");

            epCard.innerHTML = `
                <section class="show-info">
                    <h3>${ep.name}</h3>
                    <p>Temporada ${ep.season}, Episodio ${ep.number}</p>
                    <p>${ep.summary || "Sin descripción."}</p>
                </section>
            `;

            showGrid.appendChild(epCard);
        });
    } catch (error) {
        console.error("Error cargando episodios:", error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    loadShows();

    const button = document.getElementById("search-button");
    const input = document.getElementById("show-search");

    button.addEventListener("click", () => {
        const value = input.value.trim();
        if (value) loadShows(value);
    });
});
