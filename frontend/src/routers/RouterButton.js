// src/routers/RouterButton.js

import injectFriendStyles from "../styles/freindliststyle.js"
import injectMainStyles from "../styles/mainstyle.js";
// export default function RouterButton() {
// 	console.log("RouterButton");
// 	return `
// 		<div class="RouterButton">
// 			<button type="button" class="Mainpage">
// 				Mainpage
// 			</button>
// 			<button type="button" class="Game">
// 				Game
// 			</button>
// 			<button type="button" class="Chat">
// 				Chat
// 			</button>
// 			<button type="button" class="Rank">
// 				Rank
// 			</button>
// 			<button type="button" class="Profile">
// 				Profile
// 			</button>
// 			<button type="button" class="Logout">
// 				Logout
// 			</button>
// 		</div>
// 	`
// };

// export default function RouterButton() {
//     console.log("RouterButton");
//     return `
//     <nav class="navbar navbar-expand-lg navbar-light bg-light">
//         <div class="container-fluid">
//             <a class="navbar-brand" href="#">I Hate My Fork</a>
//             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
//                 <span class="navbar-toggler-icon"></span>
//             </button>
//             <div class="collapse navbar-collapse" id="navbarNav">
//                 <ul class="navbar-nav">
//                     <li class="nav-item">
//                         <a class="nav-link active" aria-current="page" href="#" onclick="navigateTo('/src/pages/Main')">Mainpage</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#" onclick="navigateTo('/src/pages/main/Game')">Game</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#" onclick="navigateTo('/src/pages/main/Chat')">Chat</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#" onclick="navigateTo('/src/pages/main/Rank')">Rank</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#" onclick="navigateTo('/src/pages/main/Profile')">Profile</a>
//                     </li>
//                     <li class="nav-item">
//                         <a class="nav-link" href="#" onclick="logout()">Logout</a>
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     </nav>
//     `;
// }

export default function RouterButton(currentLocation) {
	console.log("RouterButton");
	injectMainStyles();
	injectFriendStyles();
	// 각 네비게이션 아이템이 현재 페이지와 일치하는지 확인하여 active 클래스 추가
	const isActive = (path) => currentLocation === path ? 'active' : '';
	const dodge = "'do not dodge me'";
	console.log("currentLocation: ", currentLocation);
	const info = sessionStorage.getItem('userinfo');
	console.log ('test', info);
	const image = JSON.parse(info).user.image;
	// const image = info.image;
	return `
	<nav class="navbar navbar-expand-lg navbar-light bg-light" style="width:100%">
		<div class="container-fluid">
			<a class="navbar-brand" href="javascript:void(0);" onclick="alert(${dodge})">Mr.PoTaTo</a>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarNav">
				<ul class="navbar-nav me-auto">
					<li class="nav-item">
						<a class="nav-link ${isActive('/src/pages/Main')}" href="javascript:void(0);" onclick="navigateTo('/src/pages/Main')">Mainpage</a>
					</li>
					<li class="nav-item">
						<a class="nav-link ${isActive('/src/pages/main/Game')}" href="javascript:void(0);" onclick="navigateTo('/src/pages/main/Game')">Game</a>
					</li>
					<li class="nav-item">
						<a class="nav-link ${isActive('/src/pages/main/Chat')}" href="javascript:void(0);" onclick="navigateTo('/src/pages/main/Chat')">Chat</a>
					</li>
					<li class="nav-item">
						<a class="nav-link ${isActive('/src/pages/main/Rank')}" href="javascript:void(0);" onclick="navigateTo('/src/pages/main/Rank')">Rank</a>
					</li>
					<li class="nav-item">
						<a class="nav-link ${isActive('/src/pages/main/Profile')}" href="javascript:void(0);" onclick="navigateTo('/src/pages/main/Profile')">Profile</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="javascript:void(0);" onclick="logout()">Logout</a>
					</li>
				</ul>
				<button onclick="navigateToSubscribe()" style="background:none;border:none;margin-left:auto;">
					<img src="https://cdn-icons-png.flaticon.com/512/5035/5035563.png?downsize=40:40" style="height: 40px; width: 40px; cursor:pointer;">
				</button>
				<button onclick="navigateToProfile()" style="height: 40px; width:40px; background:none;border:0.5px solid #000;border-radius: 50%;margin-left:0;padding:0;" class="navPhoto">
                    <img src="${image}" style="border-radius:50%;height: 100%; width: 100%; margin: 0px; overflow: hidden;cursor:pointer;">
                </button>
			</div>
		</div>
	</nav>
	<div id="friendListContainer" class="friend-list-container"></div>
	`;
}
