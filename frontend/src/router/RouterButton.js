export default function RouterButton() {
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
	return `
	<button onclick="printHeart()">하트 출력</button>
    <div id="heart"></div>

    <script>
        function printHeart() {
            var heart = "
  __  __
 /  \\/  \\
 \\     / 
  \\   /  
   \\ /   
    V
            ";
            document.getElementById("heart").innerText = heart;
        }
	`
};