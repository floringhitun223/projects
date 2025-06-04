console.log('Firebase.js loaded');
console.log('Initializing navigation components...');

const navbarItems = document.querySelectorAll('.navbar-item');
const detailSections = document.querySelectorAll('.detail-section');

console.log('Found navbar items:', navbarItems.length);
console.log('Found detail sections:', detailSections.length);

navbarItems.forEach(item => {
  item.addEventListener('click', () => {
    navbarItems.forEach(i => {
      i.classList.remove('active');
      i.querySelector('.navbar-item-title').style.display = 'none'; // hide text
    });

    item.classList.add('active');
    item.querySelector('.navbar-item-title').style.display = 'block'; // show text

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
    search.style.height = "calc(100% - 20px)";
    search.style.borderRadius = "8px";
    search.style.width = '100%';
    search.style.maxWidth = '400px';
  });
}

const quill = new Quill('#d-e-worksheet-input', {
  theme: 'snow',
  modules: { toolbar: false, history: { delay: 1000, maxStack: 100, userOnly: true } }
});

function replaceSelectedImage() {
  // Check if there's a selection in the Quill editor
  const selection = quill.getSelection();
  if (!selection) {
    console.log('No selection found');
    return;
  }
  
  // Get the selected element
  const [blot] = quill.getLeaf(selection.index);
  if (!blot) {
    console.log('No element found at selection');
    return;
  }
  
  const img = blot.domNode;
  if (!img || img.tagName !== 'IMG') {
    console.log('Selected element is not an image');
    return;
  }
  
  // Create a file input for media picker
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Create a FileReader to convert the file to a data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      // Replace the image source with the new image
      img.src = e.target.result;
      
      // Reset the original dimensions data attributes so the new image can be properly scaled
      img.removeAttribute('data-original-width');
      img.removeAttribute('data-original-height');
      
      // Wait for the new image to load to get its natural dimensions
      img.onload = () => {
        img.dataset.originalWidth = img.naturalWidth;
        img.dataset.originalHeight = img.naturalHeight;
        console.log('Image replaced successfully');
      };
    };
    
    reader.readAsDataURL(file);
    
    // Clean up the file input
    document.body.removeChild(fileInput);
  });
  
  // Add to DOM and trigger click
  document.body.appendChild(fileInput);
  fileInput.click();
}
const range = document.querySelector('input[type="range"]'); // or better, use an id or class for that input

function updateImageSize() {
  const rangeValue = Number(range.value);
  const selection = quill.getSelection();
  if (!selection) return;
  
  const [blot] = quill.getLeaf(selection.index);
  if (!blot) return;
  
  const img = blot.domNode;
  if (!img || img.tagName !== 'IMG') return;
  
  // Store original dimensions
  if (!img.dataset.originalWidth) {
    img.dataset.originalWidth = img.naturalWidth;
    img.dataset.originalHeight = img.naturalHeight;
  }
  
  const originalWidth = Number(img.dataset.originalWidth);
  const originalHeight = Number(img.dataset.originalHeight);
  
  // Get screen width (with some padding for better UX)
  const maxScreenWidth = window.innerWidth - 40; // 20px padding on each side
  
  // Calculate the maximum scale that fits the screen width
  const maxScale = maxScreenWidth / originalWidth;
  
  // Scale from 0% to the maximum scale that fits screen width
  const actualScale = (rangeValue / 100) * maxScale;
  
  // Calculate final dimensions
  const newWidth = originalWidth * actualScale;
  const newHeight = originalHeight * actualScale;
  
  // Apply the dimensions
  img.style.width = newWidth + 'px';
  img.style.height = newHeight + 'px';
  img.style.maxWidth = '100%';
  img.style.height = 'auto'; // Let height adjust automatically to maintain aspect ratio
}

range.addEventListener('input', updateImageSize);

// Listen for window resize events to update image size dynamically
window.addEventListener('resize', () => {
  // Debounce the resize event to avoid too many calls
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(updateImageSize, 100);
});
let currentSelectedImage = null; // Track currently selected image

quill.on('selection-change', (range, oldRange, source) => {
  
  if (!range) {
    // Remove border from previously selected image
    if (currentSelectedImage) {
      currentSelectedImage.style.border = '';
      currentSelectedImage = null;
    }
    return;
  }
  
  const img = getSelectedImage();
  const edit = document.querySelector('#format-image-edit');
  
  // Remove border from previously selected image
  if (currentSelectedImage && currentSelectedImage !== img) {
    currentSelectedImage.style.border = '';
  }
  
  if (img) {
    console.log('Image selected:', img);
    edit.style.display = 'flex';
    
    // Add border to selected image
    img.style.border = '2px solid #4DA3FF'; // Blue border
    img.style.borderRadius = '2px'; // Optional: slight rounding
    currentSelectedImage = img;
  } else {
    console.log('Selection is not on an image');
    edit.style.display = 'none';
    
    // Remove border if no image is selected
    if (currentSelectedImage) {
      currentSelectedImage.style.border = '';
      currentSelectedImage = null;
    }
  }
});

function getSelectedImage() {
  const range = quill.getSelection();
  if (!range) return null;
  const [leaf, offset] = quill.getLeaf(range.index);
  if (!leaf) return null;
  if (leaf?.parent?.domNode?.tagName === 'IMG') return leaf.parent.domNode;
  if (leaf?.domNode?.tagName === 'IMG') return leaf.domNode;
  return null;
}

const formatListBtn = document.getElementById('format-list');

// Function to check if selection is inside a list
function isSelectionInList() {
  const range = quill.getSelection();
  if (!range) return false;
  const [line, _] = quill.getLine(range.index);
  const formats = quill.getFormat(range);
  return formats.list === 'bullet' || formats.list === 'ordered';
}

// Toggle list formatting
function toggleList() {
  const inList = isSelectionInList();
  const range = quill.getSelection();
  if (!range) return;

  const [startLine, startOffset] = quill.getLine(range.index);
  const [endLine, endOffset] = quill.getLine(range.index + range.length);
  const startIndex = quill.getIndex(startLine);
  const endIndex = quill.getIndex(endLine) + endLine.length();

  for (let i = startIndex; i <= endIndex;) {
    const [line] = quill.getLine(i);
    if (!line) break;
    quill.formatLine(i, 1, { list: inList ? false : 'ordered' });
    i += line.length() + 1;
  }

  updateListButtonStyle(); // Optional immediate feedback
}

// Update the button style (e.g., background) based on selection
function updateListButtonStyle() {
  if (isSelectionInList()) {
    formatListBtn.style.background = '#4DA3FF'; // Active style
  } else {
    formatListBtn.style.background = ''; // Default
  }
}

// Add click event to toggle list
formatListBtn.addEventListener('click', () => {
  toggleList();
});

// Update button style on cursor or selection change
quill.on('selection-change', () => {
  updateListButtonStyle();
});

// Optional: update on content-change as well for accuracy
quill.on('text-change', () => {
  updateListButtonStyle();
});

const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

// Check if undo/redo are available
function updateUndoRedoButtons() {
  const undoStack = quill.history.stack.undo;
  const redoStack = quill.history.stack.redo;

  undoButton.disabled = undoStack.length === 0;
  redoButton.disabled = redoStack.length === 0;

  // Optional: change opacity or style
  undoButton.style.opacity = undoStack.length === 0 ? 0.5 : 1;
  redoButton.style.opacity = redoStack.length === 0 ? 0.5 : 1;
}

// Call this after every change
quill.on('text-change', updateUndoRedoButtons);
quill.on('selection-change', updateUndoRedoButtons);

// Also call it after undo/redo actions
undoButton.addEventListener('click', () => {
  quill.history.undo();
  updateUndoRedoButtons();
  console.log('Undo triggered');
});

redoButton.addEventListener('click', () => {
  quill.history.redo();
  updateUndoRedoButtons();
  console.log('Redo triggered');
});
 const colorInput = document.getElementById('colorPicker');
const button = document.getElementById('format-fontColor');

// Open color picker on button click
button.addEventListener('click', () => {
  colorInput.click();
});

// Apply selected color to text or cursor
colorInput.addEventListener('input', (e) => {
  const selectedColor = e.target.value;
  const range = quill.getSelection();

  if (range && range.length > 0) {
    quill.formatText(range.index, range.length, 'color', selectedColor);
  } else if (range) {
    quill.format('color', selectedColor);
  }
});

// 🔄 Update color input when selecting text
quill.on('selection-change', (range) => {
  if (range) {
    const formats = quill.getFormat(range);
    if (formats.color) {
      // Set picker to current text color
      colorInput.value = toHexColor(formats.color);
    } else {
      // Reset picker if no color (default black)
      colorInput.value = '#000000';
    }
  }
});

// 🛠 Helper to convert named or rgb color to hex
function toHexColor(color) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = color;
  return ctx.fillStyle.length === 7 ? ctx.fillStyle : '#ffffff'; // fallback
}
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



//-----------------TEXT MANIPULATION--------------------
const boldButton = document.querySelector('#format-bold');
const italicButton = document.querySelector('#format-italic');
const underlineButton = document.querySelector('#format-underline');
const alignLeftButton = document.getElementById('format-alignLeft');
const alignCenterButton = document.getElementById('format-alignCenter');
const alignRightButton = document.getElementById('format-alignRight'); // ← Add this in HTML too
const alignJustifyButton = document.getElementById('format-alignJustify'); // ← Add this in HTML too

function updateFormatButtons() {
  const range = quill.getSelection();
  if (range) {
    const formats = quill.getFormat(range);

    boldButton.style.backgroundColor = formats.bold ? '#4DA3FF' : 'transparent';
    italicButton.style.backgroundColor = formats.italic ? '#4DA3FF' : 'transparent';
    underlineButton.style.backgroundColor = formats.underline ? '#4DA3FF' : 'transparent';

    // Alignment buttons
    alignLeftButton.style.backgroundColor =
      !formats.align || formats.align === 'left' ? '#4DA3FF' : 'transparent';
    alignCenterButton.style.backgroundColor =
      formats.align === 'center' ? '#4DA3FF' : 'transparent';
    alignRightButton.style.backgroundColor =
      formats.align === 'right' ? '#4DA3FF' : 'transparent';
    alignJustifyButton.style.backgroundColor =
      formats.align === 'justify' ? '#4DA3FF' : 'transparent';

    if (formats.align) {
      console.log('Text is aligned:', formats.align);
    }
  } else {
    // Cursor not in editor
    boldButton.style.backgroundColor = 'transparent';
    italicButton.style.backgroundColor = 'transparent';
    underlineButton.style.backgroundColor = 'transparent';
    alignLeftButton.style.backgroundColor = 'transparent';
    alignCenterButton.style.backgroundColor = 'transparent';
    alignRightButton.style.backgroundColor = 'transparent';
    alignJustifyButton.style.backgroundColor = 'transparent';
  }
}


// ✅ Update when user changes selection
quill.on('selection-change', updateFormatButtons);

// ✅ Format button listeners
boldButton.addEventListener('click', () => {
  const isBold = quill.getFormat().bold;
  quill.format('bold', !isBold);
  setTimeout(updateFormatButtons, 0);
});

italicButton.addEventListener('click', () => {
  const isItalic = quill.getFormat().italic;
  quill.format('italic', !isItalic);
  setTimeout(updateFormatButtons, 0);
});

underlineButton.addEventListener('click', () => {
  const isUnderline = quill.getFormat().underline;
  quill.format('underline', !isUnderline);
  setTimeout(updateFormatButtons, 0);
});

alignLeftButton.addEventListener('click', () => {
  // Clear any existing alignment
  quill.format('align', false); // Remove current alignment
  // Apply left explicitly
  setTimeout(() => {
    quill.format('align', 'left');
    updateFormatButtons();
  }, 0);
});

alignCenterButton.addEventListener('click', () => {
  const currentAlign = quill.getFormat().align;
  const newAlign = currentAlign === 'center' ? false : 'center';
  quill.format('align', newAlign);
  setTimeout(updateFormatButtons, 0);
});

alignRightButton.addEventListener('click', () => {
  const currentAlign = quill.getFormat().align;
  const newAlign = currentAlign === 'right' ? false : 'right';
  quill.format('align', newAlign);
  setTimeout(updateFormatButtons, 0);
});
alignJustifyButton.addEventListener('click', () => {
  const currentAlign = quill.getFormat().align;
  const newAlign = currentAlign === 'justify' ? false : 'justify';
  quill.format('align', newAlign);
  setTimeout(updateFormatButtons, 0);
});


document.addEventListener('DOMContentLoaded', () => {
  const allBars = document.querySelectorAll('.bottombar-extra');
  const addObjectMenu = document.querySelector('.add-object');
  const addObjectButton = document.querySelector('#add-object-butt');
  let outsideClickArmed = false;

  function isEditorVisible() {
    const editor = document.querySelector('.editor');
    if (!editor) return false;
    const style = window.getComputedStyle(editor);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           editor.offsetParent !== null;
  }

  function toggleBar(barId, buttonId) {
    const bar = document.querySelector(barId);
    const button = document.querySelector(buttonId);

    button.addEventListener('click', event => {
      event.stopPropagation();

      // Only toggle if .editor is visible
      if (!isEditorVisible()) return;

      const isShown = bar.classList.contains('show');
      if (isShown) {
        bar.classList.remove('show');
        button.classList.remove('active');
        outsideClickArmed = false;
        return;
      }

      // Hide all other bars and deactivate buttons
      allBars.forEach(el => el.classList.remove('show'));
      document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));

      // Also hide add-object menu
      if (addObjectMenu) {
        addObjectMenu.classList.remove('show');
        if (addObjectButton) addObjectButton.classList.remove('active');
      }

      // Position this bar centered under its button
      const rect = button.getBoundingClientRect();
      const barWidth = bar.offsetWidth;
      const barLeft = rect.left + (rect.width / 2) - (barWidth / 2);
      bar.style.left = `${barLeft}px`;
      bar.style.right = 'auto';

      // Show this bar + mark active
      bar.classList.add('show');
      button.classList.add('active');

      // Scroll its active item into view
      const activeItem = bar.querySelector('.active');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      outsideClickArmed = false;
    });

    // MODIFIED: Handle font-size buttons with delay to allow font change to complete
    bar.addEventListener('click', (event) => {
      const clickedElement = event.target;
      const isFontSizeButton = clickedElement.classList.contains('font-size');
      const isAlignButton = clickedElement.classList.contains('align-option') || 
                           clickedElement.closest('.align-option');
      
      if (isFontSizeButton) {
        // For font-size buttons: allow the font change to complete, then hide menu
        setTimeout(() => {
          bar.classList.remove('show');
          button.classList.remove('active');
          outsideClickArmed = false;
        }, 100); // Small delay to allow font change to process
      } else if (isAlignButton) {
        // For alignment buttons: similar delay
        setTimeout(() => {
          bar.classList.remove('show');
          button.classList.remove('active');
          outsideClickArmed = false;
        }, 100);
      } else {
        // For other clicks: close immediately
        bar.classList.remove('show');
        button.classList.remove('active');
        outsideClickArmed = false;
      }
    });
  }

  // Set up the two extra format bars
  toggleBar('#extra-align', '#format-alignMore');
  toggleBar('#extra-fontSize', '#format-fontSize');

  // Separate handler for the add-object menu
  if (addObjectButton && addObjectMenu) {
    addObjectButton.addEventListener('click', event => {
      event.stopPropagation();

      const isShown = addObjectMenu.classList.contains('show');
      if (isShown) {
        addObjectMenu.classList.remove('show');
        addObjectButton.classList.remove('active');
      } else {
        // Hide all other menus
        allBars.forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));

        addObjectMenu.classList.add('show');
        addObjectButton.classList.add('active');

        const activeItem = addObjectMenu.querySelector('.active');
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });

    // MODIFIED: Handle add-object menu items with delay if needed
    addObjectMenu.addEventListener('click', (event) => {
      // Check if clicked element is a functional button (adjust classes as needed)
      const clickedElement = event.target;
      const isFunctionalButton = clickedElement.classList.contains('add-item') || 
                                clickedElement.closest('.add-item');
      
      if (isFunctionalButton) {
        // For functional buttons: small delay to allow action to complete
        setTimeout(() => {
          addObjectMenu.classList.remove('show');
          addObjectButton.classList.remove('active');
        }, 100);
      } else {
        // For other clicks: close immediately
        addObjectMenu.classList.remove('show');
        addObjectButton.classList.remove('active');
      }
    });
  }

  // Global click handler for outside clicks
  document.addEventListener('click', event => {
    // 1) Handle bottombar-extra menus (2-step outside click to close)
    const anyBarShown = Array.from(allBars).some(bar => bar.classList.contains('show'));
    if (isEditorVisible() && anyBarShown) {
      if (!outsideClickArmed) {
        outsideClickArmed = true;
      } else {
        allBars.forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
        outsideClickArmed = false;
      }
    } else {
      outsideClickArmed = false;
    }

    // 2) Handle add-object menu: only hide if click is outside both menu and button
    if (
      addObjectMenu &&
      addObjectMenu.classList.contains('show') &&
      !addObjectMenu.contains(event.target) &&
      !addObjectButton.contains(event.target)
    ) {
      addObjectMenu.classList.remove('show');
      addObjectButton.classList.remove('active');
    }
  });

  // MODIFIED: Allow functional buttons to work, then close menus with delay
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', event => {
      // List of buttons that toggle menus (add here if you add more toggler buttons)
      const menuToggleButtons = [
        addObjectButton,
        document.querySelector('#format-alignMore'),
        document.querySelector('#format-fontSize')
      ];

      // Check if this is a font-size button or other functional button
      const isFontSizeButton = button.classList.contains('font-size');
      const isAlignButton = button.classList.contains('align-option');

      // If clicked button is a functional button, close menus with delay
      if (isFontSizeButton || isAlignButton) {
        setTimeout(() => {
          allBars.forEach(el => el.classList.remove('show'));
          document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
          if (addObjectMenu) addObjectMenu.classList.remove('show');
          if (addObjectButton) addObjectButton.classList.remove('active');
          outsideClickArmed = false;
        }, 100);
      }
      // If clicked button is NOT a menu toggler button AND not a functional button, hide immediately
      else if (!menuToggleButtons.includes(button)) {
        allBars.forEach(el => el.classList.remove('show'));
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'));
        if (addObjectMenu) addObjectMenu.classList.remove('show');
        if (addObjectButton) addObjectButton.classList.remove('active');
        outsideClickArmed = false;
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const imageMenu = document.querySelector('.image-manipulation');
  const toggleButton = document.querySelector('#format-image-edit');
  const buttonParent = toggleButton.parentElement;
  let outsideClickArmed = false;

  function isMenuVisible() {
    return imageMenu.classList.contains('show');
  }

  function showMenu() {
    imageMenu.classList.add('show');
    toggleButton.classList.add('active');
    outsideClickArmed = false;
  }

  function hideMenu() {
    imageMenu.classList.remove('show');
    toggleButton.classList.remove('active');
    outsideClickArmed = false;
  }

  toggleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isMenuVisible()) {
      hideMenu();
    } else {
      showMenu();
    }
  });

  imageMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    outsideClickArmed = false;
  });

  buttonParent.addEventListener('click', (event) => {
    if (
      isMenuVisible() &&
      !imageMenu.contains(event.target) &&
      event.target !== toggleButton
    ) {
      hideMenu();
    }
  });

  // Hide menu immediately when clicking any other .button except the toggleButton
  document.querySelectorAll('.button').forEach((btn) => {
    if (btn !== toggleButton) {
      btn.addEventListener('click', () => {
        if (isMenuVisible()) {
          hideMenu();
        }
      });
    }
  });

  document.addEventListener('click', () => {
    if (isMenuVisible()) {
      if (!outsideClickArmed) {
        outsideClickArmed = true;
      } else {
        hideMenu();
      }
    } else {
      outsideClickArmed = false;
    }
  });
});

// Prevent Quill from losing focus when clicking .button elements
document.addEventListener('mousedown', (event) => {
  const button = event.target.closest('.button');
  const fontSizeBtn = event.target.closest('.font-size');

  if (button && !fontSizeBtn) {
    event.preventDefault(); // Prevent losing selection on click

    const currentSelection = quill.getSelection();

    // Restore selection if it was lost (only if needed)
    setTimeout(() => {
      const newSelection = quill.getSelection();
      if (!newSelection && currentSelection) {
        quill.setSelection(currentSelection); // Restore if selection was lost
      }
    }, 0);
  }
});





let toggleEditor;

// Main: Scale + Fade (elegant and smooth)
function showEditor() {
  const editor = document.querySelector('.editor');

  editor.style.display = 'flex';
  editor.style.transform = 'scale(0.9)';
  editor.style.opacity = '0';
  editor.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

  void editor.offsetWidth; // force reflow

  editor.style.transform = 'scale(1)';
  editor.style.opacity = '1';

  toggleEditor = 1;

  // After animation completes, update Quill so it re-renders properly
  setTimeout(() => {
    quill.update();  // <-- Here is where to add it
    // optionally quill.focus();
  }, 300);
}


function hideEditor() {
  const editor = document.querySelector('.editor');

  // Step 1: Animate scale down + fade out
  editor.style.transform = 'scale(0.9)';
  editor.style.opacity = '0';

  // Step 2: Keep the same transition as show for smoothness
  editor.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

  // Step 3: After animation ends, hide completely with display:none
  setTimeout(() => {
    editor.style.display = 'none';

    // Reset styles for next show call
    editor.style.transform = '';
    editor.style.opacity = '';
    editor.style.transition = '';
  }, 300);

  toggleEditor = 0;
}
// Alternative: Slide from right
function showEditorSlideRight() {
  const editor = document.querySelector('.editor');
  
  editor.style.display = 'flex';
  editor.style.transform = 'translateX(100%)';
  editor.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  void editor.offsetWidth;
  
  editor.style.transform = 'translateX(0)';
  
  toggleEditor = 1;
}

function hideEditorSlideRight() {
  const editor = document.querySelector('.editor');
  
  editor.style.transform = 'translateX(100%)';
  
  setTimeout(() => {
    editor.style.display = 'none';
    editor.style.transform = '';
    editor.style.transition = '';
  }, 350);
  
  toggleEditor = 0;
}

// Alternative: Fade with slight scale
function showEditorFade() {
  const editor = document.querySelector('.editor');
  
  editor.style.display = 'flex';
  editor.style.transform = 'scale(1.05)';
  editor.style.opacity = '0';
  editor.style.transition = 'all 0.25s ease-out';
  
  void editor.offsetWidth;
  
  editor.style.transform = 'scale(1)';
  editor.style.opacity = '1';
  
  toggleEditor = 1;
}

function hideEditorFade() {
  const editor = document.querySelector('.editor');
  
  editor.style.transform = 'scale(1.05)';
  editor.style.opacity = '0';
  
  setTimeout(() => {
    editor.style.display = 'none';
    editor.style.transform = '';
    editor.style.opacity = '';
    editor.style.transition = '';
  }, 250);
  
  toggleEditor = 0;
}
document.addEventListener('deviceready', function () {
  document.addEventListener('backbutton', function (e) {
    if (toggleEditor === 1) {
      e.preventDefault(); // Stop default back action

      quill.setContents([]);         // Clear all editor content
      hideEditor();                  // Hide the editor UI
      showDialog("Tylto auto-saves your project");
      toggleEditor = 0;              // Reset editor state
    } else {
      navigator.app.backHistory();   // Default back behavior
    }
  }, false);
});


// Handle Ctrl+E for debug toggle
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key.toLowerCase() === 'e') {
    console.log('Ctrl+E pressed');
    if (toggleEditor === 1) {
      hideEditor();
    } else {
      showEditor();
    }
  }
});
// Create a custom size blot that accepts any pixel value
const Inline = Quill.import('blots/inline');

class SizeStyle extends Inline {
  static create(value) {
    let node = super.create();
    node.style.fontSize = value;
    return node;
  }

  static formats(node) {
    return node.style.fontSize || '';
  }

  format(name, value) {
    if (name === 'size' && value) {
      this.domNode.style.fontSize = value;
    } else {
      super.format(name, value);
    }
  }
}

SizeStyle.blotName = 'size';
SizeStyle.tagName = 'span';

// Register the custom blot
Quill.register(SizeStyle);

// Transform function (now accepts any size)
function transformSizeForQuill(pxSize) {
  if (typeof pxSize === 'number' && pxSize > 0) {
    return `${pxSize}px`;
  }
  console.warn('Invalid font size:', pxSize);
  return null;
}

// Variable to store the last known selection
let lastKnownSelection = null;

// Set font size function
function setQuillFontSize(pxSize, storedRange = null) {
  const transformedSize = transformSizeForQuill(pxSize);
  if (transformedSize) {
    // Use the stored range if provided, otherwise try to get current selection
    const range = storedRange || quill.getSelection();
    
    if (range) {
      if (range.length === 0) {
        // No text selected - set cursor position and format next typed text
        quill.setSelection(range.index, 0);
        quill.format('size', transformedSize);
      } else {
        // Text is selected - format the selected text
        quill.formatText(range.index, range.length, 'size', transformedSize);
        // Restore the selection
        quill.setSelection(range.index, range.length);
      }
      // Keep focus on the editor
      quill.focus();
    } else if (lastKnownSelection) {
      // Use the last known selection as fallback
      if (lastKnownSelection.length === 0) {
        quill.setSelection(lastKnownSelection.index, 0);
        quill.format('size', transformedSize);
      } else {
        quill.formatText(lastKnownSelection.index, lastKnownSelection.length, 'size', transformedSize);
        quill.setSelection(lastKnownSelection.index, lastKnownSelection.length);
      }
      quill.focus();
    }
  }
}

// Function to get the current font size at cursor/selection
function getCurrentFontSize() {
  const range = quill.getSelection();
  if (!range) return null;
  
  // Get format at current position
  const format = quill.getFormat(range.index, range.length);
  
  // If there's a size format, extract the pixel value
  if (format.size) {
    const match = format.size.match(/(\d+)px/);
    return match ? parseInt(match[1], 10) : null;
  }
  
  // If no explicit size format, try to get computed style
  if (range.length === 0) {
    // No selection, check at cursor position
    const [leaf] = quill.getLeaf(range.index);
    if (leaf && leaf.domNode) {
      // Ensure domNode is an Element, not a Text node
      let el = leaf.domNode;
      if (el.nodeType === Node.TEXT_NODE) {
        el = el.parentElement;
      }
      if (el && el instanceof Element) {
        const computedStyle = window.getComputedStyle(el);
        const fontSize = computedStyle.fontSize;
        const match = fontSize.match(/(\d+(?:\.\d+)?)px/);
        return match ? Math.round(parseFloat(match[1])) : null;
      }
    }
  }
  
  return null;
}

// Function to update font size button states
function updateFontSizeButtons() {
  const currentSize = getCurrentFontSize();
  
  // Remove active state from all buttons
  document.querySelectorAll('.font-size').forEach(div => {
    div.style.backgroundColor = '';
    div.style.color = '';
    div.classList.remove('active');
  });
  
  // Highlight the matching size button
  if (currentSize) {
    document.querySelectorAll('.font-size').forEach(div => {
      if (div.id === 'custom-font') return; // Skip custom font button
      
      const buttonSize = parseInt(div.innerText.trim(), 10);
      if (buttonSize === currentSize) {
        div.style.backgroundColor = '#007bff';
        div.style.color = 'white';
        div.classList.add('active');
      }
    });
  }
}

// SINGLE event listener setup for font size buttons
document.querySelectorAll('.font-size').forEach(div => {
  div.addEventListener('mousedown', (e) => {
    // Store the current selection BEFORE the click causes focus loss
    lastKnownSelection = quill.getSelection();
  });
  
  div.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (div.id === 'custom-font') {
      console.log('Custom font size clicked');
      return;
    }
    
    const sizePx = parseInt(div.innerText.trim(), 10);
    if (!isNaN(sizePx)) {
      console.log('Setting font size to:', sizePx, 'with selection:', lastKnownSelection);
      setQuillFontSize(sizePx, lastKnownSelection);
      
      // Update button states after a short delay
      setTimeout(updateFontSizeButtons, 50);
    }
  });
});

// Listen for selection changes and store the last known selection
quill.on('selection-change', function(range) {
  if (range) {
    lastKnownSelection = range;
    setTimeout(updateFontSizeButtons, 10);
  }
});

// Listen for text changes (in case formatting changes)
quill.on('text-change', function() {
  // Small delay to ensure formatting is applied
  setTimeout(updateFontSizeButtons, 50);
});

// Debug function to test the system
function debugFontSize() {
  console.log('Quill instance:', quill);
  console.log('Current selection:', quill.getSelection());
  console.log('Current format:', quill.getFormat());
  console.log('Detected font size:', getCurrentFontSize());
  console.log('Font size buttons:', document.querySelectorAll('.font-size'));
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
      StatusBar.backgroundColorByHexString('#12141A');
      
      // Force a layout recalculation by briefly changing body height
      const originalHeight = document.body.style.height;
      document.body.style.height = 'calc(100vh - 1px)';
      
      setTimeout(() => {
        document.body.style.height = originalHeight;
        // Reapply color after layout change
        StatusBar.backgroundColorByHexString('#12141A');
      }, 50);
    }
    
    if (window.NavigationBar) {
      window.NavigationBar.backgroundColorByHexString('#17202B');
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
function showDialog(message) {
  const dialog = document.querySelector('.dialog');
  const title = dialog.querySelector('.dialog-title');
  if (title) title.textContent = message;

  dialog.classList.remove('hide');
  dialog.classList.add('show');
  dialog.style.display = 'flex';

  // Wait 2.5 seconds before hiding
  setTimeout(() => {
    // Prepare to hide dialog
    const onAnimationEnd = () => {
      dialog.style.display = 'none';
      dialog.removeEventListener('animationend', onAnimationEnd);
    };

    // Add listener before triggering hide animation
    dialog.addEventListener('animationend', onAnimationEnd);

    dialog.classList.remove('show');
    dialog.classList.add('hide');

    // Fallback in case animationend doesn't fire
    setTimeout(() => {
      dialog.style.display = 'none';
      dialog.removeEventListener('animationend', onAnimationEnd);
    }, 500); // Match your hide animation duration (adjust if needed)
  }, 2500);
}


document.addEventListener('keydown', (event) => {
  if (event.key === 'd' || event.key === 'D') {
    showDialog('Tylto auto-saves your project!');
  }
});
// ———————————————————————————————
// FULL JS: custom active for file + normal button behavior
// ———————————————————————————————

// 1) grab the elements
const fileDiv    = document.querySelector('.file');
const moreButton = document.querySelector('.more_button');

// 2) FILE “pressed” look: add .is-active when pressing on file (but NOT on the button)
['pointerdown','mousedown','touchstart'].forEach(evt => {
  // use capture so we get it *before* the button’s own handlers
  fileDiv.addEventListener(evt, e => {
    if (!moreButton.contains(e.target)) {
      fileDiv.classList.add('is-active');
    }
  }, { capture: true });
});

// 3) clear that state on any pointer up/cancel anywhere
['pointerup','mouseup','touchend','touchcancel','mouseleave'].forEach(evt => {
  document.addEventListener(evt, () => {
    fileDiv.classList.remove('is-active');
  });
});

// 4) FILE click (only when NOT clicking the button)
fileDiv.addEventListener('click', e => {
  if (!moreButton.contains(e.target)) {
    console.log('📁 File clicked!');
    // …your file-click logic here…
  }
});

// 5) MORE button click: fully normal
moreButton.addEventListener('click', e => {
  e.stopPropagation();       // prevent the file’s click handler
  console.log('⋯ More button clicked!');
  // …your “more” logic here…
});



// Function to open file picker and insert image into Quill
function insertImageFromDevice() {
  // Create a hidden file input element
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.style.display = 'none';

  // When a file is selected
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', e.target.result, 'user');
        // Move cursor right after image
        quill.setSelection(range.index + 1, 0);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add to DOM and trigger click
  document.body.appendChild(input);
  input.click();

  // Clean up
  input.remove();
}
document.getElementById('add-object-image').addEventListener('click', insertImageFromDevice);


function showImageEdit(){
  const menu = document.querySelector('.image-manipulation');
  menu.style.display = 'flex';
}
function hideImageEdit(){
  const menu = document.querySelector('.image-manipulation');
  menu.style.display = 'none';
}


  document.getElementById("upload-document").addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = [
      "image/*",
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".csv",
      // you can add more extensions as needed
    ].join(",");

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // --- 1) Log basic File object properties ---
      console.log("=== File Metadata ===");
      console.log("Name:", file.name);
      console.log("Size (bytes):", file.size);
      console.log("MIME type:", file.type || "—no MIME type reported—");
      console.log("Last modified (timestamp):", file.lastModified);
      console.log("Last modified (Date):", new Date(file.lastModified));
      // Note: webkitRelativePath is for folder-based inputs; usually empty here:
      console.log("webkitRelativePath:", file.webkitRelativePath);

      // --- 2) Attempt to read as text if it’s a “text/*” or CSV file ---
      const isTextType =
        file.type.startsWith("text/") ||
        file.type === "application/json" ||
        file.name.toLowerCase().endsWith(".csv"); // CSV often comes as text/csv

      if (isTextType) {
        const textReader = new FileReader();
        textReader.onload = (e) => {
          console.log("=== File Content (as text) ===");
          console.log(e.target.result); // raw text
        };
        textReader.onerror = (e) => {
          console.error("Error reading file as text:", e);
        };
        textReader.readAsText(file);
      }

      // --- 3) Always read as Data URL (base64) so you can see the raw bytes (images, PDFs, DOCX, etc.) ---
      const dataUrlReader = new FileReader();
      dataUrlReader.onload = (e) => {
        console.log("=== File Content (as Data URL) ===");
        console.log(e.target.result);
        // e.target.result will look like "data:<mime-type>;base64,AAAA…"
      };
      dataUrlReader.onerror = (e) => {
        console.error("Error reading file as Data URL:", e);
      };
      dataUrlReader.readAsDataURL(file);

      // --- 4) If you also want an ArrayBuffer (raw bytes) for binary inspection: ---
      const arrayBufferReader = new FileReader();
      arrayBufferReader.onload = (e) => {
        const arrayBuffer = e.target.result;
        console.log("=== File Content (as ArrayBuffer) ===");
        console.log(arrayBuffer);
        // If you need a hex dump or to inspect byte-by-byte, you can do:
        // const bytes = new Uint8Array(arrayBuffer);
        // console.log("First 100 bytes (hex):", Array.from(bytes.slice(0,100)).map(b => b.toString(16).padStart(2, "0")).join(" "));
      };
      arrayBufferReader.onerror = (e) => {
        console.error("Error reading file as ArrayBuffer:", e);
      };
      arrayBufferReader.readAsArrayBuffer(file);
    };

    input.click();
  });

  