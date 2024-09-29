import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import { fileURLToPath } from "url";

let model;

const loadModel = async () => {
  try {
    if (!model) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const modelPath = path.resolve(__dirname, "./model.json");
      console.log("Loading model from path:", modelPath);
      model = await tf.loadLayersModel(`file://${modelPath}`);
      console.log("Model loaded successfully");
    }
  } catch (error) {
    console.error("Error loading model:", error);
    throw error;
  }
};

const normalizeData = (data) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return max !== min
    ? data.map((value) => (value - min) / (max - min))
    : data.map(() => 0);
};

const createSequences = (revenues, expenses) => {
  const sequences = [];
  for (let i = 0; i < revenues.length; i++) {
    sequences.push([[revenues[i], expenses[i]]]);
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

    const sequences = createSequences(normalizedRevenues, normalizedExpenses);
    console.log("Sequences created:", sequences);

    const inputTensor = tf.tensor3d(sequences);
    console.log("Input tensor created");

    let predictions = model.predict(inputTensor).arraySync();
    predictions = predictions.map((pred) =>
      pred.map((value) => Math.abs(value))
    );
    console.log("Predictions made:", predictions);

    inputTensor.dispose();
    console.log("Input tensor disposed");

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

// Mock request and response objects for testing
const mockRequest = {
  body: {
    monthlyData: [
      { revenue: 1000, expenses: 500 },
      { revenue: 1500, expenses: 700 },
      { revenue: 2000, expenses: 800 },
      { revenue: 2500, expenses: 900 },
      { revenue: 3000, expenses: 1000 },
      { revenue: 3500, expenses: 1100 },
      { revenue: 4000, expenses: 1200 },
      { revenue: 4500, expenses: 1300 },
      { revenue: 5000, expenses: 1400 },
      { revenue: 5500, expenses: 1500 },
      { revenue: 6000, expenses: 1600 },
      { revenue: 6500, expenses: 1700 },
      { revenue: 7000, expenses: 1800 },
      { revenue: 7500, expenses: 1900 },
    ],
  },
};

const mockResponse = {
  json: (data) => {
    console.log("Response data:", data);
  },
  status: (statusCode) => {
    console.log("Response status:", statusCode);
    return {
      json: (data) => {
        console.log("Response data:", data);
      },
    };
  },
};

// Run the test
getFinancialPredictions(mockRequest, mockResponse);
