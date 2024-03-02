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
	let sigh = sessionStorage.getItem('sigh');
	if (sigh === null) {
		sigh = "nothing special";
	}
	console.log("image", image);
	return `
	<div class="profile-container">
		<div class="user-details">
			<div class="user-photo">
				<button type="buttona" class="ProfilePhoto">
						<img src="${image}" alt="User Photo">
				</button>
			</div>
			<div class="user-info">
				<div class="name">
					<button type="buttonb" class="Nickname">${name}</button>
				</div>
				<div class="sigh">
					<button type="buttonc" class="Sigh">${sigh}</button>
				</div>
				<div class="level">Level: 999</div>
			</div>
		</div>
	</div>
	<div class="profile-container">
		<div class="buttons">
			<button type="button" class="UserInfo">Info</button>
			<button type="button" class="MatchHistory">Match History</button>
		</div>
		<div class="dropdown-content" id="info"></div>
		<div class="dropdown-content" id="matchHistory"></div>
	</div>
	`
}