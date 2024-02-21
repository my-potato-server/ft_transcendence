// src/apps/styles/mainstyle.js

export default function injectMainStyles() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: black; /* 검정 배경색 */
        background-image: url('https://cdn.pixabay.com/photo/2017/07/25/19/27/star-2539245_1280.jpg'); /* 이미지 파일 경로 */
        background-size: cover;
        background-repeat: no-repeat;
        background-attachment: fixed;
        position: relative;
    }
    `;
    document.head.appendChild(style);
}