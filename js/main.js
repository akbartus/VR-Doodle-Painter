var clearButton;
var doodleClassifier;
var resultsDiv;
var img;
var sunModel = document.querySelector("#sunModel");
var carModel = document.querySelector("#carModel");
var cloudsModel = document.querySelector("#cloudsModel");
var natureModel = document.querySelector("#natureModel");
var houseModel = document.querySelector("#houseModel");
var recognizedText = document.querySelector("#recognizedText");


// Check type of device and add/remove class
if (AFRAME.utils.device.isMobile() === true || !AFRAME.utils.checkHeadsetConnected() === true) {
  document.querySelector("#drawingArea").setAttribute("class", "none");
} else {
  document.querySelector("#drawingArea").setAttribute("class", "clickable");
}

function setup() {
  /*
  If there is a need to use DoodleNet, use the code below: 
  doodleClassifier = ml5.imageClassifier('DoodleNet', modelReady);
  */
  // Own trained classifier
  doodleClassifier = ml5.imageClassifier('model/model.json', modelReady);
  var myButton = document.querySelector("#recognize"),
    myButton2 = document.querySelector("#erase"),
    plane = document.querySelector("#drawingArea");

  // Get texure
  myButton.addEventListener("click", function () {
    var mesh3D = plane.getObject3D('mesh');
    // Get canvas texture and convert to dataURL
    texture = mesh3D.material.map.image.toDataURL();
    doClassification(texture);
  })
  // Erase drawn
  myButton2.addEventListener("click", function () {
    plane.setAttribute("texture-painter", "clearAll: true");
    plane.setAttribute("texture-painter", "clearAll: false");
  })
}

// Do classification
function doClassification(texture) {
  img = createImg(texture, imageReady);
  doodleClassifier.classify(img, gotResults);
}

// Check for readiness
function modelReady() {
  console.log('model loaded');

}

// Show results
function gotResults(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  // Change float to number
  var confidenceLevel = results[0].confidence.toFixed(2) * 100;
  // If confidence level is >= 90, show the result
  if (confidenceLevel >= 90) {
    var content = "I see: " + results[0].label + '. My confidence is: ' + confidenceLevel + "%. Creating virtual  " + results[0].label + "...";
    recognizedText.setAttribute("text", "value:" + content);
    if (results[0].label === "house") {
      setTimeout(() => {
        houseModel.setAttribute("visible", true);
        recognizedText.setAttribute("text", "value: Console");
      }, 3000);
    } else if (results[0].label === "sun") {
      setTimeout(() => {
        sunModel.setAttribute("visible", true);
        recognizedText.setAttribute("text", "value: Console");
      }, 3000);
    } else if (results[0].label === "car") {
      setTimeout(() => {
        carModel.setAttribute("visible", true);
        recognizedText.setAttribute("text", "value: Console");
      }, 3000);
    } else if (results[0].label === "clouds") {
      setTimeout(() => {
        cloudsModel.setAttribute("visible", true);
        recognizedText.setAttribute("text", "value: Console");
      }, 3000);
    } else if (results[0].label === "nature") {
      setTimeout(() => {
        natureModel.setAttribute("visible", true);
        recognizedText.setAttribute("text", "value: Console");
      }, 3000);
    }
  }
}

function imageReady() {
  image(img, 0, 0, width, height);
}