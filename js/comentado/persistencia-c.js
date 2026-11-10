// Importamos los datos iniciales.
// Solo se usan para crear las listas cuando todavía no están guardadas.
import { pokemones } from "./db/pokemones.js";
import { usuarios } from "./db/usuarios.js";

// ==========================================================
// 1. PREPARAR LOS DATOS INICIALES
// ==========================================================

// getItem devuelve null si la clave no existe.
// Si no hay Pokémon guardados, guardamos los iniciales.
if (localStorage.getItem("ls-pokemones") === null) {
  localStorage.setItem(
    "ls-pokemones",
    JSON.stringify(pokemones)
  );
}

// Hacemos lo mismo con los usuarios.
//
// Estas condiciones evitan sobrescribir los datos cada vez
// que se abre la aplicación. Así se conservan los cambios.
if (localStorage.getItem("ls-usuarios") === null) {
  localStorage.setItem(
    "ls-usuarios",
    JSON.stringify(usuarios)
  );
}

// ==========================================================
// 2. LEER LOS POKÉMON
// ==========================================================

// export permite importar esta función desde otro archivo.
export function leerPokemones() {
  // Recuperamos el texto guardado y lo convertimos en un array.
  // return entrega ese array a quien llamó a la función.
  return JSON.parse(
    localStorage.getItem("ls-pokemones")
  );
}

// ==========================================================
// 3. LEER LOS USUARIOS
// ==========================================================

export function leerUsuarios() {
  // Funciona igual que leerPokemones, pero con la lista de usuarios.
  return JSON.parse(
    localStorage.getItem("ls-usuarios")
  );
}

// ==========================================================
// 4. AGREGAR UN POKÉMON
// ==========================================================

// pokemon es el objeto nuevo que recibe esta función.
export function guardarPokemones(pokemon) {
  // Recuperamos todos los Pokémon existentes.
  let lista = leerPokemones();

  // push agrega el Pokémon al final del array.
  lista.push(pokemon);

  // Modificar el array no actualiza localStorage automáticamente.
  // Por eso volvemos a guardar la lista completa como texto JSON.
  localStorage.setItem(
    "ls-pokemones",
    JSON.stringify(lista)
  );
}

// ==========================================================
// 5. AGREGAR UN USUARIO
// ==========================================================

export function guardarUsuarios(usuario) {
  // Recuperamos los usuarios existentes.
  let lista = leerUsuarios();

  // Agregamos el usuario nuevo.
  lista.push(usuario);

  // Guardamos la lista actualizada.
  localStorage.setItem(
    "ls-usuarios",
    JSON.stringify(lista)
  );
}

// ==========================================================
// 6. EDITAR UN POKÉMON
// ==========================================================

// idOriginal: identifica al Pokémon antes de editarlo.
// pokemonEditado: objeto completo con los datos nuevos.
export function actualizarPokemon(idOriginal, pokemonEditado) {
  let lista = leerPokemones();

  // Este for recorre las posiciones del array.
  //
  // let i = 0: empezamos en la primera posición.
  // i < lista.length: seguimos mientras queden elementos.
  // i++: aumentamos la posición de uno en uno.
  for (let i = 0; i < lista.length; i++) {
    // Buscamos el objeto que tenía el ID original.
    if (lista[i].id === idOriginal) {
      // Reemplazamos ese objeto por su versión editada.
      lista[i] = pokemonEditado;

      // Ya lo encontramos: break termina el recorrido.
      break;
    }
  }

  // Guardamos la lista completa después del reemplazo.
  //
  // Buscar por idOriginal permite cambiar incluso el número
  // de Pokédex sin dejar una copia del objeto anterior.
  localStorage.setItem(
    "ls-pokemones",
    JSON.stringify(lista)
  );
}

// ==========================================================
// 7. EDITAR UN USUARIO
// ==========================================================

export function actualizarUsuario(usuarioEditado) {
  let lista = leerUsuarios();

  // Buscamos la posición del usuario que estamos editando.
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === usuarioEditado.id) {
      // Reemplazamos solamente esa cuenta.
      lista[i] = usuarioEditado;
      break;
    }
  }

  // Las otras cuentas permanecen dentro de la misma lista.
  localStorage.setItem(
    "ls-usuarios",
    JSON.stringify(lista)
  );
}

// ==========================================================
// 8. INICIAR UNA SESIÓN
// ==========================================================

export function iniciarSesion(id) {
  // Recordamos únicamente el ID del usuario conectado.
  //
  // Sus datos completos siguen dentro de la lista de usuarios.
  localStorage.setItem(
    "ls-sesion",
    JSON.stringify(id)
  );
}

// ==========================================================
// 9. LEER LA SESIÓN ACTUAL
// ==========================================================

export function leerSesion() {
  // Recuperamos el ID del usuario conectado.
  //
  // Si la clave no existe, getItem devuelve null.
  // JSON.parse(null) también devuelve null en esta llamada.
  const id = JSON.parse(
    localStorage.getItem("ls-sesion")
  );

  // Buscamos ese ID en la lista actualizada de usuarios.
  for (let usuario of leerUsuarios()) {
    if (usuario.id === id) {
      // Devolvemos el objeto completo.
      //
      // Como se vuelve a leer la lista, obtenemos los cambios
      // de nombre, correo o avatar que se hayan guardado.
      return usuario;
    }
  }

  // No había sesión o su ID no corresponde a ningún usuario.
  return null;
}

// ==========================================================
// 10. CERRAR LA SESIÓN
// ==========================================================

export function cerrarSesion() {
  // Borramos solamente el ID de sesión.
  //
  // No eliminamos la cuenta, los Pokémon ni sus modificaciones.
  localStorage.removeItem("ls-sesion");
}