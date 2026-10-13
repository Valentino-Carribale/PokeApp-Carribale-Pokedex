import { pokemones } from "./db/pokemones.js";
import { usuarios } from "./db/usuarios.js";

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
          ${tipo.map(tmap => `
          <span class="type type-${tmap}">${tmap}</span>
          `).join("")}
        </div>

        <p class="pokemon-rareza">${rareza}</p>

        <button class="btn-detalle" data-id="${id}">
          Ver detalles
        </button>
      </div>
    </article>
  `;
}

function mostrarPokedex() {
  app.innerHTML = '<section class="pokedex-section"></section>';

  let pokedexSection = document.querySelector(".pokedex-section");

  pokedexSection.innerHTML =
    '<div id="pokedex-gallery" class="pokedex-gallery"></div>';

  let pokedexGallery = document.querySelector("#pokedex-gallery");

  for (let pokemon of pokemones) {
    pokedexGallery.innerHTML += crearTarjeta(
      pokemon.nombre,
      pokemon.imagen,
      pokemon.id,
      pokemon.tipo,
      pokemon.rareza
    );
  }
}

function mostrarBienvenida() {
  app.innerHTML = `
    <section class="pantalla">
      <h2>¡Bienvenido a PokeApp!</h2>
      <p>Usá el menú para comenzar.</p>
    </section>
  `;
}

function mostrarLogin() {
  app.innerHTML = `
  <section class="login-section">

    <h1>Iniciar sesión</h1>

    <form id="form-login">

      <label for="username">
        Usuario
      </label>

      <input 
        type="text" 
        id="username"
        required
      />

      <label for="password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="password"
        required
      />

      <button type="submit">
        Ingresar
      </button>

    </form>

  </section>
`;
}

function mostrarRegistro() {
  app.innerHTML = `
  <section class="registro-section">

    <h1>Registrarse</h1>

    <form id="form-registro">

      <label for="nombre">
        Nombre
      </label>

      <input 
        type="text" 
        id="nombre"
      />

      <label for="email">
        Email
      </label>

      <input 
        type="email" 
        id="email"
      />

      <label for="nuevo-username">
        Usuario
      </label>

      <input 
        type="text" 
        id="nuevo-username"
      />

      <label for="nueva-password">
        Contraseña
      </label>

      <input 
        type="password" 
        id="nueva-password"
      />

      <button type="submit">
        Registrarse
      </button>

    </form>

  </section>
`;
}

function mostrarBatalla() {
  app.innerHTML = `
  <section class="batalla-section">

    <h1>Batalla Pokémon</h1>

    <p>
      Elegí tu Pokémon para comenzar.
    </p>

    <button id="btn-comenzar-batalla">
      Comenzar batalla
    </button>

  </section>
`;
}

let linkPokedex = document.querySelector("#link-pokedex");
let linkLogin = document.querySelector("#link-login");
let linkRegistro = document.querySelector("#link-registro");
let linkJuego = document.querySelector("#link-juego");

linkPokedex.addEventListener("click", (event)=>{
  event.preventDefault();
  mostrarPokedex()
});

linkLogin.addEventListener("click", (event)=>{
  event.preventDefault();
  mostrarLogin()

  const formularioLogin = document.querySelector("#form-login");
  
  formularioLogin.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    let encontrado = false;

    for (let usuario of usuarios) {
      if (usuario.usuario === username && usuario.password === password) {
        alert("Inicio de sesión exitoso. Bienvenido " + usuario.usuario);
        encontrado = true;
        break;

      } else {
        encontrado = false;
      }
    }

    if (!encontrado) {
      alert("Usuario o contraseña incorrectos");
    }

    });
});

linkRegistro.addEventListener("click", (event)=>{
  event.preventDefault();
  mostrarRegistro()
});

linkJuego.addEventListener("click", (event)=>{
  event.preventDefault();
  mostrarBatalla()
});

mostrarBienvenida();
