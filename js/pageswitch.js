/* defaults, except for container selector and link selector had to be modified */
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
  const clickedHash = e.delegateTarget.hash.substr(1);
  console.log(clickedHash);
  const element = document.getElementById(clickedHash);
  if (element) {
      element.scrollIntoView();
  }
  /* TODO: do not trigger initialize if user stays on same page */
  reinitializeAfterPageSwitch();
});

function reinitializeAfterPageSwitch() {
  enableRequestDetailsHideShow();
  createSampleTabs();
  initializeScrollspy();
}
