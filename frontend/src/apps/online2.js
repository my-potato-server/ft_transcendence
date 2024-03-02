// src/apps/online2.js

let socket = null; // Define WebSocket globally within the function scope

export default function OnlinePong(canvasID) {
    let gamestatus = false;
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');
    let player = '';
    const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));

    async function initializeWebSocket() {
        // 웹소켓이 이미 존재하고 열려있는 상태인지 확인
        // if (socket !== undefined) {
        //     console.log("Using existing WebSocket connection");
        //     socket.close();
        //     // await check_room_info();
        // } else {
        // 새로운 웹소켓 연결 생성
            socket = new WebSocket("wss://localhost/ws/?token=" + sessionStorage.getItem("token"));
            console.log("Connecting to WebSocket", "wss://localhost/ws/?token=" + sessionStorage.getItem("token"));
        // }
        // socket.onopen = function(e) {
        //     console.log("Connection established");
        //     // 초기 설정 수행

        // };
        await new Promise((resolve, reject) => {
            socket.onopen = function(e) {
                console.log("Connection established");
                resolve(); // 연결이 성공적으로 맺어지면 Promise를 해결
            };

            socket.onerror = function(error) {
                console.log(`[error] ${error.message}`);
                reject(error); // 연결 과정에서 오류가 발생하면 Promise를 거부
            };
        });

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            // 서버로부터 받은 메시지 처리
            // console.log('Received message:', data);
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

        // socket.onerror = function(error) {
        //     console.log(`[error] ${error.message}`);
        // };
        await check_room_info();
    }
    function handleServerMessage(data) {
        switch(data.method) { // 수정: data.type -> data.method
            case 'gameState':
                // console.log('sulm');
                updateGameState(data.gameState);
                break;
            case 'client.room_was_update':
                if (data.status === 'OK') {
                    drawRoomInfo(data.data); // 방 정보 그리기 함수 호출
                }
                break;
            case 'fast_match_matched':
                if (data.status === 'OK') {
                    console.log('Matched with opponent', data.data);
                    ready_to_start_game();
                }
                break;
            case 'server.game':
                if (data.status === 'OK') {
                    // console.log('Game started', data.data);
                    gamestatus = true;
                    updateGameScreen(data.data.realtime_gamestate);
                }
                break;
            case 'tournament_matched':
                if (data.status === 'OK') {
                    console.log('Matched with opponent', data.data);
                    make_screen_tournamnet('game_start', data.data);
                }
                break;
            case 'tournament_first_win':
                if (data.status === 'OK') {
                    console.log('You are the first game winner', data.data);
                    make_screen_tournamnet('first_win', data.data);
                }
                break;
            case 'tournament_final_matched':
                if (data.status === 'OK') {
                    console.log('Matched with opponent', data.data);
                    make_screen_tournamnet('second_game_start', data.data);
                    //make_screen -> 화면에 대진표 그리기
                }
                break;
            case 'error':
                console.error(data.message);
                break;
            // Handle other message types
        }
    }

    function make_screen_tournamnet(status, data) {
        console.log('status', status);
        console.log("data", data);
        clearCanvasWhite2();
        if (status === 'game_start') {
            ctx.fillStyle = 'black';
            ctx.font = '48px serif';
            //토너먼트 대진표 작성. data.first_team, data.second_team으로 구분
            ctx.fillText("First Team", canvas.width / 2 - 400, canvas.height / 2);
            ctx.fillText(data.first_team[0], canvas.width / 2, canvas.height / 2);
            ctx.fillText('vs', canvas.width / 2 + 200, canvas.height / 2);
            ctx.fillText(data.first_team[1], canvas.width / 2 + 400, canvas.height / 2);
            ctx.fillText("Second Team", canvas.width / 2 - 400, canvas.height / 2 - 200);
            ctx.fillText(data.second_team[0], canvas.width / 2, canvas.height / 2 - 200);
            ctx.fillText('vs', canvas.width / 2 + 200, canvas.height / 2 - 200);
            ctx.fillText(data.second_team[1], canvas.width / 2 + 400, canvas.height / 2 - 200);
        }
        if (status === 'first_win') {
            ctx.fillStyle = 'black';
            ctx.font = '48px serif';
            //토너먼트 대진표 작성. data.first_team, data.second_team으로 구분
            ctx.fillText('You are the first game winner', canvas.width / 2 - 100, canvas.height / 2);
        }
        if (status === 'second_game_start') {
            ctx.fillStyle = 'black';
            ctx.font = '48px serif';
            //토너먼트 대진표 작성. data.first_team, data.second_team으로 구분
            ctx.fillText("Last Team", canvas.width / 2 - 300, canvas.height / 2);
            ctx.fillText(data.players, canvas.width / 2 + 100, canvas.height / 2);
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

    async function sendCommandToServer(method, parameters = {}) {
        // return new Promise((resolve, reject) => {
        //     // 응답 ID 생성
        //     const responseId = userinfo.user.id;
        //     const message = { method, parameters, responseId };

        //     // 응답 대기
        //     const responseHandler = (event) => {
        //         const data = JSON.parse(event.data);
        //         if (data.responseId === responseId) {
        //             socket.removeEventListener('message', responseHandler); // 이 핸들러 제거
        //             resolve(data); // 응답 데이터로 프로미스 해결
        //         }
        //     };
        //     socket.addEventListener('message', responseHandler);
        //     // 메시지 전송
        //     socket.send(JSON.stringify(message));
        // });
        return new Promise((resolve, reject) => {
            // 응답 ID 생성
            const responseId = userinfo.user.id;
            const message = { method, parameters, responseId };

            // 응답 대기
            const responseHandler = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.responseId === responseId) {
                        // console.log('Got it');
                        socket.removeEventListener('message', responseHandler); // 이 핸들러 제거
                        resolve(data); // 응답 데이터로 프로미스 해결
                    }
                } catch (error) {
                    socket.removeEventListener('message', responseHandler); // 이 핸들러 제거
                    reject(new Error('응답 파싱 중 오류 발생')); // 파싱 에러 처리
                }
            };
            socket.addEventListener('message', responseHandler);

            // 메시지 전송
            socket.send(JSON.stringify(message));

            // 응답 타임아웃 처리
            // const timeout = 10000; // 10초 후 타임아웃
            // setTimeout(() => {
            //     socket.removeEventListener('message', responseHandler);
            //     reject(new Error('응답 시간 초과')); // 타임아웃 에러 처리
            // }, timeout);

        });
    }

    async function tournament() {
        const tournamentResponse = await sendCommandToServer('matchserver.tournament_match_add_queue', {user_id: userinfo.user.id});
        if (tournamentResponse.status === 'OK') {
            console.log('Tournament added to queue successfully', tournamentResponse);
        }
        console.log(tournamentResponse);
    }

    async function ready_to_start_game() {
        console.log('Ready to start game');
        const readyResponse = await sendCommandToServer('matchserver.game_info');
        console.log('Ready to start game recieve', readyResponse);
        if (readyResponse.status === 'OK') {
            console.log('Ready to start game', readyResponse);
            clearCanvasBlack();
            start_game();
        } else {
            console.error('Error ready to start game', readyResponse);
        }
    }

    async function start_game() {
        const startGame = await sendCommandToServer('matchserver.control_game', {cmd : "ready_to_play"});
        if (startGame.status === 'OK') {
            console.log('Game started', startGame);
            check_room_info();
        } else {
            console.error('Error starting game', startGame);
        }
    }

    async function quickmatch() {
        const quickmatchResponse = await sendCommandToServer('matchserver.fast_match_add_queue', {user_id: userinfo.user.id});
        if (quickmatchResponse.status === 'OK') {
            console.log('Quickmatch added to queue successfully', quickmatchResponse);
        }
        console.log(quickmatchResponse);
    }

    // async function createAndEnterRoom(roomName, password = null) {
    //     const createRoomResponse = await sendCommandToServer('matchserver.create_room', {name: roomName, password});
    //     if (createRoomResponse.status === 'OK') {
    //         console.log('Room created successfully', createRoomResponse);
    //         // const enterRoomResponse = await sendCommandToServer('matchserver.enter_room', {room_id: createRoomResponse.data.room_id});
    //         // if (enterRoomResponse.status === 'OK') {
    //         //     console.log('Entered the room successfully', enterRoomResponse);
    //         // } else {
    //         //     console.error('Error entering room', enterRoomResponse);
    //         // }
    //         check_room_info();
    //     } else {
    //         console.error('Error creating room', createRoomResponse);
    //     }
    // }

    // async function listRooms() {
    //     const listRoomResponse = await sendCommandToServer('matchserver.list_room');
    //     if (listRoomResponse.status === 'OK') {
    //         console.log('List of rooms:', listRoomResponse.data);
    //         // 로비 목록을 사용자에게 표시
    //     } else {
    //         console.error('Error listing rooms', listRoomResponse);
    //     }
    // }

    // async function deleteRoom() {
    //     const deleteRoomResponse = await sendCommandToServer('matchserver.delete_room');
    //     if (deleteRoomResponse.status === 'OK') {
    //         console.log('Room deleted successfully', deleteRoomResponse);
    //     } else {
    //         console.error('Error deleting room', deleteRoomResponse);
    //     }
    // }


    // Define functions to create, enter, list, and delete rooms
    // createAndEnterRoom, listRooms, deleteRoom

    // Initialize WebSocket connection
    // initializeWebSocket();

    async function check_room_info() {
        const roomcheck = await sendCommandToServer('matchserver.get_user_state');
        console.log('roomcheck', roomcheck);
        if (roomcheck.status === 'OK') {
            console.log('roomcheck', roomcheck);
            if (roomcheck.data.room_id !== null) {
                // const roomInfo = await sendCommandToServer('matchserver.info_room', {room_id: roomcheck.data.room_id});
                // if (roomInfo.status === 'OK') {
                //     console.log('roomInfo', roomInfo);
                //     drawRoomInfo(roomInfo.data);
                // }
            }
        }
    }


    // // Add event listener for keyboard input
    // document.addEventListener('keydown', (event) => {
    //     let cmd = {};
    //     switch(event.key) {
    //         case 'ArrowUp':
    //             cmd = { action: 'move', direction: 'up' };
    //             break;
    //         case 'ArrowDown':
    //             cmd = { action: 'move', direction: 'down' };
    //             break;
    //         // Handle other key inputs
    //     }
    //     if (cmd.action) {
    //         sendCommandToServer('matchserver.control', cmd);
    //     }
    // });


    function drawUI() {
        ctx.fillStyle = 'White';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // UI 배경 그리기
        ctx.fillStyle = '#DDD'; // UI 배경색
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

        // // '방 생성' 버튼 그리기
        // ctx.fillStyle = '#0A0'; // 버튼색
        // ctx.fillRect(10, canvas.height - 50, 100, 40);
        // ctx.fillStyle = '#FFF'; // 텍스트색
        // ctx.font = '20px Arial';
        // ctx.fillText('방 생성', 20, canvas.height - 20);

        // // '방 입장' 버튼 그리기
        // ctx.fillStyle = '#00A'; // 버튼색
        // ctx.fillRect(120, canvas.height - 50, 100, 40);
        // ctx.fillStyle = '#FFF'; // 텍스트색
        // ctx.fillText('방 입장', 130, canvas.height - 20);

        // // '방 삭제' 버튼 그리기
        // ctx.fillStyle = '#A00'; // 버튼색
        // ctx.fillRect(230, canvas.height - 50, 100, 40);
        // ctx.fillStyle = '#FFF'; // 텍스트색
        // ctx.fillText('방 삭제', 240, canvas.height - 20);

        ctx.fillStyle = '#0A0'; // 버튼색
        ctx.fillRect(10, canvas.height - 50, 100, 40);
        ctx.fillStyle = '#FFF'; // 텍스트색
        ctx.font = '20px Arial';
        ctx.fillText('토너먼트', 20, canvas.height - 20);

        ctx.fillStyle = '#AA0';
        ctx.fillRect(340, canvas.height - 50, 100, 40);
        ctx.fillStyle = '#FFF';
        ctx.fillText('빠른 대전', 350, canvas.height - 20);
    }

    // canvas.addEventListener('click', function(event) {
    //     // 캔버스 내 클릭 위치 확인
    //     const rect = canvas.getBoundingClientRect();
    //     const x = event.clientX - rect.left;
    //     const y = event.clientY - rect.top;

    //     // 랜덤한 수 하나 생성
    //     const randomNum = Math.floor(Math.random() * 100);
    //     // '방 생성' 버튼 클릭 확인
    //     if (x >= 10 && x <= 110 && y >= canvas.height - 50 && y <= canvas.height - 10) {
    //         createAndEnterRoom('temproom' + randomNum, null); // 여기서 '새 방'은 예시 이름, 실제 구현에서는 사용자 입력을 받아야 함
    //         clearCanvasWhite();
    //     }

    //     // '방 입장' 버튼 클릭 확인
    //     if (x >= 120 && x <= 220 && y >= canvas.height - 50 && y <= canvas.height - 10) {
    //         listRooms().then(rooms => {
    //             // 방 목록 처리 로직 (예: 팝업 또는 새 UI 영역에 방 목록 표시)
    //             console.log('방 목록:', rooms);
    //         });
    //     }

    //     // '방 삭제' 버튼 클릭 확인
    //     if (x >= 230 && x <= 330 && y >= canvas.height - 50 && y <= canvas.height - 10) {
    //         deleteRoom();
    //     }

    //     // '빠른 대전' 버튼 클릭 확인
    //     if (x >= 340 && x <= 440 && y >= canvas.height - 50 && y <= canvas.height - 10) {
    //         quickmatch();
    //         clearCanvasWhite();
    //     }
    // });
    let previousClickHandler;

    const clickEventHandler = (event) => {
        // 캔버스 내 클릭 위치 확인
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // 랜덤한 수 하나 생성
        // const randomNum = Math.floor(Math.random() * 100);
        // // '방 생성' 버튼 클릭 확인
        // if (x >= 10 && x <= 110 && y >= canvas.height - 50 && y <= canvas.height - 10) {
        //     createAndEnterRoom('temproom' + randomNum, null); // 여기서 '새 방'은 예시 이름, 실제 구현에서는 사용자 입력을 받아야 함
        //     clearCanvasWhite();
        // }


        // // '방 입장' 버튼 클릭 확인
        // if (x >= 120 && x <= 220 && y >= canvas.height - 50 && y <= canvas.height - 10) {
        //     listRooms().then(rooms => {
        //         // 방 목록 처리 로직 (예: 팝업 또는 새 UI 영역에 방 목록 표시)
        //         console.log('방 목록:', rooms);
        //     });
        // }

        // // '방 삭제' 버튼 클릭 확인
        // if (x >= 230 && x <= 330 && y >= canvas.height - 50 && y <= canvas.height - 10) {
        //     deleteRoom();
        // }
        if (gamestatus === false) {
            // 토너먼트
            if (x >= 10 && x <= 110 && y >= canvas.height - 50 && y <= canvas.height - 10) {
                tournament();
                clearCanvasWhite();
            }
            // '빠른 대전' 버튼 클릭 확인
            if (x >= 340 && x <= 440 && y >= canvas.height - 50 && y <= canvas.height - 10) {
                quickmatch();
                clearCanvasWhite();
            }
        }
    }
    canvas.removeEventListener('click', previousClickHandler); // Remove previous click handler if exists
    canvas.addEventListener('click', clickEventHandler);
    previousClickHandler = clickEventHandler;
    // document.addEventListener('click', clickEventHandler);

    function drawRoomInfo(roomInfo) {
        // 캔버스를 흰색으로 초기화
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 방 이름 상단 중앙에 표시
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center'; // 텍스트를 중앙 정렬
        ctx.fillText(`방 이름: ${roomInfo.data.name}`, canvas.width / 2, 30);

        // 접속 중인 유저 목록 아래에 표시
        ctx.font = '20px Arial';
        let index = 0;
        console.log('participants:', roomInfo.participants);
        roomInfo.data.participants.forEach((participants) => {
            console.log('participant is :', participants);
            ctx.fillStyle = 'black';
            ctx.fillText(participants, canvas.width / 2, 60 + (index * 30));
            index++;
        });
    }

    function clearCanvasWhite() {
        ctx.fillStyle = 'white'; // 흰색으로 설정
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 흰색으로 칠함
        ctx.fillStyle = 'black'; // 검은색으로 설정
        ctx.font = '48px Arial';
        ctx.fillText('로딩중...', canvas.width / 2 - 100, canvas.height / 2);
    }

    function clearCanvasWhite2() {
        ctx.fillStyle = 'white'; // 흰색으로 설정
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 흰색으로 칠함
        ctx.fillStyle = 'black'; // 검은색으로 설정
        ctx.font = '48px Arial';
    }

    function clearCanvasBlack() {
        ctx.fillStyle = 'black'; // 검은색으로 설정
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 검은색으로 칠함
    }

    // game logic
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

    let gameover = false;
    let winner = 0;
    const paddleHeight = 60;
    const paddleWidth = 10;
    let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

    document.addEventListener('keydown', (event) => {
        // keysPressed[event.key] = true;

        // if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        //     socket.send(JSON.stringify({
        //         action: 'move_paddle',
        //         key: event.key,
        //     }));
        // }
        if (gamestatus === true) {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const data = { method : 'matchserver.control_game', parameters: { cmd: "game_control", move: 'up'}}
                socket.send(JSON.stringify(data));
            }
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const data = { method : 'matchserver.control_game', parameters: { cmd: "game_control", move: 'down'}}
                socket.send(JSON.stringify(data));
            }
        }
    });
    document.addEventListener('keypress', (event) => {
        if (gamestatus === true) {
            if (event.key === 'q') {
                event.preventDefault();
                const data = { method : 'matchserver.control_game', parameters: { cmd: "pause"}}
                socket.send(JSON.stringify(data));
            }
        }
    });
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
            close(socket);
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

        if (player === 'left') {
            ctx.fillStyle = 'RED';
        } else
            ctx.fillStyle = 'WHITE';
        ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
        if (player === 'right') {
            ctx.fillStyle = 'RED';
        } else
            ctx.fillStyle = 'WHITE';
        ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
    }

    function updateGameScreen(data) {
        // console.log(data);
        if (data.game_over) {
            gamestatus = false;
        }
        if (data.left_user_id === userinfo.user.id) {
            player = 'left';
        } else if (data.right_user_id === userinfo.user.id) {
            player = 'right';
        }
        leftPaddleY = data.left_paddle_y;
        rightPaddleY = data.right_paddle_y;
        ball.x = data.ball_position.x;
        ball.y = data.ball_position.y;
        ball.scoreLeft = data.left_player_score;
        ball.scoreRight = data.right_player_score;
        gameover = data.game_over;
        winner = data.winner;
        draw();
    };

    function closeWebSocket() {
        if (socket) {
            socket.close();
            socket = null;
            console.log("WebSocket connection closed.");
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.removeEventListener('click', clickEventHandler);
        document.removeEventListener('keydown', (event) => {
            if (gamestatus === true) {
                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    const data = { method : 'matchserver.control_game', parameters: { cmd: "game_control", move: 'up'}}
                    socket.send(JSON.stringify(data));
                }
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    const data = { method : 'matchserver.control_game', parameters: { cmd: "game_control", move: 'down'}}
                    socket.send(JSON.stringify(data));
                }
            }
        });
        document.removeEventListener('keypress', (event) => {
            if (gamestatus === true) {
                if (event.key === 'q') {
                    event.preventDefault();
                    const data = { method : 'matchserver.control_game', parameters: { cmd: "pause"}}
                    socket.send(JSON.stringify(data));
                }
            }
        });
    }

    drawUI(); // UI 초기 그리기
    initializeWebSocket();

    return {
        close: closeWebSocket, // 게임 종료시 호출할 수 있는 메서드 추가
        // 여기에 OnlinePong에서 사용할 수 있는 다른 메서드나 프로퍼티를 추가할 수 있습니다.
    };
}