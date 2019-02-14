/* global ga */
import cookie from "react-cookie";

const PENDING = -1;
const DISABLED = 0;
const ENABLED = 1;

const prodTrackingId = "UA-40735596-1";
const devTrackingId = "UA-40735596-2";

const optanonConsent = () => {
    const optanonConsent = cookie.load("OptanonConsent", false);
    if (!optanonConsent) {
        return PENDING;
    } else {
        return optanonConsent.match(/groups=:?(\d+:\d+,)*2:0/) ? DISABLED : ENABLED;
    }
};

let trackEvent = () => {};

(sizemeOptions => {
    if (!sizemeOptions) {
        return;
    }

    ((i, s, o, g, r) => {
        if (!i[r]) {
            i["GoogleAnalyticsObject"] = r;
            i[r] = i[r] ||
                function () {
                    (i[r].q = i[r].q || []).push(arguments);
                };
            i[r].l = 1 * new Date();
            let a = s.createElement(o);
            let m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m);
        }
    })(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

    const gaTrackingId = !sizemeOptions.debugState ? prodTrackingId : devTrackingId;
    let gaConsent = () => ENABLED;
    const trackingConsentMethod = sizemeOptions.trackingConsentMethod;
    const gaQueue = [() => {
        ga("create", gaTrackingId, "auto", {name: "sizemeTracker"});
    }];

    if (trackingConsentMethod) {
        switch (trackingConsentMethod.toLowerCase()) {
            case "optanon":
                gaConsent = optanonConsent;
                break;

            default:
        }
    }

    const _trackEvent = (action, label) => {
        ga("sizemeTracker.send", {
            hitType: "event",
            eventCategory: window.location.hostname,
            eventAction: action,
            eventLabel: label + " (v3)"
        });
    };


    trackEvent = (action, label) => {
        switch (gaConsent()) {
            case PENDING:
                gaQueue.push(() => _trackEvent(action, label));
                break;

            case ENABLED:
                gaQueue.forEach(fn => fn());
                _trackEvent(action, label);
                trackEvent = _trackEvent;
                break;

            case DISABLED:
                trackEvent = () => {
                };
        }
    };
// eslint-disable-next-line
})(window.sizeme_options);


export { trackEvent };
