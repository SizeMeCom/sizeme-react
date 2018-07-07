/* global ga, sizeme_options */
import cookie from "react-cookie";

const prodTrackingId = "UA-40735596-1";
const devTrackingId = "UA-40735596-2";

const optanonConsentGaDisabled = () => {
    const optanonConsent = cookie.load("OptanonConsent", false);
    return optanonConsent && optanonConsent.match(/groups=:?(\d+:\d+,)*2:0/);
};

const gaDisabledChecks = [optanonConsentGaDisabled];

function loadGa (i, s, o, g, r) {
    const gaDisabled = gaDisabledChecks.some(fn => fn());
    if (!gaDisabled && !i[r]) {
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
}

const gaTrackingId = !sizeme_options.debugState ? prodTrackingId : devTrackingId;
let trackEvent;

loadGa(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

trackEvent = (action, label) => {
    ga("create", gaTrackingId, "auto", { name: "sizemeTracker" });
    trackEvent = (a, l) => {
        ga("sizemeTracker.send", {
            hitType: "event",
            eventCategory: window.location.hostname,
            eventAction: a,
            eventLabel: l + " (v3)"
        });
    };
    trackEvent(action, label);
};

export { trackEvent };
