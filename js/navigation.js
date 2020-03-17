/**
 * BASIC TOC FUNCTIONALITY
 */

document.addEventListener('DOMContentLoaded', enableToc);

function enableToc() {

  /* scroll toc to currents main section */
  const pageID = document.querySelector('body').getAttribute('id');

  /* TODO: doesn#t work. minor issue but check why */
  document.querySelector('#toc_cb_' + pageID).scrollIntoView({behavior: "smooth"});

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
    })
  })
  document.tocInitialized = true;
}

function tickBox(anchorElement) {
  var parent = anchorElement.parentNode;
  var checkbox = parent.previousElementSibling;
  if (checkbox.disabled) {
    //return true;
  }
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



/**
 * SCROLLSPY FOR TOC
 */

/* trigger initialization when page is loaded completely */
document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    initializeScrollspy();
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
  /* cache all headline elements */
  document.headingsSelector = ['div#content h4', 'div#content h5', 'div#content h6']
  document.headingsElementsArray = [];
  document.querySelectorAll(document.headingsSelector.join(', ')).forEach(element => {
    document.headingsElementsArray.push(element);
  });

  console.log(document.headingsElementsArray);

  /* remove existing eventlistener (for pageswitch) before adding it again */
  window.removeEventListener('scroll', handleScrollEvent, { scrollspy: true });
  window.addEventListener('scroll', handleScrollEvent, { scrollspy: true });
}

function handleScrollEvent() {
  document.headingsElementsArray.forEach(element => {
    const etopY = element.offsetTop - 50;
    const ebottomY = etopY + element.parentElement.offsetHeight;
    if (window.scrollY >= etopY && window.scrollY <= ebottomY) {
      const anchorElement = document.querySelectorAll('#toc_cb_' + element.id + ' + label > a')[0];
      if (anchorElement !== null) {
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

/* loop through cached heading elements starting at the end
   until scrollposition is no longer larger than element position
   highlight last element */
// function handleScrollEvent() {
//   //window.cancelIdleCallback(document.scrollHandleTimer);
//   window.clearTimeout(document.scrollHandleTimer);
//   //document.scrollHandleTimer = window.requestIdleCallback(() => {
//   document.scrollHandleTimer = window.setTimeout(() => {
//     /* deep copy elements stack */
//     var elementsStack = JSON.parse(JSON.stringify(document.headingsElementsArray.reverse()));
//     var elementPosition = 0;
//     while (window.scrollY > elementPosition && elementsStack.length > 1) {
//       elementPosition = elementsStack.pop().offsetTop;
//     }
//     var elementToHighlight = elementsStack.pop().id;
//     console.log('highlight ' + elementToHighlight)
//     //}, {timeout: 3000 });
//   }, 500);
// }

