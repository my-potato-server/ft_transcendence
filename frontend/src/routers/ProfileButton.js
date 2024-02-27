// src/routers/ProfileButton.js

import injectProfileStyles from "../styles/profilestyle.js";

// export default function ProfileButton() {
//     console.log("ProfileButton");
// 	return `
// 		<div class="ProfileButton">
// 			<button type="button" class="UserInfo">
//                 User Info
//             </button>
//             <button type="button" class="Status">
//                 Status
//             </button>
//             <button type="button" class="MatchHistory">
//                 Match History
//             </button>
//             <button type="button" class="DeleteID">
//                 Delete Account
//             </button>
// 		</div>
//         <div id=info></div>
//         <div id=delete></div>
//         <div id=status></div>
// 	`
// }

export default function ProfileButton() {
	console.log("ProfileButton");
	injectProfileStyles();
	const info = sessionStorage.getItem('userinfo');
	const image = JSON.parse(info).user.image;
	const name = JSON.parse(info).user.nickname;
	console.log("image", image);
	return `
	<div class="profile-container">
		<div class="user-details">
			<div class="user-photo">
				<img src="${image}" style="height: 120px; width: 120px; alt="User Photo">
			</div>
			<div class="user-info">
				<div class="name">${name}</div>
				<div class="level">Level: 999</div>
				<div class="joined">가입일: 2022.07.04. D+583</div>
			</div>
		</div>
	</div>
	<div class="profile-container">
		<div class="buttons">
			<button type="button" class="UserInfo">Info</button>
			<button type="button" class="MatchHistory">Match History</button>
			<button type="button" class="DeleteID">Delete Account</button>
		</div>
		<div class="dropdown-content" id="info"></div>
		<div class="dropdown-content" id="matchHistory"></div>
		<div class="dropdown-content" id="delete"></div>
	</div>
	`
}