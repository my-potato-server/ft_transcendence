// src/apps/online.js

export default function OnlinePong(canvasID) {
    const canvas = document.getElementById(canvasID);
    const ctx = canvas.getContext('2d');

    let socket; // Define WebSocket globally within the function scope

    function initializeWebSocket() {
        socket = new WebSocket("ws://yourserveraddress/game");

        socket.onopen = function(e) {
            console.log("Connection established");
            // Perform initial setup here
        };

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            // Handle messages received from the server
            handleServerMessage(data);
        };

        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g., process killed or network down
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

    async function sendCommandToServer(method, parameters = {}) {
        const message = {method, parameters};
        socket.send(JSON.stringify(message));
        // Add logic to wait for and process the response from the server
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

async function deleteRoom(roomId) {
    const deleteRoomResponse = await sendCommandToServer('matchserver.delete_room', {room_id: roomId});
    if (deleteRoomResponse.status === 'OK') {
        console.log('Room deleted successfully', deleteRoomResponse);
    } else {
        console.error('Error deleting room', deleteRoomResponse);
    }
}

// Functions to manage rooms: createAndEnterRoom, listRooms, deleteRoom can be defined here
// Since these functions would interact with the server, they would use the sendCommandToServer function
// For brevity, their implementations are not repeated here, but you would define them similarly
// to how they were outlined in the previous messages, making sure they're accessible within the OnlinePong function scope.
