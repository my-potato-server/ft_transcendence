// src/apps/online.js

export default function OnlinePong(canvasID) {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');

    let socket = new WebSocket("ws://yourserveraddress/game");

    socket.onopen = function(e) {
        console.log("Connection established");
        // 여기서 필요한 초기 설정을 수행할 수 있습니다.
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        // 서버로부터 메시지를 받으면 여기에서 처리
        handleServerMessage(data);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // 예를 들어 프로세스가 죽거나 네트워크가 다운된 경우
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
}

function handleServerMessage(data) {
    switch(data.type) {
        case 'gameState':
            updateGameState(data.gameState);
            break;
        case 'error':
            console.error(data.message);
            break;
        // 다른 메시지 유형에 대한 처리
    }
}

function updateGameState(gameState) {
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 공 그리기
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(gameState.ball_position[0], gameState.ball_position[1], 10, 0, Math.PI*2);
    ctx.fill();

    // 패들 그리기
    ctx.fillStyle = 'blue';
    ctx.fillRect(20, gameState.paddle1_position[1], 10, 100); // 패들1
    ctx.fillRect(canvas.width - 30, gameState.paddle2_position[1], 10, 100); // 패들2

    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '32px Arial';
    ctx.fillText(`${gameState.score1} - ${gameState.score2}`, canvas.width / 2 - 50, 50);

    if (gameState.game_over) {
        console.log("Game Over");
        // 게임 오버 처리
    }
}

document.addEventListener('keydown', (event) => {
    let cmd = {};
    switch(event.key) {
        case 'ArrowUp':
            cmd = { action: 'move', direction: 'up' };
            break;
        case 'ArrowDown':
            cmd = { action: 'move', direction: 'down' };
            break;
        // 다른 키 입력 처리
    }
    if (cmd.action) {
        socket.send(JSON.stringify(cmd));
    }
});

async function createAndEnterRoom(roomName, password = null) {
    const createRoomResponse = await sendCommandToServer('matchserver.create_room', {name: roomName, password});
    if (createRoomResponse.status === 'OK') {
        console.log('Room created successfully', createRoomResponse);
        const enterRoomResponse = await sendCommandToServer('matchserver.enter_room', {room_id: createRoomResponse.data.room_id});
        if (enterRoomResponse.status === 'OK') {
            console.log('Entered the room successfully', enterRoomResponse);
        } else {
            console.error('Error entering room', enterRoomResponse);
        }
    } else {
        console.error('Error creating room', createRoomResponse);
    }
}

async function listRooms() {
    const listRoomResponse = await sendCommandToServer('matchserver.list_room');
    if (listRoomResponse.status === 'OK') {
        console.log('List of rooms:', listRoomResponse.data);
        // 로비 목록을 사용자에게 표시
    } else {
        console.error('Error listing rooms', listRoomResponse);
    }
}

async function deleteRoom(roomId) {
    const deleteRoomResponse = await sendCommandToServer('matchserver.delete_room', {room_id: roomId});
    if (deleteRoomResponse.status === 'OK') {
        console.log('Room deleted successfully', deleteRoomResponse);
    } else {
        console.error('Error deleting room', deleteRoomResponse);
    }
}

let socket; // 전역 WebSocket 인스턴스

function initializeWebSocket() {
    socket = new WebSocket("ws://yourserveraddress/game");
    
    socket.onopen = function(e) {
        console.log("Connection established");
        // 초기 설정 수행
    };
    
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
    };
    
    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
        }
    };
    
    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };
}

async function sendCommandToServer(method, parameters = {}) {
    const message = {method, parameters};
    socket.send(JSON.stringify(message));
    // 서버로부터 응답을 기다리고 처리하는 로직 추가
}
