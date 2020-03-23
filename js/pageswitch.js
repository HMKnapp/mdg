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

swup.on('samePageWithHash', function (e) {
  /* to avoid tiggering scroll after jumping to anchor which opens the menu list again */
  const id = e.target.hash.substr(1);
  scrollToHash(id);
});

swup.on('contentReplaced', function (e) {
  reinitializeAfterPageSwitch();
  /* for deep links to anchors inside other pages */
  const id = window.location.hash.substr(1);
  if (id) {
    scrollToHash(id);
  }
});

function scrollToHash(id) {
  document.scrollspy.disabled = true;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
    /* because scrollIntoView has no callback */
    setTimeout(() => {
      document.scrollspy.disabled = false;
    }, 1000);
  }
}

function reinitializeAfterPageSwitch() {
  enableToc();
  enableRequestDetailsHideShow();
  createSampleTabs();
  initializeScrollspy();
  window.scrollTo(0, 0);
}
