// src/App.js

import Login from "./pages/Login.js"

class app {

	constructor() {
		this.state = { 'locate' : window.location.pathname };
		this.root = document.querySelector('.app');

		const ObjectForDI = {$parent:this.root, setState : this.setState.bind(this), state : this.state};

		const auth = sessionStorage.getItem('auth') === 'true'; // 문자열 "true"를 boolean으로 변환
		const token = sessionStorage.getItem('token');
		const userinfo = sessionStorage.getItem('userinfo');
		console.log("userinfo", userinfo);
		console.log("new app");
		if (auth) {
			this.root.auth = true;
			this.root.token = token;
		} else {
			this.root.auth = false;
			this.root.token = '';
		}
		this.Login = new Login(ObjectForDI);

		this.render();
		this.setDummyEvent();
	}

	setState(newState) {
		console.log("setState called");
		const { locate } = this.state;

		// 상태가 실제로 변경되었는지 확인
		if (this.state.locate !== newState.locate) {
			this.state = {...this.state, ...newState};
			console.log(this.state);
			console.log(locate);
			this.render();
		} else {
			// 상태가 변경되지 않았다면, 렌더링을 하지 않음
			console.log("No state change detected");
		}

		console.log("setState end");
	}
	render() {
		console.log("render start");
		this.root.innerHTML = '';

		let { locate } = this.state;
		console.log("render's locate", locate, this.state);
		// if (locate === '/') {
		// 	this.Login.renderSequnce(this.state);
		// } else if (locate === '/src/pages/Main') {
		// 	if (!this.Mainpage) { this.makepage(locate); }
		// 	else { this.Mainpage.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/Signup') {
		// 	if (!this.Signup) { this.makepage(locate); }
		// 	else { this.Signup.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/main/Game') {
		// 	if (!this.Game) { this.makepage(locate); }
		// 	else { this.Game.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/main/Chat') {
		// 	if (!this.Chat) { this.makepage(locate); }
		// 	else { this.Chat.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/main/Rank') {
		// 	if (!this.Rank) { this.makepage(locate); }
		// 	else { this.Rank.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/main/Profile') {
		// 	if (!this.Profile) { this.makepage(locate); }
		// 	else { this.Profile.renderSequnce(this.state); }
		// } else if (locate === '/src/pages/GetAuth') {
		// 	if (!this.GetAuth) { this.makepage(locate); }
		// 	else { this.GetAuth.renderSequnce(this.state); }
		// }
		if (this.root.auth === true) {
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
			} else if (locate === '/src/pages/GetAuth') {
				if (!this.GetAuth) { this.makepage(locate); }
				else { this.GetAuth.renderSequnce(this.state); }
			}
		}
		else {
			// alert("로그인이 필요합니다");
			if (locate === '/') {
				this.Login.renderSequnce(this.state);
			} else if (locate === '/src/pages/Signup') {
				if (!this.Signup) { this.makepage(locate); }
				else { this.Signup.renderSequnce(this.state); }
			} else if (locate === '/src/pages/GetAuth') {
				if (!this.GetAuth) { this.makepage(locate); }
				else { this.GetAuth.renderSequnce(this.state); }
			} else {
				this.setState({locate: '/'});
			}
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
		else if (locate === '/src/pages/GetAuth') {
				import('./pages/GetAuth.js').then(({ default: GetAuth }) => {
					this.GetAuth = new GetAuth({
						$parent: this.root,
						setState: this.setState.bind(this),
						state: this.state
					});
					this.GetAuth.url = window.location.href;
					this.GetAuth.renderSequnce(this.state);
				});
			}
	}
}

window.navigateTo = function(path) {
    console.log(`Navigating to ${path}`);
    myApp.setState({ locate: path });
};

let isFriendListVisible = false;
let friendListUpdateInterval;

function renderAddFriendForm() {
    return `
        <div id="addFriendForm">
            <input type="text" id="friendIdInput" placeholder="친구의 아이디를 입력하세요">
            <button onclick="addFriend()">확인</button>
        </div>
    `;
}

window.navigateToSubscribe = async function() {
	alert("구독");
	// 유저 정보 먼저 요청,
	// 구독 양식 팝업박스 생성
	// 구독 제출
	// modal 사용, 사진 있음
}

window.navigateToProfile = async function() {
	const friendListContainer = document.getElementById('friendListContainer');
    if (!friendListContainer) {
        console.error('Friend list container not found!');
        return;
    }

    if (!isFriendListVisible) {
		try {
			const friendList = await fetchFriendList();
            const friendListHtml = friendList.map(friend => `<li>${friend.name} - ${friend.isOnline ? 'Online' : 'Offline'}</li>`).join('');
            friendListContainer.innerHTML = `<ul>${friendListHtml}</ul>`;

			// 5초마다 친구의 온라인 상태 업데이트
			friendListUpdateInterval = setInterval(async () => {
				const updatedFriendList = await fetchFriendList();
				const updatedFriendListHtml = updatedFriendList.map(friend => `<li>${friend.name} - ${friend.isOnline ? 'Online' : 'Offline'}</li>`).join('');
				friendListContainer.innerHTML = `<ul>${updatedFriendListHtml}</ul>`;
			}, 5000);

			isFriendListVisible = true;
		} catch (error) {
            friendListContainer.innerHTML = `<p>친구 목록을 불러오지 못했습니다</p>`;
        }
		// 친구 추가 버튼 추가
		friendListContainer.innerHTML += renderAddFriendForm();
		friendListContainer.classList.add('visible');
        isFriendListVisible = true;
	}
	else {
		// 친구 목록 숨기기
		// friendListContainer.style.display = 'none';
		clearInterval(friendListUpdateInterval); // 업데이트 중지
		friendListContainer.classList.remove('visible');
		isFriendListVisible = false;
	}
};

async function fetchFriendList() {
    try {
        const response = await fetch('/friendList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: myApp.root.userinfo.id }),
        });
        if (!response.ok) {
            throw new Error('친구 목록을 불러오지 못했습니다');
        }
        return await response.json();
    } catch (error) {
        console.error('친구 목록을 불러오지 못했습니다', error);
        throw error;
    }
};

window.addFriend = async function() {
    const friendIdInput = document.getElementById('friendIdInput');
    const friendId = friendIdInput.value.trim(); // 입력된 아이디 가져오기

    // 입력된 아이디가 비어있는지 확인
    if (!friendId) {
        alert('친구의 아이디를 입력하세요');
        return;
    }

    try {
        // 서버에 친구 추가 요청 보내기
        const response = await fetch('/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: myApp.root.userinfo.id, // 현재 사용자 아이디
                friendId: friendId, // 추가할 친구의 아이디
            }),
        });

        if (!response.ok) {
            throw new Error('친구 추가에 실패했습니다');
        }

        // 성공 시 알림 출력
        alert('친구가 추가되었습니다');
    } catch (error) {
        console.error('친구 추가에 실패했습니다', error);
        alert('친구 추가에 실패했습니다');
    }

    // 입력 폼 초기화
    friendIdInput.value = '';
};

window.logout = function() {
    console.log("Logging out...");
	myApp.root.auth = false;
	myApp.root.token = '';
	sessionStorage.removeItem('auth');
    sessionStorage.removeItem('token');
    myApp.setState({ locate: '/' });
};

const myApp = new app();
myApp.initPopStateEvent();