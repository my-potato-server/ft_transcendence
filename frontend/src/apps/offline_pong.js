// src/apps/offline_pong.js

export default function OfflinePong(canvasID) {

    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let gameState = 'playing'; // 게임 상태 ('playing', 'ended')
    let winner = null;
    let leftScore = 0;
    let rightScore = 0;
    // Canvas 크기 설정
    canvas.width = 1280;
    canvas.height = 720;

    // 공의 상태 정의
    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 4,
        velocityX: 4 * (Math.random() > 0.5 ? 1 : -1),
        velocityY: 4 * (Math.random() > 0.5 ? 1 : -1),
        scoreLeft: 0,
        scoreRight: 0
    };

    // 패들 위치 및 속도 정의
    const paddleHeight = 60;
    const paddleWidth = 10;
    const paddleSpeed = 4;
    let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

    // 키보드 입력 상태 추적
    let keysPressed = {};

    const keydownHandler = (event) => {
        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault(); // 화살표 키에 대한 기본 동작을 방지
        }
        keysPressed[event.key] = true;

        if (event.key === 'Enter' && gameState === 'ended') {
            resetGame();
        }
    };

    const keyupHandler = (event) => {
        delete keysPressed[event.key];
    };

    document.addEventListener('keydown', keydownHandler);
    document.addEventListener('keyup', keyupHandler);

    function showWinner() {
        ctx.font = '48px Arial';
        ctx.fillStyle = '#FFF';
        ctx.fillText(`${winner} player Win! (${leftScore} : ${rightScore})`, canvas.width / 2 - 200, canvas.height / 2 - 50);
        ctx.fillText("Press Enter to replay", canvas.width / 2 - 250, canvas.height / 2 + 50);
    }

    function resetGame() {
        gameState = 'playing';
        ball.scoreLeft = 0;
        ball.scoreRight = 0;
        resetBall();
        gameLoop();
    }

    //
    // 공 그리기
    //

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.closePath();
    }

    function moveBall() {
        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // 상단 및 하단 벽과의 충돌
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.velocityY = -ball.velocityY;
        }

        // 패들과의 충돌 감지
        // 왼쪽 패들
        if (ball.x - ball.radius < 20 + paddleWidth && ball.y > leftPaddleY && ball.y < leftPaddleY + paddleHeight) {
            ball.velocityX = -ball.velocityX;
        }

        // 오른쪽 패들
        if (ball.x + ball.radius > canvas.width - 20 - paddleWidth && ball.y > rightPaddleY && ball.y < rightPaddleY + paddleHeight) {
            ball.velocityX = -ball.velocityX;
        }

        // 왼쪽 또는 오른쪽 벽과의 충돌 (점수 계산)
        if (ball.x + ball.radius > canvas.width) {
            ball.scoreLeft++; // 왼쪽 플레이어 점수 증가
            resetBall();
        } else if (ball.x - ball.radius < 0) {
            ball.scoreRight++; // 오른쪽 플레이어 점수 증가
            resetBall();
        }
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velocityX = 4 * (Math.random() > 0.5 ? 1 : -1);
        ball.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }

    //
    // 패들 그리기
    //

    function movePaddles() {
        if (keysPressed['w'] || keysPressed['a']) {
            leftPaddleY = Math.max(leftPaddleY - paddleSpeed, 0);
        }
        if (keysPressed['s'] || keysPressed['d']) {
            leftPaddleY = Math.min(leftPaddleY + paddleSpeed, canvas.height - paddleHeight);
        }
        if (keysPressed['ArrowUp'] || keysPressed['ArrowLeft']) {
            rightPaddleY = Math.max(rightPaddleY - paddleSpeed, 0);
        }
        if (keysPressed['ArrowDown'] || keysPressed['ArrowRight']) {
            rightPaddleY = Math.min(rightPaddleY + paddleSpeed, canvas.height - paddleHeight);
        }
    }

    //
    // Pong 게임의 기본 구성 요소 그리기
    //

    function draw() {
        // 배경 색상 설정
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 중앙 네트 그리기
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = '#FFF';
        ctx.stroke();

        // 볼 그리기
        drawBall();

        // 점수판 그리기
        ctx.font = '48px Arial';
        ctx.fillText(ball.scoreLeft, canvas.width / 4, 50);
        ctx.fillText(ball.scoreRight, 3 * canvas.width / 4, 50);

        // 패들 그리기 (위치 업데이트 반영)
        ctx.fillStyle = '#F00';
        ctx.fillRect(20, leftPaddleY, paddleWidth, paddleHeight); // 왼쪽 패들
        ctx.fillStyle = '#00F';
        ctx.fillRect(canvas.width - 30, rightPaddleY, paddleWidth, paddleHeight); // 오른쪽 패들
    }

    // 게임 루프
    function gameLoop() {
        if (gameState === 'playing') {
            moveBall();
            movePaddles();
            draw();
            if ((ball.scoreLeft === 5 || ball.scoreRight === 5) && gameState === 'playing') {
                gameState = 'ended';
                winner = ball.scoreLeft === 5 ? "Left" : "Right";
                winner === "Left" ? leftScore++ : rightScore++;
                resetBall();
            }
        }

        if (gameState === 'ended') {
            showWinner();
        }

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function stop() {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
    }
    // 게임 시작
    gameLoop();

    return {stop: stop};
}