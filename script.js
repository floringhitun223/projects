let workflow = 1;
let preview = 0;
let input_type = 'object';
variables = 0;
// Get the select element by ID
const webViewDevice = document.getElementById('web-view-device'); //--------------------------------------- user body device type 📱🖥️

// Add an event listener to detect when the selection changes
webViewDevice.addEventListener('change', function() {
    // Get the selected value
    const selectedDevice = webViewDevice.value;
    
    // Get the .user-body element
    const userBody = document.querySelector('.user-body');

    // Modify the width and height based on the selected option
    switch (selectedDevice) {
        case 'mobile':
            userBody.style.height = '99.5%';
            const computedHeight = userBody.offsetHeight;  // Get actual height
            userBody.style.width = (computedHeight * (9 / 16)) + 'px';  // 9:16 aspect ratio
            break;
        
        case 'tablet':  // 3:4 (portrait)
            userBody.style.height = '99.5%';
            const tabletHeight = userBody.offsetHeight;
            userBody.style.width = (tabletHeight * (3 / 4)) + 'px';  // 3:4 ratio for portrait
            break;
        
        case 'computer':
            userBody.style.width = '99.5%';
            const computedWidth = userBody.offsetWidth;  // Get actual width
            userBody.style.height = (computedWidth / (16 / 9)) + 'px';  // 16:9 aspect ratio
            break;
        default:
            userBody.style.height = '99.5%';
            const defaultHeight = userBody.offsetHeight;  // Get actual height
            userBody.style.width = (defaultHeight * (9 / 16)) + 'px';  // 9:16 aspect ratio
    }
});



 // --------------------------------------------------------- DELETE A BOX ------------------------------------
document.getElementById("delete-object").addEventListener("click", function() {
    const objectId = document.querySelector(".obj-name").innerText;
    const objectDiv = document.getElementById(objectId);

    if (objectDiv) {
        // Add transition properties directly via JavaScript
        objectDiv.style.transition = 'width 0.3s cubic-bezier(0.25, 0.3, 0.25, 1)';  // Smoother timing function
        
        // Apply the shrinking effect to width (shrink to 0)
        objectDiv.style.width = '0';  // Shrink the width to 0

        // Wait for the transition to finish (800ms in this case)
        setTimeout(function() {
            objectDiv.remove();  // Remove the element after the transition
        }, 300); // Matches the duration of the transition for smooth effect
    } else {
        console.log("Object not found!");
    }
});


//------------------------------------------------------------ ALIGN A BOX ----------------------------------------------------------------
document.getElementById('alignment-center').addEventListener('click', function() {
    const targetId = document.querySelector('.obj-name').innerText;
    const targetDiv = document.getElementById(targetId);
    
    if (targetDiv) {
        const parentDiv = targetDiv.parentElement;
        
        // Get measurements before any changes
        const targetRect = targetDiv.getBoundingClientRect();
        const parentRect = parentDiv.getBoundingClientRect();
        
        // Calculate the space available on each side
        const parentWidth = parentRect.width;
        const targetWidth = targetRect.width;
        const centerPosition = (parentWidth - targetWidth) / 2;
        
        // Update the input field with the calculated center position
        document.getElementById('margin-left').value = centerPosition.toFixed(1);
        
        // Apply centering styles
        targetDiv.style.marginLeft = 'auto';
        targetDiv.style.marginRight = 'auto';
        targetDiv.style.display = 'flex';
    }
});




document.getElementById('alignment-left').addEventListener('click', function() {
    const targetId = document.querySelector('.obj-name').innerText;
    const targetDiv = document.getElementById(targetId);
    
    if (targetDiv) {
        // Set margin to 0
        targetDiv.style.marginLeft = '0';
        targetDiv.style.marginRight = '0';
        
        // Update the input field to show 0
        document.getElementById('margin-left').value = '0';
        
        // Ensure the display property is set appropriately
        targetDiv.style.display = 'flex';
    }
});



document.getElementById('alignment-right').addEventListener('click', function() {
    const targetId = document.querySelector('.obj-name').innerText;
    const targetDiv = document.getElementById(targetId);
    
    if (targetDiv) {
        // Set margins: auto on left to push to right, 0 on right
        targetDiv.style.marginLeft = 'auto';
        targetDiv.style.marginRight = '0';
        
        // Update the margin-left input field
        // We need to get the parent width minus the element width
        const parentRect = targetDiv.parentElement.getBoundingClientRect();
        const targetRect = targetDiv.getBoundingClientRect();
        const leftMargin = parentRect.width - targetRect.width;
        
        document.getElementById('margin-left').value = leftMargin.toFixed(1);
        
        // Ensure the display property is set appropriately
        targetDiv.style.display = 'flex';
    }
});
//--------------------------------- RIGHT
document.getElementById('margin-right').addEventListener('input', function() {
    const marginValue = this.value + 'px';
    const elementId = document.querySelector('.obj-name').innerText;
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        targetElement.style.marginRight = marginValue;
    }
});

//--------------------------------- BOTTOM
document.getElementById('margin-bottom').addEventListener('input', function() {
    const marginValue = this.value + 'px';
    const elementId = document.querySelector('.obj-name').innerText;
    const targetElement = document.getElementById(elementId);
    
    if (targetElement) {
        targetElement.style.marginBottom = marginValue;
    }
});
//--------------------------------- WIDTH

//--------------------------------- COLOR
const colorInput = document.getElementById('colorInput');
const hexInput = document.getElementById('hexInput');
const objNameElements = document.querySelectorAll('.obj-name'); // Select all elements with the 'obj-name' class

// Function to update the color of elements with the ID stored in each obj-name's innerText
function updateColor() {
    const hexColor = hexInput.value;
    
    objNameElements.forEach(objNameElement => {
        const userBodyId = objNameElement.innerText.trim(); // Get the ID from the innerText
        const userBody = document.getElementById(userBodyId); // Select the element by ID
        if (userBody) {
            userBody.style.backgroundColor = hexColor; // Apply color to the element with the matching ID
        } else {
            console.warn(`Element with ID "${userBodyId}" not found`);
        }
    });
}
//--------------------------------- OUTLINE COLOR
const colorInputOutline = document.getElementById('colorInput-outline'); // Border color input
const thickInputOutline = document.getElementById('outline-size'); // Border size input

// Function to update the border color and thickness of elements with the ID stored in each obj-name's innerText
function updateBorderColor() {
    const borderColor = colorInputOutline.value; // Get the border color
    const thickness = thickInputOutline.value + 'px'; // Get the thickness and append 'px'
    
    objNameElements.forEach(objNameElement => {
        const userBodyId = objNameElement.innerText.trim(); // Get the ID from the innerText
        const userBody = document.getElementById(userBodyId); // Select the element by ID
        if (userBody) {
            userBody.style.border = `${thickness} solid ${borderColor}`; // Apply border color and thickness
        } else {
            console.warn(`Element with ID "${userBodyId}" not found`);
        }
    });
}

// Event listeners for border color and thickness input changes
colorInputOutline.addEventListener('input', updateBorderColor); // Update border when color input changes
thickInputOutline.addEventListener('input', updateBorderColor); // Update border when thickness input changes

// Initialize with the default border settings
updateBorderColor();


// Event listener for the color input change
colorInput.addEventListener('input', (e) => {
    const colorValue = e.target.value;
    hexInput.value = colorValue; // Update hex input when color input changes
    updateBorderColor(); // Update the border color of elements
});

// Event listener for the hex input change
hexInput.addEventListener('input', (e) => {
    const hexValue = e.target.value;
    colorInput.value = hexValue; // Update color input when hex input changes
    updateBorderColor(); // Update the border color of elements
});

// Event listener for the border color input change
colorInputOutline.addEventListener('input', () => {
    updateBorderColor(); // Update the border color when the border color input changes
});

// Initialize with the default border color
updateBorderColor();

// Event listener for the color input change
colorInput.addEventListener('input', (e) => {
    const colorValue = e.target.value;
    hexInput.value = colorValue; // Update hex input when color input changes
    updateColor(); // Update the background color of elements based on the selected color
});

// Event listener for the hex input change
hexInput.addEventListener('input', (e) => {
    const hexValue = e.target.value;
    colorInput.value = hexValue; // Update color input when hex input changes
    updateColor(); // Update the background color of elements based on the selected hex value
});

// Initialize with the default color
updateColor();
//--------------------------------- OUTLINE COLOR AND COLOR
//------------------------------------------------------------------------- ADD A CONTAINER ----------------------------------------------------------------

document.addEventListener('click', function(event) {
    const userBody = document.querySelector('.user-body');
    const objName = document.querySelector('.obj-name');
    const rightPanel = document.querySelector('.right-panel');
    const leftPanel = document.querySelector('.left-panel');
    
    if (!userBody.contains(event.target) && !rightPanel.contains(event.target) && !leftPanel.contains(event.target)) {
        const allContainers = document.querySelectorAll('.container-box');
        allContainers.forEach(container => {
            container.classList.remove('selected');
            container.style.outline = 'none';
        });
        objName.innerText = 'Selected: None';
        hideAllProperties();
        showNoContent();

        const classesToHide = ['resize-handle', 'resize-handle.horizontal'];
        classesToHide.forEach(function(className) {
            document.querySelectorAll(`.${className}`).forEach(function(element) {
                element.style.display = 'none';
            });
        });
    }
});


document.addEventListener('click', function(event) {
    const userBody = document.querySelector('.user-body');
    const objName = document.querySelector('.obj-name');
    const rightPanel = document.querySelector('.right-panel');
    const leftPanel = document.querySelector('.left-panel'); // Added reference to the left panel
    
    // If the click is outside the .user-body container, not over the .right-panel, and not inside the .left-panel
    if (!userBody.contains(event.target) && !rightPanel.contains(event.target) && !leftPanel.contains(event.target)) {
        // Deselect all containers
        const allContainers = document.querySelectorAll('.text-container');
        allContainers.forEach(container => {
            container.classList.remove('selected');
            container.style.outline = 'none';  // Reset border when not selected
        });
        
        // Reset the selected text
        objName.innerText = 'Selected: None';
        hideAllProperties();
        showNoContent();  

        classesToHide.forEach(function(className) {
            document.querySelectorAll(`.${className}`).forEach(function(element) {
                element.style.display = 'none';
            });
        });  //-------------------------------------------------------------------------- HIDE ALL PROPERTIES ❌
    }
});

// Random color generator
function getRandomColor() {
    return `#242424`;
}




//------------------------------------------------------------------------- ADD A CONTAINER END ----------------------------------------------------------------
 
//-------------------------------------------------------- FUNCTIONS ⚙️


let textCounter = 1; // Renamed counter to textCounter
function addText() {
    const userBody = document.querySelector('.user-body');
    const textContainer = document.createElement('p');  // Create a <p> element
    const containerId = `textContainer${textCounter}`;

    textContainer.className = 'text-container';
    textContainer.id = containerId;

    // Apply dynamic styles entirely through JS
    textContainer.style.height = '12px';
    textContainer.style.width = '47px';
    textContainer.style.fontSize = '12px';
    textContainer.innerText = 'NewText';  // Set initial text content
    textContainer.style.color = '#000000';  // Required for positioning

    // Ensure the container only takes the width of its content
    textContainer.style.display = 'flex';  // Makes the container fit the width of its content
    textContainer.style.whiteSpace = 'nowrap';  // Prevent wrapping and ensure text stays on one line

    // Add hover effect (border on hover)
    textContainer.addEventListener('mouseenter', function() {
        if (!textContainer.classList.contains('selected')) {
            textContainer.style.outline = '2px solid #1E90FF';  // Border on hover
        }
    });

    textContainer.addEventListener('mouseleave', function() {
        if (!textContainer.classList.contains('selected')) {
            textContainer.style.outline = 'none';  // Reset border when not selected
        }
    });

    // Update .obj-name on click and mark the item as selected
    textContainer.onclick = function(event) {
        event.stopPropagation();

        // Deselect all text containers
        const allTextContainers = document.querySelectorAll('.text-container');
        allTextContainers.forEach(container => {
            container.classList.remove('selected');
            container.style.outline = 'none';  // Reset border when not selected
        });

        // Select the clicked text container
        textContainer.classList.add('selected');
        textContainer.style.outline = '2px solid #1E90FF';
        showGeneralProperties();   // Show general properties
        hideNoContent();          // Hide no content message
        // Update the .obj-name text
        document.querySelector('.obj-name').innerText = ` ${this.id}`;

        // Update the input values with the container's current properties
        updateInputValues(textContainer);

        // Set the display property in the select dropdown
        const displayContentSelect = document.getElementById('display-content');
        displayContentSelect.value = getComputedStyle(textContainer).display;

        // Update flex-direction button states based on current flex-direction
        updateFlexDirectionButtonStates(textContainer);
    };

    userBody.appendChild(textContainer);  // Append the text container to the user body
    textCounter++;  // Increment the textCounter
} //*! FOR TESTING

let buttonCounter = 1; // Renamed counter to buttonCounter
function addButton() {
    const userBody = document.querySelector('.user-body');
    
    // Create a <button> element
    const buttonContainer = document.createElement('button');
    const containerId = `buttonContainer${buttonCounter}`;

    buttonContainer.className = 'button-container';
    buttonContainer.id = containerId;

    // Apply dynamic styles entirely through JS for button container
    buttonContainer.style.height = '30px';  // Set a fixed height for the button
    buttonContainer.style.fontSize = '14px';  // Set a font size for the button
    buttonContainer.innerText = 'Click Me';  // Set initial text content
    buttonContainer.style.position = 'relative';  // Required for positioning
    buttonContainer.style.color = '#000000';  // Set text color

    // Ensure the button only takes the width of its content
    buttonContainer.style.display = 'inline';  // Makes the button fit the width of its content
    buttonContainer.style.whiteSpace = 'nowrap';  // Prevent wrapping and ensure text stays on one line

    // Add hover effect (border on hover)
    buttonContainer.addEventListener('mouseenter', function() {
        if (!buttonContainer.classList.contains('selected')) {
            buttonContainer.style.outline = '2px solid #1E90FF';  // Border on hover
        }
    });

    buttonContainer.addEventListener('mouseleave', function() {
        if (!buttonContainer.classList.contains('selected')) {
            buttonContainer.style.outline = 'none';  // Reset border when not selected
        }
    });

    // Update .obj-name on click and mark the item as selected
    buttonContainer.onclick = function(event) {
        event.stopPropagation();

        // Deselect all button containers
        const allButtonContainers = document.querySelectorAll('.button-container');
        allButtonContainers.forEach(container => {
            container.classList.remove('selected');
            container.style.outline = 'none';  // Reset border when not selected
        });

        // Select the clicked button container
        buttonContainer.classList.add('selected');
        buttonContainer.style.outline = '2px solid #1E90FF';
        showGeneralProperties();   // Show general properties
        hideNoContent();          // Hide no content message
        // Update the .obj-name text
        document.querySelector('.obj-name').innerText = ` ${this.id}`;

        // Update the input values with the container's current properties
        updateInputValues(buttonContainer);

        // Set the display property in the select dropdown
        const displayContentSelect = document.getElementById('display-content');
        displayContentSelect.value = getComputedStyle(buttonContainer).display;

        // Update flex-direction button states based on current flex-direction
        updateFlexDirectionButtonStates(buttonContainer);
    };

    userBody.appendChild(buttonContainer);  // Append the button container to the user body
    buttonCounter++;  // Increment the buttonCounter
} //*! FOR TESTING

// Add resize handles to the container
function addResizeHandles(container) {
    // Remove any existing resize handles and overlay first
    const existingHandles = container.querySelectorAll('.resize-handle');
    const existingOverlay = container.querySelector('.resize-overlay');
    existingHandles.forEach(handle => handle.remove());
    if (existingOverlay) existingOverlay.remove();

    // Create overlay for selection effect
    const overlay = document.createElement('div');
    overlay.classList.add('resize-overlay');
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(30, 144, 255, 0.2)';
    overlay.style.pointerEvents = 'none';
    container.appendChild(overlay);

    // Add center-right handle
    const centerRightHandle = document.createElement('div');
    centerRightHandle.classList.add('resize-handle', 'center-right');
    container.appendChild(centerRightHandle);

    // Add center-bottom handle
    const centerBottomHandle = document.createElement('div');
    centerBottomHandle.classList.add('resize-handle', 'center-bottom');
    container.appendChild(centerBottomHandle);

    // Add bottom-right handle
    const bottomRightHandle = document.createElement('div');
    bottomRightHandle.classList.add('resize-handle', 'bottom-right');
    container.appendChild(bottomRightHandle);

    // Enable resizing functionality for the updated handles
    enableResizing(container);
}

function deselectAllContainers(event) {
    // Prevent deselection if clicking inside right-panel, left-panel, or right-panel-content
    if (event && (
        event.target.closest('.right-panel') || 
        event.target.closest('.left-panel') || 
        event.target.closest('.right-panel-content')
    )) {
        return;
    }

    document.querySelectorAll('.container-box').forEach(container => {
        if (!container.classList.contains('persist-selection')) {
            container.classList.remove('selected');
            container.style.outline = 'none';
            container.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
            const existingOverlay = container.querySelector('.resize-overlay');
            if (existingOverlay) existingOverlay.remove();
        }
    });
    lastSelectedContainer = null;  // Clear selected container
    console.log('All containers deselected');
}




function enableResizing(container) {
    const handles = container.querySelectorAll('.resize-handle');
    let currentHandle = null;
    let startX, startY, startWidth, startHeight;

    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(event) {
            currentHandle = handle;
            startX = event.clientX;
            startY = event.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;

            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
        });
    });

    function resize(event) {
        if (!currentHandle) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        if (currentHandle.classList.contains('center-right')) {
            container.style.width = `${startWidth + dx}px`;
        } else if (currentHandle.classList.contains('center-bottom')) {
            container.style.height = `${startHeight + dy}px`;
        } else if (currentHandle.classList.contains('bottom-right')) {
            container.style.width = `${startWidth + dx}px`;
            container.style.height = `${startHeight + dy}px`;
        }
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        currentHandle = null; // Reset after resizing is done
    }
}


// Convert RGB to Hex format
function rgbToHex(rgb) {
    const match = rgb.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }
    return rgb; // Return the original value if it can't be converted
}

// Dummy function for showGeneralProperties
function showGeneralProperties() {
    // Display the property fields
    console.log('Showing general properties...');
}

// Dummy function for hideNoContent
function hideNoContent() {
    // Hide "No content" message
    console.log('Hiding "No content"...');
}

// Dummy function for getRandomColor (for the example)
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Update the input values with the selected container's current properties
function updateInputValues(containerBox) {
    const marginLeftInput = document.getElementById('margin-left');
    const marginRightInput = document.getElementById('margin-right');
    const marginTopInput = document.getElementById('margin-top');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const colorInput = document.getElementById('colorInput');
    const hexInput = document.getElementById('hexInput');
    const outlineSizeInput = document.getElementById('outline-size');
    const colorInputOutline = document.getElementById('colorInput-outline');

    // Set the margin-left, margin-right, margin-top, width, and height inputs
    marginLeftInput.value = parseInt(getComputedStyle(containerBox).marginLeft, 10); // Removing px
    marginRightInput.value = parseInt(getComputedStyle(containerBox).marginRight, 10); // Removing px
    marginTopInput.value = parseInt(getComputedStyle(containerBox).marginTop, 10); // Removing px
    widthInput.value = containerBox.offsetWidth;
    heightInput.value = containerBox.offsetHeight;

    // Set the container color to the color input fields (using RGB to HEX conversion for color picker)
    const containerColor = getComputedStyle(containerBox).backgroundColor;
    colorInput.value = rgbToHex(containerColor);  // Set color picker (Hex format)
    hexInput.value = rgbToHex(containerColor);    // Set Hex input field

    // Get the computed styles for the container
    const computedStyles = getComputedStyle(containerBox);

    // Extract border size and color if border exists
    const borderWidth = parseInt(computedStyles.borderWidth, 10); // Get border width (in px)
    const borderColor = computedStyles.borderColor;  // Get border color

    if (borderWidth > 0) {
        outlineSizeInput.value = borderWidth;  // Set the border size input field
        colorInputOutline.value = rgbToHex(borderColor);  // Convert border color to Hex and set it
    } else {
        outlineSizeInput.value = '';  // Clear if no border
        colorInputOutline.value = '';  // Clear color if no border
    }
}

// Update flex-direction button states based on container's flex-direction
function updateFlexDirectionButtonStates(containerBox) {
    const layoutHButton = document.querySelector('.layout-h');
    const layoutVButton = document.querySelector('.layout-v');
    const flexDirection = getComputedStyle(containerBox).flexDirection;

    if (flexDirection === 'row') {
        layoutHButton.classList.add('active');
        layoutVButton.classList.remove('active');
    } else {
        layoutHButton.classList.remove('active');
        layoutVButton.classList.add('active');
    }
}

// Listen for changes to the display content select and update the container
const displayContentSelect = document.getElementById('display-content');
displayContentSelect.addEventListener('change', function() {
const selectedDisplayValue = displayContentSelect.value;

const selectedContainer = document.querySelector('.container-box.selected');
if (selectedContainer) {
    selectedContainer.style.display = selectedDisplayValue;

    // If it's flex, update the flex-direction based on the selected value of the buttons
    if (selectedDisplayValue === 'flex') {
        const layoutHButton = document.querySelector('.layout-h');
        const layoutVButton = document.querySelector('.layout-v');

        if (layoutHButton.classList.contains('active')) {
            selectedContainer.style.flexDirection = 'row';
        } else if (layoutVButton.classList.contains('active')) {
            selectedContainer.style.flexDirection = 'column';
        }
    }
}
});


function hideAllProperties(){
    const classesToHide = ['right-panel-content'];

classesToHide.forEach(function(className) {
    document.querySelectorAll(`.${className}`).forEach(function(element) {
        element.style.display = 'none';
    });
});
}
function showAllProperties(){
    const classesToHide = ['right-panel-content'];
classesToHide.forEach(function(className) {
    document.querySelectorAll(`.${className}`).forEach(function(element) {
        element.style.display = ' block';
    });
});
}
function showNoContent(){
    const classesToHide = ['right-panel-no_content'];

classesToHide.forEach(function(className) {
    document.querySelectorAll(`.${className}`).forEach(function(element) {
        element.style.display = ' flex';
    });
});
}
function hideNoContent(){
    const classesToHide = ['right-panel-no_content'];

classesToHide.forEach(function(className) {
    document.querySelectorAll(`.${className}`).forEach(function(element) {
        element.style.display = ' none';
    });
});
}

function showGeneralProperties(){
    showAllProperties();
    hideTextProperties();
    hideImageProperties();
    const classesToShow = [
        'prop-layout-title',
        'prop-display-section',
         'prop-layout-title-style',
        'prop-layout-section', 
        'prop-container-color',
        'prop-container-outline',
        'prop-alignments-section',
        'prop-alignments-section-vertical',
    ];

    // Using Set to remove duplicates from the array
    const uniqueClasses = [...new Set(classesToShow)];

    uniqueClasses.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = ''; // or '' to restore default display
        });
    });
}

function hideGeneralProperties(){
    const classesToHide = [
        'prop-layout-title',
        'prop-display-section',
        'prop-layout-title-style',

        'prop-layout-section', 
        'prop-container-color',
        'prop-container-outline',
        'prop-alignments-section',
        'prop-alignments-section-vertical',

        
    ];

    classesToHide.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = 'none';
        });
    });
}
function showTextProperties(){
    showAllProperties();
    hideImageProperties();
    hideGeneralProperties();
    const classesToShow = [
        'text-modifier',
        'prop-text-font-section', 
        'prop-text-size-section', 
        'prop-container-color-text',
        'prop-text-decoration-section',
        'prop-layout-title-text'
    ];

    // Using Set to remove duplicates from the array
    const uniqueClasses = [...new Set(classesToShow)];

    uniqueClasses.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = ''; // or '' to restore default display
        });
    });
}
function hideTextProperties(){
    const classesToShow = [
        'text-modifier',
        'prop-text-font-section', 
        'prop-text-size-section', 
        'prop-container-color-text',
        'prop-text-decoration-section',
        'prop-layout-title-text'
    ];

    // Using Set to remove duplicates from the array
    const uniqueClasses = [...new Set(classesToShow)];

    uniqueClasses.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = 'none'; // or '' to restore default display
        });
    });
}
function hideImageProperties(){
    const classesToShow = [
        'image-uploader',
        'preview-uploaded-image',
        'alt-text',
        'prop-layout-title-image',
    ];

    // Using Set to remove duplicates from the array
    const uniqueClasses = [...new Set(classesToShow)];

    uniqueClasses.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = 'none'; // or '' to restore default display
        });
    });
}
function showImageProperties(){
    showAllProperties();
    hideGeneralProperties();
    hideTextProperties();
    const classesToShow = [
        'image-uploader',
        'preview-uploaded-image',
        'alt-text',
        'prop-layout-title-image',
    ];

    // Using Set to remove duplicates from the array
    const uniqueClasses = [...new Set(classesToShow)];

    uniqueClasses.forEach(function(className) {
        document.querySelectorAll(`.${className}`).forEach(function(element) {
            element.style.display = ''; // or '' to restore default display
        });
    });
}
function addObjectShow(){
    document.querySelector('.object-chooser').style.opacity = '1';
    document.querySelector('.object-chooser').style.visibility = 'visible';

}
function addObjectHide(){
    document.querySelector('.object-chooser').style.opacity = '0';
    document.querySelector('.object-chooser').style.visibility = 'hidden';

}
function applyFlexByIdFromName(direction) {
    const elements = document.querySelectorAll('.obj-name');

    elements.forEach(el => {
        const containerId = el.innerText;  // Get the ID from inner text
        const container = document.getElementById(containerId);
        
        if (container) {
            container.style.display = 'flex';
            container.style.flexDirection = direction;
        } else {
            console.warn(`Container with ID '${containerId}' not found!`);
        }
    });
}
function setFullSizeFromNameWidth() {
    const elements = document.querySelectorAll('.obj-name');

    elements.forEach(el => {
        const containerId = el.innerText.trim();  // Get the ID from inner text
        const container = document.getElementById(containerId);
        
        if (container) {
            // Add transition for smooth resizing
 
            
            // Set the size to 100%
            container.style.width = '100%';
        } else {
            console.warn(`Container with ID '${containerId}' not found!`);
        }
    });
}
function setFullSizeFromNameHeight() {
    const elements = document.querySelectorAll('.obj-name');

    elements.forEach(el => {
        const containerId = el.innerText.trim();  // Get the ID from inner text
        const container = document.getElementById(containerId);
        
        if (container) {
            // Add transition for smooth resizing
            container.style.height = '100%';
        } else {
            console.warn(`Container with ID '${containerId}' not found!`);
        }
    });
}













//-------------------------------------------------------- FUNCTIONS END
//--------------------------------------------------------------------------EXPAND FILE EXPLORER ---------------------------------------------------------------
// Prevent expand/collapse when selecting items
document.querySelectorAll('.expand-button').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});
//--------------------------------------------------------------------------EXPAND FILE EXPLORER END ---------------------------------------------------------------
    
//-------------------------------------------------------------------------------------ZOOM-------------------------------------------------------------------------
    const zoomRange = document.getElementById('zoom-range');
    const webViewContainers = document.querySelectorAll('.user-body');

    // Set initial zoom level from the slider's value
    webViewContainers.forEach(container => {
        container.style.transform = `scale(${zoomRange.value / 100})`;
    });

    // Add event listener to update zoom on slider change
    zoomRange.addEventListener('input', function() {
        const zoomLevel = zoomRange.value / 100;
        webViewContainers.forEach(container => {
            container.style.transform = `scale(${zoomLevel})`;
        });
    });

    // Add event listener for the mouse wheel to zoom in and out only inside .web-view
    document.addEventListener('wheel', function(event) {
        // Check if mouse is inside the .web-view container
        const webViewElement = document.querySelector('.web-view');
        const isInsideWebView = webViewElement.contains(event.target);
    
        // Check if Ctrl is pressed
        if (isInsideWebView && event.ctrlKey) {
            let zoomLevel = parseFloat(zoomRange.value) / 100;
    
            // Determine direction of scroll (up or down)
            if (event.deltaY < 0) {
                // Scroll up: zoom in
                zoomLevel += 0.05; // Increase zoom level by 5%
            } else {
                // Scroll down: zoom out
                zoomLevel -= 0.05; // Decrease zoom level by 5%
            }
    
            // Ensure zoom level stays within bounds
            if (zoomLevel > 1) zoomLevel = 1;
            if (zoomLevel < 0.2) zoomLevel = 0.2; // Prevent zooming out too much
    
            // Update the zoom level
            zoomRange.value = zoomLevel * 100; // Set slider value
            webViewContainers.forEach(container => {
                container.style.transform = `scale(${zoomLevel})`; // Apply the zoom
            });
    
            // Prevent default scroll behavior to avoid page zooming
            event.preventDefault();
        }
    });
    

  //-------------------------------------------------ZOOM END-------------------------------------------------------------------------
  
  

  function addDivToPreview(content, className = '', id = '', styles = {}) {
    const previewDiv = document.querySelector('.user-body');

    if (!previewDiv) {
        console.error('No element with class "preview" found.');
        return;
    }

    const newDiv = document.createElement('div');
    newDiv.innerHTML = content;

    if (className) newDiv.className = className;
    if (id) newDiv.id = id;

    // Apply dynamic styles
    for (const [property, value] of Object.entries(styles)) {
        newDiv.style[property] = value;
    }

    previewDiv.appendChild(newDiv);
}
//*! FOR TESTING
document.addEventListener('keydown', (event) => {
  if (event.key === 'd' || event.key === 'D') {
    showVariablesList();

    
  }
});
document.addEventListener('keydown', (event) => {
    // Check if the pressed key is Enter (key code 13 or 'Enter')
    if (event.key === 'Enter') {
      hideEventInput();  // Call the function to hide the input
    }
  });
  


// Update text input values (for font size, text, and color)



document.addEventListener('DOMContentLoaded', function() {
    // Debug logging
    console.log('DOM Content Loaded');
    
    const checkbox = document.getElementById('obj-expand');
    const content = document.querySelector('.obj-layer-content');
    
    if (checkbox) {
        console.log('Checkbox found');
        checkbox.addEventListener('change', function() {
            console.log('Checkbox state:', this.checked);
            if (this.checked) {
                console.log('Content should be visible');
            } else {
                console.log('Content should be hidden');
            }
        });
    } else {
        console.error('Checkbox not found');
    }
    
    if (content) {
        console.log('Content element found');
    } else {
        console.error('Content element not found');
    }
    
    // Handle expand button clicks
    document.querySelector('.obj-expand-button').addEventListener('click', function(e) {
        console.log('Expand button clicked');
        e.stopPropagation();
        const checkbox = document.getElementById('obj-expand');
        checkbox.checked = !checkbox.checked;
        console.log('Checkbox state after click:', checkbox.checked);
    });
});
  document.getElementById('margin-left').addEventListener('focus', function() { //-------------- Functions to Select all text inside input when double click 👆
    this.select();
  });
  document.getElementById('margin-top').addEventListener('focus', function() {
    this.select();
  });
  document.getElementById('width').addEventListener('focus', function() {
    this.select();
  });
  document.getElementById('height').addEventListener('focus', function() {
    this.select();
  });
// Get the dropdown element



  // Global variables
let parentIdSuffix = '';  // Track current parent for layers
let counter = 1;
let lastSelectedContainer = null;

// Utility Functions
function getSelectedLayerId() {
    const selectedRadio = document.querySelector('input[type="radio"][name="layer"]:checked');
    const selectedId = selectedRadio ? selectedRadio.id.replace('layer', '') : null;
    console.log('Currently selected layer ID:', selectedId);
    return selectedId;
}

// Layer Management Functions
// Add layer under the correct parent layer
function addLayer(parentLayerId, title, isSubLayer = false) {
    const parentElement = parentLayerId ? 
        document.querySelector(`#${parentLayerId} .nested-list`) : 
        document.querySelector('.layer-list');  // Root fallback

    if (!parentElement) {
        console.error('Parent layer element not found');
        return;
    }

    const newLayer = document.createElement('div');
    newLayer.className = 'layer-item';
    const layerId = title;
    newLayer.id = `layer-container-${layerId}`;

    newLayer.innerHTML = `
        <input type="checkbox" id="expand${layerId}" class="expand-toggle">
        <input type="radio" name="layer" id="layer${layerId}" class="layer-radio">
        <label for="layer${layerId}" class="layer-header">
            <button class="expand-button" onclick="document.getElementById('expand${layerId}').click(); event.stopPropagation();">
                <img src="Assets/expand.png" class="expand-icon" alt="expand">
            </button>
            <img src="Assets/container.png" class="item-icon" alt="">
            ${title}
        </label>
        <div class="layer-content">
            <div class="layer-content-inner">
                <div class="nested-list"></div>
            </div>
        </div>
    `;

    // If the parent layer is selected, add the 'selected' class to the new layer
    if (parentLayerId) {
        const parentLayer = document.querySelector(`#${parentLayerId}`);
        if (parentLayer && parentLayer.classList.contains('selected')) {
            newLayer.classList.add('selected');
        }
    }

    parentElement.appendChild(newLayer);

    // Auto-expand parent after adding
    if (parentLayerId) {
        const parentExpand = document.querySelector(`#${parentLayerId} .expand-toggle`);
        if (parentExpand) {
            parentExpand.checked = true;  // Expand parent layer
            const expandIcon = parentExpand.parentElement.querySelector('.expand-icon');
            if (expandIcon) {
                expandIcon.style.transform = 'rotate(180deg)';  // Rotate arrow to expanded
            }
        }
    }

    setupExpandIconRotation();
    setupLayerEventListeners(newLayer, title, isSubLayer);

    console.log(`Layer added and expanded for container: ${title}`);

    // Add the title to the dropdown menu with the id 'wrap-options'
    const wrapOptions = document.querySelector('#wrap-options');  // Using id to target
    if (wrapOptions) {
        const newOption = document.createElement('option');
        newOption.value = layerId;  // Use the layer ID as the value
        newOption.textContent = title;  // Set the option text as the layer title
        wrapOptions.appendChild(newOption);
    }
}



// Container Management Functions
function addContainer() {
    const containerId = `container${counter}`;
    const selectedLayerId = getSelectedLayerId();
    console.log('Adding container. Selected layer ID:', selectedLayerId);

    // Determine parent container
    let parentElement;
    if (selectedLayerId) {
        parentElement = document.getElementById(selectedLayerId);
    } else {
        parentElement = document.querySelector('.user-body');  // Default to root
    }

    if (!parentElement) {
        console.error('Parent element not found');
        return;
    }

    // Create new container element
    const containerBox = document.createElement('div');
    containerBox.className = 'container-box';
    containerBox.id = containerId;

    // Style and event listeners
    setupContainerStyles(containerBox);
    setupContainerEventListeners(containerBox);

    // Append to correct parent container
    parentElement.appendChild(containerBox);
    console.log(`Added container ${containerId} inside ${parentElement.id}`);

    // Determine the parent layer in the layer list
    const parentLayerId = selectedLayerId ? `layer-container-${selectedLayerId}` : null;
    addLayer(parentLayerId, containerId, !!selectedLayerId);

    // Select the new container immediately
    lastSelectedContainer = containerBox;
    parentIdSuffix = containerId;

    // Increment counter for next container
    counter++;

    console.log("Container added successfully:", containerBox);
    return containerBox;
}



function setupContainerStyles(container) {
    Object.assign(container.style, {
        width: '80%',
        height: '80%',
        marginLeft: '0px',
        marginTop: '0px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: getRandomColor(),
        position: 'relative'
    });
}

function setupContainerEventListeners(container) {
    container.addEventListener('mouseenter', () => {
        if (!container.classList.contains('selected')) {
            container.style.outline = '2px solid #1E90FF';
            
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!container.classList.contains('selected')) {
            container.style.outline = 'none';
        }
    });

    container.addEventListener('click', function(event) {
        event.stopPropagation();
        handleContainerClick(this);
    });

    container.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        event.stopPropagation();
        handleContainerClick(this);
       

    });
}

// Event Listeners and Handlers
function setupLayerEventListeners(layer, title, isSubLayer = false) {
    const expandCheckbox = layer.querySelector('.expand-toggle');
    const radioButton = layer.querySelector('input[type="radio"]');

    if (expandCheckbox) {
        expandCheckbox.addEventListener('change', function() {
            const containerToSelect = document.getElementById(title);
            if (expandCheckbox.checked && containerToSelect) {
                showGeneralProperties();
                hideNoContent();
            }
        });
    }

    layer.addEventListener('click', function(event) {
        event.stopPropagation();

        if (event.target !== expandCheckbox && event.target !== layer.querySelector('.expand-button')) {
            const selectedLayerId = layer.id.replace('layer-container-', '');
            parentIdSuffix = selectedLayerId; // Update parent context
            
            // Ensure radio button is checked
            if (radioButton) {
                radioButton.checked = true;
            }

            const container = document.getElementById(title);
            if (container) {
                lastSelectedContainer = container;
                console.log('Updated last selected container:', lastSelectedContainer.id);
                selectContainerFromLayer(container);
            }
        }
    });
}
// Event listener to detect clicks outside user-body
document.addEventListener('click', function(event) {
    const userBody = document.querySelector('.user-body');
    const layerList = document.querySelector('.layer-list');
    
    // If the click is outside user-body or layer list
    if (!userBody.contains(event.target) && !layerList.contains(event.target)) {
        deselectAllContainers();
        deselectAllLayers();
    }
});

// Function to deselect all containers


// Function to deselect all layers
function deselectAllLayers() {
    document.querySelectorAll('.layer-radio').forEach(radio => {
        radio.checked = false;
    });
    console.log('All layers deselected');
}

function handleContainerClick(container) {
    if (!container) {
        deselectAllLayers();
        lastSelectedContainer = null;
        console.log('Reset container selection');
        return;
    }

    console.log('Container clicked:', container.id);
    hideContextMenu();
    hideWrapTarget();
    lastSelectedContainer = container;
    console.log('Updated last selected container:', lastSelectedContainer.id);

    selectContainerFromLayer(container);

    // Sync corresponding layer selection
    const layerRadio = document.querySelector(`#layer${container.id}`);
    if (layerRadio) {
        layerRadio.checked = true;  // Select corresponding layer
    }
}

function selectContainerFromLayer(container) {
    // Deselect all containers first
    document.querySelectorAll('.container-box').forEach(c => {
        c.classList.remove('selected');
        c.style.outline = 'none';
        c.querySelectorAll('.resize-handle').forEach(h => h.remove());
    });

    // Select the new container
    container.classList.add('selected');
    container.style.outline = '2px solid #1E90FF';

    // Update UI
    document.querySelector('.obj-name').innerText = container.id;
    showGeneralProperties();
    hideNoContent();
    addResizeHandles(container);
    updateInputValues(container);

    const displayContentSelect = document.getElementById('display-content');
    displayContentSelect.value = getComputedStyle(container).display;
    updateFlexDirectionButtonStates(container);
    console.log('Container selected:', container.id);
    
}
// Listen for the 'change' event on the dropdown
document.getElementById('display-content').addEventListener('change', function() {
    const selectedId = document.querySelector('.obj-name').innerText;
    const selectedContainer = document.getElementById(selectedId);

    if (selectedContainer) {
        selectedContainer.style.display = displayContentSelect.value;
    }
});
// Utility Functions
function setupExpandIconRotation() {
    document.querySelectorAll('.expand-toggle').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const button = this.nextElementSibling.nextElementSibling.querySelector('.expand-button');
            const icon = button.querySelector('.expand-icon');
            if (this.checked) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        });
    });
}

function syncLayerSelection(container) {
    const layerRadio = document.querySelector(`#layer${container.id}`);
    if (layerRadio) {
        layerRadio.checked = true;  // Auto-select the new layer
    }

    // Expand all parent layers to ensure visibility
    let parent = container.parentElement;
    while (parent && parent.classList.contains('container-box')) {
        const parentLayer = document.querySelector(`#layer${parent.id}`);
        if (parentLayer) {
            parentLayer.checked = true;
        }
        parent = parent.parentElement;
    }
}


function updateParentLayerState(parentContainer) {
    if (parentContainer.querySelector('.expand-toggle')) {
        parentContainer.querySelector('.expand-toggle').checked = true;
        const button = parentContainer.querySelector('.expand-button');
        if (button) {
            const icon = button.querySelector('.expand-icon');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';  // Indicate expanded state
            }
        }
    }
}

function getContainerPath(container) {
    const path = [];
    let current = container;
    while (current && !current.classList.contains('user-body')) {
        path.unshift(current.id);
        current = current.parentElement;
    }
    return path;
}


  // Utility to get a random color
  function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
  



function setupExpandIconRotation() {
    // Get all expand toggle checkboxes
    const expandToggles = document.querySelectorAll('.expand-toggle');
    
    expandToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            // Find the associated expand icon within the same layer-item
            const expandIcon = this.parentElement.querySelector('.expand-icon');
            
            if (expandIcon) {
                if (this.checked) {
                    // Rotate 90 degrees when expanded
                    expandIcon.style.transform = 'rotate(180deg)';
                } else {
                    // Reset rotation when collapsed
                    expandIcon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

// Select the button by its class

// Assuming 'idSuffix' is defined and points to the correct suffix used in the checkbox ID.

function outlineDivById(divId) {
    var element = document.getElementById(divId);
    if (element) {
      element.style.outline = '2px solid #1E90FF'; // Change the color and width as needed
    } else {
      console.log('Element with id "' + divId + '" not found.');
    }
}

function showContextMenu(event, hiddenDiv) {
    hiddenDiv.style.visibility = 'visible';
    hiddenDiv.style.top = `${event.clientY}px`;
    hiddenDiv.style.left = `${event.clientX}px`;
}

function initRightClickHandler() {
    const userBody = document.querySelector('.user-body');
    const hiddenDiv = document.querySelector('.context-menu');
    const innerDivs = hiddenDiv.querySelectorAll('div');

    userBody.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showContextMenu(event, hiddenDiv);
    });

    document.addEventListener('click', (event) => {
        // Hide the context menu if clicked outside or if one of the inner divs is clicked
        if (!hiddenDiv.contains(event.target) || Array.from(innerDivs).includes(event.target)) {
            hideContextMenu();
        }
    });
}

function hideContextMenu() {
    const contextMenu = document.querySelector('.context-menu');
    contextMenu.style.transition = 'visibility 0.2s, opacity 0.2s ease, transform 0.2s ease';
    contextMenu.style.visibility = 'hidden';
    contextMenu.style.opacity = '0';
    contextMenu.style.transform = 'scale(0.8)';
}

function showContextMenu(event, contextMenu) {
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Default position based on the mouse position
    let top = event.clientY;
    let left = event.clientX;

    // Check if the context menu overflows the screen on the right
    if (left + menuWidth > screenWidth) {
        left = screenWidth - menuWidth - 10; // Subtract a small margin
    }

    // Check if the context menu overflows the screen on the bottom
    if (top + menuHeight > screenHeight) {
        top = screenHeight - menuHeight - 10; // Subtract a small margin
    }

    // Apply the calculated position
    contextMenu.style.transition = 'visibility 0.2s, opacity 0.2s ease, transform 0.2s ease';
    contextMenu.style.visibility = 'visible';
    contextMenu.style.opacity = '1';
    contextMenu.style.transform = 'scale(1)';
    contextMenu.style.top = `${top}px`;
    contextMenu.style.left = `${left}px`;
}
function setupContainerEventListeners(container) {
    container.addEventListener('mouseenter', () => {
        if (!container.classList.contains('selected')) {
            container.style.outline = '2px solid #1E90FF';
        }
    });

    container.addEventListener('mouseleave', () => {
        if (!container.classList.contains('selected')) {
            container.style.outline = 'none';
        }
    });

    container.addEventListener('click', function(event) {
        event.stopPropagation();
        handleContainerClick(this);
    });

    container.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        event.stopPropagation();
        handleContainerClick(this);
        showContextMenu(event, document.querySelector('.context-menu'));
    });
}

document.addEventListener('click', (event) => {
    const wrapTarget = document.querySelector('.wrap-target');
    const contextMenu = document.querySelector('.context-menu');

    // Check if the click is inside either wrapTarget or contextMenu
    if (wrapTarget && !wrapTarget.contains(event.target) && 
        (!contextMenu || !contextMenu.contains(event.target))) {
        hideWrapTarget();
    }
});
function hideWrapTarget() {
    const wrapTarget = document.querySelector('.wrap-target');
    if (wrapTarget) {
        wrapTarget.style.transition = 'visibility 0.2s, opacity 0.2s ease, transform 0.2s ease';
        wrapTarget.style.visibility = 'hidden';
        wrapTarget.style.opacity = '0';
        wrapTarget.style.transform = 'scale(0.8)';
    }
}

function showWrapTarget(event) {
    const wrapTarget = document.querySelector('.wrap-target');
    const selectedContainer = document.querySelector('.obj-name'); // Get the container with class 'obj-name'

    if (wrapTarget) {
        // Get the parent of wrapTarget
        const parentElement = wrapTarget.parentElement;

        if (parentElement) {
            // Calculate the mouse position
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            // Get the size of wrapTarget
            const wrapWidth = wrapTarget.offsetWidth;
            const wrapHeight = wrapTarget.offsetHeight;

            // Calculate the available space on the right and bottom of the parent container
            const parentWidth = parentElement.offsetWidth;
            const parentHeight = parentElement.offsetHeight;

            // Calculate the desired position
            let positionX = mouseX;
            let positionY = mouseY;

            // Adjust position if overflowed on the right
            if (mouseX + wrapWidth > parentWidth) {
                positionX = parentWidth - wrapWidth;
            }

            // Adjust position if overflowed on the bottom
            if (mouseY + wrapHeight > parentHeight) {
                positionY = parentHeight - wrapHeight;
            }

            // Position wrapTarget
            wrapTarget.style.transition = 'visibility 0.2s, opacity 0.2s ease, transform 0.2s ease';
            wrapTarget.style.visibility = 'visible';
            wrapTarget.style.opacity = '1';
            wrapTarget.style.transform = 'scale(1)';
            wrapTarget.style.top = `${positionY}px`;
            wrapTarget.style.left = `${positionX}px`;
        }
    }

    // Disable the dropdown option matching the selected container's name
    if (selectedContainer) {
        const selectedContainerName = selectedContainer.innerText.trim(); // Get the container name, trimmed

        const wrapOptions = document.querySelector('#wrap-options');  // Dropdown with id 'wrap-options'
        
        if (wrapOptions) {
            const options = wrapOptions.querySelectorAll('option');
            options.forEach(option => {
                // Compare the container name exactly with the option's text
                if (option.textContent.trim() === selectedContainerName) {
                    option.disabled = true; // Disable the option if it matches the container name exactly
                } else {
                    option.disabled = false; // Ensure other options are enabled
                }
            });
        }
    }
}



window.onload = initRightClickHandler;


function showEditor(){
    const div = document.querySelector('.main-container');
    const eventsDiv = document.querySelector('.events-area'); // Get the .events div
    div.style.display = 'none'; // Hide the main container instantly
    eventsDiv.style.display = 'block'; // Show the events div instantly
    document.querySelector('#changeStateEvents').style.background = "#1E90FF";
    document.querySelector('#changeStateUi').style.background = "#252525";
}
function hideEditor(){
    const div = document.querySelector('.main-container');
    const eventsDiv = document.querySelector('.events-area'); // Get the .events div

    div.style.display = 'flex'; // Hide the main container instantly
    eventsDiv.style.display = 'none'; // Show the events div instantly
    document.querySelector('#changeStateEvents').style.background = "#252525";
    "#1d1d1d"
    "#1E90FF"
    document.querySelector('#changeStateUi').style.background ="#1E90FF" ;
}
document.addEventListener('mousedown', (event) => {
    const showPreviewButton = document.querySelector('.show-preview');
    
    // Check if the button exists and add the click event listener only once
    if (showPreviewButton) {
        showPreviewButton.addEventListener('click', function() {
            // Check the preview variable and toggle the preview visibility with a slight delay
            if (preview === 0) {
                setTimeout(() => {
                    showPreview();
                }, 10); // Delay of 0.3 seconds
            } else {
                setTimeout(() => {
                    hidePreview();
                }, 10); // Delay of 0.3 seconds
            }
        });
    }
});

function showPreview() {
    const showPreviewButton = document.querySelector('.show-preview');
    const previewArea = document.querySelector('.build-preview');
    if (previewArea) {
        previewArea.style.display = 'flex';  // Show the preview
        showPreviewButton.style.backgroundColor = '#1E90FF'; 
        previewArea.style.transform = 'scale(0.9)'; // Start with 0 scale
        previewArea.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Add transition for transform and opacity // Change button color
        preview = 1;  // Set preview state to visible
    }
   
      setTimeout(() => {
        previewArea.style.opacity = '1'; // Fade in
        previewArea.style.transform = 'scale(1)'; // Scale up
      }, 10); // Delay to allow visibility change
}

function hidePreview() {
    const previewArea = document.querySelector('.build-preview');
    const showPreviewButton = document.querySelector('.show-preview');
    if (previewArea) {
        previewArea.style.display = 'none';  // Hide the preview
        showPreviewButton.style.backgroundColor = '#2f2f2f';  // Reset button color
        preview = 0;  // Set preview state to hidden
    }
}

  
 // Prevent right-click inside the .events container
 document.querySelector('.events').addEventListener('contextmenu', function(e) {
    e.preventDefault();  // Prevent the context menu from appearing

  });

  var editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
    mode: "javascript",               // Syntax highlighting for JavaScript
    theme: "monokai",                // Theme for the editor (similar to VS Code's default)
    lineNumbers: true,                // Show line numbers
    matchBrackets: true,              // Match brackets when typing
    indentUnit: 2,                    // Indentation size
    smartIndent: true,                // Automatically indent code
    tabSize: 1,                       // Tab size for indentation
    gutters: ["CodeMirror-linenumbers"], // Display the line numbers
  });
  function showEventInput(event) {
    const inputWrapper = document.querySelector('.event-input');
    const inputField = inputWrapper.querySelector('input');  // Get the input field inside the wrapper
    
    inputWrapper.style.display = 'block';
    inputWrapper.style.zIndex = '9999'; // Ensure it appears above other elements
  
    const mouseX = event.clientX;
    const mouseY = event.clientY;
  
    // Get the size of the input wrapper and the viewport
    const inputWidth = inputWrapper.offsetWidth;
    const inputHeight = inputWrapper.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
  
    let positionX = mouseX;
    let positionY = mouseY;
  
    // Adjust position if overflowed on the right
    if (mouseX + inputWidth > viewportWidth) {
      positionX = viewportWidth - inputWidth - 10; // Offset by 10px for padding
    }
  
    // Adjust position if overflowed on the bottom
    if (mouseY + inputHeight > viewportHeight) {
      positionY = viewportHeight - inputHeight - 10;
    }
  
    inputWrapper.style.position = 'fixed';  // Use fixed to avoid overlapping with other elements
    inputWrapper.style.left = `${positionX}px`;
    inputWrapper.style.top = `${positionY}px`;
  
    inputWrapper.style.transform = 'scale(0.8)';  // Start with smaller scale
    inputWrapper.style.opacity = '0';
  
    setTimeout(() => {
      inputWrapper.style.transition = 'transform 0.1s ease, opacity 0.1s ease';  // Smooth transition for scale and opacity
      inputWrapper.style.transform = 'scale(1)';  // Grow to full size
      inputWrapper.style.opacity = '1';  // Make it visible
      
      // Highlight all text in the input field
      if (inputField) {
        inputField.focus();  // Focus the input field
        inputField.select();  // Select all text inside the input field
      }
    }, 0); // Small delay to trigger transition
  }
  
  function hideEventInput() {
    const inputWrapper = document.querySelector('.event-input');
    
    inputWrapper.style.transition = 'transform 0.1s ease, opacity 0.1s ease'; // Smooth transition for scale and opacity
    inputWrapper.style.transform = 'scale(0.8)';  // Shrink effect
    inputWrapper.style.opacity = '0';  // Fade out
    

      inputWrapper.style.display = 'none';
    
  }
  
  // Add this event listener to the document
// Add this event listener to the document
let inputOpened = false; // Track if the input has been opened

document.addEventListener('mousedown', (event) => {
  const inputWrapper = document.querySelector('.event-input');


    // If the input is opened and the click is outside, hide it
    if (inputOpened && !inputWrapper.contains(event.target)) {
      hideEventInput();
      inputOpened = false; // Reset the flag when hiding the input
    } 
    // If the input is not yet opened, open it
    else if (!inputOpened) {
      inputOpened = true; // Mark the input as opened
    }
  
});
document.addEventListener('mousedown', (event) => {
    const variableList = document.querySelector('.variables-list');
    const variableButton = document.querySelector('#variable-button');  
      // If the input is opened and the click is outside, hide it
      if (!variableList.contains(event.target)&&!variableButton.contains(event.target)) {
        hideVariablesList();
      }
  });
  function hideVariablesList(){
    const variableList = document.querySelector('.variables-list');
    const variableButton = document.querySelector('#variable-button');
    variableList.style.display = "none";
    variableButton.style.backgroundColor = "#2f2f2f";
}

function showVariablesList() {
    const variableList = document.querySelector('.variables-list');
    const variableButton = document.querySelector('#variable-button');
    if (variableList) {
      variableList.style.display = "block"; // Make it visible
      variableButton.style.backgroundColor = "#1E90FF";
      variableList.style.visibility = 'visible'; // Make it visible first
      variableList.style.transform = 'scale(0.8)'; // Start with 0 scale
      variableList.style.transition = 'transform 0.3s ease, opacity 0.3s ease'; // Add transition for transform and opacity
      setTimeout(() => {
        variableList.style.opacity = '1'; // Fade in
        variableList.style.transform = 'scale(1)'; // Scale up
      }, 10); // Delay to allow visibility change
    } 
}


function input_type_url(){
    input_type = 'Url';
    const inputElement = document.getElementById('event-input-field');
    inputElement.setAttribute('type', 'url');
    inputElement.setAttribute('placeholder', 'Enter URL');
}
function input_type_string(){
    input_type = 'String';
    const inputElement = document.getElementById('event-input-field');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('placeholder', 'Enter text');
}
function input_type_number(){
    input_type = 'Number';
    const inputElement = document.getElementById('event-input-field');
    inputElement.setAttribute('type', 'number');
    inputElement.setAttribute('placeholder', 'Enter value');
}
function input_type_object(){
    input_type = 'Object';
    const inputElement = document.getElementById('event-input-field');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('placeholder', 'Select element');
}
function input_type_color(){
    input_type = 'Color';
    const inputElement = document.getElementById('event-input-field');
    inputElement.setAttribute('type', 'color');
    inputElement.setAttribute('placeholder', 'Select color');
}
function modifySpan() {
    // Get the span element by its ID
    const span = document.getElementById('event-input-name');
    
    // Modify the text inside the span
    span.textContent = input_type;
}
function log_event_parameter(event) {
    // Check if the clicked element has the class 'url-parameter'
    const span = event.target.classList.contains('parameter-input') ? event.target : null;
    const inputElement = document.getElementById('event-input-field');
    // If the clicked element has the class, log its text
    if (span) {
      inputElement.value = span.innerText;
    }
  }
  function addVariableBody() {
    // Create the new div element with the class "variable-body"
    const newVariableBody = document.createElement('div');
    newVariableBody.classList.add('variable-body');
    variables++;
  
    // Add the inner content of the "variable-body" div (including your elements)
    newVariableBody.innerHTML = `
  <div class="variable-drag">
    <img src="Assets/drag.png" alt="">
  </div>
  <input type="text" value="myVariable${variables}" id="variable-name">
  <select name="variable-type" id="variable-type">
    <option value="number">Number</option>
    <option value="string">Text</option>
    <option value="boolean">Boolean</option>
    <option value="array">Array</option>
  </select>
  <input type="text" value="0" id="variable-value">
  <div class="variable-more">
    <img src="Assets/more.png" alt="">
  </div>
`;

  
    // Append the new "variable-body" div to the "variables-list-content"
    const variablesListContent = document.querySelector('.variables-list-content');
    variablesListContent.appendChild(newVariableBody);
    document.querySelector('#variables-list-title').innerText = `Variables (${variables})`;
  }
  