// src/apps/styles/loginstyle.js

export default function injectLoginStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: black; /* 검정 배경색 */
        background-image: url('https://image.cdn2.seaart.ai/2023-09-10/16740447494922245/187eca3f3b8066882d7cdde0ed7028fcea41b6df_high.webp'); /* 이미지 파일 경로 */
        background-size: cover;
        background-position: top;
        background-repeat: no-repeat;
        background-attachment: fixed;
        height: 100vh;
        position: relative; /* 컨테이너의 위치 기준으로 설정 */
    }

    .container {
        padding: 20px;
        position: absolute; /* 절대 위치 설정 */
        top: 50%; /* 화면 상단에서 50% 지점에 배치 */
        left: 50%; /* 화면 왼쪽에서 50% 지점에 배치 */
        transform: translate(-50%, -50%); /* 수평 및 수직으로 50%만큼 이동하여 가운데 정렬 */
        background-color: rgba(255, 255, 255, 0.1); /* 카드 배경색과 투명도 조정 */
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .card {
        background-color: rgba(255, 255, 255, 0.2); /* 카드 배경색과 투명도 조정 */
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }

    .card-body {
        padding: 20px;
    }

    input[type="text"],
    input[type="password"] {
        background-color: rgba(255, 255, 255, 0.2); /* 입력 필드 배경색과 투명도 조정 */
        border: none;
        border-radius: 4px;
        padding: 10px;
        margin-bottom: 10px;
    }

    button {
        cursor: pointer;
    }
    `;
    document.head.appendChild(style);
}

