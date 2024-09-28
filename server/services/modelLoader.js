import * as tf from "@tensorflow/tfjs-node";

async function loadModel() {
  const model = await tf.loadLayersModel("file://./model/model.json");
  return model;
}

// Example usage
(async () => {
  const model = await loadModel();
  // Use the model for predictions
})();
