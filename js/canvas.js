import '../images/babettes.avif'
import '../images/Ghost-messaging.avif' 
import '../images/Meridian-Book_Design.avif' 
import '../images/Yonex-All_England.avif' 

import gsap from 'gsap'
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
offscreenCanvas.height = canvas.height / 32;


const sliderCover = document.getElementById("slider-cover")
const dot = document.getElementById("dot")
let growInterval, shrinkInterval;
let growRate = 16

var topDiv = document.getElementById('top-ui')
  var bottomDiv = document.getElementById('bot-ui')
  var title1 = document.getElementById('title-1')
  var title2 = document.getElementById('title-2')
  var title3 = document.getElementById('title-3')
let color = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
let triggerColor = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]]

const isCanvasInView = {
  page1: true,
  page2: false
};

const page1 = document.getElementById("page1")
const page2 = document.getElementById("page2")

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.target.id === 'page1') {
      isCanvasInView.page1 = entry.isIntersecting;
    } else if (entry.target.id === 'page2') {
      isCanvasInView.page2 = entry.isIntersecting;
    }
  });
  console.log(isCanvasInView)
}, {
  threshold: 0.6 // Adjust as needed
});

observer.observe(page1);
observer.observe(page2);

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

function getNumericStyleValue(styleValue) {
  return parseInt(styleValue.replace('px', '')) || 0;
}

function palette(t, a, b, c, d) {
  return [
    a[0] + b[0] * Math.cos(2 * Math.PI * (c[0] * t + d[0])),
    a[1] + b[1] * Math.cos(2 * Math.PI * (c[1] * t + d[1])),
    a[2] + b[2] * Math.cos(2 * Math.PI * (c[2] * t + d[2]))
  ];
}

function drawGradient(ctx, offscreenCtx, offscreenCanvas, canvas) {
  const imageData = offscreenCtx.createImageData(offscreenCanvas.width, offscreenCanvas.height);
  const data = imageData.data;
  const color1 = [color[0], [0,0,1], [1,1,1], [0,0.1, 0.3]]
  const color2 = [color[1], [1, 0.5, 0], [1, 1, 1], [0.2, 0.3, 0.4]]
  const color3 = [color[2],  [1, 1, 1],  [1, 1, 1],  [0.1, 0.2, 0.3]]
  const color4 = [color[3],  [0, 0, 1],  [1, 1, 1],  [0.3, 0.3, 0.2]]
  const time = Date.now() * 0.0002;

  const c1 = [mouse.x / canvas.width, mouse.y / canvas.height];
  const c2 = [
    (Math.sin(time * 0.7) * 0.9 + 1) / 2,
    (Math.cos(time * 0.65) * 0.6 + 1) / 2
  ];
  const c3 = [
    (Math.sin(time * 0.5) * 0.8 + 1) / 2,
    (Math.cos(time * 0.8) * 0.5 + 1) / 2
  ];
  const c4 = [
    (Math.sin(time * 0.3) * 0.7 + 1) / 2,
    (Math.cos(time * 0.6) * 0.4 + 1) / 2
  ];

  for (let y = 0; y < offscreenCanvas.height; y++) {
    for (let x = 0; x < offscreenCanvas.width; x++) {
      const uvX = x / offscreenCanvas.width;
      const uvY = y / offscreenCanvas.height;

      const d1 = Math.hypot(uvX - c1[0], uvY - c1[1]);
      const col1 = palette(d1 + time, color1[0], color1[1], color1[2], color1[3]);

      const d2 = Math.hypot(uvX - c2[0], uvY - c2[1]);
      const col2 = palette(d2 + time, color2[0], color2[1], color2[2], color2[3]);

      const d3 = Math.hypot(uvX - c3[0], uvY - c3[1]);
      const col3 = palette(d3 + time, color3[0], color3[1], color3[2], color3[3]);

      const d4 = Math.hypot(uvX - c4[0], uvY - c4[1]);
      const col4 = palette(d4 + time, color4[0], color4[1], color4[2], color4[3]);

      // Blend colors with more emphasis on individual colors to make them stand out
      const col = [
        (col1[0] + col2[0] + col3[0] + col4[0]) / 4,
        (col1[1] + col2[1] + col3[1] + col4[1]) / 4,
        (col1[2] + col2[2] + col3[2] + col4[2]) / 4
      ];

      const index = (x + y * offscreenCanvas.width) * 4;
      data[index] = col[0] * 255;
      data[index + 1] = col[1] * 255;
      data[index + 2] = col[2] * 255;
      data[index + 3] = 255;
    }
  }

  offscreenCtx.putImageData(imageData, 0, 0);
  ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
}


class Triangle{
  constructor(x, y, width, height, alpha){
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.alpha = alpha
  }
  draw(ctx){
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black"
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  turnOn(){
    this.alpha = 1
  }
  turnOff(){
    this.alpha = 0
  } 
}

class dashLine{
  constructor(x,y, height){
    this.x = x
    this.y = y
    this.height = height
    this.offset = {x:-20,y:-5}
    this.inc = this.height/30
    this.triangle = new Triangle(this.x + this.offset.x, this.y + this.offset.y, 5, 5, 0)
    this.checkpoints = [this.y, this.y + this.inc*10, this.y + this.inc*20, this.y + this.inc*30]
    this.triangleIndex = 0
    this.changeRate = 3
    this.tolerance = 3
  }
  draw(ctx){
    ctx.strokeStyle = 'white'
    for(let i = 0; i < 31; i++){
      // console.log(i)
      if (i%10 == 0){
        ctx.moveTo(this.x, this.y + i * this.inc)
        ctx.lineTo(this.x+6, this.y + i * this.inc)
        ctx.stroke()
      }else{
        ctx.moveTo(this.x+2, this.y + i * this.inc)
        ctx.lineTo(this.x+4, this.y + i * this.inc)
        ctx.stroke()
      }
    }
  }
  update(ctx){
    if(this.triangle.y - this.offset.y < this.checkpoints[this.triangleIndex] - this.tolerance){
      this.triangle.y +=this.changeRate
    }else if(this.triangle.y - this.offset.y > this.checkpoints[this.triangleIndex] + this.tolerance ){
      this.triangle.y -=this.changeRate
    }
    this.triangle.draw(ctx)
    this.draw(ctx)
  }
}class Magnifier {
  constructor(x, y, radius, magnification) {
      this.x = x;
      this.y = y;
      this.magnification = magnification;
      this.radius = radius;
  }

  draw() {
      const magnifierX = this.x - this.radius / 2;
      const magnifierY = this.y - this.radius / 2;
      const sourceX = this.x - this.radius / (2 * this.magnification);
      const sourceY = this.y - this.radius / (2 * this.magnification);
      const sourceWidth = this.radius / this.magnification;
      const sourceHeight = this.radius / this.magnification;

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(canvas, sourceX, sourceY, sourceWidth, sourceHeight, magnifierX, magnifierY, this.radius, this.radius);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2, true);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgb(0,0,0,0.05)';
      ctx.stroke();
  }

  update() {
    
      this.x = mouse.x;
      this.y = mouse.y;
      this.draw();
  }
}

const elements = document.querySelectorAll('.hover-triangle');
let triangles

function initTriangles(){
  triangles = []
  //console.log("what")
  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect();
    const triangle = new Triangle(rect.left - 15, rect.top + rect.height / 2 - 5, 10, 10, 0);
    triangles.push(triangle);
    if(index != 0){
      //console.log("set")
      element.addEventListener('mouseenter', () => {
        //console.log("enter")
        triangles[index].turnOn();
      });
  
      element.addEventListener('mouseleave', () => {
        //console.log("leave")
        triangles[index].turnOff();
      });
    }else{
      //console.log("not set")
      triangle.turnOn()
    }
  });
}initTriangles()


//function drawGradient(ctx, offscreenCtx, offscreenCanvas, canvas) {
let magnifier = new Magnifier(200, 200, 200, 200)
let dash = new dashLine(50, 200, 400)
// sliderCover.addEventListener('DOMContentLoaded', (event) => {
//   const rect = sliderCover.getBoundingClientRect();

//   // const dash = new dashLine(rect.left, rect.top, rect.height)
//   console.log(rect.left+200, rect.top, rect.height)
//   dash = new dashLine(rect.left+200, rect.top, 800)
// })

let colorRate = 0.05
function inchColor(current, trigger){
  console.log(current, trigger)
  current.forEach((vector, i) =>{
    vector.forEach((num, j)=>{
      if (trigger[i][j] > num){
        current[i][j] = Math.min(trigger[i][j], current[i][j] + colorRate)
      }else{
        current[i][j] = Math.max(trigger[i][j], current[i][j] - colorRate)
      }
    })
  })
}

const workCover = document.getElementById("work-cover")
const workCoverRate = 0.06
const workTitle = document.getElementById("work-title")
function animate() {
  let currentOpacity = parseFloat(workCover.style.opacity) || 0;
  if(isCanvasInView.page1 == true){

    workCover.style.opacity = Math.max(0, currentOpacity-workCoverRate)
    triggerColor = [[0,0,1], [1, 0.5, 0], [1,1,1], [0,0,1]]
  }else{
    workCover.style.opacity = Math.min(1, currentOpacity+workCoverRate)
    if(slides.slide1 == true){
      triggerColor = [[0,1,0], [0, 0, 0.5], [0,0,0], [0,1,0]]
      workTitle.innerHTML = "YONEX ALL ENGLAND"
    }else if(slides.slide2 == true){
      triggerColor = [[1,0.75,0.8], [0.5, 0, 0.5], [0.68,0.85,0.9], [0,0,0]]
      workTitle.innerHTML = "GHOST MESSAG>NG"
    }else if(slides.slide3 == true){
      triggerColor = [[0, 0, 0.5],[0.68, 0.85, 0.9],[1, 0.55, 0],[1, 1, 0.5]];
      workTitle.innerHTML = "MER/D/AN"
    }else if(slides.slide4 == true){
      triggerColor = [[0, 0, 0.5], [0.68, 0.85, 0.9], [1, 0.55, 0], [1, 1, 0.5]];
      workTitle.innerHTML = "BABETTE'S"
    }else{
      workCover.style.opacity = Math.max(0, currentOpacity-workCoverRate)
    }
  }
  console.log(workCover.style.opacity)
  inchColor(color, triggerColor)
  drawGradient(ctx, offscreenCtx, offscreenCanvas, canvas);

  if (isCanvasInView.page1) {
    magnifier.update()
    triangles.forEach(triangle => triangle.draw(ctx));
  }
  if (isCanvasInView.page2) {
    //drawGradient(ctx2, offscreenCtx2, offscreenCanvas2, canvas2);
    dash.update(ctx)
    dot.style.left = `${mouse.x}px`;
    dot.style.top = `${mouse.y}px`;
  }
  if(isCanvasInView.page2 == true && observer){
    //console.log("true")
    sliderCover.focus()
    sliderCover.scrollIntoView({behavior: 'smooth'})
    //container = document.getElementById('container')
    //container.style.position = "fixed"

  }

  requestAnimationFrame(animate);
}

animate();



//Event Listeners

// document.addEventListener('wheel', function(event) {
//     //var innerScrollDiv = document.getElementById('inner-scroll');
//     if (!isCanvasInView.page2) {
//         // If the scroll is within the inner div, allow default behavior
//         return;
//     }
//     // Prevent scrolling on the main page
//     event.preventDefault();
// }, { passive: false });

const container = document.querySelector('#container')
container.addEventListener('scroll', function(){

  var scrollPosition = container.scrollTop;

  //console.log(scrollPosition)
  var windowHeight = window.innerHeight;
  var fadeFactor = 1 - 4 * (scrollPosition/windowHeight)
  fadeFactor = Math.max(0, Math.min(1, fadeFactor))
  bottomDiv.style.opacity = fadeFactor
  var translateY = Math.min(scrollPosition, 200)
  topDiv.style.transform = `translateY(-${translateY}px)`

  var titleContainer = document.getElementById('title-container')
  var translateHorizontal = Math.min(Math.max(20, 0.5* scrollPosition), 200)
  titleContainer.style.opacity = fadeFactor

  //console.log(translateHorizontal)
  title1.style.transform = `translateX(-${translateHorizontal}px)`
  title2.style.transform = `translateX(${20 + translateHorizontal}px)`
  title3.style.transform = `translateX(-${translateHorizontal}px)`
  
  //console.log(scrollPosition)
})

addEventListener('mousemove', (event) => {
  //console.log('register')
  gsap.to(mouse, {
    x: event.clientX,
    y: event.clientY
  })
});

addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  offscreenCanvas.width = canvas.width / 32;
  offscreenCanvas.height = canvas.height / 32;
  initTriangles()
});

let slides = {
  slide1: false,
  slide2: false,
  slide3: false,
  slide4: false
}

const sliderObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
      if (entry.target.id === 'slide1') {
        slides.slide1 = entry.isIntersecting;
        dash.triangleIndex = 0
      }else if (entry.target.id === 'slide2') {
        slides.slide2 = entry.isIntersecting;
        dash.triangleIndex = 1
      }else if (entry.target.id === 'slide3') {
        slides.slide3 = entry.isIntersecting;
        dash.triangleIndex = 2
      }else if (entry.target.id === 'slide4') {
        slides.slide4 = entry.isIntersecting;
        dash.triangleIndex = 3
      }else if (entry.target.id === 'slide5') {
        slides.slide5 = entry.isIntersecting;
        dash.triangleIndex = 4
      }
      console.log(slides, dash.triangleIndex)
  });
}, { threshold: 0.9 });
sliderObserver.observe (document.getElementById('slide1'))
sliderObserver.observe (document.getElementById('slide2'))
sliderObserver.observe (document.getElementById('slide3'))
sliderObserver.observe (document.getElementById('slide4'))

// observer.observe(sliderCover);

sliderCover.addEventListener('mouseenter', () => {
    clearInterval(shrinkInterval);
    growInterval = setInterval(function() {
        const newWidth = Math.min(100, getNumericStyleValue(dot.style.width) + growRate);
        const newHeight = Math.min(100, getNumericStyleValue(dot.style.height) + growRate);
        const newFont = Math.min(20, getNumericStyleValue(dot.style.fontSize) + growRate/8)
        dot.style.width = newWidth + 'px';
        dot.style.height = newHeight + 'px';
        dot.style.fontSize = newFont +'px'
        if (newWidth === 100 && newHeight === 100) {
            clearInterval(growInterval);
        }
    }, 1); // Adjust the interval time for faster or slower growth
});

sliderCover.addEventListener('mouseleave', () => {
    clearInterval(growInterval);
    shrinkInterval = setInterval(function() {
        const newWidth = Math.max(0, getNumericStyleValue(dot.style.width) - growRate);
        const newHeight = Math.max(0, getNumericStyleValue(dot.style.height) - growRate);
        const newFont = Math.max(0, getNumericStyleValue(dot.style.fontSize) - growRate/8)
        //console.log(newWidth, newHeight);
        dot.style.width = newWidth + 'px';
        dot.style.height = newHeight + 'px';
        dot.style.fontSize = newFont +'px'
        if (newWidth === 0 && newHeight === 0) {
            clearInterval(shrinkInterval);
        }
    }, 10); // Adjust the interval time for faster or slower shrinkage
});

