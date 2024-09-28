// controllers/tensorflowController.js
import * as tf from "@tensorflow/tfjs-node";
import path from "path";

let model;

const loadModel = async () => {
  try {
    if (!model) {
      const modelPath = path.resolve(__dirname, "../services/model/model.json");
      console.log("Loading model from path:", modelPath);
      model = await tf.loadLayersModel(`file://${modelPath}`);
      console.log("Model loaded successfully");
    }
  } catch (error) {
    console.error("Error loading model:", error);
    throw error; // Re-throw the error to be caught in the calling function
  }
};

function normalizeData(data) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map((value) => (value - min) / (max - min));
}

const createSequences = (revenues, expenses, sequenceLength) => {
  const sequences = [];
  for (let i = 0; i < revenues.length - sequenceLength; i++) {
    const sequence = [];
    for (let j = 0; j < sequenceLength; j++) {
      sequence.push([revenues[i + j], expenses[i + j]]);
    }
    sequences.push(sequence);
  }
  return sequences;
};

const getFinancialPredictions = async (req, res) => {
  try {
    console.log("Entered getFinancialPredictions function");
    await loadModel();
    console.log("Model loaded successfully");

    const { monthlyData } = req.body;
    console.log("Received monthly data:", monthlyData);

    const revenues = monthlyData.map((data) => data.revenue);
    const expenses = monthlyData.map((data) => data.expenses);
    console.log("Revenues:", revenues);
    console.log("Expenses:", expenses);

    const normalizedRevenues = normalizeData(revenues);
    const normalizedExpenses = normalizeData(expenses);
    console.log("Normalized revenues:", normalizedRevenues);
    console.log("Normalized expenses:", normalizedExpenses);

    const sequenceLength = 12; // Assuming a sequence length of 12
    const sequences = createSequences(
      normalizedRevenues,
      normalizedExpenses,
      sequenceLength
    );
    console.log("Sequences created:", sequences);

    const inputTensor = tf.tensor3d(sequences);
    console.log("Input tensor created");

    const predictions = model.predict(inputTensor).arraySync();
    console.log("Predictions made:", predictions);

    inputTensor.dispose();
    console.log("Input tensor disposed");

    // Denormalize predictions
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);
    const denormalizedPredictions = predictions.map(
      (pred) => pred[0] * (maxRevenue - minRevenue) + minRevenue
    );

    res.json({ predictedRevenues: denormalizedPredictions });
  } catch (error) {
    console.error("Error making predictions:", error);
    res.status(500).json({ error: "Failed to make predictions" });
  }
};

export { getFinancialPredictions };
