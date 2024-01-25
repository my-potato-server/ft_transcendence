// src/routers/RouterButton.js

export default function RouterButton() {
	console.log("RouterButton");
	return `
		<div class="RouterButton">
			<button type="button" class="Mainpage">
				Mainpage
			</button>
			<button type="button" class="Game">
				Game
			</button>
			<button type="button" class="Chat">
				Chat
			</button>
			<button type="button" class="Rank">
				Rank
			</button>
			<button type="button" class="Profile">
				Profile
			</button>
			<button type="button" class="Logout">
				Logout
			</button>
		</div>
	`
};