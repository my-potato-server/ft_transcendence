// src/apps/online2.js

let socket; // Define WebSocket globally within the function scope

export default function OnlinePong(canvasID) {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');

    const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));

    function initializeWebSocket() {
        // 웹소켓이 이미 존재하고 열려있는 상태인지 확인
        if (socket) {
            console.log("Using existing WebSocket connection");
            return; // 기존 연결을 재사용
        }
    
        // 새로운 웹소켓 연결 생성
        socket = new WebSocket("wss://localhost/ws/?token=" + sessionStorage.getItem("token"));
        console.log("Connecting to WebSocket", "wss://localhost/ws/?token=" + sessionStorage.getItem("token"));
    
        socket.onopen = function(e) {
            console.log("Connection established");
            // 초기 설정 수행
        };
    
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            // 서버로부터 받은 메시지 처리
            handleServerMessage(data);
        };
    
        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // 예: 프로세스 종료 또는 네트워크 다운
                console.log('[close] Connection died');
            }
        };
    
        socket.onerror = function(error) {
            console.log(`[error] ${error.message}`);
        };
    }

    function handleServerMessage(data) {
        switch(data.method) { // 수정: data.type -> data.method
            case 'gameState':
                updateGameState(data.gameState);
                break;
            case 'matchserver.info_room':
                if (data.status === 'OK') {
                    drawRoomInfo(data.data); // 방 정보 그리기 함수 호출
                }
                break;
            case 'error':
                console.error(data.message);
                break;
            // Handle other message types
        }
    }

    function updateGameState(gameState) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the ball
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(gameState.ball_position[0], gameState.ball_position[1], 10, 0, Math.PI*2);
        ctx.fill();

        // Draw paddles
        ctx.fillStyle = 'blue';
        ctx.fillRect(20, gameState.paddle1_position[1], 10, 100); // Paddle1
        ctx.fillRect(canvas.width - 30, gameState.paddle2_position[1], 10, 100); // Paddle2

        // Display scores
        ctx.fillStyle = 'black';
        ctx.font = '32px Arial';
        ctx.fillText(`${gameState.score1} - ${gameState.score2}`, canvas.width / 2 - 50, 50);

        if (gameState.game_over) {
            console.log("Game Over");
            // Handle game over
        }
    }

    // async function sendCommandToServer(method, parameters = {}) {
    //     const message = {method, parameters};
    //     socket.send(JSON.stringify(message));
    //     // Add logic to wait for and process the response from the server
    // }
    async function sendCommandToServer(method, parameters = {}) {
        return new Promise((resolve, reject) => {
            // 응답 ID 생성
            const responseId = userinfo.user.id;
            const message = { method, parameters, responseId };

            // 응답 대기
            const responseHandler = (event) => {
                const data = JSON.parse(event.data);
                if (data.responseId === responseId) {
                    socket.removeEventListener('message', responseHandler); // 이 핸들러 제거
                    resolve(data); // 응답 데이터로 프로미스 해결
                }
            };
            socket.addEventListener('message', responseHandler);

            // 메시지 전송
            socket.send(JSON.stringify(message));
        });
    }

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

    async function deleteRoom() {
        const deleteRoomResponse = await sendCommandToServer('matchserver.delete_room');
        if (deleteRoomResponse.status === 'OK') {
            console.log('Room deleted successfully', deleteRoomResponse);
        } else {
            console.error('Error deleting room', deleteRoomResponse);
        }
    }


    // Define functions to create, enter, list, and delete rooms
    // createAndEnterRoom, listRooms, deleteRoom

    // Initialize WebSocket connection
    initializeWebSocket();

    // Add event listener for keyboard input
    document.addEventListener('keydown', (event) => {
        let cmd = {};
        switch(event.key) {
            case 'ArrowUp':
                cmd = { action: 'move', direction: 'up' };
                break;
            case 'ArrowDown':
                cmd = { action: 'move', direction: 'down' };
                break;
            // Handle other key inputs
        }
        if (cmd.action) {
            sendCommandToServer('matchserver.control', cmd);
        }
    });


    function drawUI() {
        // UI 배경 그리기
        ctx.fillStyle = '#DDD'; // UI 배경색
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

        // '방 생성' 버튼 그리기
        ctx.fillStyle = '#0A0'; // 버튼색
        ctx.fillRect(10, canvas.height - 50, 100, 40);
        ctx.fillStyle = '#FFF'; // 텍스트색
        ctx.font = '20px Arial';
        ctx.fillText('방 생성', 20, canvas.height - 20);

        // '방 입장' 버튼 그리기
        ctx.fillStyle = '#00A'; // 버튼색
        ctx.fillRect(120, canvas.height - 50, 100, 40);
        ctx.fillStyle = '#FFF'; // 텍스트색
        ctx.fillText('방 입장', 130, canvas.height - 20);

        // '방 삭제' 버튼 그리기
        ctx.fillStyle = '#A00'; // 버튼색
        ctx.fillRect(230, canvas.height - 50, 100, 40);
        ctx.fillStyle = '#FFF'; // 텍스트색
        ctx.fillText('방 삭제', 240, canvas.height - 20);
    }

    drawUI(); // UI 초기 그리기

    canvas.addEventListener('click', function(event) {
        // 캔버스 내 클릭 위치 확인
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 랜덤한 수 하나 생성
        const randomNum = Math.floor(Math.random() * 100);
        // '방 생성' 버튼 클릭 확인
        if (x >= 10 && x <= 110 && y >= canvas.height - 50 && y <= canvas.height - 10) {
            createAndEnterRoom('temproom' + randomNum, null); // 여기서 '새 방'은 예시 이름, 실제 구현에서는 사용자 입력을 받아야 함
            clearCanvasWhite();
        }

        // '방 입장' 버튼 클릭 확인
        if (x >= 120 && x <= 220 && y >= canvas.height - 50 && y <= canvas.height - 10) {
            listRooms().then(rooms => {
                // 방 목록 처리 로직 (예: 팝업 또는 새 UI 영역에 방 목록 표시)
                console.log('방 목록:', rooms);
            });
        }

        // '방 삭제' 버튼 클릭 확인
        if (x >= 230 && x <= 330 && y >= canvas.height - 50 && y <= canvas.height - 10) {
            deleteRoom();
        }
    });

    function drawRoomInfo(roomInfo) {
        // 캔버스를 흰색으로 초기화
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // 방 이름 상단 중앙에 표시
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center'; // 텍스트를 중앙 정렬
        ctx.fillText(`방 이름: ${roomInfo.name}`, canvas.width / 2, 30);
    
        // 접속 중인 유저 목록 아래에 표시
        ctx.font = '20px Arial';
        roomInfo.participants.forEach((participant, index) => {
            ctx.fillText(participant, canvas.width / 2, 60 + (index * 30));
        });
    }
    
    function clearCanvasWhite() {
        ctx.fillStyle = 'white'; // 흰색으로 설정
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 흰색으로 칠함
    }
}


// Functions to manage rooms: createAndEnterRoom, listRooms, deleteRoom can be defined here
// Since these functions would interact with the server, they would use the sendCommandToServer function
// For brevity, their implementations are not repeated here, but you would define them similarly
// to how they were outlined in the previous messages, making sure they're accessible within the OnlinePong function scope.
