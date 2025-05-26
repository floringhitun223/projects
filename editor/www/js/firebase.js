const navbarItems = document.querySelectorAll('.navbar-item');
const detailSections = document.querySelectorAll('.detail-section');

navbarItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active from navbar items and add to clicked one
    navbarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const targetId = item.getAttribute('data-target');
    const currentActive = document.querySelector('.detail-section.active');
    const targetSection = document.getElementById(targetId);

    if (currentActive === targetSection) return;

    // Start transition: remove active from current to trigger slide+fade out
    currentActive.classList.remove('active');

    // Wait for transition duration before activating new one (to avoid overlap)
    setTimeout(() => {
      targetSection.classList.add('active');
    }, 100); // match the CSS transition duration (0.5s = 500ms)
  });
});
const searchInput = document.getElementById('search-input');
const search = document.querySelector('.search');
const account = document.querySelector('.account');


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
  search.style.Width = '100%';
  search.style.maxWidth = '400px';
});

