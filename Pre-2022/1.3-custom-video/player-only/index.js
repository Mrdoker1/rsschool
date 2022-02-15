const controls = {
    playButton: document.querySelector('.video-icon'),
    playButtonControl: document.querySelector('.play-icon'),
    volumeButtonControl: document.querySelector('.volume-icon'),
    maximizeButtonControl: document.querySelector('.maximize-icon'),
    volumeControl: document.querySelector('.volume'),
    progressControl: document.querySelector('.progress'),
    playerTime: document.querySelector('.video-player-time'),
    video: document.querySelector('.viewer'),
    videoPlayer: document.querySelector('.video-player'),
    controlBar: document.querySelector('.control-bar'),
    videoThumbnail: document.querySelector('.video-player-thumbnail')
}

controls['video'].addEventListener('click', togglePlay);
controls['playButton'].addEventListener('click', togglePlay);
controls['playButtonControl'].addEventListener('click', togglePlay);
controls['volumeButtonControl'].addEventListener('click', toggleVolume);
controls['volumeControl'].addEventListener('click', setVolumeBar);
controls['volumeControl'].addEventListener('mousemove', setVolumeBar);
controls['progressControl'].addEventListener('click', setProgress);
// controls['progressControl'].addEventListener('mousedown', setProgress);
controls['maximizeButtonControl'].addEventListener('click', toggleFullScreen);

let videoDuration = controls['video'].duration;
let videoDurationMin = Math.floor(controls['video'].duration / 60);
let videoDurationSec = videoDuration > 60 ? Math.round(videoDuration) - (videoDurationMin * 60) : videoDuration;
let interval;

setProgress();
setVolume();

function updatePlayButton() {
    controls['playButton'].classList.toggle('hidden');
}

function updatePlayButtonControl() {
    controls['playButtonControl'].classList.toggle('pause-icon');
}

function updateVolumeButton() {
    controls['volumeButtonControl'].classList.toggle('mute-icon');
}

function togglePlay() {
    const method = controls['video'].paused ? 'play' : 'pause';
    controls['video'][method]();

    updatePlayButton();
    updatePlayButtonControl();

    if (method == 'pause') {
        clearInterval(interval);
        controls['controlBar'].classList.remove('hidden');
    } else {
        controls['controlBar'].classList.add('hidden');
        controls['videoThumbnail'].classList.add('hidden');
        interval = setInterval(progressController, 1000);
    }
}

function toggleVolume() {

    let volume = localStorage.getItem('video-player-volume');

    if (controls['video'].volume == 0 && localStorage.getItem('video-player-volume') != 0) {

        controls['video'].volume = volume;
        controls['volumeControl'].value = Math.floor(volume * 100);
        controls['volumeControl'].style.background = `linear-gradient(to right, #ffffff ${volume * 100}%, #ffffff ${volume * 100}%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.30)100%)`;
    } else if (volume != 0) {

        controls['video'].volume = 0;
        controls['volumeControl'].value = 0;
        controls['volumeControl'].style.background = `linear-gradient(to right, #ffffff 0%, #ffffff 0%, rgba(255, 255, 255, 0.30) 0%, rgba(255, 255, 255, 0.30)100%)`;
    }

    updateVolumeButton();

}

function setProgress() {

    const percent = controls['progressControl'].value;
    controls['video'].currentTime = Math.floor((videoDuration * percent) / 100);

    controls['progressControl'].style.background = `linear-gradient(to right, #d8c488 0%, #d8c488 ${percent}%, rgba(255, 255, 255, 0.30) ${percent}%, rgba(255, 255, 255, 0.30)100%`;
    setPlayerTime();
}

function setProgressBar() {

    const currentTime = controls['video'].currentTime;
    const percent = Math.floor(100 * currentTime / videoDuration);

    controls['progressControl'].style.background = `linear-gradient(to right, #d8c488 0%, #d8c488 ${percent}%, rgba(255, 255, 255, 0.30) ${percent}%, rgba(255, 255, 255, 0.30)100%`;
    controls['progressControl'].value = percent;
}



function setVolume() {

    let volume = localStorage.getItem('video-player-volume') * 100;

    controls['video'].volume = volume / 100;
    controls['volumeControl'].value = volume;
    controls['volumeControl'].style.background = `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, rgba(255, 255, 255, 0.30) ${volume}%, rgba(255, 255, 255, 0.30)100%)`;
}


function setVolumeBar() {

    let controlValue = controls['volumeControl'].value;
    controls['video'].volume = controls['volumeControl'].value / 100;
    controls['volumeControl'].style.background = `linear-gradient(to right, #ffffff 0%, #ffffff ${controlValue}%, rgba(255, 255, 255, 0.30) ${controlValue}%, rgba(255, 255, 255, 0.30)100%)`;

    localStorage.setItem('video-player-volume', controls['video'].volume);
}

function toggleFullScreen() {
    if (controls['video'].requestFullscreen) {
        controls['video'].requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        controls['video'].mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        controls['video'].webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        controls['video'].msRequestFullscreen();
    }
}

function progressController() {
    setProgressBar();
    setPlayerTime();
}

function setPlayerTime() {
    let currentTime = controls['video'].currentTime;
    let currentTimeMin = Math.floor(currentTime / 60);
    let currentTimeSec = currentTime > 60 ? Math.round(currentTime) - (currentTimeMin * 60) : Math.round(currentTime);

    currentTimeSec = currentTimeSec < 10 ? `0${currentTimeSec}` : currentTimeSec;

    controls['playerTime'].textContent = `${currentTimeMin}:${currentTimeSec} / ${videoDurationMin}:${Math.round(videoDurationSec)}`;
}