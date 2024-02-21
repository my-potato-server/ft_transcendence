// src/pages/main/Chat.js

import Component from '../../core/Component.js';
import RouterButton from '../../routers/RouterButton.js';
import ChatButton from '../../routers/ChatButton.js';

export default class Chat extends Component {

    constructor(ObjectForDI) {
        super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);
    }

    template() {
        console.log('Chat template');
        return `
        ${RouterButton('/src/pages/main/Chat')}
        ${ChatButton()}
        `;
    }

    setEvent() {
        // //
		// //RouterButton
		// //
		// const mainpageButton = this.$parent.querySelector('button[class="Mainpage"]');
		// if (mainpageButton) {
		// 	mainpageButton.onclick = () => this.mainpage();
		// }
		// const gameButton = this.$parent.querySelector('button[class="Game"]');
		// if (gameButton) {
		// 	gameButton.onclick = () => this.game();
		// }
		// const chatButton = this.$parent.querySelector('button[class="Chat"]');
		// if (chatButton) {
		// 	chatButton.onclick = () => this.chat();
		// }
		// const rankButton = this.$parent.querySelector('button[class="Rank"]');
		// if (rankButton) {
		// 	rankButton.onclick = () => this.rank();
		// }
		// const profileButton = this.$parent.querySelector('button[class="Profile"]');
		// if (profileButton) {
		// 	profileButton.onclick = () => this.profile();
		// }
		// const logoutButton = this.$parent.querySelector('button[class="Logout"]');
		// if (logoutButton) {
		// 	logoutButton.onclick = () => this.logout();
		// }
		// //
		// //
		// //
    }

    // //
	// // RouterButton
	// //
	// mainpage() {
	// 	console.log("mainpage");
	// 	this.setState({locate: '/src/pages/Main'});
	// }
	// game() {
	// 	console.log("game");
	// 	this.setState({locate: '/src/pages/main/Game'});
	// }
	// chat() {
	// 	console.log("chat");
	// 	this.setState({locate: '/src/pages/main/Chat'});
	// }
	// rank() {
	// 	console.log("rank");
	// 	this.setState({locate: '/src/pages/main/Rank'});
	// }
	// profile() {
	// 	console.log("profile");
	// 	this.setState({locate: '/src/pages/main/Profile'});
	// }
	// logout() {
	// 	console.log("logout");
	// 	this.$parent.auth = false;
	// 	this.setState({locate: '/'});
    // }
	// //
	// //
	// //
}