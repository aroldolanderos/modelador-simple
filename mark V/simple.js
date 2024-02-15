function findElementFromPool(elementId) {
  return pool.elements.find((element) => element.element_id === elementId);
}

function updateElementById(elementId, newParams) {
  const elementIndex = pool.elements.findIndex((element) => element.element_id === elementId);
  if (elementIndex !== -1) {
    // Clonar el objeto original para evitar la modificación directa
    const updatedElement = { ...pool.elements[elementIndex] };
    // Actualizar los parámetros del objeto clonado
    for (let key in newParams) {
      updatedElement[key] = newParams[key];
    }
    // Actualizar el elemento en el array original
    pool.elements[elementIndex] = updatedElement;
    return true; // Devolver verdadero si se actualizó correctamente
  } else {
    return false; // Devolver falso si no se encontró el elemento
  }
}

const pool = {
  pool_id: "pool-123",
  process_name: "Proceso de pruebas SIMPLE 3",
  x: 250,
  y: 120,
  width: 800,
  height: 320,
  lanes: [
    {
      id: "lane-123",
      description: "Lane de ejemplo n° 1",
    },
  ],
  elements: [
    {
      element_id: "element-0",
      lane_id: "lane-123",
      element_type: "lane",
      description: "Lane de ejemplo n° 1",
      x: 280,
      y: 120,
      width: "770",
      height: "320",
    },
    {
      element_id: "element-1",
      lane_id: "lane-123",
      element_type: "startEvent",
      description: null,
      x: 325,
      y: 272,
      width: "36",
      height: "36",
    },
    {
      element_id: "element-2",
      lane_id: "lane-123",
      element_type: "task",
      description: "Tarea 1",
      x: 400,
      y: 260,
      width: "120",
      height: "60",
    },
    {
      element_id: "element-3",
      lane_id: "lane-123",
      element_type: "exclusiveGateway",
      x: 570,
      y: 265,
      width: "50",
      height: "50",
    },
    {
      element_id: "element-4",
      lane_id: "lane-123",
      element_type: "task",
      description: "Tarea 2A",
      x: 680,
      y: 200,
      width: "120",
      height: "60",
    },
    {
      element_id: "element-5",
      lane_id: "lane-123",
      element_type: "task",
      description: "Tarea 2B",
      x: 680,
      y: 320,
      width: "120",
      height: "60",
    },
    {
      element_id: "element-6",
      lane_id: "lane-123",
      element_type: "exclusiveGateway",
      description: "",
      x: 870,
      y: 265,
      width: "50",
      height: "50",
    },
    {
      element_id: "element-7",
      lane_id: "lane-123",
      element_type: "endEvent",
      x: 960,
      y: 272,
      width: "36",
      height: "36",
    },
  ],
  sequence_flow: [
    {
      sequence_id: "seq-1",
      source_ref: "element-1",
      target_ref: "element-2",
      start: { x: 361, y: 290 },
      end: { x: 399, y: 290 },
    },
    {
      sequence_id: "seq-2",
      source_ref: "element-2",
      target_ref: "element-3",
      start: { x: 520, y: 290 },
      end: { x: 569, y: 290 },
    },
    {
      sequence_id: "arrow-3a",
      source_ref: "element-3",
      target_ref: "element-4",
      start: { x: 595, y: 266 },
      curve: { x: 595, y: 230 },
      end: { x: 679, y: 230 },
    },
    {
      sequence_id: "arrow-3b",
      source_ref: "element-3",
      target_ref: "element-5",
      start: { x: 595, y: 316 },
      curve: { x: 595, y: 350 },
      end: { x: 679, y: 350 },
    },
    {
      sequence_id: "arrow-4a",
      source_ref: "element-4",
      target_ref: "element-6",
      start: { x: 800, y: 230 },
      curve: { x: 895, y: 230 },
      end: { x: 895, y: 264 },
    },
    {
      sequence_id: "arrow-4b",
      source_ref: "element-5",
      target_ref: "element-6",
      start: { x: 800, y: 350 },
      curve: { x: 895, y: 350 },
      end: { x: 895, y: 316 },
    },
    {
      sequence_id: "arrow-5",
      source_ref: "element-6",
      target_ref: "element-7",
      start: { x: 920, y: 290 },
      end: { x: 958, y: 290 },
    },
  ],
};

class Arrow {
  constructor(params) {
    this.marker = params.marker || "#simple-arrow-marker";
    this.markerEnd = params.markerEnd || true;
    this.cornerRadius = params.cornerRadius || false;
    this.arrowId = params.arrowId || "1234";
    this.d = params.d;
  }

  getFigure() {
    const diagramGroup = Figure.initElementStatic("g");
    diagramGroup.setAttribute("class", "diagram-group");

    const diagramElement = Figure.initElementStatic("g");
    diagramElement.setAttribute("class", "diagram-element diagram-connection");
    diagramElement.setAttribute("data-arrow-id", this.arrowId);

    const visualGroup = Figure.initElementStatic("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualPath = Figure.initElementStatic("path");
    visualPath.setAttribute("class", "");
    visualPath.setAttribute("data-corner-radius", "");
    visualPath.setAttribute("fill", `url(${this.marker})`);
    if (this.markerEnd) {
      visualPath.setAttribute("marker-end", `url('${this.marker}')`);
    }
    if (this.cornerRadius) {
      visualPath.setAttribute("data-corner-radius", "5");
    }
    visualPath.setAttribute("d", this.d);

    visualGroup.appendChild(visualPath);
    diagramElement.appendChild(visualGroup);
    diagramGroup.appendChild(diagramElement);

    return diagramGroup;
  }
}

class Figure {
  constructor(params) {
    this.figureId = params.elementId || null;
    this.name = params.name || null;
    this.elementType = params.elementType;
    this.x = params.x;
    this.y = params.y;
    this.width = params.w;
    this.height = params.h;
  }

  initElement(svgType) {
    return document.createElementNS("http://www.w3.org/2000/svg", svgType);
  }

  getFigure() {
    const figureMap = {
      pool: this.getPool,
      lane: this.getLane,
      startEvent: this.getStartEvent,
      task: this.getTask,
      exclusiveGateway: this.getExclusiveGateway,
      endEvent: this.getEndEvent,
    };

    const figureFunction = figureMap[this.elementType];
    if (figureFunction) {
      return figureFunction.call(this);
    }
  }

  getPool() {
    const poolElement = this.initElement("g");
    poolElement.setAttribute("class", "diagram-element diagram-shape");
    poolElement.setAttribute("data-pool-id", this.figureId);
    poolElement.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualRect = this.initElement("rect");
    visualRect.setAttribute("class", "pool-rect");
    visualRect.setAttribute("width", this.width);
    visualRect.setAttribute("height", this.height);

    const visualPath = this.initElement("path");
    visualPath.setAttribute("class", "pool-path");
    visualPath.setAttribute("d", `M 30,0 L 30,${this.height}`);

    const text = this.initElement("text");
    text.setAttribute("class", "pool-label");
    let starTextCoord = 225; // calcular
    text.setAttribute("transform", `matrix(-1.83697e-16 -1 1 -1.83697e-16 0 ${starTextCoord})`);

    // la cantidad de span necesarios dependerá del largo del nombre (revisar implementación)
    const span = this.initElement("tspan");
    span.setAttribute("x", -15);
    span.setAttribute("y", 18);
    span.textContent = this.name;

    text.appendChild(span);
    visualGroup.appendChild(visualRect);
    visualGroup.appendChild(visualPath);
    visualGroup.appendChild(text);

    const outlineRect = this.initElement("rect");
    outlineRect.setAttribute("class", "diagram-outline");
    outlineRect.setAttribute("x", "-5");
    outlineRect.setAttribute("y", "-5");
    outlineRect.setAttribute("rx", "4");
    outlineRect.setAttribute("width", `${this.width + 10}`);
    outlineRect.setAttribute("height", `${this.height + 10}`);

    const hitRect = this.initElement("rect");
    hitRect.setAttribute("class", "diagram-hit diagram-hit-all");
    hitRect.setAttribute("width", this.width);
    hitRect.setAttribute("height", this.height);

    poolElement.appendChild(visualGroup);
    poolElement.appendChild(outlineRect);
    poolElement.appendChild(hitRect);

    return poolElement;
  }

  getLane() {
    const laneGroup = this.initElement("g");
    laneGroup.setAttribute("class", "diagram-group");

    const elementGroup = this.initElement("g");
    elementGroup.setAttribute("class", "diagram-element diagram-shape");
    elementGroup.setAttribute("data-lane-id", this.figureId);
    elementGroup.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualRect = this.initElement("rect");
    visualRect.setAttribute("class", "lane-rect");
    visualRect.setAttribute("width", this.width);
    visualRect.setAttribute("height", this.height);

    const text = this.initElement("text");
    text.setAttribute("class", "lane-label");
    let starTextCoord = 225;
    text.setAttribute("transform", `matrix(-1.83697e-16 -1 1 -1.83697e-16 0 ${starTextCoord})`);

    const span = this.initElement("tspan");
    span.setAttribute("x", 6);
    span.setAttribute("y", 18);
    span.textContent = this.name;

    text.appendChild(span);

    const outlineRect = this.initElement("rect");
    outlineRect.setAttribute("class", "diagram-outline");
    outlineRect.setAttribute("x", "-5");
    outlineRect.setAttribute("y", "-5");
    outlineRect.setAttribute("rx", "4");
    outlineRect.setAttribute("width", this.width);
    outlineRect.setAttribute("height", this.height);

    visualGroup.appendChild(visualRect);
    visualGroup.appendChild(text);

    elementGroup.appendChild(visualGroup);
    elementGroup.appendChild(outlineRect);

    laneGroup.appendChild(elementGroup);

    return laneGroup;
  }

  getTask() {
    const taskGroup = this.initElement("g");
    taskGroup.setAttribute("class", "diagram-group");

    const diagramElement = this.initElement("g");
    diagramElement.setAttribute("class", "diagram-element diagram-shape");
    diagramElement.setAttribute("data-task-id", this.figureId);
    diagramElement.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualRect = this.initElement("rect");
    visualRect.setAttribute("class", "real-task");
    visualRect.setAttribute("width", this.width);
    visualRect.setAttribute("height", this.height);
    visualRect.setAttribute("rx", "1");
    visualRect.setAttribute("ry", "1");

    const visualText = this.initElement("text");
    visualText.setAttribute("class", "dg-label");

    const span = this.initElement("tspan");
    span.setAttribute("x", 38); // calcular
    span.setAttribute("y", 36); // calcular
    span.textContent = this.name;

    visualText.appendChild(span);

    visualGroup.appendChild(visualRect);
    visualGroup.appendChild(visualText);

    const hitRect = this.initElement("rect");
    hitRect.setAttribute("class", "diagram-hit diagram-hit-all");
    hitRect.setAttribute("width", this.width);
    hitRect.setAttribute("height", this.height);

    const outlineRect = this.initElement("rect");
    outlineRect.setAttribute("class", "diagram-outline");
    outlineRect.setAttribute("x", "-5");
    outlineRect.setAttribute("y", "-5");
    outlineRect.setAttribute("rx", "2");
    outlineRect.setAttribute("width", this.width);
    outlineRect.setAttribute("height", this.height);

    diagramElement.appendChild(visualGroup);
    diagramElement.appendChild(hitRect);
    diagramElement.appendChild(outlineRect);

    taskGroup.appendChild(diagramElement);

    return taskGroup;
  }

  getExclusiveGateway() {
    const gatewayGroup = this.initElement("g");
    gatewayGroup.setAttribute("class", "diagram-group");

    const diagramElement = this.initElement("g");
    diagramElement.setAttribute("class", "diagram-element diagram-shape");
    diagramElement.setAttribute("data-pool-id", this.figureId);
    diagramElement.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualPolygon = this.initElement("polygon");
    visualPolygon.setAttribute("class", "gateway-polygon");
    visualPolygon.setAttribute("points", "25,0 50,25 25,50 0,25");

    const visualPath = this.initElement("path");
    visualPath.setAttribute("class", "gateway-path");
    visualPath.setAttribute(
      "d",
      "m16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z"
    );

    visualGroup.appendChild(visualPolygon);
    visualGroup.appendChild(visualPath);

    const hitRect = this.initElement("rect");
    hitRect.setAttribute("class", "diagram-hit diagram-hit-all");
    hitRect.setAttribute("width", this.width);
    hitRect.setAttribute("height", this.height);

    const outlineRect = this.initElement("rect");
    outlineRect.setAttribute("class", "diagram-outline outline-gateway");
    outlineRect.setAttribute("x", "2");
    outlineRect.setAttribute("y", "2");
    outlineRect.setAttribute("rx", "4");
    outlineRect.setAttribute("width", this.width);
    outlineRect.setAttribute("height", this.height);

    diagramElement.appendChild(visualGroup);
    diagramElement.appendChild(hitRect);
    diagramElement.appendChild(outlineRect);

    gatewayGroup.appendChild(diagramElement);

    return gatewayGroup;
  }

  getStartEvent() {
    const eventGroup = this.initElement("g");
    eventGroup.setAttribute("class", "diagram-group");

    const elementGroup = this.initElement("g");
    elementGroup.setAttribute("class", "diagram-element diagram-shape");
    elementGroup.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const circle = this.initElement("circle");
    circle.setAttribute("class", "circle circle-start");
    circle.setAttribute("cx", "18");
    circle.setAttribute("cy", "18");
    circle.setAttribute("r", "18");

    visualGroup.appendChild(circle);

    const hitGroup = this.initElement("rect");
    hitGroup.setAttribute("class", "diagram-hit diagram-hit-all");
    hitGroup.setAttribute("x", "0");
    hitGroup.setAttribute("y", "0");
    hitGroup.setAttribute("width", this.width);
    hitGroup.setAttribute("height", this.height);

    const circleOutline = this.initElement("circle");
    circleOutline.setAttribute("class", "diagram-outline");
    circleOutline.setAttribute("cx", "18");
    circleOutline.setAttribute("cy", "18");
    circleOutline.setAttribute("r", "24");

    elementGroup.appendChild(visualGroup);
    elementGroup.appendChild(hitGroup);
    elementGroup.appendChild(circleOutline);

    eventGroup.appendChild(elementGroup);

    return eventGroup;
  }

  getEndEvent() {
    const eventGroup = this.initElement("g");
    eventGroup.setAttribute("class", "diagram-group");

    const diagramElement = this.initElement("g");
    diagramElement.setAttribute("class", "diagram-element diagram-shape");
    diagramElement.setAttribute("data-pool-id", this.figureId);
    diagramElement.setAttribute("transform", `matrix(1 0 0 1 ${this.x} ${this.y})`);

    const visualGroup = this.initElement("g");
    visualGroup.setAttribute("class", "diagram-visual");

    const visualCircle = this.initElement("circle");
    visualCircle.setAttribute("class", "circle circle-end");
    visualCircle.setAttribute("cx", "18");
    visualCircle.setAttribute("cy", "18");
    visualCircle.setAttribute("r", "18");

    visualGroup.appendChild(visualCircle);

    const hitCircle = this.initElement("rect");
    hitCircle.setAttribute("class", "diagram-hit diagram-hit-all");
    hitCircle.setAttribute("width", this.width);
    hitCircle.setAttribute("height", this.height);

    const outlineCircle = this.initElement("circle");
    outlineCircle.setAttribute("class", "diagram-outline");
    outlineCircle.setAttribute("cx", "18");
    outlineCircle.setAttribute("cy", "18");
    outlineCircle.setAttribute("r", "24");

    diagramElement.appendChild(visualGroup);
    diagramElement.appendChild(hitCircle);
    diagramElement.appendChild(outlineCircle);

    eventGroup.appendChild(diagramElement);

    return eventGroup;
  }

  getPoolResizers() {}

  getLineResizers() {}

  static getGridPattern() {
    const patternElement = this.initElementStatic("pattern");
    patternElement.setAttribute("id", "grid-pattern");
    patternElement.setAttribute("width", "20");
    patternElement.setAttribute("height", "20");
    patternElement.setAttribute("patternUnits", "userSpaceOnUse");

    const pathElement = this.initElementStatic("path");
    pathElement.setAttribute("d", "M 20 0 L 0 0 0 20");
    pathElement.setAttribute("fill", "none");
    pathElement.setAttribute("stroke", "lightgrey");
    pathElement.setAttribute("stroke-width", "0.5");

    patternElement.appendChild(pathElement);

    return patternElement;
  }

  static getArrowMarker() {
    const markerElement = this.initElementStatic("marker");
    markerElement.setAttribute("id", "simple-arrow-marker");
    markerElement.setAttribute("viewBox", "0 0 20 20");
    markerElement.setAttribute("refX", "10");
    markerElement.setAttribute("refY", "10");
    markerElement.setAttribute("markerWidth", "10");
    markerElement.setAttribute("markerHeight", "10");
    markerElement.setAttribute("orient", "auto");

    const pathElement = this.initElementStatic("path");
    pathElement.setAttribute("d", "M 1 5 L 11 10 L 1 15 Z");
    pathElement.setAttribute("class", "marker-arrow");

    markerElement.appendChild(pathElement);

    return markerElement;
  }

  static initElementStatic(svgType) {
    return document.createElementNS("http://www.w3.org/2000/svg", svgType);
  }
}

class Matrix {
  constructor(scaleX = 1, scaleY = 1, trslationX = 0, trslationY = 0) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.trslationX = trslationX;
    this.trslationY = trslationY;
  }

  getCoords() {
    return `matrix(${this.scaleX} 0 0 ${this.scaleY} ${this.trslationX} ${this.trslationY})`;
  }

  reset() {
    this.scaleX = 1;
    this.scaleY = 1;
    this.trslationX = 0;
    this.trslationY = 0;
  }

  zoomIn() {
    if (this.scaleX <= 1.5) {
      this.scaleX += 0.05;
      this.scaleY += 0.05;
    } else {
      console.warn("no puedes aumentar más");
    }
  }

  zoomOut() {
    if (this.scaleX >= 0.45) {
      this.scaleX -= 0.05;
      this.scaleY -= 0.05;
    } else {
      console.warn("no puedes disminuir más");
    }
  }
}

class Simple {
  constructor(svgContainerId) {
    this.svgContainer = document.getElementById(svgContainerId);
    this.layerRoot = null;
    this.matrix = new Matrix();
    this.init();
  }

  drawElement(element) {
    const diagramGroup = this.svgContainer
      .querySelector(".viewport")
      .querySelector(".layer-root")
      .querySelector(".diagram-group");

    const diagramChildren = diagramGroup.querySelector(".diagram-children");
    if (diagramChildren) {
      diagramChildren.appendChild(element);
    } else {
      const newDiagramChildren = Figure.initElementStatic("g");
      newDiagramChildren.setAttribute("class", "diagram-children");
      newDiagramChildren.appendChild(element);
      diagramGroup.appendChild(newDiagramChildren);
    }
  }

  drawPool(element) {
    const diagramGroup = this.svgContainer
      .querySelector(".viewport")
      .querySelector(".layer-root")
      .querySelector(".diagram-group");

    diagramGroup.appendChild(element);
  }

  drawArrow(coordPairs) {}

  init() {
    this.svgContainer.setAttribute("data-element-id", "process-1234");
    const viewPort = this.setupViewPort();
    const defs = this.setupDefs();
    this.svgContainer.appendChild(viewPort);
    this.svgContainer.appendChild(defs);
  }

  setupDefs() {
    const defs = Figure.initElementStatic("defs");
    const pattern = Figure.getGridPattern();
    const marker = Figure.getArrowMarker();
    defs.appendChild(pattern);
    defs.appendChild(marker);
    return defs;
  }

  setupGridView() {
    const grid = Figure.initElementStatic("g");
    grid.setAttribute("class", "layer-diagram-grid");

    const rect = Figure.initElementStatic("rect");
    rect.setAttribute("width", "5000");
    rect.setAttribute("height", "5000");
    rect.setAttribute("x", "-2480");
    rect.setAttribute("y", "-2480");
    rect.setAttribute("fill", "url(#grid-pattern)");

    grid.appendChild(rect);

    return grid;
  }

  setupLayerRoot() {
    const layerRoot = Figure.initElementStatic("g");
    layerRoot.setAttribute("id", "layer-root");
    layerRoot.setAttribute("class", "layer-root");
    layerRoot.setAttribute("data-process-id", "process-1234"); // mejorar

    const diagramGroup = Figure.initElementStatic("g");
    diagramGroup.setAttribute("class", "diagram-group");

    layerRoot.appendChild(diagramGroup);

    return layerRoot;
  }

  setupResizers() {
    const layerResizer = Figure.initElementStatic("g");
    layerResizer.setAttribute("id", "layer-resizers");
    layerResizer.setAttribute("class", "layer-resizers");
    return layerResizer;
  }

  setupViewPort() {
    const viewPort = Figure.initElementStatic("g");
    viewPort.setAttribute("id", "viewport");
    viewPort.setAttribute("class", "viewport");
    viewPort.setAttribute("width", "2500");
    viewPort.setAttribute("height", "2000");
    viewPort.setAttribute("transform", this.matrix.getCoords());

    const grid = this.setupGridView();
    const layerRoot = this.setupLayerRoot();
    const layerResizer = this.setupResizers();

    viewPort.appendChild(grid);
    viewPort.appendChild(layerRoot);
    viewPort.appendChild(layerResizer);

    return viewPort;
  }
}
