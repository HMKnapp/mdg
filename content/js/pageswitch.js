/**
 * swup defaults except for linkSelector and containers
 */
const options = {
  containers: ["#content"],
  cache: true,
  linkSelector:
    'a:not([data-no-swup]):not([href^="tel:"]):not([href^="mailto:"]):not([href*="://"]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
  skipPopStateHandling: function (event) {
    if (event.state && event.state.source == "swup") {
      return false;
    }
    return true;
  }
};
const swup = new Swup(options);

/**
 * Remove Hash if we "page switch" to the same page but have no hash
 * Reset scroll position
 */
swup.on('samePage', function (e) {
  console.log('_SWUUP: samePage')
  window.scrollTo(0,0);
  removeHash();
});

/**
 * Scroll to targeted anchor when staying on same page during page switch
 */
swup.on('samePageWithHash', function (e) {
  console.log('_SWUUP: samePageWithHash')
  const id = e.target.hash.substr(1);
  scrollToHash(id);
});

/**
 * Scroll to target of link and change window title after page switches
 */
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

/**
 * Scrolls to hash==id of anchor without engaging scrollspy
 * @param {string} id id of element to scroll to 
 */
function scrollToHash(id) {
  console.log('scrollToHash id: ' + id)
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

/**
 * Stub that will remove faulty behaviour for non http links
 */
function removePageswitch() {

}

/**
 * Reinitializes all frontend functionality that is required in div#content
 * after content replacement by a page switch
 */
function reinitializeAfterPageSwitch() {
  console.log('reinitializeAfterPageSwitch')

  const id = window.location.hash.substr(1);
  const pageID = window.location.pathname.slice(1, -5).replace(/.*\//,'');
  const idElement = document.querySelector('#toc_cb_' + id + ' + label > a');
  var pageAnchorElement = document.querySelector('#toc_cb_' + pageID + ' + label > a')
  console.log('contentReplaced. new page: ' + pageID)
  toggleBox(pageAnchorElement);
  initBoxes(pageAnchorElement);
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

/**
 * Sets the window title according to page headlines found in the page
 * Format: Page - Section
 * Mainly for SEO purposes
 */
function refreshTitle() {
  console.log('refreshTitle');
  var pageTitle;
  const idMain = document.querySelector('div.sect2 > h3 > a.link')
  if(idMain) pageTitle = idMain.innerText;

  const idSecondary = document.querySelector('div.sect3 > h4 > a.link')
  if(window.location.hash && idSecondary) pageTitle += ' - ' + idSecondary.innerText;

  if(pageTitle) document.title = pageTitle;
}
