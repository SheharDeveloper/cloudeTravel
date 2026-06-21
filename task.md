<!doctype html>







<html lang="en">

<head>
    <script>
        (function(w, i, g) {
            w[g] = w[g] || [];
            if (typeof w[g].push == 'function') w[g].push(i)
        })
        (window, 'GTM-KPMNX7Z', 'google_tags_first_party');
    </script>
    <script>
        (function(w, d, s, l) {
            w[l] = w[l] || [];
            (function() {
                w[l].push(arguments);
            })('set', 'developer_id.dYzg1YT', true);
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s);
            j.async = true;
            j.src = '/b0of/';
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer');
    </script>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <script type="228fe3999d327e492e219f71-text/javascript">
        (window.NREUM || (NREUM = {})).init = {
            privacy: {
                cookies_enabled: true
            },
            ajax: {
                deny_list: ["bam.nr-data.net"]
            },
            feature_flags: ["soft_nav"],
            distributed_tracing: {
                enabled: true
            }
        };
        (window.NREUM || (NREUM = {})).loader_config = {
            agentID: "1589070340",
            accountID: "2927581",
            trustKey: "2927581",
            xpid: "Vg8FVlNbCRABUFZaBAkFVF0D",
            licenseKey: "NRJS-5690b18bb2a84acb715",
            applicationID: "1478382292",
            browserID: "1589070340"
        };; /*! For license information please see nr-loader-spa-1.316.0.min.js.LICENSE.txt */
        (() => {
            var e, t, r = {
                    384: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            NT: () => a,
                            Zm: () => c,
                            bQ: () => u,
                            dV: () => d,
                            pV: () => l
                        });
                        var n = r(6154),
                            i = r(1863),
                            s = r(944),
                            o = r(1910);
                        const a = {
                            beacon: "bam.nr-data.net",
                            errorBeacon: "bam.nr-data.net"
                        };

                        function c() {
                            return n.gm.NREUM || (n.gm.NREUM = {}), void 0 === n.gm.newrelic && (n.gm.newrelic = n.gm.NREUM), n.gm.NREUM
                        }

                        function d() {
                            let e = c();
                            return e.o || (e.o = {
                                ST: n.gm.setTimeout,
                                SI: n.gm.setImmediate || n.gm.setInterval,
                                CT: n.gm.clearTimeout,
                                XHR: n.gm.XMLHttpRequest,
                                REQ: n.gm.Request,
                                EV: n.gm.Event,
                                PR: n.gm.Promise,
                                MO: n.gm.MutationObserver,
                                FETCH: n.gm.fetch,
                                WS: n.gm.WebSocket
                            }, (0, o.i)(...Object.values(e.o))), e
                        }

                        function u(e, t) {
                            let r = c();
                            r.initializedAgents ? ? = {}, t.initializedAt = {
                                ms: (0, i.t)(),
                                date: new Date
                            }, r.initializedAgents[e] = t, 2 === Object.keys(r.initializedAgents).length && (0, s.R)(69)
                        }

                        function l() {
                            return function() {
                                    let e = c();
                                    const t = e.info || {};
                                    e.info = {
                                        beacon: a.beacon,
                                        errorBeacon: a.errorBeacon,
                                        ...t
                                    }
                                }(),
                                function() {
                                    let e = c();
                                    const t = e.init || {};
                                    e.init = { ...t
                                    }
                                }(), d(),
                                function() {
                                    let e = c();
                                    const t = e.loader_config || {};
                                    e.loader_config = { ...t
                                    }
                                }(), c()
                        }
                    },
                    733: (e, t, r) => {
                        "use strict";

                        function n(e, t) {
                            return function(e) {
                                let t = 2166136261;
                                for (let r = 0; r < e.length; r++) t ^= e.charCodeAt(r), t = Math.imul(t, 16777619);
                                return (t >>> 0).toString(16).padStart(8, "0")
                            }("".concat(String(e), ":").concat(String(t)))
                        }
                        r.d(t, {
                            Y: () => n
                        })
                    },
                    782: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            T: () => n
                        });
                        const n = r(860).K7.pageViewTiming
                    },
                    860: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            $J: () => u,
                            K7: () => c,
                            P3: () => d,
                            XX: () => i,
                            Yy: () => a,
                            df: () => s,
                            qY: () => n,
                            v4: () => o
                        });
                        const n = "events",
                            i = "jserrors",
                            s = "browser/blobs",
                            o = "rum",
                            a = "browser/logs",
                            c = {
                                ajax: "ajax",
                                genericEvents: "generic_events",
                                jserrors: i,
                                logging: "logging",
                                metrics: "metrics",
                                pageAction: "page_action",
                                pageViewEvent: "page_view_event",
                                pageViewTiming: "page_view_timing",
                                sessionReplay: "session_replay",
                                sessionTrace: "session_trace",
                                softNav: "soft_navigations"
                            },
                            d = {
                                [c.pageViewEvent]: 1,
                                [c.pageViewTiming]: 2,
                                [c.metrics]: 3,
                                [c.jserrors]: 4,
                                [c.softNav]: 5,
                                [c.ajax]: 6,
                                [c.sessionTrace]: 7,
                                [c.sessionReplay]: 8,
                                [c.logging]: 9,
                                [c.genericEvents]: 10
                            },
                            u = {
                                [c.pageViewEvent]: o,
                                [c.pageViewTiming]: n,
                                [c.ajax]: n,
                                [c.softNav]: n,
                                [c.metrics]: i,
                                [c.jserrors]: i,
                                [c.sessionTrace]: s,
                                [c.sessionReplay]: s,
                                [c.logging]: a,
                                [c.genericEvents]: "ins"
                            }
                    },
                    944: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            R: () => i
                        });
                        var n = r(3241);

                        function i(e, t) {
                            "function" == typeof console.debug && (console.debug("New Relic Warning: https://github.com/newrelic/newrelic-browser-agent/blob/main/docs/warning-codes.md#".concat(e), t), (0, n.W)({
                                drained: null,
                                type: "data",
                                name: "warn",
                                feature: "warn",
                                data: {
                                    code: e,
                                    secondary: t
                                }
                            }))
                        }
                    },
                    993: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            A$: () => s,
                            ET: () => o,
                            TZ: () => a,
                            p_: () => i
                        });
                        var n = r(860);
                        const i = {
                                ERROR: "ERROR",
                                WARN: "WARN",
                                INFO: "INFO",
                                DEBUG: "DEBUG",
                                TRACE: "TRACE"
                            },
                            s = {
                                OFF: 0,
                                ERROR: 1,
                                WARN: 2,
                                INFO: 3,
                                DEBUG: 4,
                                TRACE: 5
                            },
                            o = "log",
                            a = n.K7.logging
                    },
                    1687: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            Ak: () => a,
                            Ze: () => d,
                            x3: () => c
                        });
                        var n = r(3241),
                            i = r(3606),
                            s = r(860),
                            o = r(2646);

                        function a(e, t) {
                            if (!e) return;
                            const r = {
                                staged: !1,
                                priority: s.P3[t] || 0
                            };
                            e.runtime.drainRegistry.get(t) || e.runtime.drainRegistry.set(t, r)
                        }

                        function c(e, t) {
                            if (!e) return;
                            const r = e.runtime.drainRegistry;
                            r && (r.get(t) && r.delete(t), l(e, t, !1), r.size && u(e))
                        }

                        function d(e, t = "feature", r = !1) {
                            if (e) {
                                if (!e.runtime.drainRegistry.get(t) || r) return l(e, t);
                                e.runtime.drainRegistry.get(t).staged = !0, u(e)
                            }
                        }

                        function u(e) {
                            if (!e) return;
                            const t = Array.from(e.runtime.drainRegistry);
                            t.every(([e, t]) => t.staged) && (t.sort((e, t) => e[1].priority - t[1].priority), t.forEach(([t]) => {
                                e.runtime.drainRegistry.delete(t), l(e, t)
                            }))
                        }

                        function l(e, t, r = !0) {
                            if (!e) return;
                            const s = e.ee,
                                a = i.i.handlers;
                            if (s && !s.aborted && s.backlog && a) {
                                if ((0, n.W)({
                                        type: "lifecycle",
                                        name: "drain",
                                        feature: t
                                    }), r) {
                                    const e = s.backlog[t],
                                        r = a[t];
                                    if (r) {
                                        for (let t = 0; e && t < e.length; ++t) f(e[t], r);
                                        Object.entries(r).forEach(([e, t]) => {
                                            Object.values(t || {}).forEach(t => {
                                                t[0] ? .on && t[0].context() instanceof o.y && !t[0].listeners(e).includes(t[1]) && t[0].on(e, t[1])
                                            })
                                        })
                                    }
                                }
                                s.isolatedBacklog || delete a[t], s.backlog[t] = null, s.emit("drain-" + t, [])
                            }
                        }

                        function f(e, t) {
                            var r = e[1];
                            Object.values(t[r] || {}).forEach(t => {
                                var r = e[0];
                                if (t[0] === r) {
                                    var n = t[1],
                                        i = e[3],
                                        s = e[2];
                                    n.apply(i, s)
                                }
                            })
                        }
                    },
                    1738: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            U: () => f,
                            Y: () => l
                        });
                        var n = r(3241),
                            i = r(9908),
                            s = r(1863),
                            o = r(944),
                            a = r(3969),
                            c = r(8362),
                            d = r(860),
                            u = r(4261);

                        function l(e, t, r, s) {
                            const l = s || r;
                            !l || l[e] && l[e] !== c.d.prototype[e] || (l[e] = function() {
                                (0, i.p)(a.xV, ["API/" + e + "/called"], void 0, d.K7.metrics, r.ee), (0, n.W)({
                                    drained: !!r.runtime ? .activatedFeatures,
                                    type: "data",
                                    name: "api",
                                    feature: u.Pl + e,
                                    data: {}
                                });
                                try {
                                    return t.apply(this, arguments)
                                } catch (e) {
                                    (0, o.R)(23, e)
                                }
                            })
                        }

                        function f(e, t, r, n, o) {
                            const a = e.info;
                            null === r ? delete a.jsAttributes[t] : a.jsAttributes[t] = r, (o || null === r) && (0, i.p)(u.Pl + n, [(0, s.t)(), t, r], void 0, "session", e.ee)
                        }
                    },
                    1741: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            W: () => s
                        });
                        var n = r(944),
                            i = r(4261);
                        class s {#
                            e(e, ...t) {
                                if (this[e] !== s.prototype[e]) return this[e](...t);
                                (0, n.R)(35, e)
                            }
                            addPageAction(e, t) {
                                return this.#e(i.hG, e, t)
                            }
                            register(e) {
                                return this.#e(i.eY, e)
                            }
                            recordCustomEvent(e, t) {
                                return this.#e(i.fF, e, t)
                            }
                            setPageViewName(e, t) {
                                return this.#e(i.Fw, e, t)
                            }
                            setCustomAttribute(e, t, r) {
                                return this.#e(i.cD, e, t, r)
                            }
                            noticeError(e, t) {
                                return this.#e(i.o5, e, t)
                            }
                            setUserId(e, t = !1) {
                                return this.#e(i.Dl, e, t)
                            }
                            setApplicationVersion(e) {
                                return this.#e(i.nb, e)
                            }
                            setErrorHandler(e) {
                                return this.#e(i.bt, e)
                            }
                            addRelease(e, t) {
                                return this.#e(i.k6, e, t)
                            }
                            log(e, t) {
                                return this.#e(i.$9, e, t)
                            }
                            start() {
                                return this.#e(i.d3)
                            }
                            finished(e) {
                                return this.#e(i.BL, e)
                            }
                            recordReplay() {
                                return this.#e(i.CH)
                            }
                            pauseReplay() {
                                return this.#e(i.Tb)
                            }
                            addToTrace(e) {
                                return this.#e(i.U2, e)
                            }
                            setCurrentRouteName(e) {
                                return this.#e(i.PA, e)
                            }
                            interaction(e) {
                                return this.#e(i.dT, e)
                            }
                            wrapLogger(e, t, r) {
                                return this.#e(i.Wb, e, t, r)
                            }
                            measure(e, t) {
                                return this.#e(i.V1, e, t)
                            }
                            consent(e) {
                                return this.#e(i.Pv, e)
                            }
                        }
                    },
                    1863: (e, t, r) => {
                        "use strict";

                        function n() {
                            return Math.floor(performance.now())
                        }
                        r.d(t, {
                            t: () => n
                        })
                    },
                    1910: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            i: () => s
                        });
                        var n = r(944);
                        const i = new Map;

                        function s(...e) {
                            return e.every(e => {
                                if (i.has(e)) return i.get(e);
                                const t = "function" == typeof e ? e.toString() : "",
                                    r = t.includes("[native code]"),
                                    s = t.includes("nrWrapper");
                                return r || s || (0, n.R)(64, e ? .name || t), i.set(e, r), r
                            })
                        }
                    },
                    2555: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            D: () => a,
                            f: () => o
                        });
                        var n = r(384),
                            i = r(8122);
                        const s = {
                            beacon: n.NT.beacon,
                            errorBeacon: n.NT.errorBeacon,
                            licenseKey: void 0,
                            applicationID: void 0,
                            sa: void 0,
                            queueTime: void 0,
                            applicationTime: void 0,
                            ttGuid: void 0,
                            user: void 0,
                            account: void 0,
                            product: void 0,
                            extra: void 0,
                            jsAttributes: {},
                            userAttributes: void 0,
                            atts: void 0,
                            transactionName: void 0,
                            tNamePlain: void 0
                        };

                        function o(e) {
                            try {
                                return !!e.licenseKey && !!e.errorBeacon && !!e.applicationID
                            } catch (e) {
                                return !1
                            }
                        }
                        const a = e => (0, i.a)(e, s)
                    },
                    2614: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            BB: () => s,
                            Wt: () => n,
                            g: () => c,
                            iL: () => a,
                            tS: () => o,
                            wk: () => i
                        });
                        const n = "NRBA_SESSION::",
                            i = 144e5,
                            s = 18e5,
                            o = {
                                STARTED: "session-started",
                                PAUSE: "session-pause",
                                RESET: "session-reset",
                                RESUME: "session-resume",
                                UPDATE: "session-update"
                            },
                            a = {
                                SAME_TAB: "same-tab",
                                CROSS_TAB: "cross-tab"
                            },
                            c = {
                                OFF: 0,
                                FULL: 1,
                                ERROR: 2
                            }
                    },
                    2646: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            y: () => n
                        });
                        class n {
                            constructor(e) {
                                this.contextId = e
                            }
                        }
                    },
                    2843: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            G: () => s,
                            u: () => i
                        });
                        var n = r(3878);

                        function i(e, t = !1, r, i) {
                            (0, n.DD)("visibilitychange", function() {
                                if (t) return void("hidden" === document.visibilityState && e());
                                e(document.visibilityState)
                            }, r, i)
                        }

                        function s(e, t, r) {
                            (0, n.sp)("pagehide", e, t, r)
                        }
                    },
                    3241: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            W: () => s
                        });
                        var n = r(6154);
                        const i = "newrelic";

                        function s(e = {}) {
                            try {
                                n.gm.dispatchEvent(new CustomEvent(i, {
                                    detail: e
                                }))
                            } catch (e) {}
                        }
                    },
                    3304: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            A: () => s
                        });
                        var n = r(7836);
                        const i = () => {
                            const e = new WeakSet;
                            return (t, r) => {
                                if ("object" == typeof r && null !== r) {
                                    if (e.has(r)) return;
                                    e.add(r)
                                }
                                return r
                            }
                        };

                        function s(e) {
                            try {
                                return JSON.stringify(e, i()) ? ? ""
                            } catch (e) {
                                try {
                                    n.ee.emit("internal-error", [e])
                                } catch (e) {}
                                return ""
                            }
                        }
                    },
                    3333: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            $v: () => u,
                            TZ: () => n,
                            Xh: () => c,
                            Zp: () => i,
                            kd: () => d,
                            mq: () => a,
                            nf: () => o,
                            qN: () => s
                        });
                        const n = r(860).K7.genericEvents,
                            i = ["auxclick", "click", "copy", "keydown", "paste", "scrollend"],
                            s = ["focus", "blur"],
                            o = 4,
                            a = 1e3,
                            c = 2e3,
                            d = ["PageAction", "UserAction", "BrowserPerformance"],
                            u = {
                                RESOURCES: "experimental.resources",
                                REGISTER: "register"
                            }
                    },
                    3434: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            Jt: () => o,
                            YM: () => u
                        });
                        var n = r(7836),
                            i = r(5607),
                            s = r(5732);
                        const o = "nr@original:".concat(i.W),
                            a = 50;
                        var c = Object.prototype.hasOwnProperty,
                            d = !1;

                        function u(e, t, r) {
                            return e || (e = n.ee), i.inPlace = function(e, t, r, n, s, o) {
                                r || (r = "");
                                const a = "-" === r.charAt(0);
                                for (let c = 0; c < t.length; c++) {
                                    const d = t[c],
                                        u = e[d];
                                    f(u) || (e[d] = i(u, a ? d + r : r, n, d, s, o))
                                }
                            }, i.flag = o, i;

                            function i(t, n, i, d, h, p) {
                                return f(t) ? t : (n || (n = ""), nrWrapper[o] = t, function(e, t, r) {
                                    if (Object.defineProperty && Object.keys) try {
                                        return Object.keys(e).forEach(function(r) {
                                            Object.defineProperty(t, r, {
                                                get: function() {
                                                    return e[r]
                                                },
                                                set: function(t) {
                                                    return e[r] = t, t
                                                }
                                            })
                                        }), t
                                    } catch (e) {
                                        l([e], r)
                                    }
                                    for (var n in e) c.call(e, n) && (t[n] = e[n])
                                }(t, nrWrapper, e), nrWrapper);

                                function nrWrapper() {
                                    var o, c, f, g;
                                    let m, v;
                                    try {
                                        c = this, o = [...arguments], v = p ? (0, s.$5)(r) : [void 0], f = "function" == typeof i ? i(o, c) : i || {}
                                    } catch (t) {
                                        l([t, "", [o, c, d], f], e)
                                    }
                                    u(n + "start", [o, c, d, v], f, h);
                                    const y = performance.now();
                                    let b;
                                    try {
                                        return g = t.apply(c, o), b = performance.now(), g
                                    } catch (e) {
                                        throw b = performance.now(), u(n + "err", [o, c, e, v], f, h), m = e, m
                                    } finally {
                                        const e = b - y,
                                            t = {
                                                start: y,
                                                end: b,
                                                duration: e,
                                                isLongTask: e >= a,
                                                methodName: d,
                                                thrownError: m
                                            };
                                        t.isLongTask && u("long-task", [t, c, v], f, h), u(n + "end", [o, c, g, v], f, h)
                                    }
                                }
                            }

                            function u(r, n, i, s) {
                                if (!d || t) {
                                    var o = d;
                                    d = !0;
                                    try {
                                        e.emit(r, n, i, t, s)
                                    } catch (t) {
                                        l([t, r, n, i], e)
                                    }
                                    d = o
                                }
                            }
                        }

                        function l(e, t) {
                            t || (t = n.ee);
                            try {
                                t.emit("internal-error", e)
                            } catch (e) {}
                        }

                        function f(e) {
                            return !(e && "function" == typeof e && e.apply && !e[o])
                        }
                    },
                    3606: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            i: () => s
                        });
                        var n = r(9908);
                        s.on = o;
                        var i = s.handlers = {};

                        function s(e, t, r, s) {
                            o(s || n.d, i, e, t, r)
                        }

                        function o(e, t, r, i, s) {
                            s || (s = "feature"), e || (e = n.d);
                            var o = t[s] = t[s] || {};
                            (o[r] = o[r] || []).push([e, i])
                        }
                    },
                    3738: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            He: () => i,
                            Kp: () => a,
                            Lc: () => d,
                            Rz: () => u,
                            TZ: () => n,
                            bD: () => s,
                            d3: () => o,
                            jx: () => l,
                            sl: () => f,
                            uP: () => c
                        });
                        const n = r(860).K7.sessionTrace,
                            i = "bstResource",
                            s = "resource",
                            o = "-start",
                            a = "-end",
                            c = "fn" + o,
                            d = "fn" + a,
                            u = "pushState",
                            l = 1e3,
                            f = 3e4
                    },
                    3785: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            R: () => c,
                            b: () => d
                        });
                        var n = r(9908),
                            i = r(1863),
                            s = r(860),
                            o = r(3969),
                            a = r(993);

                        function c(e, t, r = {}, c = a.p_.INFO, d = !0, u, l = (0, i.t)()) {
                            (0, n.p)(o.xV, ["API/logging/".concat(c.toLowerCase(), "/called")], void 0, s.K7.metrics, e), (0, n.p)(a.ET, [l, t, r, c, d, u], void 0, s.K7.logging, e)
                        }

                        function d(e) {
                            return "string" == typeof e && Object.values(a.p_).some(t => t === e.toUpperCase().trim())
                        }
                    },
                    3878: (e, t, r) => {
                        "use strict";

                        function n(e, t) {
                            return {
                                capture: e,
                                passive: !1,
                                signal: t
                            }
                        }

                        function i(e, t, r = !1, i) {
                            window.addEventListener(e, t, n(r, i))
                        }

                        function s(e, t, r = !1, i) {
                            document.addEventListener(e, t, n(r, i))
                        }
                        r.d(t, {
                            DD: () => s,
                            jT: () => n,
                            sp: () => i
                        })
                    },
                    3962: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            AM: () => o,
                            O2: () => l,
                            OV: () => s,
                            Qu: () => f,
                            TZ: () => c,
                            ih: () => h,
                            pP: () => a,
                            t1: () => u,
                            tC: () => i,
                            wD: () => d
                        });
                        var n = r(860);
                        const i = ["click", "keydown", "submit"],
                            s = "popstate",
                            o = "api",
                            a = "initialPageLoad",
                            c = n.K7.softNav,
                            d = 5e3,
                            u = 500,
                            l = {
                                INITIAL_PAGE_LOAD: "",
                                ROUTE_CHANGE: 1,
                                UNSPECIFIED: 2
                            },
                            f = {
                                INTERACTION: 1,
                                AJAX: 2,
                                CUSTOM_END: 3,
                                CUSTOM_TRACER: 4
                            },
                            h = {
                                IP: "in progress",
                                PF: "pending finish",
                                FIN: "finished",
                                CAN: "cancelled"
                            }
                    },
                    3969: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            TZ: () => n,
                            XG: () => a,
                            rs: () => i,
                            xV: () => o,
                            z_: () => s
                        });
                        const n = r(860).K7.metrics,
                            i = "sm",
                            s = "cm",
                            o = "storeSupportabilityMetrics",
                            a = "storeEventMetrics"
                    },
                    4234: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            W: () => i
                        });
                        var n = r(1687);
                        class i {
                            constructor(e, t) {
                                this.agentRef = e, this.ee = e ? .ee, this.featureName = t, this.blocked = !1
                            }
                            deregisterDrain() {
                                (0, n.x3)(this.agentRef, this.featureName)
                            }
                        }
                    },
                    4261: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            $9: () => u,
                            BL: () => c,
                            CH: () => p,
                            Dl: () => R,
                            Fw: () => w,
                            PA: () => v,
                            Pl: () => n,
                            Pv: () => x,
                            Tb: () => f,
                            U2: () => o,
                            V1: () => A,
                            Wb: () => T,
                            bt: () => b,
                            cD: () => y,
                            d3: () => E,
                            dT: () => d,
                            eY: () => g,
                            fF: () => h,
                            hG: () => s,
                            hw: () => i,
                            k6: () => a,
                            nb: () => m,
                            o5: () => l
                        });
                        const n = "api-",
                            i = n + "ixn-",
                            s = "addPageAction",
                            o = "addToTrace",
                            a = "addRelease",
                            c = "finished",
                            d = "interaction",
                            u = "log",
                            l = "noticeError",
                            f = "pauseReplay",
                            h = "recordCustomEvent",
                            p = "recordReplay",
                            g = "register",
                            m = "setApplicationVersion",
                            v = "setCurrentRouteName",
                            y = "setCustomAttribute",
                            b = "setErrorHandler",
                            w = "setPageViewName",
                            R = "setUserId",
                            E = "start",
                            T = "wrapLogger",
                            A = "measure",
                            x = "consent"
                    },
                    5270: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            Aw: () => o,
                            SR: () => s,
                            rF: () => a
                        });
                        var n = r(384),
                            i = r(7767);

                        function s(e) {
                            return !!(0, n.dV)().o.MO && (0, i.V)(e) && !0 === e ? .session_trace.enabled
                        }

                        function o(e) {
                            return !0 === e ? .session_replay.preload && s(e)
                        }

                        function a(e, t) {
                            try {
                                if ("string" == typeof t ? .type) {
                                    if ("password" === t.type.toLowerCase()) return "*".repeat(e ? .length || 0);
                                    if (void 0 !== t ? .dataset ? .nrUnmask || t ? .classList ? .contains("nr-unmask")) return e
                                }
                            } catch (e) {}
                            return "string" == typeof e ? e.replace(/[\S]/g, "*") : "*".repeat(e ? .length || 0)
                        }
                    },
                    5289: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            GG: () => o,
                            Qr: () => c,
                            sB: () => a
                        });
                        var n = r(3878),
                            i = r(6389);

                        function s() {
                            return "undefined" == typeof document || "complete" === document.readyState
                        }

                        function o(e, t) {
                            if (s()) return e();
                            const r = (0, i.J)(e),
                                o = setInterval(() => {
                                    s() && (clearInterval(o), r())
                                }, 500);
                            (0, n.sp)("load", r, t)
                        }

                        function a(e) {
                            if (s()) return e();
                            (0, n.DD)("DOMContentLoaded", e)
                        }

                        function c(e) {
                            if (s()) return e();
                            (0, n.sp)("popstate", e)
                        }
                    },
                    5607: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            W: () => n
                        });
                        const n = (0, r(9566).bz)()
                    },
                    5732: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            $5: () => u,
                            B5: () => d,
                            Ms: () => s,
                            Ux: () => a,
                            YA: () => c,
                            fQ: () => i,
                            yx: () => o
                        });
                        var n = r(7508);
                        const i = {
                            MFE: "MFE",
                            BA: "BA"
                        };

                        function s(e, t) {
                            if (!e || !t ? .init.api.register.enabled) return [];
                            const r = t.runtime.registeredEntities;
                            return r ? .filter(t => String(t.metadata.target.id) === String(e)).map(e => e.metadata.target) || []
                        }

                        function o(e, t) {
                            if (!e || !t ? .init.api.register.enabled) return [];
                            const r = t.runtime.registeredEntities;
                            return r ? .filter(t => t.metadata.timings ? .asset ? .endsWith(e)).map(e => e.metadata.target) || []
                        }

                        function a(e, t) {
                            if (!l(t)) return {};
                            const r = t.agentRef.runtime.appMetadata.agents[0].entityGuid;
                            return e ? e.attributes : {
                                "entity.guid": r,
                                appId: t.agentRef.info.applicationID
                            }
                        }

                        function c(e, t) {
                            return d(e, t) ? {
                                "child.id": e.id,
                                "child.type": e.type,
                                ...a(void 0, t)
                            } : {}
                        }

                        function d(e, t) {
                            return !!e && !!l(t) && t.agentRef.init.api.register.duplicate_data_to_container
                        }

                        function u(e) {
                            if (!e ? .init.api.register.enabled) return [void 0];
                            const t = [];
                            try {
                                var r = (0, n.AZ)((0, n.QL)());
                                let i = r.length - 1;
                                for (; r[i];) t.push(...o(r[i--], e))
                            } catch (e) {}
                            return t.length || t.push(void 0), t
                        }

                        function l(e) {
                            return 2 === e ? .harvestEndpointVersion
                        }
                    },
                    6154: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            OF: () => d,
                            RI: () => i,
                            WN: () => f,
                            bv: () => s,
                            gm: () => o,
                            lR: () => l,
                            m: () => c,
                            mw: () => a,
                            sb: () => u,
                            zk: () => h
                        });
                        var n = r(1863);
                        const i = "undefined" != typeof window && !!window.document,
                            s = "undefined" != typeof WorkerGlobalScope && ("undefined" != typeof self && self instanceof WorkerGlobalScope && self.navigator instanceof WorkerNavigator || "undefined" != typeof globalThis && globalThis instanceof WorkerGlobalScope && globalThis.navigator instanceof WorkerNavigator),
                            o = i ? window : "undefined" != typeof WorkerGlobalScope && ("undefined" != typeof self && self instanceof WorkerGlobalScope && self || "undefined" != typeof globalThis && globalThis instanceof WorkerGlobalScope && globalThis),
                            a = Boolean("hidden" === o ? .document ? .visibilityState),
                            c = "" + o ? .location,
                            d = /iPad|iPhone|iPod/.test(o.navigator ? .userAgent),
                            u = d && "undefined" == typeof SharedWorker,
                            l = (() => {
                                const e = o.navigator ? .userAgent ? .match(/Firefox[/\s](\d+\.\d+)/);
                                return Array.isArray(e) && e.length >= 2 ? +e[1] : 0
                            })(),
                            f = Date.now() - (0, n.t)(),
                            h = () => {
                                const e = o ? .performance ? .getEntriesByType ? .("navigation") ? .[0];
                                if (e && e.responseStart > 0 && e.responseStart < o.performance.now()) return e
                            }
                    },
                    6344: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            BB: () => u,
                            Qb: () => l,
                            TZ: () => i,
                            Ug: () => o,
                            Vh: () => s,
                            _s: () => a,
                            bc: () => d,
                            yP: () => c
                        });
                        var n = r(2614);
                        const i = r(860).K7.sessionReplay,
                            s = "errorDuringReplay",
                            o = .12,
                            a = {
                                DomContentLoaded: 0,
                                Load: 1,
                                FullSnapshot: 2,
                                IncrementalSnapshot: 3,
                                Meta: 4,
                                Custom: 5
                            },
                            c = {
                                [n.g.ERROR]: 15e3,
                                [n.g.FULL]: 3e5,
                                [n.g.OFF]: 0
                            },
                            d = {
                                RESET: {
                                    message: "Session was reset",
                                    sm: "Reset"
                                },
                                IMPORT: {
                                    message: "Recorder failed to import",
                                    sm: "Import"
                                },
                                TOO_MANY: {
                                    message: "429: Too Many Requests",
                                    sm: "Too-Many"
                                },
                                TOO_BIG: {
                                    message: "Payload was too large",
                                    sm: "Too-Big"
                                },
                                CROSS_TAB: {
                                    message: "Session Entity was set to OFF on another tab",
                                    sm: "Cross-Tab"
                                },
                                ENTITLEMENTS: {
                                    message: "Session Replay is not allowed and will not be started",
                                    sm: "Entitlement"
                                }
                            },
                            u = 5e3,
                            l = {
                                API: "api",
                                RESUME: "resume",
                                SWITCH_TO_FULL: "switchToFull",
                                INITIALIZE: "initialize",
                                PRELOAD: "preload"
                            }
                    },
                    6389: (e, t, r) => {
                        "use strict";

                        function n(e, t = 500, r = {}) {
                            const n = r ? .leading || !1;
                            let i;
                            return (...r) => {
                                n && void 0 === i && (e.apply(this, r), i = setTimeout(() => {
                                    i = clearTimeout(i)
                                }, t)), n || (clearTimeout(i), i = setTimeout(() => {
                                    e.apply(this, r)
                                }, t))
                            }
                        }

                        function i(e) {
                            let t = !1;
                            return (...r) => {
                                t || (t = !0, e.apply(this, r))
                            }
                        }
                        r.d(t, {
                            J: () => i,
                            s: () => n
                        })
                    },
                    6630: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            T: () => n
                        });
                        const n = r(860).K7.pageViewEvent
                    },
                    6774: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            T: () => n
                        });
                        const n = r(860).K7.jserrors
                    },
                    7295: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            Xv: () => o,
                            gX: () => i,
                            iW: () => s
                        });
                        var n = [];

                        function i(e) {
                            if (!e || s(e)) return !1;
                            if (0 === n.length) return !0;
                            if ("*" === n[0].hostname) return !1;
                            for (var t = 0; t < n.length; t++) {
                                var r = n[t];
                                if (r.hostname.test(e.hostname) && r.pathname.test(e.pathname)) return !1
                            }
                            return !0
                        }

                        function s(e) {
                            return void 0 === e.hostname
                        }

                        function o(e) {
                            if (n = [], e && e.length)
                                for (var t = 0; t < e.length; t++) {
                                    let r = e[t];
                                    if (!r) continue;
                                    if ("*" === r) return void(n = [{
                                        hostname: "*"
                                    }]);
                                    0 === r.indexOf("http://") ? r = r.substring(7) : 0 === r.indexOf("https://") && (r = r.substring(8));
                                    const i = r.indexOf("/");
                                    let s, o;
                                    i > 0 ? (s = r.substring(0, i), o = r.substring(i)) : (s = r, o = "*");
                                    let [c] = s.split(":");
                                    n.push({
                                        hostname: a(c),
                                        pathname: a(o, !0)
                                    })
                                }
                        }

                        function a(e, t = !1) {
                            const r = e.replace(/[.+?^${}()|[\]\\]/g, e => "\\" + e).replace(/\*/g, ".*?");
                            return new RegExp((t ? "^" : "") + r + "$")
                        }
                    },
                    7485: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            D: () => i
                        });
                        var n = r(6154);

                        function i(e) {
                            if (0 === (e || "").indexOf("data:")) return {
                                protocol: "data"
                            };
                            try {
                                const t = new URL(e, location.href),
                                    r = {
                                        port: t.port,
                                        hostname: t.hostname,
                                        pathname: t.pathname,
                                        search: t.search,
                                        protocol: t.protocol.slice(0, t.protocol.indexOf(":")),
                                        sameOrigin: t.protocol === n.gm ? .location ? .protocol && t.host === n.gm ? .location ? .host
                                    };
                                return r.port && "" !== r.port || ("http:" === t.protocol && (r.port = "80"), "https:" === t.protocol && (r.port = "443")), r.pathname && "" !== r.pathname ? r.pathname.startsWith("/") || (r.pathname = "/".concat(r.pathname)) : r.pathname = "/", r
                            } catch (e) {
                                return {}
                            }
                        }
                    },
                    7508: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            AZ: () => g,
                            Qr: () => b,
                            QL: () => m
                        });
                        var n = r(6154),
                            i = r(1863),
                            s = r(9119),
                            o = r(7866);
                        class a {
                            dom = new c;
                            performance = new c;
                            constructor(e) {
                                this.url = e
                            }
                            get script() {
                                const e = Math.max(this.dom.start, this.performance.end);
                                return {
                                    start: e,
                                    end: Math.max(this.dom.end, this.performance.end, e)
                                }
                            }
                        }
                        class c {
                            start = 0;
                            end = 0;
                            value = void 0
                        }
                        let d;
                        try {
                            d = g(m())[0]
                        } catch (e) {
                            d = g(e)[0]
                        }
                        const u = e => "script" === e.initiatorType || ["link", "fetch"].includes(e.initiatorType) && e.name.endsWith(".js"),
                            l = new Map;
                        let f = [];

                        function h(e) {
                            return l.get(e)
                        }

                        function p(e) {
                            const t = h(e);
                            if (t) return t;
                            const r = new a(e);
                            if (l.set(e, r), l.size > 1e3) {
                                const e = l.keys().next().value;
                                l.delete(e)
                            }
                            return r
                        }
                        if (n.gm.MutationObserver && n.gm.document) {
                            new MutationObserver(e => {
                                e.forEach(e => {
                                    e.addedNodes.forEach(e => {
                                        if ("SCRIPT" === e.nodeName && e.src) {
                                            const t = p((0, s.L)(e.src));
                                            t.dom.start = (0, i.t)(), t.dom.value = e;
                                            const r = () => {
                                                t.dom.end = (0, i.t)()
                                            };
                                            ["load", "error"].forEach(t => e.addEventListener(t, r, {
                                                once: !0
                                            }))
                                        }
                                    })
                                })
                            }).observe(n.gm.document, {
                                childList: !0,
                                subtree: !0
                            })
                        }
                        if (n.gm.PerformanceObserver ? .supportedEntryTypes.includes("resource")) {
                            new PerformanceObserver(e => {
                                e.getEntries().filter(u).forEach(e => {
                                    const t = p((0, s.L)(e.name));
                                    t.performance.start = Math.floor(e.startTime), t.performance.end = Math.floor(e.responseEnd), t.performance.value = e;
                                    const r = [];
                                    f.forEach(({
                                        test: t,
                                        addedAt: n
                                    }, s) => {
                                        (t(e) || (0, i.t)() - n > 1e4) && r.push(s)
                                    }), f = f.filter((e, t) => !r.includes(t))
                                })
                            }).observe({
                                type: "resource",
                                buffered: !0
                            })
                        }

                        function g(e) {
                            if (!e || "string" != typeof e) return [];
                            const t = new Set,
                                r = e.split("\n");
                            for (const e of r) {
                                const r = e.match(o.cn) || e.match(o.hB) || e.match(o.fL);
                                if (r && r[2]) t.add((0, s.L)(r[2]));
                                else {
                                    const r = e.match(/\(([^)]+\.js):\d+:\d+\)/) || e.match(/^\s+at\s+([^\s(]+\.js):\d+:\d+/);
                                    r && r[1] && t.add((0, s.L)(r[1]))
                                }
                            }
                            return [...t]
                        }

                        function m() {
                            let e;
                            try {
                                const t = Error.stackTraceLimit;
                                Error.stackTraceLimit = 50, e = (new Error).stack, Error.stackTraceLimit = t
                            } catch (t) {
                                e = (new Error).stack
                            }
                            return e
                        }

                        function v(e, t) {
                            return (0, s.L)(e.name) === t
                        }

                        function y(e, t) {
                            e.fetchStart = Math.floor(t.startTime), e.fetchEnd = Math.floor(t.responseEnd), e.asset = t.name, e.type = t.initiatorType
                        }

                        function b() {
                            const e = {
                                    registeredAt: (0, i.t)(),
                                    reportedAt: void 0,
                                    fetchStart: 0,
                                    fetchEnd: 0,
                                    scriptStart: 0,
                                    scriptEnd: 0,
                                    asset: void 0,
                                    type: "unknown"
                                },
                                t = m();
                            if (!t) return e;
                            const r = n.gm.performance ? .getEntriesByType("navigation") ? .[0] ? .name || "";
                            try {
                                const o = g(t),
                                    a = (o.length > 1 ? o.filter(e => d !== e) : o)[0];
                                if (!a) return e;
                                if (r.includes(a)) return e.asset = (0, s.L)(r), e.type = "inline", e;
                                e.correlation = h(a);
                                const c = e.correlation ? .performance.value || performance.getEntriesByType("resource").find(e => v(e, a));
                                c ? y(e, c) : function(e) {
                                    if (!e || !n.gm.document) return !1;
                                    try {
                                        const t = n.gm.document.querySelectorAll('link[rel="preload"][as="script"]');
                                        for (const r of t)
                                            if ((0, s.L)(r.href) === e) return !0
                                    } catch (e) {}
                                    return !1
                                }(a) && (e.asset = a, e.type = "preload", f.push({
                                    addedAt: (0, i.t)(),
                                    test: t => !!v(t, a) && (y(e, t), !0)
                                })), Object.defineProperty(e, "scriptStart", {
                                    get: () => e.correlation ? .script.start || e.fetchEnd
                                }), Object.defineProperty(e, "scriptEnd", {
                                    get: () => e.correlation ? .script.end || e.registeredAt
                                })
                            } catch (e) {}
                            return e
                        }
                    },
                    7699: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            It: () => s,
                            KC: () => a,
                            No: () => i,
                            qh: () => o
                        });
                        var n = r(860);
                        const i = 16e3,
                            s = 1e6,
                            o = "SESSION_ERROR",
                            a = {
                                [n.K7.logging]: !0,
                                [n.K7.genericEvents]: !0,
                                [n.K7.jserrors]: !0,
                                [n.K7.ajax]: !0
                            }
                    },
                    7767: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            V: () => i
                        });
                        var n = r(6154);
                        const i = e => n.RI && !0 === e ? .privacy.cookies_enabled
                    },
                    7836: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            P: () => a,
                            ee: () => c
                        });
                        var n = r(384),
                            i = r(8990),
                            s = r(2646),
                            o = r(5607);
                        const a = "nr@context:".concat(o.W),
                            c = function e(t, r) {
                                var n = {},
                                    o = {},
                                    u = {},
                                    l = !1;
                                try {
                                    l = 16 === r.length && d.initializedAgents ? .[r] ? .runtime.isolatedBacklog
                                } catch (e) {}
                                var f = {
                                    on: p,
                                    addEventListener: p,
                                    removeEventListener: function(e, t) {
                                        var r = n[e];
                                        if (!r) return;
                                        for (var i = 0; i < r.length; i++) r[i] === t && r.splice(i, 1)
                                    },
                                    emit: function(e, r, n, i, s) {
                                        !1 !== s && (s = !0);
                                        if (c.aborted && !i) return;
                                        t && s && t.emit(e, r, n);
                                        var a = h(n);
                                        g(e).forEach(e => {
                                            e.apply(a, r)
                                        });
                                        var d = v()[o[e]];
                                        d && d.push([f, e, r, a]);
                                        return a
                                    },
                                    get: m,
                                    listeners: g,
                                    context: h,
                                    buffer: function(e, t) {
                                        const r = v();
                                        if (t = t || "feature", f.aborted) return;
                                        Object.entries(e || {}).forEach(([e, n]) => {
                                            o[n] = t, t in r || (r[t] = [])
                                        })
                                    },
                                    abort: function() {
                                        f._aborted = !0, Object.keys(f.backlog).forEach(e => {
                                            delete f.backlog[e]
                                        })
                                    },
                                    isBuffering: function(e) {
                                        return !!v()[o[e]]
                                    },
                                    debugId: r,
                                    backlog: l ? {} : t && "object" == typeof t.backlog ? t.backlog : {},
                                    isolatedBacklog: l
                                };
                                return Object.defineProperty(f, "aborted", {
                                    get: () => {
                                        let e = f._aborted || !1;
                                        return e || (t && (e = t.aborted), e)
                                    }
                                }), f;

                                function h(e) {
                                    return e && e instanceof s.y ? e : e ? (0, i.I)(e, a, () => new s.y(a)) : new s.y(a)
                                }

                                function p(e, t) {
                                    n[e] = g(e).concat(t)
                                }

                                function g(e) {
                                    return n[e] || []
                                }

                                function m(t) {
                                    return u[t] = u[t] || e(f, t)
                                }

                                function v() {
                                    return f.backlog
                                }
                            }(void 0, "globalEE"),
                            d = (0, n.Zm)();
                        d.ee || (d.ee = c)
                    },
                    7866: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            Nc: () => s,
                            cn: () => a,
                            fL: () => i,
                            h3: () => n,
                            hB: () => o
                        });
                        const n = /function (.+?)\s*\(/,
                            i = /^\s*at .+ \(eval at \S+ \((?:(?:file|http|https):[^)]+)?\)(?:, [^:]*:\d+:\d+)?\)$/i,
                            s = /^\s*at Function code \(Function code:\d+:\d+\)\s*/i,
                            o = /^\s*at (?:((?:\[object object\])?(?:[^(]*\([^)]*\))*[^()]*(?: \[as \S+\])?) )?\(?((?:file|http|https|chrome-extension):.*?)?:(\d+)(?::(\d+))?\)?\s*$/i,
                            a = /^\s*(?:([^@]*)(?:\(.*?\))?@)?((?:file|http|https|chrome|safari-extension).*?):(\d+)(?::(\d+))?\s*$/i
                    },
                    8122: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            a: () => i
                        });
                        var n = r(944);

                        function i(e, t) {
                            try {
                                if (!e || "object" != typeof e) return (0, n.R)(3);
                                if (!t || "object" != typeof t) return (0, n.R)(4);
                                const r = Object.create(Object.getPrototypeOf(t), Object.getOwnPropertyDescriptors(t)),
                                    s = 0 === Object.keys(r).length ? e : r;
                                for (let o in s)
                                    if (void 0 !== e[o]) try {
                                        if (null === e[o]) {
                                            r[o] = null;
                                            continue
                                        }
                                        Array.isArray(e[o]) && Array.isArray(t[o]) ? r[o] = Array.from(new Set([...e[o], ...t[o]])) : e[o] instanceof Map || e[o] instanceof Set || e[o] instanceof Date || e[o] instanceof RegExp ? r[o] = e[o] : "object" == typeof e[o] && "object" == typeof t[o] ? r[o] = i(e[o], t[o]) : r[o] = e[o]
                                    } catch (e) {
                                        r[o] || (0, n.R)(1, e)
                                    }
                                return r
                            } catch (e) {
                                (0, n.R)(2, e)
                            }
                        }
                    },
                    8139: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            u: () => f
                        });
                        var n = r(7836),
                            i = r(3434),
                            s = r(8990),
                            o = r(6154);
                        const a = {},
                            c = o.gm.XMLHttpRequest,
                            d = "addEventListener",
                            u = "removeEventListener",
                            l = "nr@wrapped:".concat(n.P);

                        function f(e) {
                            var t = function(e) {
                                return (e || n.ee).get("events")
                            }(e);
                            if (a[t.debugId]++) return t;
                            a[t.debugId] = 1;
                            var r = (0, i.YM)(t, !0);

                            function f(e) {
                                r.inPlace(e, [d, u], "-", p)
                            }

                            function p(e, t) {
                                return e[1]
                            }
                            return "getPrototypeOf" in Object && (o.RI && h(document, f), c && h(c.prototype, f), h(o.gm, f)), t.on(d + "-start", function(e, t) {
                                var n = e[1];
                                if (null !== n && ("function" == typeof n || "object" == typeof n) && "newrelic" !== e[0]) {
                                    var i = (0, s.I)(n, l, function() {
                                        var e = {
                                            object: function() {
                                                if ("function" != typeof n.handleEvent) return;
                                                return n.handleEvent.apply(n, arguments)
                                            },
                                            function: n
                                        }[typeof n];
                                        return e ? r(e, "fn-", null, e.name || "anonymous") : n
                                    });
                                    this.wrapped = e[1] = i
                                }
                            }), t.on(u + "-start", function(e) {
                                e[1] = this.wrapped || e[1]
                            }), t
                        }

                        function h(e, t, ...r) {
                            let n = e;
                            for (;
                                "object" == typeof n && !Object.prototype.hasOwnProperty.call(n, d);) n = Object.getPrototypeOf(n);
                            n && t(n, ...r)
                        }
                    },
                    8362: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            d: () => s
                        });
                        var n = r(9566),
                            i = r(1741);
                        class s extends i.W {
                            agentIdentifier = (0, n.LA)(16)
                        }
                    },
                    8374: (e, t, r) => {
                        r.nc = (() => {
                            try {
                                return document ? .currentScript ? .nonce
                            } catch (e) {}
                            return ""
                        })()
                    },
                    8990: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            I: () => i
                        });
                        var n = Object.prototype.hasOwnProperty;

                        function i(e, t, r) {
                            if (n.call(e, t)) return e[t];
                            var i = r();
                            if (Object.defineProperty && Object.keys) try {
                                return Object.defineProperty(e, t, {
                                    value: i,
                                    writable: !0,
                                    enumerable: !1
                                }), i
                            } catch (e) {}
                            return e[t] = i, i
                        }
                    },
                    9119: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            L: () => s
                        });
                        var n = /([^?#]*)[^#]*(#[^?]*|$).*/,
                            i = /([^?#]*)().*/;

                        function s(e, t) {
                            return e ? e.replace(t ? n : i, "$1$2") : e
                        }
                    },
                    9300: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            T: () => n,
                            f: () => i
                        });
                        const n = r(860).K7.ajax,
                            i = "ajaxRequest.id"
                    },
                    9324: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            AJ: () => o,
                            F3: () => i,
                            Xs: () => s,
                            Yq: () => a,
                            xv: () => n
                        });
                        const n = "1.316.0",
                            i = "PROD",
                            s = "CDN",
                            o = "@newrelic/rrweb",
                            a = "1.1.0"
                    },
                    9566: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            LA: () => a,
                            ZF: () => c,
                            bz: () => o,
                            el: () => d
                        });
                        var n = r(6154);
                        const i = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

                        function s(e, t) {
                            return e ? 15 & e[t] : 16 * Math.random() | 0
                        }

                        function o() {
                            const e = n.gm ? .crypto || n.gm ? .msCrypto;
                            let t, r = 0;
                            return e && e.getRandomValues && (t = e.getRandomValues(new Uint8Array(30))), i.split("").map(e => "x" === e ? s(t, r++).toString(16) : "y" === e ? (3 & s() | 8).toString(16) : e).join("")
                        }

                        function a(e) {
                            const t = n.gm ? .crypto || n.gm ? .msCrypto;
                            let r, i = 0;
                            t && t.getRandomValues && (r = t.getRandomValues(new Uint8Array(e)));
                            const o = [];
                            for (var a = 0; a < e; a++) o.push(s(r, i++).toString(16));
                            return o.join("")
                        }

                        function c() {
                            return a(16)
                        }

                        function d() {
                            return a(32)
                        }
                    },
                    9908: (e, t, r) => {
                        "use strict";
                        r.d(t, {
                            d: () => n,
                            p: () => i
                        });
                        var n = r(7836).ee.get("handle");

                        function i(e, t, r, i, s) {
                            s ? (s.buffer([e], i), s.emit(e, t, r)) : (n.buffer([e], i), n.emit(e, t, r))
                        }
                    }
                },
                n = {};

            function i(e) {
                var t = n[e];
                if (void 0 !== t) return t.exports;
                var s = n[e] = {
                    exports: {}
                };
                return r[e](s, s.exports, i), s.exports
            }
            i.m = r, i.d = (e, t) => {
                for (var r in t) i.o(t, r) && !i.o(e, r) && Object.defineProperty(e, r, {
                    enumerable: !0,
                    get: t[r]
                })
            }, i.f = {}, i.e = e => Promise.all(Object.keys(i.f).reduce((t, r) => (i.f[r](e, t), t), [])), i.u = e => ({
                212: "nr-spa-compressor",
                249: "nr-spa-recorder",
                478: "nr-spa"
            }[e] + "-1.316.0.min.js"), i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), e = {}, t = "NRBA-1.316.0.PROD:", i.l = (r, n, s, o) => {
                if (e[r]) e[r].push(n);
                else {
                    var a, c;
                    if (void 0 !== s)
                        for (var d = document.getElementsByTagName("script"), u = 0; u < d.length; u++) {
                            var l = d[u];
                            if (l.getAttribute("src") == r || l.getAttribute("data-webpack") == t + s) {
                                a = l;
                                break
                            }
                        }
                    if (!a) {
                        c = !0;
                        var f = {
                            478: "sha512-/91tZUpAINW5VzLS+EdJpEe0gul6FJd2zTpGwLIhi/mqcTiQPUlhoJmX5zb4EPTwdGqun46DoGQPtDShDBw4bA==",
                            249: "sha512-XqLQgD24Jrw2HFtuRDeuxMcY5WnEXG04tpC98UJOJlIfGqQst/lKUE+G++zwulwEzcM00bl5V0e1kKGq2Nxc1g==",
                            212: "sha512-rOHSN/tvMjFe33yfRKMs44m3dZKgs9foEl0T2tdErrZKsAF8Oe5+OLJKgySrw3WwY4MgvuS4yWEr88MMv5LZaw=="
                        };
                        (a = document.createElement("script")).charset = "utf-8", i.nc && a.setAttribute("nonce", i.nc), a.setAttribute("data-webpack", t + s), a.src = r, 0 !== a.src.indexOf(window.location.origin + "/") && (a.crossOrigin = "anonymous"), f[o] && (a.integrity = f[o])
                    }
                    e[r] = [n];
                    var h = (t, n) => {
                            a.onerror = a.onload = null, clearTimeout(p);
                            var i = e[r];
                            if (delete e[r], a.parentNode && a.parentNode.removeChild(a), i && i.forEach(e => e(n)), t) return t(n)
                        },
                        p = setTimeout(h.bind(null, void 0, {
                            type: "timeout",
                            target: a
                        }), 12e4);
                    a.onerror = h.bind(null, a.onerror), a.onload = h.bind(null, a.onload), c && document.head.appendChild(a)
                }
            }, i.r = e => {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                }), Object.defineProperty(e, "__esModule", {
                    value: !0
                })
            }, i.p = "https://js-agent.newrelic.com/", (() => {
                var e = {
                    38: 0,
                    788: 0
                };
                i.f.j = (t, r) => {
                    var n = i.o(e, t) ? e[t] : void 0;
                    if (0 !== n)
                        if (n) r.push(n[2]);
                        else {
                            var s = new Promise((r, i) => n = e[t] = [r, i]);
                            r.push(n[2] = s);
                            var o = i.p + i.u(t),
                                a = new Error;
                            i.l(o, r => {
                                if (i.o(e, t) && (0 !== (n = e[t]) && (e[t] = void 0), n)) {
                                    var s = r && ("load" === r.type ? "missing" : r.type),
                                        o = r && r.target && r.target.src;
                                    a.message = "Loading chunk " + t + " failed: (" + s + ": " + o + ")", a.name = "ChunkLoadError", a.type = s, a.request = o, n[1](a)
                                }
                            }, "chunk-" + t, t)
                        }
                };
                var t = (t, r) => {
                        var n, s, [o, a, c] = r,
                            d = 0;
                        if (o.some(t => 0 !== e[t])) {
                            for (n in a) i.o(a, n) && (i.m[n] = a[n]);
                            if (c) c(i)
                        }
                        for (t && t(r); d < o.length; d++) s = o[d], i.o(e, s) && e[s] && e[s][0](), e[s] = 0
                    },
                    r = self["webpackChunk:NRBA-1.316.0.PROD"] = self["webpackChunk:NRBA-1.316.0.PROD"] || [];
                r.forEach(t.bind(null, 0)), r.push = t.bind(null, r.push.bind(r))
            })(), (() => {
                "use strict";
                i(8374);
                var e = i(8362),
                    t = i(860);
                const r = Object.values(t.K7);
                var n = i(384),
                    s = i(1741);
                var o = i(2555),
                    a = i(3333);
                const c = e => {
                    if (!e || "string" != typeof e) return !1;
                    try {
                        document.createDocumentFragment().querySelector(e)
                    } catch {
                        return !1
                    }
                    return !0
                };
                var d = i(2614),
                    u = i(944),
                    l = i(8122);
                const f = "[data-nr-mask]",
                    h = e => (0, l.a)(e, (() => {
                        const e = {
                            feature_flags: [],
                            experimental: {
                                register: !1,
                                resources: !1
                            },
                            mask_selector: "*",
                            block_selector: "[data-nr-block]",
                            mask_input_options: {
                                color: !1,
                                date: !1,
                                "datetime-local": !1,
                                email: !1,
                                month: !1,
                                number: !1,
                                range: !1,
                                search: !1,
                                tel: !1,
                                text: !1,
                                time: !1,
                                url: !1,
                                week: !1,
                                textarea: !1,
                                select: !1,
                                password: !0
                            }
                        };
                        return {
                            ajax: {
                                deny_list: void 0,
                                block_internal: !0,
                                enabled: !0,
                                autoStart: !0
                            },
                            api: {
                                register: {
                                    get enabled() {
                                        return e.feature_flags.includes(a.$v.REGISTER) || e.experimental.register
                                    },
                                    set enabled(t) {
                                        e.experimental.register = t
                                    },
                                    duplicate_data_to_container: !1
                                }
                            },
                            browser_consent_mode: {
                                enabled: !1
                            },
                            distributed_tracing: {
                                enabled: void 0,
                                exclude_newrelic_header: void 0,
                                cors_use_newrelic_header: void 0,
                                cors_use_tracecontext_headers: void 0,
                                allowed_origins: void 0
                            },
                            get feature_flags() {
                                return e.feature_flags
                            },
                            set feature_flags(t) {
                                e.feature_flags = t
                            },
                            generic_events: {
                                enabled: !0,
                                autoStart: !0
                            },
                            harvest: {
                                interval: 30
                            },
                            jserrors: {
                                enabled: !0,
                                autoStart: !0
                            },
                            logging: {
                                enabled: !0,
                                autoStart: !0
                            },
                            metrics: {
                                enabled: !0,
                                autoStart: !0
                            },
                            obfuscate: void 0,
                            page_action: {
                                enabled: !0
                            },
                            page_view_event: {
                                enabled: !0,
                                autoStart: !0
                            },
                            page_view_timing: {
                                enabled: !0,
                                autoStart: !0
                            },
                            performance: {
                                capture_marks: !1,
                                capture_measures: !1,
                                capture_detail: !0,
                                resources: {
                                    get enabled() {
                                        return e.feature_flags.includes(a.$v.RESOURCES) || e.experimental.resources
                                    },
                                    set enabled(t) {
                                        e.experimental.resources = t
                                    },
                                    asset_types: [],
                                    first_party_domains: [],
                                    ignore_newrelic: !0
                                }
                            },
                            privacy: {
                                cookies_enabled: !0
                            },
                            proxy: {
                                assets: void 0,
                                beacon: void 0
                            },
                            session: {
                                expiresMs: d.wk,
                                inactiveMs: d.BB
                            },
                            session_replay: {
                                autoStart: !0,
                                enabled: !1,
                                preload: !1,
                                sampling_rate: 10,
                                error_sampling_rate: 100,
                                collect_fonts: !1,
                                inline_images: !1,
                                fix_stylesheets: !0,
                                mask_all_inputs: !0,
                                get mask_text_selector() {
                                    return e.mask_selector
                                },
                                set mask_text_selector(t) {
                                    c(t) ? e.mask_selector = "".concat(t, ",").concat(f) : "" === t || null === t ? e.mask_selector = f : (0, u.R)(5, t)
                                },
                                get block_class() {
                                    return "nr-block"
                                },
                                get ignore_class() {
                                    return "nr-ignore"
                                },
                                get mask_text_class() {
                                    return "nr-mask"
                                },
                                get block_selector() {
                                    return e.block_selector
                                },
                                set block_selector(t) {
                                    c(t) ? e.block_selector += ",".concat(t) : "" !== t && (0, u.R)(6, t)
                                },
                                get mask_input_options() {
                                    return e.mask_input_options
                                },
                                set mask_input_options(t) {
                                    t && "object" == typeof t ? e.mask_input_options = { ...t,
                                        password: !0
                                    } : (0, u.R)(7, t)
                                }
                            },
                            session_trace: {
                                enabled: !0,
                                autoStart: !0
                            },
                            soft_navigations: {
                                enabled: !0,
                                autoStart: !0
                            },
                            ssl: void 0,
                            user_actions: {
                                enabled: !0,
                                elementAttributes: ["id", "className", "tagName", "type"]
                            }
                        }
                    })());
                var p = i(6154),
                    g = i(9324);
                let m = 0;
                const v = {
                        buildEnv: g.F3,
                        distMethod: g.Xs,
                        version: g.xv,
                        originTime: p.WN
                    },
                    y = {
                        consented: !1
                    },
                    b = {
                        activatedFeatures: void 0,
                        appMetadata: {},
                        configured: !1,
                        get consented() {
                            return this.session ? .state ? .consent || y.consented
                        },
                        set consented(e) {
                            y.consented = e
                        },
                        customTransaction: void 0,
                        denyList: [],
                        disabled: !1,
                        drainRegistry: new Map,
                        harvester: void 0,
                        isolatedBacklog: !1,
                        isRecording: !1,
                        loaderType: void 0,
                        maxBytes: 3e4,
                        obfuscator: void 0,
                        onerror: void 0,
                        ptid: void 0,
                        releaseIds: {},
                        session: void 0,
                        timeKeeper: void 0,
                        registeredEntities: [],
                        jsAttributesMetadata: {
                            bytes: 0
                        },
                        get harvestCount() {
                            return ++m
                        }
                    };
                var w = i(7836),
                    R = i(3241);
                const E = {
                    accountID: void 0,
                    trustKey: void 0,
                    agentID: void 0,
                    licenseKey: void 0,
                    applicationID: void 0,
                    xpid: void 0
                };

                function T(e, t = {}, r, a) {
                    let {
                        init: c,
                        info: d,
                        loader_config: u,
                        runtime: f = {},
                        exposed: g = !0
                    } = t;
                    if (!d) {
                        const e = (0, n.pV)();
                        c = e.init, d = e.info, u = e.loader_config
                    }
                    var m;
                    e.init = h(c || {}), e.loader_config = (m = u || {}, (0, l.a)(m, E)), d.jsAttributes ? ? = {}, p.bv && (d.jsAttributes.isWorker = !0), e.info = (0, o.D)(d);
                    const y = e.init;
                    e.runtime ? ? = (e => {
                        const t = (0, l.a)(e, b),
                            r = Object.keys(v).reduce((e, t) => (e[t] = {
                                value: v[t],
                                writable: !1,
                                configurable: !0,
                                enumerable: !0
                            }, e), {});
                        return Object.defineProperties(t, r)
                    })(f), y.proxy.assets && (e => {
                        const t = e.startsWith("http");
                        e += "/", i.p = t ? e : "https://" + e
                    })(y.proxy.assets), e.runtime.configured || (Object.defineProperty(e, "beacons", {
                        get: () => [e.info.beacon, e.info.errorBeacon, e.init.proxy.assets, e.init.proxy.beacon].filter(Boolean)
                    }), Object.defineProperty(e.runtime, "denyList", {
                        get: () => [...e.init.ajax.deny_list || [], ...e.init.ajax.block_internal ? e.beacons : []]
                    }), e.runtime.ptid = e.agentIdentifier, function(e) {
                        const t = (0, n.pV)();
                        Object.getOwnPropertyNames(s.W.prototype).forEach(r => {
                            const n = s.W.prototype[r];
                            if ("function" != typeof n || "constructor" === n) return;
                            let i = t[r];
                            e[r] && !1 !== e.exposed && "micro-agent" !== e.runtime ? .loaderType && (t[r] = (...t) => {
                                const n = e[r](...t);
                                return i ? i(...t) : n
                            })
                        })
                    }(e), e.runtime.loaderType = r, e.ee = w.ee.get(e.agentIdentifier), e.exposed = g, (0, R.W)({
                        drained: !!e.runtime.activatedFeatures,
                        type: "lifecycle",
                        name: "initialize",
                        feature: void 0,
                        data: e.config
                    }), e.runtime.configured = !0)
                }
                var A = i(9908),
                    x = i(1863),
                    S = i(4261),
                    _ = i(1738);
                var O = i(1687),
                    P = i(4234),
                    k = i(5289),
                    N = i(5270),
                    j = i(7767),
                    C = i(6389),
                    D = i(7699);
                const L = new WeakSet;
                class I extends P.W {
                    constructor(e, t) {
                        super(e, t), this.abortHandler = void 0, this.featAggregate = void 0, this.loadedSuccessfully = void 0, this.onAggregateImported = new Promise(e => {
                            this.loadedSuccessfully = e
                        }), this.deferred = Promise.resolve(), !1 === e.init[this.featureName].autoStart ? this.deferred = new Promise((t, r) => {
                            this.ee.on("manual-start-all", (0, C.J)(() => {
                                (0, O.Ak)(e, this.featureName), t()
                            }))
                        }) : (0, O.Ak)(e, t)
                    }
                    importAggregator(e, t, r = {}) {
                        if (this.featAggregate) return;
                        const n = async () => {
                            if (await this.deferred, this.#t(e), !(0, o.f)(e.info)) return (0, u.R)(43), e.ee.abort(), void this.loadedSuccessfully(!1);
                            let n;
                            try {
                                if ((0, j.V)(e.init)) {
                                    const {
                                        setupAgentSession: t
                                    } = await i.e(478).then(i.bind(i, 8766));
                                    n = t(e)
                                }
                            } catch (e) {
                                (0, u.R)(20, e), this.ee.emit("internal-error", [e]), (0, A.p)(D.qh, [e], void 0, this.featureName, this.ee)
                            }
                            try {
                                if (!this.#r(this.featureName, n, e.init)) return (0, O.Ze)(this.agentRef, this.featureName), void this.loadedSuccessfully(!1);
                                const {
                                    Aggregate: i
                                } = await t();
                                this.featAggregate = new i(e, r), e.runtime.harvester.initializedAggregates.push(this.featAggregate), this.loadedSuccessfully(!0)
                            } catch (e) {
                                (0, u.R)(34, e), this.abortHandler ? .(), (0, O.Ze)(this.agentRef, this.featureName, !0), this.loadedSuccessfully(!1), this.ee && this.ee.abort()
                            }
                        };
                        p.RI ? (0, k.GG)(() => n(), !0) : n()
                    }#
                    r(e, r, n) {
                        if (this.blocked) return !1;
                        switch (e) {
                            case t.K7.sessionReplay:
                                return (0, N.SR)(n) && !!r;
                            case t.K7.sessionTrace:
                                return !!r;
                            default:
                                return !0
                        }
                    }#
                    t(e) {
                        if (!L.has(e) && (L.add(e), !(0, o.f)(e.info))) {
                            const t = (0, n.pV)();
                            let r = { ...t.info ? .jsAttributes
                            };
                            try {
                                r = { ...r,
                                    ...e.info ? .jsAttributes
                                }
                            } catch (e) {}
                            T(e, { ...t,
                                info: { ...t.info,
                                    jsAttributes: r
                                },
                                runtime: e.runtime
                            }, e.runtime.loaderType)
                        }
                    }
                }
                var M = i(6630);
                class B extends I {
                    static featureName = M.T;
                    constructor(e) {
                        var t;
                        super(e, M.T), this.setupInspectionEvents(), t = e, (0, _.Y)(S.Fw, function(e, r) {
                            "string" == typeof e && ("/" !== e.charAt(0) && (e = "/" + e), t.runtime.customTransaction = (r || "http://custom.transaction") + e, (0, A.p)(S.Pl + S.Fw, [(0, x.t)()], void 0, void 0, t.ee))
                        }, t), this.importAggregator(e, () => i.e(478).then(i.bind(i, 5839)))
                    }
                    setupInspectionEvents() {
                        const e = (e, t) => {
                            e && (0, R.W)({
                                timeStamp: e.timeStamp,
                                loaded: "complete" === e.target.readyState,
                                type: "window",
                                name: t,
                                data: e.target.location + ""
                            })
                        };
                        (0, k.sB)(t => {
                            e(t, "DOMContentLoaded")
                        }), (0, k.GG)(t => {
                            e(t, "load")
                        }), (0, k.Qr)(t => {
                            e(t, "navigate")
                        }), this.ee.on(d.tS.UPDATE, (e, t) => {
                            (0, R.W)({
                                type: "lifecycle",
                                name: "session",
                                data: t
                            })
                        })
                    }
                }
                class H extends e.d {
                    constructor(e) {
                        var t;
                        (super(), p.gm) ? (this.features = {}, (0, n.bQ)(this.agentIdentifier, this), this.desiredFeatures = new Set(e.features || []), this.desiredFeatures.add(B), T(this, e, e.loaderType || "agent"), t = this, (0, _.Y)(S.cD, function(e, r, n = !1) {
                            if ("string" == typeof e) {
                                if (["string", "number", "boolean"].includes(typeof r) || null === r) return (0, _.U)(t, e, r, S.cD, n);
                                (0, u.R)(40, typeof r)
                            } else(0, u.R)(39, typeof e)
                        }, t), function(e) {
                            (0, _.Y)(S.Dl, function(t, r = !1) {
                                if ("string" != typeof t && null !== t) return void(0, u.R)(41, typeof t);
                                const n = e.info.jsAttributes["enduser.id"];
                                r && null != n && n !== t ? (0, A.p)(S.Pl + "setUserIdAndResetSession", [t], void 0, "session", e.ee) : (0, _.U)(e, "enduser.id", t, S.Dl, !0)
                            }, e)
                        }(this), function(e) {
                            (0, _.Y)(S.nb, function(t) {
                                if ("string" == typeof t || null === t) return (0, _.U)(e, "application.version", t, S.nb, !1);
                                (0, u.R)(42, typeof t)
                            }, e)
                        }(this), function(e) {
                            (0, _.Y)(S.d3, function() {
                                e.ee.emit("manual-start-all")
                            }, e)
                        }(this), function(e) {
                            (0, _.Y)(S.Pv, function(t = !0) {
                                if ("boolean" == typeof t) {
                                    if ((0, A.p)(S.Pl + S.Pv, [t], void 0, "session", e.ee), e.runtime.consented = t, t) {
                                        const t = e.features.page_view_event;
                                        t.onAggregateImported.then(e => {
                                            const r = t.featAggregate;
                                            e && !r.sentRum && r.sendRum()
                                        })
                                    }
                                } else(0, u.R)(65, typeof t)
                            }, e)
                        }(this), this.run()) : (0, u.R)(21)
                    }
                    get config() {
                        return {
                            info: this.info,
                            init: this.init,
                            loader_config: this.loader_config,
                            runtime: this.runtime
                        }
                    }
                    get api() {
                        return this
                    }
                    run() {
                        try {
                            const e = function(e) {
                                    const t = {};
                                    return r.forEach(r => {
                                        t[r] = !!e[r] ? .enabled
                                    }), t
                                }(this.init),
                                n = [...this.desiredFeatures];
                            n.sort((e, r) => t.P3[e.featureName] - t.P3[r.featureName]), n.forEach(r => {
                                if (!e[r.featureName] && r.featureName !== t.K7.pageViewEvent) return;
                                const n = function(e) {
                                    switch (e) {
                                        case t.K7.ajax:
                                            return [t.K7.jserrors];
                                        case t.K7.sessionTrace:
                                            return [t.K7.ajax, t.K7.pageViewEvent];
                                        case t.K7.sessionReplay:
                                            return [t.K7.sessionTrace];
                                        case t.K7.pageViewTiming:
                                            return [t.K7.pageViewEvent];
                                        default:
                                            return []
                                    }
                                }(r.featureName).filter(e => !(e in this.features));
                                n.length > 0 && (0, u.R)(36, {
                                    targetFeature: r.featureName,
                                    missingDependencies: n
                                }), this.features[r.featureName] = new r(this)
                            })
                        } catch (e) {
                            (0, u.R)(22, e);
                            for (const e in this.features) this.features[e].abortHandler ? .();
                            const t = (0, n.Zm)();
                            delete t.initializedAgents[this.agentIdentifier] ? .features, delete this.sharedAggregator;
                            return t.ee.get(this.agentIdentifier).abort(), !1
                        }
                    }
                }
                var K = i(2843),
                    W = i(782);
                class F extends I {
                    static featureName = W.T;
                    constructor(e) {
                        super(e, W.T), p.RI && ((0, K.u)(() => (0, A.p)("docHidden", [(0, x.t)()], void 0, W.T, this.ee), !0), (0, K.G)(() => (0, A.p)("winPagehide", [(0, x.t)()], void 0, W.T, this.ee)), this.importAggregator(e, () => i.e(478).then(i.bind(i, 9917))))
                    }
                }
                var U = i(3969);
                class V extends I {
                    static featureName = U.TZ;
                    constructor(e) {
                        super(e, U.TZ), this.importAggregator(e, () => i.e(478).then(i.bind(i, 6555)))
                    }
                }
                var z = i(6774),
                    G = i(3878),
                    Y = i(3304);
                class Z {
                    constructor(e, t, r, n, i) {
                        this.name = "UncaughtError", this.message = "string" == typeof e ? e : (0, Y.A)(e), this.sourceURL = t, this.line = r, this.column = n, this.__newrelic = i
                    }
                }

                function q(e) {
                    return J(e) ? e : new Z(void 0 !== e ? .message ? e.message : e, e ? .filename || e ? .sourceURL, e ? .lineno || e ? .line, e ? .colno || e ? .col, e ? .__newrelic, e ? .cause)
                }

                function X(e) {
                    const t = "Unhandled Promise Rejection: ";
                    if (!e ? .reason) return;
                    if (J(e.reason)) {
                        try {
                            e.reason.message.startsWith(t) || (e.reason.message = t + e.reason.message)
                        } catch (e) {}
                        return q(e.reason)
                    }
                    const r = q(e.reason);
                    return (r.message || "").startsWith(t) || (r.message = t + r.message), r
                }

                function Q(e) {
                    if (e.error instanceof SyntaxError && !/:\d+$/.test(e.error.stack ? .trim())) {
                        const t = new Z(e.message, e.filename, e.lineno, e.colno, e.error.__newrelic, e.cause);
                        return t.name = SyntaxError.name, t
                    }
                    return J(e.error) ? e.error : q(e)
                }

                function J(e) {
                    return e instanceof Error && !!e.stack
                }

                function ee(e, r, n, i, s = (0, x.t)()) {
                    "string" == typeof e && (e = new Error(e)), (0, A.p)("err", [e, s, !1, r, n.runtime.isRecording, void 0, i], void 0, t.K7.jserrors, n.ee), (0, A.p)("uaErr", [], void 0, t.K7.genericEvents, n.ee)
                }
                var te = i(5732),
                    re = i(993),
                    ne = i(3785);

                function ie(e, {
                    customAttributes: t = {},
                    level: r = re.p_.INFO
                } = {}, n, i, s = (0, x.t)()) {
                    (0, ne.R)(n.ee, e, t, r, !1, i, s)
                }

                function se(e, r, n, i, s = (0, x.t)()) {
                    (0, A.p)(S.Pl + S.hG, [s, e, r, i], void 0, t.K7.genericEvents, n.ee)
                }

                function oe(e, r, n, i, s = (0, x.t)()) {
                    const {
                        start: o,
                        end: a,
                        customAttributes: c
                    } = r || {}, d = {
                        customAttributes: c || {}
                    };
                    if ("object" != typeof d.customAttributes || "string" != typeof e || 0 === e.length) return void(0, u.R)(57);
                    const l = (e, t) => null == e ? t : "number" == typeof e ? e : e instanceof PerformanceMark ? e.startTime : Number.NaN;
                    if (d.start = l(o, 0), d.end = l(a, s), Number.isNaN(d.start) || Number.isNaN(d.end))(0, u.R)(57);
                    else {
                        if (d.duration = d.end - d.start, !(d.duration < 0)) return (0, A.p)(S.Pl + S.V1, [d, e, i], void 0, t.K7.genericEvents, n.ee), d;
                        (0, u.R)(58)
                    }
                }

                function ae(e, r = {}, n, i, s = (0, x.t)()) {
                    (0, A.p)(S.Pl + S.fF, [s, e, r, i], void 0, t.K7.genericEvents, n.ee)
                }
                var ce = i(7508),
                    de = i(9566);
                const ue = ["name", "id", "type"],
                    le = new Map([
                        [se, "addPageAction"],
                        [ie, "log"],
                        [oe, "measure"],
                        [ee, "noticeError"],
                        [ae, "recordCustomEvent"]
                    ]),
                    fe = {
                        experimental: (0, C.J)(() => (0, u.R)(54, "newrelic.register")),
                        disabled: (0, C.J)(() => (0, u.R)(55)),
                        invalidTarget: (0, C.J)(e => (0, u.R)(48, e)),
                        deregistered: (0, C.J)(() => (0, u.R)(68))
                    };

                function he(e) {
                    (0, _.Y)(S.eY, function(t) {
                        return pe(e, t)
                    }, e)
                }

                function pe(e, r) {
                    fe.experimental(), r || = {}, r.instance = (0, de.LA)(8), r.type = te.fQ.MFE, r.licenseKey || = e.info.licenseKey, r.blocked = !1, ("object" != typeof r.tags || null === r.tags || Array.isArray(r.tags)) && (r.tags = {}), r.parent ? ? = {
                        get id() {
                            return e.runtime.appMetadata.agents[0].entityGuid
                        },
                        type: te.fQ.BA
                    };
                    const n = (0, ce.Qr)(),
                        i = {};
                    Object.prototype.hasOwnProperty.call(r, "attributes") || Object.defineProperty(r, "attributes", {
                        get: () => ({ ...i,
                            "source.id": r.id,
                            "source.name": r.name,
                            "source.type": r.type,
                            "parent.type": r.parent ? .type || te.fQ.BA,
                            "parent.id": r.parent ? .id
                        })
                    }), Object.entries(r.tags).forEach(([e, t]) => {
                        ue.includes(e) || (i["source.".concat(e)] = t)
                    });
                    let s = () => {};
                    const o = e.runtime.registeredEntities,
                        a = e => {
                            r.blocked = !0, s = e
                        };

                    function c(e) {
                        return "string" == typeof e && !!e.trim() && e.trim().length < 501
                    }
                    e.init.api.register.enabled || a(fe.disabled), c(r.id) && c(r.name) || a(() => fe.invalidTarget(r));
                    const d = {
                            addPageAction: (t, n = {}) => p(se, [t, { ...i,
                                ...n
                            }, e], r),
                            deregister: () => {
                                f(), a(fe.deregistered)
                            },
                            log: (t, n = {}) => p(ie, [t, { ...n,
                                customAttributes: { ...i,
                                    ...n.customAttributes || {}
                                }
                            }, e], r),
                            measure: (t, n = {}) => p(oe, [t, { ...n,
                                customAttributes: { ...i,
                                    ...n.customAttributes || {}
                                }
                            }, e], r),
                            noticeError: (t, n = {}) => p(ee, [t, { ...i,
                                ...n
                            }, e], r),
                            recordCustomEvent: (t, n = {}) => p(ae, [t, { ...i,
                                ...n
                            }, e], r),
                            setApplicationVersion: e => h("application.version", e),
                            setCustomAttribute: (e, t) => h(e, t),
                            setUserId: e => h("enduser.id", e),
                            metadata: {
                                get customAttributes() {
                                    return i
                                },
                                target: r,
                                timings: n
                            }
                        },
                        l = () => (r.blocked && s(), r.blocked);

                    function f() {
                        if (n.reportedAt) return;
                        n.reportedAt = (0, x.t)();
                        const e = n.fetchEnd - n.fetchStart,
                            t = n.scriptEnd - n.scriptStart;
                        d.recordCustomEvent("MicroFrontEndTiming", {
                            assetUrl: n.asset,
                            assetType: n.type,
                            timeAlive: n.reportedAt - n.registeredAt,
                            timeToBeRequested: n.fetchStart,
                            timeToExecute: t,
                            timeToFetch: e,
                            timeToLoad: e + t,
                            timeToRegister: n.registeredAt
                        })
                    }
                    l() || (o.push(d), (0, K.G)(f));
                    const h = (e, t) => {
                            l() || (i[e] = t)
                        },
                        p = (r, n, i) => {
                            if (l() && r !== pe) return;
                            const s = (0, x.t)(),
                                o = le.get(r) || "unknown";
                            (0, A.p)(U.xV, ["API/register/".concat(o, "/called")], void 0, t.K7.metrics, e.ee);
                            try {
                                return r(...n, i, s)
                            } catch (e) {
                                (0, u.R)(50, e)
                            }
                        };
                    return d
                }
                class ge extends I {
                    static featureName = z.T;
                    constructor(e) {
                        var t;
                        super(e, z.T), t = e, (0, _.Y)(S.o5, (e, r) => ee(e, r, t), t),
                            function(e) {
                                (0, _.Y)(S.bt, function(t) {
                                    e.runtime.onerror = t
                                }, e)
                            }(e),
                            function(e) {
                                let t = 0;
                                (0, _.Y)(S.k6, function(e, r) {
                                    ++t > 10 || (this.runtime.releaseIds[e.slice(-200)] = ("" + r).slice(-200))
                                }, e)
                            }(e), he(e);
                        try {
                            this.removeOnAbort = new AbortController
                        } catch (e) {}
                        this.ee.on("internal-error", (t, r) => {
                            this.abortHandler && (0, A.p)("ierr", [q(t), (0, x.t)(), !0, {}, e.runtime.isRecording, r], void 0, this.featureName, this.ee)
                        }), p.gm.addEventListener("unhandledrejection", t => {
                            this.abortHandler && (0, A.p)("err", [X(t), (0, x.t)(), !1, {
                                unhandledPromiseRejection: 1
                            }, e.runtime.isRecording], void 0, this.featureName, this.ee)
                        }, (0, G.jT)(!1, this.removeOnAbort ? .signal)), p.gm.addEventListener("error", t => {
                            this.abortHandler && (0, A.p)("err", [Q(t), (0, x.t)(), !1, {}, e.runtime.isRecording], void 0, this.featureName, this.ee)
                        }, (0, G.jT)(!1, this.removeOnAbort ? .signal)), this.abortHandler = this.#n, this.importAggregator(e, () => i.e(478).then(i.bind(i, 9377)))
                    }#
                    n() {
                        this.removeOnAbort ? .abort(), this.abortHandler = void 0
                    }
                }
                var me = i(8990);
                let ve = 1;

                function ye(e) {
                    const t = typeof e;
                    return !e || "object" !== t && "function" !== t ? -1 : e === p.gm ? 0 : (0, me.I)(e, "nr@id", function() {
                        return ve++
                    })
                }

                function be(e) {
                    if ("string" == typeof e && e.length) return e.length;
                    if ("object" == typeof e) {
                        if ("undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer && e.byteLength) return e.byteLength;
                        if ("undefined" != typeof Blob && e instanceof Blob && e.size) return e.size;
                        if (!("undefined" != typeof FormData && e instanceof FormData)) try {
                            return (0, Y.A)(e).length
                        } catch (e) {
                            return
                        }
                    }
                }
                var we = i(8139),
                    Re = i(3434);
                const Ee = {},
                    Te = ["open", "send"];

                function Ae(e, t) {
                    var r = e || w.ee;
                    const n = function(e) {
                        return (e || w.ee).get("xhr")
                    }(r);
                    if (void 0 === p.gm.XMLHttpRequest) return n;
                    if (Ee[n.debugId]++) return n;
                    Ee[n.debugId] = 1, (0, we.u)(r);
                    var i = (0, Re.YM)(n),
                        s = p.gm.XMLHttpRequest,
                        o = p.gm.MutationObserver,
                        a = p.gm.Promise,
                        c = p.gm.setInterval,
                        d = "readystatechange",
                        l = ["onload", "onerror", "onabort", "onloadstart", "onloadend", "onprogress", "ontimeout"],
                        f = [],
                        h = p.gm.XMLHttpRequest = function(e) {
                            const r = new s(e),
                                o = n.context(r);
                            o.targets = (0, te.$5)(t);
                            try {
                                n.emit("new-xhr", [r], o), r.addEventListener(d, (a = o, function() {
                                    var e = this;
                                    e.readyState > 3 && !a.resolved && (a.resolved = !0, n.emit("xhr-resolved", [], e)), i.inPlace(e, l, "fn-", R)
                                }), (0, G.jT)(!1))
                            } catch (e) {
                                (0, u.R)(15, e);
                                try {
                                    n.emit("internal-error", [e])
                                } catch (e) {}
                            }
                            var a;
                            return r
                        };

                    function g(e, t) {
                        i.inPlace(t, ["onreadystatechange"], "fn-", R)
                    }
                    if (function(e, t) {
                            for (var r in e) t[r] = e[r]
                        }(s, h), h.prototype = s.prototype, i.inPlace(h.prototype, Te, "-xhr-", R), n.on("send-xhr-start", function(e, t) {
                            g(e, t),
                                function(e) {
                                    f.push(e), o && (m ? m.then(b) : c ? c(b) : (v = -v, y.data = v))
                                }(t)
                        }), n.on("open-xhr-start", g), o) {
                        var m = a && a.resolve();
                        if (!c && !a) {
                            var v = 1,
                                y = document.createTextNode(v);
                            new o(b).observe(y, {
                                characterData: !0
                            })
                        }
                    } else r.on("fn-end", function(e) {
                        e[0] && e[0].type === d || b()
                    });

                    function b() {
                        for (var e = 0; e < f.length; e++) g(0, f[e]);
                        f.length && (f = [])
                    }

                    function R(e, t) {
                        return t
                    }
                    return n
                }
                var xe = "fetch-",
                    Se = xe + "body-",
                    _e = ["arrayBuffer", "blob", "json", "text", "formData"],
                    Oe = p.gm.Request,
                    Pe = p.gm.Response,
                    ke = "prototype";
                const Ne = {};

                function je(e, t) {
                    const r = function(e) {
                        return (e || w.ee).get("fetch")
                    }(e);
                    if (!(Oe && Pe && p.gm.fetch)) return r;
                    if (Ne[r.debugId]++) return r;

                    function n(e, n, i) {
                        var s = e[n];
                        "function" == typeof s && (e[n] = function() {
                            var e = [...arguments];
                            const n = {},
                                o = (0, te.$5)(t);
                            var a;
                            r.emit(i + "before-start", [e], n), n[w.P] && n[w.P].dt && (a = n[w.P].dt);
                            var c = s.apply(this, e);
                            return r.emit(i + "start", [e, a], c), c.then(function(e) {
                                return r.emit(i + "end", [null, e, o], c), e
                            }, function(e) {
                                throw r.emit(i + "end", [e, void 0, o], c), e
                            })
                        })
                    }
                    return Ne[r.debugId] = 1, _e.forEach(e => {
                        n(Oe[ke], e, Se), n(Pe[ke], e, Se)
                    }), n(p.gm, "fetch", xe), r.on(xe + "end", function(e, t, n) {
                        var i = this;
                        if (i.targets = n || [void 0], t) {
                            var s = t.headers.get("content-length");
                            null !== s && (i.rxSize = s), r.emit(xe + "done", [null, t], i)
                        } else r.emit(xe + "done", [e], i)
                    }), r
                }
                var Ce = i(7485);
                class De {
                    constructor(e) {
                        this.agentRef = e
                    }
                    generateTracePayload(e) {
                        const t = this.agentRef.loader_config;
                        if (!this.shouldGenerateTrace(e) || !t) return null;
                        var r = (t.accountID || "").toString() || null,
                            n = (t.agentID || "").toString() || null,
                            i = (t.trustKey || "").toString() || null;
                        if (!r || !n) return null;
                        var s = (0, de.ZF)(),
                            o = (0, de.el)(),
                            a = Date.now(),
                            c = {
                                spanId: s,
                                traceId: o,
                                timestamp: a
                            };
                        return (e.sameOrigin || this.isAllowedOrigin(e) && this.useTraceContextHeadersForCors()) && (c.traceContextParentHeader = this.generateTraceContextParentHeader(s, o), c.traceContextStateHeader = this.generateTraceContextStateHeader(s, a, r, n, i)), (e.sameOrigin && !this.excludeNewrelicHeader() || !e.sameOrigin && this.isAllowedOrigin(e) && this.useNewrelicHeaderForCors()) && (c.newrelicHeader = this.generateTraceHeader(s, o, a, r, n, i)), c
                    }
                    generateTraceContextParentHeader(e, t) {
                        return "00-" + t + "-" + e + "-01"
                    }
                    generateTraceContextStateHeader(e, t, r, n, i) {
                        return i + "@nr=0-1-" + r + "-" + n + "-" + e + "----" + t
                    }
                    generateTraceHeader(e, t, r, n, i, s) {
                        if (!("function" == typeof p.gm ? .btoa)) return null;
                        var o = {
                            v: [0, 1],
                            d: {
                                ty: "Browser",
                                ac: n,
                                ap: i,
                                id: e,
                                tr: t,
                                ti: r
                            }
                        };
                        return s && n !== s && (o.d.tk = s), btoa((0, Y.A)(o))
                    }
                    shouldGenerateTrace(e) {
                        return this.agentRef.init ? .distributed_tracing ? .enabled && this.isAllowedOrigin(e)
                    }
                    isAllowedOrigin(e) {
                        var t = !1;
                        const r = this.agentRef.init ? .distributed_tracing;
                        if (e.sameOrigin) t = !0;
                        else if (r ? .allowed_origins instanceof Array)
                            for (var n = 0; n < r.allowed_origins.length; n++) {
                                var i = (0, Ce.D)(r.allowed_origins[n]);
                                if (e.hostname === i.hostname && e.protocol === i.protocol && e.port === i.port) {
                                    t = !0;
                                    break
                                }
                            }
                        return t
                    }
                    excludeNewrelicHeader() {
                        var e = this.agentRef.init ? .distributed_tracing;
                        return !!e && !!e.exclude_newrelic_header
                    }
                    useNewrelicHeaderForCors() {
                        var e = this.agentRef.init ? .distributed_tracing;
                        return !!e && !1 !== e.cors_use_newrelic_header
                    }
                    useTraceContextHeadersForCors() {
                        var e = this.agentRef.init ? .distributed_tracing;
                        return !!e && !!e.cors_use_tracecontext_headers
                    }
                }
                var Le = i(9300),
                    Ie = i(7295);

                function Me(e) {
                    return "string" == typeof e ? e : e instanceof(0, n.dV)().o.REQ ? e.url : p.gm ? .URL && e instanceof URL ? e.href : void 0
                }
                var Be = ["load", "error", "abort", "timeout"],
                    He = Be.length,
                    Ke = (0, n.dV)().o.REQ,
                    We = (0, n.dV)().o.XHR;
                const Fe = "X-NewRelic-App-Data";
                class Ue extends I {
                    static featureName = Le.T;
                    constructor(e) {
                        super(e, Le.T), this.dt = new De(e), this.handler = (e, t, r, n) => (0, A.p)(e, t, r, n, this.ee);
                        try {
                            const e = {
                                xmlhttprequest: "xhr",
                                fetch: "fetch",
                                beacon: "beacon"
                            };
                            p.gm ? .performance ? .getEntriesByType("resource").forEach(r => {
                                if (r.initiatorType in e && 0 !== r.responseStatus) {
                                    const n = {
                                            status: r.responseStatus
                                        },
                                        i = {
                                            rxSize: r.transferSize,
                                            duration: Math.floor(r.duration),
                                            cbTime: 0
                                        };
                                    Ve(n, r.name), this.handler("xhr", [n, i, r.startTime, r.responseEnd, e[r.initiatorType]], void 0, t.K7.ajax)
                                }
                            })
                        } catch (e) {}
                        je(this.ee, e), Ae(this.ee, e),
                            function(e, r, n, i) {
                                function s(e) {
                                    var t = this;
                                    t.totalCbs = 0, t.called = 0, t.cbTime = 0, t.end = R, t.ended = !1, t.xhrGuids = {}, t.lastSize = null, t.loadCaptureCalled = !1, t.params = this.params || {}, t.metrics = this.metrics || {}, t.latestLongtaskEnd = 0, e.addEventListener("load", function(r) {
                                        T(t, e)
                                    }, (0, G.jT)(!1)), p.lR || e.addEventListener("progress", function(e) {
                                        t.lastSize = e.loaded
                                    }, (0, G.jT)(!1))
                                }

                                function o(e) {
                                    this.params = {
                                        method: e[0]
                                    }, Ve(this, e[1]), this.metrics = {}
                                }

                                function a(t, r) {
                                    e.loader_config.xpid && this.sameOrigin && r.setRequestHeader("X-NewRelic-ID", e.loader_config.xpid);
                                    var n = i.generateTracePayload(this.parsedOrigin);
                                    if (n) {
                                        var s = !1;
                                        n.newrelicHeader && (r.setRequestHeader("newrelic", n.newrelicHeader), s = !0), n.traceContextParentHeader && (r.setRequestHeader("traceparent", n.traceContextParentHeader), n.traceContextStateHeader && r.setRequestHeader("tracestate", n.traceContextStateHeader), s = !0), s && (this.dt = n)
                                    }
                                }

                                function c(e, t) {
                                    var n = this.metrics,
                                        i = e[0],
                                        s = this;
                                    if (n && i) {
                                        var o = be(i);
                                        o && (n.txSize = o)
                                    }
                                    this.startTime = (0, x.t)(), this.body = i, this.listener = function(e) {
                                        try {
                                            "abort" !== e.type || s.loadCaptureCalled || (s.params.aborted = !0), ("load" !== e.type || s.called === s.totalCbs && (s.onloadCalled || "function" != typeof t.onload) && "function" == typeof s.end) && s.end(t)
                                        } catch (e) {
                                            try {
                                                r.emit("internal-error", [e])
                                            } catch (e) {}
                                        }
                                    };
                                    for (var a = 0; a < He; a++) t.addEventListener(Be[a], this.listener, (0, G.jT)(!1))
                                }

                                function d(e, t, r) {
                                    this.cbTime += e, t ? this.onloadCalled = !0 : this.called += 1, this.called !== this.totalCbs || !this.onloadCalled && "function" == typeof r.onload || "function" != typeof this.end || this.end(r)
                                }

                                function u(e, t) {
                                    var r = "" + ye(e) + !!t;
                                    this.xhrGuids && !this.xhrGuids[r] && (this.xhrGuids[r] = !0, this.totalCbs += 1)
                                }

                                function l(e, t) {
                                    var r = "" + ye(e) + !!t;
                                    this.xhrGuids && this.xhrGuids[r] && (delete this.xhrGuids[r], this.totalCbs -= 1)
                                }

                                function f() {
                                    this.endTime = (0, x.t)()
                                }

                                function h(e, t) {
                                    t instanceof We && "load" === e[0] && r.emit("xhr-load-added", [e[1], e[2]], t)
                                }

                                function g(e, t) {
                                    t instanceof We && "load" === e[0] && r.emit("xhr-load-removed", [e[1], e[2]], t)
                                }

                                function m(e, t, r) {
                                    t instanceof We && ("onload" === r && (this.onload = !0), ("load" === (e[0] && e[0].type) || this.onload) && (this.xhrCbStart = (0, x.t)()))
                                }

                                function v(e, t) {
                                    this.xhrCbStart && r.emit("xhr-cb-time", [(0, x.t)() - this.xhrCbStart, this.onload, t], t)
                                }

                                function y(e) {
                                    var t, r = e[1] || {};
                                    if ("string" == typeof e[0] ? 0 === (t = e[0]).length && p.RI && (t = "" + p.gm.location.href) : e[0] && e[0].url ? t = e[0].url : p.gm ? .URL && e[0] && e[0] instanceof URL ? t = e[0].href : "function" == typeof e[0].toString && (t = e[0].toString()), "string" == typeof t && 0 !== t.length) {
                                        t && (this.parsedOrigin = (0, Ce.D)(t), this.sameOrigin = this.parsedOrigin.sameOrigin);
                                        var n = i.generateTracePayload(this.parsedOrigin);
                                        if (n && (n.newrelicHeader || n.traceContextParentHeader))
                                            if (e[0] && e[0].headers) a(e[0].headers, n) && (this.dt = n);
                                            else {
                                                var s = {};
                                                for (var o in r) s[o] = r[o];
                                                s.headers = new Headers(r.headers || {}), a(s.headers, n) && (this.dt = n), e.length > 1 ? e[1] = s : e.push(s)
                                            }
                                    }

                                    function a(e, t) {
                                        var r = !1;
                                        return t.newrelicHeader && (e.set("newrelic", t.newrelicHeader), r = !0), t.traceContextParentHeader && (e.set("traceparent", t.traceContextParentHeader), t.traceContextStateHeader && e.set("tracestate", t.traceContextStateHeader), r = !0), r
                                    }
                                }

                                function b(e, t) {
                                    this.params = {}, this.metrics = {}, this.startTime = (0, x.t)(), this.dt = t;
                                    let [r, n = {}] = e;
                                    Ve(this, Me(r));
                                    const i = ("" + (r && r instanceof Ke && r.method || n.method || "GET")).toUpperCase();
                                    this.params.method = i, this.body = n.body, this.txSize = be(n.body) || 0
                                }

                                function w(e, t) {
                                    if (this.endTime = (0, x.t)(), this.params || (this.params = {}), (0, Ie.iW)(this.params)) return;
                                    let r;
                                    this.params.status = t ? t.status : 0, "string" == typeof this.rxSize && this.rxSize.length > 0 && (r = +this.rxSize);
                                    const n = {
                                            txSize: this.txSize,
                                            rxSize: r,
                                            duration: (0, x.t)() - this.startTime
                                        },
                                        i = [this.params, n, this.startTime, this.endTime, "fetch"];
                                    this.targets.forEach(e => E(i, this, e))
                                }

                                function R(e) {
                                    const t = this.params,
                                        r = this.metrics;
                                    if (this.ended) return;
                                    this.ended = !0;
                                    for (let t = 0; t < He; t++) e.removeEventListener(Be[t], this.listener, !1);
                                    if (t.aborted) return;
                                    if ((0, Ie.iW)(t)) return;
                                    r.duration = (0, x.t)() - this.startTime, this.loadCaptureCalled || 4 !== e.readyState ? null == t.status && (t.status = 0) : T(this, e), r.cbTime = this.cbTime;
                                    const n = [t, r, this.startTime, this.endTime, "xhr"];
                                    this.targets.forEach(e => E(n, this, e))
                                }

                                function E(e, r, i) {
                                    n("xhr", [...e, i], r, t.K7.ajax)
                                }

                                function T(e, n) {
                                    e.params.status = n.status;
                                    var i = function(e, t) {
                                        var r = e.responseType;
                                        return "json" === r && null !== t ? t : "arraybuffer" === r || "blob" === r || "json" === r ? be(e.response) : "text" === r || "" === r || void 0 === r ? be(e.responseText) : void 0
                                    }(n, e.lastSize);
                                    if (i && (e.metrics.rxSize = i), e.sameOrigin && n.getAllResponseHeaders().indexOf(Fe) >= 0) {
                                        var s = n.getResponseHeader(Fe);
                                        s && ((0, A.p)(U.rs, ["Ajax/CrossApplicationTracing/Header/Seen"], void 0, t.K7.metrics, r), e.params.cat = s.split(", ").pop())
                                    }
                                    e.loadCaptureCalled = !0
                                }
                                r.on("new-xhr", s), r.on("open-xhr-start", o), r.on("open-xhr-end", a), r.on("send-xhr-start", c), r.on("xhr-cb-time", d), r.on("xhr-load-added", u), r.on("xhr-load-removed", l), r.on("xhr-resolved", f), r.on("addEventListener-end", h), r.on("removeEventListener-end", g), r.on("fn-end", v), r.on("fetch-before-start", y), r.on("fetch-start", b), r.on("fn-start", m), r.on("fetch-done", w)
                            }(e, this.ee, this.handler, this.dt), this.importAggregator(e, () => i.e(478).then(i.bind(i, 3845)))
                    }
                }

                function Ve(e, t) {
                    var r = (0, Ce.D)(t),
                        n = e.params || e;
                    n.hostname = r.hostname, n.port = r.port, n.protocol = r.protocol, n.host = r.hostname + ":" + r.port, n.pathname = r.pathname, e.parsedOrigin = r, e.sameOrigin = r.sameOrigin
                }
                const ze = {},
                    Ge = ["pushState", "replaceState"];

                function Ye(e) {
                    const t = function(e) {
                        return (e || w.ee).get("history")
                    }(e);
                    return !p.RI || ze[t.debugId]++ || (ze[t.debugId] = 1, (0, Re.YM)(t).inPlace(window.history, Ge, "-")), t
                }
                var Ze = i(3738);

                function qe(e) {
                    (0, _.Y)(S.BL, function(r = Date.now()) {
                        const n = r - p.WN;
                        n < 0 && (0, u.R)(62, r), (0, A.p)(U.XG, [S.BL, {
                            time: n
                        }], void 0, t.K7.metrics, e.ee), e.addToTrace({
                            name: S.BL,
                            start: r,
                            origin: "nr"
                        }), (0, A.p)(S.Pl + S.hG, [n, S.BL], void 0, t.K7.genericEvents, e.ee)
                    }, e)
                }
                const {
                    He: Xe,
                    bD: $e,
                    d3: Qe,
                    Kp: Je,
                    TZ: et,
                    Lc: tt,
                    uP: rt,
                    Rz: nt
                } = Ze;
                class it extends I {
                    static featureName = et;
                    constructor(e) {
                        var r;
                        super(e, et), r = e, (0, _.Y)(S.U2, function(e) {
                            if (!(e && "object" == typeof e && e.name && e.start)) return;
                            const n = {
                                n: e.name,
                                s: e.start - p.WN,
                                e: (e.end || e.start) - p.WN,
                                o: e.origin || "",
                                t: "api"
                            };
                            n.s < 0 || n.e < 0 || n.e < n.s ? (0, u.R)(61, {
                                start: n.s,
                                end: n.e
                            }) : (0, A.p)("bstApi", [n], void 0, t.K7.sessionTrace, r.ee)
                        }, r), qe(e);
                        if (!(0, j.V)(e.init)) return void this.deregisterDrain();
                        const n = this.ee;
                        let s;
                        Ye(n), this.eventsEE = (0, we.u)(n), this.eventsEE.on(rt, function(e, t) {
                            this.bstStart = (0, x.t)()
                        }), this.eventsEE.on(tt, function(e, r) {
                            (0, A.p)("bst", [e[0], r, this.bstStart, (0, x.t)()], void 0, t.K7.sessionTrace, n)
                        }), n.on(nt + Qe, function(e) {
                            this.time = (0, x.t)(), this.startPath = location.pathname + location.hash
                        }), n.on(nt + Je, function(e) {
                            (0, A.p)("bstHist", [location.pathname + location.hash, this.startPath, this.time], void 0, t.K7.sessionTrace, n)
                        });
                        try {
                            s = new PerformanceObserver(e => {
                                const r = e.getEntries();
                                (0, A.p)(Xe, [r], void 0, t.K7.sessionTrace, n)
                            }), s.observe({
                                type: $e,
                                buffered: !0
                            })
                        } catch (e) {}
                        this.importAggregator(e, () => i.e(478).then(i.bind(i, 6974)), {
                            resourceObserver: s
                        })
                    }
                }
                var st = i(733),
                    ot = i(6344);
                class at extends I {
                    static featureName = ot.TZ;#
                    i;
                    recorder;
                    constructor(e) {
                        var r;
                        let n;
                        super(e, ot.TZ), r = e, (0, _.Y)(S.CH, function() {
                                (0, A.p)(S.CH, [], void 0, t.K7.sessionReplay, r.ee)
                            }, r),
                            function(e) {
                                (0, _.Y)(S.Tb, function() {
                                    (0, A.p)(S.Tb, [], void 0, t.K7.sessionReplay, e.ee)
                                }, e)
                            }(e);
                        const s = "".concat(d.Wt).concat((0, st.Y)(e.info.licenseKey, e.info.applicationID));
                        try {
                            n = JSON.parse(localStorage.getItem(s))
                        } catch (e) {}(0, N.SR)(e.init) && this.ee.on(S.CH, () => this.#s()), this.#o(n) && this.importRecorder().then(e => {
                            e.startRecording(ot.Qb.PRELOAD, n ? .sessionReplayMode)
                        }), this.importAggregator(this.agentRef, () => i.e(478).then(i.bind(i, 6167)), this), this.ee.on("err", e => {
                            this.blocked || this.agentRef.runtime.isRecording && (this.errorNoticed = !0, (0, A.p)(ot.Vh, [e], void 0, this.featureName, this.ee))
                        })
                    }#
                    o(e) {
                        return e && (e.sessionReplayMode === d.g.FULL || e.sessionReplayMode === d.g.ERROR) || (0, N.Aw)(this.agentRef.init)
                    }
                    importRecorder() {
                        return this.recorder ? Promise.resolve(this.recorder) : (this.#i ? ? = Promise.all([i.e(478), i.e(249)]).then(i.bind(i, 4866)).then(({
                            Recorder: e
                        }) => (this.recorder = new e(this), this.recorder)).catch(e => {
                            throw this.ee.emit("internal-error", [e]), this.blocked = !0, e
                        }), this.#i)
                    }#
                    s() {
                        this.blocked || (this.featAggregate ? this.featAggregate.mode !== d.g.FULL && this.featAggregate.initializeRecording(d.g.FULL, !0, ot.Qb.API) : this.importRecorder().then(() => {
                            this.recorder.startRecording(ot.Qb.API, d.g.FULL)
                        }))
                    }
                }
                var ct = i(3962);
                class dt extends I {
                    static featureName = ct.TZ;
                    constructor(e) {
                        if (super(e, ct.TZ), function(e) {
                                const r = e.ee.get("tracer");

                                function n() {}(0, _.Y)(S.dT, function(e) {
                                    return (new n).get("object" == typeof e ? e : {})
                                }, e);
                                const i = n.prototype = {
                                    createTracer: function(n, i) {
                                        var s = {},
                                            o = this,
                                            a = "function" == typeof i;
                                        return (0, A.p)(U.xV, ["API/createTracer/called"], void 0, t.K7.metrics, e.ee),
                                            function() {
                                                if (r.emit((a ? "" : "no-") + "fn-start", [(0, x.t)(), o, a], s), a) try {
                                                    return i.apply(this, arguments)
                                                } catch (e) {
                                                    const t = "string" == typeof e ? new Error(e) : e;
                                                    throw r.emit("fn-err", [arguments, this, t], s), t
                                                } finally {
                                                    r.emit("fn-end", [(0, x.t)()], s)
                                                }
                                            }
                                    }
                                };
                                ["actionText", "setName", "setAttribute", "save", "ignore", "onEnd", "getContext", "end", "get"].forEach(r => {
                                    _.Y.apply(this, [r, function() {
                                        return (0, A.p)(S.hw + r, [performance.now(), ...arguments], this, t.K7.softNav, e.ee), this
                                    }, e, i])
                                }), (0, _.Y)(S.PA, function() {
                                    (0, A.p)(S.hw + "routeName", [performance.now(), ...arguments], void 0, t.K7.softNav, e.ee)
                                }, e)
                            }(e), !p.RI || !(0, n.dV)().o.MO) return;
                        const r = Ye(this.ee);
                        try {
                            this.removeOnAbort = new AbortController
                        } catch (e) {}
                        ct.tC.forEach(e => {
                            (0, G.sp)(e, e => {
                                c(e)
                            }, !0, this.removeOnAbort ? .signal)
                        });
                        const s = () => (0, A.p)("newURL", [(0, x.t)(), "" + window.location], void 0, this.featureName, this.ee);
                        r.on("pushState-end", s), r.on("replaceState-end", s), (0, G.sp)(ct.OV, e => {
                            c(e), (0, A.p)("newURL", [e.timeStamp, "" + window.location], void 0, this.featureName, this.ee)
                        }, !0, this.removeOnAbort ? .signal);
                        let o = !1;
                        const a = new((0, n.dV)().o.MO)((e, t) => {
                                o || (o = !0, requestAnimationFrame(() => {
                                    (0, A.p)("newDom", [(0, x.t)()], void 0, this.featureName, this.ee), o = !1
                                }))
                            }),
                            c = (0, C.s)(e => {
                                "loading" !== document.readyState && ((0, A.p)("newUIEvent", [e], void 0, this.featureName, this.ee), a.observe(document.body, {
                                    attributes: !0,
                                    childList: !0,
                                    subtree: !0,
                                    characterData: !0
                                }))
                            }, 100, {
                                leading: !0
                            });
                        this.abortHandler = function() {
                            this.removeOnAbort ? .abort(), a.disconnect(), this.abortHandler = void 0
                        }, this.importAggregator(e, () => i.e(478).then(i.bind(i, 4393)), {
                            domObserver: a
                        })
                    }
                }
                var ut = i(9119);
                const lt = {},
                    ft = new Set;

                function ht(e) {
                    return "string" == typeof e ? {
                        type: "string",
                        size: (new TextEncoder).encode(e).length
                    } : e instanceof ArrayBuffer ? {
                        type: "ArrayBuffer",
                        size: e.byteLength
                    } : e instanceof Blob ? {
                        type: "Blob",
                        size: e.size
                    } : e instanceof DataView ? {
                        type: "DataView",
                        size: e.byteLength
                    } : ArrayBuffer.isView(e) ? {
                        type: "TypedArray",
                        size: e.byteLength
                    } : {
                        type: "unknown",
                        size: 0
                    }
                }
                class pt {
                    constructor(e, t) {
                        this.timestamp = (0, x.t)(), this.currentUrl = (0, ut.L)(window.location.href), this.socketId = (0, de.LA)(8), this.requestedUrl = (0, ut.L)(e), this.requestedProtocols = Array.isArray(t) ? t.join(",") : t || "", this.openedAt = void 0, this.protocol = void 0, this.extensions = void 0, this.binaryType = void 0, this.messageOrigin = void 0, this.messageCount = 0, this.messageBytes = 0, this.messageBytesMin = 0, this.messageBytesMax = 0, this.messageTypes = void 0, this.sendCount = 0, this.sendBytes = 0, this.sendBytesMin = 0, this.sendBytesMax = 0, this.sendTypes = void 0, this.closedAt = void 0, this.closeCode = void 0, this.closeReason = "unknown", this.closeWasClean = void 0, this.connectedDuration = 0, this.hasErrors = void 0
                    }
                }
                class gt extends I {
                    static featureName = a.TZ;
                    constructor(e) {
                        super(e, a.TZ);
                        const r = e.init.feature_flags.includes("websockets"),
                            s = !e.init.feature_flags.includes("no_spv"),
                            o = [e.init.page_action.enabled, e.init.performance.capture_marks, e.init.performance.capture_measures, e.init.performance.resources.enabled, e.init.user_actions.enabled, r, s];
                        var c;
                        let d;
                        if (c = e, (0, _.Y)(S.hG, (e, t) => se(e, t, c), c), function(e) {
                                (0, _.Y)(S.fF, (t, r) => ae(t, r, e), e)
                            }(e), qe(e), he(e), function(e) {
                                (0, _.Y)(S.V1, (t, r) => oe(t, r, e), e)
                            }(e), this.removeOnAbort = new AbortController, this.abortHandler = () => {
                                this.removeOnAbort.abort(), this.abortHandler = void 0
                            }, r) {
                            const u = function(e) {
                                if (!(0, n.dV)().o.WS) return e;
                                const t = e.get("websockets");
                                if (lt[t.debugId]++) return t;
                                lt[t.debugId] = 1, (0, K.G)(() => {
                                    const e = (0, x.t)();
                                    ft.forEach(r => {
                                        r.nrData.closedAt = e, r.nrData.closeCode = 1001, r.nrData.closeReason = "Page navigating away", r.nrData.closeWasClean = !1, r.nrData.openedAt && (r.nrData.connectedDuration = e - r.nrData.openedAt), t.emit("ws", [r.nrData], r)
                                    })
                                });
                                class r extends WebSocket {
                                    static name = "WebSocket";
                                    static toString() {
                                        return "function WebSocket() { [native code] }"
                                    }
                                    toString() {
                                        return "[object WebSocket]"
                                    }
                                    get[Symbol.toStringTag]() {
                                        return r.name
                                    }#
                                    a(e) {
                                        (e.__newrelic ? ? = {}).socketId = this.nrData.socketId, this.nrData.hasErrors ? ? = !0
                                    }
                                    constructor(...e) {
                                        super(...e), this.nrData = new pt(e[0], e[1]), this.addEventListener("open", () => {
                                            this.nrData.openedAt = (0, x.t)(), ["protocol", "extensions", "binaryType"].forEach(e => {
                                                this.nrData[e] = this[e]
                                            }), ft.add(this)
                                        }), this.addEventListener("message", e => {
                                            const {
                                                type: t,
                                                size: r
                                            } = ht(e.data);
                                            this.nrData.messageOrigin ? ? = (0, ut.L)(e.origin), this.nrData.messageCount++, this.nrData.messageBytes += r, this.nrData.messageBytesMin = Math.min(this.nrData.messageBytesMin || 1 / 0, r), this.nrData.messageBytesMax = Math.max(this.nrData.messageBytesMax, r), (this.nrData.messageTypes ? ? "").includes(t) || (this.nrData.messageTypes = this.nrData.messageTypes ? "".concat(this.nrData.messageTypes, ",").concat(t) : t)
                                        }), this.addEventListener("close", e => {
                                            this.nrData.closedAt = (0, x.t)(), this.nrData.closeCode = e.code, e.reason && (this.nrData.closeReason = e.reason), this.nrData.closeWasClean = e.wasClean, this.nrData.connectedDuration = this.nrData.closedAt - this.nrData.openedAt, ft.delete(this), t.emit("ws", [this.nrData], this)
                                        })
                                    }
                                    addEventListener(e, t, ...r) {
                                        const n = this,
                                            i = "function" == typeof t ? function(...e) {
                                                try {
                                                    return t.apply(this, e)
                                                } catch (e) {
                                                    throw n.#a(e), e
                                                }
                                            } : t ? .handleEvent ? {
                                                handleEvent: function(...e) {
                                                    try {
                                                        return t.handleEvent.apply(t, e)
                                                    } catch (e) {
                                                        throw n.#a(e), e
                                                    }
                                                }
                                            } : t;
                                        return super.addEventListener(e, i, ...r)
                                    }
                                    send(e) {
                                        if (this.readyState === WebSocket.OPEN) {
                                            const {
                                                type: t,
                                                size: r
                                            } = ht(e);
                                            this.nrData.sendCount++, this.nrData.sendBytes += r, this.nrData.sendBytesMin = Math.min(this.nrData.sendBytesMin || 1 / 0, r), this.nrData.sendBytesMax = Math.max(this.nrData.sendBytesMax, r), (this.nrData.sendTypes ? ? "").includes(t) || (this.nrData.sendTypes = this.nrData.sendTypes ? "".concat(this.nrData.sendTypes, ",").concat(t) : t)
                                        }
                                        try {
                                            return super.send(e)
                                        } catch (e) {
                                            throw this.#a(e), e
                                        }
                                    }
                                    close(...e) {
                                        try {
                                            super.close(...e)
                                        } catch (e) {
                                            throw this.#a(e), e
                                        }
                                    }
                                }
                                return p.gm.WebSocket = r, t
                            }(this.ee);
                            u.on("ws", e => {
                                (0, A.p)("ws-complete", [e], void 0, this.featureName, this.ee)
                            })
                        }
                        if (s && p.gm.addEventListener("securitypolicyviolation", e => {
                                (0, A.p)("spv", [e], void 0, t.K7.genericEvents, this.ee)
                            }, (0, G.jT)(!1, this.removeOnAbort.signal)), p.RI) {
                            if (je(this.ee, e), Ae(this.ee, e), d = Ye(this.ee), e.init.user_actions.enabled) {
                                function l(t) {
                                    const r = (0, Ce.D)(t);
                                    return e.beacons.includes(r.hostname + ":" + r.port)
                                }

                                function f() {
                                    d.emit("navChange")
                                }
                                a.Zp.forEach(e => (0, G.sp)(e, e => (0, A.p)("ua", [e], void 0, this.featureName, this.ee), !0)), a.qN.forEach(e => {
                                    const t = (0, C.s)(e => {
                                        (0, A.p)("ua", [e], void 0, this.featureName, this.ee)
                                    }, 500, {
                                        leading: !0
                                    });
                                    (0, G.sp)(e, t)
                                }), p.gm.addEventListener("error", () => {
                                    (0, A.p)("uaErr", [], void 0, t.K7.genericEvents, this.ee)
                                }, (0, G.jT)(!1, this.removeOnAbort.signal)), this.ee.on("open-xhr-start", (e, r) => {
                                    l(e[1]) || r.addEventListener("readystatechange", () => {
                                        2 === r.readyState && (0, A.p)("uaXhr", [], void 0, t.K7.genericEvents, this.ee)
                                    }, (0, G.jT)(void 0, this.removeOnAbort.signal))
                                }), this.ee.on("fetch-start", e => {
                                    e.length >= 1 && !l(Me(e[0])) && (0, A.p)("uaXhr", [], void 0, t.K7.genericEvents, this.ee)
                                }), d.on("pushState-end", f), d.on("replaceState-end", f), window.addEventListener("hashchange", f, (0, G.jT)(!0, this.removeOnAbort.signal)), window.addEventListener("popstate", f, (0, G.jT)(!0, this.removeOnAbort.signal))
                            }
                            if (e.init.performance.resources.enabled && p.gm.PerformanceObserver ? .supportedEntryTypes.includes("resource")) {
                                new PerformanceObserver(e => {
                                    e.getEntries().forEach(e => {
                                        (0, A.p)("browserPerformance.resource", [e], void 0, this.featureName, this.ee)
                                    })
                                }).observe({
                                    type: "resource",
                                    buffered: !0
                                })
                            }
                        }
                        o.some(e => e) ? this.importAggregator(e, () => i.e(478).then(i.bind(i, 8019))) : this.deregisterDrain()
                    }
                }
                var mt = i(2646);
                const vt = new Map;

                function yt(e, t, r, n, i = !0, s) {
                    if ("object" != typeof t || !t || "string" != typeof r || !r || "function" != typeof t[r]) return (0, u.R)(29);
                    const o = function(e) {
                            return (e || w.ee).get("logger")
                        }(e),
                        a = (0, Re.YM)(o, void 0, s),
                        c = new mt.y(w.P);
                    c.level = n.level, c.customAttributes = n.customAttributes, c.autoCaptured = i;
                    const d = t[r] ? .[Re.Jt] || t[r];
                    return vt.set(d, c), a.inPlace(t, [r], "wrap-logger-", () => vt.get(d), void 0, !0), o
                }
                var bt = i(1910);
                class wt extends I {
                    static featureName = re.TZ;
                    constructor(e) {
                        var t;
                        super(e, re.TZ), t = e, (0, _.Y)(S.$9, (e, r) => ie(e, r, t), t),
                            function(e) {
                                (0, _.Y)(S.Wb, (t, r, {
                                    customAttributes: n = {},
                                    level: i = re.p_.INFO
                                } = {}) => {
                                    yt(e.ee, t, r, {
                                        customAttributes: n,
                                        level: i
                                    }, !1, e)
                                }, e)
                            }(e), he(e);
                        const r = this.ee;
                        ["log", "error", "warn", "info", "debug", "trace"].forEach(t => {
                            (0, bt.i)(p.gm.console[t]), yt(r, p.gm.console, t, {
                                level: "log" === t ? "info" : t
                            }, void 0, e)
                        }), this.ee.on("wrap-logger-end", function([e], t, n, i = []) {
                            const {
                                level: s,
                                customAttributes: o,
                                autoCaptured: a
                            } = this;
                            i.forEach(t => {
                                (0, ne.R)(r, e, o, s, a, t)
                            })
                        }), this.importAggregator(e, () => i.e(478).then(i.bind(i, 5288)))
                    }
                }
                new H({
                    features: [Ue, B, F, it, at, V, ge, gt, wt, dt],
                    loaderType: "spa"
                })
            })()
        })();
    </script>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=0">
    <!-- Bootstrap CSS -->

    <link rel="stylesheet" href="https://www.sastasafar.com/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://www.sastasafar.com/css/material-design-iconic-font.css">

    <!--<link href="https://cdn.jsdelivr.net/npm/gijgo@1.9.6/css/gijgo.min.css" rel="stylesheet" type="text/css" />-->


    <meta name="csrf-token" content="d8d97723e90658f2dc777b4a15e8652c">
    <!--<link href="https://www.sastasafar.com/portal/assets/css/main.css" rel="stylesheet">-->
    <link href="https://www.sastasafar.com/css/main.css" rel="stylesheet">

    <link rel="stylesheet" href="https://www.sastasafar.com/css/owl.carousel.min.css">


    <link rel="stylesheet" href="https://www.sastasafar.com/css/style.css?trvss">
    <link rel="stylesheet" href="https://www.sastasafar.com/css/caleran.min.css">
    <link rel="stylesheet" href="https://www.sastasafar.com/css/easy-autocomplete.min.css">

    <link rel="stylesheet" href="https://www.sastasafar.com/css/responsive.css?">
    <link rel="stylesheet" href="https://www.sastasafar.com/css/default.css">
    <link rel="stylesheet" href="https://www.sastasafar.com/css/default.date.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24
        }

        .icon-2x {
            font-size: 32px !important;
        }

        .icon-3x {
            font-size: 40px !important;
        }

        .icon-4x {
            font-size: 48px !important;
        }

        .icon-5x {
            font-size: 56px !important;
        }
    </style>

    <link rel="stylesheet" href="https://www.sastasafar.com/css/sastasafar.css?">




    <link rel="apple-touch-icon" sizes="57x57" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="https://www.sastasafar.com/fav/fav-ss/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="https://www.sastasafar.com/fav//fav-ss/apple-icon-180x180.png">
    <link rel="icon" type="image" sizes="192x192" href="https://www.sastasafar.com/fav/fav-ss/android-icon-192x192.png">
    <link rel="icon" type="image" sizes="32x32" href="https://www.sastasafar.com/fav/fav-ss/favicon-32x32.png">
    <link rel="icon" type="image" sizes="96x96" href="https://www.sastasafar.com/fav/fav-ss/favicon-96x96.png">
    <link rel="icon" type="image" sizes="16x16" href="https://www.sastasafar.com/fav/fav-ss/favicon-16x16.png">
    <link rel="manifest" href="https://www.sastasafar.com/fav/fav-ss/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="https://www.sastasafar.com/fav/fav-ss/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <meta name="google-site-verification" content="1ycwDID9hgjnDblauRhO-JXTRNfC3ErKcKVXxr_mQTc" />

    <style>
        .top-bar.scroll-to-fixed-fixed {
            -webkit-box-shadow: 0 8px 10px -6px #666;
            -moz-box-shadow: 0 8px 10px -6px #666;
            box-shadow: 0 8px 10px -6px #666;
        }

        input.travellerDetails {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>

    <title>Usak to Dubai Bus Station Flights - SastaSafar.com</title>
    <meta name="Description" content="Looking for travel in India , Book flights, buses, hotels and train tickets. Search flights and get best deal on air tickets." />
    <meta name="Keywords" content="Cheap Air Tickets, Cheapest Flight Booking, Flight Tickets, Airline Tickets, Lowest Airfare, Online Booking, SastaSafar.com" />

    <meta property='og:title' content="SastaSafar - Flights, Hotels and Holidays" />
    <meta property='og:image' content="https://www.sastasafar.com/fav/fav-ss/apple-icon-180x180.png" />
    <meta property='og:description' content="Book Flights, Hotels, Bus Tickets & Holidays" />
    <meta property='og:url' content="https://www.sastasafar.com" />

    <!-- Google Tag Manager -->
    <script type="228fe3999d327e492e219f71-text/javascript">
        dataLayer = [];


        dataLayer.push({
            'TOD_PGN': 'view_search_results',
            'TOD_PGN_MS': 'searchresults',
            'TOD_ORIGIN': 'USQ',
            'TOD_DESTINATION': 'XMB',
            'TOD_ORIGIN_NAME': 'USAK',
            'TOD_DESTINATION_NAME': 'DUBAI BUS STATION',
            'TOD_PID': 'USQ-XMB',
            'TOD_REF': 'ss-direct',
            'TOD_PAX_ADT': '1',
            'TOD_PAX_CHD': '0',
            'TOD_PAX_INF': '0',
            'TOD_DEP_DATE': '2026-06-20',
            'TOD_RET_DATE': '2026-06-30',
            'TOD_DEP_DATE_NEW': '20-Jun-2026',
            'TOD_RET_DATE_NEW': '30-Jun-2026',
            'TOD_TRIP_TYPE': 'RT',
            'google_ana_remark': {
                "google_business_vertical": "flights",
                "origin": "USQ",
                "destination": "XMB",
                "start_date": "2026-06-20",
                "end_date": "2026-06-30"
            }
        });







        <!--
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-KPMNX7Z');

        -->
    </script>


    <!-- End Google Tag Manager -->
    <style>
        .picker__day {
            border-radius: 5px !important;
            margin: 3px !important;
        }

        .formRow--item input[type=text]:focus {
            /* box-shadow: 0px 5px 10px -4px grey; */
            box-shadow: 0px 0px 8px -2px inset grey;
            transition: all .3s ease-in-out;
        }

        /* ************************************************************************************************ Bus Style ******************************************************************* */

        .btn-outline-primary-custom {
            border: 1px solid #cacaca;
            color: #040222;
            background-color: transparent !important;
        }

        .btn-outline-primary-custom.active {
            border: 1px solid #1b73e8;
            color: #1b73e8;
            background-color: #e2f5ff !important;
        }

        .bus {
            top: 20px;
            width: 35%;
            /* animation: updown 1s linear infinite; */
        }

        .bg-bus {
            bottom: 56px;
            right: 17%;
            width: 70%;
            /* animation: bgbus 5s linear infinite; */
        }

        #Search_Bus .border-right-lg {
            border-right: 1px solid #dee2e6 !important;
        }

        #Search_Bus .easy-autocomplete-container {
            width: 100% !important;
            left: 0 !important;
        }

        #Search_Bus .eac-item {
            padding: 12px 18px !important;
        }

        #Search_Bus .error {
            padding: 0 10px 15px 10px !important;
        }

        @media only screen and (max-width: 767px) {
            #Search_Bus .border-right-lg {
                border-bottom: 1px solid #dee2e6 !important;
                border-right: none !important;
            }
        }

        @keyframes updown {
            0% {
                top: 20px;
            }
            50% {
                top: 23px;
            }
            100% {
                top: 20px;
            }
        }

        @keyframes bgbus {
            0% {
                right: 17%
            }
            50% {
                right: 100%
            }
            100% {
                right: 0%
            }
        }

        /* ************************************************************************************************ Bus Style ******************************************************************* */

        .tab_design li.nav-item:first-child a.tab-link {
            border-radius: 10px 0 0 10px !important;
        }

        input.travellerDetails {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .badge-green-custom {
            color: #0fa457;
            border: 0px solid #0fa457 !important;
            background-color: #f3fbf7;
            padding: 5px 8px;
        }

        .badge-meal-custom {
            color: #ff9b00;
            border: 0px solid #ff9b00 !important;
            padding: 5px 8px;
            background-color: #fff2ca;
        }

        .badge-purple-custom {
            color: rgb(172 83 249);
            border: 0px solid rgb(172 83 249) !important;
            background-color: #faf5ff;
            padding: 5px 8px;
        }

        .badge-primary-custom {
            color: #1c73e8;
            background-color: #e2f5ff;
            border: 0px solid #1c73e8 !important;
            padding: 5px 8px;
        }

        .btn-outline-primary-subtle {
            color: black;
            background-color: #e2f5ff;
            border: 0px solid #1c73e8;
        }

        @media only screen and (max-width: 767px) {
            .overflow-responsive-mob {
                overflow-x: scroll;
                scroll-snap-type: x mandatory;
                scrollbar-width: none;
            }
            .extra_fare_card {
                scroll-snap-align: start;
                min-width: 264px;
                flex-shrink: 0;
                margin-right: 10px;
            }
        }

        /* .tab_design .nav-link:last-child{
            border-radius: 0 10px 10px 0 !important;
          } */

        @media only screen and (max-width: 576px) {
            .easy-autocomplete-container {
                right: -44px;
                min-width: 226px;
                max-width: 531px;
                width: 128%;
                left: auto;
            }
        }
    </style>
</head>

<body class="bgshade-1">




    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KPMNX7Z"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->


    <form id="page_form" autocomplete="off">
        <div class="body-mains">



            <style>
                .hovereffect:hover {
                    background-color: #e8eef8;
                }

                .activeTabEffect {
                    background-color: #e8eef8;
                    font-weight: 700;
                    border-bottom: 2px solid #007bff;
                }

                .nav-link {
                    font-weight: unset !important;
                    background: none;
                }

                .dropdown-item:active {
                    background-color: #e8eef8 !important;
                    color: #231f20;
                }

                .menu-offcanvas-fullscreen {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    z-index: 100;
                    visibility: hidden;
                    background: #fff;
                    transition: all 0.3s ease;
                }

                .menu-offcanvas-fullscreen nav.menu-links a {
                    display: block;
                    text-decoration: none;
                    color: #231f20;
                    /* margin: .75rem 0; */
                    padding: .35rem 0;
                    font-size: 1rem;
                    margin: 0;
                }

                .menu-offcanvas-fullscreen nav.menu-links a:active {
                    background-color: #e8eef8;
                }

                .menu-offcanvas-fullscreen.opened {
                    right: 0;
                    visibility: visible;
                    overflow: auto;
                }

                /* .dropdown-menu {
            left: 30% !important;
        } */
            </style>


            <!-- Off Canvas Menu -->
            <div class="menu-offcanvas-fullscreen w-100 h-100">
                <div class="container-fluid">
                    <div class="row middle-xs">
                        <div class="col-md-12 end-xs px-0">
                            <div class="close-icon-div text-right pt-3 px-3">
                                <span class="material-symbols-outlined icon-2x" style="cursor: pointer; color:#054fec;" onclick="if (!window.__cfRLUnblockHandlers) return false; closeMobileNav()" data-cf-modified-228fe3999d327e492e219f71-="">close</span>
                            </div>

                            <nav class="menu-links text-dark">
                                <a href="/" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">home</span><span>HOME</span></a>
                                <a href="/flight-deal" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">flightsmode</span><span>FLIGHT</span>
</a>
                                <a href="/hotels" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">hotel</span><span>HOTEL</span><span class="badge badge-success ml-2 shimmer" style="font-size: 10px !important;">NEW</span></a>
                                <a href="/bus" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">directions_bus</span><span>BUS</span><span class="badge badge-success ml-2 shimmer" style="font-size: 10px !important;">NEW</span></a>

                                <a href="/holidays/" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">work</span><span>PACKAGES</span></a>
                                <a href="/flight-offers/" class="d-flex align-items-center px-4"><span class="material-symbols-outlined icon-2x mr-3">local_offer</span><span>OFFERS</span></a>

                            </nav>
                            <nav class="menu-links text-dark">
                                <a href="/portal/mybooking" class="d-flex align-items-center w-100 px-4"><span class="material-symbols-outlined icon-2x mr-3">local_activity</span><span>FIND YOUR BOOKING</span></a>
                            </nav>
                            <div class="px-4">
                                <a href="/portal/login" class="btn btn-lg w-75 text-white mt-4 py-2 mb-2" style="border-radius: 5px !important; background-color:#054fec;">LOGIN</a>
                                <a href="/portal/signup" class="btn btn-lg w-75 py-2" style="border-radius: 5px !important; border-color:#054fec; color:#054fec;">SIGN UP</a>
                            </div>
                            <nav class="menu-links text-dark mt-4">
                                <a href="/company/privacy-policy" class="px-4" style="font-size: 1rem !important;">Privacy Policy</a>
                                <a href="/company/terms-and-conditions" class="my-0 px-4" style="font-size: 1rem !important;">Terms & Conditions</a>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>


            <div class="bg-white  header">
                <div class="container">
                    <nav class="navbar navbar-expand-lg navbar-light justify-content-between align-items-center py-0 px-0 ticket_pdf_none">
                        <a class="navbar-brand py-3" href="/">
                    <img src="https://www.sastasafar.com/img/sastasafar_logo.png" alt="SastaSafar" class="pt-0 pb-0" width="170">
                </a>
                        <div class="breadcrumb_a ml-auto mr-auto flat d-none d-md-block">
                            <a href="#" class="active">Search</a>
                            <a href="#" class="">Select</a>
                            <a href="#" class="">Payment</a>
                            <a href="#" class="">Confirmation</a>
                        </div>

                        <div class="">
                            <div class="w-100 d-inline-flex d-md-none text-right align-items-center justify-content-end">
                                <div class="d-block">
                                    <p class="m-0 font-weight-bold">Step 1/4</p>
                                </div>
                                <div class="ml-2 position-relative">
                                    <p class="text-muted m-0 text-center position-absolute w-100" style="top: 11px; left: 2px;">1/4</p>
                                    <svg width="45" height="45" style="-webkit-transform: rotate(-90deg); transform: rotate(-90deg);" xmlns="http://www.w3.org/2000/svg">
                                        <circle class="circle-chart__background" stroke="#efeff7" stroke-width="2" fill="none" cx="25" cy="25" r="18" />
                                        <circle class="circle_animation" style="stroke-dashoffset: 410; stroke-dasharray: 440;" r="18" cy="25" cx="25" stroke-width="2" stroke="#1459d7" fill="none" />
                                    </svg>
                                </div>
                            </div>
                        </div>


                        <ul class="navbar-nav align-items-center d-none d-lg-flex" style="flex-direction: row;">
                            <li class="nav-item">
                                <span class="navbar-text text-right">
                            <small class="badge badge-success">
                                LIVE ASSISTANCE </small>
                            <h5 class="mb-0 ">
                                <span class="material-symbols-outlined animated" style="vertical-align: text-top;">call</span>
                                <a href="tel:+91 8796-237-089" class="font-weight-bold" style="text-decoration:none; color:#054fec">+91 8796-237-089</a>
                                </h5>
                                </span>
                            </li>
                            <li class="d-none d-lg-block" style="display:none !important;">
                                <a href="#" class="d-flex align-items-center nav-link dropdown-toggle pr-0" id="menuDropdownLinks" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <div class="p-2 d-flex justify-content-center align-items-center ml-3" style="border-radius: 50%; width:50px; height:50px; background-color: #054fec;">
                                        <span class="material-symbols-outlined text-white icon-2x">person</span>
                                    </div>
                                </a>
                                <div class="dropdown-menu py-1 p-0" aria-labelledby="menuDropdownLinks" style="left: unset; right:14px; min-width:13rem;">
                                    <a href="https://www.sastasafar.com/portal/login" class="dropdown-item border-bottom py-2"><span class="material-symbols-outlined mr-3" style="vertical-align: middle;">login</span>Login</a>
                                    <a href="https://www.sastasafar.com/portal/signup" class="dropdown-item border-bottom py-2"><span class="material-symbols-outlined mr-3" style="vertical-align: middle;">person_add</span>Sign up</a>
                                    <a href="https://www.sastasafar.com/portal/mybooking" class="dropdown-item py-2"><span class="material-symbols-outlined mr-3" style="vertical-align: middle;">local_activity</span>Find Your Booking</a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <style>
                /* Plane Loader Animation  */

                /*
    .animation {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 20rem;
        max-width: 55rem;
        background-color: #1D1F20;
        animation: 10s linear infinite sky;
    }

    .animation:after {
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        box-shadow: 0 7rem 30rem -4rem #5aacdc inset;
    }

    .animation [class^="animation__"],
    .animation [class*=" animation__"] {
        position: absolute;
    }

    .please_wait {
        position: absolute;
        bottom: 4%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
    }

    .dep_info {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
    }


    .animation__plane {
        position: absolute;
        z-index: 1;
        top: calc(40% - (62px/2));
        left: calc(50% - (272px/2));
        width: 17rem;
        height: 6.2rem;
        animation: 2s ease-in-out takeOff, 5s ease-in-out infinite alternate flight 2s;
    }

    .animation__plane--shadow {
        bottom: 1rem;
        left: calc(54% - (8rem/2));
        width: 8rem;
        height: 1rem;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        animation: 2s ease-in-out takeOffShadow, 5s ease-in-out infinite alternate flightShadow 2s;
    }

    .animation__cloud--front {
        z-index: 2;
        top: 50%;
        left: 20%;
        width: 8.5rem;
        height: 3rem;
        fill: #cee4e7;
        animation: 4s linear infinite cloudFront;
    }

    .animation__cloud--middle {
        top: 22%;
        left: 75%;
        width: 6rem;
        height: 3rem;
        fill: #cee4e7;
        animation: 5s linear infinite cloudMiddle;
    }

    .animation__cloud--back {
        top: 6%;
        left: 34%;
        fill: #cee4e7;
        animation: 8s linear infinite cloudBack;
    }

    .animation .animation__loader {
        position: absolute;
        left: 0;
        bottom: 3rem;
        width: 100%;
        height: 4px;
        background-color: rgba(0, 0, 0, 0.15);
    }

    .animation .animation__loader:after {
        position: absolute;
        display: block;
        content: '';
        width: 100%;
        height: 100%;
        background-color: #cee4e7;
        overflow: hidden;
        animation: 1.5s ease-in-out infinite loader;
    }

    @keyframes loader {
        0% {
            left: -100%;
        }

        100% {
            left: 100%;
        }
    }

    @keyframes takeOff {
        0% {
            transform: translate(-220%, 110%);
        }

        100% {
            transform: translate(0, 0);
        }
    }

    @keyframes takeOffShadow {
        0% {
            transform: translate(-440%, 110%);
            opacity: 1;
        }

        100% {
            transform: translate(0, 0);
            opacity: 0.8;
        }
    }

    @keyframes flight {
        0% {
            transform: translate(0, 0);
        }

        25% {
            transform: translate(0, 10%);
        }

        75% {
            transform: translate(0, -10%);
        }

        100% {
            transform: translate(0, 0);
        }
    }

    @keyframes flightShadow {
        0% {
            transform: scale(0.8);
            opacity: 0.8;
        }

        25% {
            transform: scale(0.9);
            opacity: 1;
        }

        75% {
            transform: scale(1.1);
            opacity: 0.6;
        }

        100% {
            transform: scale(0.8);
            opacity: 0.8;
        }
    }

    @keyframes cloudFront {
        0% {
            transform: translate(520%, 0);
        }

        100% {
            transform: translate(-600%, 0);
        }
    }

    @keyframes cloudMiddle {
        0% {
            transform: translate(230%, 0);
        }

        100% {
            transform: translate(-900%, 0);
        }
    }

    @keyframes cloudBack {
        0% {
            transform: translate(910%, 0);
        }

        100% {
            transform: translate(-1000%, 0);
        }
    }

    @keyframes sky {
        0% {
            background-color: #fff;
        }

        20% {
            background-color: #fff;
        }

        35% {
            background-color: #ffc8bd;
        }

        50% {
            background-color: #1d1f20;
            color: #fff;
        }

        70% {
            background-color: #1d1f20;
            color: #fff;
        }

        85% {
            background-color: #ffc8bd;
        }

        100% {
            background-color: #fff;
        }
    }*/

                .animation {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    height: 20rem;
                    max-width: 55rem;
                    border-radius: 6px;
                    animation: 10s linear infinite sky;
                    /* background: rgb(135,206,235);
        background: linear-gradient(90deg, rgba(135,206,235,1) 0%, rgba(135,206,235,0.19509810760241597) 100%);  */
                    background: rgb(255, 255, 255);
                    background: -moz-linear-gradient(270deg, rgba(255, 255, 255, 1) 4%, rgba(178, 218, 235, 1) 100%);
                    background: -webkit-linear-gradient(270deg, rgba(255, 255, 255, 1) 4%, rgba(178, 218, 235, 1) 100%);
                    background: linear-gradient(270deg, rgba(255, 255, 255, 1) 4%, rgba(178, 218, 235, 1) 100%);
                    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff", endColorstr="#b2daeb", GradientType=1);
                }

                .animation:after {
                    position: absolute;
                    z-index: 0;
                    top: 0;
                    left: 0;
                    content: '';
                    display: block;
                    width: 100%;
                    height: 100%;
                }

                .animation [class^="animation__"],
                .animation [class*=" animation__"] {
                    position: absolute;
                }

                .please_wait {
                    position: absolute;
                    top: 70%;
                    left: 50%;
                    transform: translate(-50%, 0%);
                    z-index: 100;
                }

                .dep_info {
                    position: absolute;
                    top: 15%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 100;
                }

                .animation__plane {
                    position: absolute;
                    z-index: 1;
                    top: calc(40% - (62px/2));
                    left: calc(50% - (272px/2));
                    width: 17rem;
                    height: 6.2rem;
                    animation: 2s ease-in-out takeOff, 5s ease-in-out infinite alternate flight 2s;
                }

                .animation__plane--shadow {
                    bottom: 1rem;
                    left: calc(54% - (8rem/2));
                    width: 8rem;
                    height: 1rem;
                    border-radius: 50%;
                    background-color: rgba(0, 0, 0, 0.15);
                    animation: 2s ease-in-out takeOffShadow, 5s ease-in-out infinite alternate flightShadow 2s;
                }

                .animation__cloud--front {
                    z-index: 2;
                    top: 50%;
                    left: 20%;
                    width: 8.5rem;
                    height: 3rem;
                    animation: 4s linear infinite cloudFront;
                    fill: #9ed0e6;
                }

                .animation__cloud--middle {
                    top: 22%;
                    left: 75%;
                    width: 6rem;
                    height: 3rem;
                    animation: 5s linear infinite cloudMiddle;
                    fill: #9ed0e6;
                }

                .animation__cloud--back {
                    top: 6%;
                    left: 34%;
                    width: 6rem;
                    height: 3rem;
                    animation: 8s linear infinite cloudBack;
                    fill: #9ed0e6;
                }

                .animation .animation__loader {
                    position: absolute;
                    left: 0;
                    bottom: 3rem;
                    width: 100%;
                    height: 4px;
                    fill: rgba(0, 0, 0, 0.15);
                }

                .animation .animation__loader:after {
                    position: absolute;
                    display: block;
                    content: '';
                    width: 100%;
                    height: 100%;
                    background-color: #cee4e7;
                    overflow: hidden;
                    animation: 1.5s ease-in-out infinite loader;
                }

                @keyframes loader {
                    0% {
                        left: -100%;
                    }
                    100% {
                        left: 100%;
                    }
                }

                @keyframes takeOff {
                    0% {
                        transform: translate(-220%, 110%);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }

                @keyframes takeOffShadow {
                    0% {
                        transform: translate(-440%, 110%);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(0, 0);
                        opacity: 0.8;
                    }
                }

                @keyframes flight {
                    0% {
                        transform: translate(0, 0);
                    }
                    25% {
                        transform: translate(0, 10%);
                    }
                    75% {
                        transform: translate(0, -10%);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }

                @keyframes flightShadow {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.8;
                    }
                    25% {
                        transform: scale(0.9);
                        opacity: 1;
                    }
                    75% {
                        transform: scale(1.1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0.8;
                    }
                }

                @keyframes cloudFront {
                    0% {
                        transform: translate(520%, 0);
                    }
                    100% {
                        transform: translate(-600%, 0);
                    }
                }

                @keyframes cloudMiddle {
                    0% {
                        transform: translate(230%, 0);
                    }
                    100% {
                        transform: translate(-900%, 0);
                    }
                }

                @keyframes cloudBack {
                    0% {
                        transform: translate(910%, 0);
                    }
                    100% {
                        transform: translate(-1000%, 0);
                    }
                }
            </style>




            <div class="top-bar font-weight-bold">
                <div class=" " id="clockdiv"></div>
            </div>


            <div class="bg-modify pt-2 pb-2">
                <div class="container">
                    <div class="modify-search-xs text-center text-white d-block d-lg-none">
                        <h3>
                            <!--<i class="zmdi zmdi-filter-list left-icon show-filter pointer p-1"></i>-->
                            <img src="https://www.sastasafar.com/img/filter.png" alt="SastaSafar" class="left-icon show-filter pointer p-1 m-0" style="border: 1px solid #fff; border-radius: 3px; width: 32px; min-height: 39px;"> USQ <i class="zmdi zmdi-arrow-right text-center show-filter pointer"></i></h3>
                        <h3>XMB
                            <i class="zmdi zmdi-edit right-icon p-1" onclick="if (!window.__cfRLUnblockHandlers) return false; event.stopPropagation();event.preventDefault();$('#edit_form').modal('show')" data-cf-modified-228fe3999d327e492e219f71-=""><!--<br><span style="font-size:10px;">MODIFY</span>--></i>
                        </h3>
                        <span>Sat, 20 Jun  |  Tue, 30 Jun | <b>1</b> Traveller | Economy</span>
                    </div>
                    <div class="clearfix"></div>
                    <div class="row d-none d-lg-block modify-search">
                        <div class="col text-light">
                            <div class="d-flex">
                                <div class="pt-2"><i class="zmdi zmdi-airplane"></i></div>
                                <div class="pt-2 pl-2"><b>Usak</b><span class="search-top-display"> (USQ)</span> - <b>Dubai Bus Station</b> <span class="search-top-display">(XMB)</span></div>
                                <div class="pt-2 pl-4"><i class="zmdi zmdi-calendar"></i></div>
                                <div class="pt-2 pl-2"><span class="search-top-display">Depart on</span> <b>Sat, 20 Jun</b> - <span class="search-top-display">Return on</span> <b>Tue, 30 Jun</b></div>
                                <div class="pt-2 pl-4"><i class="zmdi zmdi-account-circle"></i></div>
                                <div class="pt-2 pl-2"><span class="search-top-display"><b>1</b> Traveller, Economy</span></div>

                                <div class="ml-auto "><button type="button" class="btn btn-danger btn bgshade-2" onclick="if (!window.__cfRLUnblockHandlers) return false; event.stopPropagation();event.preventDefault();$('#edit_form').modal('show')" data-cf-modified-228fe3999d327e492e219f71-=""><i class="zmdi zmdi-edit"></i> Change</button></div>
                                <div class="show-filter btn btn-danger btn bgshade-2 d-lg-none"><i class="zmdi zmdi-filter-list"></i> Filters</div>
                            </div>


                        </div>
                    </div>
                    <div class="row">
                        <div class="clearfix"></div>
                        <div class="col">
                            <hr class="mb-2">

                        </div>
                    </div>
                </div>
            </div>
            <div class="container mb-3">







                <div id="preloader_setup" class="fadeIn animated">
                    <div class="row">
                        <div class="col-3 order-2 order-lg-1" id="filt">


                            <div class="rounded shadow">
                                <div class="filter-header d-lg-none position-sticky" style="top: 0; z-index: 2;">
                                    <h6>Filter</h6>
                                    <div class="filter-bar"><i class="zmdi zmdi-close-circle pointer" style="font-size:25px"></i> </div>
                                </div>
                                <div class="filter-content rounded ">
                                    <div id="filter_nav" class="rounded bg-white" style="overflow:hidden">
                                        <div class="card border-0">
                                            <article class="card-group-item">
                                                <header class="card-header">
                                                    <div class="animated-background" style="width: 100px;"></div>
                                                </header>
                                                <div class="filter-content">
                                                    <div class="card-body">
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article class="card-group-item">
                                                <header class="card-header">
                                                    <div class="animated-background" style="width: 100px;"></div>
                                                </header>
                                                <div class="filter-content">
                                                    <div class="card-body">
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article class="card-group-item">
                                                <header class="card-header">
                                                    <div class="animated-background" style="width: 100px;"></div>
                                                </header>
                                                <div class="filter-content">
                                                    <div class="card-body">
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                    </div>
                                                </div>
                                            </article>
                                            <article class="card-group-item">
                                                <header class="card-header">
                                                    <div class="animated-background" style="width: 100px;"></div>
                                                </header>
                                                <div class="filter-content">
                                                    <div class="card-body">
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                        <div class="animated-background mb-2"></div>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div class="rounded shadow  bg-white border mt-3  p-3 flight-summary" style="overflow: hidden;">
                                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2791086082148359" crossorigin="anonymous" type="228fe3999d327e492e219f71-text/javascript"></script>
                                <!-- SideAds -->
                                <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-2791086082148359" data-ad-slot="6741689396" data-ad-format="vertical" data-full-width-responsive="true"></ins>
                                <script type="228fe3999d327e492e219f71-text/javascript">
                                    (adsbygoogle = window.adsbygoogle || []).push({});
                                </script>
                            </div>

                            <!--<div  class="rounded shadow  bg-white border mt-3   flight-summary" style="overflow: hidden;">-->

                            <img src="/img/SSF_044.jpg?ss" class="w-100 rounded mt-3 detail-shadow">
                            <a href="../hotels?tid=6a3689bc179c0f01210eb8c1&ref=flight_search" target="_blank"><img src="/img/Hotel-Filter-Banner.jpg?tdss" class="img-fluid rounded mt-3 detail-shadow"></a>
                            <!--<a href="https://SastaSafar.visa2fly.com/visa/select-purpose?country=UAE" target="_blank" style="text-decoration: none;"><img src="/img/SS_02.jpg?tdss" class="img-fluid rounded mt-3 detail-shadow"></a>-->

                            <!--</div>-->


                        </div>





                        <div class="col-12 col-lg-9  order-1 order-lg-2">
                            <!--FLIGHTS MATRIX-->
                            <div id="matrix_nav">
                                <div class="animation rounded  mb-3">
                                    <svg id="master-artboard" class="animation__cloud--back" viewBox="0 0 45 18" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                            <path d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z" transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)" />
                        </svg>
                                    <svg id="master-artboard" class="animation__cloud--middle" viewBox="0 0 45 18" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                            <path d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z" transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)" />
                        </svg>
                                    <div class="animation__plane--shadow"></div>
                                    <svg class="animation__plane" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" data-name="svgi-plane"
                                        viewBox="0 0 135.67 49.55">
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" d="M74.663 45.572h-9.106z" class="svgi-plane--stripe3" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="M.75 26.719h23.309z" class="svgi-plane--stripe1" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="M11.23 31.82h22.654z" class="svgi-plane--stripe2" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="m 53.47597,24.263013 h 68.97869 c 6.17785,0 12.47074,6.758518 12.40872,8.67006 -0.05,1.537903 -5.43763,7.036166 -11.72452,7.056809 l -59.599872,0.201269 c -9.092727,0.03097 -23.597077,-5.992662 -22.178652,-11.794378 1.160348,-4.74789 7.862358,-4.13376 12.115634,-4.13376 z" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="M 45.243501,24.351777 37.946312,0.952937 h 7.185155 c 15.37061,20.184725 28.402518,23.28324 28.402518,23.28324 0,0 -27.106129,-0.178562 -28.290484,0.1156 z" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="m 42.699738,18.984597 h 10.627187 c 5.753726,0 5.364609,7.799958 0,7.799958 H 42.998828 c -4.96749,0 -5.574672,-7.799958 -0.29909,-7.799958 z m 33.139939,16.164502 h 29.656893 c 6.62199,0 6.49395,6.577892 0,6.577892 H 75.940707 c -8.658596,0 -8.499549,-6.35598 -0.10103,-6.577892 z m 9.693907,6.664592 h 8.86866 c 4.439332,0 4.309293,7.066099 0,7.066099 h -8.756626 z" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="m 85.55159,42.447431 c 0,0 -5.282585,0.456211 -6.372912,3.263659 1.335401,2.378073 6.397919,2.528767 6.397919,2.528767 z" />
                            <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="m 133.68903,31.07417 h -7.01411 c -1.26938,0 -2.89286,-1.005314 -3.21496,-3.216179 h 7.50225 z" />
                            <ellipse cx="113.564" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="107.56219" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="101.56039" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="95.558594" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="89.556793" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="83.554993" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="77.553192" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="71.551392" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                            <ellipse cx="65.549591" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square" stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                        </svg>
                                    <svg id="master-artboard" class="animation__cloud--front" viewBox="0 0 45 18" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                            <path d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z" transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)" />
                        </svg>
                                    <div class="please_wait text-center">
                                        <h6 class="mb-0">Please Wait...</h6>
                                        <h6 class="font-weight-bold" id="searchBannerText">Searching cheap flights on 100+ consolidators...</h6>
                                    </div>

                                </div>
                                <!--<div class="animation rounded mb-3">
            <svg id="master-artboard" class="animation__cloud--back" viewBox="0 0 45 18" version="1.1"
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="33%" stop-color="rgba(255,103,31,1)" />
                        <stop offset="34%" stop-color="rgba(255,246,242,1)" />
                        <stop offset="65%" stop-color="rgba(240,250,245,1)" />
                        <stop offset="67%" stop-color="rgba(0,177,90,1)" />
                    </linearGradient>
                </defs>
                <path
                    d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z"
                    transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)"
                    fill="url(#myGradient)" />
            </svg>
            <svg id="master-artboard" class="animation__cloud--middle" viewBox="0 0 45 18" version="1.1"
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="33%" stop-color="rgba(255,103,31,1)" />
                        <stop offset="34%" stop-color="rgba(255,246,242,1)" />
                        <stop offset="65%" stop-color="rgba(240,250,245,1)" />
                        <stop offset="67%" stop-color="rgba(0,177,90,1)" />
                    </linearGradient>
                </defs>
                <path
                    d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z"
                    transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)"
                    fill="url(#myGradient)" />
            </svg>
            <div class="animation__plane--shadow"></div>
            <svg class="animation__plane" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#"
                xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:svg="http://www.w3.org/2000/svg" data-name="svgi-plane" viewBox="0 0 135.67 49.55">
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" d="M74.663 45.572h-9.106z"
                    class="svgi-plane--stripe3" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="M.75 26.719h23.309z"
                    class="svgi-plane--stripe1" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1" d="M11.23 31.82h22.654z"
                    class="svgi-plane--stripe2" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1"
                    d="m 53.47597,24.263013 h 68.97869 c 6.17785,0 12.47074,6.758518 12.40872,8.67006 -0.05,1.537903 -5.43763,7.036166 -11.72452,7.056809 l -59.599872,0.201269 c -9.092727,0.03097 -23.597077,-5.992662 -22.178652,-11.794378 1.160348,-4.74789 7.862358,-4.13376 12.115634,-4.13376 z" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1"
                    d="M 45.243501,24.351777 37.946312,0.952937 h 7.185155 c 15.37061,20.184725 28.402518,23.28324 28.402518,23.28324 0,0 -27.106129,-0.178562 -28.290484,0.1156 z" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1"
                    d="m 42.699738,18.984597 h 10.627187 c 5.753726,0 5.364609,7.799958 0,7.799958 H 42.998828 c -4.96749,0 -5.574672,-7.799958 -0.29909,-7.799958 z m 33.139939,16.164502 h 29.656893 c 6.62199,0 6.49395,6.577892 0,6.577892 H 75.940707 c -8.658596,0 -8.499549,-6.35598 -0.10103,-6.577892 z m 9.693907,6.664592 h 8.86866 c 4.439332,0 4.309293,7.066099 0,7.066099 h -8.756626 z" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1"
                    d="m 85.55159,42.447431 c 0,0 -5.282585,0.456211 -6.372912,3.263659 1.335401,2.378073 6.397919,2.528767 6.397919,2.528767 z" />
                <path fill="#fff" stroke="#464646" stroke-linejoin="round" stroke-width="1"
                    d="m 133.68903,31.07417 h -7.01411 c -1.26938,0 -2.89286,-1.005314 -3.21496,-3.216179 h 7.50225 z" />
                <ellipse cx="113.564" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="107.56219" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="101.56039" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="95.558594" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="89.556793" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="83.554993" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="77.553192" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="71.551392" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
                <ellipse cx="65.549591" cy="29.448534" fill="#fff" stroke="#464646" stroke-linecap="square"
                    stroke-linejoin="round" stroke-width="1" rx="1.3354006" ry="1.6400863" />
            </svg>
            <svg id="master-artboard" class="animation__cloud--front" viewBox="0 0 45 18" version="1.1"
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45px" height="18px">
                <defs>
                    <linearGradient id="myGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="rgba(255,103,31,0.6796919451374299)" />
                        <stop offset="50%" stop-color="rgba(217,217,217,1)" />
                        <stop offset="100%" stop-color="rgba(4,106,56,0.7413165949973739)" />
                    </linearGradient>
                </defs>
                <path
                    d="M 58.88372802734375 825.155517578125 C 16.61685562133789 826.1433715820312 57.925209045410156 781.6769409179688 58.883731842041016 781.3507080078125 C 106.25779724121094 731.152099609375 169.17739868164062 692.9862670898438 226.64694213867188 694.6730346679688 C 227.2968292236328 557.091552734375 389.74322509765625 563.0558471679688 425.166748046875 635.9559326171875 C 534.7359619140625 431.2034912109375 793.6226196289062 599.6361694335938 715.956298828125 741.27392578125 C 820.5570068359375 803.94287109375 789.773193359375 826.9736328125 767.21728515625 825.1555786132812 C 394.85125732421875 825.5911865234375 359.5561218261719 823.805908203125 58.88372802734375 825.155517578125 Z"
                    transform="matrix(0.0573558509349823, 0, 0, 0.056244850158691406, -1.3596858978271484, -29.666284561157227)"
                    fill="url(#myGradient)" />
            </svg>
             <div class="animation__loader"></div>
            <div class="please_wait text-center">
                <h6 class="mb-0">Please Wait...</h6>
                <h6 class="font-weight-bold" id="searchBannerText">Searching cheap flights on 100+ consolidators...</h6>
            </div>
        </div>  -->


                                <!--<div class="bg-light p-3 mb-3 bg-white  rounded">
                                    <div class="p-2 text-center">
                                        <i class="zmdi text-primary zmdi-rotate-right zmdi-hc-spin zmdi-hc-5x"></i>
                                        <br><br>
                                        <h3 class="text-primary h5 font-weight-bold mb-1">searching 400+ airlines...</h3>
                                    </div>
                            </div>-->
                                <div class="mb-3">
                                    <div class="bg-light bg-white shadow  rounded">

                                        <!--<img src="/img/seepay1.png" class="img-fluid rounded">-->
                                        <!--  <img src="/img/seepay1_v.png" class="img-fluid rounded">-->
                                        <img src="/img/SSF_022.jpg?sf" class="w-100 rounded">

                                    </div>

                                </div>





                                <div class="bg-light p-3 bg-white shadow  rounded">
                                    <div class="pn-ProductNav_Wrapper">
                                        <nav id="pnProductNav" class="pn-ProductNav" style="overflow: hidden;">
                                            <div id="pnProductNavContents" class="pn-ProductNav_Contents text-center">

                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>
                                                <a href="#" class="pn-ProductNav_Link pb-2 text-dark" aria-selected="true">
                                                        <span class="ml-auto mr-auto">
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style=""></div>
                                                            <div class="animated-background mt-1 ml-auto mr-auto" style="height:20px;"></div>
                                                        </span>
                                                    </a>





                                            </div>
                                        </nav>
                                        <button id="pnAdvancerLeft" class="pn-Advancer pn-Advancer_Left" type="button">
                                            <svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M445.44 38.183L-2.53 512l447.97 473.817 85.857-81.173-409.6-433.23v81.172l409.6-433.23L445.44 38.18z"/></svg>
                                        </button>
                                        <button id="pnAdvancerRight" class="pn-Advancer pn-Advancer_Right" type="button">
                                            <svg class="pn-Advancer_Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 551 1024"><path d="M105.56 985.817L553.53 512 105.56 38.183l-85.857 81.173 409.6 433.23v-81.172l-409.6 433.23 85.856 81.174z"/></svg>
                                        </button>
                                    </div>
                                    <!-- <span id="pnIndicator" class="pn-ProductNav_Indicator" style="display: none;"></span>-->
                                </div>
                            </div>


                            <!--SORT NAV-->
                            <div id="sort_nav">
                                <div class="row">
                                    <div class="col-6">
                                        <div class="animated-background mt-2 width-100" style="width: 100px;"></div>
                                    </div>
                                    <div class="col-6 text-right">
                                        <div class="animated-background mt-2 width-100" style="width: 100px;"></div>
                                    </div>
                                </div>
                            </div>




                            <!--FLIGHTS SECTION-->
                            <div id="flight_nav">
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>
                                <div class="bg-light mt-3 bg-white shadow  rounded" style="overflow:hidden">
                                    <div class="row no-gutters  detail-shadow">
                                        <div class="col-10">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row keel-mom ">
                                                    <div class="col-1">
                                                        <div class="animated-background mt-1 ml-auto mr-auto" style="width: 32px; height: 32px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="col-field time depart">
                                                            <div class="animated-background mt-1" style="width: 80px;"></div>
                                                            <div class="animated-background mt-2" style="width: 80px;"></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-3">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                        <div class="animated-background mt-2  " style="width: 50px;"></div>
                                                    </div>
                                                    <div class="col-4">
                                                        <div class="animated-background mt-1" style="width: 80px;"></div>
                                                        <div class="animated-background mt-2" style="width: 80px;"></div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr class="m-0">
                                            <div class="p-3">
                                                <div class="row">
                                                    <div class="col-12 small">
                                                        <div class="animated-background mt-1 " style="width: 50px;"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="col-2" style="background-color: #eee;">

                                            <div class="d-flex align-items-end flex-column h-100 d-inline-block">
                                                <div class="p-2"></div>
                                                <div class="p-2"></div>
                                                <div class="mt-auto p-3 text-right">

                                                    <div class="animated-background mt-1 " style="width: 80px; height: 25px;"></div>
                                                    <div class="animated-background mt-1 " style="width: 50px;"></div>

                                                    <div class="animated-background mt-1 " style="width: 30px;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style="clear: both;"></div>
                                </div>

                            </div>


                        </div>















                    </div>
                </div>
            </div>









            <div class="bg-dark position-fixed w-100 d-none d-lg-none bg-filt" style="height: 100vh; top: 0; opacity: 0.5; z-index: 2;"></div>





        </div>
        <br>
        <br>
        <br>
        <br>
        <!-- Footer -->



        <style>
            .social_footer_icons {
                width: 55px;
                height: 55px;
                font-size: 1.5rem;
                background: #111;
                border-radius: 50%;
                box-shadow: 0 2px 2px #d1d1d1;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            /* .youtube_footer_icon:hover {
                background: #FF0000;
            }

            .facebook_footer_icon:hover {
                background: #4267B2;
            }

            .instagram_footer_icon:hover {
                background-image: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)
            }

            .linkedin_footer_icon:hover {
                background: #0A66C2;
            } */
        </style>

        <div class="bg-white d-block">
            <div class="container py-3">
                <div class="row ">
                    <div class="col-12 col-md-6 col-lg-5">
                        <p class="font-weight-bold mb-2">Payment Mode</p>
                        <!-- <img src="/img/300px.png" class="img-fluid" alt=""> -->
                        <style type="text/css">
                            .rounded-5 {
                                border-radius: 5px;
                            }
                        </style>
                        <div class="container-fluid px-0">
                            <!-- <div class="row align-items-center no-gutters">
                        <div class="col-2 text-center pr-1">
                            <div class="border rounded-5 p-2 h-custom-2">
                                <img src="/img/footer_svg/visa-icon.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 text-center px-1">
                            <div class="border rounded-5 p-2 h-custom-2">
                                <img src="/img/footer_svg/master-card-icon.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 text-center px-1">
                            <div class="border rounded-5 p-2 h-custom-2">
                                <img src="/img/footer_svg/american-express.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 text-center px-1">
                            <div class="border rounded-5 p-2 h-custom-2">
                                <img src="/img/footer_svg/mobikwik-logo.svg" alt="" class="w-auto img-fluid">
                            </div>
                        </div>
                        <div class="col-2 text-center pl-1">
                            <div class="border rounded-5 p-2 h-custom-2">
                                <img src="/img/footer_svg/phonepe.svg" alt="" class="img-fluid">

                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center no-gutters my-2">
                        <div class="col-2 pr-1 text-center">
                            <div class="border p-2 rounded-5 h-custom-2">
                                <img src="/img/footer_svg/paytm-icon.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 px-1 text-center">
                            <div class="border p-2 rounded-5 h-custom-2">
                                <img src="/img/footer_svg/rupay-logo-icon.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 px-1 text-center">
                            <div class="border p-2 rounded-5 h-custom-2">
                                <img src="/img/footer_svg/bhim-app-icon.svg" alt="" class="img-fluid">
                            </div>
                        </div>
                        <div class="col-2 px-1 text-center">
                            <div class="border p-2 rounded-5 h-custom-2">
                                <img src="/img/footer_svg/google-pay-acceptance-mark-icon.svg" alt="" class="img-fluid w-auto">
                            </div>
                        </div>
                    </div> -->
                            <div class="row no-gutters">
                                <div class="col pr-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/visa-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/paytm-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/phonepe.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/bhim-app-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col pl-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/american-express.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="row no-gutters mt-2">
                                <div class="col-3 pr-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/master-card-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col-2 px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/google-pay-acceptance-mark-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col-3 px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/mobikwik-logo.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                                <div class="col-3 px-1 text-center">
                                    <div class="h-100 border p-2 rounded-5">
                                        <img src="/img/footer_svg/rupay-logo-icon.svg" class="img-fluid w-auto h-custom" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-1 d-none d-lg-block"></div>
                    <div class="col-12 col-md-6 col-lg-6 mt-3 mt-md-0">
                        <p class="font-weight-bold mb-3">Accredited by</p>
                        <!-- <img src="/img/certificate.png" class="img-fluid" alt="">-->
                        <div class="footCertificate">
                            <style>
                                .h-img-responsive {
                                    height: 62px;
                                }

                                .footCertificate .h-img-responsive {
                                    height: 38px;
                                }

                                @media only screen and (max-width: 992px) {
                                    .h-img-responsive {
                                        height: 38px;
                                        margin-bottom: 15px;
                                    }
                                }

                                @media only screen and (max-width: 767px) {
                                    .h-img-responsive {
                                        height: 26px;
                                        margin-bottom: 15px;
                                    }
                                }

                                @media only screen and (max-width: 532px) {
                                    .h-img-responsive {
                                        height: 34px;
                                        margin-bottom: 15px;
                                    }
                                }
                            </style>


                            <a href="https://t.ly/Zib1" class="text-decoration-none"><img src="/img/certificates/google_review.png" alt="" style=" margin-right: 32px;" class="img-fluid h-img-responsive my-2"></a>
                            <a href="javascript:void();" class="text-decoration-none" onclick="if (!window.__cfRLUnblockHandlers) return false; loadCertificateModal('iata');" data-cf-modified-228fe3999d327e492e219f71-=""><img src="/img/certificates/iata.png" alt="" style=" margin-right: 32px;" class="img-fluid h-img-responsive my-2"></a>
                            <a href="javascript:void();" class="text-decoration-none" onclick="if (!window.__cfRLUnblockHandlers) return false; loadCertificateModal('iso');" data-cf-modified-228fe3999d327e492e219f71-=""><img src="/img/certificates/iso.png" alt="" style=" margin-right: 32px;" class="img-fluid h-img-responsive my-2"></a>
                            <!-- <a href="https://www.pcisecuritystandards.org/" target="_blank" class="text-decoration-none"><img src="/img/certificates/pci.png" alt="" style=" margin-right: 32px;" class="img-fluid h-img-responsive"></a> -->
                            <a href="javascript:void();" class="text-decoration-none"><img src="/img/certificates/ssl_secure.png" alt="" style=" margin-right: 32px;" class="img-fluid h-img-responsive my-2"></a>

                            <div class="modal fade" id="certificateModal" tabindex="-1" role="dialog" aria-labelledby="certificateModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-lg" role="document">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="certificateModalLabel">Modal title</h5>
                                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                                        </div>
                                        <div class="modal-body" id="certificateModalBody" style="height: 85vh;">

                                        </div>
                                    </div>
                                </div>
                            </div>

                            <script type="228fe3999d327e492e219f71-text/javascript">
                                // $(document).ready(function(){

                                // })
                                function loadCertificateModal(type = '') {
                                    var filename = (type.trim() == 'iata') ? 'iata_certificate.pdf' : 'iso_certificate.pdf';
                                    // $('#certificateModalBody').html('<iframe src="/company/certificates/'+filename+'" width="100%"  scrolling="no"></iframe>');
                                    var iframeHTML = "<iframe src='/company/certificates/" + filename + "?#toolbar=0&navpanes=0&scrollbar=0' frameborder='0' style='width: 100%; height: 100%; border: none;'></iframe>";

                                    $("#certificateModalBody").html(iframeHTML);
                                    $("#certificateModal").modal("show");
                                    $('#certificateModalLabel').html(type.trim().toUpperCase() + ' Certification');
                                    // $('#certificateModal').modal('show');
                                    // $(".toolbar").remove();
                                }
                            </script>
                        </div>
                    </div>
                </div>
            </div>

            <hr>

            <div class="text-center">
                <p class="m-0 pb-3">&#169; 2020-26 Travelsees. All Rights Reserved.</p>
            </div>
        </div>


        <!-- remove exit to apply old foot html  -->




        </div>




        <!-- FILTER BOX-->


    </form>


    <!-- MODAL SEARCH FORM WINDOW-->
    <div class="modal border-0 fadeInDown animated  " id="edit_form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" data-backdrop="static" data-keyboard="false" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Edit Search</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!--FLIGHTS INPUT FORM-->
                    <div id="flight_form" style="display:none;">
                        <form name="Search_Flights" id="Search_Flights" action="https://www.sastasafar.com/flight/search_new" method="GET">
                            <!--SELECT ROUNDTRIP DATE OPTION-->

                            <div class="row">
                                <div class="col-12 mb-2 mt-2 text-left">




                                    <div class="form-check form-check-inline">
                                        <label class="form-check-label btn-outline-secondary btn btn-sm" style='width:120px;' for="returnDateRequiredYes">
                            <input class="form-check-input" type="radio" name="return_date_new" style="position:relative;top:2px;" id="returnDateRequiredYes" value="y" checked >
                            Round Trip</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <label class="form-check-label btn-outline-secondary btn btn-sm" style='width:120px;' for="returnDateRequiredNo">
                            <input class="form-check-input" type="radio" name="return_date_new"  style="position:relative;top:2px;" id="returnDateRequiredNo" value="n" >
                            One Way</label>
                                    </div>



                                </div>
                            </div>

                            <!-- AIPORTS ROW-->
                            <div class="row">
                                <div class="col">
                                    <div id="form_error"></div>
                                </div>
                            </div>
                            <div class="row">

                                <!--ORIGIN AIRPORT-->
                                <div class="col-6 col-lg-6 mt-2 d-block d-sm-none bg-l" onclick="if (!window.__cfRLUnblockHandlers) return false; originModal()" data-cf-modified-228fe3999d327e492e219f71-="">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="board_id" class="formRow--input-wrapper  active">
                                            <div class="formRow--input "   style="padding:0 !important; margin:0 !important;"><div class="" id="origin_pl_mob" style="font-size:23px;text-align:center; padding:20px; padding-left:30px; font-weight:bold;">USQ</div></div>
                                                <span class="placeholder">FROM</span>
                                                <i class="zmdi zmdi-flight-takeoff zmdi-hc-2x icf mt-2"></i>
                                            </label>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="col-6 col-lg-6 mt-2 d-block d-sm-none bg-l" onclick="if (!window.__cfRLUnblockHandlers) return false; destinationModal()" data-cf-modified-228fe3999d327e492e219f71-="">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="board_id" class="formRow--input-wrapper  active">
                     <div class="formRow--input"  style="padding:0 !important; margin:0 !important;">
                        <div class="" id="destination_pl_mob" style="font-size:23px;text-align:center; padding:20px;  padding-left:30px; font-weight:bold;">XMB</div>
                     </div>
                     <span class="placeholder">TO</span>
                     <i class="zmdi zmdi-flight-land zmdi-hc-2x icf  mt-2"></i>
                  </label>
                                        </div>
                                    </fieldset>
                                </div>
                                <!--ORIGIN AIRPORT-->
                                <div class="col-12 col-lg-12 mt-2 d-none d-sm-block" class="">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="origin" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="origin" id="origin" autocomplete="off" class="formRow--input js-input addclearbutton" value="Usak (USQ)" autocomplete="off" placeholder="From" onClick="if (!window.__cfRLUnblockHandlers) return false; this.select();" data-cf-modified-228fe3999d327e492e219f71-="">
                                            <i class="zmdi zmdi-flight-takeoff zmdi-hc-2x icf"></i>    
                                            <input name="origin_airport" id="origin_airport" type="hidden" value="USQ">
                                        </label>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="d-none d-sm-block"><i id="swapAirport" class="zmdi zmdi-hc-3x zmdi-swap-vertical-circle swapicon" style=" "></i></div>
                                <!--DESTINATION AIRPORT-->
                                <div class="col-12 col-lg-12 mt-2 d-none d-sm-block">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="destination" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="destination" autocomplete="off" id="destination" class="formRow--input js-input addclearbutton" value="Dubai Bus Station (XMB)" autocomplete="off" placeholder="To" onClick="if (!window.__cfRLUnblockHandlers) return false; this.select();" data-cf-modified-228fe3999d327e492e219f71-="">
                                            <i class="zmdi zmdi-flight-land zmdi-hc-2x icf"></i>    
                                            <input name="destination_airport" id="destination_airport" type="hidden" value="XMB">
                                        </label>
                                        </div>
                                    </fieldset>
                                </div>
                                <!-- DATE ROW-->
                                <!--DEPART DATE-->
                                <!--
                            <div class="col-4  mt-3">
                                <fieldset class="formRow">
                                    <div class="formRow--item" >
                                        <label for="return_date" class="formRow--input-wrapper  active">
                                            <div class="formRow--input" style="padding-top:10px; padding-bottom:0px;">
                                            <label class="switch mb-0">
                    <input type="checkbox" name="return_date" value="y" checked>
                    <span class="slider round"></span>
                    </label>
                                            
                                            </div>
                                            
                                            <span class="placeholder">Round Trip</span>
                                            
                                        </label>
                                    </div>
                                </fieldset>
                            </div> 
                            -->
                                <div class="col-6 col-sm-6 col-lg-6 mt-2 date-row" class="col-6 col-sm-6 col-lg-2 mt-2 date-row">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="date" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="trip_start_date" id="dateNew"  readonly class="formRow--input js-input" autocomplete="off" value="20/06/2026" placeholder="Depart Date">
                                            <i class="zmdi zmdi-calendar-alt zmdi-hc-2x icf"></i>    
                                        </label>
                                        </div>
                                    </fieldset>
                                </div>
                                <div class="col-6 col-sm-6 col-lg-6 mt-2 date-row" id="round-trip">
                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="date" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="trip_end_date" id="dateNewRet"  readonly class="formRow--input js-input" autocomplete="off" value="30/06/2026" placeholder="Return Date">
                                            <i class="zmdi zmdi-calendar-alt zmdi-hc-2x icf"></i>  
                                            <a href="javascript:void(0)" tabindex="-1" class="clearbtn " id="round-trip-remove" style=""><div class=""><i class="zmdi zmdi-close-circle text-danger"></i></div></a>
                                            
                                        </label>
                                        </div>
                                    </fieldset>
                                </div>

                                <div class="col-6 col-sm-6 col-lg-6 mt-2 date-row" style="display:none;" id="round-trip-add">
                                    <div class="pt-0 pt-3"><a href="javascript:void(0)" class="text-primary"><i class="zmdi zmdi-calendar-alt "></i> <u class="text-primary">Add Return Date</u></a></div>
                                </div>

                                <!--
                            <div class="col-6">
                                <div class="form-group pr-3 pr-md-0 ">
                                    <label for="startDate" class="control-label">Depart Date</label>
                                    <input type="text" name="trip_start_date" id="startDate" placeholder="mm/dd/yyyy" class="form-control">
                                </div>
                            </div>
                            
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="name" class="cols-sm-2 control-label">Return Date</label>
                                    <input type="text" name="trip_end_date" id="endDate" placeholder="mm/dd/yyyy"  class="form-control">
                                </div>
                            </div>
                            -->
                                <!-- TRAVELLER AND CLASS ROW-->
                                <div class="col-12 col-md-8 mt-3">








                                    <fieldset class="formRow">
                                        <div class="formRow--item">
                                            <label for="traveller" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="traveller" id="traveller" class="formRow--input js-input travellerDetails" autocomplete="off" value="1 Travellers, Economy" type="text" readonly="" placeholder="Travellers & Cabin">
                                            <i class="zmdi zmdi-account-circle zmdi-hc-2x icf"></i>
                                            <i class="zmdi zmdi-chevron-down zmdi-hc-2x arrowDwn"></i>      
                                        </label>
                                        </div>
                                    </fieldset>
                                    <div class='pax-popover' style="position: absolute; ">
                                        <i class="zmdi zmdi-hc-2x zmdi-close" style="position: absolute;right: 3px;top: -3px;z-index:1; " onclick="if (!window.__cfRLUnblockHandlers) return false; $('.pax-popover').hide();" data-cf-modified-228fe3999d327e492e219f71-=""></i>

                                        <div class="d-flex justify-content-start">
                                            <div class="p-2 pt-3 font-weight-bold">Adult</div>
                                            <div class="ml-auto p-2">
                                                <div class="input-group">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary mr-1 p-1" data-type="minus" data-field="adult">
                                                                <i class="zmdi zmdi-hc-2x zmdi-minus-circle"></i>
                                                            </button>
                                                        </span>
                                                    <input type="text" name="adult" readonly="readonly" class="form-control paxCountField" value="1" min="1" max="9">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary ml-1 p-1" data-type="plus" data-field="adult">
                                                                <i class="zmdi zmdi-hc-2x zmdi-plus-circle"></i>
                                                            </button>
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-start">
                                            <div class="p-2 pt-3 font-weight-bold">Child</div>
                                            <div class="ml-auto p-2">
                                                <div class="input-group" style="margin-top:10px;">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary mr-1 p-1" data-type="minus" data-field="child">
                                                                <i class="zmdi zmdi-hc-2x zmdi-minus-circle"></i>
                                                            </button>
                                                        </span>
                                                    <input type="text" name="child" readonly="readonly" class="form-control paxCountField" value="0" min="0" max="6">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary ml-1 p-1" data-type="plus" data-field="child">
                                                                <i class="zmdi zmdi-hc-2x zmdi-plus-circle"></i>
                                                            </button>
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-start">
                                            <div class="p-2 pt-3 font-weight-bold">Infant</div>
                                            <div class="ml-auto p-2">
                                                <div class="input-group" style="margin-top:10px;">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary mr-1 p-1" data-type="minus" data-field="infant">
                                                                <i class="zmdi zmdi-hc-2x zmdi-minus-circle"></i>
                                                            </button>
                                                        </span>
                                                    <input type="text" name="infant" readonly="readonly" class="form-control paxCountField" value="0" min="0" max="6">
                                                    <span class="input-group-btn">
                                                            <button type="button" class="btn operator btn-sm btn-primary ml-1 p-1" data-type="plus" data-field="infant">
                                                                <i class="zmdi zmdi-hc-2x zmdi-plus-circle"></i>
                                                            </button>
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex justify-content-start">
                                            <div class="p-2 pt-3 font-weight-bold">Class</div>
                                            <div class="ml-auto p-2">
                                                <select name="classi" id="classi" class="form-control form-control-sm">
                                                        <option value="economy"  selected="selected">Economy</option>
                                                        <option value="business" >Business</option>
                                                        <option value="first" >First</option>
                                                        <option value="premium_economy" >Premium Economy</option>
                                                    </select>
                                            </div>
                                        </div>
                                        <div class="text-center">
                                            <!--<button class="btn btn-danger bgshade-2 font-weight-bold" type="submit" name="done" onclick="$('.pax-popover').hide();" style="width: 150px;"> Done</button>-->
                                            <input type="button" name="done" class="btn btn-danger bgshade-2 font-weight-bold" onclick="if (!window.__cfRLUnblockHandlers) return false; $('.pax-popover').hide();" style="width: 150px;" value="Done" data-cf-modified-228fe3999d327e492e219f71-="">
                                        </div>
                                    </div>
                                    <input type="hidden" name="adult" id="adult" value="1">
                                    <input type="hidden" name="child" id="child" value="0">
                                    <input type="hidden" name="infant" id="infant" value="0">
                                    <input type="hidden" name="class" id="class" value="economy">
                                    <input type="hidden" name="source" id="source" value="direct">
                                    <input type="hidden" name="pgn" id="pgn" value="results">

                                </div>











                                <!-- 
                            <div class="col-12 col-md-12 mt-3">
                                <div class="form-group">

                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" id="customCheck" name="example1">
                                    <label class="custom-control-label" for="customCheck">Show Me Special Fares <small class="text-danger">(available for 2 hours only)</small></label>
                                </div>

                                </div>
                            </div>
                            -->
                                <div class="col-12 col-md-4 mt-3">
                                    <div class="form-group">
                                        <button class="btn btn-danger  mt-0 btn-block bgshade-2 btn-lg font-weight-bold" type="submit" name="search" id="search_btn_home"> Search</button>
                                    </div>
                                </div>



                            </div>
                        </form>

                    </div>
                    <div id="flight_form_loader" class="text-center">
                        <i class="zmdi zmdi-rotate-right zmdi-hc-spin zmdi-hc-3x"></i>
                    </div>



                </div>
            </div>
        </div>
    </div>


    <!-- MODAL SEARCH FORM WINDOW-->
    <div class="modal border-0 fadeInDown animated  " id="upgrade_form" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Select Your Fare</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                </div>
            </div>
        </div>
    </div>



    <!-- //////////////////// Confirmation Modal \\\\\\\\\\\\\\\\\\\\\\\\\\ -->
    <div class="modal fade" id="ins_web_confirm_modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="verify_detail" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body position-relative">
                    <!-- <button type="button" class="close position-absolute" data-dismiss="modal" aria-label="Close" style="top: 20px; right: 20px;">
                    <span aria-hidden="true">&times;</span>
                </button> -->
                    <!-- <h6 class="mb-3 text-muted">Are you sure you want to buy insurance or not?</h6>
                </div>
                <div class="col-12 mb-3">
                    <div class="d-flex justify-content-center w-100">
                        <button class="btn text-white bgshade-2 mr-2" data-dismiss="modal" onclick="$('input[name=\'buy_insurance\']').prop('checked', true);insurance_checkbox_toggle('y');">Buy</button>
                        <button type="submit" onclick="" class="btn btn-secondary ml-2" data-dismiss="modal" aria-label="Close">No</button>
                    </div>
                </div> -->
                </div>
            </div>
        </div>
    </div>
    <!-- //////////////////// Confirmation Modal \\\\\\\\\\\\\\\\\\\\\\\\\\ -->

    <div class="modal fade " id="detail-morefareModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-body pt-5 pb-4 px-2 position-relative">
                    <button type="button" class="close position-absolute" style="top: 15px; right: 15px;" data-dismiss="modal" aria-label="Close">
                <span class="material-symbols-outlined icon-2x">close</span>
            </button>
                    <div id="morefarediv"></div>
                </div>
            </div>
        </div>
    </div>



    <!-- Modal -->
    <div class="modal fade" id="makeModal" tabindex="-1" role="dialog" aria-labelledby="makeModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title font-weight-bold" id="makeModalLabel">Session Expired</h5>
                </div>
                <div class="modal-body">
                    <div class="text-center">
                        <i class="zmdi zmdi-alert-circle-o zmdi-hc-5x animated infinite wobble zmdi-hc-fw text-danger"></i> <br>
                        <span class="font-weight-bold text-danger">Your session has expired.</span>
                        <br> Please click refresh results.


                    </div>
                </div>
                <div class="modal-footer">
                    <a href="/?startAgain" class="btn btn-danger  bgshade-2">Start Again</a> <button type="button" class="btn btn-danger  bgshade-2" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#Search_Flights').submit();" data-cf-modified-228fe3999d327e492e219f71-="">Refresh Results</button>
                </div>
            </div>
        </div>
    </div>
    <!--<div class="time_div_top " id="clockdiv"></div>-->





    <script src="https://www.sastasafar.com/js/jquery-3.3.1.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/jquery.lazy.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>

    <script src="https://www.sastasafar.com/js/popper.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/bootstrap.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script type="228fe3999d327e492e219f71-text/javascript" src="https://www.sastasafar.com/js/moment.min.js"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>-->
    <script src="https://www.sastasafar.com/js/picker.js?newversion" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/picker.date.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/jquery.easy-autocomplete.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/jquery.validate.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/additional-methods.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/rangeSlider.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/loadingoverlay.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/bootstrap4-input-clearer.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script src="https://www.sastasafar.com/js/owl.carousel.min.js" type="228fe3999d327e492e219f71-text/javascript"></script>
    <script type="228fe3999d327e492e219f71-text/javascript">
        (function(a) {
            a.isScrollToFixed = function(b) {
                return !!a(b).data("ScrollToFixed")
            };
            a.ScrollToFixed = function(d, i) {
                var m = this;
                m.$el = a(d);
                m.el = d;
                m.$el.data("ScrollToFixed", m);
                var c = false;
                var H = m.$el;
                var I;
                var F;
                var k;
                var e;
                var z;
                var E = 0;
                var r = 0;
                var j = -1;
                var f = -1;
                var u = null;
                var A;
                var g;

                function v() {
                    H.trigger("preUnfixed.ScrollToFixed");
                    l();
                    H.trigger("unfixed.ScrollToFixed");
                    f = -1;
                    E = H.offset().top;
                    r = H.offset().left;
                    if (m.options.offsets) {
                        r += (H.offset().left - H.position().left)
                    }
                    if (j == -1) {
                        j = r
                    }
                    I = H.css("position");
                    c = true;
                    if (m.options.bottom != -1) {
                        H.trigger("preFixed.ScrollToFixed");
                        x();
                        H.trigger("fixed.ScrollToFixed")
                    }
                }

                function o() {
                    var J = m.options.limit;
                    if (!J) {
                        return 0
                    }
                    if (typeof(J) === "function") {
                        return J.apply(H)
                    }
                    return J
                }

                function q() {
                    return I === "fixed"
                }

                function y() {
                    return I === "absolute"
                }

                function h() {
                    return !(q() || y())
                }

                function x() {
                    if (!q()) {
                        var J = H[0].getBoundingClientRect();
                        u.css({
                            display: H.css("display"),
                            width: J.width,
                            height: J.height,
                            "float": H.css("float")
                        });
                        cssOptions = {
                            "z-index": m.options.zIndex,
                            position: "fixed",
                            top: m.options.bottom == -1 ? t() : "",
                            bottom: m.options.bottom == -1 ? "" : m.options.bottom,
                            "margin-left": "0px"
                        };
                        if (!m.options.dontSetWidth) {
                            cssOptions.width = H.css("width")
                        }
                        H.css(cssOptions);
                        H.addClass(m.options.baseClassName);
                        if (m.options.className) {
                            H.addClass(m.options.className)
                        }
                        I = "fixed"
                    }
                }

                function b() {
                    var K = o();
                    var J = r;
                    if (m.options.removeOffsets) {
                        J = "";
                        K = K - E
                    }
                    cssOptions = {
                        position: "absolute",
                        top: K,
                        left: J,
                        "margin-left": "0px",
                        bottom: ""
                    };
                    if (!m.options.dontSetWidth) {
                        cssOptions.width = H.css("width")
                    }
                    H.css(cssOptions);
                    I = "absolute"
                }

                function l() {
                    if (!h()) {
                        f = -1;
                        u.css("display", "none");
                        H.css({
                            "z-index": z,
                            width: "",
                            position: F,
                            left: "",
                            top: e,
                            "margin-left": ""
                        });
                        H.removeClass("scroll-to-fixed-fixed");
                        if (m.options.className) {
                            H.removeClass(m.options.className)
                        }
                        I = null
                    }
                }

                function w(J) {
                    if (J != f) {
                        H.css("left", r - J);
                        f = J
                    }
                }

                function t() {
                    var J = m.options.marginTop;
                    if (!J) {
                        return 0
                    }
                    if (typeof(J) === "function") {
                        return J.apply(H)
                    }
                    return J
                }

                function B() {
                    if (!a.isScrollToFixed(H) || H.is(":hidden")) {
                        return
                    }
                    var M = c;
                    var L = h();
                    if (!c) {
                        v()
                    } else {
                        if (h()) {
                            E = H.offset().top;
                            r = H.offset().left
                        }
                    }
                    var J = a(window).scrollLeft();
                    var N = a(window).scrollTop();
                    var K = o();
                    if (m.options.minWidth && a(window).width() < m.options.minWidth) {
                        if (!h() || !M) {
                            p();
                            H.trigger("preUnfixed.ScrollToFixed");
                            l();
                            H.trigger("unfixed.ScrollToFixed")
                        }
                    } else {
                        if (m.options.maxWidth && a(window).width() > m.options.maxWidth) {
                            if (!h() || !M) {
                                p();
                                H.trigger("preUnfixed.ScrollToFixed");
                                l();
                                H.trigger("unfixed.ScrollToFixed")
                            }
                        } else {
                            if (m.options.bottom == -1) {
                                if (K > 0 && N >= K - t()) {
                                    if (!L && (!y() || !M)) {
                                        p();
                                        H.trigger("preAbsolute.ScrollToFixed");
                                        b();
                                        H.trigger("unfixed.ScrollToFixed")
                                    }
                                } else {
                                    if (N >= E - t()) {
                                        if (!q() || !M) {
                                            p();
                                            H.trigger("preFixed.ScrollToFixed");
                                            x();
                                            f = -1;
                                            H.trigger("fixed.ScrollToFixed")
                                        }
                                        w(J)
                                    } else {
                                        if (!h() || !M) {
                                            p();
                                            H.trigger("preUnfixed.ScrollToFixed");
                                            l();
                                            H.trigger("unfixed.ScrollToFixed")
                                        }
                                    }
                                }
                            } else {
                                if (K > 0) {
                                    if (N + a(window).height() - H.outerHeight(true) >= K - (t() || -n())) {
                                        if (q()) {
                                            p();
                                            H.trigger("preUnfixed.ScrollToFixed");
                                            if (F === "absolute") {
                                                b()
                                            } else {
                                                l()
                                            }
                                            H.trigger("unfixed.ScrollToFixed")
                                        }
                                    } else {
                                        if (!q()) {
                                            p();
                                            H.trigger("preFixed.ScrollToFixed");
                                            x()
                                        }
                                        w(J);
                                        H.trigger("fixed.ScrollToFixed")
                                    }
                                } else {
                                    w(J)
                                }
                            }
                        }
                    }
                }

                function n() {
                    if (!m.options.bottom) {
                        return 0
                    }
                    return m.options.bottom
                }

                function p() {
                    var J = H.css("position");
                    if (J == "absolute") {
                        H.trigger("postAbsolute.ScrollToFixed")
                    } else {
                        if (J == "fixed") {
                            H.trigger("postFixed.ScrollToFixed")
                        } else {
                            H.trigger("postUnfixed.ScrollToFixed")
                        }
                    }
                }
                var D = function(J) {
                    if (H.is(":visible")) {
                        c = false;
                        B()
                    } else {
                        l()
                    }
                };
                var G = function(J) {
                    (!!window.requestAnimationFrame) ? requestAnimationFrame(B): B()
                };
                var C = function() {
                    var K = document.body;
                    if (document.createElement && K && K.appendChild && K.removeChild) {
                        var M = document.createElement("div");
                        if (!M.getBoundingClientRect) {
                            return null
                        }
                        M.innerHTML = "x";
                        M.style.cssText = "position:fixed;top:100px;";
                        K.appendChild(M);
                        var N = K.style.height,
                            O = K.scrollTop;
                        K.style.height = "3000px";
                        K.scrollTop = 500;
                        var J = M.getBoundingClientRect().top;
                        K.style.height = N;
                        var L = (J === 100);
                        K.removeChild(M);
                        K.scrollTop = O;
                        return L
                    }
                    return null
                };
                var s = function(J) {
                    J = J || window.event;
                    if (J.preventDefault) {
                        J.preventDefault()
                    }
                    J.returnValue = false
                };
                m.init = function() {
                    m.options = a.extend({}, a.ScrollToFixed.defaultOptions, i);
                    z = H.css("z-index");
                    m.$el.css("z-index", m.options.zIndex);
                    u = a("<div />");
                    I = H.css("position");
                    F = H.css("position");
                    k = H.css("float");
                    e = H.css("top");
                    if (h()) {
                        m.$el.after(u)
                    }
                    a(window).bind("resize.ScrollToFixed", D);
                    a(window).bind("scroll.ScrollToFixed", G);
                    if ("ontouchmove" in window) {
                        a(window).bind("touchmove.ScrollToFixed", B)
                    }
                    if (m.options.preFixed) {
                        H.bind("preFixed.ScrollToFixed", m.options.preFixed)
                    }
                    if (m.options.postFixed) {
                        H.bind("postFixed.ScrollToFixed", m.options.postFixed)
                    }
                    if (m.options.preUnfixed) {
                        H.bind("preUnfixed.ScrollToFixed", m.options.preUnfixed)
                    }
                    if (m.options.postUnfixed) {
                        H.bind("postUnfixed.ScrollToFixed", m.options.postUnfixed)
                    }
                    if (m.options.preAbsolute) {
                        H.bind("preAbsolute.ScrollToFixed", m.options.preAbsolute)
                    }
                    if (m.options.postAbsolute) {
                        H.bind("postAbsolute.ScrollToFixed", m.options.postAbsolute)
                    }
                    if (m.options.fixed) {
                        H.bind("fixed.ScrollToFixed", m.options.fixed)
                    }
                    if (m.options.unfixed) {
                        H.bind("unfixed.ScrollToFixed", m.options.unfixed)
                    }
                    if (m.options.spacerClass) {
                        u.addClass(m.options.spacerClass)
                    }
                    H.bind("resize.ScrollToFixed", function() {
                        u.height(H.height())
                    });
                    H.bind("scroll.ScrollToFixed", function() {
                        H.trigger("preUnfixed.ScrollToFixed");
                        l();
                        H.trigger("unfixed.ScrollToFixed");
                        B()
                    });
                    H.bind("detach.ScrollToFixed", function(J) {
                        s(J);
                        H.trigger("preUnfixed.ScrollToFixed");
                        l();
                        H.trigger("unfixed.ScrollToFixed");
                        a(window).unbind("resize.ScrollToFixed", D);
                        a(window).unbind("scroll.ScrollToFixed", G);
                        H.unbind(".ScrollToFixed");
                        u.remove();
                        m.$el.removeData("ScrollToFixed")
                    });
                    D()
                };
                m.init()
            };
            a.ScrollToFixed.defaultOptions = {
                marginTop: 0,
                limit: 0,
                bottom: -1,
                zIndex: 1000,
                baseClassName: "scroll-to-fixed-fixed"
            };
            a.fn.scrollToFixed = function(b) {
                return this.each(function() {
                    (new a.ScrollToFixed(this, b))
                })
            }
        })(jQuery);
    </script>



    <script type="228fe3999d327e492e219f71-text/javascript">
        //Cancellation Policy related code

        function getCancelPolicy(event, tid, sid, leg) {
            event.preventDefault(); // optional, only if you want to prevent the default behavior
            setTimeout(function() {
                var $btn = event.target;
                $btn.disabled = true;
                var cnlPolicyDiv = "#cancellationPolicy_" + tid + "_" + sid + "_" + leg;
                var rscPolicyDiv = "#reschedulingPolicy_" + tid + "_" + sid + "_" + leg;
                // console.log(cnlPolicyDiv);
                $(cnlPolicyDiv).html('<div class="text-center p-4 text-primary"><i class="zmdi zmdi-rotate-right zmdi-hc-3x zmdi-hc-spin"></i></div>');
                $(rscPolicyDiv).html('');

                $.post("get_all_data.php", {
                    "call": "getCancellation",
                    "tid": tid,
                    "sid": sid,
                    "leg": leg,
                }, function(res) {
                    // console.log(res);
                    //$(cnlPolicyDiv).html(res);
                    // return;
                    res = JSON.parse(res);
                    // console.log(res);
                    $(cnlPolicyDiv).html(res.cancellation);
                    $(rscPolicyDiv).html(res.rescheduling);
                }).fail(function() {
                    $(cnlPolicyDiv).html('<p class="text-danger">Failed to load cancellation policy.</p>');
                }).always(function() {
                    $btn.disabled = false;
                });
            }, 100); // use setTimeout to allow tab-switching before heavy JS
        }


        function coupon_app_all() {
            $('#CouponModal').modal('show');

            setTimeout(function() {
                $('.coupon_app_all').html('<h4 class="text-success" style="font-weight: bold; "><span class="coupon_app_all"><br>Done..</span></h4>');
            }, 1000);
            setTimeout(function() {
                $('#CouponModal').modal('hide');
            }, 1500);

        }

        function originModal() {
            $('#originModal').modal('show', {
                keyboard: false
            });
            setTimeout(function() {
                document.activeElement.blur();
                $('#origin_mob').focus();
            }, 600)
        }

        function destinationModal() {
            $('#destinationModal').modal('show');
            setTimeout(function() {
                document.activeElement.blur();
                $('#destination_mob').focus();
            }, 600)
        }

        function display_modal(title, message) {
            $("#modalLoadAny").modal("show");
            $('#modalLoadAny .modal-title').show().html(title);
            $('#modalLoadAny .modal-body').show().html(message);
        }

        $.validator.setDefaults({
            submitHandler: function(form) {
                $(form).submit();
            }
        });


        //New Insurance Template
        //End Insurace Template  

        //DEFAULT FUNCTIONS        
        $(document).ready(function() {
            $(function() {
                $('.addclearbutton').clearer({
                    clearHtml: '<i class="zmdi zmdi-close-circle"></i>',
                    cssClass: '',
                    focusable: true
                });
            });
            //INPUT DESIGN    
            var $inputItem = $(".js-inputWrapper");
            $inputItem.length && $inputItem.each(function() {
                var $this = $(this),
                    $input = $this.find(".formRow--input"),
                    placeholderTxt = $input.attr("placeholder"),
                    $placeholder;
                $input.after('<span class="placeholder">' + placeholderTxt + "</span>"), $input.attr("placeholder", ""), $placeholder = $this.find(".placeholder"), $input.val().length ? $this.addClass("active") : $this.removeClass("active"), $input.on("focusout ", function() {
                    $input.val().length ? $this.addClass("active") : $this.removeClass("active")
                }).on("focus change", function() {
                    $this.addClass("active")
                })
            });

            /* var t;t='n';$(function() {$.exitIntent('enable');$(document).bind('exitintent', function() {if(t=='n'){$("#phone_booking").modal("show");t='y';}});}); */

        });


        $(document).ready(function() {
            //if ($(window).width() > 767) $('.body-mains').addClass('d-none');
            $('.owl-carousel-mobile').owlCarousel({
                center: false,
                items: 1.5,
                loop: true,
                margin: 10,
                mouseDrag: false
            });
            $(document).on('click', '.offer-btn', function() {
                type = $(this).val();
                $('.owl-carousel-mobile').addClass('d-none');
                if ($(this).val() == 'flight') $('#flight').fadeIn('slow').removeClass('d-none');
                if ($(this).val() == 'hotel') $('#hotel').fadeIn('slow').removeClass('d-none');
                if ($(this).val() == 'all') $('#all').fadeIn('slow').removeClass('d-none');
                $(this).parent().find('.btn-primary').removeClass('btn-primary').addClass('btn-transparent');
                $(this).removeClass('btn-transparent').addClass('btn-primary');
            })
            // $('.code').on('click', function(){
            //     $(this).find('b').select(true);
            // })
        })
        $(document).on('click', ".code", function() {
            var textToCopy = $(this).find('b').text();
            var tempTextarea = $('<textarea>');
            $(this).parent().append(tempTextarea);
            tempTextarea.val(textToCopy).select();
            document.execCommand('copy');
            tempTextarea.remove();
            // console.log('copied');
            $(this).find('b').html('Copied!');
            setTimeout(() => {
                $(this).find('b').html(textToCopy);
            }, 500);
        });


        function fillFormAndShowDate(o, oa, d, da) {

            $("#origin").val(o);
            $("#origin_airport").val(oa);
            $("#origin_pl_mob").html(oa);
            $("#origin_mob").val(o);



            $("#origin").focus();

            $("#destination").val(d);
            $("#destination_airport").val(da);
            $("#destination_pl_mob").html(da);
            $("#destination_mob").val(d);
            $("#destination").focus();
            $("#dateNew").focus();


            //$("#date").focus();

        }


        $(document).ready(function() {
            $('#recent_searches_cookies').owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                autoplay: true,
                responsive: {
                    0: {
                        items: 2
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 5
                    }
                }
            })
            $('.owl-carousel-head').owlCarousel({
                loop: true,
                margin: 20,
                nav: false,
                navText: ["<i class='zmdi zmdi-chevron-left'></i>", "<i class='zmdi zmdi-chevron-right'></i>"],
                autoplay: true,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 3
                    }
                }
            });
            $('.owl-carousel-head2').owlCarousel({
                loop: true,
                margin: 20,
                nav: false,
                navText: ["<i class='zmdi zmdi-chevron-left'></i>", "<i class='zmdi zmdi-chevron-right'></i>"],
                autoplay: true,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 4
                    }
                }
            });

            $('.owl-carousel-head1').owlCarousel({
                loop: true,
                margin: 20,
                nav: false,
                navText: ["<i class='zmdi zmdi-chevron-left'></i>", "<i class='zmdi zmdi-chevron-right'></i>"],
                autoplay: true,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 3
                    }
                }
            });

            $("#bus_form_loader").hide();
            $("#bus_form").show();

            $("#flight_form_loader").hide();
            $("#flight_form").show();

            var d = new Date();
            var year = d.getFullYear();
            var month = d.getMonth();
            var day = d.getDate();
            var c = new Date(year + 1, month, day);

            ddatpick = '';
            rdatpick = '';


            function doRadioFix() {
                var val_chk = $('input[name="return_date_new"]:checked').val();
                if (val_chk == 'y') {
                    $('#round-trip').show();
                    $('#round-trip-remove').show();
                    $('#round-trip-add').hide();
                } else {
                    $('#round-trip').hide();
                    $('#round-trip-remove').hide();
                    $('#round-trip-add').show();
                }
            }

            $('input[name="return_date_new"]').change(function() {
                doRadioFix();
            });

            doRadioFix();

            $("#round-trip-add").on('click', function() {
                $("#returnDateRequiredYes").prop("checked", true);
                $('#round-trip-remove').toggle();
                $('#round-trip').toggle();
                $('#round-trip-add').toggle();
            })
            $("#round-trip-remove").on('click', function() {
                $("#returnDateRequiredNo").prop("checked", true);
                $('#round-trip-remove').toggle();
                $('#round-trip').toggle();
                $('#round-trip-add').toggle();
            })

            if ($('#dateNew').length) {

                ddatpick = $('#dateNew').pickadate({
                    format: 'dd/mm/yyyy',
                    min: d,
                    max: c,
                    container: "body",
                    today: "",
                    clear: "",
                    onClose: function() {}
                });
                picker1 = ddatpick.pickadate('picker');

                rdatpick = $('#dateNewRet').pickadate({
                    format: 'dd/mm/yyyy',
                    min: d,
                    max: c,
                    today: "",
                    clear: "",
                    container: "body"
                });
                picker2 = rdatpick.pickadate('picker');

                pick1res = [];
                picker1.on({
                    open: function() {


                        $(".picker__day--infocus div.text-success").remove()
                        a_ai = $("#origin_airport").val();
                        b_ai = $("#destination_airport").val();
                        if (a_ai != "" && b_ai != "") {
                            $.ajax({
                                url: "/calender_fare?ori=" + a_ai + "&des=" + b_ai
                            }).done(function(res) {
                                pick1res = res;
                                picker1.render();
                            });



                        } else {
                            pick1res = [];
                        }




                    },
                    close: function() {
                        //console.log('Closed now')
                    },
                    render: function() {


                        //a_ai=$("#origin_airport").val();        
                        // b_ai=$("#destination_airport").val();   
                        // if(a_ai!="" && b_ai!="")
                        // {


                        var result = [];
                        $.each(pick1res, function(key, value) {
                            result[key] = value;
                        });
                        //for(var i in res)
                        //result.push([i, res[i]]);

                        // console.log(result);

                        $("#dateNew_root .picker__day--infocus").each(function() {

                            var aria_l = $(this).attr("aria-label");
                            var aria_i = $(this).attr("id");
                            //console.log(result[aria_l]);

                            if (result.hasOwnProperty(aria_l))
                                $("#" + aria_i).append('<div class="text-success" style="font-size:12px; line-height:12px;">' + result[aria_l] + '<div>');

                        });





                        //$(".picker__day--infocus").append('<br><span><i class="zmdi zmdi-rotate-right zmdi-hc-spin" style="font-size:10px; line-height:12px;"></i><span>');

                        //  }
                    },
                    stop: function() {
                        //console.log('See ya')
                    },
                    set: function(thingSet) {
                        //  console.log('Set stuff:', thingSet)


                    }
                })
                pick2res = [];
                picker2.on({
                    open: function() {


                        a_ai = $("#origin_airport").val();
                        b_ai = $("#destination_airport").val();
                        if (a_ai != "" && b_ai != "") {
                            $.ajax({
                                url: "/calender_fare?ori=" + b_ai + "&des=" + a_ai
                            }).done(function(res) {
                                pick2res = res;
                                picker2.render();
                            });



                        } else {
                            pick2res = [];
                        }




                    },
                    close: function() {
                        //console.log('Closed now')
                    },
                    render: function() {


                        //a_ai=$("#origin_airport").val();        
                        //b_ai=$("#destination_airport").val();   
                        //if(a_ai!="" && b_ai!="")
                        //{


                        var result = [];
                        $.each(pick2res, function(key, value) {
                            result[key] = value;
                        });
                        //for(var i in res)
                        //result.push([i, res[i]]);

                        // console.log(result);

                        $("#dateNewRet_root .picker__day--infocus").each(function() {

                            var aria_l = $(this).attr("aria-label");
                            var aria_i = $(this).attr("id");
                            //console.log(result[aria_l]);

                            if (result.hasOwnProperty(aria_l))
                                $("#" + aria_i).append('<div class="text-success" style="font-size:12px; line-height:12px;">' + result[aria_l] + '<div>');

                        });





                        //$(".picker__day--infocus").append('<br><span><i class="zmdi zmdi-rotate-right zmdi-hc-spin" style="font-size:10px; line-height:12px;"></i><span>');

                        //}
                    },
                    stop: function() {
                        //console.log('See ya')
                    },
                    set: function(thingSet) {
                        //  console.log('Set stuff:', thingSet)


                    }
                })


                if (picker1.get('value')) {
                    picker2.set('min', picker1.get('select'))
                }



                picker1.on('set', function(event) {
                    if (event.select) {
                        var d1 = picker1.get('select');
                        var d2 = picker2.get('select');

                        if (d1.pick > d2.pick) {
                            picker2.set('select', picker1.get('select'));
                        }

                        picker2.set('min', picker1.get('select'));
                    }
                });

            }

            const getFormattedDate = t => {
                const d = new Date();
                if (t === 'tomorrow') d.setDate(d.getDate() + 1);
                return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
                    .map(n => String(n).padStart(2, '0')).join('/');
            };

            $('#dateNewBus').on('change', function() {
                const val = $(this).val();
                const today = getFormattedDate('today');
                const tomorrow = getFormattedDate('tomorrow');
                $('.quickDate').removeClass('active');
                if (val === today) $('#quickDateToday').addClass('active');
                else if (val === tomorrow) $('#quickDateTomorrow').addClass('active');
            });

            if ($('#dateNewBus').length) {
                ddatpick = $('#dateNewBus').pickadate({
                    format: 'dd/mm/yyyy',
                    min: d,
                    max: c,
                    container: "body",
                    today: "",
                    clear: "",
                    onClose: function() {}
                });
                picker1 = ddatpick.pickadate('picker');


                var bs1 = "";
                var bs2 = "";
                bs1 = $("#departbus_id").val();
                bs2 = $("#arrivebus_id").val();

                bus_ori = "";
                bus_des = "";

                bus_ori = {
                    url: function(phrase) {
                        return "/bus/services.php?phrase=" + phrase + "&format=json";
                    },
                    requestDelay: 500,
                    ajaxSettings: {
                        method: "POST",
                        beforeSend: function() {
                            $("#departbus").addClass("ui-autocomplete-loading")
                        },
                        complete: function() {
                            $("#departbus").removeClass("ui-autocomplete-loading")
                        }
                    },
                    getValue: "name",
                    minCharNumber: 0,
                    list: {
                        match: {
                            enabled: false
                        },
                        onSelectItemEvent: function() {
                            var index = $("#departbus").getSelectedItemData().ids;
                            $("#departbus_id").val(index).trigger("change");
                        },
                        onHideListEvent: function() {}
                    },
                    template: {
                        type: "custom",
                        method: function(value, item) {
                            return item.name;
                        }
                    }


                    ,
                    data: []

                };
                bus_des = {
                    url: function(phrase) {
                        return "/bus/services.php?phrase=" + phrase + "&format=json";
                    },
                    requestDelay: 500,
                    ajaxSettings: {
                        method: "POST",
                        beforeSend: function() {
                            $("#arrivebus").addClass("ui-autocomplete-loading")
                        },
                        complete: function() {
                            $("#arrivebus").removeClass("ui-autocomplete-loading")
                        }
                    },
                    getValue: "name",
                    minCharNumber: 0,
                    list: {
                        match: {
                            enabled: false
                        },
                        onSelectItemEvent: function() {
                            var index = $("#arrivebus").getSelectedItemData().ids;
                            $("#arrivebus_id").val(index).trigger("change");
                        },
                        onHideListEvent: function() {
                            if ($("#arrivebus_id").val() != "") {
                                if (b != $("#arrivebus_id").val()) {
                                    b = $("#arrivebus_id").val();
                                }
                            }
                        }
                    },
                    template: {
                        type: "custom",
                        method: function(value, item) {
                            return item.name
                        }
                    }

                    ,
                    data: []
                };


                $("#departbus").easyAutocomplete(bus_ori);
                $("#arrivebus").easyAutocomplete(bus_des);

                $("#departbus").keypress(function() {
                    $("#departbus_id").val("");
                });
                $("#arrivebus").keypress(function() {
                    $("#arrivebus_id").val("");
                });


                $("#departbus").focus(function() {
                    if ($("#departbus").val() == "") {
                        $("#departbus_id").val("");
                    }
                });
                $("#arrivebus").focus(function() {
                    if ($("#arrivebus").val() == "") {
                        $("#destination_airport_id").val("");
                    }
                });

            }

            // $("#pick_date").caleran({singleDate:!0,showFooter:!1,startOnMonday:!1,showHeader:false,minDate:moment(),maxDate:moment().add(1,'year'),showButtons:!1,autoAlign:!0,autoCloseOnSelect:!0,isHotelBooking:!0,format:"DD/MM/YYYY",startDate:$("#startDate").val(),endDate:$("#endDate").val(),onafterselect:function(caleran,startDate,endDate){$("#pickup_start_date").val(moment(startDate).format('DD/MM/YYYY'))}})
            //$("#drop_date").caleran({singleDate:!0,showFooter:!1,startOnMonday:!1,showHeader:false,minDate:moment(),maxDate:moment().add(1,'year'),showButtons:!1,autoAlign:!0,autoCloseOnSelect:!0,isHotelBooking:!0,format:"DD/MM/YYYY",startDate:$("#startDate").val(),endDate:$("#endDate").val(),onafterselect:function(caleran,startDate,endDate){$("#dropoff_end_date").val(moment(startDate).format('DD/MM/YYYY'))}})

            /*SEARCH FORM FUNCTION START*/
            //CALENDAR    

            // $("#date").caleran({showFooter:!1,startOnMonday:!1,Date:moment(),startDate:$("#startDate").val(),endDate:$("#endDate").val(),minDate:moment(),maxDate:moment().add(1,'year'),showButtons:!1,autoAlign:!1,autoCloseOnSelect:!0,isHotelBooking:!0,format:"DD/MM/YYYY",oninit:function (){$(".date-row span").html('Depart & Return Date')},onafterselect:function(caleran,startDate,endDate){$("#startDate").val(moment(startDate).format('DD/MM/YYYY'));$("#endDate").val(moment(endDate).format('DD/MM/YYYY'))}});var instance=$("#date").data("caleran");



            // $('input[name="return_date"]').change(function(){if(this.checked){$("#date").data("caleran").destroy();$("#date").caleran({singleDate:!1,showFooter:!1,startOnMonday:!1,minDate:moment(),maxDate:moment().add(1,'year'),showButtons:!1,autoAlign:!0,autoCloseOnSelect:!0,isHotelBooking:!0,format:"DD/MM/YYYY",startDate:$("#startDate").val(),endDate:$("#endDate").val(),oninit:function (){$(".date-row span").html('Depart & Return Date')},onafterselect:function(caleran,startDate,endDate){$("#startDate").val(moment(startDate).format('DD/MM/YYYY'));$("#endDate").val(moment(endDate).format('DD/MM/YYYY'))}

            //})}else{$("#date").data("caleran").destroy();$("#date").caleran({singleDate:!0,showFooter:!1,startOnMonday:!1,minDate:moment(),maxDate:moment().add(1,'year'),showButtons:!1,autoAlign:!0,autoCloseOnSelect:!0,isHotelBooking:!0,format:"DD/MM/YYYY",startDate:$("#startDate").val(),endDate:$("#endDate").val(),oninit:function (){$(".date-row span").html('Depart Date')},onafterselect:function(caleran,startDate,endDate){$("#startDate").val(moment(startDate).format('DD/MM/YYYY'))}})}})




            var a = "";
            var b = "";
            a = $("#origin_airport").val();
            b = $("#destination_aiport").val();

            options_ori = "";
            options_ori_mob = "";
            options_des = "";
            options_des_mob = "";


            function addEllipsisToLongSentences(text, max, length) {

                if (text.length > max) {
                    return text.slice(0, length) + '...';
                } else {
                    return text;
                }
            }


            options_ori = {
                url: function(phrase) {
                    return "/services.php?phrase=" + phrase + "&format=json";
                },
                requestDelay: 500,
                ajaxSettings: {
                    method: "POST",
                    beforeSend: function() {
                        $("#origin").addClass("ui-autocomplete-loading")
                    },
                    complete: function() {
                        $("#origin").removeClass("ui-autocomplete-loading")
                    }
                },
                getValue: "View",
                minCharNumber: 0,
                list: {
                    match: {
                        enabled: false
                    },
                    onSelectItemEvent: function() {
                        var index = $("#origin").getSelectedItemData().Airport_Code;
                        $("#origin_airport").val(index).trigger("change");
                        $("#origin_pl_mob").html(index)
                    },
                    onHideListEvent: function() {}
                },
                template: {
                    type: "custom",
                    method: function(value, item) {
                        return '<div class="d-flex p-1 pl-2 pr-2 pb-0" style="border-bottom: solid 1px #ccc;"><div class="p-0"><img src="/img/flags/4x3/' + item.Country_Code + '.png" width="20" style="margin-right:10px;"></div><div class="p-0">' + item.City_Name + ', ' + item.Country_Name + '<br><span class="text-muted small">' + addEllipsisToLongSentences(item.Airport_Name, 38, 35) + '</div><div class="ml-auto p-0"><span style="font-size:15px; width:60px; text-align:center; margin-top:5px; padding:3px; font-weight:bold; display:inline-block; border: solid 1px #ccc; ">' + item.Airport_Code + '</span></div></div>'
                    }
                }


                // function(value, item) {return "<img src='/img/flags/4x3/"+item.Country_Code+".png' width='20' style='margin-right:10px;'><b>" + item.Airport_Code + "</b> " + item.City_Name + ", " + item.Country_Name;}}


                ,
                data: [{
                    "Airport_Name": "Indira Gandhi International Airport",
                    "Airport_Code": "DEL",
                    "City_Name": "New Delhi",
                    "View": "New Delhi (DEL)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chhatrapati Shivaji International Airport",
                    "Airport_Code": "BOM",
                    "City_Name": "Mumbai",
                    "View": "Mumbai (BOM)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Kempegowda International Airport",
                    "Airport_Code": "BLR",
                    "City_Name": "Bangalore",
                    "View": "Bangalore (BLR)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Netaji Subhash Chandra Bose International Airport",
                    "Airport_Code": "CCU",
                    "City_Name": "Kolkata",
                    "View": "Kolkata (CCU)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Dabolim Airport",
                    "Airport_Code": "GOI",
                    "City_Name": "Goa",
                    "View": "Goa (GOI)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Rajiv Gandhi International Airport",
                    "Airport_Code": "HYD",
                    "City_Name": "Hyderabad",
                    "View": "Hyderabad (HYD)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chennai International Airport",
                    "Airport_Code": "MAA",
                    "City_Name": "Madras",
                    "View": "Madras (MAA)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Singapore Changi Airport",
                    "Airport_Code": "SIN",
                    "City_Name": "Singapore",
                    "View": "Singapore (SIN)",
                    "Country_Name": "Singapore",
                    "Country_Code": "sg"
                }, {
                    "Airport_Name": "Dubai International Airport",
                    "Airport_Code": "DXB",
                    "City_Name": "Dubai",
                    "View": "Dubai (DXB)",
                    "Country_Name": "United Arab Emirates",
                    "Country_Code": "ae"
                }, {
                    "Airport_Name": "Suvarnabhumi Airport",
                    "Airport_Code": "BKK",
                    "City_Name": "Bangkok",
                    "View": "Bangkok (BKK)",
                    "Country_Name": "Thailand",
                    "Country_Code": "th"
                }, {
                    "Airport_Name": "Tribhuvan International Airport",
                    "Airport_Code": "KTM",
                    "City_Name": "Kathmandu",
                    "View": "Kathmandu (KTM)",
                    "Country_Name": "Nepal",
                    "Country_Code": "np"
                }]

            };


            options_ori_mob = {
                url: function(phrase) {
                    return "/services.php?phrase=" + phrase + "&format=json";
                },
                requestDelay: 500,
                ajaxSettings: {
                    method: "POST",
                    beforeSend: function() {
                        $("#origin_mob").addClass("ui-autocomplete-loading")
                    },
                    complete: function() {
                        $("#origin_mob").removeClass("ui-autocomplete-loading")
                    }
                },
                getValue: "View",
                minCharNumber: 0,
                list: {
                    match: {
                        enabled: false
                    },
                    onSelectItemEvent: function() {
                        var index = $("#origin_mob").getSelectedItemData().Airport_Code;
                        $("#origin_pl_mob").html(index);
                        $("#origin_airport").val(index).trigger("change");
                        $("#origin").val($("#origin_mob").val()).trigger("change");
                    },
                    onChooseEvent: function() {
                        $("#originModal").modal('hide');
                        setTimeout(function() {
                            document.activeElement.blur();
                        }, 100)
                    },
                    onHideListEvent: function() {}
                },
                template: {
                    type: "custom",
                    method: function(value, item) {
                        return '<div class="d-flex p-1 pl-2 pr-2 pb-0 cityAirportFont" style="border-bottom: solid 1px #ccc;"><div class="p-0"><img src="/img/flags/4x3/' + item.Country_Code + '.png" width="20" style="margin-right:10px;"></div><div class="p-0">' + item.City_Name + ', ' + addEllipsisToLongSentences(item.Country_Name, 18, 15) + '<br><span class="text-muted small">' + addEllipsisToLongSentences(item.Airport_Name, 27, 24) + '</div><div class="ml-auto p-0"><span style="font-size:15px; width:60px; text-align:center; margin-top:5px; padding:3px; font-weight:bold; display:inline-block; border: solid 1px #ccc; ">' + item.Airport_Code + '</span></div></div>'
                    }
                }


                ,
                data: [{
                    "Airport_Name": "Indira Gandhi International Airport",
                    "Airport_Code": "DEL",
                    "City_Name": "New Delhi",
                    "View": "New Delhi (DEL)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chhatrapati Shivaji International Airport",
                    "Airport_Code": "BOM",
                    "City_Name": "Mumbai",
                    "View": "Mumbai (BOM)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Kempegowda International Airport",
                    "Airport_Code": "BLR",
                    "City_Name": "Bangalore",
                    "View": "Bangalore (BLR)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Netaji Subhash Chandra Bose International Airport",
                    "Airport_Code": "CCU",
                    "City_Name": "Kolkata",
                    "View": "Kolkata (CCU)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Dabolim Airport",
                    "Airport_Code": "GOI",
                    "City_Name": "Goa",
                    "View": "Goa (GOI)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Rajiv Gandhi International Airport",
                    "Airport_Code": "HYD",
                    "City_Name": "Hyderabad",
                    "View": "Hyderabad (HYD)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chennai International Airport",
                    "Airport_Code": "MAA",
                    "City_Name": "Madras",
                    "View": "Madras (MAA)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Singapore Changi Airport",
                    "Airport_Code": "SIN",
                    "City_Name": "Singapore",
                    "View": "Singapore (SIN)",
                    "Country_Name": "Singapore",
                    "Country_Code": "sg"
                }, {
                    "Airport_Name": "Dubai International Airport",
                    "Airport_Code": "DXB",
                    "City_Name": "Dubai",
                    "View": "Dubai (DXB)",
                    "Country_Name": "United Arab Emirates",
                    "Country_Code": "ae"
                }, {
                    "Airport_Name": "Suvarnabhumi Airport",
                    "Airport_Code": "BKK",
                    "City_Name": "Bangkok",
                    "View": "Bangkok (BKK)",
                    "Country_Name": "Thailand",
                    "Country_Code": "th"
                }, {
                    "Airport_Name": "Tribhuvan International Airport",
                    "Airport_Code": "KTM",
                    "City_Name": "Kathmandu",
                    "View": "Kathmandu (KTM)",
                    "Country_Name": "Nepal",
                    "Country_Code": "np"
                }]

            };





            options_des = {
                url: function(phrase) {
                    return "/services.php?phrase=" + phrase + "&format=json";
                },
                requestDelay: 500,
                ajaxSettings: {
                    method: "POST",
                    beforeSend: function() {
                        $("#destination").addClass("ui-autocomplete-loading")
                    },
                    complete: function() {
                        $("#destination").removeClass("ui-autocomplete-loading")
                    }
                },
                getValue: "View",
                minCharNumber: 0,
                list: {
                    match: {
                        enabled: false
                    },
                    onSelectItemEvent: function() {
                        var index = $("#destination").getSelectedItemData().Airport_Code;
                        $("#destination_airport").val(index).trigger("change");
                        $("#destination_pl_mob").html(index)
                    },
                    onHideListEvent: function() {
                        if ($("#destination_airport").val() != "") {
                            if (b != $("#destination_airport").val()) {
                                b = $("#destination_airport").val();
                            }
                        }
                    }
                },
                template: {
                    type: "custom",
                    method: function(value, item) {
                        return '<div class="d-flex p-1 pl-2 pr-2 pb-0" style="border-bottom: solid 1px #ccc;"><div class="p-0"><img src="/img/flags/4x3/' + item.Country_Code + '.png" width="20" style="margin-right:10px;"></div><div class="p-0">' + item.City_Name + ', ' + item.Country_Name + '<br><span class="text-muted small">' + addEllipsisToLongSentences(item.Airport_Name, 38, 35) + '</div><div class="ml-auto p-0"><span style="font-size:15px; width:60px; text-align:center; margin-top:5px; padding:3px; font-weight:bold; display:inline-block; border: solid 1px #ccc; ">' + item.Airport_Code + '</span></div></div>'
                    }
                }

                ,
                data: [{
                    "Airport_Name": "Indira Gandhi International Airport",
                    "Airport_Code": "DEL",
                    "City_Name": "New Delhi",
                    "View": "New Delhi (DEL)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chhatrapati Shivaji International Airport",
                    "Airport_Code": "BOM",
                    "City_Name": "Mumbai",
                    "View": "Mumbai (BOM)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Kempegowda International Airport",
                    "Airport_Code": "BLR",
                    "City_Name": "Bangalore",
                    "View": "Bangalore (BLR)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Netaji Subhash Chandra Bose International Airport",
                    "Airport_Code": "CCU",
                    "City_Name": "Kolkata",
                    "View": "Kolkata (CCU)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Dabolim Airport",
                    "Airport_Code": "GOI",
                    "City_Name": "Goa",
                    "View": "Goa (GOI)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Rajiv Gandhi International Airport",
                    "Airport_Code": "HYD",
                    "City_Name": "Hyderabad",
                    "View": "Hyderabad (HYD)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chennai International Airport",
                    "Airport_Code": "MAA",
                    "City_Name": "Madras",
                    "View": "Madras (MAA)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Singapore Changi Airport",
                    "Airport_Code": "SIN",
                    "City_Name": "Singapore",
                    "View": "Singapore (SIN)",
                    "Country_Name": "Singapore",
                    "Country_Code": "sg"
                }, {
                    "Airport_Name": "Dubai International Airport",
                    "Airport_Code": "DXB",
                    "City_Name": "Dubai",
                    "View": "Dubai (DXB)",
                    "Country_Name": "United Arab Emirates",
                    "Country_Code": "ae"
                }, {
                    "Airport_Name": "Suvarnabhumi Airport",
                    "Airport_Code": "BKK",
                    "City_Name": "Bangkok",
                    "View": "Bangkok (BKK)",
                    "Country_Name": "Thailand",
                    "Country_Code": "th"
                }, {
                    "Airport_Name": "Tribhuvan International Airport",
                    "Airport_Code": "KTM",
                    "City_Name": "Kathmandu",
                    "View": "Kathmandu (KTM)",
                    "Country_Name": "Nepal",
                    "Country_Code": "np"
                }]
            };

            options_des_mob = {
                url: function(phrase) {
                    return "/services.php?phrase=" + phrase + "&format=json";
                },
                requestDelay: 500,
                ajaxSettings: {
                    method: "POST",
                    beforeSend: function() {
                        $("#destination_mob").addClass("ui-autocomplete-loading")
                    },
                    complete: function() {
                        $("#destination_mob").removeClass("ui-autocomplete-loading")
                    }
                },
                getValue: "View",
                minCharNumber: 0,
                list: {
                    match: {
                        enabled: false
                    },
                    onSelectItemEvent: function() {
                        var index = $("#destination_mob").getSelectedItemData().Airport_Code;
                        $("#destination_pl_mob").html(index);
                        $("#destination_airport").val(index).trigger("change");
                        $("#destination").val($("#destination_mob").val()).trigger("change");
                    },
                    onChooseEvent: function() {
                        $("#destinationModal").modal('hide');
                        setTimeout(function() {
                            document.activeElement.blur();
                        }, 100)
                    },
                    onHideListEvent: function() {}
                },
                template: {
                    type: "custom",
                    method: function(value, item) {
                        return '<div class="d-flex p-1 pl-2 pr-2 pb-0 cityAirportFont" style="border-bottom: solid 1px #ccc;"><div class="p-0"><img src="/img/flags/4x3/' + item.Country_Code + '.png" width="20" style="margin-right:10px;"></div><div class="p-0">' + item.City_Name + ', ' + item.Country_Name + '<br><span class="text-muted small">' + addEllipsisToLongSentences(item.Airport_Name, 27, 24) + '</div><div class="ml-auto p-0"><span style="font-size:15px; width:60px; text-align:center; margin-top:5px; padding:3px; font-weight:bold; display:inline-block; border: solid 1px #ccc; ">' + item.Airport_Code + '</span></div></div>'
                    }
                }


                ,
                data: [{
                    "Airport_Name": "Indira Gandhi International Airport",
                    "Airport_Code": "DEL",
                    "City_Name": "New Delhi",
                    "View": "New Delhi (DEL)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chhatrapati Shivaji International Airport",
                    "Airport_Code": "BOM",
                    "City_Name": "Mumbai",
                    "View": "Mumbai (BOM)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Kempegowda International Airport",
                    "Airport_Code": "BLR",
                    "City_Name": "Bangalore",
                    "View": "Bangalore (BLR)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Netaji Subhash Chandra Bose International Airport",
                    "Airport_Code": "CCU",
                    "City_Name": "Kolkata",
                    "View": "Kolkata (CCU)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Dabolim Airport",
                    "Airport_Code": "GOI",
                    "City_Name": "Goa",
                    "View": "Goa (GOI)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Rajiv Gandhi International Airport",
                    "Airport_Code": "HYD",
                    "City_Name": "Hyderabad",
                    "View": "Hyderabad (HYD)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Chennai International Airport",
                    "Airport_Code": "MAA",
                    "City_Name": "Madras",
                    "View": "Madras (MAA)",
                    "Country_Name": "India",
                    "Country_Code": "in"
                }, {
                    "Airport_Name": "Singapore Changi Airport",
                    "Airport_Code": "SIN",
                    "City_Name": "Singapore",
                    "View": "Singapore (SIN)",
                    "Country_Name": "Singapore",
                    "Country_Code": "sg"
                }, {
                    "Airport_Name": "Dubai International Airport",
                    "Airport_Code": "DXB",
                    "City_Name": "Dubai",
                    "View": "Dubai (DXB)",
                    "Country_Name": "United Arab Emirates",
                    "Country_Code": "ae"
                }, {
                    "Airport_Name": "Suvarnabhumi Airport",
                    "Airport_Code": "BKK",
                    "City_Name": "Bangkok",
                    "View": "Bangkok (BKK)",
                    "Country_Name": "Thailand",
                    "Country_Code": "th"
                }, {
                    "Airport_Name": "Tribhuvan International Airport",
                    "Airport_Code": "KTM",
                    "City_Name": "Kathmandu",
                    "View": "Kathmandu (KTM)",
                    "Country_Name": "Nepal",
                    "Country_Code": "np"
                }]

            };

            $("#origin").easyAutocomplete(options_ori);

            $("#origin_mob").easyAutocomplete(options_ori_mob);

            $("#destination").easyAutocomplete(options_des);
            $("#destination_mob").easyAutocomplete(options_des_mob);

            $("#origin").keypress(function() {
                $("#origin_airport").val("");
            });

            $("#origin_mob").keypress(function() {
                $("#origin_airport").val("");
            });



            $("#destination").keypress(function() {
                $("#destination_airport").val("");
            });
            $("#destination_mob").keypress(function() {
                $("#destination_airport").val("");
            });


            $("#origin").focus(function() {
                if ($("#origin").val() == "") {
                    $("#origin_airport").val("");
                }
            });


            $("#origin_mob").focus(function() {
                if ($("#origin_mob").val() == "") {
                    $("#origin_airport").val("");
                }
            });


            $("#destination").focus(function() {
                if ($("#destination").val() == "") {
                    $("#destination_airport").val("");
                }
            });

            $("#destination_mob").focus(function() {
                if ($("#destination_mob").val() == "") {
                    $("#destination_airport").val("");
                }
            });

            $(".travellerDetails").click(function() {
                if ($(".pax-popover").css('display') == 'block') {
                    $(".pax-popover").hide();
                    $(".travel-selector :input").removeClass('upDownArrow').addClass('dropDownArrow');
                } else {
                    $(".pax-popover").animate({
                        "opacity": "show"
                    }, 500);
                    $(".travel-selector :input").removeClass('dropDownArrow').addClass('upDownArrow');
                }
            });
            $(".closeTravelSelector").click(function() {
                $(".pax-popover").hide();
                $(".travel-selector :input").removeClass('upDownArrow').addClass('dropDownArrow');
            });

            $(document).click(function(a) {
                $(a.target).hasClass("travellerDetails") || 0 !== $(a.target).parents(".pax-popover").length || $(".pax-popover").hide();
            });

            $(function() {
                $(".operator").click(function(a) {
                    a.preventDefault();
                    var t = $(this).attr("data-field"),
                        e = $(this).attr("data-type"),
                        l = $("input[name='" + t + "']"),
                        n = parseInt(l.val());
                    if (isNaN(n)) l.val(0);
                    else {
                        "minus" == e ? n > parseInt(l.attr("min")) && l.val(n - 1).change() : "plus" == e && n < parseInt(l.attr("max")) && l.val(n + 1).change(), $("#adult").val(parseInt($("input[name='adult']").val())), $("#child").val(parseInt($("input[name='child']").val())), $("#infant").val(parseInt($("input[name='infant']").val()));
                        var i = parseInt($("input[name='adult']").val()) + parseInt($("input[name='child']").val()) + parseInt($("input[name='infant']").val());
                        i > 1 ? $(".travellerDetails").val(i + " Travellers, " + $("#classi option:selected").text()) : $(".travellerDetails").val(i + " Traveller, " + $("#classi option:selected").text())
                    }
                })
            });
            $("#classi").change(function() {
                $("#class").val($("#classi").val());
                var a = parseInt($("input[name='adult']").val()) + parseInt($("input[name='child']").val()) + parseInt($("input[name='infant']").val());
                a > 1 ? $(".travellerDetails").val(a + " Travellers, " + $("#classi option:selected").text()) : $(".travellerDetails").val(a + " Traveller, " + $("#classi option:selected").text())
            });

            var a = parseInt($("input[name='adult']").val()) + parseInt($("input[name='child']").val()) + parseInt($("input[name='infant']").val());
            a > 1 ? $(".travellerDetails").val(a + " Travellers, " + $("#classi option:selected").text()) : $(".travellerDetails").val(a + " Traveller, " + $("#classi option:selected").text());

            //VALIDATION    

            jQuery.validator.addMethod("notEqual", function(value, element, param) {
                return this.optional(element) || value != $(param).val();
            }, "This has to be different...");






            $("#Search_Bus").validate({
                debug: false,
                ignore: [],
                groups: {
                    departbus: "depart departbus_id",
                    arrivebus: "arrive arrivebus_id"
                },
                rules: {
                    departbus: "required",
                    departbus_id: "required",
                    arrivebus: "required",
                    arrivebus_id: "required",
                    arrivebus: {
                        required: true,
                        notEqual: "#departbus"
                    },

                    depart_date: "required",

                },
                messages: {
                    departbus: "Please enter valid depart location.",
                    // departbus_id: "Please select valid location from list.",
                    // arrivebus: "Please enter valid destination location.",
                    // arrivebus_id: {required:"Please select valid location from list.",notEqual:"Depart & Destination can not be same."},
                    arrivebus: {
                        required: "Please enter valid destination location.",
                        notEqual: "Depart & Destination can not be same."
                    },
                    trip_start_date: "Please enter valid date.",

                },
                errorElement: "span",
                invalidHandler: function(form, validator) {},
                errorPlacement: function(error, element) {
                    error.addClass("help-block small text-danger");
                    if (element.prop("type") === "checkbox") {} else {
                        error.insertAfter(element.parents("fieldset"));
                    }
                },
                highlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-error").removeClass("has-success");
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
                },
                submitHandler: function(form) {
                    $("button[name=search]").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                    $("button[name=search]").prop("disabled", true);
                    $('.md-modal').addClass('md-show');
                    $(document).attr('title', 'Searching....');
                    form.submit();
                }
            });


            $("#Search_Flights").validate({
                debug: false,
                ignore: [],
                groups: {
                    origin: "origin origin_airport",
                    destination: "destination destination_airport"
                },
                rules: {
                    //origin: "required",
                    origin_airport: "required",
                    //destination: "required",
                    destination_airport: "required",
                    destination_airport: {
                        required: true,
                        notEqual: "#origin_airport"
                    },

                    trip_start_date: "required",

                },
                messages: {
                    origin: "Please enter valid origin.",
                    origin_airport: "Please enter valid origin.",
                    destination: "Please enter valid destination.",
                    destination_airport: {
                        required: "Please enter valid destination.",
                        notEqual: "Origin & Destination can not be same."
                    },
                    trip_start_date: "Please enter valid date.",

                },
                errorElement: "span",
                invalidHandler: function(form, validator) {},

                errorPlacement: function(error, element) {
                    $(element).closest("div").append(error);
                },

                highlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-error").removeClass("has-success");
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
                },
                /*
                showErrors: function(errorMap, errorList) {
                    
                        var message = '';
                        var element = '';

                        $.each(errorList, function (index, error) {
                            message += '<p class="text-danger h6"><i class="zmdi zmdi-close"></i> ' + error.message + '</p>';       
                            element += error.element;        
                        });

                        display_modal('<h5 class="font-weight-bold">You have an error</h5>', message);
                        console.log(message);
                        // console.log(element);
                        
                    },
                */
                submitHandler: function(form) {
                    $("button[name=search]").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                    $("button[name=search]").prop("disabled", true);
                    $('.md-modal').addClass('md-show');
                    $(document).attr('title', 'Searching....');
                    form.submit();
                    return false;
                }
            });
            /*SEARCH FORM FUNCTION END*/


            /*SEARCH PACKAGE FORM FUNCTION START*/
            $("#Search_Packages").validate({
                debug: false,
                ignore: [],
                rules: {
                    user_name: "required",
                    email: {
                        required: true,
                        email: true
                    },
                    phone: {
                        required: true,
                        number: true,
                        minlength: 10,
                        maxlength: 10
                    }
                },
                messages: {
                    user_name: "Please enter name.",
                    email: "Please enter valid email.",
                    phone: "Please enter correct phone number.",
                },
                errorElement: "span",
                invalidHandler: function(form, validator) {},
                errorPlacement: function(error, element) {
                    error.addClass("help-block small text-danger");
                    if (element.prop("type") === "checkbox") {} else {
                        error.insertAfter(element.parents("fieldset"));
                    }
                },
                highlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-error").removeClass("has-success");
                },
                unhighlight: function(element, errorClass, validClass) {
                    $(element).parents(".col-sm-5").addClass("has-success").removeClass("has-error");
                },
                submitHandler: function(form) {
                    $("button[name=search]").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                    $("button[name=search]").prop("disabled", true);
                    $('.md-modal').addClass('md-show');
                    form.submit();
                }
            });
            /*SEARCH PACKAGE FORM FUNCTION END*/

        });



        $(function() {

            $('.md-trigger').on('click', function() {
                $('.md-modal').addClass('md-show');
            });

            $('.md-close').on('click', function() {
                $('.md-modal').removeClass('md-show');
            });

        });

        // morefaremodal function
        function morefaremodal(flight_id, tid, key = '') {
            $('#morefarediv').html('');
            $.ajax({
                url: 'get_all_data.php?fid=' + flight_id + "&tid=" + tid + "&call=morefares&key=" + key,
                type: 'GET',
                beforeSend: function() {
                    $("#morefarediv, #more_fares").html(`
                <div class="animated-background text-center w-50 mt-1 ml-auto mr-auto" style="height:20px;"></div>
                <div class="animated-background text-center w-75 my-3 ml-auto mr-auto rounded" style="height:80px;"></div>
                <div class="d-flex justify-content-center">
                    <div class="animated-background text-center w-25 my-3 rounded" style="height:120px;"></div>
                    <div class="animated-background text-center w-25 my-3 mx-2 rounded" style="height:120px;"></div>
                    <div class="animated-background text-center w-25 my-3 rounded" style="height:120px;"></div>
                </div>
            `);
                },
                success: function(data) {
                    $("#morefarediv").html(data);
                }
            });
        }
        $(document).on('click', '.toggle-card-button', function(e) {
            e.preventDefault();
            const $cardBody = $(this).parent().attr('id');
            const $icon = $(this).find('.icon');
            console.log($cardBody);
            if ($("#" + $cardBody).hasClass('collapse-card') === true) {
                $("#" + $cardBody).removeClass('collapse-card');
                $icon.html('keyboard_double_arrow_up');
            } else {
                $("#" + $cardBody).addClass('collapse-card');
                $icon.html('keyboard_double_arrow_down');
            }
        });


        function showPleaseWait() {
            var modalLoading = '<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false" role="dialog">\
        <div class="modal-dialog">\
            <div class="modal-content">\
                <div class="modal-header">\
                    <h4 class="modal-title">Please wait...</h4>\
                </div>\
                <div class="modal-body">\
                    <div class="progress">\
                    <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar"\
                    aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                    </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
    </div>';
            $(document.body).append(modalLoading);
            $("#pleaseWaitDialog").modal("show");
        }


        function hidePleaseWait() {
            $("#pleaseWaitDialog").modal("hide");
        }

        function time_remaining(endtime) {
            var t = Date.parse(endtime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        }
        // /////////////////////////Manas\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        function setDate(type) {
            const now = new Date();
            const target = new Date();

            if (type === 'tomorrow') {
                target.setDate(now.getDate() + 1);
            }

            const year = target.getFullYear();
            const month = target.getMonth();
            const day = target.getDate();

            $('#dateNewBus').pickadate('picker').set('select', [year, month, day]);

            // Clear previously active buttons
            $('#date_select').find('.active').removeClass('active');

            // Check if the selected date is today or tomorrow
            if (
                (type === 'today' && isSameDate(target, now)) ||
                (type === 'tomorrow' && isSameDate(target, new Date(now.setDate(now.getDate() + 1))))
            ) {
                // Add active class to the clicked button
                $(`#date_select button[data-type="${type}"]`).addClass('active');
            }
        }

        function isSameDate(date1, date2) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        }
        /////////////////////////////////////////////////////////////
        function run_clock(id, endtime) {
            var clock = document.getElementById(id);

            function update_clock() {
                var t = time_remaining(endtime);

                var dd = "";
                if (t.minutes < 4) {
                    var dd = "background-color:#ffdede; color: #d62525; border-top:solid 1px #ff9797; font-size:15px;";
                } else {

                    var dd = "background-color:#eaffef; color:#318c0b;border-top:solid 1px #b1f7c1;font-size:15px;";
                }

                clock.innerHTML = '<div class="text-center p-2" style="' + dd + '"><i class="zmdi zmdi-timer "></i> ' + t.minutes + ' min' + ' ' + t.seconds + ' sec' + ' left</div>';
                if (t.total <= 0) {
                    clearInterval(timeinterval);
                    $('#makeModal').modal({
                        keyboard: false,
                        show: true,
                        backdrop: 'static'
                    });
                    $('#verify_detail').modal('hide');


                }
            }
            //update_clock(); // run function once at first to avoid delay
            var timeinterval = setInterval(update_clock, 1000);
        }

        function busEmailResend() {
            if (document.getElementById("reEmail").value == "" || document.getElementById("reEmail").value == "Enter Email") {
                alert("Enter Email Address");
            } else {
                $("#emailSendUser").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                var str = $("#emailUser").serialize();
                $.ajax({
                    type: "GET",
                    url: "/bus/verify.php",
                    data: "httpSend=true&" + str + "",
                    cache: false,
                    success: function(msg) {
                        $("#emailModal").html('');
                        $("#emailModal").modal('hide');
                        window.location.reload();
                    }
                });
            }
        }

        function emailResend() {
            if (document.getElementById("reEmail").value == "" || document.getElementById("reEmail").value == "Enter Email") {
                alert("Enter Email Address");
            } else {
                $("#emailSendUser").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                var str = $("#emailUser").serialize();
                $.ajax({
                    type: "GET",
                    url: "/flight/verify.php",
                    data: "httpSend=true&" + str + "",
                    cache: false,
                    success: function(msg) {
                        $("#emailModal").html('');
                        $("#emailModal").modal('hide');
                        window.location.reload();
                    }

                });


            }
        }

        function sendTicketPdfMail() {
            if (document.getElementById("reEmail").value == "" || document.getElementById("reEmail").value == "Enter Email") {
                alert("Enter Email Address");
            } else {
                $("#emailSendUser").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                var str = $("#emailUser").serialize();
                $.ajax({
                    type: "GET",
                    url: "/flight/ticket_pdf_mail.php",
                    data: str + "&mail=y",
                    cache: false,
                    success: function(msg) {
                        $("#emailModal").html('');
                        $("#emailModal").modal('hide');
                        window.location.reload();
                    }
                });
            }
        }

        $(document).on("click", "#swapAirport", function() {

            var tmp = document.getElementById("origin").value;
            var tmp1 = document.getElementById("origin_airport").value;
            document.getElementById("origin").value = document.getElementById("destination").value;
            document.getElementById("origin_airport").value = document.getElementById("destination_airport").value;
            document.getElementById("destination").value = tmp;
            document.getElementById("destination_airport").value = tmp1;

        });
        // bus swap destination\\
        $(document).on("click", "#swapbus", function() {
            // console.log('click');
            var tmp = document.getElementById("departbus").value;
            var tmp1 = document.getElementById("departbus_id").value;
            // console.log(tmp);
            document.getElementById("departbus").value = document.getElementById("arrivebus").value;
            document.getElementById("departbus_id").value = document.getElementById("arrivebus_id").value;
            document.getElementById("arrivebus").value = tmp;
            document.getElementById("arrivebus_id").value = tmp1;

        });
        // bus swap destination\\

        $('#hotelQuery,#hotelQuery_ttl').click(function() {

            letconfirmAction = confirm("Are you want to request a free travel package quote?");
            if (confirmAction) {
                var url = '/portal/cte_request?tod_pnr='
                $.ajax({
                    type: 'post',
                    url: url,
                    success: function(result) {
                        $("#hotel_request").html("loading...");
                        location.reload();
                    }
                });
            } else {
                //alert("I don't want free quote.");
            }


        });

        $(document).ready(function() {
            function copy_code(media) {
                if (media == "instafollowBtn") {
                    $("#couponCodeArea").html(`<button class="btn rounded py-1 mt-2 px-1" id="instaCouponCode" style="width: 250px; height:47px; border: 1px dotted #111;">
            <div class="d-flex align-items-center justify-content-between">
              <p class="mb-0 w-100" id="">IGTOD150</p>
              <div class="btn btn-sm text-white copy_coupon_code" id="IGTOD150" style="background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);"><i class="zmdi zmdi-copy" style="font-size: 1.5rem;"></i> <span id="INSTA250Text">COPY</span></div>
            </div>
          </button>`);
                } else if (media == "youtubeSubscribeBtn") {
                    $("#YTcouponCodeArea").html(`<button class="btn rounded py-1 mt-2 px-1" id="YTcouponCodeArea" style="width: 250px; height:47px; border: 1px dotted #111;">
            <div class="d-flex align-items-center justify-content-between">
              <p class="mb-0 w-100" id="">YTTOD150</p>
              <div class="btn btn-sm text-white copy_coupon_code" id="YTTOD150" style="background-image: linear-gradient(-60deg, #ff5858 0%, #f09819 100%);"><i class="zmdi zmdi-copy" style="font-size: 1.5rem;"></i> <span id="YT250Text">COPY</span></div>
            </div>
          </button>`);
                }
            }
            $(document).on("click", ".follow_btn", function(e) {
                // e.preventDefault();
                media = $(this).attr("id"); // youtubeSubscribeBtn // instafollowBtn
                code_div = (media == "instafollowBtn") ? "#instaCouponCode" : "#YoutubeCouponCode";
                $(code_div).html('<div id="overlay"><div class="cv-spinner"><span class="spinner2"></span></div></div>');
                const get_code = setTimeout(() => {
                    copy_code(media)
                }, 5000);
            })
            $(document).on("click", ".copy_coupon_code", function() {
                var copy_text = $(this).attr("id");
                var tempTextarea = $("<textarea>");
                $("#" + copy_text).append(tempTextarea);
                tempTextarea.val(copy_text).select();
                document.execCommand("copy");
                tempTextarea.remove();
                $("#" + copy_text).html('<i class="zmdi zmdi-copy" style="font-size: 1.5rem;"></i> COPIED');
            })
        });

        $("#password-toggle").on("click", function() {
            if ($(this).text() == "visibility_off") {
                $(this).text('visibility');
                $(".privacy_password").prop("type", "text");
            } else {
                $(this).text('visibility_off')
                $(".privacy_password").prop("type", "password");
            }
        });

        // Mobile Menu Off Canvas
        function openMobileNav() {
            $(".menu-offcanvas-fullscreen").addClass("opened");
        }

        function closeMobileNav() {
            $(".menu-offcanvas-fullscreen").removeClass("opened");
        }
    </script>









    <!-- HOTEL TIMER SCRIPT START -->
    <script type="228fe3999d327e492e219f71-text/javascript">
        function refresh_hotel_results() {
            // alert("<br>http://www.sastasafar.com");
            // alert("");
            window.location.href = "http://www.sastasafar.com/hotels/search?sid=&ref=refresh";
        }

        function hotel_timer() {
            var timestamp = 0; // seconds
            var deadline = new Date(timestamp * 1000).toString(); // convert to milliseconds
            run_clock('countdown', deadline);
        }
    </script>
    <!-- HOTEL TIMER SCRIPT END -->






    <script type="228fe3999d327e492e219f71-text/javascript">
        //RESULT PAGE ONLY
        dep_selected = '1';
        ret_selected = '1';
        sr_tp = '';
        sr_tid = '6a3689bc179c0f01210eb8c1';
        nextpage = 2;
        offset = $("#flight_nav").offset();
        runpag = 'y';
        timeElpased = 0;
        timeLeft = 35;

        // 10 minutes from now
        var time_in_minutes = timeLeft;
        var current_time = Date.parse(new Date());
        var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
        run_clock('clockdiv', deadline);

        $('.top-bar').scrollToFixed();




        function upgrade_fare(a, id) {
            //alert(abfs);

            var airfarename = [];
            airfarename[0] = 'Regular';
            airfarename[1] = 'Retail';
            airfarename[2] = 'Flexi';
            airfarename[3] = 'Corporate';
            airfarename[4] = 'SME';
            airfarename[5] = 'Roundtrip';
            airfarename[6] = 'OnlyHandBaggage';
            airfarename[7] = 'Saver';
            airfarename[8] = 'FlexiPlus';
            airfarename[9] = 'StudentFare';
            airfarename[10] = 'ArmedForces';
            airfarename[11] = 'SeniorCitizen';
            airfarename[12] = 'Family';
            airfarename[13] = 'Minor';
            airfarename[14] = 'SpiceSaver';
            airfarename[15] = 'SpiceMax';
            airfarename[16] = 'GoSmart';
            airfarename[17] = 'GoFlexi';
            airfarename[18] = 'GoReturn';
            airfarename[19] = 'LowFare';
            airfarename[20] = 'PremiumFlex';
            airfarename[21] = 'DoctorsAndNurses';
            airfarename[22] = 'Value';
            airfarename[23] = 'Standard';


            var body = '';
            var djs = $.parseJSON(a);
            //$.parseJSON(abfs);


            var index = [];




            //console.log(abfs.key);  

            $.each(abfs, function(i, item) {
                var key = item.AirlineName + "-" + item.FareIndicator;
                index[key] = item;
            });


            body += $("#summary-" + id).html() + "<br>";


            $.each(djs, function(i, item) {





                var key = item.ai + "-" + item.fi;
                var btn = item.id + "_" + item.tp + "_" + item.tl;
                //alert(btn);
                var airlinebenifi = index[key];


                //console.log(index[key]);

                var body_benifits = "";



                $.each(airlinebenifi.Benefits, function(i, benifit) {
                    body_benifits += '<i class="zmdi zmdi-star-circle text-success"></i> ' + benifit + "<br>";
                });

                if (airlinebenifi.FreeMeal == true) {
                    body_benifits += '<i class="zmdi zmdi-star-circle text-success"></i> Free Meal<br>';
                }
                //airlinebenifi.FareName
                //alert(airlinebenifi.FareName);
                body += '<div class="d-flex rounded ' + ((item.fi == 11) ? 'alert-success' : 'alert-warning') + ' bd-highlight mb-2"><div class="p-2 w-100 bd-highlight"><b class="mb-2">' + airfarename[airlinebenifi.FareName] + '</b><br>' + body_benifits + '</div><div class="p-2 flex-shrink-1 bd-highlight text-center  text-dark font-weight-bold h5">&#8377;' + item.f + '<br><button id="btn' + btn + '" onclick="validatefl(&#39;' + btn + '&#39;,&#39;&#39;)" class="btn btn-danger mt-2  bgshade-2 font-weight-bold" type="button">SELECT</button></div></div>';

            });


            $("#upgrade_form .modal-body").html(body);
            $("#upgrade_form").modal('show');

        }



        function choose_flight(id, tp) {

            //  $('#sel-box').removeClass("flash-animation");
            if (tp == "d") dep_selected = id;
            if (tp == "r") ret_selected = id;

            if (tp == "d") {
                if ($("#fl-" + dep_selected + 'd').length == 0) {

                    $("#dep_selected").html("<div class='alert alert-danger'>Flights are fitered out.</div>");
                    $("#price_selected").html('');
                    return false;
                }
            } else {
                if ($("#fl-" + ret_selected + 'r').length == 0) {
                    $("#ret_selected").html("<div class='alert alert-danger'>Flights are fitered out.</div>");
                    $("#price_selected").html('');
                    return false;
                }
            }



            $("div").removeClass("borderonlyselected");




            if (dep_selected != "" && ret_selected != "") {


                $("#flight_" + dep_selected + 'd').prop("checked", true);
                $("#flight_" + ret_selected + 'r').prop("checked", true);


                $("#fl-" + dep_selected + 'd').addClass("borderonlyselected");
                $("#fl-" + ret_selected + 'r').addClass("borderonlyselected");





                $("#dep_selected").html($("#fl-" + dep_selected + 'd').html());
                $("#dep_selected .form-check-inline").remove();
                $("#dep_selected .show-flight-detail-l").remove();
                $("#dep_selected .dt-div").remove();





                $("#ret_selected").html($("#fl-" + ret_selected + 'r').html());
                $("#ret_selected .form-check-inline").remove();
                $("#ret_selected .show-flight-detail-l").remove();
                $("#ret_selected .dt-div").remove();

                $('#sel-box').addClass("flash-animation");

                setTimeout(function() {
                    $('#sel-box').removeClass("flash-animation")
                }, 1000);




                //  $("#dep_selected .al-div").prepend("<span class='badge badge-success'>Depart</span> ");
                // $("#ret_selected .al-div").prepend("<span class='badge badge-success'>Return</span> ");

                var dp = $("#p" + dep_selected + "d").val();
                var rp = $("#p" + ret_selected + "r").val();

                var totprice = parseInt(dp) + parseInt(rp);


                var bdp = $("#b" + dep_selected + "d").val();
                var brp = $("#b" + ret_selected + "r").val();


                var fdp = $("#f" + dep_selected + "d").val();
                var frp = $("#f" + ret_selected + "r").val();


                if ((fdp == 1 && frp == 1)) {
                    trv = 'drf';
                } else if (fdp == 1) {
                    trv = 'df';
                } else if (frp == 1) {
                    trv = 'rf';
                } else {
                    trv = "";
                }




                $("#price_selected").html("<div class='mb-0 mt-0 h5 font-weight-bold pointer' ><span class='money' data-ccy='INR' style='text-decoration:line-through !important; color:#de0000; font-size:13px' >&#8377;" + totprice + "</span><span class='money' data-ccy='INR'  > &#8377;" + (totprice - 100) + "</span> <br class=''> <span class='small d-inline-block font-weight-normal'>per adult</span></div> " + "<button class='btn btn-danger mt-2  bgshade-2' onclick='validatefl(&#39;" + bdp + "&#39;,&#39;" + brp + "&#39;)' type='button' style='font-size: 14px;' ><b>SELECT</b></button>");

                //$("#price_selected").html("<div class='mb-0 mt-0 h5 font-weight-bold pointer' ><span class='money' data-ccy='INR'  > &#8377;" + (totprice) + "</span> <br class=''> </div> " + "<button class='btn btn-danger mt-2  bgshade-2' onclick='validatefl(&#39;" + bdp + "&#39;,&#39;" + brp + "&#39;,&#39;" + trv + "&#39;)' type='button' style='font-size: 14px;' ><b>SELECT</b></button>");




                //<a class='btn btn-danger mt-2  bgshade-2' href='book.php?tid=6a3689bc179c0f01210eb8c1&did=" + bdp + "&rid=" + brp + "'  style='font-size: 14px;' ><b>SELECT</b></button>


            }
        }

        function validatefl(did, rid, ftv = '') {

            if (ftv == 'drf') {
                sect = "";
            } else if (ftv == 'df') {
                sect = " Only for onward sector ";
            } else if (ftv == 'rf') {
                sect = " Only for return sector ";
            } else {
                sect = "";
            }
            //window.location = "book?tid=6a3689bc179c0f01210eb8c1&did=" + did + "&rid=" + rid + "";
            if (ftv != '') {
                $('#exclusiveDealModal .modal-title').html('<h5 class="mb-0"><span class="text-danger">Exclusive Deal</span></h5>');
                $('#exclusiveDealModal .modal-body').html('<div style="text-align:center"><i class="zmdi zmdi-thumb-up zmdi-hc-3x zmdi-hc-fw text-success"></i> <br><p ><b>Important Notes for an exclusive deal!<br><span class="text-primary">' + sect + '</span></b></p><ul class="smallFont text-left"><li>A booking confirmation will take a minimum of 30 to 45 Minutes.</li><li>Seats are subject to availability, In case of non-availability of the seats, We will refund the full amount.</li><li><b>This exclusive deal is 100% Non-Refundable, Non-Changeable & Non-Cancellable.</b></li><li><b>You will be able check the status of your PNR on airline website or call center but names will be update 12 to 24 hrs prior to the flight departure.</b></li><li>Web check-in is mandatory to board flights.</li></ul></div></div>');


                //  $('#exclusiveDealModal .modal-footer').html('<button type="button" class="btn btn-danger"  data-dismiss="modal">Close</button> <a  href='+"/flight/validate?tid=6a3689bc179c0f01210eb8c1&did=" + did+ "&rid=" + rid+' class="btn btn-success">I Accept</button>');
                $('#exclusiveDealModal .modal-footer').html(`
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        <button onclick="$(this).html('<i class=\\'zmdi zmdi-rotate-right zmdi-3x zmdi-hc-spin\\'></i>').prop('disabled', ${true}); window.location.href='/flight/validate?tid=6a3689bc179c0f01210eb8c1&did=${did}&rid=${rid}'" class="btn btn-success" style="width: 98px;">I Accept</button>`);
                $("#exclusiveDealModal").modal('show');

            } else {

                if (rid == "") {
                    $("#btn" + did).prop("disabled", true);
                    $("#btn" + did).html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');

                } else {
                    var btn_html = $("#price_selected .btn").html();
                    $("#price_selected .btn").prop("disabled", true);
                    $("#price_selected .btn").html('<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i>');
                }

                //window.location = "book?tid=6a3689bc179c0f01210eb8c1&did=" + did + "&rid=" + rid + "";



                $.ajax({
                        url: "get_all_data?tid=6a3689bc179c0f01210eb8c1&did=" + did + "&rid=" + rid + "&call=validatefl&time=d",
                        type: 'get',
                        dataType: 'JSON'
                    })
                    .done(function(res) {
                        // alert(res);
                        //var res = jQuery.parseJSON( res );
                        var description = "";
                        $.each(res.desc, function(i, item) {
                            description = description + "<br>" + item;
                        });

                        if (res.fc == "y") {
                            if (rid == "") {
                                $("#btn" + did).prop("disabled", false);
                                $("#btn" + did).html("SELECT");
                            } else {
                                $("#price_selected .btn").prop("disabled", false);
                                $("#price_selected .btn").html(btn_html);
                            }

                            $('#modalLoadAny .modal-title').html('<span class="text-danger">Alert</span>');
                            $('#modalLoadAny .modal-body').html('<div style="text-align:center"><img src="/img/fareincrease.png" width="50"><span class="text-danger"><br>' + description + '<br><b>Your Fare is updated from airline. Kindly review on payment page.</b></span></div>');
                            $('#modalLoadAny .modal-footer').html('<button type="button" class="btn btn-danger"  data-dismiss="modal">Cancel</button> <a  href=' + "/flight/book?tid=6a3689bc179c0f01210eb8c1&did=" + did + "&rid=" + rid + ' class="btn btn-success">Proceed</button>');
                            $('#modalLoadAny').modal('show');
                        } else if (res.error == "y") {
                            if (rid == "") {
                                $("#btn" + did).prop("disabled", true);
                                $("#btn" + did).html('Sold Out');
                            } else {
                                $("#price_selected .btn").prop("disabled", false);
                                $("#price_selected .btn").html(btn_html);

                                $('#modalLoadAny .modal-title').html('<span class="text-danger">Alert</span>');
                                $('#modalLoadAny .modal-body').html(description);
                                $('#modalLoadAny .modal-footer').html('');
                                $('#modalLoadAny').modal('show');

                            }

                        } else {
                            if (rid == "") {
                                $("#btn" + did).prop("disabled", true);
                                $("#btn" + did).html('<i class="zmdi zmdi-check-circle"></i>');
                            } else {
                                $("#price_selected .btn").prop("disabled", true);
                                $("#price_selected .btn").html('<i class="zmdi zmdi-check-circle"></i>');
                            }

                            $('.md-modal').addClass('md-show');

                            window.location.href = "/flight/book?tid=6a3689bc179c0f01210eb8c1&did=" + did + "&rid=" + rid + "";
                        }



                    });
            }

        }
        /*
        function fillFormAndShowDate(o, oa, d, da) {

            $("#origin").val(o);
                $("#origin_airport").val(oa);
                $("#origin_pl_mob").html(oa);
                $("#origin_mob").val(o);
                
               

                $("#origin").focus();
                
                $("#destination").val(d);
                $("#destination_airport").val(da);
                $("#destination_pl_mob").html(da);
                $("#destination_mob").val(d);
                $("#destination").focus();
                //$("#dateNew").focus();


         $("#date").focus();

        }
        */
        function check_all(id) {
            $("#" + id + " input[type=checkbox]").each(function() {
                $(this).prop("checked", true);
            });
        }

        function uncheck_time_range_filter(id) {
            $("#time_range_filter_box_" + id + " input[type=checkbox]").each(function() {
                $(this).prop("checked", false);
                if (id == "d") {
                    $("#takeoff_filter_input_d").val("");
                    $("#arrival_filter_input_d").val("");
                } else {
                    $("#takeoff_filter_input_r").val("");
                    $("#arrival_filter_input_r").val("");
                }
            });
            execute_form();
        }


        function uncheck_all(id) {
            $("#" + id + " input[type=checkbox]").each(function() {
                $(this).prop("checked", false);
            });
        }

        function selectonly(id, onid) {
            uncheck_all(id);
            $("#" + onid + "").prop("checked", true);

        }

        function hashDiff(h1, h2) {
            var d = {};
            for (k in h2) {
                if (h1[k] !== h2[k]) {
                    d[k] = h2[k]
                }
            }
            return d;
        }

        function convertSerializedArrayToHash(a) {
            var r = {};
            for (var i = 0; i < a.length; i++) {
                r[a[i].name] = a[i].value;
            }
            return r;
        }
        var myVar;
        var lastquery_o = "";
        var currentRequest = null;
        var currentTab = 'tab-0';
        var lastquery = $("#page_form :input[class!='nod']").serialize();

        function setPage(page) {

            $("#page").val(page);
            execute_form("n");
        }

        function settab(id) {
            currentTab = id;
            $('#open_tab').val(id);
            $('.tab-link').removeClass('active');
            $('#' + id).addClass('active');
            resetAll();

            if (id == 'tab-2') {
                $("#airport-nearby").prop('checked', false);

            }
            if (id == 'tab-1') {
                selectonly('stop_box', 'stop-0');
            }

            if (id == 'tab-4') {
                coupon_app_all();
            }



            execute_form();



        }

        function resetAll() {
            uncheck_all('stop_box');
            uncheck_all('airline_box');
            uncheck_all('seperateStopsFilter');
            check_all('airport_box');
            if ($("#price_f").length != 0) $("#price_f").data("ionRangeSlider").reset();
            if ($("#flight_duration").length != 0) $("#flight_duration").data("ionRangeSlider").reset();
            if ($("#layover_duration").length != 0) $("#layover_duration").data("ionRangeSlider").reset();
            if ($("#take_off_d").length != 0) $("#take_off_d").data("ionRangeSlider").reset();
            if ($("#landing_d").length != 0) $("#landing_d").data("ionRangeSlider").reset();
            if ($("#take_off_r").length != 0) $("#take_off_r").data("ionRangeSlider").reset();
            if ($("#landing_r").length != 0) $("#landing_r").data("ionRangeSlider").reset();
            uncheck_time_range_filter('d');
            uncheck_time_range_filter('r');
        }


        function execute_form(v) {

            if (v === undefined || v === null) {
                v = "";
            }


            if (v != "n") $("#page").val('1');


            runpag = 'y';
            //OLD
            //  var currentItems = convertSerializedArrayToHash($("#page_form").serializeArray());
            //  var itemsChanged = hashDiff(currentItems, convertSerializedArrayToHash(lastquery_o));

            //NEW
            var currentItems = convertSerializedArrayToHash($("#page_form :input[class!='nod']").serializeArray());
            var itemsChanged = hashDiff(convertSerializedArrayToHash(lastquery_o), currentItems);

            //alert(lastquery_o.toSource());
            //alert(currentItems.toSource());
            //alert(itemsChanged.toSource());

            //console.log(JSON.stringify(lastquery_o));
            //console.log(JSON.stringify(currentItems));
            //console.log(JSON.stringify(itemsChanged));


            var forrmsear = $("#page_form :input[class!='nod']").serialize();
            if (lastquery != forrmsear) {
                clearTimeout(myVar);


                myVar = setTimeout(function() {



                    if (currentRequest != null) {
                        currentRequest.abort();
                        if (v == "") $.LoadingOverlay("hide");
                    }


                    if (v == "") $.LoadingOverlay("show", {
                        background: "rgba(0, 0, 0, 0.4)"
                    });
                    lastquery = forrmsear;

                    currentRequest = $.ajax({
                            url: "get_all_data?tid=6a3689bc179c0f01210eb8c1&call=filterflights&changes=" + JSON.stringify(itemsChanged) + "&" + forrmsear,
                            type: 'get',
                            dataType: 'JSON'
                        })
                        .done(function(res) {
                            if (res.flight_data != "" && $("#flight_nav").html() != res.flight_data) {

                                if (v == "n") {
                                    $("#flight_nav").append(res.flight_data);
                                } else {
                                    $("#flight_nav").html(res.flight_data);
                                }

                                if (res.sort_data != "" && $("#sort_nav").html() != res.sort_data) {
                                    $("#sort_nav").html(res.sort_data);
                                }



                            }
                            if (v == "") $.LoadingOverlay("hide");

                            $('[data-toggle="popover"]').popover();


                            if (v == "") choose_flight(1, 'd');
                            if (v == "") choose_flight(1, 'r');


                            nextpage = $(".next .page-link").last().attr("href");
                            //alert(nextpage);
                            if (nextpage == "#") {
                                runpag = 'y';
                            } else if (nextpage == "") {
                                runpag = 'y';
                            } else if (typeof nextpage === "undefined") {
                                runpag = 'y';
                            } else {
                                runpag = 'n';
                            }

                            $(".pagi_box_main").hide();
                            $(".lad").remove();

                            //alert(nextpage);





                        });

                }, 300);

            }
        }

        function pad(str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
        }
        var subscribe;
        subscribe = 0;





        function doSomething(scroll_pos) {
            pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
        }


        // var count = 0;
        function moveIndicator(item, color) {
            var textPosition = item.getBoundingClientRect();
            var container = pnProductNavContents.getBoundingClientRect().left;
            var distance = textPosition.left - container;
            var scroll = pnProductNavContents.scrollLeft;
            pnIndicator.style.transform = "translateX(" + (distance + scroll) + "px) scaleX(" + textPosition.width * 0.01 + ")";
            // count = count += 100;
            // pnIndicator.style.transform = "translateX(" + count + "px)";

            if (color) {
                pnIndicator.style.backgroundColor = color;
            }
        }

        function determineOverflow(content, container) {
            var containerMetrics = container.getBoundingClientRect();
            var containerMetricsRight = Math.floor(containerMetrics.right);
            var containerMetricsLeft = Math.floor(containerMetrics.left);
            var contentMetrics = content.getBoundingClientRect();
            var contentMetricsRight = Math.floor(contentMetrics.right);
            var contentMetricsLeft = Math.floor(contentMetrics.left);
            if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
                return "both";
            } else if (contentMetricsLeft < containerMetricsLeft) {
                return "left";
            } else if (contentMetricsRight > containerMetricsRight) {
                return "right";
            } else {
                return "none";
            }
        }

        /**
         * @fileoverview dragscroll - scroll area by dragging
         * @version 0.0.8
         * 
         * @license MIT, see https://github.com/asvd/dragscroll
         * @copyright 2015 asvd <heliosframework@gmail.com> 
         */

        function durationConvert(str) {
            if (str === "" || str === null) {
                return "";
            }

            let hour = str.slice(0, -2) + "h";
            let min = str.slice(-2) + "m";

            if (hour.trim() === "00h" || hour.trim() === "h") {
                hour = "";
            }

            return hour + " " + min;
        }




        function runcomp(res) {
            //$(".filter-main").show();
            //alert(res.matrix_data);
            //alert("done");
            //$( this ).addClass( "done" );
            if (res.matrix_data != "" && $("#matrix_nav").html() != res.matrix_data) {
                $("#matrix_nav").html(res.matrix_data);
            }
            if (res.flight_data != "" && $("#flight_nav").html() != res.flight_data) {
                $("#flight_nav").html(res.flight_data);



                $('.owl-carousel').owlCarousel({
                    loop: false,
                    margin: 0,
                    nav: true,
                    navText: [
                        "<i class='zmdi zmdi-chevron-left'></i>",
                        "<i class='zmdi zmdi-chevron-right'></i>"
                    ],
                    autoplay: false,
                    autoplayHoverPause: false,
                    responsive: {
                        0: {
                            items: 4
                        },
                        600: {
                            items: 5
                        },
                        1000: {
                            items: 6
                        }
                    }
                });

            }




            nextpage = $(".next .page-link").last().attr("href");
            //alert(nextpage);
            if (nextpage == "#") {
                runpag = 'y';
            } else if (nextpage == "") {
                runpag = 'y';
            } else if (typeof nextpage === "undefined") {
                runpag = 'y';
            } else {
                runpag = 'n';
            }




            if (res.filter_data != "" && $("#filter_nav").html() != res.filter_data) {
                $("#filter_nav").html(res.filter_data);


                choose_flight(1, 'd');
                choose_flight(1, 'r');



                if (Array.isArray(res.times.Price) == true) {
                    $("#price_f").ionRangeSlider({
                        type: "double",
                        grid: false,
                        prefix: "&#8377;",
                        hide_min_max: true,
                        values: res.times.Price,
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }

                // res.times.Layover = durationConvert(res.times.Layover);
                // res.times.Duration = durationConvert(res.times.Duration);

                if (Array.isArray(res.times.Layover) == true) {
                    $("#layover_duration").ionRangeSlider({
                        type: "double",
                        grid: false,
                        //  prefix: "&#8377;",
                        hide_min_max: false,
                        values: res.times.Layover,
                        prettify: function(num) {
                            // Convert the string to formatted time '02h 56m'
                            num = num.toString().padStart(4, '0'); // Ensure it's always 4 digits
                            let hour = num.slice(0, -2) + "h"; // Extract hours
                            let min = num.slice(-2) + "m"; // Extract minutes
                            return hour + " " + min; // Return formatted string
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }

                if (Array.isArray(res.times.Duration) == true) {
                    $("#flight_duration").ionRangeSlider({
                        type: "double",
                        grid: false,
                        //  prefix: "&#8377;",
                        hide_min_max: true,
                        values: res.times.Duration,
                        prettify: function(num) {
                            // Convert the string to formatted time '02h 56m'
                            num = num.toString().padStart(4, '0'); // Ensure it's always 4 digits
                            let hour = num.slice(0, -2) + "h"; // Extract hours
                            let min = num.slice(-2) + "m"; // Extract minutes
                            return hour + " " + min; // Return formatted string
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }

                if (Array.isArray(res.times.Depart_TakeOff) == true) {

                    $("#take_off_d").ionRangeSlider({
                        type: "double",
                        grid: false,
                        values: res.times.Depart_TakeOff,
                        prefix: "",
                        hide_min_max: true,
                        prettify_enabled: true,
                        prettify: function(num) {
                            return moment(pad(num, 4), "HHmm").format("HH:mm A");
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }
                if (Array.isArray(res.times.Depart_Land) == true) {
                    $("#landing_d").ionRangeSlider({
                        type: "double",
                        grid: false,
                        values: res.times.Depart_Land,
                        prefix: "",
                        hide_min_max: true,
                        prettify_enabled: true,
                        prettify: function(num) {
                            return moment(pad(num, 4), "HHmm").format("HH:mm A");
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }
                if (Array.isArray(res.times.Return_TakeOff) == true) {
                    $("#take_off_r").ionRangeSlider({
                        type: "double",
                        grid: false,
                        values: res.times.Return_TakeOff,
                        prefix: "",
                        hide_min_max: true,
                        prettify_enabled: true,
                        prettify: function(num) {
                            return moment(pad(num, 4), "HHmm").format("HH:mm A");
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }
                if (Array.isArray(res.times.Return_Land) == true) {
                    $("#landing_r").ionRangeSlider({
                        type: "double",
                        grid: false,
                        values: res.times.Return_Land,
                        prefix: "",
                        hide_min_max: true,
                        prettify_enabled: true,
                        prettify: function(num) {
                            return moment(pad(num, 4), "HHmm").format("HH:mm A");
                        },
                        onFinish: function(data) {
                            execute_form();
                        }
                    });
                }


            }
            if (res.sort_data != "" && $("#sort_nav").html() != res.sort_data) {
                $("#sort_nav").html(res.sort_data);
            }
            if (res.search_background == 1 && res.matrix_data == "") {
                $("#preloader_setup").html('<div class="row"><div class="col-12 col-md-6 mr-auto ml-auto"><br><br><div class="bg-white pt-4 rounded slideInUp text-center"><img src="img/nodata-rafki.png" class="img-fluid" style="max-width:200px"><br><h3 class="text-primary mb-0">No Results Found</h3><small class="text-muted">Please search again.<small><br><br><button type="button" class="btn btn-danger btn-lg bgshade-2" data-toggle="modal" data-target="#edit_form">Search Again</button><br><br><br></div></div></div><br><br><br><br><br><br><br><br><br><br><br><br><br><br>');
            } else if (res.search_background == 2) {
                if (subscribe == 0) {
                    $("#subscribe_us").modal({
                        show: true
                    });
                    subscribe = 1;
                }
                setTimeout(run, 2000);
            }

            $("#airline_box input[type=checkbox],#stop_box input[type=checkbox],.only_main,.reset_f").click(function() {
                //$("#airline_box input[type=checkbox],#stop_box input[type=checkbox],.only_main,.reset_f").click(function() {
                execute_form();
            });

            $("#stop_box input[type=checkbox]").click(function() {
                uncheck_all("seperateStopsFilter");
            })

            $("#seperateStopsFilter input[type=checkbox]").click(function() {
                uncheck_all("stop_box");
                execute_form();
            });


            //Very New Filters


            //  $(".stop_filter").click(function(){
            //      var stop_filter_input_d = "";
            //      var stop_filter_input_r = "";
            //     $(".stop_filter_d").each(function(){
            //         // console.log($(this).prop("checked"));
            //         if($(this).prop("checked") == true){
            //             stop_filter_input_d += $(this).val()+";";
            //         }
            //     });
            //     stop_filter_input_d = stop_filter_input_d.split(";");
            //     stop_filter_input_d.pop();
            //     stop_filter_input_d = stop_filter_input_d.join(";");

            //     set_filter_input_function(stop_filter_input_d,"#stop_filter_input_d");
            //     $(".stop_filter_r").each(function(){
            //         if($(this).prop("checked") == true){
            //             stop_filter_input_r += $(this).val();
            //         }
            //     });
            //     set_filter_input_function(stop_filter_input_r,"#stop_filter_input_r");
            //     execute_form();
            //  });


            $("#seperateStopBtn").on("click", function() {
                $("#seperateStopsFilter").toggleClass("d-none");
                $("#combinedStopsFilter").toggleClass("d-flex");
            });


            $(".time_range_filter_options").click(function() {
                var takeoff_filter_input_d = "";
                var arrival_filter_input_d = "";
                var takeoff_filter_input_r = "";
                var arrival_filter_input_r = "";
                $(".takeoff_d_filter").each(function() {
                    if ($(this).prop("checked") == true) {
                        takeoff_filter_input_d += $(this).val();
                    }
                });
                set_filter_input_function(takeoff_filter_input_d, "#takeoff_filter_input_d");
                $(".arrival_d_filter").each(function() {
                    if ($(this).prop("checked") == true) {
                        arrival_filter_input_d += $(this).val();
                    }
                });
                set_filter_input_function(arrival_filter_input_d, "#arrival_filter_input_d");
                $(".takeoff_r_filter").each(function() {
                    if ($(this).prop("checked") == true) {
                        takeoff_filter_input_r += $(this).val();
                    }
                });
                set_filter_input_function(takeoff_filter_input_r, "#takeoff_filter_input_r");
                $(".arrival_r_filter").each(function() {
                    if ($(this).prop("checked") == true) {
                        arrival_filter_input_r += $(this).val();
                    }
                });
                set_filter_input_function(arrival_filter_input_r, "#arrival_filter_input_r");


                execute_form();
            });

            function set_filter_input_function(filter_input, filter_element) {
                if (filter_input.length !== 0) {
                    filter_input = filter_input.split(";");
                    var set_filter_input = filter_input[0] + ";" + filter_input[filter_input.length - 1];
                    $(filter_element).val(set_filter_input);
                } else {
                    $(filter_element).val("");
                }
            }

            $('.form-filter').click(function() {
                //execute_form();
            });




            $('[data-toggle="popover"]').popover();



            $('.card-header b').click(function() {
                $(this).parent().find('.filter-content').slideToggle();
            })

            //choose_flight(dep_selected, 'd');
            //choose_flight(ret_selected, 'r');



            // $('#getFixed').scrollFix({side:"bottom",bottomPosition:"0"});





            lastquery = $("#page_form :input[class!='nod']").serialize();



            //lastquery = $("#page_form :input[name!='price']").serialize();


            //alert(lastquery);

            $("#filt").addClass('filter-main');

            if (lastquery_o == "") lastquery_o = $("#page_form :input[class!='nod']").serializeArray();




            $(window).scroll(function() {
                if ($(window).scrollTop() >= ($("#flight_nav").height() + offset.top) - $(window).height() - 500) {
                    if (runpag == 'n') {
                        $("#flight_nav").append('<div class="lad p-3 mt-3 text-center bg-white rounded"><i class="zmdi zmdi-rotate-right zmdi-3x zmdi-hc-spin"></i> loading ...</div>');
                        $(".pagi_box_main").remove();
                        //alert(nextpage);
                        setPage(nextpage);
                    }
                }
            });


        }

        veg = 1;


        function run() {
            $.ajax({
                    url: "get_all_data?tid=6a3689bc179c0f01210eb8c1",
                    type: 'get',
                    dataType: 'JSON'
                })
                .done(function(res) {


                    if (res.search_background == 1) {

                        runcomp(res);
                    } else if (res.search_background == 3) {


                        if (veg == 1) runcomp(res);
                        veg = 2;
                        setTimeout(run, 2000);

                    } else if (res.search_background == 0) {
                        $('#Search_Flights').submit();
                    } else {
                        setTimeout(run, 2000);
                    }

                });
        }



        function flight_details(sid) {
            if ($("#detail-" + sid).html() == "") {
                $.ajax({
                        url: "get_all_data?tid=6a3689bc179c0f01210eb8c1&call=detail&sid=" + sid,
                        type: 'get',
                        //dataType: 'JSON',
                        beforeSend: function() {
                            // Example: Show a loader
                            $("#detail-" + sid).html("<div class='text-center text-primary'><i class='zmdi zmdi-rotate-right zmdi-hc-spin zmdi-hc-2x'></i><br><b>Loading...</b><br></div>").show();
                        }
                        //dataType: 'JSON'
                    })
                    .done(function(res) {
                        $("#detail-" + sid).show().html(res.detail_data);
                    });
            } else {
                if ($("#detail-" + sid).css('display') == "none") {
                    $("#detail-" + sid).show();
                } else {
                    $("#detail-" + sid).hide();
                }
            }



        }

        function fare_rule(sid) {
            // alert(sid);
            //if ($("#detail-" + sid).html() == "") {
            $.ajax({
                    url: "get_all_data?tid=6a3689bc179c0f01210eb8c1&call=farerule&sid=" + sid,
                    type: 'get',
                    //dataType: 'JSON'
                })
                .done(function(res) {
                    $("#modalBodyFareRule").html(res.farerule);
                    $("#modalFareRule").modal("show");
                });
            //} else {
            //if ($("#detail-" + sid).css('display') == "none") {
            //$("#detail-" + sid).show();
            //} else {
            //$("#detail-" + sid).hide();
            //}
            //}



        }




        function sort_div(v, l) {
            if (v.value == "") v.value = "price"
            var divList = $(".datatype-" + l);
            divList.sort(function(a, b) {
                return $(a).data(v.value) - $(b).data(v.value)
            });
            $(".datamain-" + l).html(divList);
        }



        $(document).ready(function() {
            var json_res = {
                "matrix_data": "",
                "flight_data": "",
                "filter_data": "",
                "sort_data": "",
                "search_background": 1,
                "times": []
            };

            if (json_res.search_background == 1) {
                if (json_res.matrix_data == "") {
                    $("#preloader_setup").html('<div class="row"><div class="col-12 col-md-6 mr-auto ml-auto"><br><br><div class="bg-white pt-4 rounded slideInUp text-center"><img src="/img/nodata-rafki.png" class="img-fluid" style="max-width:200px"><br><h3 class="text-primary mb-0">No Results Found</h3><small class="text-muted">Please search again.<small><br><br><button type="button" class="btn btn-danger btn-lg bgshade-2" data-toggle="modal" data-target="#edit_form">Search Again</button><br><br><br></div></div></div><br><br><br><br><br><br><br><br><br><br><br><br><br><br>');
                } else {

                    runcomp(json_res);

                }

            } else {
                run();
            }

            // run();

            /*
             $('.show-filter').click(function() {
                 //$(".filter-main").toggle();
                 $('.filter-main').toggleClass('active');
                 //$('.show-filter').toggleClass('bgshade-2');
                 $('.body-main').toggleClass('filter-active');
             });
             $('.filter-bar').click(function() {
                 //$(".filter-main").toggle();
                 $('.filter-main').removeClass('active');
                 $('.body-main').removeClass('filter-active');
                 //$('.show-filter').toggleClass('bgshade-2');
             });
             */

            $('.show-filter').click(function() {
                //$(".filter-main").toggle();
                $('.filter-main').toggleClass('active');
                $('.bg-filt').removeClass('d-none');
                $('body').css('overflow', 'hidden');
                //$('.show-filter').toggleClass('bgshade-2');
                $('.body-main').toggleClass('filter-active');
            });
            $('.filter-bar').click(function() {
                //$(".filter-main").toggle();
                $('.filter-main').removeClass('active');
                $('.bg-filt').addClass('d-none');
                $('.body-main').removeClass('filter-active');
                $('body').removeAttr('style');
                //$('.show-filter').toggleClass('bgshade-2');
            });


            $(document).off('click', '.card-header b').on('click', '.card-header b', function() {
                $(this).find('i').toggleClass('zmdi-chevron-down');
                $(this).parents('.card-group-item').find('.filter-content').slideToggle();
            });

            $(document).ajaxComplete(function() {
                $(".nav-tabs a").click(function() {
                    $(this).tab('show');
                });
            });


        });



        var textArray = [
            'Searching flights on 100+ consolidators...',
            'Searching flights on 700+ Airlines...',
            'Finding Special Fares...',
            'Applying Discounts and Coupons...',
            'Clearing the runway...',
            'Your perfect flight is just moments away!'
        ];

        $("#searchBannerText").text(textArray[0]);

        var i = 1;

        function fadeText(text) {
            $("#searchBannerText").fadeOut(500, function() {
                $(this).text(text).fadeIn(500);
            });
        }

        setInterval(() => {
            fadeText(textArray[i]);
            i = (i + 1) % textArray.length;
        }, 3000);
    </script>





    <script type="228fe3999d327e492e219f71-text/javascript">
        $(document).ready(function() {
            $(document).on('click', '.collapse-btn', function() {
                $('.showing').removeClass('showing');
                $('.arrow-change').removeClass('arrow-change');
                id = $(this).attr('data-target');
                $(this).addClass('arrow-change');
                $('.arrow').html('arrow_right');
                $(id).on('shown.bs.collapse', function() {
                    $('.arrow-change').find('.arrow').html('arrow_drop_down');
                })
            })
        });

        function toggle_element(elem) {
            $(`#${elem}_foot`).toggleClass('hidden-for-users');
            if ($(`#${elem}_foot`).hasClass('hidden-for-users')) $(`#${elem}_btn`).text('View More');
            else $(`#${elem}_btn`).html('View Less');
        }
    </script>


    <div class="md-modal md-effect-12">
        <div class="md-content" style='text-align:center'>
            <div>
                <!-- <i class="zmdi zmdi-close zmdi-hc-3x md-close " style='position:relative;float:right; '></i>-->
            </div>
            <br>

            <div>
                <div class="ownmodal" id="mymodal">


                    <!--<img src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" class="img-fluid" style="max-width:300px;">
<div style="background:url(https://www.sastasafar.com/img/loader_backinout.gif); width:300px; height:300px; background-position:center center; margin-left:auto; margin-right:auto;"></div>-->
                    <img src="https://www.sastasafar.com/img/sastasafar_logo.png" alt="SastaSafar" class="pt-0 pb-0" width="200">
                    <div class="wrapper">
                        <div class="cssload-loader text-primary"></div>
                    </div>


                    <h3 class="text-primary h5 font-weight-bold mb-1">loading...</h3>

                    <!--
<br>
<br>
<input type="button" class="btn btn-success  md-close" value="That's Cool, Show Me Prices">
-->
                </div>
            </div>
        </div>
    </div>
    <div class="md-overlay"></div>

    <div class="modal" id="exclusiveDealModal" data-backdrop="true" data-keyboard="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">

                </div>
            </div>
        </div>
    </div>


    <div class="modal" id="modalLoadAny" data-backdrop="true" data-keyboard="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">

                </div>
            </div>
        </div>
    </div>

    <div class="modal modal-right" id="modalSeatLoad" data-backdrop="true" data-keyboard="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title"></h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body">

                </div>
                <div class="modal-footer">

                </div>
            </div>
        </div>
    </div>

    <div class="modal" id="modalFareRule" data-backdrop="true" data-keyboard="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Fare Rules</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
                <div class="modal-body">
                    <pre>
                       <div id="modalBodyFareRule" style='height:500px; overflow:scroll; font-size:11px;'></div>
                       </pre>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade modal-right" id="originModal" tabindex="-1" role="dialog" aria-labelledby="originModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header bg-white border-0">
                    <span type="button" class="closed" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#originModal').modal('hide');" data-cf-modified-228fe3999d327e492e219f71-="">
          <span aria-hidden="true"><i class="zmdi zmdi-chevron-left zmdi-hc-4x"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>



                    <fieldset class="formRow">
                        <div class="formRow--item">
                            <label for="origin_mob" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="origin_mob" id="origin_mob" class="formRow--input js-input addclearbutton" value="Usak (USQ)" autocomplete="off" placeholder="From" onClick="if (!window.__cfRLUnblockHandlers) return false; this.select();" data-cf-modified-228fe3999d327e492e219f71-="">
                                        </label>
                        </div>
                    </fieldset>


                    <button type="button" class="close" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#originModal').modal('hide');" style="margin-top:0px;position:relative;top:-3px;" data-cf-modified-228fe3999d327e492e219f71-=""> 
          <span aria-hidden="true">&times;</span>
        </button>
                </div>
                <div class="modal-body">

                </div>
            </div>
        </div>
    </div>

    <div class="modal fade modal-right" id="destinationModal" tabindex="-1" role="dialog" aria-labelledby="destinationModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header bg-white border-0">
                    <span type="button" class="closed" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#destinationModal').modal('hide');" data-cf-modified-228fe3999d327e492e219f71-="">
      <span aria-hidden="true"><i class="zmdi zmdi-chevron-left zmdi-hc-4x"></i></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>&nbsp;&nbsp;&nbsp;



                    <fieldset class="formRow">
                        <div class="formRow--item">
                            <label for="destination_mob" class="formRow--input-wrapper js-inputWrapper">
                                            <input type="text" name="destination_mob" id="destination_mob" class="formRow--input js-input addclearbutton" value="Dubai Bus Station (XMB)" autocomplete="off" placeholder="To" onClick="if (!window.__cfRLUnblockHandlers) return false; this.select();" data-cf-modified-228fe3999d327e492e219f71-="">
                                        </label>
                        </div>
                    </fieldset>


                    <button type="button" class="close" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#destinationModal').modal('hide');" style="margin-top:0px;position:relative;top:-3px;" data-cf-modified-228fe3999d327e492e219f71-="">
          <span aria-hidden="true">&times;</span>
        </button>
                </div>
                <div class="modal-body">

                </div>
            </div>
        </div>
    </div>


    <div class="modal border-0 fadeInDown animated  " id="BookModal" tabindex="-1" role="dialog" aria-labelledby="BookModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0 shadow-lg" style="background-color:#f;">
                <div class="modal-body p-0">
                    <i class="zmdi zmdi-hc-3x zmdi-close" style="position: absolute; right: 15px; top:15px; z-index:1" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#BookModal').modal('hide');" data-cf-modified-228fe3999d327e492e219f71-=""></i>
                    <div class='col-12 pt-3 pb-3'>
                        <div class='row'>
                            <div class="col-12 col-md-12 text-center p-3">
                                <img src="/img/lowest-price-icon-4.jpg" width="150" height="150">
                                <br>
                                <br>
                                <h5 class="text-dark">Congratulations</h5>
                                <!-- <h3 class="text-dark" style="font-weight: bold; ">You got the special deal.</h3>-->


                                <h4 class="text-success" style="font-weight: bold; "><span class="coupon_amt_dis"></span></h4>


                                <span class="text-danger" style="font-weight: bold; ">Sale Ending Today!</span>
                                <br>
                                <br>


                                <a href="javascript:void(0)" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#BookModal').modal('hide');" class="btn btn-danger shadow  bgshade-2" style="font-weight: bold; font-size:  20px;" data-cf-modified-228fe3999d327e492e219f71-="">View My Deal</a>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal border-0 fadeInDown animated  " id="CouponModal" tabindex="-1" role="dialog" aria-labelledby="CouponModal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0 shadow-lg" style="background-color:#f;">
                <div class="modal-body p-0">
                    <i class="zmdi zmdi-hc-3x zmdi-close" style="position: absolute; right: 15px; top:15px; z-index:1" onclick="if (!window.__cfRLUnblockHandlers) return false; $('#CouponModal').modal('hide');" data-cf-modified-228fe3999d327e492e219f71-=""></i>
                    <div class='col-12 pt-3 pb-3'>
                        <div class='row'>
                            <div class="col-12 col-md-12 text-center p-3">
                                <img src="/img/lowest-price-icon-4.jpg" width="150" height="150">
                                <br>
                                <br>

                                <h4 class="text-success" style="font-weight: bold; "><span class="coupon_app_all"><i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i><br>Applying Coupon on all flights..</span></h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="228fe3999d327e492e219f71-text/javascript">
        window.NREUM || (NREUM = {});
        NREUM.info = {
            "beacon": "bam.nr-data.net",
            "licenseKey": "NRJS-5690b18bb2a84acb715",
            "applicationID": "1478382292",
            "transactionName": "YAFRYxcCXEFWW0NZDllLZkUMTFReXl9fRE5FAUBCCRdBHEdQRw==",
            "queueTime": 0,
            "applicationTime": 25,
            "atts": "TEZSFV8YT08=",
            "errorBeacon": "bam.nr-data.net",
            "agent": ""
        }
    </script>
    <script src="/cdn-cgi/scripts/7d0fa10a/cloudflare-static/rocket-loader.min.js" data-cf-settings="228fe3999d327e492e219f71-|49" defer></script>
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js/v833ccba57c9e4d2798f2e76cebdd09a11778172276447" integrity="sha512-57MDmcccJXYtNnH+ZiBwzC4jb2rvgVCEokYN+L/nLlmO8rfYT/gIpW2A569iJ/3b+0UEasghjuZH/ma3wIs/EQ==" data-cf-beacon='{"version":"2024.11.0","token":"3623cb3c971848e182f0d1c8b6fc1a12","r":1,"server_timing":{"name":{"cfCacheStatus":true,"cfEdge":true,"cfExtPri":true,"cfL4":true,"cfOrigin":true,"cfSpeedBrain":true},"location_startswith":null}}'
        crossorigin="anonymous"></script>
</body>

</html>