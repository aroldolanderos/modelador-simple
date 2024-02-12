# Notas

1.- Para escalar el contenido del diagrama (hacer zoom) todos los elemntos deben estar dentro de un primer grupo padre (`<g></g>`), y el elemento a escalar con `transform="scale(x)` debe ser este elemento padre.

2.- Un `<svg>` te permite embeber otros elementos `<svg>` con su propio rango interno de coordenadas. (Puede ser útil para elementos dentro del diagrama dónde se necesite "maniobrar" o animar dentro de su propio contexto)
