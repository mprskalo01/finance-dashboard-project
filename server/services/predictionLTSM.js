import * as tf from "@tensorflow/tfjs-node"; // Use tfjs-node for server-side
import {
  preprocessData,
  createSequences,
  normalizeData,
  denormalizeData,
  makePredictions,
} from "./dataUtils.js"; // Adjust the path as needed

async function buildAndTrainLSTMModel(sequences, targets) {
  const model = tf.sequential();

  model.add(
    tf.layers.lstm({
      units: 50,
      returnSequences: true,
      inputShape: [sequences[0].length, 1],
    })
  );

  model.add(
    tf.layers.lstm({
      units: 30,
      returnSequences: false,
    })
  );

  model.add(tf.layers.dense({ units: 20, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: "meanSquaredError",
  });

  const xs = tf.tensor3d(sequences);
  const ys = tf.tensor2d(targets, [targets.length, 1]);

  await model.fit(xs, ys, {
    epochs: 24, // was 100
    batchSize: 32,
    validationSplit: 0.1,
    callbacks: tf.callbacks.earlyStopping({
      monitor: "val_loss",
      patience: 10,
    }),
  });

  return model;
}

async function predictFinancials(
  monthlyData,
  sequenceLength = 6,
  numPredictions = 12 // Adjust this value as needed
) {
  const { revenues, expenses } = preprocessData(monthlyData);

  const normalizedRevenues = normalizeData(revenues);
  const normalizedExpenses = normalizeData(expenses);

  const revenueSequences = createSequences(normalizedRevenues, sequenceLength);
  const expenseSequences = createSequences(normalizedExpenses, sequenceLength);

  const revenueModel = await buildAndTrainLSTMModel(
    revenueSequences.sequences,
    revenueSequences.targets
  );
  const expenseModel = await buildAndTrainLSTMModel(
    expenseSequences.sequences,
    expenseSequences.targets
  );

  const predictedRevenues = await makePredictions(
    revenueModel,
    normalizedRevenues,
    sequenceLength,
    numPredictions
  );
  const predictedExpenses = await makePredictions(
    expenseModel,
    normalizedExpenses,
    sequenceLength,
    numPredictions
  );

  const denormalizedRevenues = denormalizeData(predictedRevenues, revenues);
  const denormalizedExpenses = denormalizeData(predictedExpenses, expenses);

  return {
    predictedRevenues: denormalizedRevenues,
    predictedExpenses: denormalizedExpenses,
  };
}

export { predictFinancials };
