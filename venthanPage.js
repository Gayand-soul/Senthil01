// Kontrollera vilken sida vi är på
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  // === JS för index.html ===

  document.querySelectorAll('.image-column img').forEach((img, index) => {
    img.addEventListener('click', event => {
      event.preventDefault();

      const allImages = Array.from(document.querySelectorAll('.image-column img'));
      const imagePaths = allImages.map(image => image.getAttribute('data-img'));
      const clickedIndex = allImages.indexOf(img);

      localStorage.setItem('imagePaths', JSON.stringify(imagePaths));
      localStorage.setItem('currentIndex', clickedIndex);

      window.open('viewer.html', '_blank');
    });
  });

} else if (window.location.pathname.includes('viewer.html')) {
  // === JS för viewer.html ===

  const viewerImg = document.getElementById('viewer-img');
  const imagePaths = JSON.parse(localStorage.getItem('imagePaths')) || [];
  let currentIndex = parseInt(localStorage.getItem('currentIndex'), 10) || 0;

  function showImage() {
    if (viewerImg && imagePaths[currentIndex]) {
      viewerImg.src = imagePaths[currentIndex];
    }
  }

  function changeImage(direction) {
    currentIndex = (currentIndex + direction + imagePaths.length) % imagePaths.length;
    showImage();
  }

  document.getElementById('prev')?.addEventListener('click', () => changeImage(-1));
  document.getElementById('next')?.addEventListener('click', () => changeImage(1));

  showImage();
}
