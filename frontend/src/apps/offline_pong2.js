// src/apps/offline_pong2.js

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
        speed: 2,
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

    let leftPaddleX = canvas.width * (0.1) / 2 ;
    let rightPaddleX = canvas.width* (2 - 0.1) / 2;

    let leftPaddleY2 = canvas.height * (1) / 2 - paddleHeight / 2;
    let rightPaddleY2 = canvas.height * (1) / 2 - paddleHeight / 2; 
    
    let leftPaddleX2 = canvas.width * (0.4) / 2;
    let rightPaddleX2 = canvas.width * (2 - 0.4) / 2; 

    // 키보드 입력 상태 추적
    let keysPressed = {};

    const keydownHandler = (event) => {
        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
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
        if ((leftPaddleX - paddleWidth * 1/2 < ball.x && ball.x < leftPaddleX + paddleWidth * 1/2 ) && (ball.y > leftPaddleY && ball.y < leftPaddleY + paddleHeight)) {
            ball.velocityX = -ball.velocityX;
        }

        // 오른쪽 패들
        if ((rightPaddleX - paddleWidth * 1/2 < ball.x && ball.x < rightPaddleX + paddleWidth * 1/2 ) && (ball.y > rightPaddleY && ball.y < rightPaddleY + paddleHeight)) {
            ball.velocityX = -ball.velocityX;
        }

        // 왼쪽 패들2
        if ((leftPaddleX2 - paddleWidth * 1/2 < ball.x && ball.x < leftPaddleX2 + paddleWidth * 1/2 ) && (ball.y > leftPaddleY2 && ball.y < leftPaddleY2 + paddleHeight)) {
            ball.velocityX = -ball.velocityX;
        }

        // 오른쪽 패들2
        if ((rightPaddleX2 - paddleWidth * 1/2 < ball.x && ball.x < rightPaddleX2 + paddleWidth * 1/2 ) && (ball.y > rightPaddleY2 && ball.y < rightPaddleY2 + paddleHeight)) {
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
    // 왼쪽 패들 상하 움직임
    if (keysPressed['w'] ) {
        leftPaddleY = Math.max(leftPaddleY - paddleSpeed, 0);
    }
    if (keysPressed['s'] ) {
        leftPaddleY = Math.min(leftPaddleY + paddleSpeed, canvas.height - paddleHeight);
    }

    // // 왼쪽 패들 좌우 움직임
    // if (keysPressed['a']) { // 'q' 키를 왼쪽으로 움직이는 데 사용
    //     leftPaddleX = Math.max(leftPaddleX - paddleSpeed, -paddleWidth/2);
    // }
    // if (keysPressed['d']) { // 'e' 키를 오른쪽으로 움직이는 데 사용
    //     leftPaddleX = Math.min(leftPaddleX + paddleSpeed, canvas.width/2 - paddleWidth/2);
    // }

    // 왼쪽2 패들 상하 움직임
    if (keysPressed['r'] ) {
        leftPaddleY2 = Math.max(leftPaddleY2 - paddleSpeed, 0);
    }
    if (keysPressed['f'] ) {
        leftPaddleY2 = Math.min(leftPaddleY2 + paddleSpeed, canvas.height - paddleHeight);
    }

    // // 왼쪽2 패들 좌우 움직임
    // if (keysPressed['f']) { // 'q' 키를 왼쪽으로 움직이는 데 사용
    //     leftPaddleX = Math.max(leftPaddleX - paddleSpeed, -paddleWidth/2);
    // }
    // if (keysPressed['h']) { // 'e' 키를 오른쪽으로 움직이는 데 사용
    //     leftPaddleX = Math.min(leftPaddleX + paddleSpeed, canvas.width/2 - paddleWidth/2);
    // }


    // 오른쪽 패들2 상하 움직임
    if (keysPressed['i']) {
        rightPaddleY2 = Math.max(rightPaddleY2 - paddleSpeed, 0);
    }
    if (keysPressed['k']) {
        rightPaddleY2 = Math.min(rightPaddleY2 + paddleSpeed, canvas.height - paddleHeight);
    }

    // 오른쪽 패들 상하 움직임
    if (keysPressed['ArrowUp']) {
        rightPaddleY = Math.max(rightPaddleY - paddleSpeed, 0);
    }
    if (keysPressed['ArrowDown']) {
        rightPaddleY = Math.min(rightPaddleY + paddleSpeed, canvas.height - paddleHeight);
    }

    

    // // 오른쪽 패들 좌우 움직임
    // if (keysPressed['ArrowLeft']) { // 화살표 왼쪽 키를 왼쪽으로 움직이는 데 사용
    //     rightPaddleX = Math.max(rightPaddleX - paddleSpeed, canvas.width/2 - paddleWidth/2);
    // }
    // if (keysPressed['ArrowRight']) { // 화살표 오른쪽 키를 오른쪽으로 움직이는 데 사용
    //     rightPaddleX = Math.min(rightPaddleX + paddleSpeed, canvas.width - paddleWidth/2);
    // }
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

    //     // 패들 그리기 (위치 업데이트 반영)
    //     ctx.fillStyle = '#F00';
    //     ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight); // 왼쪽 패들
    //     ctx.fillStyle = '#00F';
    //     ctx.fillRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight); // 오른쪽 패들

    //     // 패들 그리기 (위치 업데이트 반영)
    //     ctx.fillStyle = '#F00';
    //     ctx.fillRect(leftPaddleX2, leftPaddleY2, paddleWidth, paddleHeight); // 왼쪽 패들
    //     ctx.fillStyle = '#00F';
    //     ctx.fillRect(rightPaddleX2, rightPaddleY2, paddleWidth, paddleHeight); // 오른쪽 패들
    // 


        // 첫 번째 팀 (녹색 계열)
        // 밝은 명도, 약간 낮은 채도를 가진 색상
        ctx.fillStyle = 'hsl(120, 70%, 75%)'; // 밝은 녹색
        ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight); // 왼쪽 패들
        ctx.fillStyle = 'hsl(130, 70%, 75%)'; // 조금 다른 밝은 녹색
        ctx.fillRect(leftPaddleX2, leftPaddleY2, paddleWidth, paddleHeight); // 왼쪽 패들

        // 두 번째 팀 (파란색 계열)
        // 밝은 명도, 약간 낮은 채도를 가진 색상
        ctx.fillStyle = 'hsl(240, 70%, 75%)'; // 밝은 파란색
        ctx.fillRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight); // 오른쪽 패들
        ctx.fillStyle = 'hsl(250, 70%, 75%)'; // 조금 다른 밝은 파란색
        ctx.fillRect(rightPaddleX2, rightPaddleY2, paddleWidth, paddleHeight); // 오른쪽 패들


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
