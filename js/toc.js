function enableToc() {
  /* if page is openen with a deep link (hash), check the correct box (if it exists) */
  var hash = window.location.hash.substring(1);
  if (hash) {
    var initialTocLink = document.querySelectorAll('#toc_cb_' + hash + ' + label > a')[0];
    console.log('initialTocLink');
    console.log(initialTocLink)
   
    if (initialTocLink) {
      initBoxes(initialTocLink);
    }
    // TODO: rewrite and walk through all parents
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
  var sameLevelCheckboxes = parent.parentNode.parentNode.querySelectorAll(':scope > li > input[type=checkbox]');
    for(var cb of sameLevelCheckboxes.entries()) {
      var other_cb = cb[1];
      other_cb.checked = false;
      console.log(other_cb)
    }
  checkbox.checked = setTo;

  /* if click has unchecked the cb, go to parent) */
  if (checkbox.checked == false) {
    
    //location.href = parent.parentNode.parentNode.previousElementSibling.firstChild.getAttribute('href');
  }
  return true;
}



/* uncheck all "sibling" checkboxes on same level and 
    check the corresponding checkbox belonging to clicked <a> */
function initBoxes(anchorElement) {
  try {
    var parent = anchorElement.parentNode;
    var checkbox = parent.previousElementSibling;
    console.log('curr checkbox:')
    console.log(checkbox)
    var sameLevelCheckboxes = parent.parentNode.parentNode.querySelectorAll(':scope > li > input[type=checkbox]');
    for(var cb of sameLevelCheckboxes.entries()) {
      var other_cb = cb[1];
      other_cb.checked = false;
      console.log(other_cb)
    }
    //if(checkbox.disabled == false) {
      checkbox.checked = true;
    //}
  }
  catch (e) {
    console.log(e)
  }

  /* tick parent boxes */
  try {
    //console.log('enter ancestors of ' + checkbox.getAttribute('id'))
    var ancestor_anchor = parent.parentNode.parentNode.previousElementSibling.firstChild;
    initBoxes(ancestor_anchor);
  }
  catch(e) {
    console.log('no more ancestor found');
  }
}
