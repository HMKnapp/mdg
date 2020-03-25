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

swup.on('samePage', function (e) {
  console.log('_SWUUP: samePage')
  window.scrollTo(0,0);
  removeHash();
});

swup.on('samePageWithHash', function (e) {
  console.log('_SWUUP: samePageWithHash')
  /* to avoid tiggering scroll after jumping to anchor which opens the menu list again */
  const id = e.target.hash.substr(1);
  scrollToHash(id);
});

swup.on('clickLink', function (e) {
  console.log('_SWUUP: clickLink')
  /* for deep links to anchors inside other pages */
  const id = e.target.hash.substr(1);
  if (id) {
    setTimeout(()=>{
      scrollToHash(id)
    }, 250);
  }
  setTimeout(refreshTitle, 250);
});

swup.on('contentReplaced', () => {
  reinitializeAfterPageSwitch();
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

/* remove swup from mailto and tel links, because not possible with selector */
function removePageswitch() {

}

function reinitializeAfterPageSwitch() {
  console.log('reinitializeAfterPageSwitch')

  const id = window.location.hash.substr(1);
  const pageID = window.location.pathname.slice(1, -5).replace(/.*\//,'');
  const idElement = document.querySelector('#toc_cb_' + id + ' + label > a');
  var pageAnchorElement = document.querySelector('#toc_cb_' + pageID + ' + label > a')
  console.log('contentReplaced. new page: ' + pageID)
  initBoxes(pageAnchorElement);
  tickBox(pageAnchorElement);
  if(id) {
    initBoxes(idElement);
  }
  enableRequestDetailsHideShow();
  createSampleTabs();
  initializeScrollspy();
  initPageLinks();
  refreshTitle();
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