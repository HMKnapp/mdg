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
  console.log('_SWUUP: samePageWithHash')
  /* to avoid tiggering scroll after jumping to anchor which opens the menu list again */
  const id = e.target.hash.substr(1);
  scrollToHash(id);
});

swup.on('clickLink', function (e) {
  console.log('_SWUUP: clickLink')
  reinitializeAfterPageSwitch();
  /* for deep links to anchors inside other pages */
  const id = e.target.hash.substr(1);
  if (id) {
    scrollToHash(id);
  }
  setTimeout(refreshTitle, 500);
});

swup.on('contentReplaced', () => {
  refreshTitle();
  const id = window.location.hash.substr(1);
  console.log('scroll in contentReplaced to id: ' + id)
  const pageID = window.location.pathname.replace(/.*\//,'');
  const anchorElement = document.querySelectorAll('#toc_cb_' + pageID + ' + label > a')[0];
  if (anchorElement) {
    initBoxes(anchorElement);
  }
  if (id) {
    scrollToHash(id);
  }
  initPageLinks();
  initializeScrollspy();
});

// swup.on('popState'), () => {
//   console.log('popState triggered')
// };

function scrollToHash(id) {
  console.log('scrollToHash 222 id: ' + id)
  document.scrollspy.disabled = true;
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView();
    /* because scrollIntoView has no callback */
    setTimeout(() => {
      document.scrollspy.disabled = false;
    }, 1000);
  }
  else {
    document.scrollspy.disabled = false;
  }
}

function reinitializeAfterPageSwitch() {
  console.log('reinitializeAfterPageSwitch')
  enableRequestDetailsHideShow();
  createSampleTabs();
  initializeScrollspy();
  window.scrollTo(0, 0);
}

function refreshTitle() {
  console.log('refreshTitle');
  //const id = window.location.pathname.slice(1,-5);
  //const element = document.getElementById(id);
  var pageTitle;
  //const titleMain = Array.from(element.children).filter(e => e.matches('a.link'))[0].innerHTML
  const idMain = document.querySelector('div.sect2 > h3 > a.link')
  if(idMain) pageTitle = idMain.innerText;

  const idSecondary = document.querySelector('div.sect3 > h4 > a.link')
  if(window.location.hash && idSecondary) pageTitle += ' - ' + idSecondary.innerText;

  if(pageTitle) document.title = pageTitle;
}