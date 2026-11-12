# PokeApp - Pokédex de Valentino Carribale

Proyecto educativo de Funcionamiento de Sistemas Digitales, desarrollado con HTML, CSS y JavaScript.

## Cómo abrirlo

1. Descomprimir el ZIP completo.
2. Abrir la carpeta `PokeApp-Carribale-Pokedex` en Visual Studio Code.
3. Abrir `index.html` con la extensión **Live Server**.
4. Mantener el mismo servidor, dirección y puerto para recuperar los datos guardados.

El proyecto usa módulos (`import` y `export`), por eso debe ejecutarse con un servidor local y no haciendo doble clic en `index.html`.

## Cuentas de prueba

Se puede ingresar por nombre de usuario o por correo.

| Rol | Usuario | Correo | Contraseña |
| --- | --- | --- | --- |
| Administrador | mateog_24 | mateo.gomez@gmail.com | M4teo#8291 |
| Usuario común | sofi_ram | sofia.ramirez@gmail.com | S0fia!4726 |

Los nuevos registros siempre tienen `admin: false`. El permiso no se puede cambiar desde el perfil, solo desde DB.

## Testeo y Colaboración
Intercambiamos páginas con Agustín Bianchi [(su PokeApp)](https://agusbianchi-ui.github.io/Tp9-PokeApp-AgustinBianchi/) para verificar las funcionalidades y sugerir algún cambio estético/funcional, validamos que las ideas de cada uno funcionaran y si algo fallaba.

- En mi caso particular, tenía un problema con la reproducción de sonidos, tanto los predeterminados como si se cargaba un nuevo Pokemon, así que me sirvió para arreglarlo y hacer la entrega final.

## Funcionalidades

- Inicio de sesión con usuario o correo y contraseña.
- Bienvenida personalizada con avatar, nombre, apellido, usuario, correo y rol.
- Menú con acceso al perfil, cierre de sesión y administración según el rol.
- Registro con avatar, validación de datos, contraseñas coincidentes y control de correo/usuario repetido.
- Edición de avatar, nombre, apellido y correo.
- Cambio de contraseña: requiere la contraseña actual correcta y repetir la nueva. Si se dejan los tres campos vacíos, se conserva la contraseña.
- Pokédex con todos los registros actuales y contador de entradas.
- Botón **Ver detalles**: lee la descripción, tipos, medidas, generación, habilidad, evolución, rareza y estadísticas del Pokémon seleccionado.
- Sonido mediante el control de audio y alternancia entre la imagen normal y shiny.
- Administración: carga y edición de todos los campos de los Pokémon, incluidos los iniciales.
- Control de número/nombre de Pokémon repetidos, tipos diferentes y campos numéricos positivos.
- Persistencia de usuarios, Pokémon y sesión al recargar o volver a abrir el navegador.
- Batalla "guionada" entre Greninja y Garchomp, con decisiones preproducidas.

## Extra

Decidí añadir algunas funcionalidades que me parecían importantes para el proyecto.

- Edición de pokemones ya existentes, buscándolos por su id para cambiar sus características.
- Edición de perfil, permitiendo cambiar datos ya existentes e incluso el avatar de la lista (pequeña DB avatares.js).

**Declaración de IA:** Esta parte, aunque utiliza conocimientos JS ya vistos, fue creada con ayuda de ChatGPT. Consideré que podían quedar bien pero al ser funciones no requeridas, y no saber como se editaban datos ya existentes en la base de datos, me ayudé de la herramienta. Fuera de esto, las lógicas se fueron haciendo sincrónica/asincrónicamente en las clases, y la batalla toma técnicas ya utilizadas en AURORA: The Truth (proyecto final). De todas formas, no son más que funciones, condicionales, local storage, etc. Que puedo entender y defender.

## Cómo administrar los Pokémon

1. Ingresar con una cuenta administradora.
2. Entrar a **Administración** desde el menú o desde el perfil.
3. Elegir **Cargar nuevo Pokémon** o seleccionar una entrada existente y pulsar **Editar seleccionado**.
4. Completar el formulario y guardar. Se abrirá el detalle con el estado actualizado.
5. También se puede entrar al detalle de cualquier Pokémon y pulsar **Editar Pokémon**.

El formulario acepta uno o dos tipos. Si tiene evolución, se solicita su nombre, pero el nivel puede quedar vacío para evoluciones por piedra, intercambio u otro método. Si se marca la variante shiny, su imagen pasa a ser obligatoria.

Las imágenes y sonidos se indican con rutas como `./assets/img/pikachu.png` y `./assets/sound/pikachu.mp3`, o con URL completas `https://...` / `http://...`. Para recursos locales nuevos, copiar previamente el archivo a la carpeta correspondiente; guardar la ruta no copia el archivo. Las URL externas deben apuntar directamente al recurso y estar disponibles.

## Organización y lógica

```text
PokeApp-Carribale-Pokedex/
├── index.html
├── css/style.css
├── js/
│   ├── app.js
│   ├── persistencia.js
│   ├── script.js
│   └── db/
│       ├── pokemones.js
│       ├── usuarios.js
│       ├── avatares.js
│       └── game.js
└── assets/
    ├── img/
    ├── sound/
    └── avatar/
```

- `app.js`: funciones que cambian las vistas dentro de `#app` con `innerHTML`. Después de crear cada vista, se asignan sus eventos con `addEventListener`.
- `persistencia.js`: inicializa los datos una sola vez y contiene las funciones para leer, agregar y actualizar objetos mediante JSON y localStorage.
- `db/pokemones.js`: los diez Pokémon iniciales de Carribale. Se agregó `descripcion` a cada objeto porque faltaba en el archivo original.
- `db/usuarios.js`: usuarios de prueba. El nombre de usuario usa la propiedad `username`, igual que en el ejemplo y la consigna; se conservaron sus valores originales.
- `db/avatares.js`: nombres de los avatares que ya están incluidos en el proyecto.
- `db/game.js` y `script.js`: se conservan para el desarrollo posterior.

Se usan funciones, constantes y variables, arrays, objetos, condicionales, recorridos, módulos, DOM y formularios. No hay frameworks ni librerías externas de JavaScript.

### Guardado

| Clave | Contenido |
| --- | --- |
| `carribale-pokemones` | Array completo y actualizado de Pokémon |
| `carribale-usuarios` | Array completo y actualizado de usuarios |
| `carribale-sesion` | ID del usuario que inició sesión |

Para agregar, se lee el array, se utiliza `push` y se guarda con `JSON.stringify`. Para editar, se recorre el array, se reemplaza el objeto con el mismo ID original y se vuelve a guardar. Los campos numéricos del formulario de Pokémon usan `valueAsNumber`; las casillas usan `checked`.

El perfil siempre se obtiene buscando el ID de sesión en el array actualizado de usuarios. Así se conserva el rol original y los cambios del perfil se muestran también después de recargar.

Los datos se guardan solo en el navegador, equipo y origen utilizados; no se comparten entre dispositivos. Las cuentas y contraseñas siguen la lógica simple del ejercicio con localStorage, destinada a este proyecto educativo.

Si se modifican los archivos de datos iniciales después de haber usado la aplicación, los cambios no reemplazan los datos ya guardados. Se pueden editar los Pokémon desde administración. Para volver a los datos iniciales del proyecto base, eliminar las tres claves `carribale-*` desde las herramientas del navegador y recargar; esto borra los registros y cambios locales.

## Comprobación de funcionamiento

1. Ingresar como administrador, comprobar los datos y el acceso a Administración.
2. Cargar un Pokémon nuevo y verificar su descripción en el detalle y su tarjeta en la Pokédex.
3. Editar un Pokémon inicial y el nuevo; recargar y verificar que ambos cambios permanezcan.
4. Cerrar sesión y registrar una cuenta nueva. Comprobar su avatar y la ausencia de opciones de administración.
5. Editar el perfil y recargar. Probar cambiar la contraseña primero con una actual incorrecta y luego con la correcta.
6. Cerrar sesión: la contraseña anterior debe fallar y la nueva debe permitir entrar.
7. Probar repetir un correo, usuario o número de Pokémon: debe aparecer un mensaje sin guardar el duplicado.
8. Verificar que la Batalla deje seleccionar pokemones y terminar el recorrido del combate.

Autor: **Valentino Carribale**. Materia: **Funcionamiento de Sistemas Digitales**. Profesor: **Roberto Argumedo**.
