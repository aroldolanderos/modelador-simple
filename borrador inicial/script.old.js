// Función para obtener las coordenadas de un elemento SVG
function getSVGCoords(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const ctm = svg.getScreenCTM().inverse();
  return point.matrixTransform(ctm);
}

// Función para actualizar la posición de la flecha
function updateArrowPosition() {
  const svg = document.querySelector("svg");
  const box1 = document.getElementById("box1");
  const box2 = document.getElementById("box2");
  const arrowLine = document.getElementById("arrowLine");

  const box1X = parseInt(box1.getAttribute("x")) + parseInt(box1.getAttribute("width")) / 2;
  const box1Y = parseInt(box1.getAttribute("y")) + parseInt(box1.getAttribute("height"));
  const box2X = parseInt(box2.getAttribute("x")) + parseInt(box2.getAttribute("width")) / 2;
  const box2Y = parseInt(box2.getAttribute("y"));

  const path = `M ${box1X + 0},${box1Y - 0} L ${box1X + 0},${box1Y + 50} ${box2X - 0},${box1Y + 50} ${box2X - 0},${
    box2Y - 50
  } ${box2X},${box2Y - 6}`;

  arrowLine.setAttribute("d", path);
}

// Función para manejar el inicio del arrastre
function startDrag(evt) {
  const svg = document.querySelector("svg");
  const target = evt.target;
  const svgCoords = getSVGCoords(svg, evt);
  const offsetX = svgCoords.x - parseFloat(target.getAttribute("x"));
  const offsetY = svgCoords.y - parseFloat(target.getAttribute("y"));

  function drag(evt) {
    const newCoords = getSVGCoords(svg, evt);
    const newX = newCoords.x - offsetX;
    const newY = newCoords.y - offsetY;
    const svgRect = svg.getBoundingClientRect();

    if (
      newX >= 0 &&
      newY >= 0 &&
      newX + target.getBBox().width <= svgRect.width &&
      newY + target.getBBox().height <= svgRect.height
    ) {
      target.setAttribute("x", newCoords.x - offsetX);
      target.setAttribute("y", newCoords.y - offsetY);
      updateArrowPosition();
    }
  }

  function endDrag(evt) {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", endDrag);
  }

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
}

// Asignar eventos de arrastre a las figuras
const draggableElements = document.querySelectorAll(".draggable");
draggableElements.forEach((element) => {
  element.addEventListener("mousedown", startDrag);
});

// Función para hacer zoom in
function zoomIn() {
  const svg = document.querySelector("svg");
  const viewBox = svg.getAttribute("viewBox").split(" ").map(parseFloat);
  const newViewBox = viewBox.map((value) => value * 0.9); // Disminuir el tamaño del viewBox en un 10%
  svg.setAttribute("viewBox", newViewBox.join(" "));
}

// Función para hacer zoom out
function zoomOut() {
  const svg = document.querySelector("svg");
  const viewBox = svg.getAttribute("viewBox").split(" ").map(parseFloat);
  const newViewBox = viewBox.map((value) => value * 1.1); // Aumentar el tamaño del viewBox en un 10%
  svg.setAttribute("viewBox", newViewBox.join(" "));
}

const svg = document.querySelector("svg");

svg.addEventListener("wheel", function (event) {
  event.preventDefault(); // Evitar el comportamiento de scroll predeterminado

  const delta = event.deltaY; // Obtener la dirección del scroll

  // Determinar si hacer zoom in o zoom out según la dirección del scroll
  if (delta < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
});

// Inicializar posición de la flecha
updateArrowPosition();
