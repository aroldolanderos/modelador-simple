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

// drawn arrows
const bezierCurve = "M520,290 L569,290";
const arrow = new Arrow({ arrowId: "123", d: bezierCurve });
console.log(arrow.getFigure());

// pool.sequence_flow.map((sequence) => {
//   console.log(sequence);
// });
