import { pokemones } from "./db/pokemones.js";

const app = document.querySelector("#app");
const countElement = document.querySelector("#pokemon-count");

app.innerHTML = `
  <section class="pokedex-section">
    <div id="pokedex-gallery" class="pokedex-gallery"></div>
  </section>
`;

const pokedexGallery = document.querySelector("#pokedex-gallery");

const normalizarTipo = (tipo) => {
  return tipo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

const formatearNumero = (id) => {
  return `N.º ${String(id).padStart(3, "0")}`;
};

for (const pokemon of pokemones) {
  const tiposHTML = pokemon.tipo
    .map((tipo) => {
      const clase = normalizarTipo(tipo);

      return `
        <span class="type type-${clase}">
          ${tipo}
        </span>
      `;
    })
    .join("");

  pokedexGallery.innerHTML += `
    <article class="pokemon-card">
      <div class="pokemon-image">
        <img
          src="${pokemon.imagen}"
          alt="${pokemon.nombre}"
          loading="lazy"
        />
      </div>

      <div class="pokemon-info">
        <span class="pokemon-id">
          ${formatearNumero(pokemon.id)}
        </span>

        <h2>${pokemon.nombre}</h2>

        <div class="pokemon-types">
          ${tiposHTML}
        </div>

        <p class="pokemon-rareza">
          ${pokemon.rareza}
        </p>

        <button
          class="btn-detalle"
          data-id="${pokemon.id}"
        >
          Ver detalles
        </button>
      </div>
    </article>
  `;
}

if (countElement) {
  countElement.textContent = String(pokemones.length).padStart(2, "0");
}
