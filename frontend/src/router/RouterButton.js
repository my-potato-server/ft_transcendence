export function RouterButton() {
	console.log("RouterButton");
	return `
		<button type="button" class="Mainpage">
			Mainpage
		</button>
		<button type="button" class="Signup">
			Signup
		</button>
		<button type="button" class="Login">
			Login
		</button>
	`
};

export function Heart() {
	console.log("Heart");
	return `
	<button onclick="printHeart()">하트 출력</button>
    <div id="heart"></div>
	`
};