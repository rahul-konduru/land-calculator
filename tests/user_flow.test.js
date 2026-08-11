/**
 * User Flow Simulation Test for Calculator UI
 */

import { CalculatorEngine } from '../js/calculator.js';

// Simulate app state
const state = {
  inputBuffer: '0',
  expression: '',
  parcelsList: [],
  isEvaluated: false
};

function handleKeyInput(key) {
  switch (key) {
    case 'AC':
      state.inputBuffer = '0';
      state.expression = '';
      state.parcelsList = [];
      state.isEvaluated = false;
      break;

    case 'DEL':
      if (state.isEvaluated) state.isEvaluated = false;
      if (state.inputBuffer.length > 1) {
        state.inputBuffer = state.inputBuffer.slice(0, -1);
      } else {
        state.inputBuffer = '0';
      }
      break;

    case '+':
    case 'ADD_PARCEL':
      addCurrentInputAsParcel();
      state.isEvaluated = false;
      break;

    case '=':
      if (state.inputBuffer !== '0' && state.inputBuffer !== '') {
        addCurrentInputAsParcel();
      }
      state.isEvaluated = true;
      break;

    case '.':
      if (state.isEvaluated) {
        state.inputBuffer = '0.';
        state.isEvaluated = false;
      } else if (!state.inputBuffer.includes('.')) {
        state.inputBuffer += '.';
      }
      break;

    default:
      if (/^[0-9]$/.test(key)) {
        if (state.isEvaluated) {
          state.inputBuffer = key;
          state.isEvaluated = false;
        } else if (state.inputBuffer === '0') {
          state.inputBuffer = key;
        } else {
          state.inputBuffer += key;
        }
      }
      break;
  }
}

function addCurrentInputAsParcel() {
  const val = state.inputBuffer.trim();
  if (val && val !== '0' && !isNaN(Number(val))) {
    state.parcelsList.push(val);
    state.inputBuffer = '0';
  }
}

function getDisplayState() {
  const summaryResult = CalculatorEngine.calculateSum(state.parcelsList);
  let calcDisplay = '0';
  let calcHumanText = '0 Acres, 0 Guntas';

  if (state.inputBuffer !== '0') {
    const cents = CalculatorEngine.parseLandInputToCents(state.inputBuffer);
    const decoded = CalculatorEngine.decodeCentsToLand(cents);
    calcDisplay = state.inputBuffer;
    calcHumanText = decoded.humanText;
  } else if (state.parcelsList.length > 0) {
    calcDisplay = summaryResult.total.formattedCode;
    calcHumanText = summaryResult.total.humanText;
  }

  return {
    calcDisplay,
    calcHumanText,
    parcelsList: [...state.parcelsList],
    inputBuffer: state.inputBuffer,
    isEvaluated: state.isEvaluated
  };
}

function runUserFlowTest() {
  console.log('🧪 Simulating User Flow 1: 1.21 -> + -> 1.21 -> =');

  handleKeyInput('1');
  handleKeyInput('.');
  handleKeyInput('2');
  handleKeyInput('1');
  console.log('After typing 1.21:', getDisplayState());

  handleKeyInput('+');
  console.log('After +:', getDisplayState());

  handleKeyInput('1');
  handleKeyInput('.');
  handleKeyInput('2');
  handleKeyInput('1');
  console.log('After typing 1.21 second time:', getDisplayState());

  handleKeyInput('=');
  const finalState1 = getDisplayState();
  console.log('After =:', finalState1);

  if (finalState1.calcDisplay === '3.02') {
    console.log('✅ Flow 1 PASS: calcDisplay = 3.02');
  } else {
    console.error(`❌ Flow 1 FAIL: Expected 3.02, got ${finalState1.calcDisplay}`);
  }

  console.log('\n----------------------------------------\n');

  console.log('🧪 Simulating User Flow 2: 1.21 -> + -> 1.21 -> + -> =');
  handleKeyInput('AC');
  handleKeyInput('1');
  handleKeyInput('.');
  handleKeyInput('2');
  handleKeyInput('1');
  handleKeyInput('+');

  handleKeyInput('1');
  handleKeyInput('.');
  handleKeyInput('2');
  handleKeyInput('1');
  handleKeyInput('+');
  console.log('After second +:', getDisplayState());

  handleKeyInput('=');
  const finalState2 = getDisplayState();
  console.log('After =:', finalState2);

  if (finalState2.calcDisplay === '3.02') {
    console.log('✅ Flow 2 PASS: calcDisplay = 3.02');
  } else {
    console.error(`❌ Flow 2 FAIL: Expected 3.02, got ${finalState2.calcDisplay}`);
  }
}

runUserFlowTest();
