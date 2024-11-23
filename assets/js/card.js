writeValue = function (ctx, value, pos) {
    var scale = getScalingFactor(getCanvas(), getBackgroundImage());
    pos = { x: pos.x / scale.x, y: pos.y / scale.y };

    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.fillText(value, pos.x, pos.y);
    ctx.restore();
}

function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

    var lines = text.split('\n');
    lineNum = 0;
    for (var i = 0; i < lines.length; i++) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(lines[i], x, y + (lineNum * lineHeight));
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
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineNum * lineHeight));
                lineNum++;
                words = words.splice(idx - 1);
                idx = 1;
            }
            else {
                idx++;
            }
        }
        if (idx > 0) {
            context.fillText(words.join(' '), x, y + (lineNum * lineHeight));
            lineNum++;
        }

    }

}

function drawCardText(value, yStart, maxLinesForNormalFont) {
    let context = getContext();
    context.textAlign = "left";
    context.textBaseline = "middle";
    let maxCharactersForThreeLines = 140;
    let minFontSize = 24;

    let playerType = document.getElementById("playerType").value;
    //let yStart = (playerType === "star") ? 680 : 730;
    let xStart = 265;

    let fontSize = 36;
    let lineHeight = 42;
    let fitWidth = 400; // Reduced fitWidth for accommodating 4 lines at smaller font size

    let textLines = splitWordWrap(context, value, fitWidth);

    if (value.length > maxCharactersForThreeLines) {
        maxLinesForNormalFont = 4; // Allow 4 lines if there are more than 300 characters
    }

    if (textLines.length > maxLinesForNormalFont) {
        let fontReductionStep = 2;
        while (textLines.length > maxLinesForNormalFont) {
            fontSize -= fontReductionStep;
            lineHeight = fontSize * 1.2;
            fitWidth = 400 / (fontSize / 36); // Adjust fit width proportionally to the font size
            textLines = splitWordWrap(context, value, fitWidth);
        }
        fontSize = Math.max(fontSize, minFontSize);
        lineHeight = fontSize * 1.2;
    }

    textLines.forEach((line, index) => {
        let fillStyle = 'black';
        context.font = `${fontSize}px franklin-gothic-book`;
        context.fillStyle = fillStyle;
        context.fillText(line, xStart, yStart + index * lineHeight);
    });
}



function splitWordWrap(context, text, fitWidth) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    
    for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const testWidth = context.measureText(testLine).width;
        
        if (testWidth <= fitWidth) {
            line = testLine;
        } else {
            lines.push(line);
            line = word;
        }
    }
    lines.push(line);
    return lines;
}





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

getBackgroundImage = function () {
    return document.getElementById('bg1');
}

drawBackground = function () {
    getContext().drawImage(
        getBackgroundImage(), 0, 0, getCanvas().width, getCanvas().height);
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

function drawCardName(value) {
    const context = getContext();
    const canvas = getCanvas();
    context.fillStyle = 'black';
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Set the font based on text length
    let fontSize = value.length >= 18 ? Math.max(70, canvas.width / value.length) : 70;
    context.font = `${fontSize}px brothers-regular`;

    // Draw shadow and main text
    writeScaled(value, { x: canvas.width / 2 + 4, y: 125 + 4 });
    context.fillStyle = 'white';
    writeScaled(value, { x: canvas.width / 2, y: 125 });
}


drawTeamName = function (value) {
    getContext().font = '40px brothers-regular';
    getContext().fillStyle = 'black';
    getContext().textAlign = "center";
    getContext().textBaseline = "middle";
    writeScaled(value, { x: getCanvas().width/2 +4, y: 210+4 });
    getContext().fillStyle = 'white';
    writeScaled(value, { x: getCanvas().width/2, y: 210 });
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


function getName() {
    //var textInput = $("#saveNameInput")[0];
    return "BloodBowl_Card";
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

function setModelImage(image) {
    
    console.log("setModelImage:" + image);
    $("#fighterImageUrl")[0].value = image;

}

function setRunemarkImage(image) {
    console.log("setRunemarkImage:", image);

    // Check if the element exists before trying to set its value
    const runemarkImageElement = $("#RunemarkImageUrl")[0];
    
    if (runemarkImageElement) {
        // Set the value if the element exists
        runemarkImageElement.value = image;
    } else {
        console.error("Element #RunemarkImageUrl not found.");
    }
}


function getDefaultModelImageProperties() {
    return {
        offsetX: 0,
        offsetY: 0,
        scalePercent: 100
    };
}

function getModelImageProperties() {
    return {
        offsetX: $("#imageOffsetX")[0].valueAsNumber,
        offsetY: $("#imageOffsetY")[0].valueAsNumber,
        scalePercent: $("#imageScalePercent")[0].valueAsNumber
    };
}

function setModelImageProperties(modelImageProperties) {
    $("#imageOffsetX")[0].value = modelImageProperties.offsetX;
    $("#imageOffsetY")[0].value = modelImageProperties.offsetY;
    $("#imageScalePercent")[0].value = modelImageProperties.scalePercent;
}


function readControls() {
    var data = new Object;
    data.name = getName();
    data.imageUrl = getFighterImageUrl();
    data.imageProperties = getModelImageProperties();
    data.cardName = document.getElementById("cardName").value;
    data.teamName = document.getElementById("teamName").value;
    data.ma = document.getElementById("ma").value;
    data.st = document.getElementById("st").value;
    data.ag = document.getElementById("ag").value;
    data.pa = document.getElementById("pa").value;
    data.defense = document.getElementById("defense").value;
    data.runemarkImageUrl = document.getElementById("runemarkImageUrl").value;
    data.iconColorPicker = document.getElementById("iconColorPicker").value;
    
    data.playerType = document.getElementById("playerType").value;

    data.wp1rng = document.getElementById("wp1rng").value;
    data.wp1dice = document.getElementById("wp1dice").value;
    data.wp1dmg = document.getElementById("wp1dmg").value;
    data.wp1type = document.getElementById("wp1type").value;
    data.wp1hammer = document.getElementById("wp1hammer").value;
    data.wp1special = document.getElementById("wp1special").value;
    data.wp1special2 = document.getElementById("wp1special2").value;
    
    data.wp2rng = document.getElementById("wp2rng").value;
    data.wp2dice = document.getElementById("wp2dice").value;
    data.wp2dmg = document.getElementById("wp2dmg").value;
    data.wp2type = document.getElementById("wp2type").value;
    data.wp2hammer = document.getElementById("wp2hammer").value;
    data.wp2special = document.getElementById("wp2special").value;
    data.wp2special2 = document.getElementById("wp2special2").value;
  
    data.leaderCheck = document.getElementById("leaderCheck").checked;
    data.minionCheck = document.getElementById("minionCheck").checked;
    data.flyCheck = document.getElementById("flyCheck").checked;

    return data;
}

function drawCardFrame(fighterData){
    
    if (fighterData.playerType == "inspired") {
        getContext().drawImage(document.getElementById('frame_inspired'), 0, 0, canvas.width, canvas.height);
    } else {
        getContext().drawImage(document.getElementById('frame_normal'), 0, 0, canvas.width, canvas.height);
    }



    getContext().drawImage(document.getElementById('runemark-bg'), 0, 0, canvas.width, canvas.height);

    if(!document.getElementById("removeBorder").checked){
        getContext().drawImage(document.getElementById('border'), 0, 0, getCanvas().width, getCanvas().height);
    }

    // draw weapon 1
    if(fighterData.wp1special == "Brutal"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-brutal'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special == "Cleave"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-cleave'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special == "Ensnare"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-ensnare'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special == "Grapple"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-grapple'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special == "Grevious"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-grevious'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special == "Stagger"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-stagger'), -20, 0, getCanvas().width, getCanvas().height);
    }

    if(fighterData.wp1special2 == "Crit"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-crit'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Brutal"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-brutal'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Cleave"){
            getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-cleave'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Ensnare"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-ensnare'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Grapple"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-grapple'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Grevious"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-grevious'), -20, 0, getCanvas().width, getCanvas().height);
    } if(fighterData.wp1special2 == "Stagger"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-runemark-2-stagger'), -20, 0, getCanvas().width, getCanvas().height);
    }

    getContext().drawImage(document.getElementById('underworlds-1-weapon'), 0, 0, getCanvas().width, getCanvas().height);
    if(fighterData.wp1type == "Ranged"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-ranged'), 0, 0, getCanvas().width, getCanvas().height);
    } else {
        getContext().drawImage(document.getElementById('underworlds-weapon-1-melee'), 0, 0, getCanvas().width, getCanvas().height);
    }
    if(fighterData.wp1hammer == "Hammer"){
        getContext().drawImage(document.getElementById('underworlds-weapon-1-hammer'), 0, 0, getCanvas().width, getCanvas().height);
    } else {
        getContext().drawImage(document.getElementById('underworlds-weapon-1-swords'), 0, 0, getCanvas().width, getCanvas().height);
    }


    if(!(fighterData.wp2dice == 0 && fighterData.wp2rng == 0 && fighterData.wp2dmg == 0)){
        // draw weapon 2
        if(fighterData.wp2special == "Brutal"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-brutal'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special == "Cleave"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-cleave'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special == "Ensnare"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-ensnare'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special == "Grapple"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-grapple'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special == "Grevious"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-grevious'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special == "Stagger"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-stagger'), -20, 0, getCanvas().width, getCanvas().height);
        }

        if(fighterData.wp2special2 == "Crit"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-crit'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Brutal"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-brutal'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Cleave"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-cleave'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Ensnare"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-ensnare'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Grapple"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-grapple'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Grevious"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-grevious'), -20, 0, getCanvas().width, getCanvas().height);
        } if(fighterData.wp2special2 == "Stagger"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-runemark-2-stagger'), -20, 0, getCanvas().width, getCanvas().height);
        }

        getContext().drawImage(document.getElementById('underworlds-2-weapon'), 0, 0, getCanvas().width, getCanvas().height);
        
        //getContext().drawImage(document.getElementById('underworlds-weapon-2-swords'), 0, 0, getCanvas().width, getCanvas().height);
        getContext().drawImage(document.getElementById('underworlds-weapon-2-hammer'), 0, 0, getCanvas().width, getCanvas().height);
        if(fighterData.wp2type == "Ranged"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-ranged'), 0, 0, getCanvas().width, getCanvas().height);
        } else {
            getContext().drawImage(document.getElementById('underworlds-weapon-2-melee'), 0, 0, getCanvas().width, getCanvas().height);
        }
        if(fighterData.wp2hammer == "Hammer"){
            getContext().drawImage(document.getElementById('underworlds-weapon-2-hammer'), 0, 0, getCanvas().width, getCanvas().height);
        } else {
            getContext().drawImage(document.getElementById('underworlds-weapon-2-swords'), 0, 0, getCanvas().width, getCanvas().height);
        }
        
    }

    if(fighterData.defense == "Shield"){
        getContext().drawImage(document.getElementById('underworlds-shield'), 0, 0, getCanvas().width, getCanvas().height);
    } else {
        getContext().drawImage(document.getElementById('underworlds-dodge'), 0, 0, getCanvas().width, getCanvas().height);
    }


    
    getContext().drawImage(document.getElementById('underworlds-title-frame'), 0, 0, getCanvas().width, getCanvas().height);
    if (fighterData.teamName !== "") {
        getContext().drawImage(document.getElementById('underworlds-subtitle-frame'), 0, 0, getCanvas().width, getCanvas().height);
    }

    drawCardName(fighterData.cardName);
    drawTeamName(fighterData.teamName);
    //drawFooter(fighterData.footer);
    yStart = (playerType === "star") ? 670 : 730;

    //drawCardText(fighterData.cardText, yStart, 3);

    // MA
     drawNumber(fighterData.ma, 123, 236, 60);
    // ST
    drawNumber(fighterData.st, 136, 325, 50);
    // AG
    drawNumber(fighterData.ag, 123, 425, 60);
    // PA
    drawNumber(fighterData.pa, 123, 520, 60);
    
    // WP1 RNG
    drawNumber(fighterData.wp1rng, 320, 868, 70);
    // WP1 Dice
    drawNumber(fighterData.wp1dice, 445, 868, 70);
    // WP1 DMG
    drawNumber(fighterData.wp1dmg, 560, 868, 70);
 
    if(!(fighterData.wp2dice == 0 && fighterData.wp2rng == 0 && fighterData.wp2dmg == 0)){
        // WP2 RNG
        drawNumber(fighterData.wp2rng, 320, 972, 70);
        // WP2 Dice
        drawNumber(fighterData.wp2dice, 445, 972, 70);
        // WP2 DMG
        drawNumber(fighterData.wp2dmg, 560, 972, 70);
    }     

    let runemark_Y = 0;

    if(fighterData.leaderCheck){
        getContext().drawImage(document.getElementById('underworlds-runemark-leader'), 0, runemark_Y, getCanvas().width, getCanvas().height);
        runemark_Y += 100;  // Move down for the next icon
    }
    
    if(fighterData.minionCheck){
        getContext().drawImage(document.getElementById('underworlds-runemark-minion'), 0, runemark_Y, getCanvas().width, getCanvas().height);
        runemark_Y += 100;
    }
    
    if(fighterData.flyCheck){
        getContext().drawImage(document.getElementById('underworlds-runemark-fly'), 0, runemark_Y, getCanvas().width, getCanvas().height);
        runemark_Y += 100;  // Check if this move is too much
    }
    
    drawCircle(697, 232, 38, fighterData.iconColorPicker);
    drawCircle(706, 1005, 26, fighterData.iconColorPicker);

}

const render = function (fighterData) {
    console.log("Render:");
    console.log(fighterData);
    
    const context = getContext();
    const canvas = getCanvas();

    // Draw background 
    context.drawImage(document.getElementById('bg1'), 0, 0, canvas.width, canvas.height);
    

    // Draw fighter image if available
    if (fighterData.imageUrl) {
        const image = new Image();
        image.onload = function () {
            const position = scalePixelPosition({ 
                x: 100 + fighterData.imageProperties.offsetX, 
                y: fighterData.imageProperties.offsetY 
            });
            const scale = fighterData.imageProperties.scalePercent / 100.0;
            const width = image.width * scale;
            const height = image.height * scale;
            context.drawImage(image, position.x, position.y, width, height);
            drawCardFrame(fighterData);
            
            // Check if #runemarkImageUrl is populated before calling drawRunemarkImage
            const runemarkImageUrl = document.getElementById('runemarkImageUrl').value;
            if (runemarkImageUrl) {
                drawRunemarkImage(); // Draw the SVG from #RunemarkImageUrl
            }
        };
        image.src = fighterData.imageUrl;
    } else {
        // Draw frame and check for runemark image if fighter image is not provided
        drawCardFrame(fighterData);
        
        // Check if #runemarkImageUrl is populated before calling drawRunemarkImage
        const runemarkImageUrl = document.getElementById('runemarkImageUrl').value;
        if (runemarkImageUrl) {
            drawRunemarkImage();
        }
    }
};


function drawNumber(num,x, y, fontSize){

    if(num<0 || num>10 ) {
        num = '-';
        plus = false;
    }
    
    getContext().fillStyle = 'black';
    getContext().textAlign = "center";
    getContext().textBaseline = "middle";

    // Set the font size and draw the text with black shadow
    getContext().font = fontSize + 'px brothers-regular';
    writeScaled(num, {x, y});
    
    // Set the font size and draw the text in white
    getContext().fillStyle = 'white';
    writeScaled(num, {x, y});


}

async function writeControls(fighterData) {

    // here we check for base64 loaded image and convert it back to imageUrl
    if (fighterData.base64Image != null) {

        // first convert to blob
        const dataToBlob = async (imageData) => {
            return await (await fetch(imageData)).blob();
        };
        const blob = await dataToBlob(fighterData.base64Image);
        // then create URL object
        fighterData.imageUrl = URL.createObjectURL(blob);
        // Now that's saved, clear out the base64 so we don't reassign
        fighterData.base64Image = null;
    } else {
        fighterData.imageUrl = null;
    }

    setName(fighterData.name);
    setModelImage(fighterData.imageUrl);
    setModelImageProperties(fighterData.imageProperties);
    
    $("#cardName")[0].value = fighterData.cardName;
    $("#teamName")[0].value = fighterData.teamName;
    
    $("#ma")[0].value = fighterData.ma;
    $("#st")[0].value = fighterData.st;
    $("#ag")[0].value = fighterData.ag;
    $("#pa")[0].value = fighterData.pa;
    $("#defense").val(fighterData.defense);
    $("#runemarkImageUrl").val(fighterData.runemarkImageUrl);
    $("#iconColorPicker").val(fighterData.iconColorPicker);
    
    $("#wp1rng")[0].value = fighterData.wp1rng;
    $("#wp1dice")[0].value = fighterData.wp1dice;
    $("#wp1dmg")[0].value = fighterData.wp1dmg;
    $("#wp1type").val(fighterData.wp1type);
    $("#wp1hammer").val(fighterData.wp1hammer);
    $("#wp1special").val(fighterData.wp1special);
    $("#wp1special2").val(fighterData.wp1special2);
    $("#wp2rng")[0].value = fighterData.wp2rng;
    $("#wp2dice")[0].value = fighterData.wp2dice;
    $("#wp2dmg")[0].value = fighterData.wp2dmg;
    $("#wp2type").val(fighterData.wp2type);
    $("#wp2hammer").val(fighterData.wp2hammer);
    $("#wp2special").val(fighterData.wp2special);
    $("#wp2special2").val(fighterData.wp2special2);

    $("#leaderCheck")[0].checked = fighterData.leaderCheck;
    $("#minionCheck")[0].checked = fighterData.minionCheck;
    $("#flyCheck")[0].checked = fighterData.flyCheck;

    // render the updated info
    render(fighterData);
}

function defaultFighterData() {
    var fighterData = new Object;
    fighterData.name = "BloodBowl_Card";
    fighterData.cardName = "Card Name";
    fighterData.teamName = "";
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();
    
    fighterData.ma = 4;
    fighterData.st = 4;
    fighterData.ag = 3;
    fighterData.pa = 3;
    fighterData.defense = "Dodge";
    fighterData.runemarkImageUrl = ""
    fighterData.iconColorPicker = "#000000"
    
    fighterData.wp1dice = 0;
    fighterData.wp1dmg = 0;
    fighterData.wp1rng = 0;
    fighterData.wp1type = "Melee";
    fighterData.wp1hammer = "Hammer";
    fighterData.wp1special = "None";
    fighterData.wp1special2 = "None";
    
    fighterData.wp2dice = 0;
    fighterData.wp2dmg = 0;
    fighterData.wp2rng = 0;
    fighterData.wp2type = "Ranged";
    fighterData.wp2hammer = "Swords";
    fighterData.wp2special = "None";
    fighterData.wp2special2 = "None";
    
    fighterData.imageUrl = null;
    fighterData.imageProperties = getDefaultModelImageProperties();

    return fighterData;
}

function saveFighterDataMap(newMap) {
    window.localStorage.setItem("fighterDataMap", JSON.stringify(newMap));
}

function loadFighterDataMap() {
    var storage = window.localStorage.getItem("fighterDataMap");
    if (storage != null) {
        return JSON.parse(storage);
    }
    // Set up the map.
    var map = new Object;
    map["BloodBowl_Card"] = defaultFighterData();
    saveFighterDataMap(map);
    return map;
}

function loadLatestFighterData() {
    var latestCardName = window.localStorage.getItem("latestCardName");
    if (latestCardName == null) {
        latestCardName = "BloodBowl_Card";
    }

    console.log("Loading '" + latestCardName + "'...");

    var data = loadFighterData(latestCardName);

    if (data) {
        console.log("Loaded data:");
        console.log(data);
    }
    else {
        console.log("Failed to load data, loading defaults.");
        data = defaultFighterData();
    }

    return data;
}

function saveLatestFighterData() {
    var fighterData = readControls();
    if (!fighterData.name) {
        return;
    }

    window.localStorage.setItem("latestCardName", fighterData.name);
    //saveFighterData(fighterData);
}

function loadFighterData(fighterDataName) {
    if (!fighterDataName) {
        return null;
    }

    var map = loadFighterDataMap();
    if (map[fighterDataName]) {
        return map[fighterDataName];
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

async function saveFighterData(fighterData) {
    var finishSaving = function () {
        var map = loadFighterDataMap();
        map[fighterData.name] = fighterData;
        window.localStorage.setItem("fighterDataMap", JSON.stringify(map));
    };

    if (fighterData != null &&
        fighterData.name) {
        // handle images we may have loaded from disk...
        fighterData.imageUrl = await handleImageUrlFromDisk(fighterData.imageUrl);

        finishSaving();
    }
}

function getLatestFighterDataName() {
    return "latestFighterData";
}

window.onload = function () {
    //window.localStorage.clear();
    var fighterData = loadLatestFighterData();
    writeControls(fighterData);
    refreshSaveSlots();

    populateImageSelectDropdown()
}

onAnyChange = function () {
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}



onWeaponRunemarkFileSelect = function (input, weaponName) {
    var grid = $(input.parentNode).find("#weaponRunemarkSelect")[0];

    for (i = 0; i < input.files.length; i++) {
        addToImageRadioSelector(URL.createObjectURL(input.files[i]), grid, weaponName, "white");
    }
}

function addToImageCheckboxSelector(imgSrc, grid, bgColor) {
    var div = document.createElement('div');
    div.setAttribute('class', 'mr-0');
    div.innerHTML = `
    <label for="checkbox-${imgSrc}">
        <img src="${imgSrc}" width="50" height="50" alt="" style="background-color:${bgColor};">
    </label>
    <input type="checkbox" style="display:none;" id="checkbox-${imgSrc}" onchange="onTagRunemarkSelectionChanged(this, '${bgColor}')">
    `;
    grid.appendChild(div);
    return div;
}

function onClearCache() {
    window.localStorage.clear();
    location.reload();
    return false;
}

function onResetToDefault() {
    var fighterData = defaultFighterData();
    writeControls(fighterData);
}

function refreshSaveSlots() {
    // Remove all
    $('select').children('option').remove();

    var fighterDataName = readControls().name;

    var map = loadFighterDataMap();

    for (let [key, value] of Object.entries(map)) {
        var selected = false;
        if (fighterDataName &&
            key == fighterDataName) {
            selected = true;
        }
        var newOption = new Option(key, key, selected, selected);
        $('#saveSlotsSelect').append(newOption);
    }
}

async function onSaveClicked() {
    data = readControls();
    // temp null while I work out image saving
    console.log(data);
    data.base64Image = await handleImageUrlFromDisk(data.imageUrl)

    // need to be explicit due to sub arrays
    var exportObj = JSON.stringify(data, null, 4);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "underworld_card_" + data.cardName.replace(/ /g, "_") + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function saveCardAsImage() {
    var element = document.createElement('a');
    data = readControls();
    element.setAttribute('href', document.getElementById('canvas').toDataURL('image/png'));
    element.setAttribute('download', "underworld_card_" + data.cardName + ".png");
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
        writeControls(json);
    };

    readJSONFile(file).then(json =>
        saveJson(json)
    );

}

onFighterImageUpload = function () {
    image = getModelImage();
    setModelImage(image);
    var fighterData = readControls();
    render(fighterData);
    saveLatestFighterData();
}

function getFighterImageUrl() {
    var imageSelect = $("#fighterImageUrl")[0].value;
    // if (imageSelect.files.length > 0) {
    //return URL.createObjectURL(imageSelect.files[0]);
    // }
    return imageSelect;
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


function onImageSelectChange() {
    const imageSelect = document.getElementById("imageSelectList");
    const selectedImagePath = imageSelect.value;

    setModelImage(selectedImagePath);
    var missionData = readControls();
    render(missionData);
    saveLatestmissionData();
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
        
        const x = 650;   // Example centering, adjust as needed
        const y = 190;  // Example centering, adjust as needed
        const width = 90;            // Desired width
        const height = 90;           // Desired height

        // Draw the image (SVG) onto the canvas
        context.drawImage(image, 653, 187, width, height);
        context.drawImage(image, 677, 975, 60, 60);


        
    };

    image.src = fullUrl;
    image.crossOrigin = "anonymous"; // Set this if the image is from a different origin and requires CORS
}

function drawCircle(x, y, radius, color) {
    // Get the canvas element and its context
    let context = getContext();

    // Begin a new path
    context.beginPath();
    
    // Draw a circle
    context.arc(x, y, radius, 0, Math.PI * 2);

    // Set the fill color
    context.fillStyle = color;

    // Fill the circle with the specified color
    context.fill();

    // Optional: Add a border to the circle
    context.strokeStyle = 'black'; // Set border color
    context.lineWidth = 2;         // Set border width
    context.stroke();              // Draw border
}