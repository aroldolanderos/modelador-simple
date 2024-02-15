/* Variables globales

- Tarea o elemento en foco
- Tarea o elemento fantasma (drag & drop)
- Coordenadas del elemento fantasma
- Coordenadas del item en foco (el que se queda estático)
- Mapping de las coordenadas de todos los elementos del mapa para manejo de colisiones
- Área dibujable
- Elementos a manipular (drag)

*/

let focusTask = null;
let ghostTask = null;
let gostCoords = null;
let lastCoords = null;
let isClick = false;

const mapping = { items: [] };
const drawableArea = document.getElementById("simple-diagram");
const draggableTasks = document.querySelectorAll(".task-element");

// set mapping list
draggableTasks.forEach((task) => {
  let coords = getCurrentCoords(task.getAttribute("transform"));
  let taskId = task.getAttribute("task-id");
  mapping.items.push({
    id: taskId,
    x: coords.x,
    y: coords.y,
  });
});

function updateMappingItems(itemId, xCoord, yCoord) {
  mapping.items = mapping.items.map((element) => {
    if (element.id === itemId) {
      return { ...element, x: xCoord, y: yCoord };
    } else {
      return element;
    }
  });
}

function getCurrentCoords(expresion) {
  /**
   * Obtiene los 2 últimos valores de coordenadas del atributo "matrix"
   * pasando de matrix(1 0 0 1 valorX valorY) a (x:valorX, y:valorY)
   */
  const regex = /matrix\([^)]*\)/;
  const match = expresion.match(regex);

  if (match) {
    const numbers = match[0].split(/\s+/).slice(-2);
    const x = parseInt(numbers[0]);
    const y = parseInt(numbers[1]);
    return { x, y };
  } else {
    return null;
  }
}

function createGhostTask(currentTask) {
  /**
   * Crea una tarea fantasma para "simular" el arrastre
   * Se guarda en una variable global
   */
  const transform = currentTask.getAttribute("transform");
  const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  mainGroup.setAttribute("transform", transform);
  mainGroup.setAttribute("class", "task-element ghost");
  mainGroup.setAttribute("task-id", currentTask.getAttribute("task-id"));

  const innerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  innerGroup.setAttribute("class", "diagram-visual");

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", 120);
  rect.setAttribute("height", 60);
  rect.setAttribute("class", "ghost-task");
  rect.setAttribute("rx", "1");
  rect.setAttribute("ry", "1");

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("lineHeight", "1");
  text.setAttribute("class", "dg-label");
  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tspan.setAttribute("x", 38);
  tspan.setAttribute("y", 36);
  tspan.textContent = "Tarea 1";
  text.appendChild(tspan);

  innerGroup.appendChild(rect);
  innerGroup.appendChild(text);
  mainGroup.appendChild(innerGroup);
  ghostTask = mainGroup;
  drawableArea.appendChild(ghostTask);
}

function updateGhostTaskPosition(event) {
  /**
   * Se encarga de verificar las posiciones de arraste
   * y actualizar las coordenadas de la tarjeta fantasma
   */
  if (ghostTask) {
    // ghost coords
    const gc = getCurrentCoords(ghostTask.getAttribute("transform"));
    const bbox = drawableArea.getBoundingClientRect();

    // cordenadas del puntero
    const mouseX = event.clientX - bbox.left;
    const mouseY = event.clientY - bbox.top;

    // ultimas coordenadas dónde me voy moviendo
    lastCoords = { x: mouseX, y: mouseY };

    // incializa coordenadas de figura fantasma
    if (gostCoords == null) {
      gostCoords = {
        x: parseInt(mouseX - gc.x, 10),
        y: parseInt(mouseY - gc.y, 10),
      };
    }

    // establece diferencia entre click de tarjeta original y visualización de tarjeta fantasma
    let jumpX = parseInt(mouseX - gostCoords.x, 10);
    let jumpY = parseInt(mouseY - gostCoords.y, 10);

    // verifica colisiones
    collisionDetector(gc);
    // modifica visualmente las coordenadas de tarea que se acaba de mover
    ghostTask.setAttribute("transform", `matrix(1 0 0 1 ${jumpX} ${jumpY})`);
  }
}

function endDrag(event) {
  /**
   * Evento al terminar de mover la tarea fantasma.
   * Aqui se actualizan las coordenadas de la tarjeta que se desea mover.
   * Se resetean variables globales de interes.
   *
   */
  //
  isClick = false;
  drawableArea.removeEventListener("mousemove", updateGhostTaskPosition);
  document.removeEventListener("mouseup", endDrag);

  // permite mover la tarjeta siempre que no haya detectado colisión
  if (!ghostTask.classList.contains("outline")) {
    let jumpX = lastCoords.x - gostCoords.x;
    let jumpY = lastCoords.y - gostCoords.y;
    let gTaskId = ghostTask.getAttribute("task-id");
    focusTask.setAttribute("transform", `matrix(1 0 0 1 ${jumpX} ${jumpY})`);
    // actualiza mapa de coordenadas de tarjetas que se movieeron
    updateMappingItems(gTaskId, jumpX, jumpY);
  }

  // quita efecto apagado de la tarjeta
  focusTask.classList.remove("dragging-task");
  // borra tarjeta fantasma
  removeGhostImage();
  // limpia variables de control
  gostCoords = null;
  focusTask = null;
  lastCoords = null;
}

function removeGhostImage() {
  /**
   * En el caso de existir, borra una imagen fantasma
   */
  if (ghostTask) {
    drawableArea.removeChild(ghostTask);
    ghostTask = null;
  }
}

function segmentIntersect(a, b, c, d) {
  // Función para verificar si los segmentos de línea (a,b) y (c,d) se intersectan.
  function ccw(a, b, c) {
    return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  }
  return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
}

function rectanglesOverlap(rect1, rect2) {
  // Verificar si dos rectángulos se superponen.
  for (let i = 0; i < 4; i++) {
    let j = (i + 1) % 4;
    for (let k = 0; k < 4; k++) {
      let l = (k + 1) % 4;
      if (segmentIntersect(rect1[i], rect1[j], rect2[k], rect2[l])) {
        return true;
      }
    }
  }
  return false;
}

function collisionDetector() {
  let gc = getCurrentCoords(ghostTask.getAttribute("transform"));
  let gTaskId = ghostTask.getAttribute("task-id");
  let ghostCoords = [
    { x: gc.x, y: gc.y },
    { x: gc.x + 120, y: gc.y },
    { x: gc.x + 120, y: gc.y + 60 },
    { x: gc.x, y: gc.y + 60 },
  ];
  //   const areaWidth = 1600;
  //   const areaheigth = 600;

  // todo: detectar colisión con los bordes

  // detecta colisión con otros objetos
  let isColisioned = false;
  for (let i = 0; i < mapping.items.length; i++) {
    let task = mapping.items[i];
    if (task.id != gTaskId) {
      let comparableTask = [
        { x: task.x, y: task.y },
        { x: task.x + 120, y: task.y },
        { x: task.x + 120, y: task.y + 60 },
        { x: task.x, y: task.y + 60 },
      ];

      if (rectanglesOverlap(comparableTask, ghostCoords)) {
        ghostTask.classList.add("outline");
        isColisioned = true;
      }
    }
  }
  if (!isColisioned) {
    ghostTask.classList.remove("outline");
  }
}

// Se itera sobre todas las tareas asignandoles sus eventos
draggableTasks.forEach((task) => {
  task.addEventListener("click", (event) => {
    isClick = true;
    const element = event.currentTarget;

    if (!element.classList.contains("selected")) {
      element.classList.add("selected");
    } else {
      element.classList.remove("selected");
    }
  });
  task.addEventListener("mousedown", (event) => {
    if (!isClick) {
      const element = event.currentTarget;
      focusTask = element;
      element.classList.add("dragging-task");
      createGhostTask(element);
      updateGhostTaskPosition(event);
      drawableArea.addEventListener("mousemove", updateGhostTaskPosition);
      document.addEventListener("mouseup", endDrag);
      isClick = false;
    }
  });
  task.addEventListener("mouseenter", (event) => {
    const element = event.currentTarget;
    element.classList.add("hover");
  });
  task.addEventListener("mouseleave", (event) => {
    const element = event.currentTarget;
    element.classList.remove("hover");
  });
});
