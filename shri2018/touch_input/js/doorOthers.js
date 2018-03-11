// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия второй двери здесь ====

    var gearsArea = this.popup.querySelector('.gears-area');

    var widthGearArea = gearsArea.offsetWidth;
    var heightGearArea = gearsArea.offsetHeight;
    var xGearArea = gearsArea.getBoundingClientRect().x;
    var yGearArea = gearsArea.getBoundingClientRect().y;

    var blueArea = {
        up: yGearArea,
        right: xGearArea + 0.5 * widthGearArea,
        down: yGearArea + 0.5 * heightGearArea,
        left: xGearArea
    };

    var greenArea = {
        up: yGearArea + 0.5 * heightGearArea,
        right: xGearArea + 0.75 * widthGearArea,
        down: yGearArea + heightGearArea,
        left: xGearArea + 0.25 * widthGearArea
    };

    var redArea = {
        up: yGearArea,
        right: xGearArea + widthGearArea,
        down: yGearArea + 0.5 * heightGearArea,
        left: xGearArea + 0.5 * widthGearArea
    };

    gearsArea = [blueArea, greenArea, redArea];

    var gears = [
        this.popup.querySelector('.gear__blue'),
        this.popup.querySelector('.gear__green'),
        this.popup.querySelector('.gear__red')
    ];

    var initialPositions = gears.map(function (gear) {
        return {
            x: parseFloat(getComputedStyle(gear).left),
            y: parseFloat(getComputedStyle(gear).top)
        }
    });

    gears.forEach(function (gear) {
        gear.addEventListener('pointermove', _moveGear.bind(this));
        gear.addEventListener('pointerup', _release.bind(this));
    }.bind(this));


    function _release(e) {
        gears.forEach(function (gear, index) {
            gear.style.left = initialPositions[index].x + 'px';
            gear.style.top = initialPositions[index].y + 'px';
        });
    }

    function _moveGear(e) {
        var gear = e.target;

        gear.style.position = 'absolute';
        gear.style.left = e.x + 'px';
        gear.style.top = e.y + 'px';

        checkCorrect.apply(this);
    }

    function checkCorrect() {
        var isCorrect = true;

        for (var i = 0; i < gears.length; i++) {
            var x = gears[i].getBoundingClientRect().x + 0.5 * gears[i].offsetWidth;
            var y = gears[i].getBoundingClientRect().y + 0.5 * gears[i].offsetHeight;
            var area = gearsArea[i];

            var flag1 = x > area.left && x < area.right;
            var flag2 = y > area.up && y < area.down;

            isCorrect = flag1 && flag2;

            if (!isCorrect) { break; }
        }

        if (isCorrect) {
            this.unlock();
        }
    }

    // ==== END Напишите свой код для открытия второй двери здесь ====
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия третей двери здесь ====
    var balls = Array.from(this.popup.querySelectorAll('.ball')).map(function (ball) {
        var R = 0.5 * ball.offsetWidth;

        return {
            el: ball,
            x: ball.getBoundingClientRect().x + R,
            y: ball.getBoundingClientRect().y + R,
            R: R,
            speedX: 0,
            speedY: 0,
            move: function () {
                this.x += this.speedX;
                this.y += this.speedY;

                this.el.style.left = this.x - this.R + 'px';
                this.el.style.top = this.y - this.R + 'px';
            },
            bounce: function () {
                this.speedX = -this.speedX;
                this.speedY = -this.speedY;
            }
        }
    });

    var initialPositions = balls.map(function (ball) {
        return {
            x: ball.x - ball.R,
            y: ball.y - ball.R
        }
    });

    var start = this.popup.querySelector('.start');
    var timer = this.popup.querySelector('.timer');

    start.addEventListener('click', function () {
        _allRemovePlayers.call(this);
        startTimer.call(this, 10);

        balls.forEach(function (ball, index) {
            ball.x = initialPositions[index].x;
            ball.y = initialPositions[index].y;
            _startBall.call(this, ball);
        }.bind(this));
    }.bind(this));

    this.popup.addEventListener('pointerdown', _createPlayer.bind(this));
    this.popup.addEventListener('pointermove', _movePlayer.bind(this));
    this.popup.addEventListener('pointerup', _removePlayer.bind(this));

    this.maxPlayer = 4;
    this.players = [];

    function _createPlayer(e) {
        var w = screen.width;
        var h = screen.height;

        var k1 = w / h, b1 = 0;   // Коэффициенты уравнений прямых
        var k2 = -w / h, b2 = w;

        var x = e.x;
        var y = e.y;

        var x1 = k1 * y + b1, x2 = k2 * y + b2;

        var player = document.createElement('div');
        player.classList.add('player');
        player.style.left = x + 'px';
        player.style.top = y + 'px';

        if (x < x1 && x < x2) {
            player.classList.add('player__left');
        } else if (x < x1 && x > x2) {
            player.classList.add('player__down');
        } else if (x > x1 && x < x2) {
            player.classList.add('player__up');
        } else {
            player.classList.add('player__right');
        }

        if (this.players.length < this.maxPlayer) {
            this.players.push({
                el: player,
                pointerId: e.pointerId,
                x: x,
                y: y,
                R: 25,
                move: function (x, y) {
                    this.x = x;
                    this.y = y;

                    this.el.style.left = x + 'px';
                    this.el.style.top = y + 'px';
                }
            });

            this.popup.appendChild(player);
        }
    }

    function _movePlayer(e) {
        var player = this.players.find(function (p) {
            return p.pointerId === e.pointerId;
        });

        if (player) {
            player.move(e.x, e.y);
        }
    }

    function _removePlayer(e) {
        this.players = this.players.filter(function (player) {
            if (player.pointerId === e.pointerId) {
                this.popup.removeChild(player.el);
                return false;
            }
            return true;
        }.bind(this));
    }

    function _allRemovePlayers() {
        if (!this.players) {
            this.players = [];
            return;
        }

        this.players.forEach(function (player) {
            this.popup.removeChild(player.el);
        }.bind(this));

        this.players = [];
    }

    function _startBall(ball) {
        var angle = 2 * Math.PI * Math.random();

        ball.speedX = 1.0 * Math.cos(angle);
        ball.speedY = 1.0 * Math.sin(angle);

        ball.timerId = setInterval(function () {
            ball.move();
            checkPlayer.call(this, ball);
            checkBall.call(this, ball);
        }.bind(this), 1000 / 60);
    }

    function checkPlayer(ball) {
        this.players.forEach(function (player) {
            if (calculateDistance(player, ball) < ball.R + player.R) {
                ball.bounce();
            }
        })
    }

    function checkBall(ball) {
        for (var i = 0; i < balls.length; i++) {
            var ball2 = balls[i];
            if (ball !== ball2 && calculateDistance(ball, ball2) < 2 * ball.R) {
                ball.bounce();
                ball2.bounce();
            }

            if (ball.x < 0 || ball.y < 0 || ball.x > screen.width || ball.y > screen.height) {
                gameOver.call(this);
                break;
            }
        }
    }

    function calculateDistance(obj1, obj2) {
        return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
    }

    function startTimer(seconds) {
        if (seconds === -1) {
            this.unlock();
            stopTimer.call(this);
            return;
        }

        start.classList.add('hidden');

        timer.innerHTML = (seconds < 10 ? '00:0' + seconds : '00:' + seconds);
        timer.classList.remove('hidden');

        this.timerId = setTimeout(startTimer.bind(this), 1000, seconds - 1);
    }

    function stopTimer() {
        timer.classList.add('hidden');
        start.classList.remove('hidden');

        clearTimeout(this.timerId);
        balls.forEach(function (ball) {
            clearInterval(ball.timerId);
        })
    }

    function gameOver() {
        stopTimer.call(this);
        alert('Game over');
    }

    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====

    var key = this.popup.querySelector('.key');

    key.addEventListener('pointerdown', _captureKey.bind(this));
    key.addEventListener('pointermove', _moveKey.bind(this));
    key.addEventListener('pointerup', _releaseKey.bind(this));

    this.pointers = [];

    function _captureKey(e) {
        if (this.pointers.length < 2) {
            this.pointers.push({
                x: e.x,
                y: e.y,
                pointerId: e.pointerId
            })
        }
    }

    function _moveKey(e) {
        if (this.pointers.length === 1) {
            this.pointers[0].x = e.x;
            this.pointers[0].y = e.y;

            key.style.left = e.x + 'px';
            key.style.top = e.y + 'px';

            return;
        }

        if (this.pointers.length === 2) {
            var currentPointer = this.pointers.find(function (pointer) {
                return pointer.pointerId === e.pointerId;
            });

            var otherPointer = this.pointers.find(function (pointer) {
                return pointer.pointerId !== e.pointerId;
            });

            if (!currentPointer || !otherPointer) {
                return;
            }

            var deltaX = e.x - currentPointer.x;
            var deltaY = e.y - currentPointer.y;

            var R = calculateDistance(currentPointer, otherPointer);
            var deltaR = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

            var angle = 180 * Math.atan(deltaR / R) / Math.PI;

            if (currentPointer.x > otherPointer.x) {
                angle = deltaY < 0 ? -angle : angle;
            } else {
                angle = deltaY < 0 ? angle : -angle;
            }

            key.style.transform = 'translate(-50%, -50%) scale(4) rotate(' + angle + 'deg)';

            checkAngle.call(this, angle);
        }
    }

    function _releaseKey(e) {
        this.pointers = this.pointers.filter(function (pointer) {
            return pointer.pointerId !== e.pointerId;
        }.bind(this));
    }

    function checkAngle(angle) {
        if (Math.abs(angle) > 70) {
            this.unlock();
        }
    }

    function calculateDistance(obj1, obj2) {
        return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
    }

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
