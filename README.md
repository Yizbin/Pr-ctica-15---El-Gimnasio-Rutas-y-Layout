# Practica 15 – El gimnasio: rutas y layout

## Ejercicio 1
**¿Por qué el 404 sí tiene encabezado y pie?**
Porque la ruta `*` es hija de la ruta de layout. Cualquier URL que no coincida
con otra ruta cae en ella, así que React Router pinta `<Layout>` (encabezado y
pie) y pone `<NoEncontrado>` en el `<Outlet />`.

**¿Qué cambia en la pestaña Red con `<a href>` en lugar de `Link`?**
Con `Link` la navegación ocurre sin recargar la página: en Red solo aparece la
petición Fetch/XHR a la API (`/clases/1`). Con `<a href>` el navegador hace una
petición de tipo *document* a `localhost:5173/clases/1`, vuelve a descargar JS,
CSS e imágenes y se pierde el estado de la app. (Capturas en /evidencias.)

## Ejercicio 2
**¿En qué tipo llega el id y qué pasa si no lo conviertes?**
`useParams` siempre devuelve strings. Sin `Number(id)`, comparaciones como
`c.id === id` dan `false` (number contra string) y TypeScript marca error al
pasarlo a `traerClase(id: number)`.

**¿Qué pasa al ir de /clases/1 a /clases/2 si el id no está en las dependencias?**
Es la misma ruta, así que React reutiliza el componente sin desmontarlo. El
efecto no se vuelve a ejecutar y la pantalla sigue mostrando la clase 1 aunque
la URL diga 2.


# Practica 16 – El gimnasio: sesion con contexto y JWT

## Ejercicio 1

**¿Por qué se usa un contexto y no props para la sesión?**
La sesión la necesitan componentes que están en ramas distintas del árbol: el
encabezado (para mostrar el nombre y el botón Salir), las páginas de Entrar y
Registro (para iniciar sesión) y, más adelante, cualquier página que dependa de
quién entró. Con props habría que pasar la sesión por todos los componentes
intermedios (`App`, `Layout`, etc.) aunque ellos no la usen. Eso se llama *prop
drilling* y vuelve el código frágil. Con un contexto, el proveedor
(`SesionProvider`) la publica una sola vez y cualquier componente
descendiente la lee con el hook `useSesion()`, sin importar qué tan abajo esté.

**¿Qué pasa si un componente usa la sesión fuera del proveedor?**
`useContext` devuelve el valor por defecto con el que se creó el contexto, que
aquí es `null`. Si el hook no lo revisara, el componente fallaría después con
un error confuso al intentar leer `sesion.usuario` de `null`. Por eso
`useSesion()` comprueba ese caso y lanza un error claro:
*"useSesion debe usarse dentro de `<SesionProvider>`"*. Así el problema se
detecta de inmediato y se sabe cómo arreglarlo: envolver el componente con el
proveedor (en `main.tsx`).

## Ejercicio 2

**¿Dónde se guarda el token y qué riesgo tiene ese lugar?**
El token (junto con el usuario) se guarda en `localStorage`, bajo la clave
`sesion`. Así la sesión sobrevive a recargar la página o cerrar la pestaña.
El riesgo es que `localStorage` es accesible desde JavaScript: si un atacante
logra ejecutar un script en la página (un ataque XSS), puede leer el token y
usarlo para hacerse pasar por el usuario hasta que expire. Una alternativa más
segura es guardar el token en una cookie `HttpOnly`, que JavaScript no puede
leer, aunque requiere cambios en el backend y protección contra CSRF.

## Evidencias

Las capturas están en la carpeta `evidencias/`:

1. `error-credenciales.png`: mensaje de la API con credenciales incorrectas.
2. `encabezado-con-sesion.png`: encabezado con el nombre del usuario y el botón Salir.
3. `authorization-red.png`: encabezado `Authorization: Bearer ...` en la pestaña Red.
4. `token-jwt-io.png`: token decodificado en jwt.io.
5. `registro-cuenta-nueva.png`: cuenta nueva creada con la página de registro.
