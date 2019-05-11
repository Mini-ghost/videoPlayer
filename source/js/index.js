; (function () {

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

})()

; (function () {
    
    var player = document.querySelector('#player');
    var playToggle = document.querySelector('.jsPlayToggle');
    var volumeMuteToggle = document.querySelector('.jsMuteToggle');
    var volumeRange = document.querySelector('.jsVolumeRange');
    //
    var progress = document.querySelector('.jsProgress')
    var progressFilled = progress.querySelector('.jsProgressFilled')
    //
    var fullScreen = document.querySelector('.jsFullScreen')
    //
    var playerTime = document.querySelector('.player-time');
    var timeNow = playerTime.querySelector('.jsTimeNow');
    var timeAll = playerTime.querySelector('.jsTimeAll');
    var percentage = 0, request


    function uploadTimeNowHandler(currentTime) {
        var time, hh, mm, ss;
        currentTime = ~~currentTime;
        hh = ~~(currentTime / 3600);
        mm = ~~((currentTime - (hh * 3600)) / 60);
        ss = currentTime - (hh * 3600) - (mm * 60);

        mm = mm > 9 ? mm : '0' + mm;
        ss = ss > 9 ? ss : '0' + ss;
        time = hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
        
        return time;
    }

    function uploadTimeAllHandler(duration) {
        var time, hh, mm, ss;
        duration = ~~duration;
        hh = ~~(duration / 3600);
        mm = ~~((duration - (hh * 3600)) / 60);
        ss = duration - (hh * 3600) - (mm * 60);

        mm = mm > 9 ? mm : '0' + mm;
        ss = ss > 9 ? ss : '0' + ss;
        time = hh ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;
        
        return time;
    }

    function uploadTimeHandler() {
        if (!player.paused) {
            // 更新播放時間
            timeNow.innerText = uploadTimeNowHandler(player.currentTime);

            // 更新播放進度
            percentage = (player.currentTime / player.duration) * 100
            progressFilled.style.width = `${percentage}%`

            request = requestAnimationFrame(uploadTimeHandler);
        }
    };

    function playPauseHandler() {
        if (player.paused) {
            request = requestAnimationFrame(uploadTimeHandler)
            player.play();
        }
        else {
            player.pause();
            cancelAnimationFrame(request)
        }
    };

    function volumeChangeHamdler() {
        player.volume = this.value
    };

    function volumeMuteHandler() {
        var volume = player.volume
        if (volume) {
            this.dataset.lastVolume = volume;
            player.volume = volumeRange.value = 0;
        }
        else {
            player.volume = volumeRange.value = this.dataset.lastVolume;
        }
    };


    function upLoadProgressHandler(e) {
        var num = (e.offsetX / progress.offsetWidth), scrubTime
        percentage = num * 100;
        scrubTime = num * player.duration;

        player.currentTime = scrubTime;
        progressFilled.style.width = `${percentage}%`;

        timeNow.innerText = uploadTimeNowHandler(player.currentTime);
    };

    function fullScreenHandler() {
        var requestFullscreen = player.requestFullscreen || player.mozRequestFullScreen || player.mozRequestFullScreen || player.msRequestFullscreen
        player.requestFullscreen = requestFullscreen
        player.requestFullscreen()
    }


    // 事件綁定
    playToggle.addEventListener('click', playPauseHandler)

    progress.addEventListener('click', upLoadProgressHandler)
    progress.addEventListener('mousedown', upLoadProgressHandler)


    volumeMuteToggle.addEventListener('click',volumeMuteHandler)
    volumeRange.addEventListener('change', volumeChangeHamdler)
    volumeRange.addEventListener('mousemove', volumeChangeHamdler)

    fullScreen.addEventListener('click', fullScreenHandler)


    player.addEventListener('click', playPauseHandler);
    player.addEventListener('volumechange', function () {
        volumeRange.value = this.volume
    })
    player.addEventListener('timeupdate', function () {
        TimeNow.innerText = uploadTimeNowHandler(player.currentTime);
    })
    player.addEventListener('loadeddata', function () {
        timeAll.innerText = uploadTimeAllHandler(player.duration);
        timeNow.innerText = uploadTimeNowHandler(player.currentTime);    
    })


})()