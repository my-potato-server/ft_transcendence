// src/apps/matching.js

class GameCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.elements = []; // 캔버스에 그릴 요소들
    }

    // 기본 렌더링 함수
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 캔버스에 요소들을 그립니다.
        this.elements.forEach(element => element.draw(this.ctx));
    }

    // 캔버스에 요소 추가
    addElement(element) {
        this.elements.push(element);
        this.render();
    }

    // 캔버스에서 요소 제거
    removeElement(element) {
        this.elements = this.elements.filter(el => el !== element);
        this.render();
    }
}
class CanvasText {
    constructor(x, y, text) {
        this.x = x;
        this.y = y;
        this.text = text;
    }

    draw(ctx) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x, this.y);
    }
}

class CanvasButton {
    constructor(x, y, width, height, text, onClick) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
    }

    draw(ctx) {
        // 버튼
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // 텍스트
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x + 10, this.y + this.height / 2);
    }

    isClicked(x, y) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
    }
}

const gameCanvas = new GameCanvas('gameCanvas');

// 닉네임 입력란 추가
gameCanvas.addElement(new CanvasText(100, 50, 'Your Nickname'));
// ... 추가적인 입력 필드 및 버튼 구현

// '온라인 매칭' 섹션 추가
gameCanvas.addElement(new CanvasText(100, 100, 'Online Matching'));
// ... 방 목록 및 버튼 구현

// 방 입장 시 유저 목록 및 체크 표시 구현
// ... 방 입장 로직 및 UI 구현


gameCanvas.canvas.addEventListener('click', function(event) {
    const rect = gameCanvas.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    gameCanvas.elements.forEach(element => {
        if (element instanceof CanvasButton && element.isClicked(x, y)) {
            element.onClick();
        }
    });
});
