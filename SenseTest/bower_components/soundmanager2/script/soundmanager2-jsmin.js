/** @license


 SoundManager 2: JavaScript Sound for the Web
 ----------------------------------------------
 http://schillmania.com/projects/soundmanager2/

 Copyright (c) 2007, Scott Schiller. All rights reserved.
 Code provided under the BSD License:
 http://schillmania.com/projects/soundmanager2/license.txt

 V2.97a.20140901
*/
(function(h, g) {
    function Q(P, Q) {
        function ha(b) {
            return c.preferFlash && F && !c.ignoreFlash && c.flash[b] !== g && c.flash[b]
        }

        function r(b) {
            return function(d) {
                var e = this._s;
                !e || !e._a ? (e && e.id ? c._wD(e.id + ": Ignoring " + d.type) : c._wD(sb + "Ignoring " + d.type), d = null) : d = b.call(this, d);
                return d
            }
        }
        this.setupOptions = {
            url: P || null,
            flashVersion: 8,
            debugMode: !0,
            debugFlash: !1,
            useConsole: !0,
            consoleOnly: !0,
            waitForWindowLoad: !1,
            bgColor: "#ffffff",
            useHighPerformance: !1,
            flashPollingInterval: null,
            html5PollingInterval: null,
            flashLoadTimeout: 1E3,
            wmode: null,
            allowScriptAccess: "always",
            useFlashBlock: !1,
            useHTML5Audio: !0,
            html5Test: /^(probably|maybe)$/i,
            preferFlash: !1,
            noSWFCache: !1,
            idPrefix: "sound"
        };
        this.defaultOptions = {
            autoLoad: !1,
            autoPlay: !1,
            from: null,
            loops: 1,
            onid3: null,
            onload: null,
            whileloading: null,
            onplay: null,
            onpause: null,
            onresume: null,
            whileplaying: null,
            onposition: null,
            onstop: null,
            onfailure: null,
            onfinish: null,
            multiShot: !0,
            multiShotEvents: !1,
            position: null,
            pan: 0,
            stream: !0,
            to: null,
            type: null,
            usePolicyFile: !1,
            volume: 100
        };
        this.flash9Options = {
            isMovieStar: null,
            usePeakData: !1,
            useWaveformData: !1,
            useEQData: !1,
            onbufferchange: null,
            ondataerror: null
        };
        this.movieStarOptions = {
            bufferTime: 3,
            serverURL: null,
            onconnect: null,
            duration: null
        };
        this.audioFormats = {
            mp3: {
                type: ['audio/mpeg; codecs\x3d"mp3"', "audio/mpeg", "audio/mp3", "audio/MPA", "audio/mpa-robust"],
                required: !0
            },
            mp4: {
                related: ["aac", "m4a", "m4b"],
                type: ['audio/mp4; codecs\x3d"mp4a.40.2"', "audio/aac", "audio/x-m4a", "audio/MP4A-LATM", "audio/mpeg4-generic"],
                required: !1
            },
            ogg: {
                type: ["audio/ogg; codecs\x3dvorbis"],
                required: !1
            },
            opus: {
                type: ["audio/ogg; codecs\x3dopus", "audio/opus"],
                required: !1
            },
            wav: {
                type: ['audio/wav; codecs\x3d"1"', "audio/wav", "audio/wave", "audio/x-wav"],
                required: !1
            }
        };
        this.movieID = "sm2-container";
        this.id = Q || "sm2movie";
        this.debugID = "soundmanager-debug";
        this.debugURLParam = /([#?&])debug=1/i;
        this.versionNumber = "V2.97a.20140901";
        this.altURL = this.movieURL = this.version = null;
        this.enabled = this.swfLoaded = !1;
        this.oMC = null;
        this.sounds = {};
        this.soundIDs = [];
        this.didFlashBlock = this.muted = !1;
        this.filePattern = null;
        this.filePatterns = {
            flash8: /\.mp3(\?.*)?$/i,
            flash9: /\.mp3(\?.*)?$/i
        };
        this.features = {
            buffering: !1,
            peakData: !1,
            waveformData: !1,
            eqData: !1,
            movieStar: !1
        };
        this.sandbox = {
            type: null,
            types: {
                remote: "remote (domain-based) rules",
                localWithFile: "local with file access (no internet access)",
                localWithNetwork: "local with network (internet access only, no local access)",
                localTrusted: "local, trusted (local+internet access)"
            },
            description: null,
            noRemote: null,
            noLocal: null
        };
        this.html5 = {
            usingFlash: null
        };
        this.flash = {};
        this.ignoreFlash = this.html5Only = !1;
        var Va, c = this,
            Wa = null,
            l = null,
            sb = "HTML5::",
            y, u = navigator.userAgent,
            W = h.location.href.toString(),
            m = document,
            xa, Xa, ya, n, G = [],
            za = !0,
            B, X = !1,
            Y = !1,
            q = !1,
            x = !1,
            ia = !1,
            p, tb = 0,
            Z, z, Aa, R, Ba, M, S, T, Ya, Ca, Da, ja, I, ka, Ea, N, Fa, $, la, ma, U, Za, Ga, $a = ["log", "info", "warn", "error"],
            ab, Ha, bb, aa = null,
            Ia = null,
            s, Ja, V, cb, na, oa, J, v, ba = !1,
            Ka = !1,
            db, eb, fb, pa = 0,
            ca = null,
            qa, O = [],
            da, t = null,
            gb, ra, ea, K, sa, La, hb, w, ib = Array.prototype.slice,
            D = !1,
            Ma, F, Na, jb, H, kb, Oa, ta, lb = 0,
            ua = u.match(/(ipad|iphone|ipod)/i),
            mb = u.match(/android/i),
            L = u.match(/msie/i),
            ub = u.match(/webkit/i),
            va = u.match(/safari/i) && !u.match(/chrome/i),
            Pa = u.match(/opera/i),
            Qa = u.match(/(mobile|pre\/|xoom)/i) || ua || mb,
            Ra = !W.match(/usehtml5audio/i) && !W.match(/sm2\-ignorebadua/i) && va && !u.match(/silk/i) && u.match(/OS X 10_6_([3-7])/i),
            fa = h.console !== g && console.log !== g,
            Sa = m.hasFocus !== g ? m.hasFocus() : null,
            wa = va && (m.hasFocus === g || !m.hasFocus()),
            nb = !wa,
            ob = /(mp3|mp4|mpa|m4a|m4b)/i,
            ga = m.location ? m.location.protocol.match(/http/i) : null,
            pb = !ga ? "http://" : "",
            qb = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
            rb = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),
            vb = RegExp("\\.(" + rb.join("|") + ")(\\?.*)?$", "i");
        this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
        this.useAltURL = !ga;
        var Ta;
        try {
            Ta = Audio !== g && (Pa && opera !== g && 10 > opera.version() ? new Audio(null) : new Audio).canPlayType !== g
        } catch (wb) {
            Ta = !1
        }
        this.hasHTML5 = Ta;
        this.setup = function(b) {
            var d = !c.url;
            b !== g && (q && t && c.ok() && (b.flashVersion !== g || b.url !== g || b.html5Test !== g)) && J(s("setupLate"));
            Aa(b);
            b && (d && ($ && b.url !== g) && c.beginDelayedInit(), !$ && (b.url !== g && "complete" === m.readyState) && setTimeout(N, 1));
            return c
        };
        this.supported = this.ok = function() {
            return t ? q && !x : c.useHTML5Audio && c.hasHTML5
        };
        this.getMovie = function(c) {
            return y(c) || m[c] || h[c]
        };
        this.createSound = function(b, d) {
            function e() {
                f = na(f);
                c.sounds[f.id] = new Va(f);
                c.soundIDs.push(f.id);
                return c.sounds[f.id]
            }
            var a, f;
            a = null;
            a = "soundManager.createSound(): " + s(!q ? "notReady" : "notOK");
            if (!q || !c.ok()) return J(a), !1;
            d !== g && (b = {
                id: b,
                url: d
            });
            f = z(b);
            f.url = qa(f.url);
            void 0 === f.id && (f.id = c.setupOptions.idPrefix +
                lb++);
            f.id.toString().charAt(0).match(/^[0-9]$/) && c._wD("soundManager.createSound(): " + s("badID", f.id), 2);
            c._wD("soundManager.createSound(): " + f.id + (f.url ? " (" + f.url + ")" : ""), 1);
            if (v(f.id, !0)) return c._wD("soundManager.createSound(): " + f.id + " exists", 1), c.sounds[f.id];
            if (ra(f)) a = e(), c._wD(f.id + ": Using HTML5"), a._setup_html5(f);
            else {
                if (c.html5Only) return c._wD(f.id + ": No HTML5 support for this sound, and no Flash. Exiting."), e();
                if (c.html5.usingFlash && f.url && f.url.match(/data\:/i)) return c._wD(f.id +
                    ": data: URIs not supported via Flash. Exiting."), e();
                8 < n && (null === f.isMovieStar && (f.isMovieStar = !(!f.serverURL && !(f.type && f.type.match(qb) || f.url && f.url.match(vb)))), f.isMovieStar && (c._wD("soundManager.createSound(): using MovieStar handling"), 1 < f.loops && p("noNSLoop")));
                f = oa(f, "soundManager.createSound(): ");
                a = e();
                8 === n ? l._createSound(f.id, f.loops || 1, f.usePolicyFile) : (l._createSound(f.id, f.url, f.usePeakData, f.useWaveformData, f.useEQData, f.isMovieStar, f.isMovieStar ? f.bufferTime : !1, f.loops || 1, f.serverURL,
                    f.duration || null, f.autoPlay, !0, f.autoLoad, f.usePolicyFile), f.serverURL || (a.connected = !0, f.onconnect && f.onconnect.apply(a)));
                !f.serverURL && (f.autoLoad || f.autoPlay) && a.load(f)
            }!f.serverURL && f.autoPlay && a.play();
            return a
        };
        this.destroySound = function(b, d) {
            if (!v(b)) return !1;
            var e = c.sounds[b],
                a;
            e._iO = {};
            e.stop();
            e.unload();
            for (a = 0; a < c.soundIDs.length; a++)
                if (c.soundIDs[a] === b) {
                    c.soundIDs.splice(a, 1);
                    break
                }
            d || e.destruct(!0);
            delete c.sounds[b];
            return !0
        };
        this.load = function(b, d) {
            return !v(b) ? !1 : c.sounds[b].load(d)
        };
        this.unload = function(b) {
            return !v(b) ? !1 : c.sounds[b].unload()
        };
        this.onposition = this.onPosition = function(b, d, e, a) {
            return !v(b) ? !1 : c.sounds[b].onposition(d, e, a)
        };
        this.clearOnPosition = function(b, d, e) {
            return !v(b) ? !1 : c.sounds[b].clearOnPosition(d, e)
        };
        this.start = this.play = function(b, d) {
            var e = null,
                a = d && !(d instanceof Object);
            if (!q || !c.ok()) return J("soundManager.play(): " + s(!q ? "notReady" : "notOK")), !1;
            if (v(b, a)) a && (d = {
                url: d
            });
            else {
                if (!a) return !1;
                a && (d = {
                    url: d
                });
                d && d.url && (c._wD('soundManager.play(): Attempting to create "' +
                    b + '"', 1), d.id = b, e = c.createSound(d).play())
            }
            null === e && (e = c.sounds[b].play(d));
            return e
        };
        this.setPosition = function(b, d) {
            return !v(b) ? !1 : c.sounds[b].setPosition(d)
        };
        this.stop = function(b) {
            if (!v(b)) return !1;
            c._wD("soundManager.stop(" + b + ")", 1);
            return c.sounds[b].stop()
        };
        this.stopAll = function() {
            var b;
            c._wD("soundManager.stopAll()", 1);
            for (b in c.sounds) c.sounds.hasOwnProperty(b) && c.sounds[b].stop()
        };
        this.pause = function(b) {
            return !v(b) ? !1 : c.sounds[b].pause()
        };
        this.pauseAll = function() {
            var b;
            for (b = c.soundIDs.length -
                1; 0 <= b; b--) c.sounds[c.soundIDs[b]].pause()
        };
        this.resume = function(b) {
            return !v(b) ? !1 : c.sounds[b].resume()
        };
        this.resumeAll = function() {
            var b;
            for (b = c.soundIDs.length - 1; 0 <= b; b--) c.sounds[c.soundIDs[b]].resume()
        };
        this.togglePause = function(b) {
            return !v(b) ? !1 : c.sounds[b].togglePause()
        };
        this.setPan = function(b, d) {
            return !v(b) ? !1 : c.sounds[b].setPan(d)
        };
        this.setVolume = function(b, d) {
            return !v(b) ? !1 : c.sounds[b].setVolume(d)
        };
        this.mute = function(b) {
            var d = 0;
            b instanceof String && (b = null);
            if (b) {
                if (!v(b)) return !1;
                c._wD('soundManager.mute(): Muting "' +
                    b + '"');
                return c.sounds[b].mute()
            }
            c._wD("soundManager.mute(): Muting all sounds");
            for (d = c.soundIDs.length - 1; 0 <= d; d--) c.sounds[c.soundIDs[d]].mute();
            return c.muted = !0
        };
        this.muteAll = function() {
            c.mute()
        };
        this.unmute = function(b) {
            b instanceof String && (b = null);
            if (b) {
                if (!v(b)) return !1;
                c._wD('soundManager.unmute(): Unmuting "' + b + '"');
                return c.sounds[b].unmute()
            }
            c._wD("soundManager.unmute(): Unmuting all sounds");
            for (b = c.soundIDs.length - 1; 0 <= b; b--) c.sounds[c.soundIDs[b]].unmute();
            c.muted = !1;
            return !0
        };
        this.unmuteAll =
            function() {
                c.unmute()
            };
        this.toggleMute = function(b) {
            return !v(b) ? !1 : c.sounds[b].toggleMute()
        };
        this.getMemoryUse = function() {
            var c = 0;
            l && 8 !== n && (c = parseInt(l._getMemoryUse(), 10));
            return c
        };
        this.disable = function(b) {
            var d;
            b === g && (b = !1);
            if (x) return !1;
            x = !0;
            p("shutdown", 1);
            for (d = c.soundIDs.length - 1; 0 <= d; d--) ab(c.sounds[c.soundIDs[d]]);
            Z(b);
            w.remove(h, "load", S);
            return !0
        };
        this.canPlayMIME = function(b) {
            var d;
            c.hasHTML5 && (d = ea({
                type: b
            }));
            !d && t && (d = b && c.ok() ? !!(8 < n && b.match(qb) || b.match(c.mimePattern)) : null);
            return d
        };
        this.canPlayURL = function(b) {
            var d;
            c.hasHTML5 && (d = ea({
                url: b
            }));
            !d && t && (d = b && c.ok() ? !!b.match(c.filePattern) : null);
            return d
        };
        this.canPlayLink = function(b) {
            return b.type !== g && b.type && c.canPlayMIME(b.type) ? !0 : c.canPlayURL(b.href)
        };
        this.getSoundById = function(b, d) {
            if (!b) return null;
            var e = c.sounds[b];
            !e && !d && c._wD('soundManager.getSoundById(): Sound "' + b + '" not found.', 2);
            return e
        };
        this.onready = function(b, d) {
            if ("function" === typeof b) q && c._wD(s("queue", "onready")), d || (d = h), Ba("onready", b, d), M();
            else throw s("needFunction",
                "onready");
            return !0
        };
        this.ontimeout = function(b, d) {
            if ("function" === typeof b) q && c._wD(s("queue", "ontimeout")), d || (d = h), Ba("ontimeout", b, d), M({
                type: "ontimeout"
            });
            else throw s("needFunction", "ontimeout");
            return !0
        };
        this._writeDebug = function(b, d) {
            var e, a;
            if (!c.debugMode) return !1;
            if (fa && c.useConsole) {
                if (d && "object" === typeof d) console.log(b, d);
                else if ($a[d] !== g) console[$a[d]](b);
                else console.log(b);
                if (c.consoleOnly) return !0
            }
            e = y("soundmanager-debug");
            if (!e) return !1;
            a = m.createElement("div");
            0 === ++tb % 2 && (a.className =
                "sm2-alt");
            d = d === g ? 0 : parseInt(d, 10);
            a.appendChild(m.createTextNode(b));
            d && (2 <= d && (a.style.fontWeight = "bold"), 3 === d && (a.style.color = "#ff3333"));
            e.insertBefore(a, e.firstChild);
            return !0
        }; - 1 !== W.indexOf("sm2-debug\x3dalert") && (this._writeDebug = function(c) {
            h.alert(c)
        });
        this._wD = this._writeDebug;
        this._debug = function() {
            var b, d;
            p("currentObj", 1);
            b = 0;
            for (d = c.soundIDs.length; b < d; b++) c.sounds[c.soundIDs[b]]._debug()
        };
        this.reboot = function(b, d) {
            c.soundIDs.length && c._wD("Destroying " + c.soundIDs.length + " SMSound object" +
                (1 !== c.soundIDs.length ? "s" : "") + "...");
            var e, a, f;
            for (e = c.soundIDs.length - 1; 0 <= e; e--) c.sounds[c.soundIDs[e]].destruct();
            if (l) try {
                L && (Ia = l.innerHTML), aa = l.parentNode.removeChild(l)
            } catch (g) {
                p("badRemove", 2)
            }
            Ia = aa = t = l = null;
            c.enabled = $ = q = ba = Ka = X = Y = x = D = c.swfLoaded = !1;
            c.soundIDs = [];
            c.sounds = {};
            lb = 0;
            if (b) G = [];
            else
                for (e in G)
                    if (G.hasOwnProperty(e)) {
                        a = 0;
                        for (f = G[e].length; a < f; a++) G[e][a].fired = !1
                    }
            d || c._wD("soundManager: Rebooting...");
            c.html5 = {
                usingFlash: null
            };
            c.flash = {};
            c.html5Only = !1;
            c.ignoreFlash = !1;
            h.setTimeout(function() {
                Ea();
                d || c.beginDelayedInit()
            }, 20);
            return c
        };
        this.reset = function() {
            p("reset");
            return c.reboot(!0, !0)
        };
        this.getMoviePercent = function() {
            return l && "PercentLoaded" in l ? l.PercentLoaded() : null
        };
        this.beginDelayedInit = function() {
            ia = !0;
            N();
            setTimeout(function() {
                if (Ka) return !1;
                ma();
                ka();
                return Ka = !0
            }, 20);
            T()
        };
        this.destruct = function() {
            c._wD("soundManager.destruct()");
            c.disable(!0)
        };
        Va = function(b) {
            var d, e, a = this,
                f, h, k, E, m, q, r = !1,
                C = [],
                u = 0,
                Ua, x, t = null,
                y;
            e = d = null;
            this.sID = this.id = b.id;
            this.url = b.url;
            this._iO = this.instanceOptions =
                this.options = z(b);
            this.pan = this.options.pan;
            this.volume = this.options.volume;
            this.isHTML5 = !1;
            this._a = null;
            y = this.url ? !1 : !0;
            this.id3 = {};
            this._debug = function() {
                c._wD(a.id + ": Merged options:", a.options)
            };
            this.load = function(b) {
                var d = null,
                    e;
                b !== g ? a._iO = z(b, a.options) : (b = a.options, a._iO = b, t && t !== a.url && (p("manURL"), a._iO.url = a.url, a.url = null));
                a._iO.url || (a._iO.url = a.url);
                a._iO.url = qa(a._iO.url);
                e = a.instanceOptions = a._iO;
                c._wD(a.id + ": load (" + e.url + ")");
                if (!e.url && !a.url) return c._wD(a.id + ": load(): url is unassigned. Exiting.",
                    2), a;
                !a.isHTML5 && (8 === n && !a.url && !e.autoPlay) && c._wD(a.id + ": Flash 8 load() limitation: Wait for onload() before calling play().", 1);
                if (e.url === a.url && 0 !== a.readyState && 2 !== a.readyState) return p("onURL", 1), 3 === a.readyState && e.onload && ta(a, function() {
                    e.onload.apply(a, [!!a.duration])
                }), a;
                a.loaded = !1;
                a.readyState = 1;
                a.playState = 0;
                a.id3 = {};
                if (ra(e)) d = a._setup_html5(e), d._called_load ? c._wD(a.id + ": Ignoring request to load again") : (a._html5_canplay = !1, a.url !== e.url && (c._wD(p("manURL") + ": " + e.url), a._a.src =
                    e.url, a.setPosition(0)), a._a.autobuffer = "auto", a._a.preload = "auto", a._a._called_load = !0);
                else {
                    if (c.html5Only) return c._wD(a.id + ": No flash support. Exiting."), a;
                    if (a._iO.url && a._iO.url.match(/data\:/i)) return c._wD(a.id + ": data: URIs not supported via Flash. Exiting."), a;
                    try {
                        a.isHTML5 = !1;
                        a._iO = oa(na(e));
                        if (a._iO.autoPlay && (a._iO.position || a._iO.from)) c._wD(a.id + ": Disabling autoPlay because of non-zero offset case"), a._iO.autoPlay = !1;
                        e = a._iO;
                        8 === n ? l._load(a.id, e.url, e.stream, e.autoPlay, e.usePolicyFile) :
                            l._load(a.id, e.url, !!e.stream, !!e.autoPlay, e.loops || 1, !!e.autoLoad, e.usePolicyFile)
                    } catch (f) {
                        p("smError", 2), B("onload", !1), U({
                            type: "SMSOUND_LOAD_JS_EXCEPTION",
                            fatal: !0
                        })
                    }
                }
                a.url = e.url;
                return a
            };
            this.unload = function() {
                0 !== a.readyState && (c._wD(a.id + ": unload()"), a.isHTML5 ? (E(), a._a && (a._a.pause(), t = sa(a._a))) : 8 === n ? l._unload(a.id, "about:blank") : l._unload(a.id), f());
                return a
            };
            this.destruct = function(b) {
                c._wD(a.id + ": Destruct");
                a.isHTML5 ? (E(), a._a && (a._a.pause(), sa(a._a), D || k(), a._a._s = null, a._a = null)) :
                    (a._iO.onfailure = null, l._destroySound(a.id));
                b || c.destroySound(a.id, !0)
            };
            this.start = this.play = function(b, d) {
                var e, f, k, E, h, A = !0,
                    A = null;
                e = a.id + ": play(): ";
                d = d === g ? !0 : d;
                b || (b = {});
                a.url && (a._iO.url = a.url);
                a._iO = z(a._iO, a.options);
                a._iO = z(b, a._iO);
                a._iO.url = qa(a._iO.url);
                a.instanceOptions = a._iO;
                if (!a.isHTML5 && a._iO.serverURL && !a.connected) return a.getAutoPlay() || (c._wD(e + " Netstream not connected yet - setting autoPlay"), a.setAutoPlay(!0)), a;
                ra(a._iO) && (a._setup_html5(a._iO), m());
                1 === a.playState && !a.paused &&
                    ((f = a._iO.multiShot) ? c._wD(e + "Already playing (multi-shot)", 1) : (c._wD(e + "Already playing (one-shot)", 1), a.isHTML5 && a.setPosition(a._iO.position), A = a));
                if (null !== A) return A;
                b.url && b.url !== a.url && (!a.readyState && !a.isHTML5 && 8 === n && y ? y = !1 : a.load(a._iO));
                a.loaded ? c._wD(e.substr(0, e.lastIndexOf(":"))) : 0 === a.readyState ? (c._wD(e + "Attempting to load"), !a.isHTML5 && !c.html5Only ? (a._iO.autoPlay = !0, a.load(a._iO)) : a.isHTML5 ? a.load(a._iO) : (c._wD(e + "Unsupported type. Exiting."), A = a), a.instanceOptions = a._iO) : 2 ===
                    a.readyState ? (c._wD(e + "Could not load - exiting", 2), A = a) : c._wD(e + "Loading - attempting to play...");
                if (null !== A) return A;
                !a.isHTML5 && (9 === n && 0 < a.position && a.position === a.duration) && (c._wD(e + "Sound at end, resetting to position:0"), b.position = 0);
                if (a.paused && 0 <= a.position && (!a._iO.serverURL || 0 < a.position)) c._wD(e + "Resuming from paused state", 1), a.resume();
                else {
                    a._iO = z(b, a._iO);
                    if ((!a.isHTML5 && null !== a._iO.position && 0 < a._iO.position || null !== a._iO.from && 0 < a._iO.from || null !== a._iO.to) && 0 === a.instanceCount &&
                        0 === a.playState && !a._iO.serverURL) {
                        f = function() {
                            a._iO = z(b, a._iO);
                            a.play(a._iO)
                        };
                        if (a.isHTML5 && !a._html5_canplay) c._wD(e + "Beginning load for non-zero offset case"), a.load({
                            _oncanplay: f
                        }), A = !1;
                        else if (!a.isHTML5 && !a.loaded && (!a.readyState || 2 !== a.readyState)) c._wD(e + "Preloading for non-zero offset case"), a.load({
                            onload: f
                        }), A = !1;
                        if (null !== A) return A;
                        a._iO = x()
                    }(!a.instanceCount || a._iO.multiShotEvents || a.isHTML5 && a._iO.multiShot && !D || !a.isHTML5 && 8 < n && !a.getAutoPlay()) && a.instanceCount++;
                    a._iO.onposition &&
                        0 === a.playState && q(a);
                    a.playState = 1;
                    a.paused = !1;
                    a.position = a._iO.position !== g && !isNaN(a._iO.position) ? a._iO.position : 0;
                    a.isHTML5 || (a._iO = oa(na(a._iO)));
                    a._iO.onplay && d && (a._iO.onplay.apply(a), r = !0);
                    a.setVolume(a._iO.volume, !0);
                    a.setPan(a._iO.pan, !0);
                    a.isHTML5 ? 2 > a.instanceCount ? (m(), e = a._setup_html5(), a.setPosition(a._iO.position), e.play()) : (c._wD(a.id + ": Cloning Audio() for instance #" + a.instanceCount + "..."), k = new Audio(a._iO.url), E = function() {
                            w.remove(k, "ended", E);
                            a._onfinish(a);
                            sa(k);
                            k = null
                        }, h =
                        function() {
                            w.remove(k, "canplay", h);
                            try {
                                k.currentTime = a._iO.position / 1E3
                            } catch (c) {
                                J(a.id + ": multiShot play() failed to apply position of " + a._iO.position / 1E3)
                            }
                            k.play()
                        }, w.add(k, "ended", E), void 0 !== a._iO.volume && (k.volume = Math.max(0, Math.min(1, a._iO.volume / 100))), a.muted && (k.muted = !0), a._iO.position ? w.add(k, "canplay", h) : k.play()) : (A = l._start(a.id, a._iO.loops || 1, 9 === n ? a.position : a.position / 1E3, a._iO.multiShot || !1), 9 === n && !A && (c._wD(e + "No sound hardware, or 32-sound ceiling hit", 2), a._iO.onplayerror &&
                        a._iO.onplayerror.apply(a)))
                }
                return a
            };
            this.stop = function(b) {
                var d = a._iO;
                1 === a.playState && (c._wD(a.id + ": stop()"), a._onbufferchange(0), a._resetOnPosition(0), a.paused = !1, a.isHTML5 || (a.playState = 0), Ua(), d.to && a.clearOnPosition(d.to), a.isHTML5 ? a._a && (b = a.position, a.setPosition(0), a.position = b, a._a.pause(), a.playState = 0, a._onTimer(), E()) : (l._stop(a.id, b), d.serverURL && a.unload()), a.instanceCount = 0, a._iO = {}, d.onstop && d.onstop.apply(a));
                return a
            };
            this.setAutoPlay = function(b) {
                c._wD(a.id + ": Autoplay turned " +
                    (b ? "on" : "off"));
                a._iO.autoPlay = b;
                a.isHTML5 || (l._setAutoPlay(a.id, b), b && (!a.instanceCount && 1 === a.readyState) && (a.instanceCount++, c._wD(a.id + ": Incremented instance count to " + a.instanceCount)))
            };
            this.getAutoPlay = function() {
                return a._iO.autoPlay
            };
            this.setPosition = function(b) {
                b === g && (b = 0);
                var d = a.isHTML5 ? Math.max(b, 0) : Math.min(a.duration || a._iO.duration, Math.max(b, 0));
                a.position = d;
                b = a.position / 1E3;
                a._resetOnPosition(a.position);
                a._iO.position = d;
                if (a.isHTML5) {
                    if (a._a) {
                        if (a._html5_canplay) {
                            if (a._a.currentTime !==
                                b) {
                                c._wD(a.id + ": setPosition(" + b + ")");
                                try {
                                    a._a.currentTime = b, (0 === a.playState || a.paused) && a._a.pause()
                                } catch (e) {
                                    c._wD(a.id + ": setPosition(" + b + ") failed: " + e.message, 2)
                                }
                            }
                        } else if (b) return c._wD(a.id + ": setPosition(" + b + "): Cannot seek yet, sound not ready", 2), a;
                        a.paused && a._onTimer(!0)
                    }
                } else b = 9 === n ? a.position : b, a.readyState && 2 !== a.readyState && l._setPosition(a.id, b, a.paused || !a.playState, a._iO.multiShot);
                return a
            };
            this.pause = function(b) {
                if (a.paused || 0 === a.playState && 1 !== a.readyState) return a;
                c._wD(a.id +
                    ": pause()");
                a.paused = !0;
                a.isHTML5 ? (a._setup_html5().pause(), E()) : (b || b === g) && l._pause(a.id, a._iO.multiShot);
                a._iO.onpause && a._iO.onpause.apply(a);
                return a
            };
            this.resume = function() {
                var b = a._iO;
                if (!a.paused) return a;
                c._wD(a.id + ": resume()");
                a.paused = !1;
                a.playState = 1;
                a.isHTML5 ? (a._setup_html5().play(), m()) : (b.isMovieStar && !b.serverURL && a.setPosition(a.position), l._pause(a.id, b.multiShot));
                !r && b.onplay ? (b.onplay.apply(a), r = !0) : b.onresume && b.onresume.apply(a);
                return a
            };
            this.togglePause = function() {
                c._wD(a.id +
                    ": togglePause()");
                if (0 === a.playState) return a.play({
                    position: 9 === n && !a.isHTML5 ? a.position : a.position / 1E3
                }), a;
                a.paused ? a.resume() : a.pause();
                return a
            };
            this.setPan = function(b, c) {
                b === g && (b = 0);
                c === g && (c = !1);
                a.isHTML5 || l._setPan(a.id, b);
                a._iO.pan = b;
                c || (a.pan = b, a.options.pan = b);
                return a
            };
            this.setVolume = function(b, d) {
                b === g && (b = 100);
                d === g && (d = !1);
                a.isHTML5 ? a._a && (c.muted && !a.muted && (a.muted = !0, a._a.muted = !0), a._a.volume = Math.max(0, Math.min(1, b / 100))) : l._setVolume(a.id, c.muted && !a.muted || a.muted ? 0 : b);
                a._iO.volume =
                    b;
                d || (a.volume = b, a.options.volume = b);
                return a
            };
            this.mute = function() {
                a.muted = !0;
                a.isHTML5 ? a._a && (a._a.muted = !0) : l._setVolume(a.id, 0);
                return a
            };
            this.unmute = function() {
                a.muted = !1;
                var b = a._iO.volume !== g;
                a.isHTML5 ? a._a && (a._a.muted = !1) : l._setVolume(a.id, b ? a._iO.volume : a.options.volume);
                return a
            };
            this.toggleMute = function() {
                return a.muted ? a.unmute() : a.mute()
            };
            this.onposition = this.onPosition = function(b, c, d) {
                C.push({
                    position: parseInt(b, 10),
                    method: c,
                    scope: d !== g ? d : a,
                    fired: !1
                });
                return a
            };
            this.clearOnPosition =
                function(a, b) {
                    var c;
                    a = parseInt(a, 10);
                    if (isNaN(a)) return !1;
                    for (c = 0; c < C.length; c++)
                        if (a === C[c].position && (!b || b === C[c].method)) C[c].fired && u--, C.splice(c, 1)
                };
            this._processOnPosition = function() {
                var b, c;
                b = C.length;
                if (!b || !a.playState || u >= b) return !1;
                for (b -= 1; 0 <= b; b--) c = C[b], !c.fired && a.position >= c.position && (c.fired = !0, u++, c.method.apply(c.scope, [c.position]));
                return !0
            };
            this._resetOnPosition = function(a) {
                var b, c;
                b = C.length;
                if (!b) return !1;
                for (b -= 1; 0 <= b; b--) c = C[b], c.fired && a <= c.position && (c.fired = !1, u--);
                return !0
            };
            x = function() {
                var b = a._iO,
                    d = b.from,
                    e = b.to,
                    f, g;
                g = function() {
                    c._wD(a.id + ': "To" time of ' + e + " reached.");
                    a.clearOnPosition(e, g);
                    a.stop()
                };
                f = function() {
                    c._wD(a.id + ': Playing "from" ' + d);
                    if (null !== e && !isNaN(e)) a.onPosition(e, g)
                };
                null !== d && !isNaN(d) && (b.position = d, b.multiShot = !1, f());
                return b
            };
            q = function() {
                var b, c = a._iO.onposition;
                if (c)
                    for (b in c)
                        if (c.hasOwnProperty(b)) a.onPosition(parseInt(b, 10), c[b])
            };
            Ua = function() {
                var b, c = a._iO.onposition;
                if (c)
                    for (b in c) c.hasOwnProperty(b) && a.clearOnPosition(parseInt(b,
                        10))
            };
            m = function() {
                a.isHTML5 && db(a)
            };
            E = function() {
                a.isHTML5 && eb(a)
            };
            f = function(b) {
                b || (C = [], u = 0);
                r = !1;
                a._hasTimer = null;
                a._a = null;
                a._html5_canplay = !1;
                a.bytesLoaded = null;
                a.bytesTotal = null;
                a.duration = a._iO && a._iO.duration ? a._iO.duration : null;
                a.durationEstimate = null;
                a.buffered = [];
                a.eqData = [];
                a.eqData.left = [];
                a.eqData.right = [];
                a.failures = 0;
                a.isBuffering = !1;
                a.instanceOptions = {};
                a.instanceCount = 0;
                a.loaded = !1;
                a.metadata = {};
                a.readyState = 0;
                a.muted = !1;
                a.paused = !1;
                a.peakData = {
                    left: 0,
                    right: 0
                };
                a.waveformData = {
                    left: [],
                    right: []
                };
                a.playState = 0;
                a.position = null;
                a.id3 = {}
            };
            f();
            this._onTimer = function(b) {
                var c, f = !1,
                    g = {};
                if (a._hasTimer || b) {
                    if (a._a && (b || (0 < a.playState || 1 === a.readyState) && !a.paused)) c = a._get_html5_duration(), c !== d && (d = c, a.duration = c, f = !0), a.durationEstimate = a.duration, c = 1E3 * a._a.currentTime || 0, c !== e && (e = c, f = !0), (f || b) && a._whileplaying(c, g, g, g, g);
                    return f
                }
            };
            this._get_html5_duration = function() {
                var b = a._iO;
                return (b = a._a && a._a.duration ? 1E3 * a._a.duration : b && b.duration ? b.duration : null) && !isNaN(b) && Infinity !== b ?
                    b : null
            };
            this._apply_loop = function(a, b) {
                !a.loop && 1 < b && c._wD("Note: Native HTML5 looping is infinite.", 1);
                a.loop = 1 < b ? "loop" : ""
            };
            this._setup_html5 = function(b) {
                b = z(a._iO, b);
                var c = D ? Wa : a._a,
                    d = decodeURI(b.url),
                    e;
                D ? d === decodeURI(Ma) && (e = !0) : d === decodeURI(t) && (e = !0);
                if (c) {
                    if (c._s)
                        if (D) c._s && (c._s.playState && !e) && c._s.stop();
                        else if (!D && d === decodeURI(t)) return a._apply_loop(c, b.loops), c;
                    e || (t && f(!1), c.src = b.url, Ma = t = a.url = b.url, c._called_load = !1)
                } else b.autoLoad || b.autoPlay ? (a._a = new Audio(b.url), a._a.load()) :
                    a._a = Pa && 10 > opera.version() ? new Audio(null) : new Audio, c = a._a, c._called_load = !1, D && (Wa = c);
                a.isHTML5 = !0;
                a._a = c;
                c._s = a;
                h();
                a._apply_loop(c, b.loops);
                b.autoLoad || b.autoPlay ? a.load() : (c.autobuffer = !1, c.preload = "auto");
                return c
            };
            h = function() {
                if (a._a._added_events) return !1;
                var b;
                a._a._added_events = !0;
                for (b in H) H.hasOwnProperty(b) && a._a && a._a.addEventListener(b, H[b], !1);
                return !0
            };
            k = function() {
                var b;
                c._wD(a.id + ": Removing event listeners");
                a._a._added_events = !1;
                for (b in H) H.hasOwnProperty(b) && a._a && a._a.removeEventListener(b,
                    H[b], !1)
            };
            this._onload = function(b) {
                var d = !!b || !a.isHTML5 && 8 === n && a.duration;
                b = a.id + ": ";
                c._wD(b + (d ? "onload()" : "Failed to load / invalid sound?" + (!a.duration ? " Zero-length duration reported." : " -") + " (" + a.url + ")"), d ? 1 : 2);
                !d && !a.isHTML5 && (!0 === c.sandbox.noRemote && c._wD(b + s("noNet"), 1), !0 === c.sandbox.noLocal && c._wD(b + s("noLocal"), 1));
                a.loaded = d;
                a.readyState = d ? 3 : 2;
                a._onbufferchange(0);
                a._iO.onload && ta(a, function() {
                    a._iO.onload.apply(a, [d])
                });
                return !0
            };
            this._onbufferchange = function(b) {
                if (0 === a.playState ||
                    b && a.isBuffering || !b && !a.isBuffering) return !1;
                a.isBuffering = 1 === b;
                a._iO.onbufferchange && (c._wD(a.id + ": Buffer state change: " + b), a._iO.onbufferchange.apply(a, [b]));
                return !0
            };
            this._onsuspend = function() {
                a._iO.onsuspend && (c._wD(a.id + ": Playback suspended"), a._iO.onsuspend.apply(a));
                return !0
            };
            this._onfailure = function(b, d, e) {
                a.failures++;
                c._wD(a.id + ": Failure (" + a.failures + "): " + b);
                if (a._iO.onfailure && 1 === a.failures) a._iO.onfailure(b, d, e);
                else c._wD(a.id + ": Ignoring failure")
            };
            this._onwarning = function(b,
                c, d) {
                if (a._iO.onwarning) a._iO.onwarning(b, c, d)
            };
            this._onfinish = function() {
                var b = a._iO.onfinish;
                a._onbufferchange(0);
                a._resetOnPosition(0);
                if (a.instanceCount && (a.instanceCount--, a.instanceCount || (Ua(), a.playState = 0, a.paused = !1, a.instanceCount = 0, a.instanceOptions = {}, a._iO = {}, E(), a.isHTML5 && (a.position = 0)), (!a.instanceCount || a._iO.multiShotEvents) && b)) c._wD(a.id + ": onfinish()"), ta(a, function() {
                    b.apply(a)
                })
            };
            this._whileloading = function(b, c, d, e) {
                var f = a._iO;
                a.bytesLoaded = b;
                a.bytesTotal = c;
                a.duration = Math.floor(d);
                a.bufferLength = e;
                a.durationEstimate = !a.isHTML5 && !f.isMovieStar ? f.duration ? a.duration > f.duration ? a.duration : f.duration : parseInt(a.bytesTotal / a.bytesLoaded * a.duration, 10) : a.duration;
                a.isHTML5 || (a.buffered = [{
                    start: 0,
                    end: a.duration
                }]);
                (3 !== a.readyState || a.isHTML5) && f.whileloading && f.whileloading.apply(a)
            };
            this._whileplaying = function(b, c, d, e, f) {
                var k = a._iO;
                if (isNaN(b) || null === b) return !1;
                a.position = Math.max(0, b);
                a._processOnPosition();
                !a.isHTML5 && 8 < n && (k.usePeakData && (c !== g && c) && (a.peakData = {
                    left: c.leftPeak,
                    right: c.rightPeak
                }), k.useWaveformData && (d !== g && d) && (a.waveformData = {
                    left: d.split(","),
                    right: e.split(",")
                }), k.useEQData && (f !== g && f && f.leftEQ) && (b = f.leftEQ.split(","), a.eqData = b, a.eqData.left = b, f.rightEQ !== g && f.rightEQ && (a.eqData.right = f.rightEQ.split(","))));
                1 === a.playState && (!a.isHTML5 && (8 === n && !a.position && a.isBuffering) && a._onbufferchange(0), k.whileplaying && k.whileplaying.apply(a));
                return !0
            };
            this._oncaptiondata = function(b) {
                c._wD(a.id + ": Caption data received.");
                a.captiondata = b;
                a._iO.oncaptiondata &&
                    a._iO.oncaptiondata.apply(a, [b])
            };
            this._onmetadata = function(b, d) {
                c._wD(a.id + ": Metadata received.");
                var e = {},
                    f, g;
                f = 0;
                for (g = b.length; f < g; f++) e[b[f]] = d[f];
                a.metadata = e;
                console.log("updated metadata", a.metadata);
                a._iO.onmetadata && a._iO.onmetadata.call(a, a.metadata)
            };
            this._onid3 = function(b, d) {
                c._wD(a.id + ": ID3 data received.");
                var e = [],
                    f, g;
                f = 0;
                for (g = b.length; f < g; f++) e[b[f]] = d[f];
                a.id3 = z(a.id3, e);
                a._iO.onid3 && a._iO.onid3.apply(a)
            };
            this._onconnect = function(b) {
                b = 1 === b;
                c._wD(a.id + ": " + (b ? "Connected." : "Failed to connect? - " +
                    a.url), b ? 1 : 2);
                if (a.connected = b) a.failures = 0, v(a.id) && (a.getAutoPlay() ? a.play(g, a.getAutoPlay()) : a._iO.autoLoad && a.load()), a._iO.onconnect && a._iO.onconnect.apply(a, [b])
            };
            this._ondataerror = function(b) {
                0 < a.playState && (c._wD(a.id + ": Data error: " + b), a._iO.ondataerror && a._iO.ondataerror.apply(a))
            };
            this._debug()
        };
        la = function() {
            return m.body || m.getElementsByTagName("div")[0]
        };
        y = function(b) {
            return m.getElementById(b)
        };
        z = function(b, d) {
            var e = b || {},
                a, f;
            a = d === g ? c.defaultOptions : d;
            for (f in a) a.hasOwnProperty(f) &&
                e[f] === g && (e[f] = "object" !== typeof a[f] || null === a[f] ? a[f] : z(e[f], a[f]));
            return e
        };
        ta = function(b, c) {
            !b.isHTML5 && 8 === n ? h.setTimeout(c, 0) : c()
        };
        R = {
            onready: 1,
            ontimeout: 1,
            defaultOptions: 1,
            flash9Options: 1,
            movieStarOptions: 1
        };
        Aa = function(b, d) {
            var e, a = !0,
                f = d !== g,
                h = c.setupOptions;
            if (b === g) {
                a = [];
                for (e in h) h.hasOwnProperty(e) && a.push(e);
                for (e in R) R.hasOwnProperty(e) && ("object" === typeof c[e] ? a.push(e + ": {...}") : c[e] instanceof Function ? a.push(e + ": function() {...}") : a.push(e));
                c._wD(s("setup", a.join(", ")));
                return !1
            }
            for (e in b)
                if (b.hasOwnProperty(e))
                    if ("object" !==
                        typeof b[e] || null === b[e] || b[e] instanceof Array || b[e] instanceof RegExp) f && R[d] !== g ? c[d][e] = b[e] : h[e] !== g ? (c.setupOptions[e] = b[e], c[e] = b[e]) : R[e] === g ? (J(s(c[e] === g ? "setupUndef" : "setupError", e), 2), a = !1) : c[e] instanceof Function ? c[e].apply(c, b[e] instanceof Array ? b[e] : [b[e]]) : c[e] = b[e];
                    else if (R[e] === g) J(s(c[e] === g ? "setupUndef" : "setupError", e), 2), a = !1;
            else return Aa(b[e], e);
            return a
        };
        w = function() {
            function b(a) {
                a = ib.call(a);
                var b = a.length;
                e ? (a[1] = "on" + a[1], 3 < b && a.pop()) : 3 === b && a.push(!1);
                return a
            }

            function c(b,
                d) {
                var g = b.shift(),
                    h = [a[d]];
                if (e) g[h](b[0], b[1]);
                else g[h].apply(g, b)
            }
            var e = h.attachEvent,
                a = {
                    add: e ? "attachEvent" : "addEventListener",
                    remove: e ? "detachEvent" : "removeEventListener"
                };
            return {
                add: function() {
                    c(b(arguments), "add")
                },
                remove: function() {
                    c(b(arguments), "remove")
                }
            }
        }();
        H = {
            abort: r(function() {
                c._wD(this._s.id + ": abort")
            }),
            canplay: r(function() {
                var b = this._s,
                    d;
                if (b._html5_canplay) return !0;
                b._html5_canplay = !0;
                c._wD(b.id + ": canplay");
                b._onbufferchange(0);
                d = b._iO.position !== g && !isNaN(b._iO.position) ? b._iO.position /
                    1E3 : null;
                if (this.currentTime !== d) {
                    c._wD(b.id + ": canplay: Setting position to " + d);
                    try {
                        this.currentTime = d
                    } catch (e) {
                        c._wD(b.id + ": canplay: Setting position of " + d + " failed: " + e.message, 2)
                    }
                }
                b._iO._oncanplay && b._iO._oncanplay()
            }),
            canplaythrough: r(function() {
                var b = this._s;
                b.loaded || (b._onbufferchange(0), b._whileloading(b.bytesLoaded, b.bytesTotal, b._get_html5_duration()), b._onload(!0))
            }),
            durationchange: r(function() {
                var b = this._s,
                    d;
                d = b._get_html5_duration();
                !isNaN(d) && d !== b.duration && (c._wD(this._s.id + ": durationchange (" +
                    d + ")" + (b.duration ? ", previously " + b.duration : "")), b.durationEstimate = b.duration = d)
            }),
            ended: r(function() {
                var b = this._s;
                c._wD(b.id + ": ended");
                b._onfinish()
            }),
            error: r(function() {
                c._wD(this._s.id + ": HTML5 error, code " + this.error.code);
                this._s._onload(!1)
            }),
            loadeddata: r(function() {
                var b = this._s;
                c._wD(b.id + ": loadeddata");
                !b._loaded && !va && (b.duration = b._get_html5_duration())
            }),
            loadedmetadata: r(function() {
                c._wD(this._s.id + ": loadedmetadata")
            }),
            loadstart: r(function() {
                c._wD(this._s.id + ": loadstart");
                this._s._onbufferchange(1)
            }),
            play: r(function() {
                this._s._onbufferchange(0)
            }),
            playing: r(function() {
                c._wD(this._s.id + ": playing " + String.fromCharCode(9835));
                this._s._onbufferchange(0)
            }),
            progress: r(function(b) {
                var d = this._s,
                    e, a, f;
                e = 0;
                var g = "progress" === b.type,
                    k = b.target.buffered,
                    h = b.loaded || 0,
                    m = b.total || 1;
                d.buffered = [];
                if (k && k.length) {
                    e = 0;
                    for (a = k.length; e < a; e++) d.buffered.push({
                        start: 1E3 * k.start(e),
                        end: 1E3 * k.end(e)
                    });
                    e = 1E3 * (k.end(0) - k.start(0));
                    h = Math.min(1, e / (1E3 * b.target.duration));
                    if (g && 1 < k.length) {
                        f = [];
                        a = k.length;
                        for (e = 0; e < a; e++) f.push(1E3 *
                            b.target.buffered.start(e) + "-" + 1E3 * b.target.buffered.end(e));
                        c._wD(this._s.id + ": progress, timeRanges: " + f.join(", "))
                    }
                    g && !isNaN(h) && c._wD(this._s.id + ": progress, " + Math.floor(100 * h) + "% loaded")
                }
                isNaN(h) || (d._whileloading(h, m, d._get_html5_duration()), h && (m && h === m) && H.canplaythrough.call(this, b))
            }),
            ratechange: r(function() {
                c._wD(this._s.id + ": ratechange")
            }),
            suspend: r(function(b) {
                var d = this._s;
                c._wD(this._s.id + ": suspend");
                H.progress.call(this, b);
                d._onsuspend()
            }),
            stalled: r(function() {
                c._wD(this._s.id +
                    ": stalled")
            }),
            timeupdate: r(function() {
                this._s._onTimer()
            }),
            waiting: r(function() {
                var b = this._s;
                c._wD(this._s.id + ": waiting");
                b._onbufferchange(1)
            })
        };
        ra = function(b) {
            return !b || !b.type && !b.url && !b.serverURL ? !1 : b.serverURL || b.type && ha(b.type) ? !1 : b.type ? ea({
                type: b.type
            }) : ea({
                url: b.url
            }) || c.html5Only || b.url.match(/data\:/i)
        };
        sa = function(b) {
            var d;
            b && (d = va ? "about:blank" : c.html5.canPlayType("audio/wav") ? "data:audio/wave;base64,/UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAAD//w\x3d\x3d" : "about:blank",
                b.src = d, void 0 !== b._called_unload && (b._called_load = !1));
            D && (Ma = null);
            return d
        };
        ea = function(b) {
            if (!c.useHTML5Audio || !c.hasHTML5) return !1;
            var d = b.url || null;
            b = b.type || null;
            var e = c.audioFormats,
                a;
            if (b && c.html5[b] !== g) return c.html5[b] && !ha(b);
            if (!K) {
                K = [];
                for (a in e) e.hasOwnProperty(a) && (K.push(a), e[a].related && (K = K.concat(e[a].related)));
                K = RegExp("\\.(" + K.join("|") + ")(\\?.*)?$", "i")
            }
            a = d ? d.toLowerCase().match(K) : null;
            !a || !a.length ? b && (d = b.indexOf(";"), a = (-1 !== d ? b.substr(0, d) : b).substr(6)) : a = a[1];
            a && c.html5[a] !==
                g ? d = c.html5[a] && !ha(a) : (b = "audio/" + a, d = c.html5.canPlayType({
                    type: b
                }), d = (c.html5[a] = d) && c.html5[b] && !ha(b));
            return d
        };
        hb = function() {
            function b(a) {
                var b, e = b = !1;
                if (!d || "function" !== typeof d.canPlayType) return b;
                if (a instanceof Array) {
                    k = 0;
                    for (b = a.length; k < b; k++)
                        if (c.html5[a[k]] || d.canPlayType(a[k]).match(c.html5Test)) e = !0, c.html5[a[k]] = !0, c.flash[a[k]] = !!a[k].match(ob);
                    b = e
                } else a = d && "function" === typeof d.canPlayType ? d.canPlayType(a) : !1, b = !(!a || !a.match(c.html5Test));
                return b
            }
            if (!c.useHTML5Audio || !c.hasHTML5) return t =
                c.html5.usingFlash = !0, !1;
            var d = Audio !== g ? Pa && 10 > opera.version() ? new Audio(null) : new Audio : null,
                e, a, f = {},
                h, k;
            h = c.audioFormats;
            for (e in h)
                if (h.hasOwnProperty(e) && (a = "audio/" + e, f[e] = b(h[e].type), f[a] = f[e], e.match(ob) ? (c.flash[e] = !0, c.flash[a] = !0) : (c.flash[e] = !1, c.flash[a] = !1), h[e] && h[e].related))
                    for (k = h[e].related.length - 1; 0 <= k; k--) f["audio/" + h[e].related[k]] = f[e], c.html5[h[e].related[k]] = f[e], c.flash[h[e].related[k]] = f[e];
            f.canPlayType = d ? b : null;
            c.html5 = z(c.html5, f);
            c.html5.usingFlash = gb();
            t = c.html5.usingFlash;
            return !0
        };
        I = {
            notReady: "Unavailable - wait until onready() has fired.",
            notOK: "Audio support is not available.",
            domError: "soundManagerexception caught while appending SWF to DOM.",
            spcWmode: "Removing wmode, preventing known SWF loading issue(s)",
            swf404: "soundManager: Verify that %s is a valid path.",
            tryDebug: "Try soundManager.debugFlash \x3d true for more security details (output goes to SWF.)",
            checkSWF: "See SWF output for more debug info.",
            localFail: "soundManager: Non-HTTP page (" + m.location.protocol +
                " URL?) Review Flash player security settings for this special case:\nhttp://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html\nMay need to add/allow path, eg. c:/sm2/ or /users/me/sm2/",
            waitFocus: "soundManager: Special case: Waiting for SWF to load with window focus...",
            waitForever: "soundManager: Waiting indefinitely for Flash (will recover if unblocked)...",
            waitSWF: "soundManager: Waiting for 100% SWF load...",
            needFunction: "soundManager: Function object expected for %s",
            badID: 'Sound ID "%s" should be a string, starting with a non-numeric character',
            currentObj: "soundManager: _debug(): Current sound objects",
            waitOnload: "soundManager: Waiting for window.onload()",
            docLoaded: "soundManager: Document already loaded",
            onload: "soundManager: initComplete(): calling soundManager.onload()",
            onloadOK: "soundManager.onload() complete",
            didInit: "soundManager: init(): Already called?",
            secNote: "Flash security note: Network/internet URLs will not load due to security restrictions. Access can be configured via Flash Player Global Security Settings Page: http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html",
            badRemove: "soundManager: Failed to remove Flash node.",
            shutdown: "soundManager.disable(): Shutting down",
            queue: "soundManager: Queueing %s handler",
            smError: "SMSound.load(): Exception: JS-Flash communication failed, or JS error.",
            fbTimeout: "No flash response, applying .swf_timedout CSS...",
            fbLoaded: "Flash loaded",
            fbHandler: "soundManager: flashBlockHandler()",
            manURL: "SMSound.load(): Using manually-assigned URL",
            onURL: "soundManager.load(): current URL already assigned.",
            badFV: 'soundManager.flashVersion must be 8 or 9. "%s" is invalid. Reverting to %s.',
            as2loop: "Note: Setting stream:false so looping can work (flash 8 limitation)",
            noNSLoop: "Note: Looping not implemented for MovieStar formats",
            needfl9: "Note: Switching to flash 9, required for MP4 formats.",
            mfTimeout: "Setting flashLoadTimeout \x3d 0 (infinite) for off-screen, mobile flash case",
            needFlash: "soundManager: Fatal error: Flash is needed to play some required formats, but is not available.",
            gotFocus: "soundManager: Got window focus.",
            policy: "Enabling usePolicyFile for data access",
            setup: "soundManager.setup(): allowed parameters: %s",
            setupError: 'soundManager.setup(): "%s" cannot be assigned with this method.',
            setupUndef: 'soundManager.setup(): Could not find option "%s"',
            setupLate: "soundManager.setup(): url, flashVersion and html5Test property changes will not take effect until reboot().",
            noURL: "soundManager: Flash URL required. Call soundManager.setup({url:...}) to get started.",
            sm2Loaded: "SoundManager 2: Ready. " + String.fromCharCode(10003),
            reset: "soundManager.reset(): Removing event callbacks",
            mobileUA: "Mobile UA detected, preferring HTML5 by default.",
            globalHTML5: "Using singleton HTML5 Audio() pattern for this device."
        };
        s = function() {
            var b, c, e, a;
            b = ib.call(arguments);
            c = b.shift();
            if ((a = I && I[c] ? I[c] : "") && b && b.length) {
                c = 0;
                for (e = b.length; c < e; c++) a = a.replace("%s", b[c])
            }
            return a
        };
        na = function(b) {
            8 === n && (1 < b.loops && b.stream) && (p("as2loop"), b.stream = !1);
            return b
        };
        oa = function(b, d) {
            if (b && !b.usePolicyFile && (b.onid3 || b.usePeakData || b.useWaveformData || b.useEQData)) c._wD((d || "") + s("policy")), b.usePolicyFile = !0;
            return b
        };
        J = function(b) {
            fa && console.warn !== g ? console.warn(b) :
                c._wD(b)
        };
        xa = function() {
            return !1
        };
        ab = function(b) {
            for (var c in b) b.hasOwnProperty(c) && "function" === typeof b[c] && (b[c] = xa)
        };
        Ha = function(b) {
            b === g && (b = !1);
            (x || b) && c.disable(b)
        };
        bb = function(b) {
            var d = null;
            if (b)
                if (b.match(/\.swf(\?.*)?$/i)) {
                    if (d = b.substr(b.toLowerCase().lastIndexOf(".swf?") + 4)) return b
                } else b.lastIndexOf("/") !== b.length - 1 && (b += "/");
            b = (b && -1 !== b.lastIndexOf("/") ? b.substr(0, b.lastIndexOf("/") + 1) : "./") + c.movieURL;
            c.noSWFCache && (b += "?ts\x3d" + (new Date).getTime());
            return b
        };
        Da = function() {
            n = parseInt(c.flashVersion,
                10);
            8 !== n && 9 !== n && (c._wD(s("badFV", n, 8)), c.flashVersion = n = 8);
            var b = c.debugMode || c.debugFlash ? "_debug.swf" : ".swf";
            c.useHTML5Audio && (!c.html5Only && c.audioFormats.mp4.required && 9 > n) && (c._wD(s("needfl9")), c.flashVersion = n = 9);
            c.version = c.versionNumber + (c.html5Only ? " (HTML5-only mode)" : 9 === n ? " (AS3/Flash 9)" : " (AS2/Flash 8)");
            8 < n ? (c.defaultOptions = z(c.defaultOptions, c.flash9Options), c.features.buffering = !0, c.defaultOptions = z(c.defaultOptions, c.movieStarOptions), c.filePatterns.flash9 = RegExp("\\.(mp3|" + rb.join("|") +
                ")(\\?.*)?$", "i"), c.features.movieStar = !0) : c.features.movieStar = !1;
            c.filePattern = c.filePatterns[8 !== n ? "flash9" : "flash8"];
            c.movieURL = (8 === n ? "soundmanager2.swf" : "soundmanager2_flash9.swf").replace(".swf", b);
            c.features.peakData = c.features.waveformData = c.features.eqData = 8 < n
        };
        Za = function(b, c) {
            if (!l) return !1;
            l._setPolling(b, c)
        };
        Ga = function() {
            c.debugURLParam.test(W) && (c.debugMode = !0);
            if (y(c.debugID)) return !1;
            var b, d, e, a;
            if (c.debugMode && !y(c.debugID) && (!fa || !c.useConsole || !c.consoleOnly)) {
                b = m.createElement("div");
                b.id = c.debugID + "-toggle";
                d = {
                    position: "fixed",
                    bottom: "0px",
                    right: "0px",
                    width: "1.2em",
                    height: "1.2em",
                    lineHeight: "1.2em",
                    margin: "2px",
                    textAlign: "center",
                    border: "1px solid #999",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#333",
                    zIndex: 10001
                };
                b.appendChild(m.createTextNode("-"));
                b.onclick = cb;
                b.title = "Toggle SM2 debug console";
                u.match(/msie 6/i) && (b.style.position = "absolute", b.style.cursor = "hand");
                for (a in d) d.hasOwnProperty(a) && (b.style[a] = d[a]);
                d = m.createElement("div");
                d.id = c.debugID;
                d.style.display = c.debugMode ?
                    "block" : "none";
                if (c.debugMode && !y(b.id)) {
                    try {
                        e = la(), e.appendChild(b)
                    } catch (f) {
                        throw Error(s("domError") + " \n" + f.toString());
                    }
                    e.appendChild(d)
                }
            }
        };
        v = this.getSoundById;
        p = function(b, d) {
            return !b ? "" : c._wD(s(b), d)
        };
        cb = function() {
            var b = y(c.debugID),
                d = y(c.debugID + "-toggle");
            if (!b) return !1;
            za ? (d.innerHTML = "+", b.style.display = "none") : (d.innerHTML = "-", b.style.display = "block");
            za = !za
        };
        B = function(b, c, e) {
            if (h.sm2Debugger !== g) try {
                sm2Debugger.handleEvent(b, c, e)
            } catch (a) {
                return !1
            }
            return !0
        };
        V = function() {
            var b = [];
            c.debugMode &&
                b.push("sm2_debug");
            c.debugFlash && b.push("flash_debug");
            c.useHighPerformance && b.push("high_performance");
            return b.join(" ")
        };
        Ja = function() {
            var b = s("fbHandler"),
                d = c.getMoviePercent(),
                e = {
                    type: "FLASHBLOCK"
                };
            if (c.html5Only) return !1;
            c.ok() ? (c.didFlashBlock && c._wD(b + ": Unblocked"), c.oMC && (c.oMC.className = [V(), "movieContainer", "swf_loaded" + (c.didFlashBlock ? " swf_unblocked" : "")].join(" "))) : (t && (c.oMC.className = V() + " movieContainer " + (null === d ? "swf_timedout" : "swf_error"), c._wD(b + ": " + s("fbTimeout") + (d ? " (" +
                s("fbLoaded") + ")" : ""))), c.didFlashBlock = !0, M({
                type: "ontimeout",
                ignoreInit: !0,
                error: e
            }), U(e))
        };
        Ba = function(b, c, e) {
            G[b] === g && (G[b] = []);
            G[b].push({
                method: c,
                scope: e || null,
                fired: !1
            })
        };
        M = function(b) {
            b || (b = {
                type: c.ok() ? "onready" : "ontimeout"
            });
            if (!q && b && !b.ignoreInit || "ontimeout" === b.type && (c.ok() || x && !b.ignoreInit)) return !1;
            var d = {
                    success: b && b.ignoreInit ? c.ok() : !x
                },
                e = b && b.type ? G[b.type] || [] : [],
                a = [],
                f, d = [d],
                g = t && !c.ok();
            b.error && (d[0].error = b.error);
            b = 0;
            for (f = e.length; b < f; b++) !0 !== e[b].fired && a.push(e[b]);
            if (a.length) {
                b = 0;
                for (f = a.length; b < f; b++) a[b].scope ? a[b].method.apply(a[b].scope, d) : a[b].method.apply(this, d), g || (a[b].fired = !0)
            }
            return !0
        };
        S = function() {
            h.setTimeout(function() {
                c.useFlashBlock && Ja();
                M();
                "function" === typeof c.onload && (p("onload", 1), c.onload.apply(h), p("onloadOK", 1));
                c.waitForWindowLoad && w.add(h, "load", S)
            }, 1)
        };
        Na = function() {
            if (F !== g) return F;
            var b = !1,
                c = navigator,
                e = c.plugins,
                a, f = h.ActiveXObject;
            if (e && e.length)(c = c.mimeTypes) && (c["application/x-shockwave-flash"] && c["application/x-shockwave-flash"].enabledPlugin &&
                c["application/x-shockwave-flash"].enabledPlugin.description) && (b = !0);
            else if (f !== g && !u.match(/MSAppHost/i)) {
                try {
                    a = new f("ShockwaveFlash.ShockwaveFlash")
                } catch (m) {
                    a = null
                }
                b = !!a
            }
            return F = b
        };
        gb = function() {
            var b, d, e = c.audioFormats;
            if (ua && u.match(/os (1|2|3_0|3_1)\s/i)) c.hasHTML5 = !1, c.html5Only = !0, c.oMC && (c.oMC.style.display = "none");
            else if (c.useHTML5Audio) {
                if (!c.html5 || !c.html5.canPlayType) c._wD("SoundManager: No HTML5 Audio() support detected."), c.hasHTML5 = !1;
                Ra && c._wD("soundManager: Note: Buggy HTML5 Audio in Safari on this OS X release, see https://bugs.webkit.org/show_bug.cgi?id\x3d32159 - " +
                    (!F ? " would use flash fallback for MP3/MP4, but none detected." : "will use flash fallback for MP3/MP4, if available"), 1)
            }
            if (c.useHTML5Audio && c.hasHTML5)
                for (d in da = !0, e)
                    if (e.hasOwnProperty(d) && e[d].required)
                        if (c.html5.canPlayType(e[d].type)) {
                            if (c.preferFlash && (c.flash[d] || c.flash[e[d].type])) b = !0
                        } else da = !1, b = !0;
            c.ignoreFlash && (b = !1, da = !0);
            c.html5Only = c.hasHTML5 && c.useHTML5Audio && !b;
            return !c.html5Only
        };
        qa = function(b) {
            var d, e, a = 0;
            if (b instanceof Array) {
                d = 0;
                for (e = b.length; d < e; d++)
                    if (b[d] instanceof Object) {
                        if (c.canPlayMIME(b[d].type)) {
                            a =
                                d;
                            break
                        }
                    } else if (c.canPlayURL(b[d])) {
                    a = d;
                    break
                }
                b[a].url && (b[a] = b[a].url);
                b = b[a]
            }
            return b
        };
        db = function(b) {
            b._hasTimer || (b._hasTimer = !0, !Qa && c.html5PollingInterval && (null === ca && 0 === pa && (ca = setInterval(fb, c.html5PollingInterval)), pa++))
        };
        eb = function(b) {
            b._hasTimer && (b._hasTimer = !1, !Qa && c.html5PollingInterval && pa--)
        };
        fb = function() {
            var b;
            if (null !== ca && !pa) return clearInterval(ca), ca = null, !1;
            for (b = c.soundIDs.length - 1; 0 <= b; b--) c.sounds[c.soundIDs[b]].isHTML5 && c.sounds[c.soundIDs[b]]._hasTimer && c.sounds[c.soundIDs[b]]._onTimer()
        };
        U = function(b) {
            b = b !== g ? b : {};
            "function" === typeof c.onerror && c.onerror.apply(h, [{
                type: b.type !== g ? b.type : null
            }]);
            b.fatal !== g && b.fatal && c.disable()
        };
        jb = function() {
            if (!Ra || !Na()) return !1;
            var b = c.audioFormats,
                d, e;
            for (e in b)
                if (b.hasOwnProperty(e) && ("mp3" === e || "mp4" === e))
                    if (c._wD("soundManager: Using flash fallback for " + e + " format"), c.html5[e] = !1, b[e] && b[e].related)
                        for (d = b[e].related.length - 1; 0 <= d; d--) c.html5[b[e].related[d]] = !1
        };
        this._setSandboxType = function(b) {
            var d = c.sandbox;
            d.type = b;
            d.description = d.types[d.types[b] !==
                g ? b : "unknown"];
            "localWithFile" === d.type ? (d.noRemote = !0, d.noLocal = !1, p("secNote", 2)) : "localWithNetwork" === d.type ? (d.noRemote = !1, d.noLocal = !0) : "localTrusted" === d.type && (d.noRemote = !1, d.noLocal = !1)
        };
        this._externalInterfaceOK = function(b) {
            if (c.swfLoaded) return !1;
            var d;
            B("swf", !0);
            B("flashtojs", !0);
            c.swfLoaded = !0;
            wa = !1;
            Ra && jb();
            if (!b || b.replace(/\+dev/i, "") !== c.versionNumber.replace(/\+dev/i, "")) return d = 'soundManager: Fatal: JavaScript file build "' + c.versionNumber + '" does not match Flash SWF build "' +
                b + '" at ' + c.url + ". Ensure both are up-to-date.", setTimeout(function() {
                    throw Error(d);
                }, 0), !1;
            setTimeout(ya, L ? 100 : 1)
        };
        ma = function(b, d) {
            function e() {
                var a = [],
                    b, d = [];
                b = "SoundManager " + c.version + (!c.html5Only && c.useHTML5Audio ? c.hasHTML5 ? " + HTML5 audio" : ", no HTML5 audio support" : "");
                c.html5Only ? c.html5PollingInterval && a.push("html5PollingInterval (" + c.html5PollingInterval + "ms)") : (c.preferFlash && a.push("preferFlash"), c.useHighPerformance && a.push("useHighPerformance"), c.flashPollingInterval && a.push("flashPollingInterval (" +
                    c.flashPollingInterval + "ms)"), c.html5PollingInterval && a.push("html5PollingInterval (" + c.html5PollingInterval + "ms)"), c.wmode && a.push("wmode (" + c.wmode + ")"), c.debugFlash && a.push("debugFlash"), c.useFlashBlock && a.push("flashBlock"));
                a.length && (d = d.concat([a.join(" + ")]));
                c._wD(b + (d.length ? " + " + d.join(", ") : ""), 1);
                kb()
            }

            function a(a, b) {
                return '\x3cparam name\x3d"' + a + '" value\x3d"' + b + '" /\x3e'
            }
            if (X && Y) return !1;
            if (c.html5Only) return Da(), e(), c.oMC = y(c.movieID), ya(), Y = X = !0, !1;
            var f = d || c.url,
                h = c.altURL || f,
                k = la(),
                l = V(),
                n = null,
                n = m.getElementsByTagName("html")[0],
                p, r, q, n = n && n.dir && n.dir.match(/rtl/i);
            b = b === g ? c.id : b;
            Da();
            c.url = bb(ga ? f : h);
            d = c.url;
            c.wmode = !c.wmode && c.useHighPerformance ? "transparent" : c.wmode;
            if (null !== c.wmode && (u.match(/msie 8/i) || !L && !c.useHighPerformance) && navigator.platform.match(/win32|win64/i)) O.push(I.spcWmode), c.wmode = null;
            k = {
                name: b,
                id: b,
                src: d,
                quality: "high",
                allowScriptAccess: c.allowScriptAccess,
                bgcolor: c.bgColor,
                pluginspage: pb + "www.macromedia.com/go/getflashplayer",
                title: "JS/Flash audio component (SoundManager 2)",
                type: "application/x-shockwave-flash",
                wmode: c.wmode,
                hasPriority: "true"
            };
            c.debugFlash && (k.FlashVars = "debug\x3d1");
            c.wmode || delete k.wmode;
            if (L) f = m.createElement("div"), r = ['\x3cobject id\x3d"' + b + '" data\x3d"' + d + '" type\x3d"' + k.type + '" title\x3d"' + k.title + '" classid\x3d"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase\x3d"' + pb + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version\x3d6,0,40,0"\x3e', a("movie", d), a("AllowScriptAccess", c.allowScriptAccess), a("quality", k.quality), c.wmode ?
                a("wmode", c.wmode) : "", a("bgcolor", c.bgColor), a("hasPriority", "true"), c.debugFlash ? a("FlashVars", k.FlashVars) : "", "\x3c/object\x3e"
            ].join("");
            else
                for (p in f = m.createElement("embed"), k) k.hasOwnProperty(p) && f.setAttribute(p, k[p]);
            Ga();
            l = V();
            if (k = la())
                if (c.oMC = y(c.movieID) || m.createElement("div"), c.oMC.id) q = c.oMC.className, c.oMC.className = (q ? q + " " : "movieContainer") + (l ? " " + l : ""), c.oMC.appendChild(f), L && (p = c.oMC.appendChild(m.createElement("div")), p.className = "sm2-object-box", p.innerHTML = r), Y = !0;
                else {
                    c.oMC.id =
                        c.movieID;
                    c.oMC.className = "movieContainer " + l;
                    p = l = null;
                    c.useFlashBlock || (c.useHighPerformance ? l = {
                        position: "fixed",
                        width: "8px",
                        height: "8px",
                        bottom: "0px",
                        left: "0px",
                        overflow: "hidden"
                    } : (l = {
                        position: "absolute",
                        width: "6px",
                        height: "6px",
                        top: "-9999px",
                        left: "-9999px"
                    }, n && (l.left = Math.abs(parseInt(l.left, 10)) + "px")));
                    ub && (c.oMC.style.zIndex = 1E4);
                    if (!c.debugFlash)
                        for (q in l) l.hasOwnProperty(q) && (c.oMC.style[q] = l[q]);
                    try {
                        L || c.oMC.appendChild(f), k.appendChild(c.oMC), L && (p = c.oMC.appendChild(m.createElement("div")),
                            p.className = "sm2-object-box", p.innerHTML = r), Y = !0
                    } catch (t) {
                        throw Error(s("domError") + " \n" + t.toString());
                    }
                }
            X = !0;
            e();
            return !0
        };
        ka = function() {
            if (c.html5Only) return ma(), !1;
            if (l) return !1;
            if (!c.url) return p("noURL"), !1;
            l = c.getMovie(c.id);
            l || (aa ? (L ? c.oMC.innerHTML = Ia : c.oMC.appendChild(aa), aa = null, X = !0) : ma(c.id, c.url), l = c.getMovie(c.id));
            "function" === typeof c.oninitmovie && setTimeout(c.oninitmovie, 1);
            Oa();
            return !0
        };
        T = function() {
            setTimeout(Ya, 1E3)
        };
        Ca = function() {
            h.setTimeout(function() {
                J("soundManager: useFlashBlock is false, 100% HTML5 mode is possible. Rebooting with preferFlash: false...");
                c.setup({
                    preferFlash: !1
                }).reboot();
                c.didFlashBlock = !0;
                c.beginDelayedInit()
            }, 1)
        };
        Ya = function() {
            var b, d = !1;
            if (!c.url || ba) return !1;
            ba = !0;
            w.remove(h, "load", T);
            if (F && wa && !Sa) return p("waitFocus"), !1;
            q || (b = c.getMoviePercent(), 0 < b && 100 > b && (d = !0));
            setTimeout(function() {
                b = c.getMoviePercent();
                if (d) return ba = !1, c._wD(s("waitSWF")), h.setTimeout(T, 1), !1;
                q || (c._wD("soundManager: No Flash response within expected time. Likely causes: " + (0 === b ? "SWF load failed, " : "") + "Flash blocked or JS-Flash security error." + (c.debugFlash ?
                    " " + s("checkSWF") : ""), 2), !ga && b && (p("localFail", 2), c.debugFlash || p("tryDebug", 2)), 0 === b && c._wD(s("swf404", c.url), 1), B("flashtojs", !1, ": Timed out" + ga ? " (Check flash security or flash blockers)" : " (No plugin/missing SWF?)"));
                !q && nb && (null === b ? c.useFlashBlock || 0 === c.flashLoadTimeout ? (c.useFlashBlock && Ja(), p("waitForever")) : !c.useFlashBlock && da ? Ca() : (p("waitForever"), M({
                        type: "ontimeout",
                        ignoreInit: !0,
                        error: {
                            type: "INIT_FLASHBLOCK"
                        }
                    })) : 0 === c.flashLoadTimeout ? p("waitForever") : !c.useFlashBlock && da ? Ca() :
                    Ha(!0))
            }, c.flashLoadTimeout)
        };
        ja = function() {
            if (Sa || !wa) return w.remove(h, "focus", ja), !0;
            Sa = nb = !0;
            p("gotFocus");
            ba = !1;
            T();
            w.remove(h, "focus", ja);
            return !0
        };
        Oa = function() {
            O.length && (c._wD("SoundManager 2: " + O.join(" "), 1), O = [])
        };
        kb = function() {
            Oa();
            var b, d = [];
            if (c.useHTML5Audio && c.hasHTML5) {
                for (b in c.audioFormats) c.audioFormats.hasOwnProperty(b) && d.push(b + " \x3d " + c.html5[b] + (!c.html5[b] && t && c.flash[b] ? " (using flash)" : c.preferFlash && c.flash[b] && t ? " (preferring flash)" : !c.html5[b] ? " (" + (c.audioFormats[b].required ?
                    "required, " : "") + "and no flash support)" : ""));
                c._wD("SoundManager 2 HTML5 support: " + d.join(", "), 1)
            }
        };
        Z = function(b) {
            if (q) return !1;
            if (c.html5Only) return p("sm2Loaded", 1), q = !0, S(), B("onload", !0), !0;
            var d = !0,
                e;
            if (!c.useFlashBlock || !c.flashLoadTimeout || c.getMoviePercent()) q = !0;
            e = {
                type: !F && t ? "NO_FLASH" : "INIT_TIMEOUT"
            };
            c._wD("SoundManager 2 " + (x ? "failed to load" : "loaded") + " (" + (x ? "Flash security/load error" : "OK") + ") " + String.fromCharCode(x ? 10006 : 10003), x ? 2 : 1);
            x || b ? (c.useFlashBlock && c.oMC && (c.oMC.className =
                V() + " " + (null === c.getMoviePercent() ? "swf_timedout" : "swf_error")), M({
                type: "ontimeout",
                error: e,
                ignoreInit: !0
            }), B("onload", !1), U(e), d = !1) : B("onload", !0);
            x || (c.waitForWindowLoad && !ia ? (p("waitOnload"), w.add(h, "load", S)) : (c.waitForWindowLoad && ia && p("docLoaded"), S()));
            return d
        };
        Xa = function() {
            var b, d = c.setupOptions;
            for (b in d) d.hasOwnProperty(b) && (c[b] === g ? c[b] = d[b] : c[b] !== d[b] && (c.setupOptions[b] = c[b]))
        };
        ya = function() {
            if (q) return p("didInit"), !1;
            if (c.html5Only) return q || (w.remove(h, "load", c.beginDelayedInit),
                c.enabled = !0, Z()), !0;
            ka();
            try {
                l._externalInterfaceTest(!1), Za(!0, c.flashPollingInterval || (c.useHighPerformance ? 10 : 50)), c.debugMode || l._disableDebug(), c.enabled = !0, B("jstoflash", !0), c.html5Only || w.add(h, "unload", xa)
            } catch (b) {
                return c._wD("js/flash exception: " + b.toString()), B("jstoflash", !1), U({
                    type: "JS_TO_FLASH_EXCEPTION",
                    fatal: !0
                }), Ha(!0), Z(), !1
            }
            Z();
            w.remove(h, "load", c.beginDelayedInit);
            return !0
        };
        N = function() {
            if ($) return !1;
            $ = !0;
            Xa();
            Ga();
            var b = null,
                b = null,
                d = W.toLowerCase(); - 1 !== d.indexOf("sm2-usehtml5audio\x3d") &&
                (b = "1" === d.charAt(d.indexOf("sm2-usehtml5audio\x3d") + 18), fa && console.log((b ? "Enabling " : "Disabling ") + "useHTML5Audio via URL parameter"), c.setup({
                    useHTML5Audio: b
                })); - 1 !== d.indexOf("sm2-preferflash\x3d") && (b = "1" === d.charAt(d.indexOf("sm2-preferflash\x3d") + 16), fa && console.log((b ? "Enabling " : "Disabling ") + "preferFlash via URL parameter"), c.setup({
                preferFlash: b
            }));
            !F && c.hasHTML5 && (c._wD("SoundManager 2: No Flash detected" + (!c.useHTML5Audio ? ", enabling HTML5." : ". Trying HTML5-only mode."), 1), c.setup({
                useHTML5Audio: !0,
                preferFlash: !1
            }));
            hb();
            !F && t && (O.push(I.needFlash), c.setup({
                flashLoadTimeout: 1
            }));
            m.removeEventListener && m.removeEventListener("DOMContentLoaded", N, !1);
            ka();
            return !0
        };
        La = function() {
            "complete" === m.readyState && (N(), m.detachEvent("onreadystatechange", La));
            return !0
        };
        Fa = function() {
            ia = !0;
            N();
            w.remove(h, "load", Fa)
        };
        Ea = function() {
            if (Qa && ((!c.setupOptions.useHTML5Audio || c.setupOptions.preferFlash) && O.push(I.mobileUA), c.setupOptions.useHTML5Audio = !0, c.setupOptions.preferFlash = !1, ua || mb && !u.match(/android\s2\.3/i))) O.push(I.globalHTML5),
                ua && (c.ignoreFlash = !0), D = !0
        };
        Ea();
        Na();
        w.add(h, "focus", ja);
        w.add(h, "load", T);
        w.add(h, "load", Fa);
        m.addEventListener ? m.addEventListener("DOMContentLoaded", N, !1) : m.attachEvent ? m.attachEvent("onreadystatechange", La) : (B("onload", !1), U({
            type: "NO_DOM2_EVENTS",
            fatal: !0
        }))
    }
    if (!h || !h.document) throw Error("SoundManager requires a browser with window and document objects.");
    var P = null;
    if (void 0 === h.SM2_DEFER || !SM2_DEFER) P = new Q;
    "object" === typeof module && module && "object" === typeof module.exports ? (h.soundManager =
        P, module.exports.SoundManager = Q, module.exports.soundManager = P) : "function" === typeof define && define.amd ? define("SoundManager", [], function() {
        return {
            SoundManager: Q,
            soundManager: P
        }
    }) : (h.SoundManager = Q, h.soundManager = P)
})(window);