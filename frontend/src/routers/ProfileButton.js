// src/routers/ProfileButton.js

export default function ProfileButton() {
    console.log("ProfileButton");
	return `
		<div class="ProfileButton">
			<button type="button" class="UserInfo">
                User Info
            </button>
            <button type="button" class="DeleteID">
                Delete Account
            </button>
            <button type="button" class="Status">
                Status
            </button>
		</div>
        <div id=info></div>
        <div id=delete></div>
        <div id=status></div>
	`
}