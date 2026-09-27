# 🔴 PokeApp - Pokédex

Aplicación web educativa inspirada en una **Pokédex de Pokémon**,
desarrollada con **HTML, CSS y JavaScript**.

El proyecto presenta información de diferentes Pokémon mediante una
interfaz visual inspirada en el dispositivo Pokédex, con tarjetas,
tipos, número de Pokédex, rareza e imágenes.

> **PokeApp-Carribale-Pokedex**

------------------------------------------------------------------------

## 📖 Descripción

**PokeApp** es una aplicación web que permite visualizar una colección
de Pokémon desde una base de datos local escrita en JavaScript.

La interfaz busca combinar:

-   🎮 Estética inspirada en Pokémon.
-   📱 Diseño responsive.
-   🧩 Componentes reutilizables mediante HTML y CSS.
-   ⚡ JavaScript modular.
-   🗃️ Datos almacenados en archivos de base de datos de JavaScript.
-   🖼️ Imágenes y sonidos asociados a los Pokémon.
-   👤 Una base de datos local de usuarios y avatares.

------------------------------------------------------------------------

## ✨ Características

### 📕 Pokédex

La aplicación muestra una colección de Pokémon en forma de tarjetas.

Cada tarjeta puede mostrar:

-   Número de Pokédex.
-   Nombre.
-   Imagen.
-   Tipo o tipos.
-   Rareza.
-   Botón de detalles.

La cantidad de Pokémon mostrada se actualiza automáticamente en el
encabezado de la Pokédex.

### 🏷️ Tipos Pokémon

Los Pokémon pueden tener uno o dos tipos.

El sistema genera automáticamente las etiquetas de tipo y normaliza los
nombres para utilizar las clases CSS correspondientes, incluyendo tipos
con caracteres especiales como:

-   Eléctrico
-   Psíquico
-   Dragón
-   Veneno
-   Planta
-   Fuego
-   Agua
-   Tierra
-   Normal

### 🔎 Buscador

La interfaz incluye un campo preparado para buscar Pokémon.

El formulario y el campo de búsqueda ya forman parte de la interfaz
principal.

### 👤 Usuarios

El proyecto incluye una base de datos local de usuarios en:

``` text
js/db/usuarios.js
```

Cada usuario puede contener:

-   ID.
-   Nombre.
-   Email.
-   Nombre de usuario.
-   Contraseña.
-   Avatar.
-   Permiso de administrador.

Los avatares se almacenan en:

``` text
assets/avatar/
```

La carpeta contiene una gran variedad de imágenes de entrenadores Pokémon que pueden utilizarse
para representar a los usuarios.

### ⚔️ Batalla

La navegación incluye una sección denominada **Batalla** y el proyecto
cuenta con el archivo:

``` text
js/db/game.js
```

Este archivo está preparado para incorporar la lógica del sistema de
batalla.

Actualmente, la lógica de batalla no está implementada en este archivo.

------------------------------------------------------------------------

## 🧬 Pokémon incluidos

La base de datos actual contiene 10 Pokémon:

    N.º Pokémon      Tipo              Rareza
  ----- ------------ ----------------- ------------
    001 Bulbasaur    Planta / Veneno   Común
    004 Charmander   Fuego             Común
    007 Squirtle     Agua              Común
    025 Pikachu      Eléctrico         Raro
    054 Psyduck      Agua              Común
    104 Cubone       Tierra            Poco común
    133 Eevee        Normal            Raro
    143 Snorlax      Normal            Raro
    150 Mewtwo       Psíquico          Legendario
    151 Mew          Psíquico          Mítico

Los datos se encuentran en:

``` text
js/db/pokemones.js
```

Cada Pokémon posee información adicional como:

``` js
{
  id,
  nombre,
  tipo,
  altura,
  peso,
  generacion,
  hp,
  ataque,
  velocidad,
  defensa,
  habilidad,
  tieneEvolucion,
  evolucion,
  nivelEvolucion,
  rareza,
  imagen,
  sonido,
  shiny,
  imagenShiny
}
```

------------------------------------------------------------------------

## 📁 Estructura del proyecto

``` text
PokeApp-Carribale/
└── PokeApp/
    ├── index.html
    │
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   ├── app.js
    │   ├── script.js
    │   │
    │   └── db/
    │       ├── pokemones.js
    │       ├── usuarios.js
    │       └── game.js
    │
    └── assets/
        ├── avatar/
        │   └── *.png
        │
        ├── img/
        │   ├── *.png
        │   ├── *-shiny.png
        │   └── logo-pokemon.svg
        │
        └── sound/
            ├── *.mp3
            └── *.ogg
```

------------------------------------------------------------------------

## 🛠️ Tecnologías utilizadas

### HTML5

Utilizado para construir la estructura de la aplicación.

### CSS3

Utilizado para:

-   Diseño de la Pokédex.
-   Tarjetas de Pokémon.
-   Colores por tipo.
-   Diseño responsive.
-   Elementos visuales de la interfaz.
-   Animaciones y efectos visuales.

### JavaScript

Utilizado para:

-   Importar la base de datos.
-   Generar dinámicamente las tarjetas.
-   Mostrar la cantidad de Pokémon.
-   Procesar los tipos.
-   Formatear los números de Pokédex.
-   Insertar contenido dinámicamente en el DOM.

El proyecto utiliza **JavaScript Modules**, por ejemplo:

``` js
import { pokemones } from "./db/pokemones.js";
```

------------------------------------------------------------------------

## 🚀 Cómo ejecutar el proyecto

No se necesita instalar un framework ni un sistema de backend para
visualizar la Pokédex.

### Opción recomendada: Visual Studio Code

1.  Descargar o clonar el proyecto.
2.  Abrir la carpeta `PokeApp` en **Visual Studio Code**.
3.  Instalar la extensión **Live Server**.
4.  Abrir `index.html` con **Open with Live Server**.
5.  La aplicación se abrirá en el navegador.

### ⚠️ Importante

Como el proyecto utiliza módulos JavaScript mediante:

``` html
<script type="module" src="./js/app.js"></script>
```

es recomendable ejecutarlo mediante un servidor local como **Live
Server**, en lugar de abrir directamente `index.html` con doble clic.

------------------------------------------------------------------------

## 🎨 Diseño

La interfaz está inspirada visualmente en una Pokédex clásica.

Algunos elementos principales son:

-   🔴 Carcasa roja.
-   🔵 Pantalla azul.
-   💡 Indicadores luminosos.
-   ⚫ Controles oscuros.
-   🟡 Detalles amarillos.
-   🟥 Tarjetas de Pokémon.
-   🏷️ Etiquetas diferenciadas por tipo.
-   🎮 Tipografía inspirada en videojuegos.

El diseño utiliza las fuentes **Inter** y **Press Start 2P**.

------------------------------------------------------------------------

## 🖼️ Recursos

Los recursos multimedia están organizados en tres carpetas:

### `assets/img/`

Contiene las imágenes de los Pokémon, incluyendo versiones normales y
shiny.

Ejemplo:

``` text
pikachu.png
pikachu-shiny.png
mewtwo.png
mewtwo-shiny.png
```

### `assets/sound/`

Contiene archivos de sonido asociados a los Pokémon.

Actualmente existen archivos en formatos:

``` text
.mp3
.ogg
```

### `assets/avatar/`

Contiene los diferentes avatares disponibles para los usuarios.

------------------------------------------------------------------------

## 🧑‍💻 Archivos principales

### `index.html`

Es la página principal de la aplicación.

Contiene:

-   Encabezado.
-   Logo.
-   Navegación.
-   Buscador.
-   Contador de entradas.
-   Área principal de la Pokédex.
-   Pie de página.

### `js/app.js`

Es el archivo principal de JavaScript.

Se encarga de:

1.  Importar los Pokémon.
2.  Crear la galería.
3.  Generar las tarjetas.
4.  Mostrar los tipos.
5.  Formatear los números.
6.  Actualizar el contador.

### `js/db/pokemones.js`

Contiene la información de los Pokémon.

### `js/db/usuarios.js`

Contiene los usuarios de prueba y sus datos.

### `js/db/game.js`

Archivo destinado a la lógica relacionada con el sistema de batalla.

### `js/script.js`

Archivo JavaScript adicional preparado para futuras funcionalidades.

------------------------------------------------------------------------

## 👨‍💻 Autor

**Valentino Carribale**

Materia: **Funcionamiento de Sistemas Digitales** - *Roberto Argumedo*