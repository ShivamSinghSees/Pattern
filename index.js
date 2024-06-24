let route = [];
const myDiv = document.querySelectorAll(".test");
let isDrawing = false;
document.getElementById("refresh").addEventListener("click", () => {
  route = [];
  let lineElement = document.querySelectorAll("#static-line");
  console.log(lineElement, "lineElement");
  if (lineElement) {
    lineElement.forEach((element) => {
      element.remove();
    });
  }
});

function addPatternId(id) {
  if (!route.includes(id)) {
    route.push(id);
    console.log(route);
    createLineBetweenSelectedPoints();
    createTheCurrentPointRouteLine();
  }
}

function handleStart(event) {
  isDrawing = true;
  const id = event.target.id;
  if (id && !route.length) {
    route.push(id);
    createTheCurrentPointRouteLine();
  }
}

function handleMove(event) {
  if (!isDrawing) return;

  let touch;
  if (event.type === "touchmove") {
    touch = event.touches[0];
  } else {
    touch = event;
  }

  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element && element.classList.contains("test")) {
    const id = element.id;
    addPatternId(id);
  }

  updateCurrentLine(touch);
}

function handleEnd() {
  isDrawing = false;
  removeLineFromDom("line");
}

if (myDiv) {
  myDiv.forEach((child) => {
    child.addEventListener("mousedown", handleStart);
    child.addEventListener("touchstart", handleStart);
  });
}

document.addEventListener("mousemove", handleMove);
document.addEventListener("touchmove", handleMove);
document.addEventListener("mouseup", handleEnd);
document.addEventListener("touchend", handleEnd);

function removeLineFromDom(id) {
  let lineElement = document.getElementById(id);
  if (lineElement) {
    lineElement.remove();
  }
}

function createTheCurrentPointRouteLine() {
  const startPoint = document.getElementById(route[route.length - 1]);
  removeLineFromDom("line");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "fixed";
  svg.setAttribute("id", "line");
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  document.body.appendChild(svg);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);
}

function updateCurrentLine(event) {
  const line = document.querySelector("#line line");
  if (!line) return;

  const startPoint = document.getElementById(route[route.length - 1]);
  const rect = startPoint.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  line.setAttribute("x1", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("x2", event.clientX);
  line.setAttribute("y2", event.clientY);
}

function createLineBetweenSelectedPoints() {
  let secondLast = route[route.length - 2];
  let Last = route[route.length - 1];
  if (!secondLast || !Last) return;

  const startPoint = document.getElementById(secondLast);
  const endPoint = document.getElementById(Last);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "static-line");
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.pointerEvents = "none";
  document.body.appendChild(svg);

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("stroke", "white");
  line.setAttribute("stroke-width", "2");
  svg.appendChild(line);

  const startRect = startPoint.getBoundingClientRect();
  const endRect = endPoint.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  line.setAttribute("x1", startX);
  line.setAttribute("y1", startY);
  line.setAttribute("x2", endX);
  line.setAttribute("y2", endY);
}
