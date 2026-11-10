// Importamos las funciones encargadas de guardar y leer datos.
import {
  leerPokemones,
  guardarPokemones,
  actualizarPokemon,
  leerUsuarios,
  guardarUsuarios,
  actualizarUsuario,
  iniciarSesion,
  leerSesion,
  cerrarSesion
} from "./persistencia.js";

// Importamos los nombres de los avatares disponibles.
import { avatares } from "./db/avatares.js";

// Importamos los datos de la batalla.
import { escenasBatalla } from "./db/game.js";

// ==========================================================
// REFERENCIAS A LOS ELEMENTOS FIJOS DEL HTML
// ==========================================================

// querySelector busca el primer elemento que coincide
// con el selector CSS indicado.
//
// # indica que buscamos por ID.
// . indica que buscamos por clase.
//
// Estos elementos ya existen en index.html.
const app = document.querySelector("#app");
const linkInicio = document.querySelector("#link-inicio");
const linkPokedex = document.querySelector("#link-pokedex");
const linkLogin = document.querySelector("#link-login");
const linkRegistro = document.querySelector("#link-registro");
const linkAdmin = document.querySelector("#link-admin");
const linkSalir = document.querySelector("#link-salir");
const linkJuego = document.querySelector("#link-juego");

// Opciones que utilizarán los selectores de tipo del formulario.
const tipos = [
  "Normal",
  "Fuego",
  "Agua",
  "Planta",
  "Eléctrico",
  "Hielo",
  "Lucha",
  "Veneno",
  "Tierra",
  "Volador",
  "Psíquico",
  "Bicho",
  "Roca",
  "Fantasma",
  "Dragón",
  "Siniestro",
  "Acero",
  "Hada"
];

// ==========================================================
// 1. PREPARAR TEXTO PARA MOSTRARLO EN HTML
// ==========================================================

function texto(valor) {
  // String convierte el valor recibido en texto.
  //
  // replace cambia caracteres especiales por su representación
  // en HTML. Por ejemplo: < se convierte en &lt;.
  //
  // Así, un texto ingresado por el usuario se muestra como texto
  // y no se interpreta como una etiqueta HTML.
  //
  // /g significa que se reemplazan todas las coincidencias.
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ==========================================================
// 2. DAR FORMATO AL NÚMERO DE POKÉDEX
// ==========================================================

function numeroPokedex(id) {
  // Agregamos ceros solamente para mostrar el número.
  // El ID original guardado no se modifica.
  //
  // 3 se muestra como 003.
  // 25 se muestra como 025.
  // 150 se muestra como 150.
  if (id < 10) return "00" + id;
  if (id < 100) return "0" + id;

  return id;
}

// ==========================================================
// 3. CAMBIAR TÍTULOS Y MARCAR EL ENLACE ACTIVO
// ==========================================================

// titulo: texto que aparecerá en el encabezado.
// link: enlace del menú que debe quedar resaltado.
function cambiarPantalla(titulo, link) {
  // textContent modifica solamente el texto del elemento.
  document.querySelector(".display-heading h1").textContent = titulo;

  // Cambiamos también el título de la pestaña del navegador.
  document.title = titulo + " | PokeApp";

  // querySelectorAll obtiene todos los enlaces del menú.
  // Recorremos los enlaces y quitamos la marca de pantalla actual.
  for (let enlace of document.querySelectorAll(".header-nav a")) {
    enlace.classList.remove("active");
    enlace.removeAttribute("aria-current");
  }

  // Si recibimos un enlace, lo marcamos como activo.
  if (link !== null) {
    link.classList.add("active");

    // Este atributo ayuda a los lectores de pantalla
    // a identificar la sección actual.
    link.setAttribute("aria-current", "page");
  }
}

// ==========================================================
// 4. ACTUALIZAR EL MENÚ SEGÚN LA SESIÓN
// ==========================================================

function actualizarMenu() {
  // Obtenemos el usuario conectado o null si no hay sesión.
  const usuario = leerSesion();

  // Primero dejamos el menú en estado de visitante.
  //
  // hidden = true oculta un elemento.
  // hidden = false lo muestra.
  linkLogin.textContent = "Iniciar sesión";
  linkRegistro.hidden = false;
  linkAdmin.hidden = true;
  linkSalir.hidden = true;

  // Si existe una sesión, adaptamos las opciones.
  if (usuario !== null) {
    linkLogin.textContent = "Mi perfil";
    linkRegistro.hidden = true;
    linkSalir.hidden = false;

    // Si admin es true, !usuario.admin da false:
    // Administración no queda oculta.
    //
    // Si admin es false, !usuario.admin da true:
    // Administración queda oculta.
    linkAdmin.hidden = !usuario.admin;
  }
}

// ==========================================================
// 5. MOSTRAR MENSAJES EN UN FORMULARIO
// ==========================================================

function mensajeFormulario(mensaje) {
  // Cada formulario tiene un espacio con la clase form-message.
  // Escribimos allí el aviso recibido.
  document.querySelector(".form-message").textContent = mensaje;
}

// ==========================================================
// 6. BUSCAR UN POKÉMON POR SU ID
// ==========================================================

function buscarPokemon(id) {
  // Leemos la lista actualizada y recorremos sus objetos.
  for (let pokemon of leerPokemones()) {
    if (pokemon.id === id) {
      // Al encontrarlo, lo devolvemos y termina la función.
      return pokemon;
    }
  }

  // Si terminó el recorrido sin encontrarlo, devolvemos null.
  return null;
}

// ==========================================================
// 7. COMPROBAR SI EL USUARIO ES ADMINISTRADOR
// ==========================================================

function esAdmin() {
  const usuario = leerSesion();

  // Deben cumplirse ambas condiciones:
  // existe un usuario Y su propiedad admin es true.
  //
  // Si usuario es null, la segunda condición no se evalúa.
  // Eso evita intentar leer admin de un valor inexistente.
  return usuario !== null && usuario.admin === true;
}

// ==========================================================
// 8. CREAR LAS ETIQUETAS DE LOS TIPOS
// ==========================================================

// Recibe un array, por ejemplo ["Planta", "Veneno"].
function crearTipos(lista) {
  // Comenzamos con un texto vacío.
  let html = "";

  for (let tipo of lista) {
    // += agrega contenido al texto que ya teníamos.
    //
    // La clase generada, por ejemplo type-Planta,
    // determina el color mediante el CSS.
    html += `
      <span class="type type-${texto(tipo)}">
        ${texto(tipo)}
      </span>
    `;
  }

  // Devolvemos el HTML completo de las etiquetas.
  return html;
}

// ==========================================================
// 9. CREAR EL HTML DE UNA TARJETA
// ==========================================================

function crearTarjeta(nombre, imagen, id, tipo, rareza) {
  // Esta función devuelve texto HTML.
  // Todavía no lo inserta en la página.
  //
  // ${...} inserta el valor de una variable o función.
  //
  // data-id guarda el ID en el botón para saber
  // qué Pokémon abrir cuando se haga clic.
  return `
    <article class="pokemon-card">
      <div class="pokemon-image">
        <img src="${texto(imagen)}" alt="${texto(nombre)}" />
      </div>

      <div class="pokemon-info">
        <span class="pokemon-id">
          N.º ${numeroPokedex(id)}
        </span>

        <h2>${texto(nombre)}</h2>

        <div class="pokemon-types">
          ${crearTipos(tipo)}
        </div>

        <p class="pokemon-rareza">
          ${texto(rareza)}
        </p>

        <button class="btn-detalle" data-id="${id}">
          Ver detalles
        </button>
      </div>
    </article>
  `;
}

// ==========================================================
// 10. MOSTRAR LA POKÉDEX
// ==========================================================

function mostrarPokedex() {
  cambiarPantalla("Pokédex", linkPokedex);

  // innerHTML reemplaza todo el contenido anterior de #app.
  //
  // Primero creamos la estructura y dejamos un contenedor
  // vacío para colocar las tarjetas.
  app.innerHTML = `
    <section class="pokedex-section">
      <p class="section-intro">
        Explorá los
        <strong id="cantidad-pokemon"></strong>
        Pokémon registrados.
      </p>

      <div id="pokedex-gallery" class="pokedex-gallery"></div>
    </section>
  `;

  // Cada vez que abrimos la Pokédex leemos los datos guardados.
  // Así aparecen también los Pokémon nuevos o editados.
  const pokemones = leerPokemones();

  let tarjetas = "";

  // Creamos el HTML de una tarjeta por cada Pokémon.
  for (let pokemon of pokemones) {
    tarjetas += crearTarjeta(
      pokemon.nombre,
      pokemon.imagen,
      pokemon.id,
      pokemon.tipo,
      pokemon.rareza
    );
  }

  // length indica cuántos elementos tiene el array.
  document.querySelector("#cantidad-pokemon").textContent =
    pokemones.length;

  // Insertamos todas las tarjetas juntas.
  document.querySelector("#pokedex-gallery").innerHTML = tarjetas;

  // Los botones recién existen después de insertar el HTML.
  // Por eso les asignamos sus eventos en este momento.
  for (let boton of document.querySelectorAll(".btn-detalle")) {
    boton.addEventListener("click", function () {
      // dataset.id obtiene el atributo data-id del botón.
      // Ese valor es texto: Number lo convierte en número.
      //
      // El segundo argumento vacío indica que no hay
      // un mensaje de éxito para mostrar.
      mostrarDetalle(Number(boton.dataset.id), "");
    });
  }
}

// ==========================================================
// 11. MOSTRAR EL DETALLE DE UN POKÉMON
// ==========================================================

// id: Pokémon que queremos consultar.
// mensaje: aviso opcional después de agregarlo o editarlo.
function mostrarDetalle(id, mensaje) {
  const pokemon = buscarPokemon(id);

  // Si no existe, volvemos a la galería y detenemos la función.
  if (pokemon === null) {
    mostrarPokedex();
    return;
  }

  cambiarPantalla(pokemon.nombre, linkPokedex);

  // Preparamos el texto que describe su evolución.
  let evolucion = "No tiene evolución.";

  if (pokemon.tieneEvolucion) {
    evolucion = pokemon.evolucion;

    if (pokemon.nivelEvolucion !== null) {
      evolucion += " · Nivel " + pokemon.nivelEvolucion;
    } else {
      // Puede evolucionar por piedra, intercambio u otro método.
      evolucion += " · Evolución sin nivel fijo.";
    }
  }

  // La ficha se construye usando el objeto encontrado.
  // La descripción también se obtiene de ese objeto.
  app.innerHTML = `
    <section class="detalle-section">
      <div class="actions">
        <button id="volver-pokedex" class="btn-secondary">
          Volver a la Pokédex
        </button>
      </div>

      <p class="success-message" role="status">
        ${texto(mensaje)}
      </p>

      <div class="detail-grid">
        <div class="detail-portrait">
          <div class="pokemon-image">
            <img
              id="imagen-detalle"
              src="${texto(pokemon.imagen)}"
              alt="${texto(pokemon.nombre)}"
            />
          </div>

          <div class="actions" id="detail-actions"></div>
        </div>

        <div class="detail-info">
          <span class="pokemon-id">
            N.º ${numeroPokedex(pokemon.id)}
          </span>

          <h2>${texto(pokemon.nombre)}</h2>

          <div class="pokemon-types">
            ${crearTipos(pokemon.tipo)}
          </div>

          <p class="description">
            ${texto(pokemon.descripcion)}
          </p>

          <dl class="detail-data">
            <div>
              <dt>Altura</dt>
              <dd>${pokemon.altura} m</dd>
            </div>

            <div>
              <dt>Peso</dt>
              <dd>${pokemon.peso} kg</dd>
            </div>

            <div>
              <dt>Generación</dt>
              <dd>${pokemon.generacion}</dd>
            </div>

            <div>
              <dt>Rareza</dt>
              <dd>${texto(pokemon.rareza)}</dd>
            </div>

            <div>
              <dt>Habilidad</dt>
              <dd>${texto(pokemon.habilidad)}</dd>
            </div>

            <div>
              <dt>Evolución</dt>
              <dd>${texto(evolucion)}</dd>
            </div>
          </dl>

          <h3>Estadísticas base</h3>

          <dl class="stats-grid">
            <div>
              <dt>HP</dt>
              <dd>${pokemon.hp}</dd>
            </div>

            <div>
              <dt>Ataque</dt>
              <dd>${pokemon.ataque}</dd>
            </div>

            <div>
              <dt>Defensa</dt>
              <dd>${pokemon.defensa}</dd>
            </div>

            <div>
              <dt>Velocidad</dt>
              <dd>${pokemon.velocidad}</dd>
            </div>
          </dl>

          <div id="admin-detalle" class="actions"></div>
        </div>
      </div>
    </section>
  `;

  // Pasamos el nombre de la función sin paréntesis.
  // Se ejecutará cuando ocurra el clic.
  document.querySelector("#volver-pokedex").addEventListener(
    "click",
    mostrarPokedex
  );

  // Si tiene sonido, agregamos el reproductor de audio.
  //
  // controls muestra sus controles.
  // preload="none" evita precargar el archivo de sonido.
  if (pokemon.sonido !== "") {
    document.querySelector("#detail-actions").innerHTML = `
      <audio
        controls
        preload="none"
        src="${texto(pokemon.sonido)}"
        aria-label="Sonido de ${texto(pokemon.nombre)}"
      ></audio>
    `;
  }

  // Agregamos el botón shiny solamente si tiene esa variante
  // y una imagen indicada.
  if (pokemon.shiny && pokemon.imagenShiny !== "") {
    document.querySelector("#detail-actions").innerHTML += `
      <button id="ver-shiny" class="btn-secondary">
        Ver shiny
      </button>
    `;

    // Esta variable recuerda qué versión estamos mostrando.
    // Al abrir la ficha, comienza con la imagen normal.
    let mostrandoShiny = false;

    document.querySelector("#ver-shiny").addEventListener(
      "click",
      function () {
        // ! invierte el estado:
        // false pasa a true y true pasa a false.
        mostrandoShiny = !mostrandoShiny;

        // Partimos de la versión normal.
        let imagen = pokemon.imagen;
        let etiqueta = "Ver shiny";

        // Si activamos shiny, cambiamos la imagen
        // y el texto del botón.
        if (mostrandoShiny) {
          imagen = pokemon.imagenShiny;
          etiqueta = "Ver normal";
        }

        // Actualizamos los elementos existentes.
        document.querySelector("#imagen-detalle").src = imagen;
        document.querySelector("#ver-shiny").textContent = etiqueta;
      }
    );
  }

  // El administrador también puede editar desde el detalle.
  if (esAdmin()) {
    document.querySelector("#admin-detalle").innerHTML = `
      <button id="editar-pokemon" class="btn-primary">
        Editar Pokémon
      </button>
    `;

    document.querySelector("#editar-pokemon").addEventListener(
      "click",
      function () {
        mostrarFormularioPokemon(id);
      }
    );
  }
}

// ==========================================================
// 12. MOSTRAR LA BIENVENIDA
// ==========================================================

function mostrarBienvenida() {
  const usuario = leerSesion();

  // Si hay sesión, mostramos directamente el perfil.
  if (usuario !== null) {
    mostrarPerfil("");
    return;
  }

  cambiarPantalla("Bienvenido", linkInicio);

  // Si no hay sesión, mostramos la bienvenida general.
  app.innerHTML = `
    <section class="pantalla welcome-panel">
      <p class="eyebrow">TU AVENTURA COMIENZA ACÁ</p>

      <h2>¡Bienvenido a PokeApp!</h2>

      <p>
        Conocé a los Pokémon y sus características.
        Iniciá sesión para acceder a tu perfil
        o creá tu cuenta de entrenador.
      </p>

      <div class="actions">
        <button id="inicio-login" class="btn-primary">
          Iniciar sesión
        </button>

        <button id="inicio-pokedex" class="btn-secondary">
          Explorar Pokédex
        </button>
      </div>
    </section>
  `;

  // Asignamos las acciones de los botones recién creados.
  document.querySelector("#inicio-login").addEventListener(
    "click",
    mostrarLogin
  );

  document.querySelector("#inicio-pokedex").addEventListener(
    "click",
    mostrarPokedex
  );
}

// ==========================================================
// 13. MOSTRAR Y PROCESAR EL LOGIN
// ==========================================================

function mostrarLogin() {
  // Si ya está conectado, no pedimos otro inicio de sesión.
  if (leerSesion() !== null) {
    mostrarPerfil("");
    return;
  }

  cambiarPantalla("Iniciar sesión", linkLogin);

  // required obliga a completar el campo.
  // autocomplete ayuda al navegador a reconocer el dato.
  app.innerHTML = `
    <section class="login-section form-panel">
      <h2>Volvé a tu aventura</h2>

      <p class="section-intro">
        Ingresá con tu usuario o correo electrónico.
      </p>

      <form id="form-login" class="app-form">
        <label for="username">
          Usuario o correo electrónico
        </label>

        <input
          type="text"
          id="username"
          autocomplete="username"
          required
        />

        <label for="password">Contraseña</label>

        <input
          type="password"
          id="password"
          autocomplete="current-password"
          required
        />

        <p class="form-message" role="alert"></p>

        <button type="submit" class="btn-primary">
          Ingresar
        </button>
      </form>

      <button id="ir-registro" class="text-button">
        No tengo cuenta. Registrarme
      </button>
    </section>
  `;

  document.querySelector("#ir-registro").addEventListener(
    "click",
    mostrarRegistro
  );

  // submit ocurre cuando se envía el formulario.
  document.querySelector("#form-login").addEventListener(
    "submit",
    function (event) {
      // Evitamos el envío tradicional y la recarga de la página.
      event.preventDefault();

      // value obtiene lo escrito.
      // trim quita espacios al principio y al final.
      // toLowerCase convierte el texto en minúsculas.
      const username = document.querySelector("#username")
        .value.trim().toLowerCase();

      // La contraseña se mantiene tal como se ingresó.
      const password = document.querySelector("#password").value;

      // Recorremos todos los usuarios guardados.
      for (let usuario of leerUsuarios()) {
        // Se acepta:
        // (usuario correcto O correo correcto)
        // Y contraseña correcta.
        if (
          (
            usuario.username.toLowerCase() === username ||
            usuario.email.toLowerCase() === username
          ) &&
          usuario.password === password
        ) {
          // Recordamos quién inició sesión.
          iniciarSesion(usuario.id);

          // Adaptamos el menú y mostramos el perfil.
          actualizarMenu();
          mostrarPerfil("");

          // Terminamos para no seguir buscando
          // ni mostrar el mensaje de error.
          return;
        }
      }

      // Solo llegamos acá si ninguna cuenta coincidió.
      mensajeFormulario("Usuario, correo o contraseña incorrectos.");
    }
  );
}

// ==========================================================
// 14. CREAR LAS OPCIONES DE AVATAR
// ==========================================================

function opcionesAvatar() {
  let opciones = "";

  // Convertimos cada nombre del array en una opción del select.
  for (let avatar of avatares) {
    // El value contiene la ruta que luego se guardará
    // dentro de la propiedad avatar del usuario.
    opciones += `
      <option value="./assets/avatar/${avatar}.png">
        ${avatar}
      </option>
    `;
  }

  return opciones;
}

// ==========================================================
// 15. ACTIVAR LA VISTA PREVIA DEL AVATAR
// ==========================================================

function activarAvatar(valor) {
  const selector = document.querySelector("#avatar");

  // Elegimos la opción inicial.
  selector.value = valor;

  // Mostramos la imagen correspondiente.
  document.querySelector("#avatar-preview").src = selector.value;

  // change se dispara cuando cambia la opción seleccionada.
  selector.addEventListener("change", function () {
    document.querySelector("#avatar-preview").src = selector.value;
  });
}

// ==========================================================
// 16. COMPROBAR USUARIOS O CORREOS REPETIDOS
// ==========================================================

function usuarioDuplicado(email, username, id) {
  // Al registrar, id es null: se revisan todas las cuentas.
  //
  // Al editar, id es el ID del usuario actual:
  // excluimos esa cuenta para no detectarla como duplicada.
  for (let usuario of leerUsuarios()) {
    if (
      usuario.id !== id &&
      (
        usuario.email.toLowerCase() === email.toLowerCase() ||
        usuario.username.toLowerCase() === username.toLowerCase()
      )
    ) {
      return true;
    }
  }

  // No encontramos otra cuenta con esos datos.
  return false;
}

// ==========================================================
// 17. MOSTRAR Y PROCESAR EL REGISTRO
// ==========================================================

function mostrarRegistro() {
  // Si ya hay una sesión, mostramos el perfil.
  if (leerSesion() !== null) {
    mostrarPerfil("");
    return;
  }

  cambiarPantalla("Registrarse", linkRegistro);

  // minlength establece una longitud mínima.
  // maxlength establece una longitud máxima.
  //
  // pattern limita los caracteres del nombre de usuario.
  // Las restricciones HTML se validan al enviar el formulario.
  app.innerHTML = `
    <section class="registro-section form-panel">
      <h2>Creá tu perfil de entrenador</h2>

      <p class="section-intro">
        Elegí tus datos y un avatar para comenzar.
      </p>

      <form id="form-registro" class="app-form">
        <label for="nombre">Nombre</label>

        <input
          type="text"
          id="nombre"
          maxlength="50"
          autocomplete="given-name"
          required
        />

        <label for="apellido">Apellido</label>

        <input
          type="text"
          id="apellido"
          maxlength="50"
          autocomplete="family-name"
          required
        />

        <label for="email">Correo electrónico</label>

        <input
          type="email"
          id="email"
          autocomplete="email"
          required
        />

        <label for="nuevo-username">Nombre de usuario</label>

        <input
          type="text"
          id="nuevo-username"
          pattern="[A-Za-z0-9_.-]+"
          maxlength="30"
          title="Usá letras sin tildes, números, punto, guion o guion bajo."
          autocomplete="username"
          required
        />

        <label for="nueva-password">
          Contraseña (mínimo 6 caracteres)
        </label>

        <input
          type="password"
          id="nueva-password"
          minlength="6"
          autocomplete="new-password"
          required
        />

        <label for="confirmar-password">
          Repetir contraseña
        </label>

        <input
          type="password"
          id="confirmar-password"
          minlength="6"
          autocomplete="new-password"
          required
        />

        <label for="avatar">Avatar</label>

        <select id="avatar">
          ${opcionesAvatar()}
        </select>

        <img
          id="avatar-preview"
          class="avatar-preview"
          alt="Vista previa del avatar"
        />

        <p class="form-message" role="alert"></p>

        <button type="submit" class="btn-primary">
          Crear cuenta
        </button>
      </form>
    </section>
  `;

  // Seleccionamos un avatar inicial.
  activarAvatar("./assets/avatar/red.png");

  // Lo siguiente se ejecuta cuando se envía el formulario.
  document.querySelector("#form-registro").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      // Capturamos los datos ingresados.
      const nombre = document.querySelector("#nombre").value.trim();
      const apellido = document.querySelector("#apellido").value.trim();
      const email = document.querySelector("#email")
        .value.trim().toLowerCase();
      const username = document.querySelector("#nuevo-username")
        .value.trim();
      const password = document.querySelector("#nueva-password").value;

      // Rechazamos los campos que están vacíos
      // o contienen solamente espacios.
      if (
        nombre === "" ||
        apellido === "" ||
        password.trim() === ""
      ) {
        mensajeFormulario(
          "Completá los datos sin dejar campos en blanco."
        );
        return;
      }

      // No permitimos repetir el correo o nombre de usuario.
      if (usuarioDuplicado(email, username, null)) {
        mensajeFormulario(
          "El correo o nombre de usuario ya está registrado."
        );
        return;
      }

      // La contraseña debe coincidir con su confirmación.
      if (
        password !==
        document.querySelector("#confirmar-password").value
      ) {
        mensajeFormulario("Las contraseñas no coinciden.");
        return;
      }

      // Buscamos un ID mayor que todos los existentes.
      //
      // No usamos solamente la cantidad de usuarios,
      // porque los ID podrían tener saltos.
      let id = 1;

      for (let usuario of leerUsuarios()) {
        if (usuario.id >= id) {
          id = usuario.id + 1;
        }
      }

      // Construimos el objeto que representa la cuenta.
      //
      // admin siempre es false:
      // un usuario nuevo no puede elegirse administrador.
      const nuevoUsuario = {
        id: id,
        nombre: nombre,
        apellido: apellido,
        email: email,
        username: username,
        password: password,
        avatar: document.querySelector("#avatar").value,
        admin: false
      };

      // Guardamos la cuenta y conectamos automáticamente al usuario.
      guardarUsuarios(nuevoUsuario);
      iniciarSesion(nuevoUsuario.id);

      actualizarMenu();
      mostrarPerfil("¡Tu cuenta se creó correctamente!");
    }
  );
}

// ==========================================================
// 18. MOSTRAR EL PERFIL
// ==========================================================

function mostrarPerfil(mensaje) {
  const usuario = leerSesion();

  // Sin sesión válida, pedimos iniciar sesión.
  if (usuario === null) {
    mostrarLogin();
    return;
  }

  cambiarPantalla("Mi perfil", linkLogin);

  // Elegimos el nombre visible del rol.
  let rol = "Entrenador";

  if (usuario.admin) {
    rol = "Administrador";
  }

  // Mostramos los datos actuales de la cuenta.
  // La contraseña no se muestra en esta pantalla.
  app.innerHTML = `
    <section class="user-profile">
      <p class="success-message" role="status">
        ${texto(mensaje)}
      </p>

      <div class="profile-card">
        <img
          class="user-profile-avatar"
          src="${texto(usuario.avatar)}"
          alt="Avatar de ${texto(usuario.username)}"
        />

        <div class="profile-info">
          <span class="role-badge">${rol}</span>

          <h2>
            ¡Bienvenido, ${texto(usuario.nombre)}!
          </h2>

          <dl class="profile-data">
            <div>
              <dt>Nombre y apellido</dt>
              <dd>
                ${texto(usuario.nombre)}
                ${texto(usuario.apellido)}
              </dd>
            </div>

            <div>
              <dt>Usuario</dt>
              <dd>${texto(usuario.username)}</dd>
            </div>

            <div>
              <dt>Correo electrónico</dt>
              <dd>${texto(usuario.email)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="actions">
        <button id="editar-perfil" class="btn-primary">
          Editar mi perfil
        </button>

        <button id="perfil-pokedex" class="btn-secondary">
          Ver Pokédex
        </button>

        <span id="perfil-admin"></span>
      </div>
    </section>
  `;

  document.querySelector("#editar-perfil").addEventListener(
    "click",
    mostrarEditarPerfil
  );

  document.querySelector("#perfil-pokedex").addEventListener(
    "click",
    mostrarPokedex
  );

  // Solo agregamos este acceso cuando la cuenta es administradora.
  if (usuario.admin) {
    document.querySelector("#perfil-admin").innerHTML = `
      <button id="administrar" class="btn-secondary">
        Administrar Pokémon
      </button>
    `;

    document.querySelector("#administrar").addEventListener(
      "click",
      mostrarAdmin
    );
  }
}

// ==========================================================
// 19. EDITAR EL PERFIL
// ==========================================================

function mostrarEditarPerfil() {
  const usuario = leerSesion();

  if (usuario === null) {
    mostrarLogin();
    return;
  }

  cambiarPantalla("Editar perfil", linkLogin);

  // Creamos los campos de edición.
  //
  // Los campos de contraseña son opcionales y comienzan vacíos.
  // Dejarlos vacíos conserva la contraseña actual.
  app.innerHTML = `
    <section class="form-panel">
      <h2>Tus datos de entrenador</h2>

      <form id="form-perfil" class="app-form">
        <label for="nombre">Nombre</label>

        <input
          id="nombre"
          type="text"
          maxlength="50"
          autocomplete="given-name"
          required
        />

        <label for="apellido">Apellido</label>

        <input
          id="apellido"
          type="text"
          maxlength="50"
          autocomplete="family-name"
          required
        />

        <label for="email">Correo electrónico</label>

        <input
          id="email"
          type="email"
          autocomplete="email"
          required
        />

        <label for="avatar">Avatar</label>

        <select id="avatar">
          ${opcionesAvatar()}
        </select>

        <img
          id="avatar-preview"
          class="avatar-preview"
          alt="Vista previa del avatar"
        />

        <fieldset>
          <legend>Cambiar contraseña</legend>

          <p class="field-hint">
            Dejá estos campos vacíos para conservar tu contraseña.
          </p>

          <label for="actual-password">
            Contraseña actual
          </label>

          <input
            type="password"
            id="actual-password"
            autocomplete="current-password"
          />

          <label for="nueva-password">
            Nueva contraseña (mínimo 6 caracteres)
          </label>

          <input
            type="password"
            id="nueva-password"
            minlength="6"
            autocomplete="new-password"
          />

          <label for="confirmar-password">
            Repetir nueva contraseña
          </label>

          <input
            type="password"
            id="confirmar-password"
            autocomplete="new-password"
          />
        </fieldset>

        <p class="form-message" role="alert"></p>

        <div class="actions">
          <button type="submit" class="btn-primary">
            Guardar cambios
          </button>

          <button
            type="button"
            id="cancelar-perfil"
            class="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  `;

  // Precargamos los datos para que puedan modificarse.
  //
  // Asignar value escribe en un campo.
  // Leer value obtiene su contenido.
  document.querySelector("#nombre").value = usuario.nombre;
  document.querySelector("#apellido").value = usuario.apellido;
  document.querySelector("#email").value = usuario.email;

  activarAvatar(usuario.avatar);

  // Cancelar vuelve al perfil sin guardar el formulario.
  document.querySelector("#cancelar-perfil").addEventListener(
    "click",
    function () {
      mostrarPerfil("");
    }
  );

  document.querySelector("#form-perfil").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      // Comprobamos que la sesión siga perteneciendo al mismo usuario.
      const actual = leerSesion();

      if (actual === null || actual.id !== usuario.id) {
        actualizarMenu();
        mostrarBienvenida();
        return;
      }

      // Capturamos los valores nuevos.
      // Todavía no los guardamos en localStorage.
      const nombre = document.querySelector("#nombre").value.trim();
      const apellido = document.querySelector("#apellido").value.trim();
      const email = document.querySelector("#email")
        .value.trim().toLowerCase();

      const passwordActual = document.querySelector("#actual-password").value;
      const passwordNueva = document.querySelector("#nueva-password").value;
      const confirmar = document.querySelector("#confirmar-password").value;

      // No permitimos nombres vacíos.
      if (nombre === "" || apellido === "") {
        mensajeFormulario("Completá nombre y apellido.");
        return;
      }

      // El correo no puede pertenecer a otra cuenta.
      // Pasamos el ID propio para excluirlo de la búsqueda.
      if (usuarioDuplicado(email, actual.username, actual.id)) {
        mensajeFormulario("Ese correo ya pertenece a otro usuario.");
        return;
      }

      // Si se completó cualquiera de los campos de contraseña,
      // exigimos validar todo el cambio.
      if (
        passwordActual !== "" ||
        passwordNueva !== "" ||
        confirmar !== ""
      ) {
        // Primero comprobamos la contraseña actual.
        if (passwordActual !== actual.password) {
          mensajeFormulario("La contraseña actual es incorrecta.");
          return;
        }

        // La nueva debe tener al menos seis caracteres
        // y coincidir exactamente con su confirmación.
        if (
          passwordNueva.trim().length < 6 ||
          passwordNueva !== confirmar
        ) {
          mensajeFormulario(
            "La nueva contraseña debe tener al menos 6 caracteres y coincidir en ambos campos."
          );
          return;
        }

        // Solo después de validar, reemplazamos la contraseña.
        actual.password = passwordNueva;
      }

      // Modificamos las propiedades editables del objeto.
      //
      // Conservamos su ID, username y permiso admin.
      actual.nombre = nombre;
      actual.apellido = apellido;
      actual.email = email;
      actual.avatar = document.querySelector("#avatar").value;

      // Guardamos la cuenta actualizada.
      actualizarUsuario(actual);

      // Volvemos a mostrar el perfil con sus datos nuevos.
      mostrarPerfil("Tu perfil se actualizó correctamente.");
    }
  );
}

// ==========================================================
// 20. MOSTRAR EL PANEL DE ADMINISTRACIÓN
// ==========================================================

function mostrarAdmin() {
  // Comprobamos el rol al entrar a la función,
  // además de ocultar el enlace en el menú.
  if (!esAdmin()) {
    mostrarBienvenida();
    return;
  }

  cambiarPantalla("Administración", linkAdmin);

  // Creamos las opciones con todos los Pokémon guardados.
  let opciones = '<option value="">Seleccioná un Pokémon</option>';

  for (let pokemon of leerPokemones()) {
    // El texto muestra número y nombre.
    // El value guarda el ID que se utilizará para editar.
    opciones += `
      <option value="${pokemon.id}">
        N.º ${numeroPokedex(pokemon.id)} · ${texto(pokemon.nombre)}
      </option>
    `;
  }

  app.innerHTML = `
    <section class="form-panel admin-panel">
      <p class="eyebrow">ACCESO ADMINISTRADOR</p>

      <h2>Administrar Pokémon</h2>

      <p class="section-intro">
        Agregá nuevas entradas o actualizá
        los Pokémon de la Pokédex.
      </p>

      <button id="nuevo-pokemon" class="btn-primary">
        Cargar nuevo Pokémon
      </button>

      <form
        id="form-elegir-pokemon"
        class="app-form admin-selector"
      >
        <label for="pokemon-editar">
          Editar un Pokémon existente
        </label>

        <select id="pokemon-editar" required>
          ${opciones}
        </select>

        <button type="submit" class="btn-secondary">
          Editar seleccionado
        </button>
      </form>
    </section>
  `;

  // null indica que se creará un Pokémon nuevo.
  document.querySelector("#nuevo-pokemon").addEventListener(
    "click",
    function () {
      mostrarFormularioPokemon(null);
    }
  );

  // Para editar, enviamos el ID seleccionado.
  document.querySelector("#form-elegir-pokemon").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      mostrarFormularioPokemon(
        Number(document.querySelector("#pokemon-editar").value)
      );
    }
  );
}

// ==========================================================
// 21. CREAR LAS OPCIONES DE TIPO
// ==========================================================

function opcionesTipo() {
  let opciones = "";

  // Generamos una opción por cada tipo disponible.
  for (let tipo of tipos) {
    opciones += `<option value="${tipo}">${tipo}</option>`;
  }

  return opciones;
}

// ==========================================================
// 22. MOSTRAR EL FORMULARIO DE ALTA O EDICIÓN DE POKÉMON
// ==========================================================

// El mismo formulario sirve para ambas operaciones.
//
// idOriginal = null: crear un Pokémon.
// idOriginal numérico: editar ese Pokémon.
function mostrarFormularioPokemon(idOriginal) {
  if (!esAdmin()) {
    mostrarBienvenida();
    return;
  }

  // Por defecto, preparamos el modo de carga nueva.
  let pokemon = null;
  let titulo = "Nuevo Pokémon";
  let boton = "Agregar Pokémon";

  // Si recibimos un ID, cambiamos al modo edición.
  if (idOriginal !== null) {
    pokemon = buscarPokemon(idOriginal);

    // Si ese Pokémon no existe, volvemos al panel.
    if (pokemon === null) {
      mostrarAdmin();
      return;
    }

    titulo = "Editar Pokémon";
    boton = "Guardar cambios";
  }

  cambiarPantalla(titulo, linkAdmin);

  // input type="number" permite valores numéricos.
  // min establece un mínimo.
  // step="1" exige enteros.
  // step="any" permite decimales.
  //
  // Las casillas de evolución y shiny controlarán
  // los campos que comienzan deshabilitados.
  app.innerHTML = `
    <section class="pokemon-form-panel">
      <p class="eyebrow">ACCESO ADMINISTRADOR</p>

      <h2>${titulo}</h2>

      <p class="section-intro">
        Los cambios se guardan en este navegador.
        Todos los campos son obligatorios salvo los indicados.
      </p>

      <form id="form-nuevo-pokemon" class="app-form pokemon-form">
        <div>
          <label for="pokemon-number">
            Número en la Pokédex
          </label>

          <input
            type="number"
            id="pokemon-number"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label for="pokemon-name">Nombre</label>

          <input
            type="text"
            id="pokemon-name"
            maxlength="60"
            required
          />
        </div>

        <div class="full-width">
          <label for="pokemon-description">
            Descripción
          </label>

          <textarea
            id="pokemon-description"
            rows="4"
            maxlength="2000"
            required
          ></textarea>
        </div>

        <div>
          <label for="pokemon-type">Tipo principal</label>

          <select id="pokemon-type" required>
            <option value="">Seleccioná un tipo</option>
            ${opcionesTipo()}
          </select>
        </div>

        <div>
          <label for="pokemon-type-secondary">
            Tipo secundario (opcional)
          </label>

          <select id="pokemon-type-secondary">
            <option value="">Sin segundo tipo</option>
            ${opcionesTipo()}
          </select>
        </div>

        <div>
          <label for="pokemon-height">Altura (m)</label>

          <input
            type="number"
            id="pokemon-height"
            min="0.01"
            step="any"
            required
          />
        </div>

        <div>
          <label for="pokemon-weight">Peso (kg)</label>

          <input
            type="number"
            id="pokemon-weight"
            min="0.01"
            step="any"
            required
          />
        </div>

        <div>
          <label for="pokemon-generation">
            Generación
          </label>

          <input
            type="number"
            id="pokemon-generation"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label for="pokemon-ability">Habilidad</label>

          <input
            type="text"
            id="pokemon-ability"
            maxlength="80"
            required
          />
        </div>

        <div>
          <label for="pokemon-hp">HP</label>

          <input
            type="number"
            id="pokemon-hp"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label for="pokemon-attack">Ataque</label>

          <input
            type="number"
            id="pokemon-attack"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label for="pokemon-defense">Defensa</label>

          <input
            type="number"
            id="pokemon-defense"
            min="1"
            step="1"
            required
          />
        </div>

        <div>
          <label for="pokemon-speed">Velocidad</label>

          <input
            type="number"
            id="pokemon-speed"
            min="1"
            step="1"
            required
          />
        </div>

        <fieldset class="full-width">
          <legend>Evolución</legend>

          <label class="check-label">
            <input
              type="checkbox"
              id="pokemon-has-evolution"
            />
            Tiene evolución
          </label>

          <label for="pokemon-evolution">
            Nombre de la evolución
          </label>

          <input
            type="text"
            id="pokemon-evolution"
            maxlength="60"
            disabled
          />

          <label for="pokemon-evolution-level">
            Nivel de evolución (opcional)
          </label>

          <input
            type="number"
            id="pokemon-evolution-level"
            min="1"
            step="1"
            disabled
          />

          <p class="field-hint">
            Dejá el nivel vacío si evoluciona con una piedra,
            por intercambio u otro método.
          </p>
        </fieldset>

        <div>
          <label for="pokemon-rarity">Rareza</label>

          <select id="pokemon-rarity" required>
            <option value="">Seleccioná una rareza</option>
            <option>Común</option>
            <option>Poco común</option>
            <option>Raro</option>
            <option>Legendario</option>
            <option>Mítico</option>
            <option>Singular</option>
          </select>
        </div>

        <div>
          <label for="pokemon-image">
            Imagen (ruta o URL)
          </label>

          <input
            type="text"
            id="pokemon-image"
            placeholder="./assets/img/pikachu.png"
            required
          />
        </div>

        <div class="full-width">
          <label for="pokemon-sound">
            Sonido (ruta o URL)
          </label>

          <input
            type="text"
            id="pokemon-sound"
            placeholder="./assets/sound/pikachu.mp3"
            required
          />
        </div>

        <fieldset class="full-width">
          <legend>Variante shiny</legend>

          <label class="check-label">
            <input type="checkbox" id="pokemon-shiny" />
            Tiene versión shiny
          </label>

          <label for="pokemon-shiny-image">
            Imagen shiny (ruta o URL)
          </label>

          <input
            type="text"
            id="pokemon-shiny-image"
            placeholder="./assets/img/pikachu-shiny.png"
            disabled
          />
        </fieldset>

        <p class="form-message full-width" role="alert"></p>

        <div class="actions full-width">
          <button type="submit" class="btn-primary">
            ${boton}
          </button>

          <button
            type="button"
            id="cancelar-pokemon"
            class="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  `;

  // Si es edición, completamos los campos con sus datos actuales.
  if (pokemon !== null) {
    completarFormularioPokemon(pokemon);
  }

  // Ajustamos los campos según el estado de las casillas.
  actualizarOpcionales();

  // Volvemos a ajustar los campos cuando cambia una casilla.
  document.querySelector("#pokemon-has-evolution").addEventListener(
    "change",
    actualizarOpcionales
  );

  document.querySelector("#pokemon-shiny").addEventListener(
    "change",
    actualizarOpcionales
  );

  document.querySelector("#cancelar-pokemon").addEventListener(
    "click",
    mostrarAdmin
  );

  // Al enviar, otra función captura, valida y guarda.
  document.querySelector("#form-nuevo-pokemon").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      // Conservamos el ID original aunque se cambie
      // el número de Pokédex en el formulario.
      guardarFormularioPokemon(idOriginal);
    }
  );
}

// ==========================================================
// 23. PRECARGAR DATOS EN EL FORMULARIO DE EDICIÓN
// ==========================================================

function completarFormularioPokemon(pokemon) {
  // Copiamos las propiedades del objeto a los campos.
  document.querySelector("#pokemon-number").value = pokemon.id;
  document.querySelector("#pokemon-name").value = pokemon.nombre;
  document.querySelector("#pokemon-description").value =
    pokemon.descripcion;

  // Los arrays comienzan en la posición 0.
  // tipo[0] es el primer tipo.
  // tipo[1] es el segundo tipo, si existe.
  document.querySelector("#pokemon-type").value = pokemon.tipo[0];

  if (pokemon.tipo.length > 1) {
    document.querySelector("#pokemon-type-secondary").value =
      pokemon.tipo[1];
  }

  document.querySelector("#pokemon-height").value = pokemon.altura;
  document.querySelector("#pokemon-weight").value = pokemon.peso;
  document.querySelector("#pokemon-generation").value =
    pokemon.generacion;
  document.querySelector("#pokemon-hp").value = pokemon.hp;
  document.querySelector("#pokemon-attack").value = pokemon.ataque;
  document.querySelector("#pokemon-defense").value = pokemon.defensa;
  document.querySelector("#pokemon-speed").value = pokemon.velocidad;
  document.querySelector("#pokemon-ability").value = pokemon.habilidad;

  // Para casillas usamos checked en lugar de value.
  // checked recibe true o false.
  document.querySelector("#pokemon-has-evolution").checked =
    pokemon.tieneEvolucion;

  document.querySelector("#pokemon-evolution").value =
    pokemon.evolucion;
  document.querySelector("#pokemon-evolution-level").value =
    pokemon.nivelEvolucion;

  document.querySelector("#pokemon-rarity").value = pokemon.rareza;
  document.querySelector("#pokemon-image").value = pokemon.imagen;
  document.querySelector("#pokemon-sound").value = pokemon.sonido;

  document.querySelector("#pokemon-shiny").checked = pokemon.shiny;
  document.querySelector("#pokemon-shiny-image").value =
    pokemon.imagenShiny;
}

// ==========================================================
// 24. HABILITAR LOS CAMPOS OPCIONALES
// ==========================================================

function actualizarOpcionales() {
  // checked indica si la casilla está marcada.
  const tieneEvolucion = document.querySelector(
    "#pokemon-has-evolution"
  ).checked;

  // Si tiene evolución:
  // disabled queda en false y se puede completar el campo.
  //
  // Si no tiene evolución:
  // disabled queda en true y el campo se deshabilita.
  document.querySelector("#pokemon-evolution").disabled =
    !tieneEvolucion;

  // El nombre de la evolución solo es obligatorio
  // cuando se marca la casilla.
  document.querySelector("#pokemon-evolution").required =
    tieneEvolucion;

  // El nivel se habilita, pero sigue siendo opcional.
  document.querySelector("#pokemon-evolution-level").disabled =
    !tieneEvolucion;

  const shiny = document.querySelector("#pokemon-shiny").checked;

  // La imagen shiny se habilita y se vuelve obligatoria
  // únicamente si se marca la casilla.
  document.querySelector("#pokemon-shiny-image").disabled = !shiny;
  document.querySelector("#pokemon-shiny-image").required = shiny;
}

// ==========================================================
// 25. COMPROBAR EL PREFIJO DE LAS RUTAS
// ==========================================================

function rutaValida(ruta) {
  // startsWith comprueba cómo comienza un texto.
  //
  // Con || alcanza con que una de estas opciones sea verdadera.
  //
  // Esto comprueba el prefijo de la ruta.
  // No verifica que el archivo o la dirección existan.
  return (
    ruta.startsWith("./assets/") ||
    ruta.startsWith("assets/") ||
    ruta.startsWith("https://") ||
    ruta.startsWith("http://")
  );
}

// ==========================================================
// 26. CAPTURAR, VALIDAR Y GUARDAR EL POKÉMON
// ==========================================================

function guardarFormularioPokemon(idOriginal) {
  // Revisamos otra vez el permiso al guardar,
  // por si la sesión cambió desde que se abrió el formulario.
  if (!esAdmin()) {
    actualizarMenu();
    mostrarBienvenida();
    return;
  }

  // El primer tipo se coloca en un array.
  const tipo = [
    document.querySelector("#pokemon-type").value
  ];

  const segundoTipo = document.querySelector(
    "#pokemon-type-secondary"
  ).value;

  // Si se eligió un segundo tipo, comprobamos que sea diferente.
  if (segundoTipo !== "") {
    if (segundoTipo === tipo[0]) {
      mensajeFormulario("Los dos tipos deben ser diferentes.");
      return;
    }

    tipo.push(segundoTipo);
  }

  // Si no tiene evolución, estos datos quedan en null.
  let evolucion = null;
  let nivelEvolucion = null;

  const tieneEvolucion = document.querySelector(
    "#pokemon-has-evolution"
  ).checked;

  if (tieneEvolucion) {
    evolucion = document.querySelector("#pokemon-evolution")
      .value.trim();

    if (evolucion === "") {
      mensajeFormulario("Escribí el nombre de la evolución.");
      return;
    }

    // Solo leemos el nivel como número cuando tiene contenido.
    // Dejarlo vacío conserva null.
    if (
      document.querySelector("#pokemon-evolution-level").value !== ""
    ) {
      nivelEvolucion = document.querySelector(
        "#pokemon-evolution-level"
      ).valueAsNumber;
    }
  }

  // Si no hay shiny, guardamos su ruta vacía.
  let imagenShiny = "";

  const shiny = document.querySelector("#pokemon-shiny").checked;

  if (shiny) {
    imagenShiny = document.querySelector("#pokemon-shiny-image")
      .value.trim();
  }

  // Construimos el objeto completo.
  //
  // value devuelve texto.
  // valueAsNumber devuelve un número desde un campo numérico.
  // checked devuelve true o false desde una casilla.
  //
  // En modo edición también construimos el objeto entero:
  // será la nueva versión que reemplazará al anterior.
  const nuevoPokemon = {
    id: document.querySelector("#pokemon-number").valueAsNumber,

    nombre: document.querySelector("#pokemon-name").value.trim(),

    descripcion: document.querySelector("#pokemon-description")
      .value.trim(),

    tipo: tipo,

    altura: document.querySelector("#pokemon-height").valueAsNumber,

    peso: document.querySelector("#pokemon-weight").valueAsNumber,

    generacion: document.querySelector(
      "#pokemon-generation"
    ).valueAsNumber,

    hp: document.querySelector("#pokemon-hp").valueAsNumber,

    ataque: document.querySelector("#pokemon-attack").valueAsNumber,

    velocidad: document.querySelector("#pokemon-speed").valueAsNumber,

    defensa: document.querySelector("#pokemon-defense").valueAsNumber,

    habilidad: document.querySelector("#pokemon-ability").value.trim(),

    tieneEvolucion: tieneEvolucion,

    evolucion: evolucion,

    nivelEvolucion: nivelEvolucion,

    rareza: document.querySelector("#pokemon-rarity").value,

    imagen: document.querySelector("#pokemon-image").value.trim(),

    sonido: document.querySelector("#pokemon-sound").value.trim(),

    shiny: shiny,

    imagenShiny: imagenShiny
  };

  // Rechazamos los textos obligatorios que quedaron vacíos
  // después de quitar espacios externos.
  if (
    nuevoPokemon.nombre === "" ||
    nuevoPokemon.descripcion === "" ||
    nuevoPokemon.habilidad === ""
  ) {
    mensajeFormulario(
      "Completá nombre, descripción y habilidad sin dejarlos en blanco."
    );
    return;
  }

  // Comprobamos que no haya otro Pokémon con el mismo ID o nombre.
  //
  // Al editar, excluimos el Pokémon que tenía idOriginal:
  // no debe considerarse un duplicado de sí mismo.
  for (let pokemon of leerPokemones()) {
    if (
      pokemon.id !== idOriginal &&
      (
        pokemon.id === nuevoPokemon.id ||
        pokemon.nombre.toLowerCase() ===
          nuevoPokemon.nombre.toLowerCase()
      )
    ) {
      mensajeFormulario(
        "Ya existe un Pokémon con ese número o nombre."
      );
      return;
    }
  }

  // Validamos los prefijos de imagen y sonido.
  // La imagen shiny solo se revisa si esa variante está activa.
  if (
    !rutaValida(nuevoPokemon.imagen) ||
    !rutaValida(nuevoPokemon.sonido) ||
    (shiny && !rutaValida(imagenShiny))
  ) {
    mensajeFormulario(
      "Usá rutas dentro de ./assets/ o direcciones que comiencen con https:// o http:// para los recursos."
    );
    return;
  }

  // Todas las validaciones pasaron.
  // Ahora sí decidimos qué operación de guardado corresponde.
  let mensaje = "Pokémon agregado correctamente.";

  if (idOriginal === null) {
    // No había ID original: es una carga nueva.
    guardarPokemones(nuevoPokemon);
  } else {
    // Había ID original: reemplazamos ese registro.
    actualizarPokemon(idOriginal, nuevoPokemon);
    mensaje = "Pokémon actualizado correctamente.";
  }

  // Abrimos el detalle con los datos guardados.
  mostrarDetalle(nuevoPokemon.id, mensaje);
}

// ==========================================================
// BATALLA: ESCENAS Y DECISIONES, COMO EN AURORA
// ==========================================================

// Entrar desde el menú siempre muestra la presentación.
function mostrarBatalla() {
  cambiarPantalla("Batalla", linkJuego);
  mostrarEscenaBatalla("inicio");
}

// Recibe el ID de una escena y busca su objeto en game.js.
function mostrarEscenaBatalla(id) {
  for (let escena of escenasBatalla) {
    if (escena.id === id) {
      // Primero creamos la pantalla.
      //
      // Dejamos espacios vacíos para insertar después
      // los párrafos y las opciones de esta escena.
      //
      // escena.tipo permite aplicar estilos distintos
      // a la presentación, las decisiones y los finales.
      app.innerHTML = `
        <section class="batalla-section battle-screen battle-${escena.tipo}">
          <div class="battle-heading">
            <p class="eyebrow">
              BATALLA GUIONADA · ${escena.etiqueta}
            </p>

            <h2 id="titulo-batalla" tabindex="-1">
              ${escena.titulo}
            </h2>
          </div>

          <div
            class="battle-arena"
            aria-label="Greninja contra Garchomp"
          >
            <article class="battle-fighter">
              <p class="battle-owner">TU POKÉMON</p>

              <h3>Greninja</h3>

              <img
                src="./assets/img/greninja.png"
                alt="Greninja, tu Pokémon"
              />

              <p class="battle-state">
                ${escena.estadoGreninja}
              </p>
            </article>

            <span class="battle-versus" aria-hidden="true">
              VS
            </span>

            <article class="battle-fighter battle-rival">
              <p class="battle-owner">RIVAL</p>

              <h3>Garchomp</h3>

              <img
                src="./assets/img/garchomp.png"
                alt="Garchomp, tu rival"
              />

              <p class="battle-state">
                ${escena.estadoGarchomp}
              </p>
            </article>
          </div>

          <div class="battle-story">
            <div
              id="texto-batalla"
              aria-live="polite"
            ></div>

            <h3>${escena.pregunta}</h3>

            <div
              id="opciones-batalla"
              class="battle-options"
            ></div>
          </div>
        </section>
      `;

      // Recorremos los textos de la escena y agregamos
      // un párrafo por cada elemento del array.
      const narracion = document.querySelector("#texto-batalla");

      for (let parrafo of escena.textos) {
        narracion.innerHTML += `<p>${parrafo}</p>`;
      }

      // Creamos un botón por cada opción disponible.
      const opciones = document.querySelector("#opciones-batalla");

      for (let opcion of escena.opciones) {
        opciones.innerHTML += `
          <button
            type="button"
            id="${opcion.id}"
            class="btn-primary"
          >
            ${opcion.texto}
          </button>
        `;
      }

      // Asignamos los eventos DESPUÉS de crear todos los botones.
      //
      // Cada opción recuerda su destino:
      // otra escena o la salida a la Pokédex.
      for (let opcion of escena.opciones) {
        document.querySelector("#" + opcion.id).addEventListener(
          "click",
          function () {
            if (opcion.destino === "pokedex") {
              mostrarPokedex();
            } else {
              mostrarEscenaBatalla(opcion.destino);
            }
          }
        );
      }

      // Llevamos el foco al título nuevo para facilitar
      // el seguimiento de las escenas usando el teclado.
      document.querySelector("#titulo-batalla").focus();

      // Ya encontramos y mostramos la escena.
      // Terminamos la función para no seguir recorriendo.
      return;
    }
  }

  // Si se indicó un ID inexistente, volvemos a la presentación.
  mostrarBatalla();
}

// ==========================================================
// 28. ASIGNAR LOS EVENTOS DEL MENÚ PRINCIPAL
// ==========================================================

// Estas líneas están fuera de las funciones.
// Se ejecutan al cargar el módulo.
//
// Cada enlace recibe un evento.
// Su función se ejecutará cuando ocurra el clic.
//
// preventDefault evita la navegación normal de href="#".

linkInicio.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarBienvenida();
});

linkPokedex.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarPokedex();
});

linkLogin.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarLogin();
});

linkRegistro.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarRegistro();
});

linkAdmin.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarAdmin();
});

linkJuego.addEventListener("click", function (event) {
  event.preventDefault();
  mostrarBatalla();
});

linkSalir.addEventListener("click", function (event) {
  event.preventDefault();

  // Borramos el ID de sesión.
  cerrarSesion();

  // Adaptamos el menú al estado de visitante.
  actualizarMenu();

  // Volvemos a la bienvenida.
  mostrarBienvenida();
});

// ==========================================================
// 29. INICIAR LA APLICACIÓN
// ==========================================================

// Después de definir las funciones y conectar los eventos,
// ejecutamos estas llamadas para mostrar la primera pantalla.
//
// Si hay una sesión guardada, la bienvenida abre el perfil.
// Si no hay sesión, muestra el inicio general.
actualizarMenu();
mostrarBienvenida();