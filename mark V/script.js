// init svg
const simple = new Simple("simple-diagram");

// setup pool
const poolSVG = new Figure({
  elementType: "pool",
  elementId: pool.pool_id,
  name: pool.process_name,
  x: pool.x,
  y: pool.y,
  w: pool.width,
  h: pool.height,
});

// draw pool
simple.drawPool(poolSVG.getFigure());

// draw elements
pool.elements.map((element) => {
  const params = {
    elementType: element.element_type,
    x: element.x,
    y: element.y,
    w: element.width,
    h: element.height,
  };
  if (element.element_id) {
    params["elementId"] = element.element_id;
  }
  if (element.description) {
    params["name"] = element.description;
  }
  const figure = new Figure(params);
  const svgElement = figure.getFigure();
  simple.drawElement(svgElement);
});

// draw arrows
pool.sequence_flow.map((sequence) => {
  const arrow = new Arrow({
    sequence: sequence,
  });
  simple.drawArrow(arrow.getFigure());
});

// Drag & Drop

function removeSelectedClass(event) {
  const currentClick = event.currentTarget;
  let cleanSelected = false;

  if (currentClick.classList.contains("selected")) {
    cleanSelected = true;
  }

  const ele = document.querySelectorAll(".selected");
  ele.forEach((e) => {
    e.classList.remove("selected");
  });

  if (!cleanSelected) {
    currentClick.classList.add("selected");
  }
}

function removeOnHoverSVG() {
  const svg = document.getElementById("simple-diagram");
  svg.classList.remove("hover");
}

function addHoverOnSVG() {
  const svg = document.getElementById("simple-diagram");
  svg.classList.add("hover");
}

/* DIAGRAM ELEMENT */
const diagramElements = document.querySelectorAll(".diagram-element");

diagramElements.forEach((element) => {
  //   element.addEventListener("click", function (event) {
  //     if (GL.runClick) {
  //       console.log("click");
  //       removeSelectedClass(event);
  //     }
  //   });

  element.addEventListener("mousedown", (event) => {
    event.preventDefault();
    console.log("mousedown");
    event.stopPropagation(); // detiene efectos mousedown hacia arriba
  });
  element.addEventListener("mouseup", (event) => {
    // GL.runClick = true;
  });

  element.addEventListener("touchstart", (event) => {
    console.log(touchstart);
  });

  element.addEventListener("mouseenter", (event) => {
    removeOnHoverSVG();
    const element = event.currentTarget;
    element.classList.add("hover");
  });
  element.addEventListener("mouseleave", (event) => {
    addHoverOnSVG();
    const element = event.currentTarget;
    element.classList.remove("hover");
  });
});

/* Laywer root*/
const svg = document.getElementById("simple-diagram");
svg.addEventListener("mouseenter", (event) => {
  const element = event.currentTarget;
  element.classList.add("hover");
});
svg.addEventListener("mouseleave", (event) => {
  const element = event.currentTarget;
  element.classList.remove("hover");
});

svg.addEventListener("mouseleave", (event) => {
  const element = event.currentTarget;
  element.classList.remove("hover");
});

// agrega evento para desplazamiento contenido
simple.matrix.setUpDraggScroll("viewport");

document.addEventListener("mouseup", () => {
  GL.isDragging = false;
});

/* Eventos para poner manito al agarrar o soltar el fondo */
document.addEventListener("mousemove", function () {
  if (GL.isDragging && !document.body.classList.contains("cursor-grab")) {
    document.body.classList.add("cursor-grab");
  }
});
document.addEventListener("mouseup", function () {
  document.body.classList.remove("cursor-grab");
});
