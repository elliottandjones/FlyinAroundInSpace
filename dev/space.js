let framerate = 60;
let starMod = 0.7;
let flightSpeed = 7;
let warpSpeed = 40;
let postWarpSpeed = 20;

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerWidth;
let numberOfStars = width * height / 10000 * starMod;
let xDirection = width / 2;
let yDirection = height / 2;
let warp = false;
let leaveHyperSpace;

let stars = [];

for (let i = 0; i < numberOfStars; i++) {
  stars[i] = {
    x: field(0, width),
    y: field(0, height),
    size: field(0, 1)
  };
}

canvas.addEventListener("mousemove", flyAround);
document.getElementById('warp').addEventListener("mouseover", centerView);

function centerView() {
  xDirection = width / 2;
  yDirection = height / 2;
}

function flyAround(event) {
  xDirection = event.offsetX;
  yDirection = event.offsetY;
}

window.setInterval(tick, Math.floor(1000 / framerate));

// let enterSpace = window.setInterval(inShallowSpace, 700);

function controlsLock() {
  if (warp) {
    canvas.removeEventListener("mousemove", flyAround);
    flightSpeed = warpSpeed;
  } else {
    postWarp();
    canvas.addEventListener("mousemove", flyAround);
    clear();
  }
}

function postWarp() {
  flightspeed = postWarpSpeed;
  leaveHyperSpace = window.setInterval(slowDown, 500);
}

function slowDown() {
  if (flightSpeed > 10) {
    flightSpeed -= 1;
  } else {
    cruisingSpeed();
  }
}

function cruisingSpeed() {
  clearInterval(leaveHyperSpace);
}

// function inShallowSpace() {
//   if (starMod < 7) {
//     starMod = starMod * 1.3;
//     numberOfStars = width * height / 10000 * starMod;
//     console.log(starMod, numberOfStars);
//   } else {
//     inDeepSpace();
//   }
// }

// function inDeepSpace() {
//   clearInterval(enterSpace);
// }
// get a random number inside the field
function field(start, end) {
  return (Math.random() * 2) * (end - start) + start;
}

// engage warp drive
document.getElementById('warp').addEventListener("click", (e) => {
  warp = warp ? false : true;
  controlsLock();
});
// slow down
document.getElementById('slow').addEventListener("click", (e) => {
  flightSpeed = 5;
});

function clear() {
  context.clearRect(0, 0, width, height);
}

function tick() {
  let lastX = 0;
  let lastY = 0;
  // reset canvas for next frame
  if (!warp) {
    clear();
  }

  for (let i = 0; i < stars.length; i++) {
    // save old position
    lastX = stars[i].x;
    lastY = stars[i].y;

    // calculate changes to star position and size
    stars[i].x += (stars[i].x - xDirection) * stars[i].size * (flightSpeed / 1000);
    stars[i].y += (stars[i].y - yDirection) * stars[i].size * (flightSpeed / 1000);
    stars[i].size += (flightSpeed / 1000);

    // if star goes off-screen, reset it
    if (stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height) {
      stars[i] = {
        x: field(0, width),
        y: field(0, height),
        size: 0
      };
    }
    // stars at warpspeed 
    if (warp) {
      if (i % 3 === 0) {
        context.strokeStyle = `rgba(200, 200, 255, ${Math.min(stars[i].size, 1)})`;
      } else if (i % 5 === 0) {
        context.strokeStyle = `rgba(230, 220, 255, ${Math.min(stars[i].size, 1)})`;
      } else {
        context.strokeStyle = `rgba(255, 255, 255, ${Math.min(stars[i].size, 1)})`;
      }
    } else {
      // draw star and give it some color
      if (i % 7 === 0) {
        // Pink
        context.strokeStyle = `rgba(255, 192, 203, ${Math.min(stars[i].size, 1)})`;
      } else if (i % 6 === 0) { //// papaya variant = rgb(255, 235, 168) 
        // light blue= rgba(173, 216, 230, 1)    ////Royal Blue = rgba(65, 105, 225, 1)
        context.strokeStyle = `rgba(173, 216, 230, ${Math.min(stars[i].size, 1)})`;
      } else if (i % 10 === 0) {
        // Redish rgb(255, 81, 33)
        context.strokeStyle = `rgba(255, 130, 140, ${Math.min(stars[i].size, 1)})`;
      } else {
        // White
        context.strokeStyle = `rgba(255, 255, 255, ${Math.min(stars[i].size, 1)})`;
      }
    }

    context.lineWidth = stars[i].size;
    context.lineCap = "round"; // because stars don't look like rectangles
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(stars[i].x, stars[i].y);
    context.stroke();
  }
}