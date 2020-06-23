(function () {
  let framerate = 60;
  let starMod = 0.8;
  let flightSpeed = 7;
  let warpSpeed = 40;
  let postWarpSpeed = 20;

  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let numberOfStars = ((width * height) / 10000) * starMod;
  let xDirection = width / 2;
  let yDirection = height / 2;
  let warp = false;
  let leaveHyperSpace;
  let button = document.getElementById('warp');

  let stars = [];

  for (let i = 0; i < numberOfStars; i++) {
    stars[i] = {
      x: field(0, width),
      y: field(0, height),
      size: field(0, 1),
    };
  }
  // some events
  window.addEventListener('resize', resizeCanvas); // in case you mess with the window size
  canvas.addEventListener('mousemove', flyAround); // fly where you point your mouse on the canvas
  button.addEventListener('mouseover', centerView); // prepare for warp speed
  // engage warp drive
  button.addEventListener('click', (e) => {
    warp = warp ? false : true;
    controlsLock();
  });
  // main timing interval
  window.setInterval(tick, Math.floor(1000 / framerate));

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // window.setInterval(tick, Math.floor(1000 / framerate));
    tick();
  }
  function centerView() {
    xDirection = width / 2;
    yDirection = height / 2;
  }
  function flyAround(event) {
    xDirection = event.offsetX;
    yDirection = event.offsetY;
  }

  function controlsLock() {
    if (warp) {
      canvas.removeEventListener('mousemove', flyAround);
      flightSpeed = warpSpeed;
    } else {
      postWarp();
      canvas.addEventListener('mousemove', flyAround);
      clear();
    }
  }

  function postWarp() {
    flightspeed = postWarpSpeed;
    leaveHyperSpace = window.setInterval(slowDown, 500);
  }

  // slow down
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

  // get a random number inside the field
  function field(start, end) {
    return Math.random() * 2 * (end - start) + start;
  }

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
      stars[i].size += flightSpeed / 1000;

      // if star goes off-screen, reset it
      if (stars[i].x < 0 || stars[i].x > width || stars[i].y < 0 || stars[i].y > height) {
        stars[i] = {
          x: field(0, width),
          y: field(0, height),
          size: 0,
        };
      }
      // stars at warpspeed
      if (warp) {
        if (i % 3 === 0) {
          context.strokeStyle = `rgba(210, 240, 200, ${Math.min(stars[i].size, 1)})`; //rgb(210, 240, 200)
        } else if (i % 5 === 0) {
          context.strokeStyle = `rgba(230, 220, 255, ${Math.min(stars[i].size, 1)})`; //rgb(230,220,255)
        } else {
          context.strokeStyle = `rgba(255, 255, 255, ${Math.min(stars[i].size, 1)})`; //rgb(255,255,255)
        }
      } else {
        // draw star and give it some color
        if (i % 7 === 0) {
          // Pink
          context.strokeStyle = `rgba(255, 192, 203, ${Math.min(stars[i].size, 1)})`;
        } else if (i % 6 === 0) {
          // Light Blue
          context.strokeStyle = `rgba(173, 216, 230, ${Math.min(stars[i].size, 1)})`;
        } else if (i % 10 === 0) {
          // Radish Red
          context.strokeStyle = `rgba(255, 130, 140, ${Math.min(stars[i].size, 1)})`;
        } else {
          // White
          context.strokeStyle = `rgba(255, 255, 255, ${Math.min(stars[i].size, 1)})`;
        }
      }

      context.lineWidth = stars[i].size;
      context.lineCap = 'round'; // because stars don't look like rectangles
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(stars[i].x, stars[i].y);
      context.stroke();
    }
  }
})();
