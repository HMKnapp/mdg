const miniTocEnabled = true;

var miniTocTimer;

//$('<nav id="minitoc-container"><ul id="minitoc"></ul></nav>').insertAfter('header');

function initializeMiniToc() {
  console.log('initializeMiniToc')
  var miniTocContainer = document.createElement('nav');
  miniTocContainer.setAttribute('id', 'minitoc-container');
  var miniTocList = document.createElement('ul');
  miniTocList.setAttribute('id', 'minitoc');
  miniTocContainer.append(miniTocList);
  var contentElement = document.getElementById('content');
  contentElement.parentNode.insertBefore(miniTocContainer, contentElement);
  return document.getElementById('minitoc');
}

document.scrollspy.disabled = true;
console.log('on first page load initializeMiniToc');
initializeMiniToc();

console.log('on first page load handleScrollEvent');
handleScrollEvent();
document.scrollspy.disabled = false;

var lastMiniTocElement;
// element is from document.headingsElementsArray
function refreshMiniToc(element) {
  console.log('refreshMiniToc');
  if (!miniTocEnabled) return;

  if (element.nodeName.toLowerCase() == 'h5' && element.classList.contains('discrete') === false) {
    console.log('scroll inside h5: ' + element.id)
    // avoid costly recreation if scroll within same section
    if (element != lastMiniTocElement) {
      buildMiniTocForSection(element);
      lastMiniTocElement = element; // cache to not rebuild if minitoc for this section already exists
    }
  }
  if (element.nodeName.toLowerCase() == 'h6') {
    console.log('scroll inside h6: ' + element.id)
    highlightMiniTocElementByID(element.id);
  }
}

function highlightMiniTocElementByID(id) {
  console.log('highlight h6: ' + id);

  // on click of head element of minitoc, removes all highlights
  if (id === 'none') {
    requestAnimationFrame(() => {
      document.querySelectorAll('#minitoc > li').forEach((li) => {
        li.classList.remove('active');
      });
    });
    return true;
  }
  requestAnimationFrame(() => {
    document.querySelectorAll('#minitoc > li').forEach((li) => {
      if (li.getAttribute('data-content-id') == id) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  });
}

function destroyMiniToc() {
  var miniTocElement = document.getElementById('minitoc')
  if (miniTocElement) miniTocElement.innerHTML = '';
}

function buildMiniTocForSection(head) {
  console.log('buildMiniTocForSection for id: ' + head.id)
  document.oldMiniToc = document.getElementById('minitoc'); // store here to replace later
  var miniToc = document.createElement('ul')
  miniToc.setAttribute('id', 'minitoc');

  // create top of minitoc element, "HeadAnchor"
  var headAnchor = document.createElement('a');
  headAnchor.setAttribute('id', 'minitoc-head-anchor');
  headAnchor.setAttribute('href', '#' + head.id);
  headAnchor.addEventListener('click', (event) => {
    handleMiniTocClick(head.id);
  });
  headAnchor.innerHTML = head.innerText;

  // add observer, when scrolling to head, remoe all highlighting from minitoc
  const intersectionObserverOptions = {
    root: null,
    rootMargin: '70px',
    threshold: 1.0
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) { // head element in viewpoert
        highlightMiniTocElementByID('none'); // remove highlighting from subsections in minitoc
      }
    });
  }, intersectionObserverOptions);
  observer.observe(head);

  var headElement = document.createElement('li');
  headElement.setAttribute('id', 'minitoc-header');

  headElement.append(headAnchor);
  miniToc.append(headElement);

  // nex elements are descendants of nephews
  var subsectionElements = [];
  elementNextAll(head).forEach((e) => {
    if (e.matches('div.sect5')) {
      e.querySelectorAll('h6').forEach((h) => {
        subsectionElements.push(h);
      });
    }
  });
  if (subsectionElements.length) {
    subsectionElements.forEach((ss) => {
      var miniTocElement = document.createElement('li')
      miniTocElement.setAttribute('data-content-id', ss.id);
      var miniTocElementAnchor = document.createElement('a');
      miniTocElementAnchor.setAttribute('href', '#' + ss.id);
      miniTocElementAnchor.addEventListener('click', (event) => {
        handleMiniTocClick(ss.id);
      });
      miniTocElementAnchor.innerHTML = ss.innerText;
      miniTocElement.append(miniTocElementAnchor);
      miniToc.append(miniTocElement)
    });

    requestAnimationFrame(() => {
      document.oldMiniToc.replaceWith(miniToc);
    });
  }
  else {
    console.log(head.id + ' has no elements for minitoc')
    document.oldMiniToc.innerHTML = '';
  }
}

function handleMiniTocClick(id) {
  event.stopPropagation();
  event.preventDefault();
  //history.pushState(null, null, '#' + event.delegateTarget.hash);
  //const target = event.delegateTarget;
  console.log('minitoc click, target: ' + id);
  //highlightMiniTocElementByID(id);
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  /*
  event.preventDefault();
   history.pushState(null, null, '#' + sectionID);
   */
}

function elementNextAll(element) {
  var siblings = [];
  while (element.nextElementSibling) {
    siblings.push(element.nextElementSibling);
    element = element.nextElementSibling;
  }
  return siblings;
}