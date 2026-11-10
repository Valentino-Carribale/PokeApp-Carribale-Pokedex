import {
  leerPokemones, guardarPokemones, actualizarPokemon,
  leerUsuarios, guardarUsuarios, actualizarUsuario,
  iniciarSesion, leerSesion, cerrarSesion
} from "./persistencia.js";
import { avatares } from "./db/avatares.js";

const app = document.querySelector("#app");
const linkInicio = document.querySelector("#link-inicio");
const linkPokedex = document.querySelector("#link-pokedex");
const linkLogin = document.querySelector("#link-login");
const linkRegistro = document.querySelector("#link-registro");
const linkAdmin = document.querySelector("#link-admin");
const linkSalir = document.querySelector("#link-salir");
const linkJuego = document.querySelector("#link-juego");
const tipos = ["Normal", "Fuego", "Agua", "Planta", "Eléctrico", "Hielo", "Lucha", "Veneno", "Tierra", "Volador", "Psíquico", "Bicho", "Roca", "Fantasma", "Dragón", "Siniestro", "Acero", "Hada"];

// El texto ingresado en formularios se muestra como texto, sin interpretar HTML.
function texto(valor) {
  return String(valor).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function numeroPokedex(id) {
  if (id < 10) return "00" + id;
  if (id < 100) return "0" + id;
  return id;
}

function cambiarPantalla(titulo, link) {
  document.querySelector(".display-heading h1").textContent = titulo;
  document.title = titulo + " | PokeApp";
  for (let enlace of document.querySelectorAll(".header-nav a")) {
    enlace.classList.remove("active");
    enlace.removeAttribute("aria-current");
  }
  if (link !== null) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
}

function actualizarMenu() {
  const usuario = leerSesion();
  linkLogin.textContent = "Iniciar sesión";
  linkRegistro.hidden = false;
  linkAdmin.hidden = true;
  linkSalir.hidden = true;
  if (usuario !== null) {
    linkLogin.textContent = "Mi perfil";
    linkRegistro.hidden = true;
    linkSalir.hidden = false;
    linkAdmin.hidden = !usuario.admin;
  }
}

function mensajeFormulario(mensaje) {
  document.querySelector(".form-message").textContent = mensaje;
}

function buscarPokemon(id) {
  for (let pokemon of leerPokemones()) {
    if (pokemon.id === id) return pokemon;
  }
  return null;
}

function esAdmin() {
  const usuario = leerSesion();
  return usuario !== null && usuario.admin === true;
}

function crearTipos(lista) {
  let html = "";
  for (let tipo of lista) {
    html += `<span class="type type-${texto(tipo)}">${texto(tipo)}</span>`;
  }
  return html;
}

function crearTarjeta(nombre, imagen, id, tipo, rareza) {
  return `
    <article class="pokemon-card">
      <div class="pokemon-image"><img src="${texto(imagen)}" alt="${texto(nombre)}" /></div>
      <div class="pokemon-info">
        <span class="pokemon-id">N.º ${numeroPokedex(id)}</span>
        <h2>${texto(nombre)}</h2>
        <div class="pokemon-types">${crearTipos(tipo)}</div>
        <p class="pokemon-rareza">${texto(rareza)}</p>
        <button class="btn-detalle" data-id="${id}">Ver detalles</button>
      </div>
    </article>`;
}

function mostrarPokedex() {
  cambiarPantalla("Pokédex", linkPokedex);
  app.innerHTML = `
    <section class="pokedex-section">
      <p class="section-intro">Explorá los <strong id="cantidad-pokemon"></strong> Pokémon registrados.</p>
      <div id="pokedex-gallery" class="pokedex-gallery"></div>
    </section>`;
  const pokemones = leerPokemones();
  let tarjetas = "";
  for (let pokemon of pokemones) {
    tarjetas += crearTarjeta(pokemon.nombre, pokemon.imagen, pokemon.id, pokemon.tipo, pokemon.rareza);
  }
  document.querySelector("#cantidad-pokemon").textContent = pokemones.length;
  document.querySelector("#pokedex-gallery").innerHTML = tarjetas;
  for (let boton of document.querySelectorAll(".btn-detalle")) {
    boton.addEventListener("click", function () {
      mostrarDetalle(Number(boton.dataset.id), "");
    });
  }
}

function mostrarDetalle(id, mensaje) {
  const pokemon = buscarPokemon(id);
  if (pokemon === null) {
    mostrarPokedex();
    return;
  }
  cambiarPantalla(pokemon.nombre, linkPokedex);
  let evolucion = "No tiene evolución.";
  if (pokemon.tieneEvolucion) {
    evolucion = pokemon.evolucion;
    if (pokemon.nivelEvolucion !== null) {
      evolucion += " · Nivel " + pokemon.nivelEvolucion;
    } else {
      evolucion += " · Evolución sin nivel fijo.";
    }
  }
  app.innerHTML = `
    <section class="detalle-section">
      <div class="actions"><button id="volver-pokedex" class="btn-secondary">Volver a la Pokédex</button></div>
      <p class="success-message" role="status">${texto(mensaje)}</p>
      <div class="detail-grid">
        <div class="detail-portrait">
          <div class="pokemon-image"><img id="imagen-detalle" src="${texto(pokemon.imagen)}" alt="${texto(pokemon.nombre)}" /></div>
          <div class="actions" id="detail-actions"></div>
        </div>
        <div class="detail-info">
          <span class="pokemon-id">N.º ${numeroPokedex(pokemon.id)}</span>
          <h2>${texto(pokemon.nombre)}</h2>
          <div class="pokemon-types">${crearTipos(pokemon.tipo)}</div>
          <p class="description">${texto(pokemon.descripcion)}</p>
          <dl class="detail-data">
            <div><dt>Altura</dt><dd>${pokemon.altura} m</dd></div>
            <div><dt>Peso</dt><dd>${pokemon.peso} kg</dd></div>
            <div><dt>Generación</dt><dd>${pokemon.generacion}</dd></div>
            <div><dt>Rareza</dt><dd>${texto(pokemon.rareza)}</dd></div>
            <div><dt>Habilidad</dt><dd>${texto(pokemon.habilidad)}</dd></div>
            <div><dt>Evolución</dt><dd>${texto(evolucion)}</dd></div>
          </dl>
          <h3>Estadísticas base</h3>
          <dl class="stats-grid">
            <div><dt>HP</dt><dd>${pokemon.hp}</dd></div>
            <div><dt>Ataque</dt><dd>${pokemon.ataque}</dd></div>
            <div><dt>Defensa</dt><dd>${pokemon.defensa}</dd></div>
            <div><dt>Velocidad</dt><dd>${pokemon.velocidad}</dd></div>
          </dl>
          <div id="admin-detalle" class="actions"></div>
        </div>
      </div>
    </section>`;
  document.querySelector("#volver-pokedex").addEventListener("click", mostrarPokedex);
  if (pokemon.sonido !== "") {
    document.querySelector("#detail-actions").innerHTML = `<audio controls preload="none" src="${texto(pokemon.sonido)}" aria-label="Sonido de ${texto(pokemon.nombre)}"></audio>`;
  }
  if (pokemon.shiny && pokemon.imagenShiny !== "") {
    document.querySelector("#detail-actions").innerHTML += '<button id="ver-shiny" class="btn-secondary">Ver shiny</button>';
    let mostrandoShiny = false;
    document.querySelector("#ver-shiny").addEventListener("click", function () {
      mostrandoShiny = !mostrandoShiny;
      let imagen = pokemon.imagen;
      let etiqueta = "Ver shiny";
      if (mostrandoShiny) {
        imagen = pokemon.imagenShiny;
        etiqueta = "Ver normal";
      }
      document.querySelector("#imagen-detalle").src = imagen;
      document.querySelector("#ver-shiny").textContent = etiqueta;
    });
  }
  if (esAdmin()) {
    document.querySelector("#admin-detalle").innerHTML = '<button id="editar-pokemon" class="btn-primary">Editar Pokémon</button>';
    document.querySelector("#editar-pokemon").addEventListener("click", function () {
      mostrarFormularioPokemon(id);
    });
  }
}

function mostrarBienvenida() {
  const usuario = leerSesion();
  if (usuario !== null) {
    mostrarPerfil("");
    return;
  }
  cambiarPantalla("Bienvenida", linkInicio);
  app.innerHTML = `
    <section class="pantalla welcome-panel">
      <p class="eyebrow">TU AVENTURA COMIENZA ACÁ</p>
      <h2>¡Bienvenido/a a PokeApp!</h2>
      <p>Conocé a los Pokémon y sus características. Iniciá sesión para acceder a tu perfil o creá tu cuenta de entrenador.</p>
      <div class="actions">
        <button id="inicio-login" class="btn-primary">Iniciar sesión</button>
        <button id="inicio-pokedex" class="btn-secondary">Explorar Pokédex</button>
      </div>
    </section>`;
  document.querySelector("#inicio-login").addEventListener("click", mostrarLogin);
  document.querySelector("#inicio-pokedex").addEventListener("click", mostrarPokedex);
}

function mostrarLogin() {
  if (leerSesion() !== null) {
    mostrarPerfil("");
    return;
  }
  cambiarPantalla("Iniciar sesión", linkLogin);
  app.innerHTML = `
    <section class="login-section form-panel">
      <h2>Volvé a tu aventura</h2>
      <p class="section-intro">Ingresá con tu usuario o correo electrónico.</p>
      <form id="form-login" class="app-form">
        <label for="username">Usuario o correo electrónico</label>
        <input type="text" id="username" autocomplete="username" required />
        <label for="password">Contraseña</label>
        <input type="password" id="password" autocomplete="current-password" required />
        <p class="form-message" role="alert"></p>
        <button type="submit" class="btn-primary">Ingresar</button>
      </form>
      <button id="ir-registro" class="text-button">No tengo cuenta. Registrarme</button>
    </section>`;
  document.querySelector("#ir-registro").addEventListener("click", mostrarRegistro);
  document.querySelector("#form-login").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.querySelector("#username").value.trim().toLowerCase();
    const password = document.querySelector("#password").value;
    for (let usuario of leerUsuarios()) {
      if ((usuario.username.toLowerCase() === username || usuario.email.toLowerCase() === username) && usuario.password === password) {
        iniciarSesion(usuario.id);
        actualizarMenu();
        mostrarPerfil("");
        return;
      }
    }
    mensajeFormulario("Usuario, correo o contraseña incorrectos.");
  });
}

function opcionesAvatar() {
  let opciones = "";
  for (let avatar of avatares) {
    opciones += `<option value="./assets/avatar/${avatar}.png">${avatar}</option>`;
  }
  return opciones;
}

function activarAvatar(valor) {
  const selector = document.querySelector("#avatar");
  selector.value = valor;
  document.querySelector("#avatar-preview").src = selector.value;
  selector.addEventListener("change", function () {
    document.querySelector("#avatar-preview").src = selector.value;
  });
}

// Ignora el mismo ID al editar, pero no permite repetir el correo o usuario ajenos.
function usuarioDuplicado(email, username, id) {
  for (let usuario of leerUsuarios()) {
    if (usuario.id !== id && (usuario.email.toLowerCase() === email.toLowerCase() || usuario.username.toLowerCase() === username.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function mostrarRegistro() {
  if (leerSesion() !== null) {
    mostrarPerfil("");
    return;
  }
  cambiarPantalla("Registrarse", linkRegistro);
  app.innerHTML = `
    <section class="registro-section form-panel">
      <h2>Creá tu perfil de entrenador</h2>
      <p class="section-intro">Elegí tus datos y un avatar para comenzar.</p>
      <form id="form-registro" class="app-form">
        <label for="nombre">Nombre</label><input type="text" id="nombre" maxlength="50" autocomplete="given-name" required />
        <label for="apellido">Apellido</label><input type="text" id="apellido" maxlength="50" autocomplete="family-name" required />
        <label for="email">Correo electrónico</label><input type="email" id="email" autocomplete="email" required />
        <label for="nuevo-username">Nombre de usuario</label>
        <input type="text" id="nuevo-username" pattern="[A-Za-z0-9_.-]+" maxlength="30" title="Usá letras sin tildes, números, punto, guion o guion bajo." autocomplete="username" required />
        <label for="nueva-password">Contraseña (mínimo 6 caracteres)</label>
        <input type="password" id="nueva-password" minlength="6" autocomplete="new-password" required />
        <label for="confirmar-password">Repetir contraseña</label>
        <input type="password" id="confirmar-password" minlength="6" autocomplete="new-password" required />
        <label for="avatar">Avatar</label><select id="avatar">${opcionesAvatar()}</select>
        <img id="avatar-preview" class="avatar-preview" alt="Vista previa del avatar" />
        <p class="form-message" role="alert"></p>
        <button type="submit" class="btn-primary">Crear cuenta</button>
      </form>
    </section>`;
  activarAvatar("./assets/avatar/red.png");
  document.querySelector("#form-registro").addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = document.querySelector("#nombre").value.trim();
    const apellido = document.querySelector("#apellido").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const username = document.querySelector("#nuevo-username").value.trim();
    const password = document.querySelector("#nueva-password").value;
    if (nombre === "" || apellido === "" || password.trim() === "") {
      mensajeFormulario("Completá los datos sin dejar campos en blanco.");
      return;
    }
    if (usuarioDuplicado(email, username, null)) {
      mensajeFormulario("El correo o nombre de usuario ya está registrado.");
      return;
    }
    if (password !== document.querySelector("#confirmar-password").value) {
      mensajeFormulario("Las contraseñas no coinciden.");
      return;
    }
    let id = 1;
    for (let usuario of leerUsuarios()) {
      if (usuario.id >= id) id = usuario.id + 1;
    }
    const nuevoUsuario = {
      id: id, nombre: nombre, apellido: apellido, email: email,
      username: username, password: password,
      avatar: document.querySelector("#avatar").value, admin: false
    };
    guardarUsuarios(nuevoUsuario);
    iniciarSesion(nuevoUsuario.id);
    actualizarMenu();
    mostrarPerfil("¡Tu cuenta se creó correctamente!");
  });
}

function mostrarPerfil(mensaje) {
  const usuario = leerSesion();
  if (usuario === null) {
    mostrarLogin();
    return;
  }
  cambiarPantalla("Mi perfil", linkLogin);
  let rol = "Entrenador";
  if (usuario.admin) rol = "Administrador";
  app.innerHTML = `
    <section class="user-profile">
      <p class="success-message" role="status">${texto(mensaje)}</p>
      <div class="profile-card">
        <img class="user-profile-avatar" src="${texto(usuario.avatar)}" alt="Avatar de ${texto(usuario.username)}" />
        <div class="profile-info">
          <span class="role-badge">${rol}</span>
          <h2>¡Bienvenido/a, ${texto(usuario.nombre)}!</h2>
          <dl class="profile-data">
            <div><dt>Nombre y apellido</dt><dd>${texto(usuario.nombre)} ${texto(usuario.apellido)}</dd></div>
            <div><dt>Usuario</dt><dd>${texto(usuario.username)}</dd></div>
            <div><dt>Correo electrónico</dt><dd>${texto(usuario.email)}</dd></div>
          </dl>
        </div>
      </div>
      <div class="actions">
        <button id="editar-perfil" class="btn-primary">Editar mi perfil</button>
        <button id="perfil-pokedex" class="btn-secondary">Ver Pokédex</button>
        <span id="perfil-admin"></span>
      </div>
    </section>`;
  document.querySelector("#editar-perfil").addEventListener("click", mostrarEditarPerfil);
  document.querySelector("#perfil-pokedex").addEventListener("click", mostrarPokedex);
  if (usuario.admin) {
    document.querySelector("#perfil-admin").innerHTML = '<button id="administrar" class="btn-secondary">Administrar Pokémon</button>';
    document.querySelector("#administrar").addEventListener("click", mostrarAdmin);
  }
}

function mostrarEditarPerfil() {
  const usuario = leerSesion();
  if (usuario === null) {
    mostrarLogin();
    return;
  }
  cambiarPantalla("Editar perfil", linkLogin);
  app.innerHTML = `
    <section class="form-panel">
      <h2>Tus datos de entrenador</h2>
      <form id="form-perfil" class="app-form">
        <label for="nombre">Nombre</label><input id="nombre" type="text" maxlength="50" autocomplete="given-name" required />
        <label for="apellido">Apellido</label><input id="apellido" type="text" maxlength="50" autocomplete="family-name" required />
        <label for="email">Correo electrónico</label><input id="email" type="email" autocomplete="email" required />
        <label for="avatar">Avatar</label><select id="avatar">${opcionesAvatar()}</select>
        <img id="avatar-preview" class="avatar-preview" alt="Vista previa del avatar" />
        <fieldset>
          <legend>Cambiar contraseña</legend>
          <p class="field-hint">Dejá estos campos vacíos para conservar tu contraseña.</p>
          <label for="actual-password">Contraseña actual</label><input type="password" id="actual-password" autocomplete="current-password" />
          <label for="nueva-password">Nueva contraseña (mínimo 6 caracteres)</label><input type="password" id="nueva-password" minlength="6" autocomplete="new-password" />
          <label for="confirmar-password">Repetir nueva contraseña</label><input type="password" id="confirmar-password" autocomplete="new-password" />
        </fieldset>
        <p class="form-message" role="alert"></p>
        <div class="actions">
          <button type="submit" class="btn-primary">Guardar cambios</button>
          <button type="button" id="cancelar-perfil" class="btn-secondary">Cancelar</button>
        </div>
      </form>
    </section>`;
  document.querySelector("#nombre").value = usuario.nombre;
  document.querySelector("#apellido").value = usuario.apellido;
  document.querySelector("#email").value = usuario.email;
  activarAvatar(usuario.avatar);
  document.querySelector("#cancelar-perfil").addEventListener("click", function () { mostrarPerfil(""); });
  document.querySelector("#form-perfil").addEventListener("submit", function (event) {
    event.preventDefault();
    // Se comprueba que la sesión siga siendo la del perfil que se está editando.
    const actual = leerSesion();
    if (actual === null || actual.id !== usuario.id) {
      actualizarMenu();
      mostrarBienvenida();
      return;
    }
    const nombre = document.querySelector("#nombre").value.trim();
    const apellido = document.querySelector("#apellido").value.trim();
    const email = document.querySelector("#email").value.trim().toLowerCase();
    const passwordActual = document.querySelector("#actual-password").value;
    const passwordNueva = document.querySelector("#nueva-password").value;
    const confirmar = document.querySelector("#confirmar-password").value;
    if (nombre === "" || apellido === "") {
      mensajeFormulario("Completá nombre y apellido.");
      return;
    }
    if (usuarioDuplicado(email, actual.username, actual.id)) {
      mensajeFormulario("Ese correo ya pertenece a otro usuario.");
      return;
    }
    if (passwordActual !== "" || passwordNueva !== "" || confirmar !== "") {
      if (passwordActual !== actual.password) {
        mensajeFormulario("La contraseña actual es incorrecta.");
        return;
      }
      if (passwordNueva.trim().length < 6 || passwordNueva !== confirmar) {
        mensajeFormulario("La nueva contraseña debe tener al menos 6 caracteres y coincidir en ambos campos.");
        return;
      }
      actual.password = passwordNueva;
    }
    actual.nombre = nombre;
    actual.apellido = apellido;
    actual.email = email;
    actual.avatar = document.querySelector("#avatar").value;
    actualizarUsuario(actual);
    mostrarPerfil("Tu perfil se actualizó correctamente.");
  });
}

function mostrarAdmin() {
  if (!esAdmin()) {
    mostrarBienvenida();
    return;
  }
  cambiarPantalla("Administración", linkAdmin);
  let opciones = '<option value="">Seleccioná un Pokémon</option>';
  for (let pokemon of leerPokemones()) {
    opciones += `<option value="${pokemon.id}">N.º ${numeroPokedex(pokemon.id)} · ${texto(pokemon.nombre)}</option>`;
  }
  app.innerHTML = `
    <section class="form-panel admin-panel">
      <p class="eyebrow">ACCESO ADMINISTRADOR</p>
      <h2>Administrar Pokémon</h2>
      <p class="section-intro">Agregá nuevas entradas o actualizá los Pokémon de la Pokédex.</p>
      <button id="nuevo-pokemon" class="btn-primary">Cargar nuevo Pokémon</button>
      <form id="form-elegir-pokemon" class="app-form admin-selector">
        <label for="pokemon-editar">Editar un Pokémon existente</label>
        <select id="pokemon-editar" required>${opciones}</select>
        <button type="submit" class="btn-secondary">Editar seleccionado</button>
      </form>
    </section>`;
  document.querySelector("#nuevo-pokemon").addEventListener("click", function () { mostrarFormularioPokemon(null); });
  document.querySelector("#form-elegir-pokemon").addEventListener("submit", function (event) {
    event.preventDefault();
    mostrarFormularioPokemon(Number(document.querySelector("#pokemon-editar").value));
  });
}

function opcionesTipo() {
  let opciones = "";
  for (let tipo of tipos) opciones += `<option value="${tipo}">${tipo}</option>`;
  return opciones;
}

// Un único formulario sirve para la carga y para la edición.
function mostrarFormularioPokemon(idOriginal) {
  if (!esAdmin()) {
    mostrarBienvenida();
    return;
  }
  let pokemon = null;
  let titulo = "Nuevo Pokémon";
  let boton = "Agregar Pokémon";
  if (idOriginal !== null) {
    pokemon = buscarPokemon(idOriginal);
    if (pokemon === null) {
      mostrarAdmin();
      return;
    }
    titulo = "Editar Pokémon";
    boton = "Guardar cambios";
  }
  cambiarPantalla(titulo, linkAdmin);
  app.innerHTML = `
    <section class="pokemon-form-panel">
      <p class="eyebrow">ACCESO ADMINISTRADOR</p><h2>${titulo}</h2>
      <p class="section-intro">Los cambios se guardan en este navegador. Todos los campos son obligatorios salvo los indicados.</p>
      <form id="form-nuevo-pokemon" class="app-form pokemon-form">
        <div><label for="pokemon-number">Número en la Pokédex</label><input type="number" id="pokemon-number" min="1" step="1" required /></div>
        <div><label for="pokemon-name">Nombre</label><input type="text" id="pokemon-name" maxlength="60" required /></div>
        <div class="full-width"><label for="pokemon-description">Descripción</label><textarea id="pokemon-description" rows="4" maxlength="2000" required></textarea></div>
        <div><label for="pokemon-type">Tipo principal</label><select id="pokemon-type" required><option value="">Seleccioná un tipo</option>${opcionesTipo()}</select></div>
        <div><label for="pokemon-type-secondary">Tipo secundario (opcional)</label><select id="pokemon-type-secondary"><option value="">Sin segundo tipo</option>${opcionesTipo()}</select></div>
        <div><label for="pokemon-height">Altura (m)</label><input type="number" id="pokemon-height" min="0.01" step="any" required /></div>
        <div><label for="pokemon-weight">Peso (kg)</label><input type="number" id="pokemon-weight" min="0.01" step="any" required /></div>
        <div><label for="pokemon-generation">Generación</label><input type="number" id="pokemon-generation" min="1" step="1" required /></div>
        <div><label for="pokemon-ability">Habilidad</label><input type="text" id="pokemon-ability" maxlength="80" required /></div>
        <div><label for="pokemon-hp">HP</label><input type="number" id="pokemon-hp" min="1" step="1" required /></div>
        <div><label for="pokemon-attack">Ataque</label><input type="number" id="pokemon-attack" min="1" step="1" required /></div>
        <div><label for="pokemon-defense">Defensa</label><input type="number" id="pokemon-defense" min="1" step="1" required /></div>
        <div><label for="pokemon-speed">Velocidad</label><input type="number" id="pokemon-speed" min="1" step="1" required /></div>
        <fieldset class="full-width">
          <legend>Evolución</legend>
          <label class="check-label"><input type="checkbox" id="pokemon-has-evolution" /> Tiene evolución</label>
          <label for="pokemon-evolution">Nombre de la evolución</label><input type="text" id="pokemon-evolution" maxlength="60" disabled />
          <label for="pokemon-evolution-level">Nivel de evolución (opcional)</label><input type="number" id="pokemon-evolution-level" min="1" step="1" disabled />
          <p class="field-hint">Dejá el nivel vacío si evoluciona con una piedra, por intercambio u otro método.</p>
        </fieldset>
        <div><label for="pokemon-rarity">Rareza</label><select id="pokemon-rarity" required>
          <option value="">Seleccioná una rareza</option><option>Común</option><option>Poco común</option><option>Raro</option><option>Legendario</option><option>Mítico</option><option>Singular</option>
        </select></div>
        <div><label for="pokemon-image">Imagen (ruta o URL)</label><input type="text" id="pokemon-image" placeholder="./assets/img/pikachu.png" required /></div>
        <div class="full-width"><label for="pokemon-sound">Sonido (ruta o URL)</label><input type="text" id="pokemon-sound" placeholder="./assets/sound/pikachu.mp3" required /></div>
        <fieldset class="full-width">
          <legend>Variante shiny</legend>
          <label class="check-label"><input type="checkbox" id="pokemon-shiny" /> Tiene versión shiny</label>
          <label for="pokemon-shiny-image">Imagen shiny (ruta o URL)</label><input type="text" id="pokemon-shiny-image" placeholder="./assets/img/pikachu-shiny.png" disabled />
        </fieldset>
        <p class="form-message full-width" role="alert"></p>
        <div class="actions full-width"><button type="submit" class="btn-primary">${boton}</button><button type="button" id="cancelar-pokemon" class="btn-secondary">Cancelar</button></div>
      </form>
    </section>`;
  if (pokemon !== null) completarFormularioPokemon(pokemon);
  actualizarOpcionales();
  document.querySelector("#pokemon-has-evolution").addEventListener("change", actualizarOpcionales);
  document.querySelector("#pokemon-shiny").addEventListener("change", actualizarOpcionales);
  document.querySelector("#cancelar-pokemon").addEventListener("click", mostrarAdmin);
  document.querySelector("#form-nuevo-pokemon").addEventListener("submit", function (event) {
    event.preventDefault();
    guardarFormularioPokemon(idOriginal);
  });
}

function completarFormularioPokemon(pokemon) {
  document.querySelector("#pokemon-number").value = pokemon.id;
  document.querySelector("#pokemon-name").value = pokemon.nombre;
  document.querySelector("#pokemon-description").value = pokemon.descripcion;
  document.querySelector("#pokemon-type").value = pokemon.tipo[0];
  if (pokemon.tipo.length > 1) document.querySelector("#pokemon-type-secondary").value = pokemon.tipo[1];
  document.querySelector("#pokemon-height").value = pokemon.altura;
  document.querySelector("#pokemon-weight").value = pokemon.peso;
  document.querySelector("#pokemon-generation").value = pokemon.generacion;
  document.querySelector("#pokemon-hp").value = pokemon.hp;
  document.querySelector("#pokemon-attack").value = pokemon.ataque;
  document.querySelector("#pokemon-defense").value = pokemon.defensa;
  document.querySelector("#pokemon-speed").value = pokemon.velocidad;
  document.querySelector("#pokemon-ability").value = pokemon.habilidad;
  document.querySelector("#pokemon-has-evolution").checked = pokemon.tieneEvolucion;
  document.querySelector("#pokemon-evolution").value = pokemon.evolucion;
  document.querySelector("#pokemon-evolution-level").value = pokemon.nivelEvolucion;
  document.querySelector("#pokemon-rarity").value = pokemon.rareza;
  document.querySelector("#pokemon-image").value = pokemon.imagen;
  document.querySelector("#pokemon-sound").value = pokemon.sonido;
  document.querySelector("#pokemon-shiny").checked = pokemon.shiny;
  document.querySelector("#pokemon-shiny-image").value = pokemon.imagenShiny;
}

function actualizarOpcionales() {
  const tieneEvolucion = document.querySelector("#pokemon-has-evolution").checked;
  document.querySelector("#pokemon-evolution").disabled = !tieneEvolucion;
  document.querySelector("#pokemon-evolution").required = tieneEvolucion;
  document.querySelector("#pokemon-evolution-level").disabled = !tieneEvolucion;
  const shiny = document.querySelector("#pokemon-shiny").checked;
  document.querySelector("#pokemon-shiny-image").disabled = !shiny;
  document.querySelector("#pokemon-shiny-image").required = shiny;
}

function rutaValida(ruta) {
  return ruta.startsWith("./assets/") || ruta.startsWith("assets/") || ruta.startsWith("https://") || ruta.startsWith("http://");
}

function guardarFormularioPokemon(idOriginal) {
  if (!esAdmin()) {
    actualizarMenu();
    mostrarBienvenida();
    return;
  }
  const tipo = [document.querySelector("#pokemon-type").value];
  const segundoTipo = document.querySelector("#pokemon-type-secondary").value;
  if (segundoTipo !== "") {
    if (segundoTipo === tipo[0]) {
      mensajeFormulario("Los dos tipos deben ser diferentes.");
      return;
    }
    tipo.push(segundoTipo);
  }
  let evolucion = null;
  let nivelEvolucion = null;
  const tieneEvolucion = document.querySelector("#pokemon-has-evolution").checked;
  if (tieneEvolucion) {
    evolucion = document.querySelector("#pokemon-evolution").value.trim();
    if (evolucion === "") {
      mensajeFormulario("Escribí el nombre de la evolución.");
      return;
    }
    if (document.querySelector("#pokemon-evolution-level").value !== "") {
      nivelEvolucion = document.querySelector("#pokemon-evolution-level").valueAsNumber;
    }
  }
  let imagenShiny = "";
  const shiny = document.querySelector("#pokemon-shiny").checked;
  if (shiny) imagenShiny = document.querySelector("#pokemon-shiny-image").value.trim();
  const nuevoPokemon = {
    id: document.querySelector("#pokemon-number").valueAsNumber,
    nombre: document.querySelector("#pokemon-name").value.trim(),
    descripcion: document.querySelector("#pokemon-description").value.trim(),
    tipo: tipo,
    altura: document.querySelector("#pokemon-height").valueAsNumber,
    peso: document.querySelector("#pokemon-weight").valueAsNumber,
    generacion: document.querySelector("#pokemon-generation").valueAsNumber,
    hp: document.querySelector("#pokemon-hp").valueAsNumber,
    ataque: document.querySelector("#pokemon-attack").valueAsNumber,
    velocidad: document.querySelector("#pokemon-speed").valueAsNumber,
    defensa: document.querySelector("#pokemon-defense").valueAsNumber,
    habilidad: document.querySelector("#pokemon-ability").value.trim(),
    tieneEvolucion: tieneEvolucion, evolucion: evolucion, nivelEvolucion: nivelEvolucion,
    rareza: document.querySelector("#pokemon-rarity").value,
    imagen: document.querySelector("#pokemon-image").value.trim(),
    sonido: document.querySelector("#pokemon-sound").value.trim(),
    shiny: shiny, imagenShiny: imagenShiny
  };
  if (nuevoPokemon.nombre === "" || nuevoPokemon.descripcion === "" || nuevoPokemon.habilidad === "") {
    mensajeFormulario("Completá nombre, descripción y habilidad sin dejarlos en blanco.");
    return;
  }
  for (let pokemon of leerPokemones()) {
    if (pokemon.id !== idOriginal && (pokemon.id === nuevoPokemon.id || pokemon.nombre.toLowerCase() === nuevoPokemon.nombre.toLowerCase())) {
      mensajeFormulario("Ya existe un Pokémon con ese número o nombre.");
      return;
    }
  }
  if (!rutaValida(nuevoPokemon.imagen) || !rutaValida(nuevoPokemon.sonido) || (shiny && !rutaValida(imagenShiny))) {
    mensajeFormulario("Usá rutas dentro de ./assets/ o direcciones que comiencen con https:// o http:// para los recursos.");
    return;
  }
  let mensaje = "Pokémon agregado correctamente.";
  if (idOriginal === null) {
    guardarPokemones(nuevoPokemon);
  } else {
    actualizarPokemon(idOriginal, nuevoPokemon);
    mensaje = "Pokémon actualizado correctamente.";
  }
  mostrarDetalle(nuevoPokemon.id, mensaje);
}

// Molde original de batalla: queda pendiente para desarrollar después.
function mostrarBatalla() {
  cambiarPantalla("Batalla", linkJuego);
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

linkInicio.addEventListener("click", function (event) { event.preventDefault(); mostrarBienvenida(); });
linkPokedex.addEventListener("click", function (event) { event.preventDefault(); mostrarPokedex(); });
linkLogin.addEventListener("click", function (event) { event.preventDefault(); mostrarLogin(); });
linkRegistro.addEventListener("click", function (event) { event.preventDefault(); mostrarRegistro(); });
linkAdmin.addEventListener("click", function (event) { event.preventDefault(); mostrarAdmin(); });
linkJuego.addEventListener("click", function (event) { event.preventDefault(); mostrarBatalla(); });
linkSalir.addEventListener("click", function (event) {
  event.preventDefault();
  cerrarSesion();
  actualizarMenu();
  mostrarBienvenida();
});

actualizarMenu();
mostrarBienvenida();
