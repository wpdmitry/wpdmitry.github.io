class Robot {
    constructor(videoSrc, ctx, audioSrc, audioCtx, w, h, callbackOnOff) {
        this.video = videoSrc;
        this.ctx = ctx;
        this.w = w;
        this.h = h;
        this.audioSrc = audioSrc;
        this.audioCtx = audioCtx;
        this.callbackOnOff = callbackOnOff;

        this.text = String(Robot).split('\n').filter(str => !!str);
        this.currentStr = 1;
        this.countMaxSrt = this.text.length;

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;

        this.x = 0;
        this.y = 0;

    }
    start() {
        this.workTime = 0;
        this.charge = 180 * 1000;
        this.prevTime = 0;

        this.audioSrc.connect(this.analyser);
        // this.analyser.connect(this.audioCtx.destination);

        this.loop();
    }

    loop() {
        this.animationId = requestAnimationFrame(time => {
            this.workTime = time;
            this.loop()
        });

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawRedBg();
        this.drawRandomNoise();
        this.drawCurrentCharge();
        this.drawVolume();
        this.drawDiagram();
        this.drawText();

    }

    stop() {
        cancelAnimationFrame(this.animationId);

        this.audioSrc.disconnect(this.analyser);
        this.analyser.disconnect(this.audioCtx.destination);
        this.callbackOnOff();
    }

    drawRedBg() {
        const oldOperation = this.ctx.globalCompositeOperation;

        this.ctx.globalCompositeOperation = 'luminosity';
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.w, this.h);
        this.ctx.drawImage(this.video, this.x, this.y, this.w, this.h);

        this.ctx.globalCompositeOperation = oldOperation;
    }

    drawRandomNoise() {
        if (Math.random() > 0.5) {
            return;
        }

        const randH = 20, randW = this.w;
        const randIndentY = 20 * (2 * Math.random() - 1);

        const randY = (this.h - randH) * Math.random();
        const imageData = this.ctx.getImageData(0, randY, randW, randH);
        this.ctx.putImageData(imageData, 0, randY + randIndentY);
    }

    drawCurrentCharge() {
        const w = 100, h = 20;
        const x = 0.03 * this.w, y = x;

        const status = (this.charge - this.workTime) / this.charge;

        if (status < 0) {
            this.stop();
        }

        this.setColorByCondition('fillStyle', 1 - status, 0.3, 0.7);

        if (status < 0.3) {
            const diff = this.workTime - this.prevTime;

            if (diff < 500) {
                return;
            } else if (diff > 1500){
                this.prevTime = this.workTime;
            }
        }

        this.ctx.fillRect(x, y, status * w, h);

        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, w, h);
    }

    drawDiagram() {
        const w = 0.5 * this.w, h = 0.2 * this.h;
        let x = 0.5 * this.w - 0.5 * w;
        let y = this.h - 0.1 * this.h - h;

        const bufferLength = this.analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);

        this.analyser.getByteTimeDomainData(data);

        this.ctx.lineWidth = 2;

        this.ctx.beginPath();

        const maxValue = Math.max(...data);
        const stepX = w / bufferLength;
        const scaleY = h / maxValue;

        for (let i = 0; i < bufferLength; i++) {
            const y0 = y + data[i] * scaleY;
            const x0 = x;

            const status = data[i] / maxValue;

            this.setColorByCondition('strokeStyle', 1 - status, 0.1, 0.3);

            if (i === 0) {
                this.ctx.moveTo(x0, y0);
            } else {
                this.ctx.lineTo(x0, y0);
            }

            x += stepX;
        }

        this.ctx.stroke();
    }

    drawVolume() {
        const w = 0.05 * this.w, h = 0.4 * this.h;
        let x = 0.03 * this.w;
        let y = this.h - 0.1 * this.h;

        const bufferLength = this.analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(data);

        const volume = data.reduce((sum, value) => sum + value, 0) / (bufferLength * 128);

        this.setColorByCondition('fillStyle', volume, 0.4, 0.7);

        this.ctx.fillRect(x, y - h * volume, w, h * volume);

        this.x = 30 * volume * Math.random();
        this.y = 30 * volume * Math.random();
    }

    drawText() {
        const x = 0.8 * this.w, y = 0;
        const font = (this.h - y) / this.countMaxSrt;

        this.ctx.font = `bold ${font}px sans-serif`;
        this.ctx.fillStyle = "#FFF";

        for (let i = 0; i < this.currentStr; i++) {
            this.ctx.fillText(this.text[i], x, y + i * font);
        }

        this.currentStr = this.currentStr > this.countMaxSrt ? 0 : this.currentStr += 1;
    }

    setColorByCondition(key, value, a, b) {
        if (value > b) {
            this.ctx[key] = 'red';
        } else if (value < a) {
            this.ctx[key] = 'green';
        } else {
            this.ctx[key] = 'orange';
        }
    }
}


window.onload = () => {
    const video = document.getElementById('video');

    const canvas = document.getElementById('canvas');
    const h = canvas.height = screen.height;
    const w = canvas.width = screen.width;
    const context = canvas.getContext('2d');

    const audioContext = new AudioContext();
    const button = document.getElementsByClassName('activate')[0];
    const divEnd = document.getElementsByClassName('end')[0];

    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => {
            video.srcObject = stream;
            const audio = audioContext.createMediaStreamSource(stream);

            const robot = new Robot(video, context, audio, audioContext, w, h, end);

            button.onclick = () => {
                start();
                robot.start();
            };
        });

    function start() {
        document.body.classList.add('active');
        button.classList.add('hide');
    }

    function end() {
        document.body.classList.remove('active');
        divEnd.classList.remove('hide');
    }
};



