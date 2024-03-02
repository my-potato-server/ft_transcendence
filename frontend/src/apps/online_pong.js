// src/apps/online_pong.js

export default function OnlinePong(canvasID) {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 4,
        velocityX: 4 * (Math.random() < 0.5 ? 1 : -1),
        velocityY: 4 * (Math.random() < 0.5 ? 1 : -1),
        scoreLeft: 0,
        scoreRight: 0,
        color: 'WHITE'
    };

    var data = {
        ball_position: {
            x: 640,
            y: 360
        }
    };

    let thisPlayer = 0;
    let gameover = false;
    let winner = 0;
    const paddleHeight = 60;
    const paddleWidth = 10;
    const paddleSpeed = 4;
    let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

    let keysPressed = {};

    const socket = new WebSocket('wss://localhost/ws/ovopong/');

    socket.onopen = function (e) {
        console.log('Connection established!');
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data) {
            updateGameScreen(data);
        }
    };

    socket.onerror = function(error) {
        console.error('WebSocket Error:', error);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(function() {
            socket = new WebSocket('wss://localhost:443/ws/ovopong/');

            socket.onopen = function (e) {
                console.log('Connection re-established!');
            };

            socket.onmessage = function (event) {
                const data = JSON.parse(event.data);
                if (data) {
                    updateGameScreen(data);
                }
            };

            socket.onerror = function(error) {
                console.error('WebSocket Error:', error);
            };
        }, 1000); // 1초마다 재시도
    };

    

    document.addEventListener('keydown', keydownHandler);

    function sendloop() {
        socket.send(JSON.stringify({
            action: 'none',
            key: 'none',
            player: thisPlayer,
            left_paddle_y: leftPaddleY,
            right_paddle_y: rightPaddleY,
            ball_position: {
                x: ball.x,
                y: ball.y
            },
            left_player_score: ball.scoreLeft,
            right_player_score: ball.scoreRight,
            game_over: gameover,
            winner: winner
        }));
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        if (gameover == true) {
            if (winner == 1) {
                ctx.fillStyle = 'WHITE';
                ctx.font = '48px serif';
                ctx.fillText('Player 1 Win!', canvas.width / 2 - 100, canvas.height / 2);
            }
            else if (winner == 2) {
                ctx.fillStyle = 'WHITE';
                ctx.font = '48px serif';
                ctx.fillText('Player 2 Win!', canvas.width / 2 - 100, canvas.height / 2);
            }
            return;
        }

        ctx.fillStyle = 'BLACK';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = 'WHITE';
        ctx.lineWidth = 5;
        ctx.stroke();

        drawBall();

        ctx.font = '48px serif';
        ctx.fillText(ball.scoreLeft, canvas.width / 2 - 30, 50);
        ctx.fillText(ball.scoreRight, canvas.width / 2 + 30, 50);

        ctx.fillStyle = 'WHITE';
        ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    }

    function updateGameScreen(data) {
        console.log(data);
        if (data.game_status ==  'start') {
            leftPaddleY = data.left_paddle_y;
            rightPaddleY = data.right_paddle_y;
            ball.x = data.ball_position.x;
            ball.y = data.ball_position.y;
            ball.scoreLeft = data.left_player_score;
            ball.scoreRight = data.right_player_score;
            gameover = data.game_over;
            winner = data.winner;
            draw();
        } else if (data.game_status == 'waiting') {
            thisPlayer = data.player;
            setInterval(sendloop, 1000 / 60);
        } else {
            console.log('error');
        }
    };

    function stop() {
        socket.close();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keypress', keypressHandler);
    }

    return stop;
}