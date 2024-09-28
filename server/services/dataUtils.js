import * as tf from "@tensorflow/tfjs-node"; // Use tfjs-node for server-side

function preprocessData(monthlyData) {
  const revenues = monthlyData.map((data) => data.revenue);
  const expenses = monthlyData.map((data) => data.expenses);

  const normalizedRevenues = normalizeData(revenues);
  const normalizedExpenses = normalizeData(expenses);

  const sequences = createSequences(normalizedRevenues, normalizedExpenses);
  const targets = normalizedRevenues.slice(1); // Assuming you are predicting the next revenue

  return { sequences, targets };
}

function normalizeData(data) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  return data.map((value) => (value - min) / (max - min));
}

function createSequences(revenues, expenses) {
  const sequences = [];
  for (let i = 0; i < revenues.length - 1; i++) {
    sequences.push([revenues[i], expenses[i]]);
  }
  return sequences.map((seq) => [seq]);
}

function createSequences(revenues, expenses) {
  const sequences = [];
  for (let i = 0; i < revenues.length - 1; i++) {
    sequences.push([[revenues[i]], [expenses[i]]]);
  }
  return sequences;
}
// export function createSequences(data, sequenceLength) {
//   const sequences = [];
//   const targets = [];
//   for (let i = 0; i < data.length - sequenceLength; i++) {
//     sequences.push(data.slice(i, i + sequenceLength).map((value) => [value]));
//     targets.push(data[i + sequenceLength]);
//   }
//   return { sequences, targets };
// }

// export function normalizeData(data) {
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   return data.map((value) => (value - min) / (max - min));
// }

export function denormalizeData(data, originalData) {
  const max = Math.max(...originalData);
  const min = Math.min(...originalData);
  return data.map((value) => {
    const denormalizedValue = value * (max - min) + min;
    return parseFloat(denormalizedValue.toFixed(2)); // Round to 2 decimal places
  });
}

export async function makePredictions(
  model,
  data,
  sequenceLength,
  numPredictions
) {
  const predictions = [];
  let input = data.slice(-sequenceLength).map((value) => [value]);
  for (let i = 0; i < numPredictions; i++) {
    const inputTensor = tf.tensor3d([input], [1, sequenceLength, 1]);
    const prediction = model.predict(inputTensor);
    const predictedValue = prediction.dataSync()[0];
    predictions.push(predictedValue);
    input = [...input.slice(1), [predictedValue]];
  }
  return predictions;
}
