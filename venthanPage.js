// Kontrollera vilken sida vi är på
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  // === JS för index.html ===
  document.querySelectorAll('.image-column1 img, .image-column2 img').forEach((img, index) => {
    img.addEventListener('click', event => {
      event.preventDefault();

      const allImages = Array.from(document.querySelectorAll('.image-column1 img, .image-column2 img'));
      const imagePaths = allImages.map(image => image.getAttribute('data-img'));
      const clickedSrc = img.getAttribute('data-img');
      const clickedIndex = imagePaths.indexOf(clickedSrc);

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
      viewerImg.src = imagePaths[currentIndex]; // ← DETTA laddar bilden
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


// Navbar functions--------------------------------------------------------------------
function navigateTo(section) {
  // Hantera specialfallet för viewer.html
  if (window.location.pathname.endsWith('viewer.html')) {
    if (section === 'welcome') {
      // Använd replace istället för href om du inte vill spara viewer.html i historiken
      window.location.replace('index.html');
      return;
    }
  }
  
  // Normal hantering för index.html
  const newUrl = `/${section === 'welcome' ? '' : section}`;
  window.history.pushState({}, '', newUrl);
  loadSection(section);
  
  // Scrolla till toppen för en bättre användarupplevelse
  window.scrollTo(0, 0);
}

// Ladda innehåll beroende på URL
function loadSection(section) {
  // Extrahera bara filnamnet eller sektionsnamnet från sökvägen
  section = section.split('/').pop().replace('index.html', '').replace('.html', '');
  if (section === '' || section === 'index') {
    section = 'welcome';
  }
  
  const content = document.getElementById('main-content');
  if (!content) return;

  const validSections = ['welcome', 'people', 'city', 'street', 'still'];
  if (validSections.includes(section)) {
    const template = document.getElementById(`${section}-template`);
    
    if (template) {
      content.innerHTML = ''; // Rensa innehållet först
      const clone = document.importNode(template.content, true);
      content.appendChild(clone);


      // Lägg till event handlers efter att innehållet laddats
      setTimeout(() => {
        addImageClickHandlers();
        checkImagePaths();
      }, 0);
    } else {
      content.innerHTML = "<p>Mallen saknas.</p>";
    }
  } else {
    content.innerHTML = "<p>Sidan kunde inte hittas.</p>";
  }
}

async function checkImagePaths() {
  const images = document.querySelectorAll('img');
  
  for (const img of images) {
    await new Promise(resolve => {
      if (img.complete) {
        resolve();
      } else {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      }
    });
    
    if (img.naturalHeight === 0) {
      console.error('Bilden laddades inte:', img.src);
    }
  }
}

// Lägg till event listeners för bilder
function addImageClickHandlers() {
  document.querySelectorAll('.image-column1 img, .image-column2 img').forEach((img, index) => {
    img.addEventListener('click', event => {
      event.preventDefault();
      const allImages = Array.from(document.querySelectorAll('.image-column1 img, .image-column2 img'));
      const imagePaths = allImages.map(image => image.getAttribute('data-img'));
      const clickedSrc = img.getAttribute('data-img');
      const clickedIndex = imagePaths.indexOf(clickedSrc);

      localStorage.setItem('imagePaths', JSON.stringify(imagePaths));
      localStorage.setItem('currentIndex', clickedIndex);

      window.open('viewer.html', '_blank');
    });
  });
}

// Stöd för back/forward-knappen i browsern
window.addEventListener('popstate', () => {
  const path = window.location.pathname.slice(1);
  console.log('History change - Laddar sektion:', path);
  loadSection(path || 'welcome');
});

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.slice(1);
  console.log('DOM laddad - Laddar sektion:', path);
  loadSection(path || 'welcome');
});

//Pilen innuti bilden: byter riktn och klicka och byta till nästa bild.
const slideshow = document.getElementById('slideshow');
const cursor = document.getElementById('cursor');

// Lägg till denna kontroll
if (slideshow && cursor) {
    slideshow.addEventListener('mousemove', (e) => {
        const rect = slideshow.getBoundingClientRect();
        const xPos = e.clientX - rect.left;
        const width = rect.width;
        const cursorWidth = 40;
        const cursorHeight = 40;

        // Uppdatera cursor position med kantbegränsning
        const maxLeft = window.innerWidth - cursorWidth / 2;
        const maxTop = window.innerHeight - cursorHeight / 2;

        cursor.style.left = `${Math.min(Math.max(e.clientX, cursorWidth / 2), maxLeft)}px`;
        cursor.style.top = `${Math.min(Math.max(e.clientY, cursorHeight / 2), maxTop)}px`;
        cursor.style.transform = 'translate(-50%, -50%)';

        // Bestäm riktning
        cursor.textContent = xPos < width / 2 ? '◀' : '▶';
    });

    // Hantera klick för bildbyten
    slideshow.addEventListener('click', (e) => {
        const rect = slideshow.getBoundingClientRect();
        const xPos = e.clientX - rect.left;

        // Klickanimation
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 200);

        // Byta bild
        if (xPos < rect.width / 2) {
            changeImage(-1); // Använd changeImage istället för plusSlides
        } else {
            changeImage(1);
        }
    });

    // Visa/dölj cursor
    slideshow.addEventListener('mouseenter', () => {
        cursor.style.display = 'flex';
    });

    slideshow.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
    });
}