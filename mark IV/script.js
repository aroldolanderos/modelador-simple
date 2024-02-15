/*
Orden al pintar los elementos
1.- (inicio, fin, tareas, gateways)
2.- Flechas
3.- Notas (* por investigar)

Frente a cada actualización de coordenadas de cualquier elemento, 
se volvera agenerar todo el diagrama.

Se debe manejar un mapa de cada elemento + sus coordenadas y
datos como nombre (para las tareas) y sus dimensiones
*/

const GLOBAL = {
  matrix: {
    scaleX: 1,
    scaleY: 1,
    trslationX: 0,
    trslationY: 0,
  },
};

function resetVewport() {
  GLOBAL.matrix.scaleX = 1;
  GLOBAL.matrix.scaleY = 1;
  GLOBAL.matrix.trslationX = 0;
  GLOBAL.matrix.trslationY = 0;
}

const layerRoot = document.getElementById("layer-root");
/*
- Obtener primer hijo de layerRoot (diagram-group)

Dentro tenemos del grupo tenemos:
    - Primer elemento, .diagram-element .diagram-shape (Pool)
    - Segundo elemento diagram-childrens, contiene los demás elementos del diagrama (inicio, fin, tareas, gateways)
*/

/* Es lo que contiene todo (en teoría) se ncuentra dentro del svg y este es el que escala (zoom in/out) */
const viewport = document.getElementById("viewport");

/* se generan los puntos para redimención de Pool o Lane */
const layerResizers = document.getElementById("layer-resizers");

function creteElementSVG(svgType) {
  return document.createElementNS("http://www.w3.org/2000/svg", svgType);
}

function generatePoolElement(params) {
  let initX = params.x;
  let initY = params.y;
  let width = params.width;
  let height = params.height;
  let poolName = params.name;

  const diagramElement = creteElementSVG("g");
  diagramElement.setAttribute("class", "diagram-element diagram-shape");
  diagramElement.setAttribute("data-pool-id", "pool_1234");
  diagramElement.setAttribute("transform", `matrix(1 0 0 1 ${initX} ${initY})`);

  const visualGroup = creteElementSVG("g");
  visualGroup.setAttribute("class", "diagram-visual");

  const visualRect = creteElementSVG("rect");
  visualRect.setAttribute("class", "pool-rect");
  visualRect.setAttribute("width", width);
  visualRect.setAttribute("height", height);

  const visualPath = creteElementSVG("path");
  visualPath.setAttribute("class", "pool-path");
  visualPath.setAttribute("d", `M 30,0 L 30,${height}`);

  const text = creteElementSVG("text");
  text.setAttribute("class", "pool-label");
  let starTextCoord = 225;
  text.setAttribute("transform", `matrix(-1.83697e-16 -1 1 -1.83697e-16 0 ${starTextCoord})`);

  // la cantidad de span necesarios dependerá del largo del nombre (revisar implementación)
  const span = creteElementSVG("tspan");
  span.setAttribute("x", -15);
  span.setAttribute("y", 18);
  span.textContent = poolName;

  text.appendChild(span);
  visualGroup.appendChild(visualRect);
  visualGroup.appendChild(visualPath);
  visualGroup.appendChild(text);

  const outlineRect = creteElementSVG("rect");
  outlineRect.setAttribute("class", "diagram-outline");
  outlineRect.setAttribute("x", "-5");
  outlineRect.setAttribute("y", "-5");
  outlineRect.setAttribute("rx", "4");
  outlineRect.setAttribute("width", `${width + 10}`);
  outlineRect.setAttribute("height", `${height + 10}`);

  const hitRect = creteElementSVG("rect");
  hitRect.setAttribute("class", "diagram-hit diagram-hit-all");
  hitRect.setAttribute("width", width);
  hitRect.setAttribute("height", height);

  diagramElement.appendChild(visualGroup);
  diagramElement.appendChild(outlineRect);
  diagramElement.appendChild(hitRect);

  return diagramElement;
}

function generateLaneElement(params) {
  let initX = params.x;
  let initY = params.y;
  let width = params.width;
  let height = params.height;
  let poolName = params.name;

  const laneGroup = creteElementSVG("g");
  laneGroup.setAttribute("class", "diagram-group");

  const elementGroup = creteElementSVG("g");
  elementGroup.setAttribute("class", "diagram-element diagram-shape");
  elementGroup.setAttribute("data-lane-id", "lane-1234");
  elementGroup.setAttribute("transform", `matrix(1 0 0 1 ${initX} ${initY})`);

  const visualGroup = creteElementSVG("g");
  visualGroup.setAttribute("class", "diagram-visual");

  const visualRect = creteElementSVG("rect");
  visualRect.setAttribute("class", "lane-rect");
  visualRect.setAttribute("width", width);
  visualRect.setAttribute("height", height);

  const text = creteElementSVG("text");
  text.setAttribute("class", "lane-label");
  let starTextCoord = 225;
  text.setAttribute("transform", `matrix(-1.83697e-16 -1 1 -1.83697e-16 0 ${starTextCoord})`);

  const span = creteElementSVG("tspan");
  span.setAttribute("x", 6);
  span.setAttribute("y", 18);
  span.textContent = poolName;

  text.appendChild(span);

  const outlineRect = creteElementSVG("rect");
  outlineRect.setAttribute("class", "diagram-outline");
  outlineRect.setAttribute("x", "-5");
  outlineRect.setAttribute("y", "-5");
  outlineRect.setAttribute("rx", "4");
  outlineRect.setAttribute("width", width);
  outlineRect.setAttribute("height", height);

  visualGroup.appendChild(visualRect);
  visualGroup.appendChild(text);

  elementGroup.appendChild(visualGroup);
  elementGroup.appendChild(outlineRect);

  laneGroup.appendChild(elementGroup);

  return laneGroup;
}

function generateTaskElement() {}

function generateGatewayElement() {}

function generateStartElement(params) {
  let initX = params.x;
  let initY = params.y;
  let width = params.width;
  let height = params.height;

  /*
<g class="diagram-group">
  <g class="diagram-element diagram-shape" transform="matrix(1 0 0 1 325 272)">
    <g class="diagram-visual">
      <circle class="circle circle-start" cx="18" cy="18" r="18"></circle>
    </g>
    <rect class="diagram-hit diagram-hit-all" x="0" y="0" width="36" height="36"></rect>
    <circle cx="18" cy="18" r="24" class="diagram-outline" style="fill: none"></circle>
  </g>
</g>
 */
}

function generateEndElement() {}

const drawableArea = document.getElementById("simple-diagram");

drawableArea.addEventListener("mousemove", (event) => {
  const bbox = drawableArea.getBoundingClientRect();
  // cordenadas del puntero
  const mouseX = parseInt(event.clientX - bbox.left);
  const mouseY = parseInt(event.clientY - bbox.top);
  // ultimas coordenadas dónde me voy moviendo
  // console.log({ x: mouseX, y: mouseY });

  event.currentTarget.classList.add("hover");
});

drawableArea.addEventListener("mouseleave", (event) => {
  event.currentTarget.classList.remove("hover");
});

const zoomIn = document.getElementById("zoom-in");
const zoomOut = document.getElementById("zoom-out");

function getValores(message) {
  const valores = message.match(/matrix\(([^ ]+) [^ ]+ [^ ]+ ([^ ]+) [^ ]+ [^ ]+\)/);
  const primerValor = parseFloat(valores[1]);
  const cuartoValor = parseFloat(valores[2]);
  return { a: primerValor, b: cuartoValor };
}

zoomIn.addEventListener("click", (event) => {
  let transform = viewport.getAttribute("transform");
  let valores = getValores(transform);
  viewport.setAttribute("transform", `matrix(${valores.a + 0.05} 0 0 ${valores.b + 0.05} 0, 0)`);
});

zoomOut.addEventListener("click", (event) => {
  let transform = viewport.getAttribute("transform");
  let valores = getValores(transform);
  viewport.setAttribute("transform", `matrix(${valores.a - 0.05} 0 0 ${valores.b - 0.05} 0, 0)`);
});

let isDragging = false;
let startX,
  startY,
  offsetX = 73,
  offsetY = 194;

viewport.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - offsetX;
  startY = e.clientY - offsetY;
});

viewport.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const x = e.clientX - startX;
    const y = e.clientY - startY;
    offsetX = Math.min(0, Math.max(-viewport.getAttribute("width") + window.innerWidth, x));
    offsetY = Math.min(0, Math.max(-viewport.getAttribute("height") + window.innerHeight, y));
    viewport.setAttribute("transform", `matrix(1 0 0 1 ${offsetX}, ${offsetY})`);
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// const poolParams = { x: 250, y: 120, name: "Proceso de pruebas SIMPLE 3", width: 800, height: 320 };
// const laneParams = { x: 280, y: 120, name: "Lane de ejemplo n°1", width: 770, height: 320 };

// const pool = generatePoolElement(poolParams);
// const lane = generateLaneElement(laneParams);

// if (layerRoot) {
//   const diagramGroup = layerRoot.querySelector(".diagram-group");
//   if (diagramGroup) {
//     diagramGroup.appendChild(pool);
//     const diagramChildren = diagramGroup.querySelector(".diagram-children");
//     if (diagramChildren) {
//       // add childrens
//       diagramChildren.appendChild(lane);
//     } else {
//       const newChildrenGroup = creteElementSVG("g");
//       newChildrenGroup.setAttribute("class", "diagram-children");
//       diagramGroup.appendChild(newChildrenGroup);
//       // add childrens
//       newChildrenGroup.appendChild(lane);
//     }
//   }
// }
