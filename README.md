# Práctica 15 – El gimnasio: rutas y layout

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
