const TaskProps = {
  styles: {
    background: "lightblue",
    stroke: "rgb(34, 36, 42)", // borde
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: "blue", // rgb(34, 36, 42)
    trokeWidth: "2px",
    getStr: function () {
      return `stroke-linecap: ${this.strokeLinecap}; stroke-linejoin: ${this.strokeLinejoin}; stroke: ${this.stroke}; stroke-width: ${this.trokeWidth}; fill: ${this.background}`;
    },
  },
  rx: 3,
  ry: 3,
  width: 130,
  height: 60,
};

class Diagram {
  constructor(svg_id, width, height, tasks = []) {
    this.svg_id = svg_id;
    this.width = width;
    this.height = height;
    this.tasks = tasks;
  }

  getSVGCoords(svg, event) {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const ctm = svg.getScreenCTM().inverse();
    return point.matrixTransform(ctm);
  }

  addTask(task) {
    this.tasks.push(task);
  }

  drawTask(task) {
    let taskId = task.id;
    let taskName = task.name;
    let cx = task.x;
    let cy = task.y;

    const drawableArea = document.getElementById("simple-diagram");

    const groupContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("id", `roup-${taskId}`);
    group.setAttribute("class", "draggable");
    group.setAttribute("transform", `matrix(1 0 0 1 ${cx} ${cy})`);

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("id", `rect-${taskId}`);
    rect.setAttribute("data-taskId", taskId);
    rect.setAttribute("width", TaskProps.width);
    rect.setAttribute("height", TaskProps.height);
    rect.setAttribute("rx", TaskProps.rx);
    rect.setAttribute("ry", TaskProps.ry);
    rect.setAttribute("style", TaskProps.styles.getStr());

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", 40);
    tspan.setAttribute("y", 36);
    tspan.textContent = taskName;
    text.appendChild(tspan);

    group.appendChild(rect);
    group.appendChild(text);

    drawableArea.appendChild(group);
  }

  draw() {
    this.tasks.map(this.drawTask);
  }
}

const task1 = {
  id: "task-1",
  name: "Tarea 1",
  x: 50, // coord x
  y: 50, // coord y
};

// const task2 = {
//   id: "task-2",
//   name: "Tarea 2",
//   x: 150, // coord x
//   y: 150, // coord y
// };

// const simple3 = new Diagram("#simple-diagram", 800, 400);
// simple3.addTask(task1);
// // simple3.addTask(task2);
// simple3.draw();
