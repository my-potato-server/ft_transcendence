export default function OfflinePong(canvasID) {

    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        speed: 4,
        velocityX: 4 * (Math.random() > 0.5 ? 1 : -1),
        velocityY: 4 * (Math.random() > 0.5 ? 1 : -1),
        scoreLeft: 0,
        scoreRight: 0,
        scoreTop: 0,
        scoreBottom: 0
    };

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
        ball.scoreTop = 0;
        ball.scoreBottom = 0;
        resetBall();
        gameLoop();
    }

    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velocityX = 4 * (Math.random() > 0.5 ? 1 : -1);
        ball.velocityY = 4 * (Math.random() > 0.5 ? 1 : -1);
    }

    function drawOctagonArena(ctx, centerX, centerY, sideLength) {
        ctx.fillStyle = 'Black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const angle = Math.PI / 4; // 45도 (팔각형의 각도)
        ctx.strokeStyle = 'White';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            // 각 꼭지점의 x, y 좌표를 계산
            const x = centerX + sideLength * Math.cos(angle * i + Math.PI / 8);
            const y = centerY + sideLength * Math.sin(angle * i + Math.PI / 8);
            if (i === 0) {
                ctx.moveTo(x, y); // 시작점
            } else {
                ctx.lineTo(x, y); // 다음 꼭지점으로 선을 그림
            }
        }
        ctx.closePath(); // 팔각형의 시작점과 끝점을 연결
        ctx.stroke(); // 팔각형의 윤곽을 그림
    }

    function drawPaddles() {

        ctx.fillStyle = 'Blue';

        // 상단 패들 (팔각형 변으로부터 20픽셀 떨어진 위치에 배치)
        ctx.fillRect(paddleAx, PaddleAy - offseta, paddleLength, paddleWidth);
        // 하단 패들
        ctx.fillRect(paddleBx, paddleBy - offsetb, paddleLength, paddleWidth);
        // 왼쪽 패들
        ctx.fillRect(paddleCx - offsetc, paddleCy, paddleWidth, paddleLength);
        // 오른쪽 패들
        ctx.fillRect(paddleDx - offsetd, paddleDy, paddleWidth, paddleLength);
    }

    // 캔버스의 중앙을 계산
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // 팔각형 한 변의 길이
    const sideLength = 350; // 원하는 길이로 조정 가능
    const paddleLength = sideLength / 3; // 패들 길이를 팔각형 한 변의 1/3로 설정
    const paddleSpeed = 10; // 패들의 이동 속도
    const paddleWidth = 10;
    const offset = -50; // 팔각형 변으로부터의 패들 위치 오프셋
    const diagonalOffset = offset; // 대각선 방향으로의 오프셋
    const paddleAx = centerX - paddleLength / 2;
    const PaddleAy = centerY - sideLength / Math.sqrt(2) + diagonalOffset - paddleWidth;
    const paddleBx = centerX - paddleLength / 2;
    const paddleBy = centerY + sideLength / Math.sqrt(2) - diagonalOffset;
    const paddleCx = centerX - sideLength / Math.sqrt(2) + diagonalOffset - paddleWidth;
    const paddleCy = centerY - paddleLength / 2;
    const paddleDx = centerX + sideLength / Math.sqrt(2) - diagonalOffset;
    const paddleDy = centerY - paddleLength / 2;
    let offseta = 0;
    let offsetb = 0;
    let offsetc = 0;
    let offsetd = 0;

    function movePaddles() {
        // 상 하 좌 우 각 패들 움직임
        if (keysPressed['q'])
            offseta = Math.max(offseta - paddleSpeed, -paddleWidth / 2);
        if (keysPressed['a'])
            offseta = Math.min(offseta + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keysPressed['e'])
            offsetb = Math.max(offsetb - paddleSpeed, -paddleWidth / 2);
        if (keysPressed['d'])
            offsetb = Math.min(offsetb + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keysPressed['t'])
            offsetc = Math.max(offsetc - paddleSpeed, -paddleWidth / 2);
        if (keysPressed['g'])
            offsetc = Math.min(offsetc + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keysPressed['i'])
            offsetd = Math.max(offsetd - paddleSpeed, -paddleWidth / 2);
        if (keysPressed['k'])
            offsetd = Math.min(offsetd + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawOctagonArena(ctx, centerX, centerY, sideLength);
        drawBall();
        ctx.font = '48px Arial';
        ctx.fillText(ball.scoreLeft, canvas.width / 4, 50);
        ctx.fillText(ball.scoreRight, 3 * canvas.width / 4, 50);
        ctx.fillText(ball.scoreTop, canvas.width / 2, 50);
        ctx.fillText(ball.scoreBottom, canvas.width / 2, canvas.height - 50);
        drawPaddles();
    }

    function gameLoop() {
        movePaddles();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function stop() {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('keyup', keyupHandler);
    }
    gameLoop();

    return {stop: stop};
}