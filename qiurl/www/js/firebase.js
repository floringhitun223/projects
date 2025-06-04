let continue_watching;
let from_long_press = 0;
let episode_import = 0;
let from_category = 0;
let page = 1;
let movieCheck = 0;
       

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc,  collection, getDocs, updateDoc, setDoc, query, deleteDoc, deleteField, orderBy, startAt, endAt, limit, startAfter, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
      import { 
        signInWithRedirect, 
        getAuth, 
        onAuthStateChanged, 
        GoogleAuthProvider, 
        getRedirectResult 
      } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
      
      // Your Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyCRmmHyWap3VfoLuSzp2Nl3ZtFks_KZndk",
        authDomain: "qiurl-new.firebaseapp.com",
        projectId: "qiurl-new",
        storageBucket: "qiurl-new.firebasestorage.app",
        messagingSenderId: "86297854793",
        appId: "1:86297854793:web:3df754a207efb7b2189098",
        measurementId: "G-GFKECFFS4H"
      };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
   // Handle redirect result (try to get user data after redirect)
async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("✅ Redirect Sign-In Successful:", result.user);
      // Optionally call your function to update the UI
      if (typeof checkUserLogin === "function") {
        checkUserLogin();
      }
    } else {
      console.log("⚠️ No redirect result found. User may have canceled.");
    }
  } catch (error) {
    console.error("❌ Redirect Sign-In Failed:", error.message);
  }
}

// Listen for authentication state changes (detect if user is logged in)
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ User signed in:", user);
    // Optionally call your function to update the UI
    if (typeof checkUserLogin === "function") {
      checkUserLogin();
    }
  } else {
    console.log("⚠️ No user signed in.");
  }
});

// Add click event listener to your login button to trigger sign-in with redirect
document.getElementById("login")?.addEventListener("click", () => {
  // Ensure you only trigger the redirect once (avoid infinite redirects)
  if (!auth.currentUser) {
    signInWithRedirect(auth, provider).catch((error) => {
      console.error("❌ Redirect failed:", error.message);
    });
  }
});

// Handle redirect result after page loads (it will only handle the result after a successful redirect)
window.addEventListener("load", () => {
  // Check if the user was redirected after login and handle the result
  handleRedirectResult();
});


  

// 🔹 **Log out the user**
function logoutUser() {
  signOut(auth)
      .then(() => {
          console.log("✅ User logged out");
          document.getElementById("user-info").innerText = "You are not logged in.";
      })
      .catch((error) => {
          console.error("❌ Logout failed:", error.message);
      });
}
function checkUserLogin() {
  console.log("🔍 Checking user login status...");
  const noUser = document.querySelector('.not-logged');
  const User = document.querySelector('.user-details');
  const userName = document.querySelector('#user-name');
  const userEmail = document.querySelector('#user-email');
  const userPic = document.querySelector('#user-pic');

  onAuthStateChanged(auth, (user) => {
      console.log("📡 Auth state changed event fired");

      if (user) {
          console.log("✅ User is logged in:", user);
          noUser.style.display = 'none';
          User.style.display = 'flex';

          // Set user details
          userName.textContent = user.displayName || "No Name";
          userEmail.textContent = user.email || "No Email";
          userPic.src = user.photoURL || "default-avatar.png"; // Fallback image
      } else {
          console.log("❌ No user is logged in.");
          noUser.style.display = 'flex';
          User.style.display = 'none';

          // Clear user details
          userName.textContent = "";
          userEmail.textContent = "";
          userPic.src = "";
      }
  });
}



document.addEventListener("DOMContentLoaded", function () {
  let debugMode = localStorage.getItem("debug-mode") === "true"; 
  checkUserLogin();
  if(!debugMode){
    showLoading();
    readField("app", "visibility", "visibility");
    document.querySelector('.debug-mode').style.display = 'none';
    document.querySelector("#debug-mode").checked = false;

  }
  else{
    document.querySelector('.debug-mode').style.display = 'flex';
    document.querySelector("#debug-mode").checked = true;
    if(page ===1){
      showPage('scene-home');
      hideLoading();
    }
    else if(page ===2){
      showPage('scene-search');
      hideLoading();
    }
    else{
      showPage('scene-account');
      hideLoading();
    }
  }
});
window.addEventListener('load', function () {
  const iframe = document.getElementById('iframe');
  const overlay = document.getElementById('overlay');
  const controls = document.querySelector('.iframe-controls');

  if (!iframe || !overlay || !controls) {
    console.error('Could not find iframe, overlay, or controls elements');
    return;
  }

  let hideTimeout;

  // Show controls and hide the overlay so the iframe is fully interactive.
  function showControls() {
    controls.style.display = 'flex';
    overlay.style.display = 'none';
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideControls();
    }, 5000);
  }

  // Hide controls and show the overlay to capture interactions.
  function hideControls() {
    controls.style.display = 'none';
    overlay.style.display = 'block';
  }

  // Initially, make sure the controls are hidden and overlay is active.
  hideControls();

  // When interacting with the overlay, show the controls.
  overlay.addEventListener('click', showControls);
  overlay.addEventListener('touchstart', showControls, { passive: true });

  // Optionally, also show controls when interacting with the iframe area.
  iframe.addEventListener('mouseenter', showControls);
  iframe.addEventListener('touchstart', showControls, { passive: true });
});
document.getElementById('go-video-back').addEventListener('click', function() {
 hideVideo();
 hideMovie();

});
function blockAdsAndPopupsInIframe(iframe) {
  // First, check if the iframe has loaded and is accessible
  if (!iframe || !iframe.contentWindow) {
      console.error("Iframe not found or not accessible");
      return;
  }
  
  try {
      const iframeWin = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument || iframeWin.document;
      
      // If we can't access the document, it's likely due to CORS restrictions
      if (!iframeDoc) {
          console.warn("Cannot access iframe content due to CORS restrictions");
          return;
      }

      // Block popups by overriding window.open
      iframeWin.open = function() {
          console.warn("Popup blocked inside iframe.");
          return null;
      };

      // Block ads by removing ad-related elements
      function removeAds() {
          const adSelectors = [
              'iframe[src*="ads"]',
              'iframe[src*="doubleclick"]',
              'iframe[src*="googleads"]',
              'div[id*="ad"]:not([id*="header"]):not([id*="navigation"])',  // Avoid false positives
              'div[class*="ad"]:not([class*="header"]):not([class*="navigation"])',
              'ins.adsbygoogle',
              'script[src*="ads"]',
              '[data-ad-client]',
              '[id*="gpt"]'
          ];

          adSelectors.forEach(selector => {
              try {
                  const elements = iframeDoc.querySelectorAll(selector);
                  elements.forEach(ad => ad.remove());
                  if (elements.length > 0) {
                      console.log(`Removed ${elements.length} elements matching: ${selector}`);
                  }
              } catch (err) {
                  console.warn(`Error with selector "${selector}":`, err);
              }
          });
      }

      // Remove existing ads immediately
      removeAds();

      // Monitor for links that might open popups
      iframeDoc.addEventListener('click', function(e) {
          const anchor = e.target.closest('a');
          if (anchor) {
              // Check for popup indicators
              if (anchor.getAttribute('target') === '_blank' || 
                  anchor.getAttribute('rel') === 'noopener' ||
                  anchor.href.includes('window.open')) {
                  e.preventDefault();
                  e.stopPropagation();
                  console.warn("Blocked potential popup link:", anchor.href);
                  
                  // Optionally, navigate in the same frame instead
                  // iframe.src = anchor.href;
              }
          }
      }, true);

      // Set up MutationObserver to monitor for dynamically added content
      const observer = new MutationObserver(() => {
          removeAds();
          // Also remove popup-triggering attributes from newly added links
          iframeDoc.querySelectorAll('a[target="_blank"]').forEach(link => {
              link.removeAttribute("target");
          });
      });

      // Start observing with appropriate options
      observer.observe(iframeDoc.body, { 
          childList: true, 
          subtree: true,
          attributes: true,
          attributeFilter: ['src', 'class', 'id', 'style']
      });
      
      console.log("Ad and popup blocking successfully initialized for iframe");
      
  } catch (e) {
      console.error("Error setting up ad blocking:", e);
  }
}

// Usage: Call this function once the iframe has fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
      if (iframe.complete) {
          blockAdsAndPopupsInIframe(iframe);
      } else {
          iframe.addEventListener('load', () => {
              blockAdsAndPopupsInIframe(iframe);
          });
      }
  });
  
  // Also apply to any iframes added dynamically to the page
  const documentObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
              if (node.nodeName === 'IFRAME') {
                  node.addEventListener('load', () => {
                      blockAdsAndPopupsInIframe(node);
                  });
              }
          });
      });
  });
  
  documentObserver.observe(document.body, { childList: true, subtree: true });
});
const continueMovieButton = document.querySelector('.continue-movie');

continueMovieButton.addEventListener('click', async (event) => {
  try {
    // Get the collection name and the field name (field name is now stored in .continue-episode)
    const collectionName = continueMovieButton.querySelector('.continue-title').textContent.trim();
    const docId = continueMovieButton.querySelector('.continue-episode').textContent.trim();
    const fieldName = continueMovieButton.querySelector('.continue-episode').textContent.trim(); // Get the field name from .continue-episode

    // Call the readEpisode function with the fixed document name "Episoade"
    await readEpisode(collectionName, docId, fieldName);  // fieldName (e.g., 'URL') is dynamically passed
  } catch (error) {
    console.error("Error handling click:", error);
  }
});

async function readEpisode(collectionName, docId, fieldName) {
  try {
    // Fixed document name is always "Episoade"
    const docRef = doc(db, collectionName, "Episoade");
    const docSnap = await getDoc(docRef);
    const movieTitle = document.querySelector('.continue-title')?.textContent.trim() || "No title";
    const title = document.querySelector('#movie-about-title');
    // Ensure the title updates before fetching details
    title.textContent = movieTitle;
 

    // Clear previous content and fetch new data
    getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
    showMovieLoading();
    showMovie(); 
    scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
    from_category = 0;
    if (docSnap.exists()) {
      const fieldValue = docSnap.data()[fieldName]; // Access the specific field (e.g., 'URL')

      if (fieldValue) {
       playVideo(fieldValue);  // Assuming it's a URL to navigate to
      } else {
        console.log("Field not found in document!");
      }
    } else {
      console.log("No such document!");
      showDialog("not-found", "The connection to the server was lost due to an unexpected error.", "not-found");
    }
  } catch (error) {
    console.error("Error reading document:", error);
    showDialog("Server Error", "There was an unexpected error getting app details. Please try again later.", "internal-error");
  }
}

//------------------------ SETTINGS
document.querySelector("#debug-mode").addEventListener("change", function() {
  if (this.checked) {
    localStorage.setItem("debug-mode", "true"); // Store as a string
    location.reload();
  } else {
    localStorage.setItem("debug-mode", "false"); // Store as a string
    location.reload();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll(".single-setting").forEach(setting => {
    setting.addEventListener("click", function(e) {
      // Log the target of the click event
      console.log("Click event target:", e.target);

      // Select the checkbox within the setting
      const checkbox = this.querySelector(".setting-actions input[type='checkbox']");
      
      // If there is no checkbox, log and return early
      if (!checkbox) {
        console.log("No checkbox found in this setting.");
        return;
      }

      // Log the current state of the checkbox before any changes
      console.log("Checkbox current state before toggle:", checkbox.checked);

      // Check if the clicked target is not the checkbox
      if (e.target !== checkbox) {
        // Toggle the checkbox state manually
        checkbox.checked = !checkbox.checked;

        // Log the new checkbox state after toggling
        console.log("Checkbox new state after toggle:", checkbox.checked);

        // Trigger the 'change' event on the checkbox after toggling
        checkbox.dispatchEvent(new Event('change')); // Manually dispatch 'change' event
      }
    });
  });

  // Attach the event listener for checkbox state change
  document.querySelectorAll(".single-setting input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      console.log("Checkbox state changed to:", this.checked);
      // Perform any action based on the checkbox state
    });
  });
});

//------------------------SETTINGS END


function incrementReads() {
  let reads = localStorage.getItem("reads"); 
  reads = reads ? parseInt(reads) + 1 : 1; // Convert and increment
  localStorage.setItem("reads", reads); 
  console.log("Total Reads:", reads); 
}
function incrementWrites() {
  let writes = localStorage.getItem("writes"); 
  writes = writes ? parseInt(writes) + 1 : 1; // Convert and increment
  localStorage.setItem("writes", writes); 
  
}

async function readField(collectionName, docId, fieldName) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      incrementReads();

      const isLive = `${docSnap.data()[fieldName]}`;

      if (isLive === 'true') {
        document.querySelector("#servers-on-off").checked = true;
        hideLoading();
        showPage('scene-home');

      
            updateContinueWatching();
            getFeatured();
          
        
      } 
      else if (isLive === 'false') {
        hideLoading();
        showDialog("Server Temporarily Unavailable", "The server has been shut down due to an unexpected error. Please try again later.", "internal-error");
      }
    } else {
      console.log("No such document!");
      showDialog("Connection lost", "The connection to the server was lost due to an unexpected error.", "internal-error");
    }
  } catch (error) {
    console.error("Error reading document:", error);
    showDialog("Server Error", "There was an unexpected error getting app details. Please try again later.", "internal-error");
  }
}

let lastTimestamp = null; // Store the timestamp of the last loaded movie
let isLoading = false; // Prevent multiple simultaneous fetches

async function updateContinueWatching(force = false) {
  const continueWatchingSection = document.querySelector(".continue-watching");

  if (!continueWatchingSection) {
    console.error("Required container element is missing.");
    return;
  }

  // Add CSS for bounce animation if not already present
  if (!document.getElementById('continue-watching-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'continue-watching-animation-styles';
    style.textContent = `
      .continue-movie {
        opacity: 1;
        transform: translateX(0);
        transition: all 0.3s ease;
      }
      
      .continue-movie.movie-entering {
        opacity: 0;
        transform: translateX(100px);
        animation: bounceInRight 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      @keyframes bounceInRight {
        0% {
          opacity: 0;
          transform: translateX(100px) scale(0.8);
        }
        60% {
          opacity: 0.8;
          transform: translateX(-10px) scale(1.05);
        }
        80% {
          opacity: 0.9;
          transform: translateX(5px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
      
      /* Alternative smoother bounce */
      @keyframes bounceInRightSmooth {
        0% {
          opacity: 0;
          transform: translateX(80px);
        }
        50% {
          opacity: 0.7;
          transform: translateX(-8px);
        }
        70% {
          opacity: 0.9;
          transform: translateX(4px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  try {
    // If force is true, reset pagination and clear existing content
    if (force) {
      lastTimestamp = null; // Reset pagination
      continueWatchingSection.innerHTML = ""; // Clear existing content
      console.log("Force reload: Clearing cache and reloading from Firebase");
    }

    // Fetch the last 2 watched movies, sorted by timestamp (most recent first)
    const lastWatchedRef = collection(db, "LastWatched");
    const lastWatchedQuery = lastTimestamp 
      ? query(lastWatchedRef, orderBy("timestamp", "desc"), where("timestamp", "<", lastTimestamp), limit(2)) // Pagination by timestamp
      : query(lastWatchedRef, orderBy("timestamp", "desc"), limit(2)); // Initial load or force reload

    const lastWatchedSnap = await getDocs(lastWatchedQuery);

    if (lastWatchedSnap.empty) {
      console.log("No recent watched movies found.");
      if (!lastTimestamp || force) { // If this is the first load/force reload and no movies are found
        continueWatchingSection.innerHTML = "<p>No recent movies to display.</p>";
      }
      return;
    }

    // Clear previous entries on the first load or force reload
    if (!lastTimestamp || force) {
      continueWatchingSection.innerHTML = "";
    }

    // Keep track of animation delay for staggered effect
    let animationDelay = 0;

    // Loop through the documents and display them
    lastWatchedSnap.docs.forEach(async (docSnap, index) => {
      const lastWatchedData = docSnap.data();
      const movieCollectionName = docSnap.id; // Document ID as the movie title
      const episodeFieldName = lastWatchedData.Episode;
      const timestamp = lastWatchedData.timestamp;
      const totalEpisodes = lastWatchedData.total_eps; // Total number of episodes

      if (!movieCollectionName || !episodeFieldName) return;

      // Update lastTimestamp for pagination
      lastTimestamp = timestamp;

      // Extract the episode number (e.g., "Episodul 1" -> "1")
      const episodeNumberMatch = episodeFieldName.match(/Episodul (\d+)/);
      const episodeNumber = episodeNumberMatch ? parseInt(episodeNumberMatch[1], 10) : 0;

      // Calculate the percentage of progress if totalEpisodes exists
      let progressPercent = 0;
      if (totalEpisodes) {
        progressPercent = (episodeNumber / totalEpisodes) * 100;
      }

      // If the progress is 100%, skip this movie
      if (progressPercent === 100) {
        console.log(`Skipping ${movieCollectionName} as progress is 100%`);
        return;
      }

      // Get the URL for the episode (from the "Episoade" document in the movie collection)
      // Force fresh data from Firebase if force parameter is true
      const episodesDocRef = doc(db, movieCollectionName, "Episoade");
      const episodesDocSnap = force 
        ? await getDoc(episodesDocRef, { source: 'server' }) // Force server fetch
        : await getDoc(episodesDocRef); // Use cache if available
      
      let episodeUrl = "";
      if (episodesDocSnap.exists()) {
        episodeUrl = episodesDocSnap.data()[episodeFieldName] || "";
      }

      let finalImg = "";

      // If the URL is a YouTube URL, extract the thumbnail
      if (isYouTubeUrl(episodeUrl)) {
        const youtubeId = extractYouTubeId(episodeUrl);
        if (youtubeId) {
          finalImg = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
        }
      } else {
        // Get the banner image from the movie collection's "Details" document
        // Force fresh data from Firebase if force parameter is true
        const detailsRef = doc(db, movieCollectionName, "Details");
        const detailsSnap = force 
          ? await getDoc(detailsRef, { source: 'server' }) // Force server fetch
          : await getDoc(detailsRef); // Use cache if available
        
        if (detailsSnap.exists()) {
          finalImg = detailsSnap.data().banner_img || "";
        }
      }

      // Create a new .continue-movie div instance with the given structure
      const movieDiv = document.createElement("div");
      movieDiv.classList.add("continue-movie");
      movieDiv.innerHTML = `
        <img src="${finalImg || 'default-image.jpg'}" loading="lazy" alt="${movieCollectionName}" id="continue-movie-img">
        <div class="overlay">
          <img src="Assets/images/play.png" alt="Play Icon">
          ${totalEpisodes ? `
          <div class="continue-progress">
            <div class="continue-progress-flow" style="width: ${progressPercent}%"></div>
          </div>` : ''}
        </div>
        <span class="continue-title">${movieCollectionName}</span>
        <span class="continue-episode">${episodeFieldName}</span>
      `;

      // Add animation class initially (invisible state)
      movieDiv.classList.add("movie-entering");

      // Append the movie div to the section
      continueWatchingSection.appendChild(movieDiv);

      // Trigger animation with staggered delay
      setTimeout(() => {
        // Remove the animation class to trigger the animation
        movieDiv.classList.remove("movie-entering");
        
        // Alternative: if you prefer to keep the class and let CSS handle it
        // movieDiv.style.animationDelay = `${animationDelay}ms`;
      }, animationDelay);

      // Increase delay for next item (staggered effect)
      animationDelay += 150; // 150ms delay between each item

      // Log the added movie
      console.log(`Added .continue-movie: ${movieCollectionName} - ${episodeFieldName}`);

      // Add a long press event listener
      let pressTimer;

      movieDiv.addEventListener("mousedown", (e) => {
        pressTimer = setTimeout(() => {
          handleLongPress();
        }, 500); // Long press threshold in ms
      });

      movieDiv.addEventListener("mouseup", () => {
        clearTimeout(pressTimer);
      });

      movieDiv.addEventListener("mouseleave", () => {
        clearTimeout(pressTimer);
      });

      // Touch support for mobile devices
      movieDiv.addEventListener("touchstart", (e) => {
        pressTimer = setTimeout(() => {
          handleLongPress();
        }, 500);
      });

      movieDiv.addEventListener("touchend", () => {
        clearTimeout(pressTimer);
      });

      movieDiv.addEventListener("touchmove", () => {
        clearTimeout(pressTimer);
      });

      // Your long press action
      function handleLongPress() {
        const collectionName = movieDiv.querySelector('.continue-title').textContent.trim();
        const title = document.querySelector('#movie-about-title');
        title.textContent = collectionName;
        // Clear previous content and fetch new data
        getMovieDetails(collectionName, "Details", "banner_img", "Desc", "Category");
        showMovieLoading();
        showMovie(); // Ensure the movie details section is shown
        scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
      }

      // Add a click event listener for the newly created movie div
      movieDiv.addEventListener("click", async () => {
        try {
          // Get the collection name and field name dynamically from the clicked movie
          const collectionName = movieDiv.querySelector('.continue-title').textContent.trim();
          const docId = movieDiv.querySelector('.continue-episode').textContent.trim();
          const fieldName = movieDiv.querySelector('.continue-episode').textContent.trim(); // Get the field name from .continue-episode

          // Call the readEpisode function with the fixed document name "Episoade"
          await readEpisode(collectionName, docId, fieldName);  // fieldName (e.g., 'URL') is dynamically passed
          getMovieDetails(collectionName, "Details", "banner_img", "Desc", "Category");
          hideMovieLoading();
          hideMovie();
          scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
          from_category = 0;
        } catch (error) {
          console.error("Error handling click:", error);
        }
      });
    });

    // Set isLoading to false once the loading is complete
    isLoading = false;

  } catch (error) {
    console.error("Error fetching data:", error);
    continueWatchingSection.innerHTML = `<p>Error fetching recent movies: ${error.message}. Please try again later.</p>`;
  }
}


// Helper function to check if URL is a YouTube URL
function isYouTubeUrl(url) {
  return /youtube\.com\/watch\?v=/.test(url);
}

// Helper function to extract the YouTube video ID from a URL
function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Listen for scroll events to trigger loading more movies when the user scrolls to the bottom
const continueWatchingSection = document.querySelector(".continue-watching");

continueWatchingSection.addEventListener("scroll", () => {
  const scrollPosition = continueWatchingSection.scrollLeft + continueWatchingSection.clientWidth;
  const scrollWidth = continueWatchingSection.scrollWidth;

  // If the user has scrolled to the end of the container, and we're not already loading more movies
  if (scrollPosition >= scrollWidth - 100 && !isLoading) {
    isLoading = true; // Prevent multiple fetches
    updateContinueWatching(); // Load more movies
  }
});

// Initial call to load the first 2 movies
updateContinueWatching();



async function getAllCategories(collectionName) {
  try {
    // Reference to your collection
    const colRef = collection(db, collectionName);

    // Get all documents from the collection
    const querySnapshot = await getDocs(colRef);

    // Create a variable to store the category names
    let categories = [];

    // Iterate through all documents and store the category names
    querySnapshot.forEach((doc) => {
      incrementReads();
      const categoryName = doc.id; // Use document ID as the category name
      categories.push(categoryName);
    });

    // Sort the categories alphabetically
    categories.sort((a, b) => a.localeCompare(b));

    // Create HTML content after sorting
    let htmlContent = '';
    categories.forEach((categoryName) => {
      htmlContent += `
        <div class="select-option" onclick="hideCategoryList();" id="category-option">
          <input type="radio">
          <span class="option-title">${categoryName}</span>
        </div>
      `;
    });

    // Add the "Add new category" option at the end
    htmlContent += `
      <div class="select-option" onclick="showAddCategory();" id="add-new-category-option">
        <span class="option-title">Add new category</span>
      </div>
    `;

    // Inject the HTML into the parent div
    const parentDiv = document.getElementById('category-options');
    parentDiv.innerHTML = htmlContent;

    // Re-attach event listeners to the newly added divs
    document.querySelectorAll("#category-option").forEach(div => {
      div.addEventListener("click", function() {
        // Uncheck all radio buttons
        document.querySelectorAll("#category-options input[type='radio']").forEach(radio => {
          radio.checked = false;
        });

        // Check only the clicked one
        const radio = this.querySelector("input[type='radio']");
        const categoryTitle = this.querySelector('.option-title').textContent; // Get the selected category title
        if (radio) {
          radio.checked = true;
          // Call getAllMovieFields with the selected category title
          getAllMovieFields('Categories', categoryTitle); 
          firebaseLoad = 1;
          disableElements();
        }

        // Update the simulated title text
        simulatedTitleCategory.textContent = categoryTitle.trim();
        const episodes = document.querySelector('.add-movie-episodes');
        episodes.style.display = 'none';
      });
    });

    // Log success message to console
    console.log('Categories loaded and sorted successfully!');
    firebaseLoad = 0;
    enableElements();

  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}
async function deleteCollection() {
  try {
    const movie = document.querySelector('#select-titleMovie')?.textContent?.trim();
    const cat = document.querySelector('#select-titleCat')?.textContent?.trim();

    if (!movie) {
      console.warn("No movie selected!");
      return showDialog("Selection Error", "No movie title found. Please select a movie first.", "error");
    }

    if (!cat) {
      console.warn("No category selected!");
      return showDialog("Selection Error", "No category title found. Please select a category first.", "error");
    }

    // 1️⃣ Delete all documents in the collection named after `movie`
    const movieCollectionRef = collection(db, movie);
    const movieDocs = await getDocs(movieCollectionRef);

    if (!movieDocs.empty) {
      for (const docSnap of movieDocs.docs) {
        await deleteDoc(doc(db, movie, docSnap.id));
      }
      console.log(`Deleted all documents from the "${movie}" collection.`);
    } else {
      console.warn(`No documents found in the "${movie}" collection.`);
    }

    // 2️⃣ Delete the field named `movie` from the document named `cat` in the "Categories" collection
    const categoryDocRef = doc(db, "Categories", cat);
    const categorySnap = await getDoc(categoryDocRef);

    if (categorySnap.exists()) {
      const data = categorySnap.data();
      if (movie in data) {
        await updateDoc(categoryDocRef, { [movie]: deleteField() });
        console.log(`Deleted field "${movie}" from Categories/${cat}`);
      } else {
        console.warn(`Field "${movie}" does not exist in Categories/${cat}`);
      }
    } else {
      console.warn(`Document "${cat}" not found in the "Categories" collection.`);
    }

    // 3️⃣ Delete the document named `movie` in the "query" collection
    const queryDocRef = doc(db, "query", movie);
    const queryDocSnap = await getDoc(queryDocRef);

    if (queryDocSnap.exists()) {
      await deleteDoc(queryDocRef);
      console.log(`Deleted document "${movie}" from "query" collection.`);
    } else {
      console.warn(`Document "${movie}" not found in "query" collection.`);
    }

    showDialog("Success", `Deleted movie "${movie}" data successfully.`, "success");

  } catch (error) {
    console.error("Error deleting data:", error);
    showDialog("Error", "An unexpected error occurred while deleting records. Please try again later.", "internal-error");
  }
}
async function deleteDocument(collectionName, docId, isContinue) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    
    // Log success message to console
    console.log(`Document successfully deleted: ${collectionName}/${docId}`);
    showDialog("Success", "Category deleted successfully.", "success");
    // Show success dialog only if isContinue is null
    if(isContinue === null) {
      showDialog("Success", "Category deleted successfully.", "success");
    }
    
    return true; // Return success status for function chaining if needed
  } catch (error) {
    // Log detailed error information
    console.error(`Error deleting document ${collectionName}/${docId}:`, error);
    showDialog("Error", error.message || error, "internal-error");
    return false;
  }
}
function DeleteItemType(){
  const cat = document.querySelector('#select-titleCat').textContent.trim();
  const movie = document.querySelector('#select-titleMovie').textContent.trim();

  if(cat != 'Select category'){
    if(movie != 'Select a movie'){
      deleteCollection();
    }
    else{
      deleteDocument("Categories", cat);
    }
  }
  else{
    showDialog("Attention!", "Please select a movie or category first.", "info");
  }
}
async function getAllMovieFields(collectionName, documentId) {
  try {
    // Reference to your collection and document
    const docRef = doc(db, collectionName, documentId);

    // Log the document reference and ID for debugging
    console.log(`Fetching document from ${collectionName} with ID: ${documentId}`);
    
    // Get the document data  
    const docSnapshot = await getDoc(docRef);

    // Check if the document exists
    if (docSnapshot.exists()) {
      incrementReads();
      // Get the data of the document
      const docData = docSnapshot.data();

      // Log the document data to ensure it's being retrieved
      console.log("Document Data:", docData);

      // Create a variable to store the HTML content
      let htmlContent = '';
      simulatedTitle.textContent = 'Select a movie';
      mainImage.src = "Assets/images/image.png"
      // Iterate through all the fields of the document
      Object.keys(docData).forEach((fieldId) => {
        const fieldValue = docData[fieldId];

        // Skip the field with id 'img_cover'
        if (fieldId === 'img_cover') {
          return; // Skip this field
        }

        // Log field data for debugging
        console.log(`Field ID: ${fieldId}, Field Value: ${fieldValue}`);

        // If the field value is a URL (starts with 'http')
        if (fieldValue && typeof fieldValue === 'string' && fieldValue.startsWith('http')) {
          incrementReads();
          htmlContent += `
            <div class="select-option" onclick="hideSelectList();" id="movie-option">
              <input type="radio">
              <img src="${fieldValue}" loading="lazy" alt="Image" class="mv-img">
              <span class="option-title">${fieldId}</span>
            </div>
          `;
        } else if (fieldValue) {
          // Handle non-image fields (display text)
          htmlContent += `
            <div class="select-option" onclick="hideSelectList();" id="movie-option">
              <input type="radio">
              <span class="option-title">${fieldId}</span>
              <span class="field-value">${fieldValue}</span>
            </div>
          `;
        } else {
          // Handle empty fields
          console.log(`Field ${fieldId} is empty or null.`);
        }
      });
      htmlContent += `
      <div class="select-option" onclick="showAddActualMovie();" id="add-new-movie-option">
        <span class="option-title">Add new movie</span>
      </div>
    `;
      // Log the generated HTML content to ensure it's correct
      console.log("Generated HTML Content for Movies:", htmlContent);

      // Inject the HTML into the parent div (#movie-options)
      const parentDiv = document.getElementById('movie-options');
      parentDiv.innerHTML = htmlContent;

      // Re-attach event listeners to the newly added divs
      document.querySelectorAll("#movie-option").forEach(div => {
        div.addEventListener("click", function() {
          // Uncheck all radio buttons
          document.querySelectorAll("#movie-options input[type='radio']").forEach(radio => {
            radio.checked = false;
          });

          // Check only the clicked one
          const radio = this.querySelector("input[type='radio']");
          if (radio) {
            radio.checked = true;

          }

          // Update the simulated title text (similar to category)
          simulatedTitle.textContent = this.querySelector('.option-title').textContent.trim();

          // Update the main image (ensure mainImage exists in your HTML)
          const selectedImage = this.querySelector('.mv-img');
          const episodes = document.querySelector('.add-movie-episodes');
          episodes.style.display = 'flex';
          if (selectedImage) {
            mainImage.src = selectedImage.src;
          }
        });
      });

      // Log success message to console
      console.log('Movies loaded successfully!');
      firebaseLoad = 0;
      enableElements();
    } else {
      console.log("No such document!");
    }
    
  } catch (error) {
    console.error("Error getting document: ", error);
  }
}
async function updateField(collectionName, docId, fieldName, newValue) {
  try {
      const docRef = doc(db, collectionName, docId);
      const button = document.querySelector('#confirm-add-episode');
      const loading = document.querySelector('#loading-add-episode');
      await setDoc(docRef, {
          [fieldName]: newValue
      }, { merge: true });

      if (episode_import === 0){
        showSuccess('success');
      }
      else{
        showDialog("Success", "Youtube playlist succesfully imported and added into your movie.", "success");
        hideMovie();
      }
      incrementWrites();
      button.style.display = 'flex';
      loading.style.display = 'none';
  } catch (error) {
      console.error("Error updating document:", error);
      showDialog("Error", "There was an error adding episode. Please try again later.", "error");
      button.style.display = 'flex';
      loading.style.display = 'none';
  }
}
async function writeField(collectionName, docId, fieldName, newValue) {
  try {
      // Optionally, enforce that collectionName and docId are strings.
      if (typeof collectionName !== 'string') {
          throw new Error("collectionName must be a string");
      }
      if (typeof docId !== 'string') {
          throw new Error("docId must be a string");
      }
      
      const docRef = doc(db, collectionName, docId);
      
      // Write new data to the document, replacing any existing data
      await setDoc(docRef, {
          [fieldName]: newValue
      });
      
      console.log("Document written successfully");
      incrementWrites();
      getAllCategories('Categories');
      goToAddMovies();
      hideAddCategory();
      document.querySelector('#confirm-add-category').style.display = 'flex';
      document.querySelector('#loading-add-category').style.display = 'none';
  } catch (error) {
      console.error("Error writing document:", error);
      showDialog("Error", "There was an error adding category. Please try again later.", "error");
  }
}
async function writeMovie(collectionName, docId, fieldName, newValue) {
  try {
    if (typeof collectionName !== 'string') {
      throw new Error("collectionName must be a string");
    }
    if (typeof docId !== 'string') {
      throw new Error("docId must be a string");
    }
    
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { [fieldName]: newValue });
    
    console.log("Document written successfully");
    incrementWrites();
    movieCheck++;
    checkMovieCount();
    
  } catch (error) {
    console.error("Error writing document:", error);
    showDialog("Error", "There was an error adding movie. Please try again later.", "error");
  }
}
async function writeMovieMerge(collectionName, docId, fieldName, newValue) {
  try {
    if (typeof collectionName !== 'string') {
      throw new Error("collectionName must be a string");
    }
    if (typeof docId !== 'string') {
      throw new Error("docId must be a string");
    }

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { [fieldName]: newValue }, { merge: true }); // Merge with existing data

    incrementWrites();
    movieCheck++;
    checkMovieCount();
    
  } catch (error) {
    console.error("Error writing document:", error);
    showDialog("Error", "There was an unnexpected error. Try again later.", "error");
  }
}

async function UpdateMovie(collectionName, docId, fieldName, newValue) {
  try {
    if (typeof collectionName !== 'string') {
      throw new Error("collectionName must be a string");
    }
    if (typeof docId !== 'string') {
      throw new Error("docId must be a string");
    }
    
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { [fieldName]: newValue }, { merge: true });
    
    console.log("Document updated successfully");
    incrementWrites();
    movieCheck++;
    checkMovieCount();
    
  } catch (error) {
    console.error("Error updating document:", error);
    showDialog("Error", "There was an error adding episode. Please try again later.", "error");
  }
}
async function getAllMoviesFromCategory(collectionName, documentId) {
  try {
    // Create a unique cache key based on parameters
    const cacheKey = `movies_${collectionName}_${documentId}`;
    
    // Try to get data from session storage first
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      console.log('Loading movies from cache...');
      const parsedData = JSON.parse(cachedData);
      
      let htmlContent = '';
      let hasMovies = parsedData.length > 0;
      
      // Fetch all episode counts in parallel
      const episodeCountPromises = parsedData.map(([fieldId]) => getEpisodeCount(fieldId));
      const episodeCounts = await Promise.all(episodeCountPromises);
      
      for (let i = 0; i < parsedData.length; i++) {
        const [fieldId, fieldValue] = parsedData[i];
        const episodeCount = episodeCounts[i];
        console.log(`Movie: ${fieldId} - Episodes: ${episodeCount}`);
        
        const episodeText = episodeCount === 1 ? 'Watch now' : `${episodeCount} episodes`;
        
        htmlContent += `
          <div class="category-movie" onclick="showMovie();">
            <img src="${fieldValue}" loading="lazy" alt="">
            <span class="category-movie-title">${fieldId}</span>
            <span class="category-movie-desc">${episodeText}</span>
          </div>
        `;
      }
      
      const categorySection = document.querySelector('.category-all-section');
      if (categorySection) {
        categorySection.innerHTML = htmlContent;
      } else {
        console.error("Element with class 'category-all-section' not found.");
      }
      
      if (!hasMovies) {
        console.log("No movies available in this category.");
        showDialog(
          "No movies available",
          "There are currently no movies available for you to watch at the moment. Please check back later for updates.",
          "not-found",
          ".category-page"
        );
      }
      
      console.log('Movies loaded successfully from cache!');
      hideCategoryLoading();
      return; // Exit early since we used cached data
    }
    
    // If no cached data, fetch from Firestore
    console.log('Fetching movies from Firestore...');
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      let htmlContent = '';
      let hasMovies = false; // Flag to check if there are movie fields

      const sortedEntries = Object.entries(docData)
        .filter(([fieldId, fieldValue]) => {
          return fieldId !== 'img_cover' && typeof fieldValue === 'string' && fieldValue.startsWith('http');
        })
        .sort(([fieldIdA], [fieldIdB]) => fieldIdA.localeCompare(fieldIdB));

      if (sortedEntries.length > 0) {
        sessionStorage.setItem(cacheKey, JSON.stringify(sortedEntries));
        console.log('Movies cached in session storage.');
      }

      // Fetch all episode counts in parallel
      const episodeCountPromises = sortedEntries.map(([fieldId]) => getEpisodeCount(fieldId));
      const episodeCounts = await Promise.all(episodeCountPromises);

      for (let i = 0; i < sortedEntries.length; i++) {
        const [fieldId, fieldValue] = sortedEntries[i];
        const episodeCount = episodeCounts[i];
        incrementReads();
        hasMovies = true;
        
        console.log(`Movie: ${fieldId} - Episodes: ${episodeCount}`);

        const episodeText = episodeCount === 1 ? 'Watch now' : `${episodeCount} episodes`;

        htmlContent += `
          <div class="category-movie" onclick="showMovie(); ">
            <img src="${fieldValue}" loading="lazy" alt="">
            <span class="category-movie-title">${fieldId}</span>
            <span class="category-movie-desc">${episodeText}</span>
          </div>
        `;
      }

      const categorySection = document.querySelector('.category-all-section');
      if (categorySection) {
        categorySection.innerHTML = htmlContent;
      } else {
        console.error("Element with class 'category-all-section' not found.");
      }

      if (!hasMovies) {
        console.log("No movies available in this category.");
        showDialog(
          "No movies available",
          "There are currently no movies available for you to watch at the moment. Please check back later for updates.",
          "not-found",
          ".category-page"
        );
      }

      console.log('Movies loaded successfully from Firestore!');
      hideCategoryLoading();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
}

async function getSimilarMoviesFromCategory(collectionName, documentId) {
  try {
    // Read the “current” movie’s human-readable title from #movie-about-title
    const titleElement = document.querySelector('#movie-about-title');
    const currentTitle = titleElement ? titleElement.textContent.trim() : null;

    // Create a unique cache key
    const cacheKey = `similar_movies_${collectionName}_${documentId}`;

    // Try to pull cached data first
    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      console.log('Loading similar movies from cache...');
      const parsedData = JSON.parse(cachedData);

      let htmlContent = '';
      let hasMovies = false;
      const seenTitles = new Set();

      // 1a) Filter: skip if fieldId === currentTitle, and dedupe via seenTitles
      const filteredData = [];
      for (const [fieldId, fieldValue] of parsedData) {
        if (fieldId === currentTitle) {
          // Skip “current” movie
          continue;
        }
        if (seenTitles.has(fieldId)) {
          // Skip duplicates
          continue;
        }
        seenTitles.add(fieldId);
        filteredData.push([fieldId, fieldValue]);
      }

      // 1b) Fetch episode counts in parallel for filteredData
      const episodeCountPromises = filteredData.map(([fieldId]) => getEpisodeCount(fieldId));
      const episodeCounts = await Promise.all(episodeCountPromises);

      for (let i = 0; i < filteredData.length; i++) {
        const [fieldId, fieldValue] = filteredData[i];
        const episodeCount = episodeCounts[i];
        hasMovies = true;

        const episodeText = (episodeCount === 1 ? 'Watch now' : `${episodeCount} episodes`);
        htmlContent += `
          <div class="category-movie" onclick="showMovie(); switchToEpisodesTab();">
            <img src="${fieldValue}" loading="lazy" alt="">
            <span class="category-movie-title">${fieldId}</span>
            <span class="category-movie-desc">${episodeText}</span>
          </div>
        `;
      }

      const similarSection = document.querySelector('.movie-similar');
      if (similarSection) {
        similarSection.innerHTML = htmlContent;
      } else {
        console.error("Element with class 'movie-similar' not found.");
      }

      if (!hasMovies) {
        console.log("No similar movies available after filtering.");
        showDialog(
          "No similar movies available",
          "There are currently no similar movies available for you to watch at the moment. Please check back later for updates.",
          "not-found",
          ".movie-page"
        );
      }

      console.log('Similar movies loaded successfully from cache!');
      hideSimilarMoviesLoading();
      return;
    }

    // 2) If cache miss → fetch from Firestore
    console.log('Fetching similar movies from Firestore...');
    const docRef = doc(db, collectionName, documentId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const docData = docSnapshot.data();
      let htmlContent = '';
      let hasMovies = false;
      const seenTitles = new Set();

      // 2a) Build a list of [fieldId, fieldValue] from docData, skipping:
      //      • fieldId === 'img_cover'
      //      • values that aren’t valid URLs
      //      • fieldId === currentTitle (skip current movie)
      //      • duplicates
      const candidateEntries = Object.entries(docData)
        .filter(([fieldId, fieldValue]) => {
          return (
            fieldId !== 'img_cover' &&
            typeof fieldValue === 'string' &&
            fieldValue.startsWith('http') &&
            fieldId !== currentTitle
          );
        })
        .sort(([a], [b]) => a.localeCompare(b));

      const dedupedEntries = [];
      for (const [fieldId, fieldValue] of candidateEntries) {
        if (seenTitles.has(fieldId)) {
          continue; // skip duplicates
        }
        seenTitles.add(fieldId);
        dedupedEntries.push([fieldId, fieldValue]);
      }

      if (dedupedEntries.length > 0) {
        sessionStorage.setItem(cacheKey, JSON.stringify(dedupedEntries));
        console.log('Similar movies cached in session storage.');
      }

      // 2b) Fetch episode counts in parallel for dedupedEntries
      const episodeCountPromises = dedupedEntries.map(([fieldId]) => getEpisodeCount(fieldId));
      const episodeCounts = await Promise.all(episodeCountPromises);

      for (let i = 0; i < dedupedEntries.length; i++) {
        const [fieldId, fieldValue] = dedupedEntries[i];
        const episodeCount = episodeCounts[i];
        incrementReads();
        hasMovies = true;

        const episodeText = (episodeCount === 1 ? 'Watch now' : `${episodeCount} episodes`);
        htmlContent += `
          <div class="category-movie" onclick="showMovie(); switchToEpisodesTab();">
            <img src="${fieldValue}" loading="lazy" alt="">
            <span class="category-movie-title">${fieldId}</span>
            <span class="category-movie-desc">${episodeText}</span>
          </div>
        `;
      }

      const similarSection = document.querySelector('.movie-similar');
      if (similarSection) {
        similarSection.innerHTML = htmlContent;
      } else {
        console.error("Element with class 'movie-similar' not found.");
      }

      if (!hasMovies) {
        console.log("No similar movies available after filtering.");
        showDialog(
          "No similar movies available",
          "There are currently no similar movies available for you to watch at the moment. Please check back later for updates.",
          "not-found",
          ".movie-page"
        );
      }

      console.log('Similar movies loaded successfully from Firestore!');
      hideSimilarMoviesLoading();
    } else {
      console.log("No such document for similar movies!");
    }
  } catch (error) {
    console.error("Error getting similar movies document: ", error);
  }
}


// 3) Tab‐toggle code (unchanged, but re‐included here for completeness)
document.addEventListener("DOMContentLoaded", function () {
  const leftTab = document.querySelector(".movie-episodes-top-left");
  const rightTab = document.querySelector(".movie-episodes-top-right");
  const episodes = document.querySelector('.movie-episodes');
  const similar = document.querySelector('.movie-similar');
  const subtitleElement = document.querySelector('#movie-about-subtitle');

  function toggleActiveTab(selectedTab, otherTab) {
    selectedTab.classList.add("active");
    otherTab.classList.remove("active");

    const selectedText = selectedTab.textContent.trim();
    if (selectedText === 'Episodes') {
      episodes.style.display = 'flex';
      similar.style.display = 'none';
    } else {
      episodes.style.display = 'none';
      similar.style.display = 'flex';

      // When “Similar” is active, fetch using the subtitle as documentId
      if (subtitleElement) {
        const currentDocId = subtitleElement.textContent.trim();
        getSimilarMoviesFromCategory("Categories", currentDocId);
      } else {
        console.error("#movie-about-subtitle element not found.");
      }
    }
  }

  // Expose helper so that “onclick” in generated HTML can switch back
  window.switchToEpisodesTab = function() {
    toggleActiveTab(leftTab, rightTab);
  };

  // Ensure Episodes tab is active on start
  toggleActiveTab(leftTab, rightTab);

  leftTab.addEventListener("click", () => toggleActiveTab(leftTab, rightTab));
  rightTab.addEventListener("click", () => toggleActiveTab(rightTab, leftTab));
});




// Helper function to get episode count without downloading all field data
async function getEpisodeCount(movieName) {
  try {
    // Create cache key for episode counts
    const episodeCacheKey = `episode_count_${movieName}`;
    
    // Check if episode count is already cached
    const cachedCount = sessionStorage.getItem(episodeCacheKey);
    if (cachedCount) {
      return parseInt(cachedCount);
    }
    
    // Get document reference from the movie's collection -> "Episoade" document
    const episodeDocRef = doc(db, movieName, "Episoade");
    const episodeSnapshot = await getDoc(episodeDocRef);
    
    if (episodeSnapshot.exists()) {
      const episodeData = episodeSnapshot.data();
      
      // Count fields (excluding any metadata fields if needed)
      const episodeCount = Object.keys(episodeData).length;
      
      // Cache the episode count
      sessionStorage.setItem(episodeCacheKey, episodeCount.toString());
      
      return episodeCount;
    } else {
      console.log(`No "Episoade" document found in collection: ${movieName}`);
      return 0;
    }
  } catch (error) {
    console.error(`Error getting episode count for ${movieName}:`, error);
    return 0;
  }
}

// Optional: Function to clear cache for a specific category
function clearMoviesCache(collectionName, documentId) {
  const cacheKey = `movies_${collectionName}_${documentId}`;
  sessionStorage.removeItem(cacheKey);
  console.log(`Cache cleared for ${cacheKey}`);
}

// Optional: Function to clear all movies cache
function clearAllMoviesCache() {
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('movies_')) {
      sessionStorage.removeItem(key);
    }
  });
  console.log('All movies cache cleared');
}
async function getCategoryBanner(collectionName, docId, fieldName) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    incrementReads();
      const imageUrl = docSnap.data()[fieldName]; // Get the field value (image URL)

      // Set the new image source
      const categoryImage = document.querySelector('#category-page-header');
      if (categoryImage) {
          categoryImage.src = imageUrl;
          showCategoryLoading();
      }
      return imageUrl; 
  } else {
      console.log("No such document!");
      return null;
  }
}
async function getMovieDetails(collectionName, docId, imageField, descField, categoryField) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docData = docSnap.data();
      // (1) Update rating if needed
      getRating(collectionName, "Details", "rating");

      // (2) Set the movie banner image
      if (docData[imageField]) {
        incrementReads();
        const movieBanner = document.querySelector('#movie-banner-image');
        if (movieBanner) {
          movieBanner.src = docData[imageField];
        }
      }

      // (3) Set the movie description
      if (docData[descField]) {
        incrementReads();
        const movieDesc = document.querySelector('#movie-about-desc');
        if (movieDesc) {
          movieDesc.innerHTML = formatTextContent(docData[descField]);
        }
      }

      // (4) Set the movie category (subtitle)
      if (docData[categoryField]) {
        incrementReads();
        const movieCategory = document.querySelector('#movie-about-subtitle');
        const similar = document.querySelector('#similar-category');
        if (movieCategory) {
          movieCategory.textContent = docData[categoryField];
          similar.textContent = movieCategory.textContent;
        }
      }

      // (5) After filling in banner/desc/subtitle, fetch episode details
      const movieTitleElem = document.querySelector('#movie-about-title');
      if (movieTitleElem) {
        const currentTitle = movieTitleElem.textContent.trim();
        getEpisodeDetails(currentTitle, "Episoade");
      }

      // ───────────────────────────────────────────────────────────────────────
      // (6) Force‐switch to the left (“Episodes”) tab:
      const leftTab = document.querySelector(".movie-episodes-top-left");
      const rightTab = document.querySelector(".movie-episodes-top-right");
      const episodesSection = document.querySelector('.movie-episodes');
      const similarSection = document.querySelector('.movie-similar');

      if (leftTab && rightTab) {
        leftTab.classList.add("active");
        rightTab.classList.remove("active");
      }
      if (episodesSection && similarSection) {
        episodesSection.style.display = 'flex';
        similarSection.style.display = 'none';
      }
      // ───────────────────────────────────────────────────────────────────────

    } else {
      console.log("No such document!");
      showDialog(
        "Movie not found",
        "The movie you selected was not found. Please check the title and try again.",
        "not-found"
      );
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    showDialog(
      "Error",
      "There was an error getting movie details. Please try again later.",
      "error"
    );
  }
}

async function getRating(collectionName, docId, fieldName) {
  try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      const ratingImg = document.querySelector('#rating-img');
      const rating = document.querySelector('#movie-rating');
      const ratingNumber = document.querySelector('#movie-rating-number');
      
      if (docSnap.exists()) {
          const docData = docSnap.data();
          if (docData[fieldName] !== undefined) {
              // The field value is assumed to be a string like "2.35/100"
              const ratingValue = docData[fieldName];
              const [avgRating, totalRatings] = ratingValue.split('/').map(Number);

              // Display the values
              rating.style.display = 'flex';
              rating.textContent = `${avgRating.toFixed(1)}`; // Display average rating (1 decimal)
              if (totalRatings ===1){
                ratingNumber.textContent = `${totalRatings} rating`; // Display total number of ratings
              } else{
                ratingNumber.textContent = `${totalRatings} ratings`; // Display total number of ratings
              }
              

              // Calculate the star image number based on the floor of the average rating.
              // If avgRating is 1.5, Math.floor(1.5) gives 1.
              let starValue = Math.floor(avgRating);
              // Clamp starValue between 0 and 5 (if needed)
              if (starValue < 0) starValue = 0;
              if (starValue > 5) starValue = 5;

              // Update the star image source accordingly.
              ratingImg.src = `Assets/images/star${starValue}.png`;

              return { avgRating, totalRatings };
          } else {
              console.log(`Field '${fieldName}' not found in document.`);
              rating.style.display = 'none';
              ratingImg.src = "Assets/images/star0.png";
              ratingNumber.textContent = "0";
              return null;
          }
      } else {
          console.log("No such document!");
          return null;
      }
  } catch (error) {
      console.error("Error fetching field:", error);
      return null;
  }
}
async function getFeatured() {
  try {
      // Query the "New" collection, ordered by the "timestamp" field in descending order, and limit to 1 document
      const querySnapshot = await getDocs(query(collection(db, 'New'), orderBy('timestamp', 'desc'), limit(1)));

      if (!querySnapshot.empty) {
          // Get the first (and only) document
          const docSnap = querySnapshot.docs[0];

          // Get and set the document ID as the title
          const docId = docSnap.id;
          document.querySelector('#featured-movie-title').textContent = docId;

          // Get and set the favicon image
          const faviconImg = docSnap.data()['favicon_img'];
          document.querySelector('#featured-movie-img').src = faviconImg;

          // Get and set the category
          const category = docSnap.data()['category'];
          document.querySelector('#featured-movie-category').textContent = category;

          // Get and set the description
          const desc = docSnap.data()['desc'];
          document.querySelector('#featured-movie-desc').textContent = desc;

      } else {
          console.log("No documents found in the 'New' collection!");
      }
  } catch (error) {
      console.error("Error fetching document:", error);
  }
}

document.addEventListener('click', function(event) {
  const movieElement = event.target.closest('.featured-section');

  if (movieElement) {
      const movieTitle = movieElement.querySelector('#featured-movie-title')?.textContent.trim() || "No title";
      const title = document.querySelector('#movie-about-title');
      
      // Ensure the title updates before fetching details
      title.textContent = movieTitle;
   
      
      // Clear previous content and fetch new data
      getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
      showMovieLoading();
      showMovie();
      scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
      from_category = 0;
  }
});






async function writeRate(collectionName, docId, fieldName, newValue) {
  try {
    if (typeof collectionName !== 'string') {
      throw new Error("collectionName must be a string");
    }
    if (typeof docId !== 'string') {
      throw new Error("docId must be a string");
    }

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { [fieldName]: newValue }, { merge: true }); // Merge with existing data

    console.log("Rating written successfully");
    incrementWrites();
    movieCheck++; // If needed for rating tracking or any logic in your app
    checkMovieCount(); // If relevant, otherwise can be removed

  } catch (error) {
    console.error("Error writing rating:", error);
    showDialog("Error", "There was an error submitting the rating. Please try again later.", "error");
  }
}

// Get all star elements
const stars = document.querySelectorAll('#rating-star');
let selectedRating = 0; // This will track the selected rating (1-5)

// Function to update the star ratings
function updateStars(rating) {
  // Loop through each star and set the src attribute based on the rating
  stars.forEach((star, index) => {
    if (index < rating) {
      star.src = "Assets/images/star5.png"; // Set to "filled" star for selected ratings
    } else {
      star.src = "Assets/images/star0.png"; // Set to "empty" star for non-selected ratings
    }
  });

  selectedRating = rating; // Update the selected rating
}

// Add event listeners to each star image
stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    // When a star is clicked, update the rating based on its index
    updateStars(index + 1);

    const movieName = document.querySelector('#movie-about-title').textContent;
    const movieRating = parseFloat(document.querySelector('#movie-rating').textContent); // Current average rating
    let movieNumber = parseInt(document.querySelector('#movie-rating-number').textContent, 10); // Total number of ratings

    // Calculate the new rating
    const newRating = index + 1; // Your rating (1-5)
    
    // Calculate the new total rating (multiply current average by number of ratings, then add the new rating)
    const previousTotalRating = movieRating * movieNumber; // This gives the previous total of all ratings combined
    
    // Calculate the new average after adding the new rating
    const newAverageRating = (previousTotalRating + newRating) / (movieNumber + 1);

    // Increment movieNumber by 1 (total ratings)
    movieNumber += 1;

    // Add event listener for confirm-rating button click
    document.querySelector("#confirm-rating").addEventListener("click", function () {
      // Write the updated rating and the new total number of ratings
      writeRate(movieName, "Details", "rating", `${newAverageRating.toFixed(2)}/${movieNumber}`);
      hideRateMovie();
    });
  });
});




// Function to show the .rate-movie element with a bounce animation
function showRateMovie() {
  const rateMovieElement = document.querySelector('.rate-movie');
  if (rateMovieElement) {
      rateMovieElement.style.display = 'flex'; // Show the rating container
      rateMovieElement.classList.add('bounce'); // Trigger the bounce animation
      rateMovieElement.classList.remove('hidden'); // Ensure it's visible
  }
}

// Function to hide the .rate-movie element with fade-out effect
function hideRateMovie() {
  const rateMovieElement = document.querySelector('.rate-movie');
  if (rateMovieElement) {
      rateMovieElement.classList.add('hidden'); // Add the class to fade out
      setTimeout(() => {
          rateMovieElement.style.display = 'none'; // Hide after fade-out completes
      }, 10); // Match the duration of the fade-out (0.4s)
  }
}

// Function to show the .rate-movie element with a bounce animation
function showReportMovie() {
  const rateMovieElement = document.querySelector('.report-movie');
  if (rateMovieElement) {
      rateMovieElement.style.display = 'flex'; // Show the rating container
      rateMovieElement.classList.add('bounce'); // Trigger the bounce animation
      rateMovieElement.classList.remove('hidden'); // Ensure it's visible
  }
}

// Function to hide the .rate-movie element with fade-out effect
function hideReportMovie() {
  const rateMovieElement = document.querySelector('.report-movie');
  if (rateMovieElement) {
      rateMovieElement.classList.add('hidden'); // Add the class to fade out
      setTimeout(() => {
          rateMovieElement.style.display = 'none'; // Hide after fade-out completes
      }, 10); // Match the duration of the fade-out (0.4s)
  }
}
// Event listener to hide .rate-movie when clicked
const reportMovieElement = document.querySelector('.report-movie');
if (reportMovieElement) {
  // Hide .rate-movie when clicked outside of .rate-movie-content
  reportMovieElement.addEventListener('click', (event) => {
      // Check if the click is outside of .rate-movie-content
      if (!event.target.closest('.report-movie-content')) {
          hideReportMovie(); // Hide if clicked outside
      }
  });

  // Prevent hiding when clicking inside .rate-movie-content
  const reportMovieContent = document.querySelector('.report-movie-content');
  if (reportMovieContent) {
    reportMovieContent.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent the event from bubbling up to .rate-movie
      });
  }
}



// Event listener to hide .rate-movie when clicked
const rateMovieElement = document.querySelector('.rate-movie');
if (rateMovieElement) {
  // Hide .rate-movie when clicked outside of .rate-movie-content
  rateMovieElement.addEventListener('click', (event) => {
      // Check if the click is outside of .rate-movie-content
      if (!event.target.closest('.rate-movie-content')) {
          hideRateMovie(); // Hide if clicked outside
      }
  });

  // Prevent hiding when clicking inside .rate-movie-content
  const rateMovieContent = document.querySelector('.rate-movie-content');
  if (rateMovieContent) {
      rateMovieContent.addEventListener('click', (event) => {
          event.stopPropagation(); // Prevent the event from bubbling up to .rate-movie
      });
  }
}




document.querySelector("#give-movie-report").addEventListener("click", function () {
  showReportMovie();
 });
 document.querySelector("#confirm-report").addEventListener("click", function () {
  const reportedMovie = document.querySelector('#movie-about-title').textContent;
  const reason = document.getElementById("report-reason");
  const reasonText = reason.options[reason.selectedIndex].text;
  const details = document.getElementById("report-more");
  const uuid = crypto.randomUUID();
  writeMovieMerge("Reports", uuid, "timestamp", Date.now());
  writeMovieMerge("Reports", uuid, "movie", reportedMovie);
  writeMovieMerge("Reports", uuid, "reason", reasonText);
  writeMovieMerge("Reports", uuid, "details", details.value);
  hideReportMovie();
  details.value = '';
 });

document.querySelector("#give-movie-rate").addEventListener("click", function () {
 showRateMovie();
});




function formatTextContent(content) {
  // Remove instances like [1], [2], etc.
  content = content.replace(/\[\d+\]/g, '');
  
  // Split the content into sentences based on a period followed by one or more spaces
  let sentences = content.split(/(?<=\.)\s+/);
  
  // Threshold: sentences longer than 150 characters are considered long
  const maxSentenceLengthForShort = 150;
  
  // Track two-word sentences to identify repetitions
  const twoWordSentences = {};
  
  // First pass: identify repetitive two-word sentences
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    // Check if it's a two-word sentence
    const words = trimmed.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 2) {
      const key = words.join(' ').toLowerCase();
      twoWordSentences[key] = (twoWordSentences[key] || 0) + 1;
    }
  });
  
  // Format each sentence accordingly
  let formattedContent = '';
  let isFirstSentence = true;
  
  sentences.forEach(sentence => {
    sentence = sentence.trim();
    if (sentence.length === 0) return;
    
    // Check if it's a repetitive two-word sentence
    const words = sentence.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 2) {
      const key = words.join(' ').toLowerCase();
      if (twoWordSentences[key] > 1) {
        // It's a repetitive two-word sentence, make it bold
        sentence = `<strong>${sentence}</strong>`;
      }
    }
    
    if (sentence.length > maxSentenceLengthForShort) {
      // Long sentence: start on a new line with indentation
      if (!isFirstSentence) {
        formattedContent += '<br><br>'; // Add extra line break for spacing between lines
      }
      formattedContent += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${sentence} `;
    } else {
      // Short sentence: add as-is (with indentation if it's the first sentence)
      if (isFirstSentence) {
        formattedContent += `${sentence} `;
      } else {
        formattedContent += `${sentence} `;
      }
    }
    
    isFirstSentence = false;
  });
  
  return formattedContent.trim();
}





async function getEpisodeDetails(collectionName, docId) {
  try {
    const episodesContainer = document.querySelector('.movie-episodes');
    const playlistContainer = document.querySelector('.playlist-entry');
    const movieBanner = document.querySelector('#movie-banner-image');
    const noEpisodeMessage = document.querySelector('#no-episode');
    const movieMoreEpisodes = document.querySelector('.movie-more-episodes');
    const moviePlay = document.querySelector('#movie-play');

    // Clear previous content and state
    episodesContainer.innerHTML = '';
    playlistContainer.innerHTML = '';

    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      showDialog("Not Found", "The requested movie does not exist.", "not-found");
      console.log("No such document!");
      noEpisodeMessage.style.display = "block";
      return;
    }

    const docData = docSnap.data();
    let lastWatched = -1;

    const detailsRef = doc(db, collectionName, "Details");
    const detailsSnap = await getDoc(detailsRef);
    if (detailsSnap.exists()) {
      lastWatched = detailsSnap.data().last ?? -1;
    }

    const sortedEpisodes = Object.entries(docData)
      .filter(([title, url]) => typeof url === 'string' && url.startsWith('http'))
      .sort(([a], [b]) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
        const numB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
        return numA - numB;
      });

    let episodeCount = sortedEpisodes.length;
    writeMovieMerge("LastWatched", collectionName, "total_eps", episodeCount); // ✅ Valid here
    // Show or hide movie-play based on episode count
    if (moviePlay) {
      if (episodeCount === 1) {
        moviePlay.style.display = "flex";
      } else {
        moviePlay.style.display = "none";
      }
    }
    
    // State management for loading
    let currentIndex = 0;
    let isLoading = false;
    let allLoaded = false;
    const batchSize = 6; // Changed from 2 to 6 as requested
    const loadedEpisodes = new Set();

    // Track currently playing episode
    let currentlyPlayingElements = [];
    
    // Store all episode elements for updating watched states
    const allEpisodeElements = [];
    const allPlaylistElements = [];

    // Create sentinel elements for both containers
    const episodesSentinel = document.createElement('div');
    episodesSentinel.id = 'episodes-sentinel';
    episodesSentinel.style.height = '10px';
    episodesSentinel.style.width = '100%';
    episodesSentinel.style.margin = '10px 0';
    episodesContainer.appendChild(episodesSentinel);

    const playlistSentinel = document.createElement('div');
    playlistSentinel.id = 'playlist-sentinel';
    playlistSentinel.style.height = '20px';
    playlistSentinel.style.width = '100%';
    playlistSentinel.style.margin = '10px 0';
    playlistContainer.appendChild(playlistSentinel);

    // Create loading indicators with loading circles
    const episodesLoadingIndicator = document.createElement('div');
    episodesLoadingIndicator.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <div class="loading-circle"></div>
        <span>Loading more episodes...</span>
      </div>
    `;
    episodesLoadingIndicator.style.textAlign = 'center';
    episodesLoadingIndicator.style.padding = '20px';
    episodesLoadingIndicator.style.display = 'none';
    episodesContainer.appendChild(episodesLoadingIndicator);

    const playlistLoadingIndicator = document.createElement('div');
    playlistLoadingIndicator.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
        <div class="loading-circle"></div>
        <span>Loading more episodes...</span>
      </div>
    `;
    playlistLoadingIndicator.style.textAlign = 'center';
    playlistLoadingIndicator.style.padding = '20px';
    playlistLoadingIndicator.style.display = 'none';
    playlistContainer.appendChild(playlistLoadingIndicator);

    // Add CSS for animations and loading circle if not already present
    if (!document.getElementById('episode-animation-styles')) {
      const style = document.createElement('style');
      style.id = 'episode-animation-styles';
      style.textContent = `
        .episode-body {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .episode-body.episode-loading {
          opacity: 0;
          transform: translateY(30px);
          animation: slideInUp 0.4s ease forwards;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .loading-circle {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: loadingSpinner 1s linear infinite;
        }
        
        @keyframes loadingSpinner {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .watched-img {
          filter: brightness(0.6);
        }
        
        .overlay-watched {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .overlay-playing {
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 0, 0, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          animation: pulse 2s infinite;
        }

        .episode-content:has(.overlay-watched):has(.overlay-playing) .overlay-watched {
          top: 35%;
        }

        .episode-content:has(.overlay-watched):has(.overlay-playing) .overlay-playing {
          top: 65%;
        }

        @keyframes pulse {
          0% {
            opacity: 0.9;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.9;
          }
        }

        .playing-img {
          filter: brightness(0.8);
          border: 2px solid #ff0000;
        }

        .watched-img.playing-img {
          filter: brightness(0.5);
          border: 2px solid #ff0000;
        }
      `;
      document.head.appendChild(style);
    }

    // Function to clear all playing states
    function clearAllPlayingStates() {
      currentlyPlayingElements.forEach(element => {
        const img = element.querySelector('#episode-got-img');
        const playingOverlay = element.querySelector('.overlay-playing');
        
        if (img && img.classList.contains('playing-img')) {
          img.classList.remove('playing-img');
        }
        if (playingOverlay) {
          playingOverlay.remove();
        }
      });
      currentlyPlayingElements = [];
    }

    // Function to update watched state for an episode element
    function updateEpisodeWatchedState(element, episodeIndex, shouldBeWatched) {
      const img = element.querySelector('#episode-got-img');
      const episodeContent = element.querySelector('.episode-content');
      const episodeNumber = element.querySelector('.episode-number');
      let watchedOverlay = episodeContent.querySelector('.overlay-watched');
      
      if (shouldBeWatched) {
        // Mark as watched
        if (img && !img.classList.contains('watched-img')) {
          img.classList.add('watched-img');
        }
        
        // Update episode number to show history icon
        if (episodeNumber && !episodeNumber.querySelector('.history-img')) {
          episodeNumber.innerHTML = `<img src="Assets/images/history.png" alt="Watched" class="history-img">`;
        }
        
        // Add watched overlay if not present
        if (!watchedOverlay) {
          watchedOverlay = document.createElement('span');
          watchedOverlay.className = 'overlay-watched';
          watchedOverlay.textContent = 'Watched';
          episodeContent.appendChild(watchedOverlay);
        }
      } else {
        // Mark as not watched
        if (img && img.classList.contains('watched-img')) {
          img.classList.remove('watched-img');
        }
        
        // Update episode number to show number
        if (episodeNumber) {
          episodeNumber.innerHTML = `${episodeIndex}`;
        }
        
        // Remove watched overlay if present
        if (watchedOverlay) {
          watchedOverlay.remove();
        }
      }
    }

    // Function to update all episodes' watched states based on lastWatched
    function updateAllWatchedStates() {
      allEpisodeElements.forEach((element, index) => {
        const episodeIndex = index + 1;
        const shouldBeWatched = episodeIndex <= lastWatched;
        updateEpisodeWatchedState(element, episodeIndex, shouldBeWatched);
      });
      
      allPlaylistElements.forEach((element, index) => {
        const episodeIndex = index + 1;
        const shouldBeWatched = episodeIndex <= lastWatched;
        updateEpisodeWatchedState(element, episodeIndex, shouldBeWatched);
      });
    }

    // Function to set playing state
    function setPlayingState(episodeElement, playlistElement, episodeIndex) {
      // Clear previous playing states
      clearAllPlayingStates();
      
      // Set new playing states
      [episodeElement, playlistElement].forEach(element => {
        const img = element.querySelector('#episode-got-img');
        const episodeContent = element.querySelector('.episode-content');
        const episodeNumber = element.querySelector('.episode-number');
        
        // Check if this episode is watched
        const isWatched = lastWatched >= episodeIndex;
        
        // Add playing image class
        if (img) {
          img.classList.add('playing-img');
        }
        
        // Update episode number to show watched status if applicable
        if (isWatched && episodeNumber && !episodeNumber.querySelector('.history-img')) {
          episodeNumber.innerHTML = `<img src="Assets/images/history.png" alt="Watched" class="history-img">`;
        }
        
        // Add playing overlay
        const playingOverlay = document.createElement('span');
        playingOverlay.className = 'overlay-playing';
        playingOverlay.textContent = 'Playing';
        episodeContent.appendChild(playingOverlay);
        
        // If episode is watched, also add watched overlay (stacked)
        if (isWatched && !episodeContent.querySelector('.overlay-watched')) {
          const watchedOverlay = document.createElement('span');
          watchedOverlay.className = 'overlay-watched';
          watchedOverlay.textContent = 'Watched';
          episodeContent.appendChild(watchedOverlay);
        }
        
        currentlyPlayingElements.push(element);
      });
    }

    function loadMoreEpisodes() {
      // Prevent multiple simultaneous loads
      if (isLoading || allLoaded || currentIndex >= episodeCount) {
        console.log(`Load prevented: isLoading=${isLoading}, allLoaded=${allLoaded}, currentIndex=${currentIndex}, episodeCount=${episodeCount}`);
        return;
      }

      console.log(`Starting load: currentIndex=${currentIndex}, episodeCount=${episodeCount}`);
      isLoading = true;
      const isInitialLoad = currentIndex === 0;
      
      if (!isInitialLoad) {
        episodesLoadingIndicator.style.display = 'block';
        playlistLoadingIndicator.style.display = 'block';
      }
      
      const episodesToLoad = sortedEpisodes.slice(currentIndex, currentIndex + batchSize);
      
      if (episodesToLoad.length === 0) {
        console.log("No episodes to load");
        episodesLoadingIndicator.style.display = 'none';
        playlistLoadingIndicator.style.display = 'none';
        isLoading = false;
        allLoaded = true;
        return;
      }

      // Process episodes synchronously to prevent race conditions
      episodesToLoad.forEach(([episodeTitle, episodeImg], batchIndex) => {
        const globalIndex = currentIndex + batchIndex;
        
        // Skip if already loaded
        if (loadedEpisodes.has(episodeTitle)) {
          return;
        }
      
        loadedEpisodes.add(episodeTitle);
        
        let imgSrc;
        if (episodeImg.includes("youtube.com") || episodeImg.includes("youtu.be")) {
          const match = episodeImg.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
          imgSrc = match ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : movieBanner.src;
        } else {
          imgSrc = movieBanner.src;
        }
      
        const episodeIndex = globalIndex + 1;
        const isOnly = episodeCount === 1;
        const isFirst = episodeIndex === 1 && !isOnly;
        const isLast = episodeIndex === episodeCount && !isOnly;
        const isWatched = lastWatched >= episodeIndex;
      
        const episodeDisplayTitle = isOnly
          ? "Movie"
          : isFirst
            ? "Episode 1 - Pilot"
            : isLast
              ? "Final episode"
              : episodeTitle;
      
        const episodeNumberHTML = isWatched
          ? `<img src="Assets/images/history.png" alt="Watched" class="history-img">`
          : `${episodeIndex}`;
      
        // Create episode element for movie-episodes container
        const episodeHTML = document.createElement("div");
        episodeHTML.classList.add("episode-body");
      
        episodeHTML.innerHTML = `
          <div class="episode-content" style="position: relative;">
            <img src="${imgSrc}" alt="" id="episode-got-img" loading="lazy" class="${isWatched ? 'watched-img' : ''}">
            ${isWatched ? `<span class="overlay-watched">Watched</span>` : ''}
          </div>
          <div class="episode-number">${episodeNumberHTML}</div>
          <div class="episode-about">
            <span class="episode-title">${episodeDisplayTitle}</span>
            <span class="episode-desc">${episodeImg}</span>
          </div>
        `;

        // Create playlist element for playlist-entry container
        const playlistHTML = document.createElement("div");
        playlistHTML.classList.add("episode-body");
      
        playlistHTML.innerHTML = `
          <div class="episode-content" style="position: relative;">
            <img src="${imgSrc}" alt="" id="episode-got-img" loading="lazy" class="${isWatched ? 'watched-img' : ''}">
            ${isWatched ? `<span class="overlay-watched">Watched</span>` : ''}
          </div>
          <div class="episode-number">${episodeNumberHTML}</div>
          <div class="episode-about">
            <span class="episode-title">${episodeDisplayTitle}</span>
            <span class="episode-desc">${episodeImg}</span>
          </div>
        `;
      
        // Store elements in arrays for global access
        allEpisodeElements[globalIndex] = episodeHTML;
        allPlaylistElements[globalIndex] = playlistHTML;

        // Add click event to both elements
        const clickHandler = () => { 
          // Update lastWatched to current episode (this marks all previous episodes as watched)
          lastWatched = Math.max(lastWatched, episodeIndex);
          
          // Update all episodes' watched states
          updateAllWatchedStates();
          
          // Set playing state for both elements
          setPlayingState(episodeHTML, playlistHTML, episodeIndex);
          
          playVideo(episodeImg);
          writeMovieMerge(collectionName, "Details", "last", episodeIndex);
          writeMovieMerge("LastWatched", collectionName, "Episode", episodeTitle);
          writeMovieMerge("LastWatched", collectionName, "timestamp", Date.now());
          hidePlaylist();
        };

        episodeHTML.addEventListener("click", clickHandler);
        playlistHTML.addEventListener("click", clickHandler);
      
        // Animation handling
        if (isInitialLoad) {
          // No animation for initial load - just insert directly
          episodesContainer.insertBefore(episodeHTML, episodesSentinel);
          playlistContainer.insertBefore(playlistHTML, playlistSentinel);
        } else {
          // Animate episodes loaded later - staggered animation
          setTimeout(() => {
            // Insert with animation class
            episodeHTML.classList.add('episode-loading');
            playlistHTML.classList.add('episode-loading');
            
            episodesContainer.insertBefore(episodeHTML, episodesSentinel);
            playlistContainer.insertBefore(playlistHTML, playlistSentinel);
            
            // Remove animation class after animation completes
            setTimeout(() => {
              episodeHTML.classList.remove('episode-loading');
              playlistHTML.classList.remove('episode-loading');
            }, 400);
          }, batchIndex * 80); // Staggered by 80ms for smooth appearance
        }
      });
      
      // Update currentIndex IMMEDIATELY after processing
      currentIndex += episodesToLoad.length;
      console.log(`Episodes processed: ${episodesToLoad.length}, New currentIndex: ${currentIndex}`);

      // Set loading state to false and check completion
      const hideLoadingDelay = isInitialLoad ? 0 : (episodesToLoad.length * 80 + 500);
      setTimeout(() => {
        if (!isInitialLoad) {
          episodesLoadingIndicator.style.display = 'none';
          playlistLoadingIndicator.style.display = 'none';
        }
        
        // Reset loading state AFTER animations complete
        isLoading = false;
        console.log(`Loading state reset: isLoading=${isLoading}, currentIndex=${currentIndex}, episodeCount=${episodeCount}`);

        if (currentIndex >= episodeCount) {
          allLoaded = true;
          console.log("All episodes loaded");
          episodesSentinel.style.display = 'none';
          playlistSentinel.style.display = 'none';
          
          const allLoadedMessage = document.createElement('div');
          allLoadedMessage.textContent = 'All episodes loaded';
          allLoadedMessage.style.textAlign = 'center';
          allLoadedMessage.style.padding = '10px';
          allLoadedMessage.style.opacity = '0.7';
          episodesContainer.appendChild(allLoadedMessage);

          const playlistLoadedMessage = document.createElement('div');
          playlistLoadedMessage.textContent = 'All episodes loaded';
          playlistLoadedMessage.style.textAlign = 'center';
          playlistLoadedMessage.style.padding = '10px';
          playlistLoadedMessage.style.opacity = '0.7';
          playlistContainer.appendChild(playlistLoadedMessage);
          
          // Clean up observer
          if (window.episodeObserver) {
            window.episodeObserver.disconnect();
          }
        }
      }, hideLoadingDelay);
    }

    // Initially load the first batch
    loadMoreEpisodes();

    // Clean up any existing observer
    if (window.episodeObserver) {
      window.episodeObserver.disconnect();
    }

    // Set up the Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '200px', // Trigger when 200px away from viewport
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading && !allLoaded && currentIndex < episodeCount) {
          const sentinelType = entry.target.id === 'episodes-sentinel' ? 'episodes' : 'playlist';
          console.log(`${sentinelType} sentinel visible - loading more episodes`);
          
          loadMoreEpisodes();
        }
      });
    }, observerOptions);

    // Observe both sentinels
    observer.observe(episodesSentinel);
    observer.observe(playlistSentinel);
    window.episodeObserver = observer;
    
    // Fallback scroll listener
    let scrollTimeout;
    const handleScroll = () => {
      if (isLoading || allLoaded) return;
      
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        if (!isLoading && !allLoaded && currentIndex < episodeCount) {
          const episodesSentinelRect = episodesSentinel.getBoundingClientRect();
          const playlistSentinelRect = playlistSentinel.getBoundingClientRect();
          
          if (episodesSentinelRect.top < window.innerHeight + 300 || 
              playlistSentinelRect.top < window.innerHeight + 300) {
            console.log("Scroll fallback triggered");
            loadMoreEpisodes();
          }
        }
        scrollTimeout = null;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up scroll listener when all loaded
    const cleanupInterval = setInterval(() => {
      if (allLoaded) {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(cleanupInterval);
        console.log("Scroll listener cleaned up");
      }
    }, 1000);

  } catch (error) {
    console.error("Error fetching episode details:", error);
    showDialog("Error", "There was an unexpected error retrieving episodes. Please try again later.", "error");
  }
}

document.querySelector("#movie-play").addEventListener("click", function () {
  // Get the movie title from `.movie-about-title`
  const movieTitleElement = document.querySelector("#movie-about-title");
  if (!movieTitleElement) {
      console.error("No element with class .movie-about-title found.");
      return;
  }
  const collectionName = movieTitleElement.textContent.trim();

  // Select all `.episode-body` elements
  const episodeBodies = document.querySelectorAll(".episode-body");

  let lastWatchedEpisode = null;
  let lastWatchedIndex = -1;

  // Find the last `.episode-body` that contains `.episode-history`
  episodeBodies.forEach((ep, index) => {
      if (ep.querySelector(".episode-history")) {
          lastWatchedEpisode = ep;
          lastWatchedIndex = index + 1; // Store the actual episode number (1-based index)
      }
  });

  if (lastWatchedEpisode) {
      // Find `.episode-desc` inside this last watched episode
      const episodeDesc = lastWatchedEpisode.querySelector(".episode-desc");

      if (episodeDesc) {
          console.log(episodeDesc.textContent.trim()); // Log episode description
          playVideo(episodeDesc.textContent.trim());
          writeMovieMerge(collectionName, "Details", "last", lastWatchedIndex);
          writeMovieMerge("LastWatched", collectionName, "Episode", episodeTitle);
                writeMovieMerge("LastWatched", collectionName, "timestamp", Date.now());

                continue_watching = 0;
      } else {
          console.error("No element with class .episode-desc found in last watched episode.");
      }
  } else {
      // No `.episode-history` found, select the first `.episode-body`
      const firstEpisode = episodeBodies[0]; // Get the first episode

      if (firstEpisode) {
          const episodeNumberDiv = firstEpisode.querySelector(".episode-number");

          if (episodeNumberDiv) {
              // Clear existing content
              episodeNumberDiv.innerHTML = "";

              // Create and add the last-watched image
              const lastWatchedImg = document.createElement("img");
              lastWatchedImg.src = "Assets/images/history.png";
              lastWatchedImg.alt = "";
              lastWatchedImg.id = "last-watched-ep";

              episodeNumberDiv.appendChild(lastWatchedImg);

              // Log its description and index
              const episodeDesc = firstEpisode.querySelector(".episode-desc");
              if (episodeDesc) {
                  console.log(episodeDesc.textContent.trim()); // Log episode description
                  playVideo(episodeDesc.textContent.trim());
                  writeMovieMerge("LastWatched", collectionName, "Episode", episodeTitle);
                writeMovieMerge("LastWatched", collectionName, "timestamp", Date.now());
               
                continue_watching = 0;
              }

              
              console.log(`Marked first episode as watched at index: 1`);
              
              writeMovieMerge(collectionName, "Details", "last", 1); // Store the first episode as watched
          } else {
              console.error("No .episode-number found inside first episode.");
          }
      } else {
          console.error("No episodes available.");
      }
  }
});



const addedCategories = new Set();

async function getRandomDocument() {
    const collectionRef = collection(db, "Categories");
    let debugMode = localStorage.getItem("debug-mode") === "true"; 
    if (debugMode) return;

    try {
        const snapshot = await getDocs(collectionRef);
        
        // Sort documents alphabetically by ID first
        const sortedDocuments = snapshot.docs.sort((a, b) => a.id.localeCompare(b.id));
        
        // Filter out already added categories
        const documents = sortedDocuments.filter(doc => !addedCategories.has(doc.id)); 
        incrementReads();

        if (documents.length === 0) return; // Stop if all are added

        // Take the first available document
        const nextDoc = documents[0];
        const data = nextDoc.data();

        addedCategories.add(nextDoc.id); // Mark as added

        const categoryHeadingBox = document.createElement("div");
        categoryHeadingBox.classList.add("category-heading-box");

        const categoryHeading = document.createElement("span");
        categoryHeading.classList.add("category-heading");
        categoryHeading.textContent = nextDoc.id;

        const moreButton = document.createElement("button");
        moreButton.classList.add("more-button");
        moreButton.innerHTML = '<img src="Assets/images/more.png" alt="">';

        categoryHeadingBox.appendChild(categoryHeading);
        categoryHeadingBox.appendChild(moreButton);

        const categorySection = document.createElement("div");
        categorySection.classList.add("category-section");

        // Prepare movie keys excluding 'img_cover' and limit to 4
        const movieKeys = Object.keys(data).filter(key => key !== "img_cover").slice(0, 4);

        // Fetch episode counts for these movies in parallel
        const episodeCounts = await Promise.all(movieKeys.map(key => getEpisodeCount(key)));

        // Log episode counts and create movie elements
        for (let i = 0; i < movieKeys.length; i++) {
            const key = movieKeys[i];
            const episodeCount = episodeCounts[i];
            console.log(`Movie: ${key} - Episodes: ${episodeCount}`);

            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");

            const img = document.createElement("img");
            img.id = "movie-img";
            img.src = data[key];
            img.loading = "lazy";

            const title = document.createElement("span");
            title.classList.add("movie-title");
            title.textContent = key;

            const desc = document.createElement("span");
            desc.classList.add("movie-desc");
            // Show "Watch now" if 1 episode, else "<number> episodes"
            desc.textContent = episodeCount === 1 ? "Watch now" : `${episodeCount} episodes`;

            movieDiv.appendChild(img);
            movieDiv.appendChild(title);
            movieDiv.appendChild(desc);
            categorySection.appendChild(movieDiv);
        }

        if (movieKeys.length > 0) {
            const sceneHome = document.querySelector(".scene-home");
            sceneHome.appendChild(categoryHeadingBox);
            sceneHome.appendChild(categorySection);
        }

        moreButton.style.display = movieKeys.length < 4 ? "none" : "block";

        moreButton.addEventListener("click", function (event) {
            showCategoryPage();
            const categoryHeading = event.target.closest(".more-button")?.previousElementSibling;
            const title = document.querySelector("#category-page-title");
            const categoryValue = categoryHeading ? categoryHeading.textContent.trim() : "defaultText";
            getCategoryBanner("Categories", categoryValue, "img_cover");
            title.textContent = categoryValue;
        });

    } catch (error) {
        console.error("Error fetching document:", error);
    }
}


// Ensure initial content makes `.scene-home` scrollable
async function checkSceneHomeFill() {
    const sceneHome = document.querySelector(".scene-home");
    if (!sceneHome) return;

    let allLoaded = false;
    const targetHeight = Math.max(window.innerHeight, sceneHome.clientHeight);

    while (sceneHome.scrollHeight <= targetHeight && !allLoaded) {
        const previousCount = addedCategories.size;
        await getRandomDocument();
        const newCount = addedCategories.size;

        if (previousCount === newCount) {
            allLoaded = true;
        }
    }
}

// Load initial 3 categories
async function loadInitialDocuments(count) {
    for (let i = 0; i < count; i++) {
        await getRandomDocument();
    }
}

// Load more content when scrolling to the bottom
async function checkScrollEnd() {
    const sceneHome = document.querySelector(".scene-home");
    if (!sceneHome) return;

    const scrollBottom = sceneHome.scrollTop + sceneHome.clientHeight;
    const targetHeight = Math.max(window.innerHeight, sceneHome.clientHeight);

    if (scrollBottom >= sceneHome.scrollHeight - 50 || sceneHome.scrollHeight <= targetHeight) {
        const previousCount = addedCategories.size;
        await getRandomDocument();
        const newCount = addedCategories.size;

        if (previousCount === newCount) {
            sceneHome.removeEventListener("scroll", checkScrollEnd);
        }
    }
}

// Attach scroll event listener
document.querySelector(".scene-home")?.addEventListener("scroll", checkScrollEnd);

// Load initial content before running scroll check
loadInitialDocuments(3).then(() => checkSceneHomeFill());


function clearContent() {
  const episodesContainer = document.querySelector('.movie-episodes');
  const noEpisodeMessage = document.querySelector('#no-episode');

  if (episodesContainer) {
      episodesContainer.innerHTML = ""; // Clear episode content
  }
  
  if (noEpisodeMessage) {
      noEpisodeMessage.style.display = "none"; // Hide the "No episodes" message initially
  }
}


function checkMovieCount() {
  if (movieCheck === 5) {
    getAllCategories('Categories');
    // If #select-titleCat is a <select> element, you might consider using .value instead of .textContent
    getAllMovieFields('Categories', document.querySelector('#select-titleCat').textContent);
    hideAddActualMovie();
    document.querySelector('#confirm-add-actualMovie').style.display = 'flex';
    document.querySelector('#loading-add-movie').style.display = 'none';
    movieCheck = 0;
  }
}
function showCategoryLoading() {
  const page = document.querySelector('.category-loading');
  const title = document.querySelector('#category-page-title');
  hideCategoryLoading(); // Ensure any previous animation is handled

  setTimeout(() => {
      page.style.display = 'flex';
      page.style.animation = 'bounceIn 0.2s ease-out';
      getAllMoviesFromCategory("Categories", title.textContent)
  }, 200); // Delay to sync with fadeOut
}
function hideCategoryLoading() {
  const page = document.querySelector('.category-loading');
  if (page.style.display === 'flex') {
      page.style.animation = 'fadeOut 0.2s ease-out';
      setTimeout(() => (page.style.display = 'none'), 200);
  }
}
let loadingTimeout;
let hideTimeout;

function showMovieLoading() {
  clearTimeout(loadingTimeout);
  
  clearTimeout(hideTimeout);
  console.timeEnd("showMovieLoading");
  console.time("showMovieLoading");

  const page = document.querySelector('.movie-page-loading');
  const moviePage = document.querySelector('.movie-page');

  hideMovieLoading(); // Clear previous state

  setTimeout(() => {
      page.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // 🚫 Disable page scroll
      page.style.overflow = 'auto'; // ✅ Allow scrolling inside .movie-page-loading

      if (moviePage) {
          moviePage.classList.add('loading-active'); // Hide movie-page content
      }
  }, 200);

  // 4-second warning if it takes too long
  loadingTimeout = setTimeout(() => {
      console.warn("⚠️ showMovieLoading() is taking too long (4s)!");
      console.timeEnd("showMovieLoading");
  }, 4000);
}

function hideMovieLoading() {
  clearTimeout(loadingTimeout);
  clearTimeout(hideTimeout);
  console.timeEnd("showMovieLoading");

  hideTimeout = setTimeout(() => {
      const page = document.querySelector('.movie-page-loading');
      const moviePage = document.querySelector('.movie-page');

      if (page.style.display === 'flex' || page.style.display === 'block') {
          page.style.animation = 'fadeOut 0.2s ease-out';
          setTimeout(() => {
              page.style.animation = '';
              page.style.display = 'none';
              document.body.style.overflow = ''; // ✅ Re-enable page scrolling
              page.style.overflow = ''; // 🔄 Reset loading box scrolling

              if (moviePage) {
                  moviePage.classList.remove('loading-active'); // Show movie-page content again
              }
          }, 200);
      }
  }, 1000); // Wait 1 second before hiding
}







document.getElementById('add-content').addEventListener('click', function() {
  getAllCategories('Categories');
  goToAddMovies();
});


document.querySelector(".error-button").addEventListener("click", function() {
  readField("app", "visibility", "visibility");
  showLoading();
  
});


function addEpisode() {
  const parentDiv = document.querySelector(".add-movie-episodes");
  const newDiv = document.createElement("div");
  const titleInput = document.getElementById('episode-name');
  const urlInput = document.getElementById('episode-url');
  const inputs = document.querySelectorAll('.add-episode-inputs');
  const preview = document.querySelector('#preview-url');
  const titles = document.querySelector('#select-titleMovie').textContent;
  
  let title = titleInput.value.trim(); // Get and trim input value

  // Extract number from title (e.g., "Episodul 1")
  const match = title.match(/(\d+)$/); // Find last number in the string
  if (match) {
      const episodeNumber = parseInt(match[1], 10) + 1; // Increment number
      title = title.replace(/\d+$/, episodeNumber); // Replace old number with new one
  } else {
      title = ""; // Clear input if no number is found
  }
  updateField(titles, "Episoade", titleInput.value.trim(), urlInput.value.trim());
  inputs.forEach(input => {
      input.value = '';
  });

  // Update the input only if a number was found; otherwise, clear it
  titleInput.value = title;

  preview.style.display = 'none'; // Hide preview if the URL is invalid
  
}
document.addEventListener("deviceready", () => {
  // Enable immersive mode to hide status and navigation bars.
  if (window.AndroidFullScreen) {
    window.AndroidFullScreen.immersiveMode(
      () => console.log("Immersive mode enabled"),
      err => console.error(err)
    );
  }
  // Lock to portrait by default.
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("portrait").catch(console.error);
  }
});

function getEmbedUrl(url) {
  let videoId, embedUrl;

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    // Already an embed URL
    if (url.startsWith("https://www.youtube.com/embed/")) {
      embedUrl = url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    } else {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|embed\/|v\/))([^?&]+)/);
      if (match) {
        videoId = match[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
    }
  }

  // Odysee
  else if (url.includes("odysee.com")) {
    const match = url.match(/odysee\.com\/(@[\w-]+)\/([^:/?]+)/);
    if (match) {
      embedUrl = `https://odysee.com/$/${match[1]}/${match[2]}?embed=1`;
    }
  }

  // OK.ru
  else if (url.includes("ok.ru")) {
    const match = url.match(/ok\.ru\/video\/(\d+)/);
    if (match) {
      videoId = match[1];
      embedUrl = `https://ok.ru/videoembed/${videoId}`;
    }
  }

  // VK.com
  else if (url.includes("vk.com/video")) {
    const match = url.match(/vk\.com\/video(-?\d+_\d+)/);
    if (match) {
      embedUrl = `https://vk.com/video_ext.php?oid=${match[1].split("_")[0]}&id=${match[1].split("_")[1]}&hd=1`;
    }
  }

  return embedUrl || url; // If not recognized, return the original URL
}



// Variable to store the original orientation
let originalOrientation = null;

function playVideo(url) {
  const embedUrl = getEmbedUrl(url);
  const container = document.getElementById("iframe-container");
  const iframe = document.getElementById("iframe");
  const controls = document.querySelector(".iframe-controls");

  if (!container || !iframe || !controls) return;

  // Store the current orientation before changing it
  if (screen.orientation && screen.orientation.type) {
    // Determine if current orientation is portrait or landscape
    const currentType = screen.orientation.type;
    if (currentType.includes('portrait')) {
      originalOrientation = 'portrait';
    } else if (currentType.includes('landscape')) {
      originalOrientation = 'landscape';
    }
  }

  // Set iframe source and make the container visible
  iframe.src = embedUrl.includes("?") ? embedUrl + "&autoplay=1" : embedUrl + "?autoplay=1";
  container.style.display = "flex"; // Show the full container
  controls.style.display = "flex"; // Show controls
  blockAdsAndPopupsInIframe(iframe);
  
  // Hide controls after timeout
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    controls.style.display = "none";
  }, 3000);

  // Lock orientation to landscape and enable full-screen mode
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock("landscape").catch(console.error);
    blockAdsAndPopupsInIframe(iframe);
  }
  if (typeof AndroidFullScreen !== "undefined" && AndroidFullScreen.immersiveMode) {
    AndroidFullScreen.immersiveMode();
  }

  // Handle physical back button
  document.addEventListener("backbutton", hideVideo, { once: true });
}

function hideVideo() {
  const iframe = document.getElementById("iframe");
  const container = document.getElementById("iframe-container");
  const controls = document.querySelector(".iframe-controls");

  if (!iframe || !container || !controls) return;

  // Reset the iframe source to stop video playback
  iframe.src = "";
  updateContinueWatching('force');
  // Hide the iframe container and controls
  container.style.display = "none";
  controls.style.display = "none";

  // Restore the original orientation
  if (screen.orientation && screen.orientation.lock && originalOrientation) {
    screen.orientation.lock(originalOrientation).catch(console.error);
  }

  // Exit full-screen mode
  if (typeof AndroidFullScreen !== "undefined" && AndroidFullScreen.showSystemUI) {
    AndroidFullScreen.showSystemUI();
  }
}


document.getElementById('confirm-add-episode').addEventListener('click', function() {
  const button = document.querySelector('#confirm-add-episode');
  const loading = document.querySelector('#loading-add-episode');
  button.style.display = 'none';
  loading.style.display = 'flex';
  addEpisode();
  
});

document.querySelector('.overlay').addEventListener('click', function() {
  
  
});




function showDialog(title, desc, type, page) {
  const dialog = document.querySelector('.dialog');
  const dialog_title = document.querySelector('.dialog-title');
  const dialog_img = document.querySelector('#dialog-img');
  const dialog_desc = document.querySelector('.dialog-desc');
  const confirm = document.querySelector('#dialog-confirm');

  if(type==='confirm'){
    confirm.style.display = 'flex';
    dialog_img.src = 'Assets/images/confirm.png'
    confirm.textContent = "Confirm"
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
  });
  }
  else if(type==='not-found'){
    confirm.style.display = 'none';
    dialog_img.src = 'Assets/images/not-found.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
      hideCategoryPage();
      hideMovie();
  });
  }
  else if(type==='server'){
    confirm.style.display = 'none';
    dialog_img.src = 'Assets/images/server.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
  });
  }
  else if(type==='error'){
    
    dialog_img.src = 'Assets/images/error.png'
    if(page ==='permission'){
      confirm.style.display = 'flex';
      document.querySelector('#dialog-close').addEventListener('click', function() {
        hideDialog();
        hideMovieLoading();
    });
    document.querySelector('#dialog-confirm').addEventListener('click', function() {
      location.reload();
  });
  
    }
    else if(page ==='auth'){
      confirm.style.display = 'none';
      document.querySelector('#dialog-close').addEventListener('click', function() {
        hideDialog();
        hideMovieLoading();
    });
  
    }
    else{
      confirm.style.display = 'none';
      document.querySelector('#dialog-close').addEventListener('click', function() {
        window.close();
    });
    }
   
  }
  else if(type==='info'){
    confirm.style.display = 'none';
    dialog_img.src = 'Assets/images/info.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
      hideMovieLoading();
  });
  }
  else if(type==='success'){
    confirm.style.display = 'none';
    dialog_img.src = 'Assets/images/success.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
      hideMovieLoading();
  });
  }
  else if(type==='internal-error'){
    confirm.style.display = 'flex';
    confirm.textContent = 'Try again';
    dialog_img.src = 'Assets/images/error.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
      window.close();
      navigator.app.exitApp();
  });
  document.querySelector('#dialog-confirm').addEventListener('click', function() {
    hideDialog();
    location.reload();
});
  }
  else{
    confirm.style.display = 'none';
    dialog_img.src = 'Assets/images/error.png'
    document.querySelector('#dialog-close').addEventListener('click', function() {
      hideDialog();
  });
  }
  dialog.style.display = 'flex';
  dialog.style.animation = 'bounceFadeIn 0.3s ease-out';
  dialog_title.textContent = title;
  dialog_desc.textContent = desc;
  document.querySelector('#dialog-close').addEventListener('click', function() {
    hideDialog();
});
}

function hideDialog() {
  const dialog = document.querySelector('.dialog');

  dialog.style.animation = 'bounceFadeOut 0.3s ease-in';

  setTimeout(() => {
    dialog.style.display = 'none';
  }, 300); // Matches animation duration
}



document.getElementById('confirm-add-category').addEventListener('click', function() {
  const nameInput = document.querySelector('#category-name');
  const imageInput = document.querySelector('#category-image');
  const button = document.querySelector('#confirm-add-category');
  const loading = document.querySelector('#loading-add-category');
  writeField("Categories", nameInput.value.trim(), "img_cover", imageInput.value.trim());
  button.style.display='none';
  loading.style.display='flex';
  
});
document.getElementById('delete-movie-cat').addEventListener('click', function() {
  
  DeleteItemType()
});
document.getElementById('import-add-episode').addEventListener('click', function() {
  const url = document.querySelector('#episode-url').value.trim();
  const button = document.querySelector('#confirm-add-actualMovie');
  const loading = document.querySelector('#loading-add-movie');
  ImportEpisode(url);
  episode_import = 1;
  button.style.display='none';
  loading.style.display='flex';
});

document.getElementById('confirm-add-actualMovie').addEventListener('click', function() {
  const name = document.querySelector('#actual-movie-name');
  const image = document.querySelector('#actual-movie-image');
  const image2 = document.querySelector('#actual-movie-favicon');
  const desc = document.querySelector('#actual-movie-desc');
  const category = document.querySelector('#select-titleCat');
  const button = document.querySelector('#confirm-add-actualMovie');
  const loading = document.querySelector('#loading-add-movie');
  button.style.display='none';
  loading.style.display='flex';
  writeMovie(name.value.trim(), "Details", "Category", category.textContent);
  writeMovie("query",  name.value.trim(), "favicon_img", image2.value.trim());
  writeMovieMerge("New",  name.value.trim(), "favicon_img", image2.value.trim());
  writeMovieMerge("New",  name.value.trim(), "category", category.textContent);
  writeMovieMerge("New",  name.value.trim(), "desc", desc.value.trim());
  writeMovieMerge("New",  name.value.trim(), "timestamp", Date.now());
  UpdateMovie("Categories", category.textContent, name.value.trim(), image2.value.trim());
  UpdateMovie(name.value.trim(), "Details", "banner_img", image.value.trim());
  UpdateMovie(name.value.trim(), "Details", "favicon_img", image2.value.trim());
  UpdateMovie(name.value.trim(), "Details", "Desc", desc.value.trim());
  episode_import = 0;
});

 
  const readWriteTracker = new EventTarget(); // Event-based tracking system

  let reads = 0;
  let writes = 0;
  
  // Listen for read events
  readWriteTracker.addEventListener("read", () => {
    incrementReads();
      checkUsage();
  });
  (function () {
    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };

    // Override console methods
    console.log = function (...args) {
        addErrorLog("success", formatConsoleMessage(args));
        originalConsole.log.apply(console, args);
    };

    console.error = function (...args) {
        addErrorLog("error", formatConsoleMessage(args));
        originalConsole.error.apply(console, args);
        checkFirebaseError(args);
    };

    console.warn = function (...args) {
        addErrorLog("alert", formatConsoleMessage(args));
        originalConsole.warn.apply(console, args);
    };

    console.info = function (...args) {
        addErrorLog("info", formatConsoleMessage(args));
        originalConsole.info.apply(console, args);
    };

    function formatConsoleMessage(args) {
        return args.map(arg => {
            if (typeof arg === "object") {
                if (Array.isArray(arg)) {
                    return arg.length ? `[${arg.join(", ")}]` : "[Cannot show object on log]";
                } else if (arg && Object.keys(arg).length) {
                    return Object.entries(arg)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(", ");
                } else {
                    return "[Cannot show object on log]";
                }
            }
            return arg;
        }).join(" ");
    }

    function checkFirebaseError(args) {
        const errorMessage = formatConsoleMessage(args);

        if (errorMessage.includes("permission-denied")) {
            showDialog("Insufficient Permissions", "You don't have permission to access the server data. Try again later or contact the administrator.", "error", "permission");
        } else if (errorMessage.includes("auth/")) {
            showDialog("Firebase Authentication Error", "There was an authentication issue. Please check your login status.", "error", "auth");
        }
    }
})();

  // Listen for write events
  readWriteTracker.addEventListener("write", () => {
    incrementWrites();
      checkUsage();
  });
  
  function checkUsage() {
      if (reads >= 50) {
          showDialog("Attention!", "Please be cautious with usage of the app. You reached over 50 reads in this session.", "server");
      } else if (reads === 1500) {
          showDialog("Warning!", "Please be cautious with usage of the app. You reached over 1500 reads in this session.", "server");
      }
  
      if (writes >= 500) {
          showDialog("Attention!", "Please be cautious with usage of the app. You reached over 500 writes in this session.", "server");
      } else if (writes === 1500) {
          showDialog("Warning!", "Please be cautious with usage of the app. You reached over 1500 writes in this session.", "server");
      }
  }
  
  // Function to track Firestore reads
  function trackRead() {
      readWriteTracker.dispatchEvent(new Event("read"));
  }
  
  // Function to track Firestore writes
  function trackWrite() {
      readWriteTracker.dispatchEvent(new Event("write"));
  }
  
  //----------------------------🛠️ DEBUG------------------------------

  document.addEventListener('click', function(event) {
    const movieElement = event.target.closest('.movie');

    if (movieElement) {
        const movieTitle = movieElement.querySelector('.movie-title')?.textContent.trim() || "No title";
        const title = document.querySelector('#movie-about-title');
        
        // Ensure the title updates before fetching details
        title.textContent = movieTitle;
     
        
        // Clear previous content and fetch new data
        getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
        showMovieLoading();
        showMovie();
        scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
        from_category = 0;
    }
});

document.addEventListener('click', function(event) {
  const movieElement = event.target.closest('.category-movie');

  if (movieElement) {
      const movieTitle = movieElement.querySelector('.category-movie-title')?.textContent.trim() || "No title";
      const title = document.querySelector('#movie-about-title');
      
      // Ensure the title updates before fetching details
      title.textContent = movieTitle;
   
      
      // Clear previous content and fetch new data
      getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
      showMovieLoading();
      showMovie(); // Ensure the movie details section is shown
      scrollToBeginning('.movie-page'); // Scrolls `.movie-page` to the beginning
      from_category = 1;
  }
});
function preventParentScroll() {
  const loadingDiv = document.querySelector(".movie-page-loading");

  if (!loadingDiv) return;

  loadingDiv.addEventListener("wheel", (event) => {
      const isAtTop = loadingDiv.scrollTop === 0;
      const isAtBottom = loadingDiv.scrollHeight - loadingDiv.scrollTop === loadingDiv.clientHeight;

      if ((event.deltaY < 0 && isAtTop) || (event.deltaY > 0 && isAtBottom)) {
          event.preventDefault(); // Prevents parent scrolling when at top or bottom
      }
  }, { passive: false });
}

// Call this function after the page loads
document.addEventListener("DOMContentLoaded", preventParentScroll);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector("#search-field"); // Replace with your actual input ID

  if (searchInput) {
      searchInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
              event.preventDefault(); 
              performSearch();
              document.querySelector('.search-loading').style.display = 'flex';
          }
      });
  }
});

async function performSearch() {
  // 1) Read & normalize the search input for querying
  const rawValue = document.querySelector("#search-field")?.value;
  if (!rawValue) return;
  const queryText = rawValue.trim().toLowerCase();

  // ────────── Manage “searchHistory” in localStorage ──────────
  const rawHistory = localStorage.getItem("searchHistory");
  let historyArr;
  try {
    historyArr = rawHistory ? JSON.parse(rawHistory) : [];
    if (!Array.isArray(historyArr)) historyArr = [];
  } catch {
    historyArr = [];
  }

  // Remove any existing entry whose text matches rawValue
  historyArr = historyArr.filter(item => item.text !== rawValue);

  // Prepend the new entry (with default “time.png”)
  historyArr.unshift({
    text: rawValue,
    img: "Assets/images/time.png"
  });

  // Optional: cap history to last N entries
  const MAX_HISTORY = 10;
  if (historyArr.length > MAX_HISTORY) {
    historyArr = historyArr.slice(0, MAX_HISTORY);
  }

  // Save back to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(historyArr));
  // ─────────────────────────────────────────────────────────────

  // 2) Grab references for result containers / indicators
  const results = document.querySelector('.search-content');
  const noresults = document.querySelector('.no-result');
  const sugg = document.querySelector('.search-suggestions');
  const loadingIndicator = document.querySelector('.search-loading');
  results.innerHTML = "";
  console.log("🔎 Searching for:", queryText);

  // 3) Show loading, hide suggestions
  const queryRef = collection(db, "query");
  sugg.style.display = 'none';
  loadingIndicator.style.display = 'block';

  try {
    // 4) Fetch all docs from Firestore
    const querySnapshot = await getDocs(queryRef);
    loadingIndicator.style.display = 'none';

    let matches = [];
    querySnapshot.forEach((docSnap) => {
      const docId = docSnap.id.toLowerCase();
      const docData = docSnap.data();
      if (
        docId.includes(queryText) ||
        JSON.stringify(docData).toLowerCase().includes(queryText)
      ) {
        matches.push(docSnap);
      }
    });

    if (matches.length > 0) {
      console.log(`✅ Found ${matches.length} matches!`);
      results.style.display = 'grid';
      noresults.style.display = 'none';

      let searchResultsHTML = "";
      matches.forEach((docSnap, index) => {
        const data = docSnap.data();
        const faviconUrl = data.favicon_img || "Assets/images/default.png";
        const fullTitle = data.title || docSnap.id;

        searchResultsHTML += `
          <div class="search-result movie" data-index="${index}">
            <img src="${faviconUrl}" alt="Favicon">
            <div class="movie-title">${fullTitle}</div>
          </div>
        `;
      });

      results.innerHTML = searchResultsHTML;

      // 5) Fade‐in animation
      setTimeout(() => {
        document.querySelectorAll(".search-result").forEach(el => el.classList.add("show"));
      }, 10);

      // 6) Click handler for each result
      document.querySelectorAll(".search-result").forEach(el => {
        el.addEventListener("click", (event) => {
          const movieElement = event.currentTarget;
          const movieTitle = movieElement.querySelector('.movie-title')?.textContent.trim() || "";
          const clickedImgSrc = movieElement.querySelector('img')?.src || "Assets/images/time.png";
          console.log("📌 Selected Match Full Title:", movieTitle);

          // ─── Update history entry whose .text === rawValue ───
          const rawHistory2 = localStorage.getItem("searchHistory");
          let historyArr2 = [];
          try {
            historyArr2 = rawHistory2 ? JSON.parse(rawHistory2) : [];
            if (!Array.isArray(historyArr2)) historyArr2 = [];
          } catch {
            historyArr2 = [];
          }

          for (let entry of historyArr2) {
            if (entry.text === rawValue) {
              entry.img = clickedImgSrc;
              entry.text = movieTitle; 
              break;
            }
          }
          localStorage.setItem("searchHistory", JSON.stringify(historyArr2));
          // ─────────────────────────────────────────────────────────

          // (a) Update the UI title element
          const titleElem = document.querySelector('#movie-about-title');
          if (titleElem) titleElem.textContent = movieTitle;

          // (b) Load details for that movie
          getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
          showMovieLoading();
          showMovie();
          scrollToBeginning('.movie-page');
        });
      });

      console.log("📄 Matched Documents:", matches);
    } else {
      console.log(`❌ No matches found for "${queryText}"`);
      noresults.style.display = 'flex';
      results.style.display = 'none';
    }
  } catch (error) {
    console.error("❌ Error searching for documents:", error);
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const searchField = document.getElementById("search-field");
  const suggestionBox = document.querySelector(".search-suggestions");
  
  let blurTimeout, opacityTimeout;

  if (searchField && suggestionBox) {
    suggestionBox.style.transition = "opacity 0.3s ease";
    suggestionBox.style.opacity = "0";
    suggestionBox.style.display = "none";

    searchField.addEventListener("focus", function () {
      clearTimeout(blurTimeout);
      clearTimeout(opacityTimeout);

      document.querySelector('.search-content').style.display = 'none';
      document.querySelector('.no-result').style.display = 'none';

      suggestionBox.innerHTML = "";
      let savedSuggestions = [];

      const rawHistory = localStorage.getItem("searchHistory");
      if (rawHistory) {
        try {
          const parsed = JSON.parse(rawHistory);
          if (Array.isArray(parsed)) savedSuggestions = parsed;
        } catch {
          // ignore parse errors
        }
      }

      // If none, fall back to lastSearchQuery
      if (savedSuggestions.length === 0) {
        const lastRaw = localStorage.getItem("lastSearchQuery");
        if (lastRaw) {
          savedSuggestions = [{ text: lastRaw, img: "Assets/images/time.png" }];
        }
      }

      // Filter duplicates by .text
      const uniqueTexts = new Set();
      const filteredSuggestions = [];
      savedSuggestions.forEach(item => {
        const text = item.text || "";
        const imgSrc = item.img || "Assets/images/time.png";
        if (!uniqueTexts.has(text)) {
          uniqueTexts.add(text);
          filteredSuggestions.push({ text, img: imgSrc });
        }
      });

      // Render each suggestion
      filteredSuggestions.forEach(entry => {
        const suggestionHTML = `
          <div class="suggestion">
            <img src="${entry.img}" alt="">
            <span>${entry.text}</span>
            <img src="Assets/images/redirect.png" id="redirect-button" alt="">
          </div>
        `;
        suggestionBox.insertAdjacentHTML("beforeend", suggestionHTML);
      });

      // Click handler to either performSearch or load movie details directly
      suggestionBox.querySelectorAll(".suggestion").forEach(suggestion => {
        suggestion.addEventListener("click", function () {
          const imgSrc = suggestion.querySelector("img").src;
          const text = suggestion.querySelector("span").textContent.trim();

          if (imgSrc.includes("time.png")) {
            // Default icon: place text into input and run a search
            searchField.value = text;
            performSearch();
          } else {
            // Previously clicked movie: load its details immediately
            const movieTitle = text;
            // (a) Update the UI title element
            const titleElem = document.querySelector('#movie-about-title');
            if (titleElem) titleElem.textContent = movieTitle;

            // (b) Load details for that movie
            getMovieDetails(movieTitle, "Details", "banner_img", "Desc", "Category");
            showMovieLoading();
            showMovie();
            scrollToBeginning('.movie-page');
          }
        });
      });

      suggestionBox.style.display = "block";
      setTimeout(() => {
        suggestionBox.style.opacity = "1";
      }, 10);
    });

    searchField.addEventListener("blur", function () {
      blurTimeout = setTimeout(() => {
        suggestionBox.style.opacity = "0";
        opacityTimeout = setTimeout(() => {
          suggestionBox.style.display = "none";
        }, 300);
      }, 200);
    });
  } else {
    console.warn("Either #search-field or .search-suggestions was not found in the DOM.");
  }
});











async function fetchPlaylistVideos(playlistUrl) {
  console.log("Fetching playlist videos from:", playlistUrl);

  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) {
      alert("Invalid Playlist URL");
      return [];
  }

  const API_KEY = "AIzaSyB6ww6sbYrXrHxpVURbTYdg-3qQ-DOwF3Q"; // Replace with your YouTube API key
  const MAX_RESULTS = 50; // Max items per request

  let videos = [];
  let pageToken = "";
  let requestCount = 0;

  do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.append("part", "snippet");
      url.searchParams.append("maxResults", MAX_RESULTS);
      url.searchParams.append("playlistId", playlistId);
      url.searchParams.append("key", API_KEY);
      if (pageToken) url.searchParams.append("pageToken", pageToken);

      console.log(`📡 API Request #${++requestCount}:`, url.toString());

      try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.error) {
              console.error("❌ YouTube API Error:", data.error);
              
              if (data.error.errors[0].reason === "quotaExceeded") {
                  alert("⚠ YouTube API quota exceeded! Please try again later.");
              }

              return [];
          }

          console.log(`✅ Retrieved ${data.items.length} videos`);

          videos = videos.concat(data.items.map(item => ({
              title: item.snippet.title,
              url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`
          })));

          pageToken = data.nextPageToken || "";

      } catch (error) {
          console.error("❌ Error fetching playlist:", error);
          alert("An error occurred while fetching the playlist. Check console for details.");
          return [];
      }
  } while (pageToken); // Fetch next batch if needed

  console.log(`🎥 Total videos fetched: ${videos.length}`);
  return videos;
}

function extractPlaylistId(url) {
  console.log("Extracting Playlist ID from:", url);
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (match) {
      console.log("✅ Extracted Playlist ID:", match[1]);
  } else {
      console.error("❌ Invalid Playlist URL format");
  }
  return match ? match[1] : null;
}

async function ImportEpisode(playlistUrl) {
  console.log("📥 Importing episodes from playlist:", playlistUrl);
  const episodes = await fetchPlaylistVideos(playlistUrl);

  if (!episodes || episodes.length === 0) {
      console.warn("⚠ No videos found in this playlist.");
      alert("No videos found in this playlist.");
      return;
  }

  console.log("📌 Adding episodes to the list...");

  const titleInput = document.getElementById('episode-name');
  let baseTitle = titleInput.value.trim();
  let episodeNumber = null;
  
  const match = baseTitle.match(/^(.+?)\s*(\d+)?$/); // Extracts the word and number if present

  if (match) {
      baseTitle = match[1]; // Extract the text (e.g., "Episodul")
      episodeNumber = match[2] ? parseInt(match[2]) : 1; // Extract the number or start from 1
  }

  episodes.forEach((episode, index) => {
      let episodeTitle = baseTitle ? `${baseTitle} ${episodeNumber++}` : episode.title;
      ImportEpisodeEntry(episodeTitle, episode.url, index);
  });

  console.log("✅ Import complete! Total episodes added:", episodes.length);
}



function ImportEpisodeEntry(title, url, index) {
  console.log(`🎬 Adding Episode #${index + 1}: ${title} (${url})`);

  const parentDiv = document.querySelector(".add-movie-episodes");
  const newDiv = document.createElement("div");
  const titleInput = document.getElementById('episode-name');
  const urlInput = document.getElementById('episode-url');
  const inputs = document.querySelectorAll('.add-episode-inputs');
  const preview = document.querySelector('#preview-url');
  const titles = document.querySelector('#select-titleMovie').textContent;

  titleInput.value = title; // Set extracted video title
  urlInput.value = url; // Set extracted video URL

  updateField(titles, "Episoade", title, url);

  inputs.forEach(input => {
      input.value = '';
  });

  console.log(`✅ Episode "${title}" added successfully!`);
}

document.addEventListener('deviceready', () => {
  console.log('Device ready');
  
  // Initial setup
  if (window.StatusBar) {
    StatusBar.overlaysWebView(false);
    StatusBar.styleDefault();
  }
  
  // The key insight: force a layout change that triggers system refresh
  function applyStatusBarColor() {
    if (window.StatusBar) {
      StatusBar.backgroundColorByHexString('#15191C');
      
      // Force a layout recalculation by briefly changing body height
      const originalHeight = document.body.style.height;
      document.body.style.height = 'calc(100vh - 1px)';
      
      setTimeout(() => {
        document.body.style.height = originalHeight;
        // Reapply color after layout change
        StatusBar.backgroundColorByHexString('#15191C');
      }, 50);
    }
    
    if (window.NavigationBar) {
      window.NavigationBar.backgroundColorByHexString('#15191C');
    }
  }
  
  // Apply colors with forced refresh
  setTimeout(applyStatusBarColor, 200);
  
  // Reapply on orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(applyStatusBarColor, 300);
  });
  
  // Make it available globally for manual trigger
  window.refreshStatusBar = applyStatusBarColor;
});


document.addEventListener("DOMContentLoaded", function () {
  const leftTab = document.querySelector(".movie-episodes-top-left");
  const rightTab = document.querySelector(".movie-episodes-top-right");

  const episodes = document.querySelector('.movie-episodes');
  const similar = document.querySelector('.movie-similar');

  function toggleActiveTab(selectedTab, otherTab) {
    selectedTab.classList.add("active");
    otherTab.classList.remove("active");

    let selected = selectedTab.textContent.trim();

    if (selected === 'Episodes') {
      episodes.style.display = 'flex';
      similar.style.display = 'none';
    } else {
      episodes.style.display = 'none';
      similar.style.display = 'flex';

      // When similar tab is active, call the function with parameters
      const subtitleElement = document.querySelector('#movie-about-subtitle');
      if (subtitleElement) {
        const documentId = subtitleElement.textContent.trim();
        getSimilarMoviesFromCategory("Categories", documentId);
      } else {
        console.error("#movie-about-subtitle element not found.");
      }
    }
  }

  // Ensure left tab is active on start and log it
  toggleActiveTab(leftTab, rightTab);

  leftTab.addEventListener("click", function () {
    toggleActiveTab(leftTab, rightTab);
  });

  rightTab.addEventListener("click", function () {
    toggleActiveTab(rightTab, leftTab);
  });
});
