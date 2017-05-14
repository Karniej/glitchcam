const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const lightbulb = document.querySelectorAll('.fa-lightbulb-o');
const lightRed = document.querySelector("#red");
const lightGreen = document.querySelector("#green");
const lightBlue = document.querySelector("#blue");
const lightGreenScreen = document.querySelector("#greenscreen");
const lightRgbSplit = document.querySelector("#rgbsplit");
const lightShadow = document.querySelector("#shadow");
const moreeffects = document.querySelector("#moreeffects");
moreeffects.addEventListener('click', function () {
            const rows = document.querySelectorAll(".rgb.row").forEach(row => {
                if (row.classList.contains('hideme')) {
                    row.classList.remove('hideme');
                } else {
                    row.classList.add('hideme');
                }
            });});
            // light the bulb!
            lightbulb.forEach(bulb => {
                bulb.addEventListener('click', function giveMeLight() {
                    this.classList.toggle('light');
                })
            });

            function getVideo() {
                navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false
                    })
                    .then(localMediaStream => {
                        console.log(localMediaStream);
                        video.src = window.URL.createObjectURL(localMediaStream)
                        video.play();
                    })
                    .catch(err => {
                        console.error(`You don't allow our spycam to work!`, err);
                    })
            }

            function paintToCanvas() {
                const width = video.videoWidth;
                const height = video.videoHeight;
                canvas.width = width;
                canvas.height = height;

                return setInterval(() => {
                    ctx.drawImage(video, 0, 0, width, height);
                    //take the pixels out
                    let pixels = ctx.getImageData(0, 0, width, height);
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
                }, 16)
            }
            const redEf = document.querySelector("input[name=red]");

            function redEffect(pixels) {
                for (let i = 0; i < pixels.data.length; i += 4) {
                    pixels.data[i + 0] = pixels.data[i + 0] + redEf.value / 1.5; //red
                }
                return pixels;
            }
            const greenEf = document.querySelector("input[name=green]");

            function greenEffect(pixels) {
                for (let i = 0; i < pixels.data.length; i += 4) {
                    pixels.data[i + 1] = pixels.data[i + 1] + greenEf.value / 1.5; //green
                }
                return pixels;
            }

            const blueEf = document.querySelector("input[name=blue]");

            function blueEffect(pixels) {
                for (let i = 0; i < pixels.data.length; i += 4) {
                    pixels.data[i + 2] = pixels.data[i + 2] + blueEf.value / 1.5; //blue
                }
                return pixels;
            }

            function rgbSplit(pixels) {
                for (let i = 0; i < pixels.data.length; i += 4) {
                    pixels.data[i - 250] = pixels.data[i + 0]; //red
                    pixels.data[i + 200] = pixels.data[i + 1]; //green
                    pixels.data[i - 250] = pixels.data[i + 2]; //blue
                }
                return pixels;

            }


            function takePhoto() {
                //play the sound
                snap.currentTime = 0;
                snap.play();

                //take the photo
                const data = canvas.toDataURL('image/jpeg');
                console.log(data);
                const link = document.createElement('a');
                link.href = data;
                link.setAttribute('download', 'image');
                link.innerHTML = `<img src="${data}" alt= "Image"/>`
                strip.insertBefore(link, strip.firstChild);
            }


            function greenScreen(pixels) {
                const levels = {};
                document.querySelectorAll('.rgb input').forEach((input) => {
                    levels[input.name] = input.value;
                });
                for (i = 0; i < pixels.data.length; i = i + 4) {
                    red = pixels.data[i + 0];
                    green = pixels.data[i + 1];
                    blue = pixels.data[i + 2];
                    alpha = pixels.data[i + 3];
                    if (red >= levels.rmin &&
                        green >= levels.gmin &&
                        blue >= levels.bmin &&
                        red <= levels.rmax &&
                        green <= levels.gmax &&
                        blue <= levels.bmax) {
                        // take it out
                        pixels.data[i + 3] = 0;
                    }
                }
                return pixels;
            }
            getVideo();

            video.addEventListener('canplay', paintToCanvas);