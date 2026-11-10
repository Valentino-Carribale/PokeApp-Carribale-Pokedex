import { pokemones } from "./db/pokemones.js";
import { usuarios } from "./db/usuarios.js";

// La misma lógica del ejemplo: iniciar una sola vez, leer JSON y guardar JSON.
// Las claves propias evitan mezclar los datos con la PokeApp de ejemplo.
if (localStorage.getItem("carribale-pokemones") === null) {
  localStorage.setItem("carribale-pokemones", JSON.stringify(pokemones));
}
if (localStorage.getItem("carribale-usuarios") === null) {
  localStorage.setItem("carribale-usuarios", JSON.stringify(usuarios));
}

export function leerPokemones() {
  return JSON.parse(localStorage.getItem("carribale-pokemones"));
}

export function leerUsuarios() {
  return JSON.parse(localStorage.getItem("carribale-usuarios"));
}

export function guardarPokemones(pokemon) {
  let lista = leerPokemones();
  lista.push(pokemon);
  localStorage.setItem("carribale-pokemones", JSON.stringify(lista));
}

export function guardarUsuarios(usuario) {
  let lista = leerUsuarios();
  lista.push(usuario);
  localStorage.setItem("carribale-usuarios", JSON.stringify(lista));
}

// Para editar, se busca el ID original y se reemplaza ese objeto en el array.
export function actualizarPokemon(idOriginal, pokemonEditado) {
  let lista = leerPokemones();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === idOriginal) {
      lista[i] = pokemonEditado;
      break;
    }
  }
  localStorage.setItem("carribale-pokemones", JSON.stringify(lista));
}

export function actualizarUsuario(usuarioEditado) {
  let lista = leerUsuarios();
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].id === usuarioEditado.id) {
      lista[i] = usuarioEditado;
      break;
    }
  }
  localStorage.setItem("carribale-usuarios", JSON.stringify(lista));
}

// La sesión guarda solo el ID. Los datos del perfil se vuelven a leer de usuarios.
export function iniciarSesion(id) {
  localStorage.setItem("carribale-sesion", JSON.stringify(id));
}

export function leerSesion() {
  const id = JSON.parse(localStorage.getItem("carribale-sesion"));
  for (let usuario of leerUsuarios()) {
    if (usuario.id === id) {
      return usuario;
    }
  }
  return null;
}

export function cerrarSesion() {
  localStorage.removeItem("carribale-sesion");
}
