/* global ga, sizeme_options */
(function (i, s, o, g, r) {
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
})(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga");

let gaTrackingId = sizeme_options.gaTrackingId;
let gaEnabled = gaTrackingId !== null;

let trackEvent = (action, label) => {
    if (gaEnabled) {
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
    } else {
        trackEvent = () => {};
    }
};

export { trackEvent, gaEnabled };
