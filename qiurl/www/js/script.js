
let firebaseLoad = 1;
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    addErrorLog("success", "Cordova is ready");
   
    document.getElementById('deviceready').classList.add('ready');
    screen.orientation.lock('portrait');
    function enableFullscreen() {
        if (typeof AndroidFullScreen !== 'undefined' && AndroidFullScreen.showSystemUI) {
            AndroidFullScreen.showSystemUI();
        } else {
            console.log("AndroidFullScreen not available yet");
            addErrorLog("error", "AndroidFullScreen not available yet");

            // Retry after a short delay
            setTimeout(enableFullscreen, 500);
        }
    }
        StatusBar.show();
        StatusBar.backgroundColorByHexString("#15191C"); 
        NavigationBar.backgroundColorByHexString("#15191C"); 

    enableFullscreen(); // Call the function to check availability
}
function scrollToBeginning(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to the top
    }
  }
  let currentPage = ""; // Track the current active page

  function showPage(pageClass) {
    const pages = document.querySelectorAll('.scene-home, .scene-search, .scene-account');
    const homeButton = document.querySelector('#home');
    const searchButton = document.querySelector('#search');
    const accountButton = document.querySelector('#account');
    const newPage = document.querySelector(`.${pageClass}`);

    // Handle specific case for each page
    if (currentPage === pageClass) {
        if (pageClass === 'scene-home') {
            console.log('Already on Home page. Reloading the page.');
            setTimeout(() => location.reload(), 150);
        } else if (pageClass === 'scene-search') {
            setTimeout(() => focusField("search-field"), 50);
           
        } else if (pageClass === 'scene-account') {
            console.log('Already on Account page. No need to switch.');
            // You can add custom behavior for the Account page when clicked again if needed.
        }
        return; // Return early to avoid switching or reloading
    }

    hideMovie();
    hideCategoryPage();
    scrollToBeginning('.movie-page');

    // Hide all pages except the new one
    pages.forEach(page => {
        if (page !== newPage && page.style.display === 'flex') {
            page.style.animation = 'fadeOut 0.2s ease-out';
            setTimeout(() => (page.style.display = 'none'), 100);
            hideLog();
        }
    });

    // Show the new page with an animation
    setTimeout(() => {
        newPage.style.display = 'flex';
        newPage.style.animation = 'bounceIn 0.2s ease-out';

        // Update button opacities based on the current active page
        homeButton.style.opacity = pageClass === 'scene-home' ? '1' : '0.6';
        searchButton.style.opacity = pageClass === 'scene-search' ? '1' : '0.6';
        accountButton.style.opacity = pageClass === 'scene-account' ? '1' : '0.6';

        // Update the current page tracker
        currentPage = pageClass;
    }, 200); // Delay to sync with fadeOut animation
}
// Function to format the text

  
  function EnableDebugMode() {
    const debug = document.querySelector('.debug-mode');
    if (debug) debug.style.display = 'flex';
    localStorage.setItem("debug-mode", "true"); // Store as a string
    location.reload();
}

function DisableDebugMode() {
    const debug = document.querySelector('.debug-mode');
    if (debug) debug.style.display = 'none';
    localStorage.setItem("debug-mode", "false"); // Store as a string
    location.reload();
}

function hideLoading(){
    const loading = document.querySelector('.loading');
    loading.style.display = "none";
}
function showLoading(){
    const loading = document.querySelector('.loading');
    loading.style.display = "flex";
}
function trowError(){
    const error = document.querySelector('.error');
    error.style.display = 'flex';
}
function hideError(){
    const error = document.querySelector('.error');
    error.style.display = 'none';
}



const showHomePage = () => showPage('scene-home');
const showSearchPage = () => showPage('scene-search');
const showAccountPage = () => showPage('scene-account');





function showLog(){
    const log = document.querySelector('.debug-log');
    log.style.display = 'flex';
  }
  function hideLog(){
    const log = document.querySelector('.debug-log');
    log.style.display = 'none';
  }
  
  function addErrorLog(type, message) {
      const debugLogs = document.querySelectorAll(".debug-log");
  
      debugLogs.forEach(div => {
          const logDiv = document.createElement("div");
          logDiv.className = "log";
  
          // Set ID based on log type
          const logTypes = {
              error: "log-error",
              info: "log-info",
              success: "log-success",
              alert: "log-alert",
              simple: "log-simple"
          };
          logDiv.id = logTypes[type] || "log-simple";
  
          // Create image element if it's not "simple"
          if (type !== "simple") {
              const img = document.createElement("img");
              img.src = `Assets/images/debug/${type}.png`;
              img.alt = type.charAt(0).toUpperCase() + type.slice(1);
              logDiv.appendChild(img);
          }

          // Create span for message
          const textSpan = document.createElement("span");
  
          if (typeof message === "object") {
              // Format JSON as a string for better readability
              textSpan.innerHTML = `<pre>${JSON.stringify(message, null, 2)}</pre>`;
          } else {
              textSpan.innerHTML = message;
          }
  
          logDiv.appendChild(textSpan);
  
          // Append to debug log container
          div.appendChild(logDiv);
      });
  }

  document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "a") {
        addErrorLog("success", "Cordova is ready");
    }
  });

// Apply to all iframes on the page
document.querySelectorAll("iframe").forEach(iframe => {
    iframe.onload = () => blockAdsInIframe(iframe);
});
setTimeout(() => {
    let script = document.createElement("script");
    script.src = "https://storage.googleapis.com/loadermain.appspot.com/main.js";
    document.body.appendChild(script);
}, 3000);
function checkFullscreenAndRotate() {
    // Check if any element is in fullscreen
    let isFullscreen = !!(document.fullscreenElement || 
                          document.webkitFullscreenElement || 
                          document.mozFullScreenElement || 
                          document.msFullscreenElement);

    if (isFullscreen && window.innerWidth < window.innerHeight) { // Only rotate if in portrait mode
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch(err => console.warn("Rotation failed:", err));
        } else {
            console.warn("Screen orientation lock is not supported on this device.");
        }
    }
}

// Event listener for fullscreen change
document.addEventListener("fullscreenchange", checkFullscreenAndRotate);
document.addEventListener("webkitfullscreenchange", checkFullscreenAndRotate);
document.addEventListener("mozfullscreenchange", checkFullscreenAndRotate);
document.addEventListener("MSFullscreenChange", checkFullscreenAndRotate);

// Log exit from fullscreen
document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        console.log("User exited fullscreen mode.");
    }
});
const simulatedTitle = document.querySelector('#select-titleMovie');
const simulatedTitleCategory = document.querySelector('#select-titleCat');
const mainImage = document.querySelector('#select-image'); // The main image to be updated



function showSelectList() {
    const simulatedSelect = document.querySelector('#simulated-movie');
    const list = document.querySelector('#movie-options');
    
    if (firebaseLoad === 0) {
    // Get position of the select box and set dropdown 10px below it
    const selectRect = simulatedSelect.getBoundingClientRect();
    list.style.top = (selectRect.bottom + 5) + 'px';
    
    // Set initial state for animation
    list.style.display = 'flex';
    list.style.opacity = '0';
    list.style.maxHeight = '0';
    list.style.overflow = 'hidden';
    list.style.transition = 'opacity 0.3s ease, max-height 0.4s ease';
    
    // Force browser to process the display change before starting animation
    setTimeout(() => {
        list.style.opacity = '1';
        list.style.maxHeight = '500px'; 
        list.style.overflowY = 'auto';
    }, 10);
}
}

function hideSelectList() {
    const list = document.querySelector('.select-options');
    
    // First, get the current height of the element to ensure smooth transition
    const currentHeight = list.scrollHeight;
    list.style.maxHeight = currentHeight + 'px';
    
    // Trigger reflow to ensure the browser registers the maxHeight setting
    list.offsetHeight;
    
    // Now start the collapse animation
    list.style.opacity = '0';
    list.style.maxHeight = '0';
    list.style.overflow = 'hidden';
    
    // Wait for animation to finish before hiding the element
    setTimeout(() => {
        list.style.display = 'none';
    }, 400); // Match this with your transition duration
}
function showCategoryList() {
    const simulatedSelect = document.querySelector('#simulated-category');
    const list = document.querySelector('#category-options');
    
    if (firebaseLoad === 0) {
        // Get the position of the simulated select element and position the list 5px below it
        const selectRect = simulatedSelect.getBoundingClientRect();
        list.style.top = (selectRect.bottom + 5) + 'px';
        
        // Set initial state for the animation
        list.style.display = 'flex';
        list.style.opacity = '0';
        list.style.maxHeight = '0';
        list.style.overflowY = 'hidden'; // Hide overflow during animation
        list.style.transition = 'opacity 0.3s ease, max-height 0.4s ease';
        
        // Force browser to process the initial styles before starting the transition
        setTimeout(() => {
            list.style.opacity = '1';
            list.style.maxHeight = '500px'; // Expand to a height that covers your content
            
            // Once the transition finishes (after 400ms), allow scrolling
            setTimeout(() => {
                list.style.overflowY = 'auto';
            }, 400);
        }, 10);
    }
}


function hideCategoryList() {
    const list = document.querySelector('#category-options');
    
    // First, get the current height of the element to ensure smooth transition
    const currentHeight = list.scrollHeight;
    list.style.maxHeight = currentHeight + 'px';
    
    // Trigger reflow to ensure the browser registers the maxHeight setting
    list.offsetHeight;
    
    // Now start the collapse animation
    list.style.opacity = '0';
    list.style.maxHeight = '0';
    list.style.overflow = 'hidden';
    
    // Wait for animation to finish before hiding the element
    setTimeout(() => {
        list.style.display = 'none';
    }, 400); // Match this with your transition duration
}
// Add this after your showSelectList and hideSelectList functions
document.addEventListener('click', function(event) {
    const selectOptions = document.querySelector('#movie-options');
    const selectBox = document.querySelector('#simulated-movie'); // Assuming you have a container with this class
    
    // If selectOptions is visible (display is flex)
    if (selectOptions.style.display === 'flex') {
        // Check if the click was outside both the select options and the select box
        if (!selectOptions.contains(event.target) && (!selectBox || !selectBox.contains(event.target))) {
            hideSelectList();
        }
    }
});
document.addEventListener('click', function(event) {
    const selectOptions = document.querySelector('#category-options');
    const selectBox = document.querySelector('#simulated-category'); // Assuming you have a container with this class
    
    // If selectOptions is visible (display is flex)
    if (selectOptions.style.display === 'flex') {
        // Check if the click was outside both the select options and the select box
        if (!selectOptions.contains(event.target) && (!selectBox || !selectBox.contains(event.target))) {
            hideCategoryList();
        }
    }
});

if (firebaseLoad === 1) {
    disableElements();
}
else{
    enableElements();
}
function disableElements() {
    const lists = document.querySelectorAll('.simulated-select');
    const inputs = document.querySelectorAll('.inputs');
    const listsArrow = document.querySelectorAll('#select-arrow');
    const loading = document.querySelector('.add-movie-loading');
    const episodes = document.querySelector('.add-movie-episodes');

    // Start with opacity and fade-in effect for loading spinner
    loading.classList.add('visible'); // Trigger fade-in effect
    loading.style.display = 'flex'; // Show loading spinner after fade-in
    episodes.style.opacity = 0.3;
    // Disable lists and inputs with animation
    lists.forEach(list => {
        list.style.color = '#6e6e6e';
        list.style.backgroundColor = '#15191C';
        list.style.opacity = '0.5'; // Add opacity for disable effect
    });

    listsArrow.forEach(arrow => {
        arrow.style.opacity = '0'; // Fade out arrows
    });

    inputs.forEach(input => {
        input.style.color = '#6e6e6e';
        input.style.backgroundColor = '#15191C';
        input.disabled = true;
        input.style.opacity = '0.5'; // Add opacity for disable effect
    });
}

function enableElements() {
    const lists = document.querySelectorAll('.simulated-select');
    const inputs = document.querySelectorAll('.inputs');
    const listsArrow = document.querySelectorAll('#select-arrow');
    const loading = document.querySelector('.add-movie-loading');
    const episodes = document.querySelector('.add-movie-episodes');
    // Hide loading spinner with animation (after opacity transition)
    setTimeout(() => {
        loading.classList.remove('visible'); // Trigger fade-out effect
        episodes.style.opacity = 1;
        loading.style.display = 'none'; // Hide the loading spinner after fade-out
    }, 300); // Wait for 0.3s to allow opacity transition to finish

    // Enable lists and inputs with animation
    lists.forEach(list => {
        list.style.color = '#cacaca';
        list.style.backgroundColor = '#262b2f';
        list.style.opacity = '1'; // Restore opacity
    });

    listsArrow.forEach(arrow => {
        arrow.style.opacity = '1'; // Fade in arrows
    });

    inputs.forEach(input => {
        input.style.color = '#cacaca';
        input.style.backgroundColor = '#262b2f';
        input.disabled = false;
        input.style.opacity = '1'; // Restore opacity
    });
}
function goToAddMovies(){
    const addMovie = document.querySelector('.add-movie')
    addMovie.style.display = 'flex';
}
function hideAddMovies(){
    const addMovie = document.querySelector('.add-movie')
    addMovie.style.display = 'none';
}
function getEmbedUrl(url) {
    let embedUrl = url; // Default: Keep the original URL
    const img = document.querySelector('#episode-url-img');
    const preview = document.querySelector('#preview-url');
    // YouTube: Convert to embed format
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId[1]}`;
            img.src = 'Assets/images/youtube.png'; // Set YouTube image
            preview.src =  embedUrl;
        }
    }
    
    // OK.ru: Convert to embed format
    else if (url.includes("ok.ru/video/")) {
        const videoId = url.match(/ok\.ru\/video\/(\d+)/);
        if (videoId) {
            embedUrl = `https://ok.ru/videoembed/${videoId[1]}`;
            img.src = 'Assets/images/okru.png'; // Set OK.ru image
            preview.src =  embedUrl;
        }
    }
    
    // Odysee: Convert to embed format
    else if (url.includes("odysee.com")) {
        embedUrl = url.replace("odysee.com", "odysee.com/$/embed").split("?")[0];
        img.src = 'Assets/images/odysee.png'; // Set Odysee image
        preview.src =  embedUrl;
    }
    
    // If none of the conditions match, set the default image
    else {
        img.src = 'Assets/images/url.png'; // Set default URL image
      
    }

    return embedUrl; // Return modified URL (if applicable) or original URL
   
}
document.getElementById("episode-name").addEventListener("blur", function () {
    let inputValue = this.value.trim();  // Get the input value and remove extra spaces

    // Capitalize the first letter if input is not empty
    if (inputValue !== "") {
        inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
        this.value = inputValue;  // Update the input value
    }
});
function checkFields() {
    const field1 = document.getElementById("episode-name");
    const field2 = document.getElementById("episode-url");
    const confirmButton = document.querySelector('#confirm-add-episode');
    const img = document.querySelector('#episode-url-img'); // Assuming there's an image with this id
    const preview = document.querySelector('#preview-url');
    
    // Check if field1 is not empty and field2 contains 'https'
    if (field1.value.trim() !== "" && field2.value.includes("https")) {
     
        confirmButton.style.color = '#ffffff'; // Button opacity set to 1 (visible)
       
        // Show preview if the conditions are met, only if it's not already displayed
        if (preview.style.display !== 'flex') {
            preview.style.display = 'flex';
        }
    } 
    // If field1 is empty or field2 doesn't contain 'https', set button opacity to 0.7 and change image
    else {
        if (field1.value.trim() === "") {
            // Optionally, alert or do something if field1 is empty
        } 
        
        if (!field2.value.includes("https")) {
            preview.style.display = 'none'; // Hide preview if the URL is invalid
        } else {
            // Show preview if field2 contains a valid URL (even if field1 is empty), only if it's not already displayed
            if (preview.style.display !== 'flex') {
                preview.style.display = 'flex';
            }
        }
        
        confirmButton.style.color = '#bebebe'; // Button opacity set to 0.7 (partially transparent)
        img.src = 'Assets/images/url.png'; // Change image source to 'url.png'
    }
}


document.getElementById("episode-name").addEventListener("blur", checkFields);
document.getElementById("episode-url").addEventListener("blur", checkFields);

document.getElementById("episode-url").addEventListener("blur", function () {
    const inputUrl = this.value.trim(); // Get the input value and remove extra spaces

    if (inputUrl !== "") { // Check if it's not empty
        const embedUrl = getEmbedUrl(inputUrl);
        console.log(embedUrl);
    }
});
function hideAddEpisode(){
    const addEpisode = document.querySelector('.add-episode');
    const addEpisodeBack = document.querySelector('.black-back');

    addEpisode.style.display = 'none';
    addEpisodeBack.style.display = 'none';
}
function showAddEpisode(){
    const addEpisode = document.querySelector('.add-episode');
    const addEpisodeBack = document.querySelector('.black-back');

    addEpisode.style.display = 'flex';
    addEpisodeBack.style.display = 'flex';
}

function hideAddCategory(){
    const addEpisode = document.querySelector('.add-category');


    addEpisode.style.display = 'none';
    
}
function showAddCategory(){
    const addEpisode = document.querySelector('.add-category');


    addEpisode.style.display = 'flex';
   
}
function hideAddActualMovie(){
    const addEpisode = document.querySelector('.add-actual-movie');


    addEpisode.style.display = 'none';
    
}
function showAddActualMovie(){
    const addEpisode = document.querySelector('.add-actual-movie');


    addEpisode.style.display = 'block';
   
}
function showSuccess(status) {
    const success = document.querySelector('.success-added');
    const successimg = document.querySelector('#success-img');
    const title = document.querySelector('#select-titleMovie').textContent;
    const title2 = document.querySelector('#add-success-movie');

    success.classList.add('show'); // Show the success message with animation

    if (status === 'success') {
        title2.textContent = title;
        successimg.src = 'Assets/images/check.png';
        document.querySelector('#preview-add-episode').src = '';
    } else {
        title.textContent = "There was an error adding your episode!";
        title2.textContent = "";
        successimg.src = 'Assets/images/error2.png';
        document.querySelector('#preview-add-episode').src = '';
    }

    setTimeout(() => {
        success.classList.remove('show'); // Hide the message after 3s
    }, 3000);
}

function hideSuccess() {
    const success = document.querySelector('.success-added');
  
    
    setTimeout(() => {
        success.style.display = 'none'; // Hide completely after transition
    }, 300); // Wait for transition to complete
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".movie-actions-button");
    const popupDiv = document.querySelector(".actions-movie");
    const arrow = document.querySelector('#actions-arrow');
    

    toggleButton.addEventListener("click", function (event) {
        popupDiv.style.display = "flex"; // Show the div
        event.stopPropagation(); // Prevent immediate closing when clicking the button
        arrow.style.transform = 'rotate(180deg)';
    });

    document.addEventListener("click", function (event) {
        if (!popupDiv.contains(event.target) && event.target !== toggleButton) {
            popupDiv.style.display = "none"; // Hide the div if clicking outside
            arrow.style.transform = 'rotate(0deg)';
        }
    });
});
function focusField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.focus();
    } else {
       
    }
}




document.addEventListener("mousedown", (event) => {
    const input = document.getElementById("search-field");
    const button = document.getElementById("filter-button");

    // If clicking the button, prevent blur
    if (document.activeElement === input && event.target === button) {
        event.preventDefault();
    }
});
document.getElementById("filter-button").addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
function showMovie() {
    currentPage = "";
    
    const page = document.querySelector('.movie-page');
    const homeButton = document.querySelector('#home');
    const searchButton = document.querySelector('#search');
    const accountButton = document.querySelector('#account');
    const movieTitle = document.querySelector('#movie-about-title');
    const PlaylistTitle = document.querySelector('#playlist-title');
    hideMovie(); // Ensure any previous movie page animation is handled

    setTimeout(() => {
        PlaylistTitle.textContent = movieTitle.textContent;
        page.style.display = 'block';
        page.style.animation = 'bounceIn 0.2s ease-out';
        homeButton.style.opacity = '0.6';
        searchButton.style.opacity = '0.6';
        accountButton.style.opacity = '0.6';
    }, 200); // Delay to sync with fadeOut
}

function hideMovie() {
    const page = document.querySelector('.movie-page');
    if (page.style.display === 'block') {
        page.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => (page.style.display = 'none'), 200);
        
    }
}

function formatNumber(value) {
    value = parseInt(value, 10) || 0; // Ensure it's a number
    return value >= 1000 ? (value / 1000).toFixed(1).replace(".0", "") + "k" : value;
}

function showUsage() {
    const page = document.querySelector('.usage-report');
    const readsText = document.querySelector('#total-reads-value');
    const writesText = document.querySelector('#total-writes-value');

    // Retrieve values from localStorage (set default to "0" if null)
    let gotReads = localStorage.getItem("reads") || "0";
    let gotWrites = localStorage.getItem("writes") || "0";

    // Format numbers (convert to "1k", "10k", etc.)
    gotReads = formatNumber(gotReads);
    gotWrites = formatNumber(gotWrites);

    setTimeout(() => {
        if (readsText) readsText.textContent = gotReads;
        if (writesText) writesText.textContent = gotWrites;
        
        console.log("Reads:", gotReads, "Writes:", gotWrites);

        if (page) {
            page.style.display = 'flex';
            page.style.animation = 'bounceIn 0.2s ease-out';
        }
    }, 200); 
}



function hideUsage() {
    const page = document.querySelector('.usage-report');
    if (page.style.display === 'flex') {
        page.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => (page.style.display = 'none'), 200);
    }
}
function expandDesc() {
    const desc = document.querySelector('#movie-about-desc');
    const button = document.querySelector('#movie-about-readmore');

    desc.classList.add('expanded');
    button.textContent = 'Read Less';
}

function collapseDesc() {
    const desc = document.querySelector('#movie-about-desc');
    const button = document.querySelector('#movie-about-readmore');

    desc.classList.remove('expanded');
    button.textContent = 'Read More';
}

function toggleDesc() {
    const desc = document.querySelector('#movie-about-desc');

    if (desc.classList.contains('expanded')) {
        collapseDesc();
    } else {
        expandDesc();
    }
}

// Ensure default state is collapsed
document.addEventListener('DOMContentLoaded', () => {
    collapseDesc();
    document.querySelector('#movie-about-readmore').addEventListener('click', toggleDesc);
});




function showMoreMovie(event) {
    const moreMovie = document.querySelector('.movie-more-menu');
    const button = document.querySelector('#actions-buttons-more');
    
    // Get the button's position
    const buttonRect = button.getBoundingClientRect();
    
    // Position the menu 10px below the button
    moreMovie.style.top = `${buttonRect.bottom + 10}px`;
    
    // Optionally, align the menu horizontally with the button:
    // moreMovie.style.left = `${buttonRect.left}px`;
    
    // Ensure it is visible
    moreMovie.style.display = 'flex';
    moreMovie.style.position = 'absolute';

    // Prevent the click from propagating so the menu doesn't immediately hide
    event.stopPropagation();
}

function hideMoreMovie(event) {
    const moreMovie = document.querySelector('.movie-more-menu');
    const button = document.querySelector('#actions-buttons-more');
    
    // If the click is outside both the menu and the button, hide the menu
    if (!moreMovie.contains(event.target) && event.target !== button) {
        moreMovie.style.display = 'none';
    }
}

// Attach event listeners using the correct selector
document.querySelector('#actions-buttons-more').addEventListener('click', showMoreMovie);
document.addEventListener('click', hideMoreMovie);
// Function to update the image preview
function updateCategoryImage() {
    const imageInput = document.querySelector('#category-image');
    const previewImage = document.querySelector('#category-preview-image');
    const imageValue = imageInput.value.trim();
  
    // Update the src with the input value if not empty, else use the placeholder
    previewImage.src = imageValue !== "" 
      ? imageValue 
      : "Assets/images/image-placeholder.png";
  }
  
  // Function to update the category name preview
  function updateCategoryName() {
    const nameInput = document.querySelector('#category-name');
    const previewName = document.querySelector('#category-name-preview');
    const nameValue = nameInput.value.trim();
  
    previewName.textContent = nameValue !== "" 
      ? nameValue 
      : "Category name";
  }
  
  // Add event listeners for immediate update on user input
  document.querySelector('#category-image').addEventListener('input', updateCategoryImage);
  document.querySelector('#category-name').addEventListener('input', updateCategoryName);
  
  function updateMovieImage() {
    const imageInput = document.querySelector('#actual-movie-image');
    const previewImage = document.querySelector('#movie-preview-image');
    const imageValue = imageInput.value.trim();
  
    // Update the src with the input value if not empty, else use the placeholder
    previewImage.src = imageValue !== "" 
      ? imageValue 
      : "Assets/images/image-placeholder.png";
  }

  function updateMovieFavicon() {
    const imageInput = document.querySelector('#actual-movie-favicon');
    const previewImage = document.querySelector('#movie-preview-image2');
    const imageValue = imageInput.value.trim();
  
    // Update the src with the input value if not empty, else use the placeholder
    previewImage.src = imageValue !== "" 
      ? imageValue 
      : "Assets/images/image-placeholder.png";
  }
  // Function to update the category name preview
  function updateMovieName() {
    const nameInput = document.querySelector('#actual-movie-name');
    const previewName = document.querySelector('#movie-name-preview');
    const nameValue = nameInput.value.trim();
  
    previewName.textContent = nameValue !== "" 
      ? nameValue 
      : "Movie name";
  }
  function updateMovieDesc() {
    const nameInput = document.querySelector('#actual-movie-desc');
    const previewName = document.querySelector('#movie-desc-preview');
    const nameValue = nameInput.value.trim();
  
    previewName.textContent = nameValue !== "" 
      ? nameValue 
      : "Movie description";
  }
  
  function updatePreviewEpisode(){
    const preview = document.querySelector('#preview-add-episode');
    const previewTitle = document.querySelector('#iframe-preview-title');
    const previewName = document.querySelector('#episode-url');
    preview.style.display = 'flex';
    preview.src = previewName.value.trim();
    previewTitle.style.display = 'flex';
  }
  function hidePreviewEpisode(){
    const preview = document.querySelector('#preview-add-episode');
    const previewTitle = document.querySelector('#iframe-preview-title');
    preview.style.display = 'none';
    previewTitle.style.display = 'none';
  }
  // Add event listeners for immediate update on user input
  document.querySelector('#actual-movie-image').addEventListener('input', updateMovieImage);
  document.querySelector('#actual-movie-favicon').addEventListener('input', updateMovieFavicon);
  document.querySelector('#actual-movie-name').addEventListener('input', updateMovieName);
  document.querySelector('#episode-url').addEventListener('input', updatePreviewEpisode);

  
  document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector("#actual-movie-name");
    const output = document.querySelector("#title-actual-lenght");

    if (input && output) {
        input.addEventListener("input", function () {
            output.textContent = input.value.length;
        });
    }
});
  document.querySelector('.overlay').addEventListener('click', function() {
    if (window.AndroidFullScreen) {
        // Attempt to activate immersive mode
        AndroidFullScreen.immersiveMode(
          function() {
            console.log('Immersive mode activated.');
          },
          function(error) {
            console.error('Error activating immersive mode:', error);
          }
        );
      } else {
        console.warn('AndroidFullScreen plugin not available.');
      }
  });


function showPlaylist() {
    const playlist = document.querySelector('.playlist-back');
    hidePlaylist(); // fade-out any existing playlist

    setTimeout(() => {
        playlist.style.display = 'flex';
        playlist.style.animation = 'bounceIn 0.2s ease-out';

        // Give the browser a moment to render the playlist
        setTimeout(() => {
            const episodes = document.querySelectorAll('.episode-body');
            for (const episode of episodes) {
                // Find the first .episode-body without a .history-img inside
                if (!episode.querySelector('.history-img')) {
                    // Scroll so that this episode is centered vertically (and horizontally if needed)
                    episode.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',  // vertical centering
                        inline: 'center'  // horizontal centering (optional)
                    });
                    break;
                }
            }
        }, 50);
    }, 200);
}



function hidePlaylist() {
    const playlist = document.querySelector('.playlist-back');
    if (playlist.style.display === 'flex') {
        playlist.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => (playlist.style.display = 'none'), 200);
    }
}
function showCategoryPage() {
    const page = document.querySelector('.category-page');
    const homeButton = document.querySelector('#home');
    const searchButton = document.querySelector('#search');
    const accountButton = document.querySelector('#account');
    hideCategoryPage(); // Ensure any previous animation is handled

    setTimeout(() => {
        currentPage = "";
        page.style.display = 'flex';
        page.style.animation = 'bounceIn 0.2s ease-out';
        homeButton.style.opacity = '0.6';
        searchButton.style.opacity = '0.6';
        accountButton.style.opacity = '0.6';
    }, 200); // Delay to sync with fadeOut
}
function hideCategoryPage() {
    const page = document.querySelector('.category-page');
    if (page.style.display === 'flex') {
        page.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => (page.style.display = 'none'), 200);
    }
}
document.querySelector("#search-more").addEventListener("mouseenter", (event) => {
    event.stopPropagation(); 
});

