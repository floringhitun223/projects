console.log('Firebase.js loaded');
console.log('Initializing navigation components...');

// Navigation logic (if used)
const navbarItems = document.querySelectorAll('.navbar-item');
const detailSections = document.querySelectorAll('.detail-section');

console.log('Found navbar items:', navbarItems.length);
console.log('Found detail sections:', detailSections.length);

navbarItems.forEach(item => {
  item.addEventListener('click', () => {
    navbarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const targetId = item.getAttribute('data-target');
    const currentActive = document.querySelector('.detail-section.active');
    const targetSection = document.getElementById(targetId);

    if (currentActive === targetSection) return;

    currentActive.classList.remove('active');
    setTimeout(() => {
      targetSection.classList.add('active');
    }, 100);
  });
});

// Optional: search bar interaction
const searchInput = document.getElementById('search-input');
const search = document.querySelector('.search');
const account = document.querySelector('.account');

if (searchInput) {
  searchInput.addEventListener('focus', () => {
    search.style.marginLeft = "0px";
    account.style.display = "none";
    search.style.height = "calc(100% - 15px)";
    search.style.borderRadius = "0px";
    search.style.width = '100%';
    search.style.maxWidth = '100%';
  });

  searchInput.addEventListener('blur', () => {
    search.style.marginLeft = "20px";
    account.style.display = "flex";
    search.style.height = "calc(100% - 30px)";
    search.style.borderRadius = "8px";
    search.style.width = '100%';
    search.style.maxWidth = '400px';
  });
}

// ✅ Quill Editor Setup
const quill = new Quill('#d-e-worksheet-input', {
  theme: 'snow',
  modules: {
    toolbar: false,
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    }
  }
});

// ✅ Format Buttons (use Quill API only)
document.getElementById('format-bold').addEventListener('click', () => {
  quill.format('bold', true);
});

document.getElementById('format-italic').addEventListener('click', () => {
  quill.format('italic', true);
});

document.getElementById('format-underline').addEventListener('click', () => {
  quill.format('underline', true);
});

// ✅ Undo Button
document.getElementById('undo').addEventListener('click', () => {
  quill.history.undo();
  console.log('Undo triggered');
});
document.getElementById('redo').addEventListener('click', () => {
  quill.history.redo();
  console.log('Undo triggered');
});
 const colorInput = document.getElementById('colorPicker');
  const button = document.getElementById('format-fontSize');

  button.addEventListener('click', () => {
    colorInput.click(); // ✅ this opens the native color picker
  });

  colorInput.addEventListener('input', (e) => {
    const selectedColor = e.target.value;
    console.log('Selected color:', selectedColor);
    button.style.backgroundColor = selectedColor;
  });
// ✅ Log editor content as HTML
function logContent() {
  const html = quill.root.innerHTML;
  console.log(html);
}

// ✅ Optional: Autosave every 5 seconds
setInterval(() => {
  const content = quill.root.innerHTML;
  localStorage.setItem('doc', content);
}, 5000);
