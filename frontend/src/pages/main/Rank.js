// src/pages/main/Rank.js

import Component from "../../core/Component.js";
import RouterButton from "../../routers/RouterButton.js";
import RankButton from "../../routers/RankButton.js";

export default class Rank extends Component {
	constructor(ObjectForDI) {
		super(ObjectForDI.$parent, ObjectForDI.setState, ObjectForDI.state);

		this.rankinfos = {
			id : '',
			name : '',
			rank : 0,
			rwin : 0,
			rlose : 0,
			nwin : 0,
			nlose : 0,
			level : 0,
			exp : 0,
			mmr : 0,
			refresh : false
		}
	}

	template() {
		console.log("Rank template");
		return `
		${RouterButton('/src/pages/main/Rank')}
		${RankButton()}
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

		//
		// Rank
		//
		const ranking = this.$parent.querySelector('button[class="Ranking"]');
		if (ranking) {
			ranking.onclick = () => this.ranking();
		}
		const myrank = this.$parent.querySelector('button[class="MyRank"]');
		if (myrank) {
			myrank.onclick = () => this.myrank();
		}
		const rankgame = this.$parent.querySelector('button[class="RankGame"]');
		if (rankgame) {
			rankgame.onclick = () => this.rankgame();
		}
		//
		//
		//
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

	//
	// Rank
	//

	showMore(userId) {
		console.log("showMore");

		const moreinfoContainer = this.$parent.querySelector(`#${userId}`);

		if (moreinfoContainer && !moreinfoContainer.innerHTML.trim()) {
			fetch('/rankinfo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id : userId }),
			})
			.then(response => {
				if (response.ok) {
					console.log("랭크 정보 요청 성공");
					return response.json();
				} else {
					throw new Error('랭크 정보 요청 실패');
				}
			})
			.then(data => {
				this.rankinfos = data.id;
				this.rankinfos.name = data.name;
				this.rankinfos.rank = data.rank;
				this.rankinfos.rwin = data.rwin;
				this.rankinfos.rlose = data.rlose;
				this.rankinfos.nwin = data.nwin;
				this.rankinfos.nlose = data.nlose;
				this.rankinfos.level = data.level;
				this.rankinfos.exp = data.exp;
				this.rankinfos.mmr = data.mmr;

				const moreinfoContainer = this.$parent.querySelector(`#${userId}`);
				if (moreinfoContainer) {
					const infos = this.rankinfos;
					moreinfoContainer.innerHTML = `
						<pre>
							<h3>추가 정보</h3>
							<div>user : ${infos.id}</div>
							<div>name : ${infos.name}</div>
							<div>rank : ${infos.rank}</div>
							<div>rank win : ${infos.rwin}</div>
							<div>rank lose : ${infos.rlose}</div>
							<div>normal win : ${infos.nwin}</div>
							<div>normal lose : ${infos.nlose}</div>
							<div>level : ${infos.level}</div>
							<div>exp : ${infos.exp}</div>
							<div>mmr : ${infos.mmr}</div>
						</pre>`;
				}
			})
			.catch(error => {
				console.error('랭크 정보 요청 중 오류 발생:', error);
			});
		} else {
			// 이미 정보가 출력되어 있는 경우, 해당 컨테이너의 내용을 비워 감춥니다.
			if (moreinfoContainer) {
				moreinfoContainer.innerHTML = '';
			}
		}
	}

	myrank() {
		console.log("rankinfo");
		if (this.rankinfos.refresh) {
			console.log("refresh");
			this.rankinfos.refresh = false;
			this.myrank();
			// 서버에서 받아온 정보를 rankinfos에 저장.
		} else { // 서버에 랭크 정보 요청. (rank, win, lose, level, exp, mmr)
			this.rankinfos.refresh = true;
			fetch('/rankinfo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id : this.$parent.userinfo.id }),
			})
			.then(response => {
				if (response.ok) {
					console.log("랭크 정보 요청 성공");
					alert("랭크 정보 요청 성공");
					// 받은 정보를 출력
					const rankContainer = this.$parent.querySelector('#myrank');
					if (rankContainer) {
						const infos = this.rankinfos;
						rankContainer.innerHTML = `
						<pre>
							<h3>랭크 정보</h3>
							<div>user : ${infos.id}</div>
							<div>name : ${infos.name}</div>
							<div>rank : ${infos.rank}</div>
							<div>rank win : ${infos.rwin}</div>
							<div>rank lose : ${infos.rlose}</div>
							<div>normal win : ${infos.nwin}</div>
							<div>normal lose : ${infos.nlose}</div>
							<div>level : ${infos.level}</div>
							<div>exp : ${infos.exp}</div>
							<div>mmr : ${infos.mmr}</div>
						</pre>`;
					} else {
						console.log("랭크 정보 요청 실패");
						alert("랭크 정보 요청 실패");
					}
				} else {
						console.log("랭크 정보 요청 실패");
						alert("랭크 정보 요청 실패");
						this.rankinfos.refresh = true;
						//이하 테스트용. 전부 3으로 출력
						const rankContainer = this.$parent.querySelector('#myrank');
						if (rankContainer) {
							const infos = this.rankinfos;
							rankContainer.innerHTML = `
							<pre>
								<h3>랭크 정보</h3>
								<div>user : ${infos.id}</div>
								<div>name : ${infos.name}</div>
								<div>rank : 3</div>
								<div>rank win : 3</div>
								<div>rank lose : 3</div>
								<div>normal win : 3</div>
								<div>normal lose : 3</div>
								<div>level : 3</div>
								<div>exp : 3</div>
								<div>mmr : 3</div>
							</pre>`;
						}
					}
				})
				.catch(error => {
				console.error('랭크 정보 요청 중 오류 발생:', error);
				//이하 테스트용. 전부 3으로 출력
				alert("test error page");
				const rankContainer = this.$parent.querySelector('#myrank');
				if (rankContainer) {
					const infos = this.rankinfos;
					rankContainer.innerHTML = `
					<pre>
						<h3>랭크 정보</h3>
						<div>user : ${infos.id}</div>
						<div>name : ${infos.name}</div>
						<div>rank : 3</div>
						<div>rank win : 3</div>
						<div>rank lose : 3</div>
						<div>normal win : 3</div>
						<div>normal lose : 3</div>
						<div>level : 3</div>
						<div>exp : 3</div>
						<div>mmr : 3</div>
					</pre>`;
				}
			});
		}
	}

	ranking() {
		console.log("ranking");
		fetch('/getRanking', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => {
			if (response.ok) {
				console.log("랭킹 정보 요청 성공");
				return response.json();
			} else {
				throw new Error('랭킹 정보 요청 실패');
			}
		})
		.then(data => {
			const rankingContainer = this.$parent.querySelector('#ranking');
			if (rankingContainer) {
				const rankingList = data.ranking;

				let rankingHTML = '<pre><h3>랭킹 정보</h3>';
				for (let i = 0; i < rankingList.length; i++) {
					const user = rankingList[i];
					rankingHTML += `
						<div>
							<span>순위: ${i + 1}</span>
							<span>아이디: ${user.id}</span>
							<span>이름: ${user.name}</span>
							<button type="button" class="more-button" data-user-id="${user.id}>more</button>
						</div>
						`;
				}
				rankingHTML += '</pre>';
				rankingContainer.innerHTML = rankingHTML;

				const moreButtons = rankingContainer.querySelectorAll('.more-button');
				moreButtons.forEach(button => {
					button.addEventListener('click', event => {
						const userId = event.target.getAttribute('data-user-id');
						this.showMore(userId);
					});
				});
			}
		})
		.catch(error => {
			console.error('랭킹 정보 요청 중 오류 발생:', error);
		});
		}

	rankgame() {
		console.log("rankgame");
	}
}