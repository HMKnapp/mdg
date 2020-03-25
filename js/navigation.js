/**
 * BASIC TOC FUNCTIONALITY
 */

document.addEventListener('DOMContentLoaded', () => {
  enableToc();
  initPageLinks();
});

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
      tickBox(this);
      closeOverlay();
    })
  })
  document.tocInitialized = true;
}

function tickBox(anchorElement) {
  console.log('tickBox')
  console.log(anchorElement)
  var parent = anchorElement.parentNode;
  var checkbox = parent.previousElementSibling;
  if (checkbox.disabled) {
    //return true;
  }
  //var setTo = !checkbox.checked;
  var setTo = true;
  /* uncheck same level end below checkboxes */
  var sameLevelCheckboxes = parent.parentNode.parentNode.querySelectorAll(':scope > li input[type=checkbox]');
  for (var cb of sameLevelCheckboxes.entries()) {
    var other_cb = cb[1];
    other_cb.checked = false;
  }
  checkbox.checked = setTo;
  return true;
}

/* uncheck all "sibling" checkboxes on same level and 
    check the corresponding checkbox belonging to clicked <a> */
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

/* all links in div#content need a click event that triggers ticing of correct boxes after switch
  often only the page.html is available in the TOC, not the deep link anchor
  1. check if whole page.html#anchor is available in TOC. if yes, click it
     if no, take page from page.html, click TOC and scroll to #anchor

  TODO: make it better, knock yourself out
*/
function initPageLinks() {
  console.log('initPageLinks');
  const pageID = window.location.pathname.slice(1, -5).replace(/.*\//,'');
  const pageRootElementAnchor = document.querySelector('#toc_cb_' + pageID + ' + label > a');
  document.querySelectorAll('div#content a').forEach(a => {
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

/**
 * SCROLLSPY FOR TOC
 */

/* trigger initialization when page is loaded completely */
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    initializeScrollspy();
    refreshTitle();
  }
}

/* trigger re-initialization on window resize event */
var resizeTimeout;
window.onresize = () => {
  window.clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    initializeScrollspy();
  }, 500);
}

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

function handleScrollEvent() {
  if (document.scrollspy.disabled) {
    return true;
  }
  document.headingsElementsArray.forEach(element => {
    const etopY = element.offsetTop - 50;
    const ebottomY = etopY + element.parentElement.offsetHeight;
    if (window.scrollY >= etopY && window.scrollY <= ebottomY) {
      const anchorElement = document.querySelectorAll('#toc_cb_' + element.id + ' + label > a')[0];
      if (anchorElement) {
        initBoxes(anchorElement);
      }
    }
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
