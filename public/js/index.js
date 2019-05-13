'use strict';

;(function () {

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;

    window.isFullScreen = false;
})();(function () {

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    var device = isAndroid || isiOS;
    window.device = function (device) {
        if (device) {
            if (isiOS) {
                return 'iOS';
            } else {
                return 'Android';
            }
        } else {
            return 'PC';
        }
    }(device);
})();(function () {

    var player = document.querySelector('#player');
    var playToggle = document.querySelector('.jsPlayToggle');
    var playIcon = playToggle.querySelector('i');
    var volumeMuteToggle = document.querySelector('.jsMuteToggle');
    var volumeRange = document.querySelector('.jsVolumeRange');
    var speedBtn = document.querySelector('.jsSpeed');
    //
    var progress = document.querySelector('.jsProgress');
    var progressFilled = progress.querySelector('.jsProgressFilled');
    //
    var fullScreen = document.querySelector('.jsFullScreen');
    //
    var playerTime = document.querySelector('.player-time');
    var timeNow = playerTime.querySelector('.jsTimeNow');
    var timeAll = playerTime.querySelector('.jsTimeAll');
    var percentage = 0,
        speedArray = [1, 1.25, 1.5, 1.75, 2],
        speed = 1,
        request;

    function uploadTimeNowHandler(currentTime) {
        var time, hh, mm, ss;
        currentTime = ~~currentTime;
        hh = ~~(currentTime / 3600);
        mm = ~~((currentTime - hh * 3600) / 60);
        ss = currentTime - hh * 3600 - mm * 60;

        mm = mm > 9 ? mm : '0' + mm;
        ss = ss > 9 ? ss : '0' + ss;
        time = hh ? hh + ':' + mm + ':' + ss : mm + ':' + ss;

        return time;
    }

    function uploadTimeAllHandler(duration) {
        var time, hh, mm, ss;
        duration = ~~duration;
        hh = ~~(duration / 3600);
        mm = ~~((duration - hh * 3600) / 60);
        ss = duration - hh * 3600 - mm * 60;

        mm = mm > 9 ? mm : '0' + mm;
        ss = ss > 9 ? ss : '0' + ss;
        time = hh ? hh + ':' + mm + ':' + ss : mm + ':' + ss;

        return time;
    }

    function uploadTimeHandler() {
        if (!player.paused) {
            // 更新播放時間
            timeNow.innerText = uploadTimeNowHandler(player.currentTime);

            // 更新播放進度
            percentage = player.currentTime / player.duration * 100;
            progressFilled.style.width = percentage + '%';

            request = requestAnimationFrame(uploadTimeHandler);
        }
    };

    function playPauseHandler(e) {
        var target = e.target;
        if (isFullScreen && target === player) return;
        if (player.paused) {
            player.play();
            request = requestAnimationFrame(uploadTimeHandler);
            playIcon.className = 'fas fa-pause';
        } else {
            player.pause();
            cancelAnimationFrame(request);
            playIcon.className = 'fas fa-play';
        }
    };

    function volumeChangeHamdler() {
        player.volume = this.value;
    };

    function volumeMuteHandler() {
        var volume = player.volume;
        if (volume) {
            this.dataset.lastVolume = volume;
            player.volume = volumeRange.value = 0;
        } else {
            player.volume = volumeRange.value = this.dataset.lastVolume;
        }
    };

    function upLoadProgressHandler(e) {
        var num = e.offsetX / progress.offsetWidth,
            scrubTime;
        percentage = num * 100;
        scrubTime = num * player.duration;

        player.currentTime = scrubTime;
        progressFilled.style.width = percentage + '%';

        timeNow.innerText = uploadTimeNowHandler(player.currentTime);
    };

    function fullScreenHandler() {
        var requestFullscreen = player.requestFullscreen || player.webkitRequestFullScreen || player.mozRequestFullScreen || player.msRequestFullscreen;
        player.requestFullscreen = requestFullscreen;
        player.requestFullscreen();
    }

    // 事件綁定
    playToggle.addEventListener('click', playPauseHandler);

    progress.addEventListener('click', upLoadProgressHandler);
    progress.addEventListener('mousedown', upLoadProgressHandler);

    volumeMuteToggle.addEventListener('click', volumeMuteHandler);
    volumeRange.addEventListener('change', volumeChangeHamdler);
    volumeRange.addEventListener('mousemove', volumeChangeHamdler);

    speedBtn.addEventListener('click', function () {
        var num;
        switch (speed) {
            case speedArray[0]:
                num = speedArray[1];
                break;
            case speedArray[1]:
                num = speedArray[2];
                break;
            case speedArray[2]:
                num = speedArray[3];
                break;
            case speedArray[3]:
                num = speedArray[4];
                break;
            case speedArray[4]:
                num = speedArray[0];
                break;
        }
        this.innerText = '\xD7' + num;
        player.playbackRate = speed = num;
    });

    fullScreen.addEventListener('click', fullScreenHandler);

    player.addEventListener('click', playPauseHandler);
    player.addEventListener('volumechange', function () {
        var volume = this.volume;
        var icon = volumeMuteToggle.classList;
        volumeRange.value = this.volume;
        if (volume > 0.6) {
            icon.remove('fa-volume-off', 'fa-volume-down');icon.add('fa-volume-up');
        } else if (volume <= 0.6 && volume > 0) {
            icon.remove('fa-volume-off', 'fa-volume-up');icon.add('fa-volume-down');
        } else {
            icon.remove('fa-volume-down', 'fa-volume-up');icon.add('fa-volume-off');
        }
    });
    player.addEventListener('timeupdate', function () {
        timeNow.innerText = uploadTimeNowHandler(player.currentTime);
        if (player.currentTime === player.duration) {
            playIcon.className = 'fas fa-redo';
        }
    });
    player.addEventListener('loadeddata', function () {
        timeAll.innerText = uploadTimeAllHandler(player.duration);
        timeNow.innerText = uploadTimeNowHandler(player.currentTime);
    });

    document.addEventListener('fullscreenchange', function () {
        if (isFullScreen) isFullScreen = false;else isFullScreen = true;
    });

    // 初始化設定
    document.documentElement.classList.add(device);
})();