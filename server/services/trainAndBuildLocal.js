import fs from "fs";
import * as tf from "@tensorflow/tfjs-node";

async function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

function preprocessData(monthlyData) {
  const aggregatedData = monthlyData.reduce((acc, data) => {
    if (!acc[data.month]) {
      acc[data.month] = { revenue: 0, expenses: 0, count: 0 };
    }
    acc[data.month].revenue += data.revenue;
    acc[data.month].expenses += data.expenses;
    acc[data.month].count += 1;
    return acc;
  }, {});

  const revenues = [];
  const expenses = [];
  for (const month in aggregatedData) {
    revenues.push(aggregatedData[month].revenue / aggregatedData[month].count);
    expenses.push(aggregatedData[month].expenses / aggregatedData[month].count);
  }

  return { revenues, expenses };
}

function normalizeData(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((value) => (value - min) / (max - min));
}

function createSequences(revenues, expenses) {
  const sequences = [];
  const targets = [];
  for (let i = 0; i < revenues.length - 1; i++) {
    sequences.push([[revenues[i], expenses[i]]]);
    targets.push([revenues[i + 1]]);
  }
  return { sequences, targets };
}

function calculateMetrics(yTrue, yPred) {
  const mse = tf.metrics.meanSquaredError(yTrue, yPred).arraySync();
  const mae = tf.metrics.meanAbsoluteError(yTrue, yPred).arraySync();

  const yTrueMean = tf.mean(yTrue).arraySync();
  const yPredMean = tf.mean(yPred).arraySync();
  const xDeviation = tf.sub(yTrue, yTrueMean);
  const yDeviation = tf.sub(yPred, yPredMean);

  const pearsonCorr = tf
    .div(
      tf.sum(tf.mul(xDeviation, yDeviation)),
      tf.sqrt(
        tf.mul(tf.sum(tf.square(xDeviation)), tf.sum(tf.square(yDeviation)))
      )
    )
    .arraySync();

  const ssRes = tf.sum(tf.square(tf.sub(yTrue, yPred))).arraySync();
  const ssTot = tf.sum(tf.square(tf.sub(yTrue, yTrueMean))).arraySync();
  const rSquared = 1 - ssRes / ssTot;

  return {
    mse,
    mae,
    pearsonCorr,
    rSquared,
  };
}

class CustomCallback extends tf.Callback {
  constructor(inputTensor, outputTensor, model) {
    super();
    this.inputTensor = inputTensor;
    this.outputTensor = outputTensor;
    this.model = model;
  }

  async onEpochEnd(epoch, logs) {
    const predictions = this.model.predict(this.inputTensor);
    const metrics = calculateMetrics(this.outputTensor, predictions);
    console.log(`Epoch ${epoch + 1}`);
    console.log(`Loss: ${logs.loss}, Val Loss: ${logs.val_loss}`);
    console.log(`MSE: ${metrics.mse}, MAE: ${metrics.mae}`);
    console.log(`R-squared: ${metrics.rSquared}`);
    console.log(`Pearson Correlation: ${metrics.pearsonCorr}`);
    console.log("---");
    predictions.dispose();
  }
}

async function buildAndTrainLSTMModel(monthlyData) {
  const { revenues, expenses } = preprocessData(monthlyData);
  const normalizedRevenues = normalizeData(revenues);
  const normalizedExpenses = normalizeData(expenses);
  const { sequences, targets } = createSequences(
    normalizedRevenues,
    normalizedExpenses
  );

  const inputTensor = tf.tensor3d(sequences);
  const outputTensor = tf.tensor2d(targets);

  const model = tf.sequential();
  model.add(
    tf.layers.lstm({
      units: 50,
      inputShape: [1, 2],
      returnSequences: false,
    })
  );
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "meanSquaredError",
  });

  const customCallback = new CustomCallback(inputTensor, outputTensor, model);

  await model.fit(inputTensor, outputTensor, {
    epochs: 2000,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: [
      tf.callbacks.earlyStopping({
        monitor: "val_loss",
        patience: 50,
      }),
      customCallback,
    ],
  });

  await model.save("file://./model");

  // Clean up
  inputTensor.dispose();
  outputTensor.dispose();
}

(async () => {
  try {
    const filePath = "./train.json";
    const jsonData = await readJsonFile(filePath);
    const monthlyData = jsonData.monthlyData;
    await buildAndTrainLSTMModel(monthlyData);
    console.log("Model training completed successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
