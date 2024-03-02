export default function OfflinePong(canvasID) {

    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');


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

    function drawPaddles(ctx, centerX, centerY, sideLength) {

        ctx.fillStyle = 'Blue';

        // 상단 패들 (팔각형 변으로부터 20픽셀 떨어진 위치에 배치)
        ctx.fillRect(centerX - paddleLength / 2, centerY - sideLength / Math.sqrt(2) + diagonalOffset - paddleWidth, paddleLength, paddleWidth);
        // 하단 패들
        ctx.fillRect(centerX - paddleLength / 2, centerY + sideLength / Math.sqrt(2) - diagonalOffset, paddleLength, paddleWidth);
        // 왼쪽 패들
        ctx.fillRect(centerX - sideLength / Math.sqrt(2) + diagonalOffset - paddleWidth, centerY - paddleLength / 2, paddleWidth, paddleLength);
        // 오른쪽 패들
        ctx.fillRect(centerX + sideLength / Math.sqrt(2) - diagonalOffset, centerY - paddleLength / 2, paddleWidth, paddleLength);
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
        if (keyPressed['q'])
            offseta = Math.max(offseta - paddleSpeed, -paddleWidth / 2);
        if (keyPressed['a'])
            offseta = Math.min(offseta + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keyPressed['e'])
            offsetb = Math.max(offsetb - paddleSpeed, -paddleWidth / 2);
        if (keyPressed['d'])
            offsetb = Math.min(offsetb + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keyPressed['t'])
            offsetc = Math.max(offsetc - paddleSpeed, -paddleWidth / 2);
        if (keyPressed['g'])
            offsetc = Math.min(offsetc + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
        if (keyPressed['i'])
            offsetd = Math.max(offsetd - paddleSpeed, -paddleWidth / 2);
        if (keyPressed['k'])
            offsetd = Math.min(offsetd + paddleSpeed, canvas.width / 2 - paddleWidth / 2);
    }

    drawOctagonArena(ctx, centerX, centerY, sideLength);
    drawPaddles(ctx, centerX, centerY, sideLength);
}