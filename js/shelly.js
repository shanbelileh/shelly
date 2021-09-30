(function ($) {
    $.fn.shell = function (options) {
        var defaults = {
            color: "white",
            BackgroundColor: "#556b2f",
            User: "User",
            Website: "Website",
            Server: "Server",
            Client: "Client",
            enableGlitch: true

        };
        var settings = $.extend({}, defaults, options);
        if (this.length > 1) {
            this.each(function () {
                $(this).pluginName(options)
            });
            return this;
        }

        // private variables
        var $this;
        var lineIndex = 1;
        var queue = new Queue();
        var registeredCommands = [];
        var previouscommands = [];
        var currentcommand = 0;
        var timestring;
        var fallbackFn;
        // private methods
        var setupKeydown = function () {
            var ctrldown = false;
            $(".editline .edit").keydown(function (e) {
                var text = $this.find('.editline .edit').text();
                if (e.which === 13 && text !== "" && !ctrldown) {
                    e.preventDefault();
                    var commands = text.split(' ');
                    $this.find(".editline .edit").text("");
                    $this.print(settings.User, text, 1);
                    previouscommands[currentcommand] = text;
                    currentcommand = previouscommands.length;
                    var event = jQuery.Event("keydown");
                    event.which = 35;//end
                    $this.find(".editline .edit").trigger(event);
                    processCommand(commands[0], text, commands);
                }
                if (e.which === 13 && text === "") {
                    e.preventDefault();
                }
                if (e.which === 38) { //up
                    if (currentcommand > 0) {
                        currentcommand--;
                        $this.find(".editline .edit").text(previouscommands[currentcommand]);
                        // move2End();
                    }
                }
                if (e.which === 40) { //down

                    if (currentcommand < previouscommands.length) {
                        currentcommand++;
                        $this.find(".editline .edit").text(previouscommands[currentcommand]);
                        // move2End();
                    }
                }
            });
        }
        var move2End = function () {
            var text = $this.find('.editline .edit').text();
            var tag = document.getElementById($this.attr('id'));
            var setpos = document.createRange();
            var set = window.getSelection();
            let childNode = tag.childNodes[2];
            setpos.setStart(childNode.childNodes[0], text.left);
            setpos.collapse(true);
            set.removeAllRanges();
            set.addRange(setpos);
            tag.focus();
        }
        var updateTime = function () {
            var d = new Date();
            var hours = d.getHours();
            var minutes = d.getMinutes();
            var seconds = d.getSeconds();
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            var temptimestring = "[" + hours + ":" + minutes + ":" + seconds + "]";
            if (temptimestring !== timestring) {
                timestring = temptimestring;
                $this.find(".editline .time").text(timestring);
            }
        }
        var processCommand = function (cmd, text, args) {
            let proc;
            for (i = 0; i < registeredCommands.length; i++) {
                proc = registeredCommands[i];
                if (cmd === proc.command) {
                    proc.method($this, text);
                    break;
                }
                proc = undefined;
            }

            if (!proc)
                if (fallbackFn) fallbackFn($this, cmd)
                else glitched(cmd)
        }

        var glitched = function (command) {
            let output = "R! Unrecognised command '" + command + "'.";
            $this.print(settings.Client, output, 5);
            if (settings.enableGlitch) $this.glitch();
        }

        var doWrite = function () {
            if (queue.isEmpty()) {
                setTimeout(doWrite, 500);
            } else {
                var item = queue.dequeue();
                __print(item);
            }
        }
        var __print = function (item) {
            let name = item.name;
            let information = item.text;
            let speed = item.speed;

            var d = new Date();
            var hours = ((d.getHours() < 10) ? "0" : "") + d.getHours();
            var minutes = ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes();
            var seconds = ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
            var colour = "whitet";
            var textcolour = "";
            var postcolour = "";

            switch (name[0]) {
                case "!":
                    postcolour = " important";
                    name = name.substr(1);
                    break;
            }
            switch (name) {
                case settings.Website:
                    colour = "redt";
                    break;
                case settings.Server:
                    colour = "redt";
                    break;
                case settings.Client:
                    colour = "bluet";
                    break;
                case settings.User:
                    colour = "greent";
                    postcolour = " selft";
                    break;
            }

            if (information.startsWith("A!")) {
                information = information.substr(2);
                information = information.replace(/ /g, '\u00A0');
            }
            if (information.startsWith("E!")) {
                information = information.substr(2);
                postcolour = " important";
            }
            if (information.startsWith("W!")) {
                information = information.substr(2);
                postcolour = " whitet";
            }
            if (information.startsWith("R!")) {
                information = information.substr(2);
                postcolour = " redt";
            }
            if (information.startsWith("B!")) {
                information = information.substr(2);
                postcolour = " bluet";
            }
            if (information.startsWith("G!")) {
                information = information.substr(2);
                postcolour = " greent";
            }
            if (information.startsWith("S!")) {
                information = information.substr(2);
                postcolour = " selft";
            }
            if (information.startsWith("K!")) {
                information = information.substr(2);
                postcolour = " smoked";
            }
            while (information.indexOf("](") >= 0) { //URL parser

                var NAMEregExp = /\(([^)]+)\)/;
                var uname = NAMEregExp.exec(information)[1];

                var URLregExp = /\[([^)]+)]/;
                var url = URLregExp.exec(information)[1];
                var newpage = false;
                if (url.startsWith("^")) {
                    newpage = true;
                    url = url.substr(1);
                }
                var start = information.indexOf("[");
                var end = information.indexOf(")");
                if (newpage) {
                    information = information.replace(information.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '" target="_blank">' + uname + '</a>');
                } else {
                    information = information.replace(information.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '">' + uname + '</a>');
                }
                //information = '<a href="' + url + '">' + uname + '</a>'; //working
            }
            var tobold = true;
            var boldnumber = 0;
            for (var i = 0; i < information.length; i++) {
                if (information[i] === "*" && information[i - 1] !== "*" && information[i + 1] !== "*") {
                    boldnumber++;
                }
            }
            while (information.indexOf("*") >= 0) { //Bold parser
                var pos = information.indexOf("*");
                information = information.replace("*", "");
                if (tobold) {
                    information = information.splice(pos, 0, '<b>');
                } else {
                    information = information.splice(pos, 0, '</b>');
                }
                tobold = !tobold;
                if (tobold && boldnumber <= 1) {
                    break;
                }
            }
            var tounderline = true;
            var underlinenumber = 0;
            for (var iu = 0; iu < information.length; iu++) {
                if (information[iu] === "*" && information[iu - 1] !== "*" && information[iu + 1] !== "*") {
                    underlinenumber++;
                }
            }
            while (information.indexOf("**") >= 0) { //underline parser
                var posu = information.indexOf("**");
                information = information.replace("**", "");
                if (tounderline) {
                    information = information.splice(posu, 0, '<u>');
                } else {
                    information = information.splice(posu, 0, '</u>');
                }
                tounderline = !tounderline;
                if (tounderline && underlinenumber <= 1) {
                    break;
                }
            }

            let time = hours + ":" + minutes + ":" + seconds;
            $this.find(".stream").append('<div class="line">' +
                '<p class="time">[' + time + ']</p>' +
                '<p class="name ' + colour + '">' + name + '</p>' +
                '<p class="information line-index-' + (lineIndex) + postcolour + '">' + information + '</p>' +
                '</div>');

            // $(document).scrollTop($(document).height() - $(window).height());
            $($this).scrollTop($(document).height() - $($this).height());
            $this.find('.line-index-' + (lineIndex)).textTyper({
                speed: speed,
                afterAnimation: function () {
                    doWrite();
                }
            });
            lineIndex++;
        }

        var setDefaultCommands = function () {
            $this.register("clear", function () {
                $this.find(".stream").text("");
            })
        }
        var prepare = function () {
            $this.empty().append('<div class="stream"></div>' +
                '    <div class="line editline">' +
                '        <p class="time"></p>' +
                '        <p class="name carrot fas fa-angle-right"><!--&gt;--></p>' +
                '        <p contenteditable="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"' +
                '           class="information edit"></p>' +
                '    </div>');

        }
        // public methods
        this.initialize = function () {
            $this = this;
            prepare();
            String.prototype.splice = function (idx, rem, str) {
                return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
            };
            setInterval(updateTime)
            setupKeydown();

            setDefaultCommands();
            doWrite();
            if (settings.startup) settings.startup($this)
            return this;
        };
        this.register = function (command, method) {
            registeredCommands.push({command: command, method: method});
        }
        this.fallback = function (fn) {
            fallbackFn = fn;
        }
        this.print = function (name = "", text, speed = 15) {
            queue.enqueue({name: name, text: text, speed: speed});
        }

        this.error = function (text) {
            let output = `R! ${text}`;
            $this.print(settings.Client, output, 5);
            if (settings.enableGlitch) this.glitch()
        }


        this.glitch = function () {
            setTimeout(function () {
                $this.find('.line').addClass('glitch');
                setTimeout(function () {
                    $this.find('.line').removeClass('glitch');
                }, 1000)
            }, 500);
        }

        return this.initialize();
    }
})(jQuery);