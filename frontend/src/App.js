// src/App.js

import Login from "./pages/Login.js"

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		this.Login = new Login(ObjectForDI);

		this.render();
		this.setDummyEvent();
		this.root.auth = false;
		this.root.userinfo = {
			id : '',
			name : '',
			auth : false
		};
	}

	setState(newState) {
		console.log("setState called");
		const { locate } = this.state;
		this.state = {...this.state, ...newState};
		console.log(this.state);
		console.log(locate);
		this.render();
		console.log("setState end");
	}

	render() {
		console.log("render start");
		this.root.innerHTML = '';

		let { locate } = this.state;
		console.log("render's locate", locate, this.state);
		if (locate === '/') {
			this.Login.renderSequnce(this.state);
		} else if (locate === '/src/pages/Main') {
			if (!this.Mainpage) { this.makepage(locate); }
			else { this.Mainpage.renderSequnce(this.state); }
		} else if (locate === '/src/pages/Signup') {
			if (!this.Signup) { this.makepage(locate); }
			else { this.Signup.renderSequnce(this.state); }
		} else if (locate === '/src/pages/main/Game') {
			if (!this.Game) { this.makepage(locate); }
			else { this.Game.renderSequnce(this.state); }
		} else if (locate === '/src/pages/main/Chat') {
			if (!this.Chat) { this.makepage(locate); }
			else { this.Chat.renderSequnce(this.state); }
		} else if (locate === '/src/pages/main/Rank') {
			if (!this.Rank) { this.makepage(locate); }
			else { this.Rank.renderSequnce(this.state); }
		} else if (locate === '/src/pages/main/Profile') {
			if (!this.Profile) { this.makepage(locate); }
			else { this.Profile.renderSequnce(this.state); }
		}

		this.historyRouterPush(locate);

		console.log("render end");
	}

	historyRouterPush(locate) {
        // 현재 위치와 새 위치가 다를 때만 히스토리를 업데이트합니다.
        if (window.location.pathname !== locate) {
            window.history.pushState({}, '', locate);
        }
    }


	dummyClickEvent = ({target}) => {
        // if(target.classList.contains('Mainpage')){
        //     this.setState({...this.state, locate : '/src/pages/Main'});
        // }
		// if(target.classList.contains("Log In")){
		// 	this.setState({...this.state, locate: '/src/pages/Login'});
		// }
    }

    setDummyEvent(){
        // this.root.addEventListener('click', this.dummyClickEvent);
    }

	initPopStateEvent() {
        window.addEventListener('popstate', (event) => {
            // 현재 URL의 경로를 기반으로 상태를 설정합니다.
            this.setState({ locate: window.location.pathname });
        });
    }

	makepage(locate) {
		console.log("makepage");
		if (locate === '/src/pages/Main') {
				import('./pages/Main.js').then(({ default: Mainpage }) => {
					this.Mainpage = new Mainpage({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Mainpage.renderSequnce(this.state);
				});}
		else if (locate === '/src/pages/Signup') {
				import('./pages/Signup.js').then(({ default: Signup }) => {
					this.Signup = new Signup({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Signup.renderSequnce(this.state);
				});}
		else if (locate === '/src/pages/main/Game') {
				import('./pages/main/Game.js').then(({ default: Game }) => {
					this.Game = new Game({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Game.renderSequnce(this.state);
				});}
		else if (locate === '/src/pages/main/Chat') {
				import('./pages/main/Chat.js').then(({ default: Chat }) => {
					this.Chat = new Chat({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Chat.renderSequnce(this.state);
				});}
		else if (locate === '/src/pages/main/Rank') {
				import('./pages/main/Rank.js').then(({ default: Rank }) => {
					this.Rank = new Rank({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Rank.renderSequnce(this.state);
				});}
		else if (locate === '/src/pages/main/Profile') {
				import('./pages/main/Profile.js').then(({ default: Profile }) => {
					this.Profile = new Profile({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.Profile.renderSequnce(this.state);
				});
			}
	}
}

const myApp = new app();
myApp.initPopStateEvent();