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
  const clickedURL = e.toElement.href;
  const clickedHash = clickedURL.replace(window.origin + window.location.pathname + '#', '');
  const element = document.getElementById(clickedHash);
  if (element) {
      element.scrollIntoView({
      behavior: 'smooth'
    });
  }
  initializeScrollspy();
});
