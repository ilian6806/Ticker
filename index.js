(function() {

    function secondsToTime(sec) {

        var secNum = parseInt(sec, 10);
        var colon = ':';
        var days = Math.floor(secNum / 86400);
        var hours = Math.floor((secNum - days * 86400) / 3600);
        var minutes = Math.floor((secNum - (hours * 3600) - (days * 86400)) / 60);
        var seconds = secNum - (days * 86400) - (hours * 3600) - (minutes * 60);

        if (days > 0) { hours += (days * 24); }

        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        return hours + colon + minutes + colon + seconds;
    }

    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var tickerSetting = {

        name: 'useTicker',
        checkBox: document.getElementById('use-it-check'),

        get: function () {
            return localStorage.getItem(this.name) == 'true';
        },
        set: function (value) {
            var strVal = value ? 'true' : 'false';
            localStorage.setItem(this.name, strVal);
            this.checkBox.setAttribute('checked', strVal);
            this.checkBox.checked = !!value;
        },
        init: function () {

            var self = this;

            if (!localStorage.getItem(this.name)) {
                this.set(false);
            } else {
                this.set(this.get());
            }

            this.checkBox.onchange = function () {
                self.set(this.checked);
                window.location.reload();
            };

            return this;
        }
    };

    var isUsed = tickerSetting.init().get();

    var container = document.getElementById('container');

    var ticker = new Ticker();
    var timers = [];

    // generate random timer times
    for (var i = 1000; i >= 1; i--) {
        timers.push(rand(10000, 70000));
    }

    // ignite timers
    for (var i = 0, len = timers.length; i < len; i++) {

        var time = timers[i];
        var timerEL = document.createElement('div');
        timerEL.className = 'timer';
        container.appendChild(timerEL);

        (function(tEl, tTime) {
            if (isUsed) {
                ticker.set(function () {
                    tEl.innerHTML = secondsToTime(tTime--);
                });
            } else {
                setInterval(function () {
                    tEl.innerHTML = secondsToTime(tTime--);
                }, 1000);
            }
        }(timerEL, time));
    }
})();