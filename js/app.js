import { pokemones } from "./db/pokemones.js";

let app = document.querySelector("#app");

function crearTarjeta(nombre, imagen, id, tipo, rareza) {
  return `
    <article class="pokemon-card">
      <div class="pokemon-image">
        <img src="${imagen}" alt="${nombre}" />
      </div>

      <div class="pokemon-info">
        <span class="pokemon-id">N.º 0${id}</span>

        <h2>${nombre}</h2>

        <div class="pokemon-types">
          <span class="type type-${tipo.toLowerCase()}">
            ${tipo}
          </span>
        </div>

        <p class="pokemon-rareza">${rareza}</p>

        <button class="btn-detalle" data-id="${id}">
          Ver detalles
        </button>
      </div>
    </article>
  `;
}

function crearPantalla(titulo, mensaje) {
  return `
    <section class="pantalla">
      <h2>${titulo}</h2>
      <p>${mensaje}</p>
    </section>
  `;
}

function mostrarBienvenida() {
  app.innerHTML = `
    <section class="pantalla">
      <h2>¡Bienvenido a PokeApp!</h2>
      <p>Usá el menú para comenzar.</p>
    </section>
  `;
}

function mostrarPokedex() {
  app.innerHTML = '<section class="pokedex-section"></section>';

  let pokedexSection = document.querySelector(".pokedex-section");

  pokedexSection.innerHTML =
    '<div id="pokedex-gallery" class="pokedex-gallery"></div>';

  let pokedexGallery = document.querySelector("#pokedex-gallery");

  for (let pokemon of pokemones) {
    console.log(pokemon.nombre);
    console.log(pokemon.imagen);

    pokedexGallery.innerHTML += crearTarjeta(
      pokemon.nombre,
      pokemon.imagen,
      pokemon.id,
      pokemon.tipo[0],
      pokemon.rareza
    );
  }

  return false;
}

function mostrarLogin() {
  app.innerHTML = crearPantalla(
    "Iniciar sesión",
    "Esta sección estará disponible próximamente."
  );

  return false;
}

function mostrarRegistro() {
  app.innerHTML = crearPantalla(
    "Registrarse",
    "Esta sección estará disponible próximamente."
  );

  return false;
}

function mostrarBatalla() {
  app.innerHTML = crearPantalla(
    "Batalla",
    "Esta sección estará disponible próximamente."
  );

  return false;
}

let linkPokedex = document.querySelector("#link-pokedex");
let linkLogin = document.querySelector("#link-login");
let linkRegistro = document.querySelector("#link-registro");
let linkJuego = document.querySelector("#link-juego");

linkPokedex.onclick = mostrarPokedex;
linkLogin.onclick = mostrarLogin;
linkRegistro.onclick = mostrarRegistro;
linkJuego.onclick = mostrarBatalla;

mostrarBienvenida();
