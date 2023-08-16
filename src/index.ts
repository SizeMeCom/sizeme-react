void ((sizemeOptions) => {
  if (!sizemeOptions) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("Initializing SizeMe, version " + VERSION + ", built on " + BUILD_DATE);

  let sizemeDisabled = false;

  /*if (sizemeOptions.serviceStatus === "ab") {
    const abTesting = (await import("./ab-testing")).default;
    sizemeDisabled = abTesting();
  }*/

  if (sizemeOptions.serviceStatus === "off") {
    sizemeDisabled = true;
  }

  if (!sizemeDisabled) {
    // postpone execution of this block to wait for the shop UI to finish rendering. At least
    // with KooKenka accordion component this was needed
    setTimeout(() => {
      import(/* webpackChunkName: "loader" */ "./sizeme-loader");
    });
  }
})(window.sizeme_options);
