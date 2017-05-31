/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var video = document.querySelector('.player');
var canvas = document.querySelector('.photo');
var ctx = canvas.getContext('2d');
var strip = document.querySelector('.strip');
var snap = document.querySelector('.snap');
var camera = document.querySelector('#photoclick');
var fabolt = document.querySelectorAll('.fa-bolt');
var lightRed = document.querySelector("#red");
var lightGreen = document.querySelector("#green");
var lightBlue = document.querySelector("#blue");
var lightGreenScreen = document.querySelector("#greenscreen");
var lightRgbSplit = document.querySelector("#rgbsplit");
var lightShadow = document.querySelector("#shadow");
var moreoptions = document.querySelector("#more_options");

moreoptions.addEventListener('click', function () {
  var sidebar = document.querySelector("#sidebar-wrapper");
  if (sidebar.classList.contains('hideme')) {
    sidebar.classList.remove('hideme');
  } else {
    sidebar.classList.add('hideme');
  }
});
// light the bulb!
fabolt.forEach(function (bolt) {
  bolt.addEventListener('click', function giveMeLight() {
    this.classList.toggle('light');
  });
});

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(function (localMediaStream) {
    console.log(localMediaStream);
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
  }).catch(function (err) {
    console.error('You don\'t allow our spycam to work!', err);
  });
}

function paintToCanvas() {
  var width = video.videoWidth;
  var height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(function () {
    ctx.drawImage(video, 0, 0, width, height);
    //take the pixels out
    var pixels = ctx.getImageData(0, 0, width, height);
    //mess with them
    if (lightGreenScreen.classList.contains('light')) {
      pixels = greenScreen(pixels);
    } else pixels = pixels;
    if (lightRed.classList.contains('light')) {
      pixels = redEffect(pixels);
    } else pixels = pixels;
    if (lightGreen.classList.contains('light')) {
      pixels = greenEffect(pixels);
    } else pixels = pixels;
    if (lightBlue.classList.contains('light')) {
      pixels = blueEffect(pixels);
    } else pixels = pixels;
    if (lightRgbSplit.classList.contains('light')) {
      pixels = rgbSplit(pixels);
    } else pixels = pixels;
    if (lightShadow.classList.contains('light')) {
      ctx.globalAlpha = document.querySelector("input[name=shadow]").value / 255;
    } else ctx.globalAlpha = 1;
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}
var redEf = document.querySelector("input[name=red]");

function redEffect(pixels) {
  for (var _i = 0; _i < pixels.data.length; _i += 4) {
    pixels.data[_i + 0] = pixels.data[_i + 0] + redEf.value / 1.5; //red
  }
  return pixels;
}
var greenEf = document.querySelector("input[name=green]");

function greenEffect(pixels) {
  for (var _i2 = 0; _i2 < pixels.data.length; _i2 += 4) {
    pixels.data[_i2 + 1] = pixels.data[_i2 + 1] + greenEf.value / 1.5; //green
  }
  return pixels;
}

var blueEf = document.querySelector("input[name=blue]");

function blueEffect(pixels) {
  for (var _i3 = 0; _i3 < pixels.data.length; _i3 += 4) {
    pixels.data[_i3 + 2] = pixels.data[_i3 + 2] + blueEf.value / 1.5; //blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (var _i4 = 0; _i4 < pixels.data.length; _i4 += 4) {
    pixels.data[_i4 - 250] = pixels.data[_i4 + 0]; //red
    pixels.data[_i4 + 200] = pixels.data[_i4 + 1]; //green
    pixels.data[_i4 - 250] = pixels.data[_i4 + 2]; //blue
  }
  return pixels;
}

function greenScreen(pixels) {
  var levels = {};
  document.querySelectorAll('input.sliders').forEach(function (input) {
    levels[input.name] = input.value;
  });
  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];
    if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
      // take it out
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}
camera.addEventListener("click", function takePhoto() {
  //play the sound
  snap.currentTime = 0;
  snap.play();

  //take the photo
  var data = canvas.toDataURL('image/jpeg');
  console.log(data);
  var link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'image');
  link.innerHTML = '<img src="' + data + '" alt= "Image"/>';
  strip.insertBefore(link, strip.firstChild);
});

getVideo();

video.addEventListener('canplay', paintToCanvas);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);