const writeValue = function(ctx, value, position) {
    if (!ctx || typeof ctx.fillText !== 'function') {
      throw new Error('Invalid canvas context');
    }
  
    const canvas = getCanvas();
    const backgroundImage = getBackgroundImage();
    const scale = getScalingFactor(canvas, backgroundImage);
    const scaledPosition = {
      x: position.x / scale.x,
      y: position.y / scale.y
    };
  
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, scaledPosition.x, scaledPosition.y);
  };

getScalingFactor = function (canvas, warcryCardOne) {
    return {
        x: canvas.width / warcryCardOne.width,
        y: canvas.height / warcryCardOne.height
    };
}

getCanvas = function () {
    return document.getElementById("canvas");
}

getContext = function () {
    return getCanvas().getContext("2d");
}

function getBackgroundImage() {
    const backgroundMap = {
        'bg1': 'map',
        'bg2': 'map',
    };

    const selectedOption = document.getElementById('background-list').value;
    const backgroundImageId = backgroundMap[selectedOption];

    return document.getElementById(backgroundImageId);
}



drawBorder = function () {
    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('card-border'), 0, 0, getCanvas().width, getCanvas().height);
    }
}


scalePixelPosition = function (pixelPosition) {
    var scalingFactor = getScalingFactor(getCanvas(), getBackgroundImage());
    var scaledPosition = { x: pixelPosition.x * scalingFactor.x, y: pixelPosition.y * scalingFactor.y };
    return scaledPosition;
}

writeScaled = function (value, pixelPos) {
    var scaledPos = scalePixelPosition(pixelPos);
    writeValue(getContext(), value, scaledPos);
}

drawCardElementFromInput = function (inputElement, pixelPosition) {
    var value = inputElement.value;
    writeScaled(value, pixelPosition);
}

drawCardElementFromInputId = function (inputId, pixelPosition) {
    drawCardElementFromInput(document.getElementById(inputId), pixelPosition);
}

drawplayName = function (value) {
    startX = 1122 / 2;
    startY = 110;
    var maxWidth = 390; // Set the desired width for the text

    getContext().textAlign = "center";
    getContext().textBaseline = "middle";

    // Scale font size based on text width
    var fontSize = 46; // Initial font size
    getContext().font = fontSize + 'px brothers-regular';

    // Measure text width
    var textWidth = getContext().measureText(value).width;

    // Adjust font size if text width exceeds maxWidth
    if (textWidth > maxWidth) {
        fontSize = (fontSize * maxWidth) / textWidth;
    }

    // Set the font size and draw the text
    getContext().font = fontSize + 'px brothers-regular';
    getContext().fillStyle = 'black';
    writeScaled(value, { x: startX, y: startY });
}




function getLabel(element) {
    return $(element).prop("labels")[0];
}

function getImage(element) {
    return $(element).find("img")[0];
}


function drawImage(scaledPosition, scaledSize, image) {
    if (image != null) {
        if (image.complete) {
            getContext().drawImage(image, scaledPosition.x, scaledPosition.y, scaledSize.x, scaledSize.y);
        }
        else {
            image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        }
    }
}

function drawImageSrc(scaledPosition, scaledSize, imageSrc) {
    if (imageSrc != null) {
        var image = new Image();
        image.onload = function () { drawImage(scaledPosition, scaledSize, image); };
        image.src = imageSrc;
    }
}


function drawModel(imageUrl, imageProps) {
    if (imageUrl != null) {
        var image = new Image();
        image.onload = function () {
            var position = scalePixelPosition({ x: imageProps.offsetX, y: imageProps.offsetY });
            var scale = imageProps.scalePercent / 100.0;
            var width = image.width * scale;
            var height = image.height * scale;
            getContext().drawImage(image, position.x, position.y, width, height);
            //URL.revokeObjectURL(image.src);
        };
        image.src = imageUrl;
    }
}

function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "Bloodbowl_Play_Card";
}

function setName(name) {
    //var textInput = $("#saveNameInput")[0];
    //textInput.value = name;
}



function getModelImage() {
    var imageSelect = $("#imageSelect")[0];

    if (imageSelect.files.length > 0) {
        return URL.createObjectURL(imageSelect.files[0]);
    }
    return null;
}

function getFighterImageUrl() {
    var imageSelect = $("#missionImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
}


function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.playName = document.getElementById("playName").value;
    data.bgselected = document.getElementById('background-list').value;
    data.removeBorder = document.getElementById("removeBorder").checked;
    data.cardText = document.getElementById("cardText").value;
    data.cardFontSize = document.getElementById("cardFontSize").value;    
    data.inspireText = document.getElementById("inspireText").value;
    
    return data;
}


const render = function(data) {
    
    //drawFrame();
    drawOverlayTexts(data);
    // Check if #runemarkImageUrl is populated before calling drawRunemarkImage
    const runemarkImageUrl = document.getElementById('runemarkImageUrl').value;
    if (runemarkImageUrl) {
        drawRunemarkImage(); // Draw the SVG from #RunemarkImageUrl
    }
    drawBorder();

    drawCardText(data.cardText, x=360, y=180, fitWidth=550, fontSize=data.cardFontSize)
    drawCardText(data.inspireText, 96, 180, 200)
  
}
  



async function writeControls(data) {
    //setName("Bloodbowl_Play_Card"); // Always default, trying to move away from this

    // here we check for base64 loaded image and convert it back to imageUrl
    if (data.base64Image) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(data.base64Image);
        // then create URL object
        data.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        data.base64Image = null;
    }

    if (data.base64CustomBackground) {
        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(data.base64CustomBackground);
        // then create URL object
        data.customBackgroundUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        data.base64CustomBackground = null;
    }


    $("#playName")[0].value = data.playName;

    // check and uncheck if needed

    document.getElementById('background-list').value = data.bgselected;
    document.getElementById("removeBorder").checked = data.removeBorder;
    document.getElementById("cardText").value = data.cardText;
    document.getElementById("cardFontSize").value = data.cardFontSize;
    document.getElementById("inspireText").value = data.inspireText;
    
    // render the updated info
    render(data);
}

function defaultmissionData() {
    var data = new Object;
    data.name = "Bloodbowl_Play_Card";
    data.imageUrl = null;
    data.base64Image = null;
    data.customBackgroundUrl = null;
    data.base64CustomBackground = null;
    data.playName = "Warband Name";
    data.bgselected = "bg1";
    data.cardText = "This is some text"
    data.cardFontSize = 46
    data.inspireText = "This is some text"

    data.removeBorder = false;

    return data;
}

function savemissionDataMap(newMap) {
    window.localStorage.setItem("missionDataMap", JSON.stringify(newMap));
}

function loadmissionDataMap() {
    var storage = window.localStorage.getItem("missionDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["Bloodbowl_Play_Card"] = defaultmissionData();
    savemissionDataMap(map);
    return map;
}

function loadLatestmissionData() {
    var latestFighterName = window.localStorage.getItem("latestFighterName");
    if (latestFighterName == null) {
        latestFighterName = "Bloodbowl_Play_Card";
    }

    var data = loadmissionData(latestFighterName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data - loading default");
        data = defaultCardData();
    }

    return data;
}

function saveLatestmissionData() {
    var missionData = readControls();
    if (!missionData.name) {
        return;
    }

    window.localStorage.setItem("latestFighterName", missionData.name);
    //savemissionData(missionData);
}

function loadmissionData(missionDataName) {
    if (!missionDataName) {
        return null;
    }

    var map = loadmissionDataMap();
    if (map[missionDataName]) {
        return map[missionDataName];
    }

    return null;
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL;
}

function onload2promise(obj) {
    return new Promise((resolve, reject) => {
        obj.onload = () => resolve(obj);
        obj.onerror = reject;
    });
}

async function getBase64ImgFromUrl(imgUrl) {
    let img = new Image();
    let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
    img.src = imgUrl;
    await imgpromise;
    var imgData = getBase64Image(img);
    return imgData;
}

async function handleImageUrlFromDisk(imageUrl) {
    if (imageUrl &&
        imageUrl.startsWith("blob:")) {
        // The image was loaded from disk. So we can load it later, we need to stringify it.
        imageUrl = await getBase64ImgFromUrl(imageUrl);
    }

    return imageUrl;
}

function getLatestmissionDataName() {
    return "latestmissionData";
}

window.onload = function () {
    //window.localStorage.clear();

    var missionData = loadLatestmissionData();
    writeControls(missionData);
    refreshSaveSlots();

    populateImageSelectDropdown()


}

function validateInput(input) {
    // Only allow letters, spaces, and hyphens
    var regex = /^[a-zA-Z\s:-]+$/;
    return regex.test(input);
}

onAnyChange = function () {
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}


function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var missionData = defaultmissionData();
    writeControls(missionData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var missionDataName = readControls().name;

    var map = loadmissionDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (missionDataName &&
            key == missionDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();

    // weird situation where when no image is saved, but json is then saved
    // when the json is loaded a blank image loads and if you try save json
    // again, this section will hang.

    // here is where we should be changing the imageUrl to base64
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)
    data.base64CustomBackground = await handleImageUrlFromDisk(data.customBackgroundUrl)

    // temp null while I work out image saving
    //data.imageUrl = null;

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    file_name = "Underworlds_Warband_";

    file_name =  file_name + data.playName.replace(/ /g, "_") + ".json";
    downloadAnchorNode.setAttribute("download", file_name);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    data = readControls();
    var element = document.createElement('a');
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    
    file_name = "Underworlds_Warband_";
    file_name = file_name + data.playName.replace(/ /g, "_") + ".png";

    element.setAttribute("download", file_name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

$(document).ready(function () {
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    // ctx.stroke();
    
});

async function readJSONFile(file) {
    // Function will return a new Promise which will resolve or reject based on whether the JSON file is read and parsed successfully
    return new Promise((resolve, reject) => {
        // Define a FileReader Object to read the file
        let fileReader = new FileReader();
        // Specify what the FileReader should do on the successful read of a file
        fileReader.onload = event => {
            // If successfully read, resolve the Promise with JSON parsed contents of the file
            resolve(JSON.parse(event.target.result))
        };
        // If the file is not successfully read, reject with the error
        fileReader.onerror = error => reject(error);
        // Read from the file, which will kick-off the onload or onerror events defined above based on the outcome
        fileReader.readAsText(file);
    });
}

async function fileChange(file) {
    // Function to be triggered when file input changes
    // As readJSONFile is a promise, it must resolve before the contents can be read
    // in this case logged to the console

    var saveJson = function (json) {
        json.customBackgroundUrl =  null;

        // Check with old jsons where bgselected didn't exist
        let bgSelectedValue;

        // Check if missionData.bgselected value already exists
        if (!json.bgselected) {
        // Iterate through each bg option in missionData
        for (const prop in json) {
            if (prop.startsWith('bg') && json[prop]) {
            bgSelectedValue = prop.replace('bg', 'bg-');
            break;
            }
        }

        // Update missionData.bgselected only if a value is found
        if (bgSelectedValue) {
            json.bgselected = bgSelectedValue;
        }
        }
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}


function drawOverlayTexts(missionData) {
    const {
      playName
    } = missionData;
    // These are the texts to overlay
    drawMap();
    drawplayName(playName);

    drawBorder();
  
  }

  function drawMap(){
    getContext().drawImage(document.getElementById('map'), 0, 0, getCanvas().width, getCanvas().height); 
  }

  function drawIcon(name, x, y){
    newCoord = convertInchesToPixels(x, y);
    getContext().drawImage(document.getElementById(name), newCoord.x, newCoord.y, 70, 70); 
  }



function writeScaledBorder(value, startX, startY) {
    getContext().fillStyle = 'white';
    writeScaled(value, { x: startX+1, y: startY });
    writeScaled(value, { x: startX, y: startY+1 });
    writeScaled(value, { x: startX+1, y: startY+1 });
    writeScaled(value, { x: startX-1, y: startY });
    writeScaled(value, { x: startX, y: startY-1 });
    writeScaled(value, { x: startX-1, y: startY-1 });
    getContext().fillStyle = 'black';
    writeScaled(value, { x: startX, y: startY });
}



function splitWordWrap(context, text, fitWidth) {
    // this was modified from the print version to only return the text array
    return_array = [];
    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            return_array.push(lines[i]);
            lineNum++;
        }
        var words = lines[i].split(' ');
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                return_array.push(words.slice(0, idx - 1).join(' '));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            return_array.push(words.join(' '));
            lineNum++;
        }

    }
    return return_array;
}





function drawCircleWithLetter(x, y, Letter) {
    // Get the canvas element and its 2d context
    var canvas = getCanvas();
    var ctx = canvas.getContext("2d");

    newCoord = convertInchesToPixels(x, y);
    // Set circle properties
    var circleRadius = 34; // Radius of the circle
    var circleX = newCoord.x; // X-coordinate of the circle center
    var circleY = newCoord.y; // Y-coordinate of the circle center

    // Draw the circle outline
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4; 

    // Set circle fill style to white and fill the circle
    ctx.fillStyle = document.getElementById("colorPicker").value;
    ctx.fill();

    // Set text properties
    var fontSize = (Letter.length > 1) ? 38 : 42; // Reduce font size if Letter has two characters
    getContext().font = fontSize + 'px brothers-regular';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = document.getElementById("colorPickerText").value; // Text color
    ctx.stroke();

    // Draw the letter inside the circle
    ctx.fillText(Letter, circleX, circleY+2);
}



function onImageSelectChange() {
    const imageSelect = document.getElementById("imageSelectList");
    const selectedImagePath = imageSelect.value;

    setModelImage(selectedImagePath);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
}





function populateImageSelectDropdown() {
    const imageSelect = document.getElementById("imageSelectList");
    imageSelect.innerHTML = ""; // Clear existing options

    // Add "-- None" option at the start
    const noneOption = document.createElement("option");
    noneOption.value = ""; // Set the value to an empty string or any default value
    noneOption.text = "-- None";
    imageSelect.appendChild(noneOption);

    // Fetch image file names from the GitHub repository directory
    fetch("https://api.github.com/repos/barrysheppard/underworlds-card-creator/git/trees/main?recursive=1")
        .then(response => response.json())
        .then(data => {
            // Filter out files from the response
            const imageFiles = data.tree.filter(item => item.type === 'blob' && item.path.startsWith('assets/img/logos/'));

            // Populate the select dropdown with image file names
            imageFiles.forEach(function(imageFile) {
                const option = document.createElement("option");
                option.value = imageFile.path; // Set the option's value to the image file path
                option.text = imageFile.path.replace('assets/img/logos/', ''); // Display the image file name in the dropdown
                option.text = option.text.replace('.svg', ''); // Display the image file name in the dropdown
                imageSelect.appendChild(option); // Add the option to the select element
            });
        })
        .catch(error => {
            console.error("Error fetching image files from GitHub: ", error);
        });
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}

onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}


function onRunemarkSelectChange() {
    // Get the selected value from the dropdown
    const selectedImage = document.getElementById("imageSelectList").value;

    // Update the hidden input field with the selected image URL
    const runemarkImageUrlInput = document.getElementById("runemarkImageUrl");
    runemarkImageUrlInput.value = selectedImage; // Set the value to the selected image URL

    // Optionally, log to check if the correct value is set
    console.log("Selected Image URL:", selectedImage);
    
    // redraw
    var missionData = readControls();
    render(missionData);
}


function drawRunemarkImage() {
    const runemarkImageElement = document.getElementById('runemarkImageUrl');
    
    // Ensure the element exists before trying to access its value
    if (!runemarkImageElement) {
        console.error("Element #runemarkImageUrl not found");
        return;  // Exit early if the element doesn't exist
    }

    const runemarkImageUrl = runemarkImageElement.value;

    // If the value is empty, we can exit the function early
    if (!runemarkImageUrl) {
        console.log("No runemark image URL provided.");
        return;
    }

    // Proceed with loading the runemark image as before
    //const fullUrl = window.location.origin + '/' + runemarkImageUrl;
    const fullUrl = 'https://barrysheppard.github.io/underworlds-card-creator/' + runemarkImageUrl;
    const image = new Image();
    image.onload = function() {
        const context = getContext();
        
        const x = 984;   // Example centering, adjust as needed
        const y = 78;  // Example centering, adjust as needed
        const width = 60;            // Desired width
        const height = 60;           // Desired height

        // Draw the image (SVG) onto the canvas
        context.drawImage(image, x, y, width, height);
        
    };

    image.src = fullUrl;
    image.crossOrigin = "anonymous"; // Set this if the image is from a different origin and requires CORS
}



drawCardText = function (value, x=360, y=180, fitWidth=550, fontSize = 32) {

    getContext().font = fontSize+'px frutiger-light';
    getContext().fillStyle = 'black';
    getContext().textAlign = "left";
    getContext().textBaseline = "top";
    lineHeight = fontSize;

    // This one works, commented out for testing
    //    printAtWordWrap(getContext(), value, getCanvas().width / 2, 280, lineHeight, fitWidth);

    // Trying to get a bold and italic check going
    text_array = (splitWordWrap(getContext(), value, fitWidth));
    printWithMarkup(getContext(), text_array, x, y, lineHeight);

}



function printWithMarkup(context, text_array, x, y, lineHeight) {

    // table code style --> font style

    // Text comes in as an array
    // need to split it into lines
    for (line in text_array) {
        if (text_array[line].startsWith("**")) {
            printText = text_array[line].replace("**", '');
            context.font = 'bold 38px frutiger-light';
            context.fillStyle = '#5B150F';
            context.fillText(printText, x, y + (line * lineHeight));
            context.font = '36px frutiger-light';
            context.fillStyle = 'black';
        } else {
            context.fillText(text_array[line], x, y + (line * lineHeight));
        }


    }
}

