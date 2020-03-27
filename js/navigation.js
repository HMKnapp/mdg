/**
 * BASIC TOC FUNCTIONALITY
 */

/**
 * Waits for whole DOM to be loaded before enabling TOC functionality and
 * adds event to links inside the page in div#content
 */
document.addEventListener('DOMContentLoaded', () => {
  enableToc();
  initPageLinks();
});

/**
 * Is called on each page switch and also if page is opened by itself
 * Looks for a given hash in the URL and initializes the TOC on that position
 */
function enableToc() {
  console.log('enableToc');
  /* scroll toc to currents main section */
  const pageID = document.querySelector('body').getAttribute('id');

  /* TODO: doesn#t work. minor issue but check why */
  document.querySelector('#toc_cb_' + pageID).scrollIntoView({ behavior: "smooth" });

  /* if page is openen with a deep link (hash), check the correct box (if it exists) */
  var hash = window.location.hash.substring(1);
  if (hash) {
    var initialTocLink = document.querySelectorAll('#toc_cb_' + hash + ' + label > a')[0];
    if (initialTocLink) {
      initBoxes(initialTocLink);
    }
  }
  var tocLinks = document.querySelectorAll('#toc label > a');
  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      toggleBox(this);
      closeOverlay();
    })
  })
  document.tocInitialized = true;
}

/**
 * Toggles a specific TOC checkbox belonging to an anchor.
 * @param {Element} anchorElement specifies which TOC anchor was clicked
 */
function toggleBox(anchorElement) {
  console.log('toggleBox')
  console.log(anchorElement)
  var parent = anchorElement.parentNode;
  var checkbox = parent.previousElementSibling;
  var setTo = !checkbox.checked;
  /* uncheck same level end below checkboxes */
  var sameLevelCheckboxes = parent.parentNode.parentNode.querySelectorAll(':scope > li input[type=checkbox]');
  for (var cb of sameLevelCheckboxes.entries()) {
    var other_cb = cb[1];
    other_cb.checked = false;
  }
  checkbox.checked = setTo;
  return true;
}

/**
 * Similar to toggleBox() but used for initializing the TOC.
 * e.g. after a switch or fresh page load, to a certain position.
 * Always sets checked to true and recursively goes through parent boxes.
 * @param {Element} anchorElement specifies which TOC anchor is the base
 */
function initBoxes(anchorElement) {
  try {
    var parent = anchorElement.parentNode;
    var checkbox = parent.previousElementSibling;
    /* TODO: debug why this can happen */
    if (checkbox.matches('input[type=checkbox]') === false) {
      return false;
    }
    var sameLevelCheckboxes = parent.parentNode.parentNode.querySelectorAll(':scope > li > input[type=checkbox]');
    for (var cb of sameLevelCheckboxes.entries()) {
      var other_cb = cb[1];
      other_cb.checked = false;
    }
    checkbox.checked = true;
  }
  catch (e) {
    console.log(e)
  }

  /* tick parent boxes */
  try {
    var ancestor_anchor = parent.parentNode.parentNode.previousElementSibling.firstChild;
    initBoxes(ancestor_anchor);
  }
  catch (e) {
    console.log('no more ancestor found');
  }
}

/**
 * Links in +selector+ need a click event that triggers.
 * ticking of correct boxes after a page switch (== replacement of div#content).
 * Checks if id corresponding to URL page.html#anchor is available in TOC.
 * If yes, click it.
 * If no, take page from page.html#anchor, click TOC accordingly and scroll to #anchor
 * @param {selector} selector which a tags to equip with an eventListener
 */
function addClickHander(selector) {
  const pageID = window.location.pathname.slice(1, -5).replace(/.*\//,'');
  const pageRootElementAnchor = document.querySelector('#toc_cb_' + pageID + ' + label > a');
  document.querySelectorAll(selector).forEach(a => {
    if (a.hasAttribute('class')) return;
    if (a.href.startsWith(window.location.origin) === false) return;

    a.addEventListener('click', function (e) {
      console.log('click triggered')
      const id = a.href.split('.html#') ? a.href.split('.html#')[1] : a.href.splice(0, -5);
      console.log(id)
      var toc_anchor = document.querySelector('#toc_li_' + id + ' a');
      console.log(toc_anchor);
      if (toc_anchor) {
        initBoxes(toc_anchor);
      }
      else {
        initBoxes(pageRootElementAnchor);
      }
      scrollToHash(id);
    })
  });
}

function initPageLinks() {
  console.log('initPageLinks');
  addClickHander('div#content a');
}

function initSearchResultsLinks() {
  console.log('initSearchResultsLinks');
  addClickHander('div#search-results > li a');
}






/**
 * SCROLLSPY FOR TOC
 */

/**
 * Waits for page to load completely, not just TOC.
 * Necessary for position caching of elements used for scrollspy performance.
 */
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    initializeScrollspy();
    refreshTitle();
  }
}

/**
 * Scrollspy needs to be reinitialized when user resizes the window.
 * For performance reasons this is throttled to max once in 500ms.
 */
var resizeTimeout;
window.onresize = () => {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    initializeScrollspy();
  }, 500);
}

/**
 * Initializes scollspy functionality.
 * Caches all headings elements in current document.
 * First Removes its own event listener from window to avoid bubbling expensive scroll event.
 * Adds event listener again to trigger handleScrollEvent()
 */
function initializeScrollspy() {
  console.log('initializeScrollspy')
  document.scrollspy = {
    disabled: false
  }
  /* cache all headline elements */
  document.headingsSelector = ['div#content h4', 'div#content h5', 'div#content h6']
  document.headingsElementsArray = [];
  document.querySelectorAll(document.headingsSelector.join(', ')).forEach(element => {
    document.headingsElementsArray.push(element);
  });

  /* remove existing eventlistener (for pageswitch) before adding it again */
  window.removeEventListener('scroll', handleScrollEvent, { scrollspy: true });
  window.addEventListener('scroll', handleScrollEvent, { scrollspy: true });
}

/**
 * Triggered on every scroll event.
 * Calculates whether scoll position is within area of section a cached headline belongs to.
 * Resets TOC to that specific section.
 */
var ssTimer;
function handleScrollEvent() {
  if (document.scrollspy.disabled) {
    return true;
  }
  if(window.scrollY === 0) {
    removeHash();
  }
  requestAnimationFrame(() => {
    document.headingsElementsArray.forEach(element => {
      const etopY = element.offsetTop - 50;
      const ebottomY = etopY + element.parentElement.offsetHeight;
      if (window.scrollY >= etopY && window.scrollY <= ebottomY) {
        const anchorElement = document.querySelectorAll('#toc_cb_' + element.id + ' + label > a')[0];
        if (anchorElement) {
          initBoxes(anchorElement);
        }
      }
    })
  });
}

/**
 * Find parents for given element.
 * Returns array of parentElements.
 * @param {Element} element - Any DOM element
 * @param {string} [filter] - Optional filter for css selectors that parent must match
 * @param {string} [stop] - Optionally stop at css selector or at first matching parent if stop === true
 * @return {array} - Array of parent elements
 */
function getParents(element, filter = '*', stop = false) {
  var parents = [];
  while (element) {
    if (element.matches(filter)) {
      parents.unshift(element);
    }
    if (stop) {
      if (stop === true || element.matches(stop)) {
        return parents;
      }
    }
    element = element.parentElement;
  }
  parents.pop();
  return parents.reverse();
}

/**
 * Removes hash from URL without changing scoll position
 * and without affecting browser history
 */
function removeHash() {
  var scrollV, scrollH, loc = window.location;
  if ('pushState' in history)
      history.pushState('', document.title, loc.pathname + loc.search);
  else {
      // Prevent scrolling by storing the page's current scroll offset
      scrollV = document.body.scrollTop;
      scrollH = document.body.scrollLeft;
      loc.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scrollV;
      document.body.scrollLeft = scrollH;
  }
}
