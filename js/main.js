var myButton = document.querySelector("#recognize"),
  myButton2 = document.querySelector("#erase"),
  plane = document.querySelector("#drawingArea"),
  clearButton,
  sunModel = document.querySelector("#sunModel"),
  carModel = document.querySelector("#carModel"),
  cloudsModel = document.querySelector("#cloudsModel"),
  natureModel = document.querySelector("#natureModel"),
  houseModel = document.querySelector("#houseModel"),
  recognizedText = document.querySelector("#recognizedText");


// Check type of device and add/remove class
if (AFRAME.utils.device.isMobile() === true || !AFRAME.utils.checkHeadsetConnected() === true) {
  document.querySelector("#drawingArea").setAttribute("class", "none");
} else {
  document.querySelector("#drawingArea").setAttribute("class", "clickable");
}



// Get texure
myButton.addEventListener("click", function () {
  var mesh3D = plane.getObject3D('mesh');
  // Get canvas texture and convert to dataURL
  var texture = mesh3D.material.map.image.toDataURL();
  // Add material to img container
  document.getElementById("drawn").setAttribute("src", texture);
  // Do the prediction
  init().then(() => {
    predict();
  });
})
// Erase drawn
myButton2.addEventListener("click", function () {
  plane.setAttribute("texture-painter", "clearAll: true");
  plane.setAttribute("texture-painter", "clearAll: false");
})


// Load model
const URL = 'model/';
let model, labelContainer, maxPredictions;
// Load the image model
async function init() {
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';
  // load the model and metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  labelContainer = document.getElementById('label-container');
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement('div'));
  }
}

// Predict
async function predict() {
  var image = document.getElementById("drawn");
  const prediction = await model.predict(image, false);
  for (let i = 0; i < 5; i++) {
    if(prediction[i].probability.toFixed(2) * 100 >= 90){
      recognizedText.setAttribute("text", "value: " + "I see: " +  prediction[i].className + ". Probability level is: " + prediction[i].probability.toFixed(2) * 100 + "%. Creating virtual " + prediction[i].className);
    }
    
   
  }
  if (prediction[0].probability.toFixed(2) * 100 >= 90) {
    setTimeout(() => {
      natureModel.setAttribute("visible", true);
      recognizedText.setAttribute("text", "value: Console");
    }, 3000);
   
  } else if (prediction[1].probability.toFixed(2) * 100 >= 90) {
    setTimeout(() => {
      houseModel.setAttribute("visible", true);
      recognizedText.setAttribute("text", "value: Console");
    }, 3000);
  } else if (prediction[2].probability.toFixed(2) * 100 >= 90) {
    setTimeout(() => {
      cloudsModel.setAttribute("visible", true);
      recognizedText.setAttribute("text", "value: Console");
    }, 3000);
  } else if (prediction[3].probability.toFixed(2) * 100 >= 90) {
    setTimeout(() => {
      sunModel.setAttribute("visible", true);
      recognizedText.setAttribute("text", "value: Console");
    }, 3000);
  } else if (prediction[4].probability.toFixed(2) * 100 >= 90) {
    setTimeout(() => {
      carModel.setAttribute("visible", true);
      recognizedText.setAttribute("text", "value: Console");
    }, 3000);
  }
}
