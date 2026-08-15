(function () {
  "use strict";

  var gallery = document.querySelector("[data-life-gallery]");
  var dialog = document.getElementById("life-lightbox");

  if (!gallery || !dialog) {
    return;
  }

  var photos = Array.prototype.slice.call(gallery.querySelectorAll(".js-life-photo"));
  var fullImage = dialog.querySelector("[data-life-full-image]");
  var counter = dialog.querySelector("[data-life-counter]");
  var closeButton = dialog.querySelector("[data-life-close]");
  var previousButton = dialog.querySelector("[data-life-previous]");
  var nextButton = dialog.querySelector("[data-life-next]");
  var currentIndex = 0;

  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;

    var button = photos[currentIndex];
    var thumbnail = button.querySelector("img");

    fullImage.src = button.getAttribute("data-full");
    fullImage.alt = thumbnail.alt;
    counter.textContent = (currentIndex + 1) + " / " + photos.length;

    if (!dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("life-lightbox-open");
    }
  }

  photos.forEach(function (button, index) {
    button.addEventListener("click", function () {
      showPhoto(index);
    });
  });

  closeButton.addEventListener("click", function () {
    dialog.close();
  });

  previousButton.addEventListener("click", function () {
    showPhoto(currentIndex - 1);
  });

  nextButton.addEventListener("click", function () {
    showPhoto(currentIndex + 1);
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", function () {
    document.documentElement.classList.remove("life-lightbox-open");
    fullImage.removeAttribute("src");
  });

  document.addEventListener("keydown", function (event) {
    if (!dialog.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      showPhoto(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      showPhoto(currentIndex + 1);
    }
  });
}());
