const flipbook = new St.PageFlip(document.getElementById("flipbook"), {
  width: 400,
  height: 500,
  size: "fixed",
  maxShadowOpacity: 0.7,
  showCover: true,
  flippingTime: 800,
  usePortrait: true,
  mobileScrollSupport: false
});

flipbook.loadFromHTML(document.querySelectorAll(".page"));
