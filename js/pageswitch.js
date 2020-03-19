const options = {
  containers: ["#content"],
  cache: true,
  linkSelector:
    'a:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  skipPopStateHandling: function (event) {
    if (event.state && event.state.source == "swup") {
      return false;
    }
    return true;
  }
};
const swup = new Swup(options);

swup.on('clickLink', function (e) {
  console.log('clicked')
  console.log(e)
  reinitializeAfterPageSwitch();
});

swup.on('samePageWithHash', function (e) {
  const clickedHash = e.target.hash.substr(1);
  const element = document.getElementById(clickedHash);
  if (element) {
      element.scrollIntoView();
  }
});

function reinitializeAfterPageSwitch() {
  enableRequestDetailsHideShow();
  createSampleTabs();
  initializeScrollspy();
  window.scrollTo(0,0);
}