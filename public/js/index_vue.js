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
    var vm = new Vue({
        el: '#app',
        data: function data() {
            return {
                // 陣列
                classData: new Array(),
                pathData: '',
                speedArray: [1, 1.25, 1.5, 1.75, 2],

                // 布林
                isFullScreen: false,

                // 數字
                volume: 1,
                speed: 1,

                // 特殊
                lastVolume: null,

                // 字串
                percentage: '',
                durationTime: '00:00',
                currentTime: '00:00'
            };
        },
        created: function created() {
            $.ajax({
                url: 'database/data.json',
                method: 'get',
                success: this.ajaxSuccessHandler
            });
        },
        mounted: function mounted() {
            var player = this.dom.player;

            // 瀏覽器兼容設定
            var requestFullscreen = player.requestFullscreen || player.webkitRequestFullScreen || player.mozRequestFullScreen || player.msRequestFullscreen;
            player.requestFullscreen = requestFullscreen;

            // 初始事件綁定
            player.addEventListener('loadeddata', this.loadeddataHandler);
        },
        methods: {
            ajaxSuccessHandler: function ajaxSuccessHandler(res) {
                this.classData = res;
                this.pathData = this.classData[0].file;
            },
            // 選單點擊
            videoSelectHandler: function videoSelectHandler(path) {
                this.pathData = path;
            },
            videoPalyHandler: function videoPalyHandler(e) {
                var target = e.target;
                var player = this.dom.player;

                if (this.isFullScreen && target === player) return;
                if (player.paused) {
                    player.play();
                    this.request = requestAnimationFrame(this.uploadTimeHandler);
                } else {
                    player.pause();
                    cancelAnimationFrame(this.request);
                }
            },
            uploadTimeHandler: function uploadTimeHandler() {
                var player = this.dom.player;
                if (!player.paused) {
                    // 更新播放時間
                    this.currentTime = this.uploadTimeNowHandler(player.currentTime);
                    // 更新播放進度
                    this.percentage = player.currentTime / player.duration * 100;
                    this.request = requestAnimationFrame(this.uploadTimeHandler);
                }
            },
            uploadTimeNowHandler: function uploadTimeNowHandler(currentTime) {
                var time, hh, mm, ss;
                currentTime = ~~currentTime;
                hh = ~~(currentTime / 3600);
                mm = ~~((currentTime - hh * 3600) / 60);
                ss = currentTime - hh * 3600 - mm * 60;

                mm = mm > 9 ? mm : '0' + mm;
                ss = ss > 9 ? ss : '0' + ss;
                time = hh ? hh + ':' + mm + ':' + ss : mm + ':' + ss;

                return time;
            },
            uploadTimeAllHandler: function uploadTimeAllHandler(duration) {
                var time, hh, mm, ss;
                duration = ~~duration;
                hh = ~~(duration / 3600);
                mm = ~~((duration - hh * 3600) / 60);
                ss = duration - hh * 3600 - mm * 60;

                mm = mm > 9 ? mm : '0' + mm;
                ss = ss > 9 ? ss : '0' + ss;
                time = hh ? hh + ':' + mm + ':' + ss : mm + ':' + ss;

                return time;
            },
            loadeddataHandler: function loadeddataHandler() {
                var dom = this.dom;
                var player = dom.player;
                this.durationTime = this.uploadTimeAllHandler(player.duration);
            },
            volumeChangeHamdler: function volumeChangeHamdler() {
                this.dom.player.volume = this.volume;
            },
            fullScreenHandler: function fullScreenHandler() {
                this.dom.player.requestFullscreen();
            },
            speedHandler: function speedHandler() {
                var speedArray = this.speedArray,
                    player = this.dom.player;
                switch (this.speed) {
                    case speedArray[0]:
                        player.playbackRate = this.speed = speedArray[1];
                        break;
                    case speedArray[1]:
                        player.playbackRate = this.speed = speedArray[2];
                        break;
                    case speedArray[2]:
                        player.playbackRate = this.speed = speedArray[3];
                        break;
                    case speedArray[3]:
                        player.playbackRate = this.speed = speedArray[4];
                        break;
                    case speedArray[4]:
                        player.playbackRate = this.speed = speedArray[0];
                        break;
                }
                // this.dom.player.playbackRate = this.speed
            },
            volumeMuteHandler: function volumeMuteHandler() {
                var volume = this.dom.player.volume;
                if (volume) {
                    this.lastVolume = volume;
                    this.dom.player.volume = this.volume = 0;
                } else {
                    this.dom.player.volume = this.volume = this.lastVolume;
                }
            },
            upLoadProgressHandler: function upLoadProgressHandler(e) {
                var dom = e.currentTarget;
                var num = e.offsetX / dom.offsetWidth,
                    scrubTime;
                scrubTime = num * this.dom.player.duration;
                this.dom.player.currentTime = scrubTime;
                this.currentTime = this.uploadTimeNowHandler(this.dom.player.currentTime);
                this.percentage = num * 100;
            }
        },
        computed: {
            path: function path() {
                return 'upload/' + this.pathData;
            },
            dom: function dom() {
                return {
                    player: document.getElementById('player'),
                    nav: document.querySelector('.nav-unit'),
                    timeNow: document.querySelector('.jsTimeNow'),
                    timeAll: document.querySelector('.jsTimeAll'),
                    progressFilled: document.querySelector('.jsProgressFilled')
                };
            }
        }
    });
})();