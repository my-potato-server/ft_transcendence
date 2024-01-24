// src/App.js

import Mainpage from "./pages/Main.js";
// import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js"

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		this.Mainpage = new Mainpage(ObjectForDI);
		// this.Signup = new Signup(ObjectForDI);
		this.Login = new Login(ObjectForDI);

		this.render();
		this.setDummyEvent();

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
		if (locate === '/src/pages/Main') {
			this.Mainpage.renderSequnce(this.state);
			// this.historyRouterPush('/Mainpage');
		}
		// else if (locate === '/src/pages/Signup.js') {
		// 	this.Signup.renderSequnce(this.state);
		// 	// this.historyRouterPush('/Signup');
		// }
		else if (locate === '/') {
			this.Login.renderSequnce(this.state);
		// 	// this.historyRouterPush('/Mainpage');
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
        if(target.classList.contains('Mainpage')){
            this.setState({...this.state, locate : '/src/pages/Main'});
        }
		if(target.classList.contains("Log In")){
			this.setState({...this.state, locate: '/src/pages/Login'});
		}
    }

    setDummyEvent(){
        this.root.addEventListener('click', this.dummyClickEvent);
    }

	initPopStateEvent() {
        window.addEventListener('popstate', (event) => {
            // 현재 URL의 경로를 기반으로 상태를 설정합니다.
            this.setState({ locate: window.location.pathname });
        });
    }
}

const myApp = new app();
myApp.initPopStateEvent();