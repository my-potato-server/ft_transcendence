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

export function LoginButton() {
	console.log("Login");
	return `
		<div class="login">
			<div class="login__container">
				<h1>Login</h1>
				<form action="/login" method="POST">
					<input type="text" name="id" placeholder="ID" />
					<input type="password" name="password" placeholder="Password" />
					<input type="submit" value="Log In" />
				</form>
				<a href="/signup">Sign up</a>
			</div>
		</div>
	`
}