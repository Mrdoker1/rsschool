let controls
let videoDuration
let videoDurationText
let interval
let options = {}

window.addEventListener('load', () => {
    /* Getting nodes of required elements */
    controls = {
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

    /* Default and init values */
    options.isFirst = true
    options.isPlayed = false
    options.isDrag = false
    options.volumeIsDrag = false
    options.precision = 4
    options.precisionValue = Math.pow(10, -options.precision)
    options.isMobile = isMobile();
    if (options.isMobile) {
        controls.volumeControl.classList.add('touch');
    }
    options.getPercent = options.isMobile ? getPercentMobile : getPercentDesktop

    options.events = {
        'mousedown': options.isMobile ? 'touchstart' : 'mousedown',
        'mouseup': options.isMobile ? 'touchend' : 'mouseup',
        'mousemove': options.isMobile ? 'touchmove' : 'mousemove',
        'click': options.isMobile ? 'click' : 'click',
    }

    controls.progressControl.setAttribute("step", options.precisionValue.toFixed(options.precision))

    /* Set event listeners */
    /* volume handlers */
    controls.volumeButtonControl.addEventListener(options.events.click, volumeToggle)
    controls.volumeControl.addEventListener(options.events.mousedown, volumePressedHandler)
    controls.volumeControl.addEventListener(options.events.mousemove, volumeDragHandler)
    controls.volumeControl.addEventListener(options.events.mouseup, volumeReleasedHandler)
        /* input[range] aka progressControl handlers */
    controls.progressControl.addEventListener(options.events.mousedown, progressMousePressedHandler)
    controls.progressControl.addEventListener(options.events.mouseup, progressMouseReleasedHandler)
    controls.progressControl.addEventListener(options.events.mousemove, progressDragHandler)
        /* Adding handler for pressing space */
    window.addEventListener(options.events.mousedown, shortcutHandler)
        /* Video handlers */
    controls.video.addEventListener(options.events.click, videoTogglePlayHandler)
    controls.playButton.addEventListener(options.events.click, videoTogglePlayHandler)
    controls.playButtonControl.addEventListener(options.events.click, videoTogglePlayHandler)
    controls.maximizeButtonControl.addEventListener(options.events.mousedown, toggleFullScreen)

    setCurrentProgress(0)
    setVolume()
})

/* Volume and other volume handlers */

function updateVolumeButton(method) {

    if (method == 'off') {
        controls.volumeButtonControl.classList.add('mute-icon')
        controls.volumeButtonControl.classList.remove('volume-icon')
    } else if (method == 'on') {
        controls.volumeButtonControl.classList.add('volume-icon')
        controls.volumeButtonControl.classList.remove('mute-icon')
    }
}

function volumePressedHandler(e) {
    options.volumeIsDrag = true
    saveVolume(options.getPercent(e, this))
}

function volumeReleasedHandler(e) {
    options.volumeIsDrag = false
    saveVolume(options.getPercent(e, this))
}

function volumeDragHandler(e) {
    if (options.volumeIsDrag) {
        saveVolume(options.getPercent(e, this))
    }
}

function saveVolume(value) {
    value = value > 100 ? 100 : value < 0 ? 0 : value.toFixed();
    if (value != 0) {
        volumeOn(value)
        localStorage.setItem('video-player-volume', value)
    } else {
        volumeOff()
    }
}

function volumeToggle(e) {
    if (controls.video.volume == 0) {
        volumeOn(localStorage.getItem('video-player-volume'))
    } else {
        volumeOff()
    }
}

function volumeOn(value) {
    setVolume(value)
    updateVolumeButton('on');
}

function volumeOff() {
    setVolume(0);
    updateVolumeButton('off');
}

function setVolume(value) {
    if (value > 0) {
        controls.video.volume = value / 100
        setVolumeBar(value)
    } else if (value == 0) {
        controls.video.volume = 0
        setVolumeBar(0)
    } else if (localStorage.getItem('video-player-volume')) {
        controls.video.volume = localStorage.getItem('video-player-volume') / 100
        setVolumeBar(localStorage.getItem('video-player-volume'))
    } else {
        controls.video.volume = 1
        setVolumeBar(100)
    }
}

function setVolumeBar(value) {
    controls.volumeControl.style.background = `linear-gradient(to right, #ffffff 0%, #ffffff ${value}%, rgba(255, 255, 255, 0.30) ${value}%, rgba(255, 255, 255, 0.30)100%)`
    controls.volumeControl.value = value
}
/* Video controllers and handlers with progress bar controllers/handlers */

function pause() {
    controls.video.pause()
    clearInterval(interval)

    controls.controlBar.classList.remove('hidden')
    controls.playButton.classList.remove("hidden")
    controls.playButtonControl.classList.remove("pause-icon")

    updateProgressBarView(controls.progressControl.value)
    updatePlayerTime()
}

function play() {
    videoDuration = controls.video.duration
    videoDurationText = getTimeInFormat(videoDuration)
    controls.video.play()
    interval = setInterval(progressController, 10)

    controls.controlBar.classList.add('hidden')
    controls.videoThumbnail.classList.add('hidden')
    controls.playButton.classList.add("hidden")
    controls.playButtonControl.classList.add("pause-icon")

    updateProgressBarView(controls.progressControl.value)
    updatePlayerTime()
}

function progressController() {
    let percent = getPercent(controls.video.currentTime, videoDuration, options.precision)
    controls.progressControl.value = percent

    updateProgressBarView(percent)
    updatePlayerTime()
}

function videoTogglePlayHandler(e) {
    if (controls.video.paused) {
        play()
    } else {
        pause()
    }
}

// mouse down event
function progressMousePressedHandler(e) {
    options.videoWasPaused = controls.video.paused
    options.isDrag = true
    pause()
    setCurrentProgress(options.getPercent(e, this), 'down')
}
// mouse up event
function progressMouseReleasedHandler(e) {
    options.isDrag = false
    if (!options.videoWasPaused) {
        play()
    }
    setCurrentProgress(options.getPercent(e, this), 'up')
}
// mouse move event
function progressDragHandler(e) {
    if (options.isDrag) {
        setCurrentProgress(options.getPercent(e, this), 'drag')
    }
}

function setCurrentProgress(percent, sender) {
    if (percent) {
        controls.progressControl.value = percent
        controls.video.currentTime = (percent * videoDuration) / 100
    }

    //console.log(percent, sender)

    updateProgressBarView(percent)
    updatePlayerTime()
}

function updateProgressBarView(percent) {
    controls.progressControl.style.background = `linear-gradient(to right, #d8c488 0%, #d8c488 ${percent}%, rgba(255, 255, 255, 0.30) ${percent}%, rgba(255, 255, 255, 0.30)100%`
}

function updatePlayerTime(time = controls.video.currentTime) {
    controls.playerTime.textContent = `${getTimeInFormat(time)} / ${videoDurationText}`
}

/* Other functionality */

function toggleFullScreen() {
    if (controls.video.requestFullscreen) {
        controls.video.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
        controls.video.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
        controls.video.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
        controls.video.msRequestFullscreen()
    }
}

function shortcutHandler(e) {
    if (e.keyCode == 32) {
        e.preventDefault()
        videoTogglePlayHandler()
    }
}

/* Util functions */

function getTimeInFormat(timeInSec) {
    timeInSec = Math.floor(timeInSec)
    let sec = timeInSec % 60
    let min = Math.floor(timeInSec / 60) % 60
    let hour = Math.floor(timeInSec / 3600) % 24

    return (hour > 0 ? `${hour}:` : '') +
        (`${min < 10 && hour > 0? '0': ''}${min}:`) +
        (`${sec < 10? '0':''}${sec}`)
}

function getPercent(current, max, floatPart) {
    return parseFloat((current / max * 100).toFixed(floatPart))
}

function getPercentDesktop(event, element) {
    let clientRects = element.getClientRects()[0] || { x: 0, width: 1 }
    return getPercent(event.x - clientRects.x, clientRects.width, options.precision);
}

function getPercentMobile(event, element) {
    let clientRects = element.getClientRects()[0] || { x: 0, width: 1 }
    let touchX = event.changedTouches && event.changedTouches.length > 0 ? event.changedTouches[0].clientX : 0;
    return getPercent(touchX - clientRects.x, clientRects.width, options.precision);
}

function isMobile() {
    return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
}