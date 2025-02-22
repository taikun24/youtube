let canvas, imgUrl, favicon, ctx, video, info;
function copyCanvasToFavicon() {
    imgUrl = canvas.toDataURL('image/png');
    favicon.href = imgUrl;
}
function captureVideo() {
    ctx.
        drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
}
const fps = 30;
function refresh() {
    captureVideo();
    copyCanvasToFavicon();
    info.innerText = 'Frame:' + Math.floor(video.currentTime * fps) + 'f'
        + ', Fps:' + fps + ', OK';
}
let interval = null;
function play() {
    video.play();
    interval = setInterval(refresh, 1000 / fps);
}
function stop() {
    video.pause();
    if (interval !== null) clearInterval(interval);
    interval = null;
}
window.onload = function () {
    canvas = document.getElementById('canvas');
    favicon = document.getElementById('favicon');
    ctx = canvas.getContext('2d');
    video = document.getElementById('video');
    ctx.crossOrigin = "anonymous";
    info = document.getElementById('info');
}