/**
 * User Flow Simulation Test for Calculator UI
 */

import { CalculatorEngine } from '../js/calculator.js';

// Simulate app state
const state = {
  inputBuffer: '0',
  expression: '',
  parcelsList: [],
  isEvaluated: false,
  pendingOp: '+'
};

function handleKeyInput(key) {
  switch (key) {
    case 'AC':
      state.inputBuffer = '0';
      state.expression = '';
      state.parcelsList = [];
      state.isEvaluated = false;
      state.pendingOp = '+';
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
      commitCurrentInputAsParcel('+');
      state.isEvaluated = false;
      break;

    case '-':
    case 'SUB_PARCEL':
      commitCurrentInputAsParcel('-');
      state.isEvaluated = false;
      break;

    case '=':
      if (state.inputBuffer !== '0' && state.inputBuffer !== '') {
        commitCurrentInputAsParcel('+');
      }
      state.isEvaluated = true;
      state.pendingOp = '+';
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

function commitCurrentInputAsParcel(nextOp = '+') {
  const val = state.inputBuffer.trim();
  if (val && val !== '0' && !isNaN(Number(val))) {
    const formattedVal = state.pendingOp === '-' 
      ? (val.startsWith('-') ? val : `-${val}`)
      : val.replace(/^-/, '');
    state.parcelsList.push(formattedVal);
    state.inputBuffer = '0';
  }
  state.pendingOp = nextOp;
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
    pendingOp: state.pendingOp,
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

  console.log('\n----------------------------------------\n');

  console.log('🧪 Simulating User Flow 3: 2.00 -> + -> 0.50 -> - -> 0.20 -> =');
  handleKeyInput('AC');
  handleKeyInput('2');
  handleKeyInput('.');
  handleKeyInput('0');
  handleKeyInput('0');
  handleKeyInput('+');

  handleKeyInput('0');
  handleKeyInput('.');
  handleKeyInput('5');
  handleKeyInput('0');
  handleKeyInput('-');

  handleKeyInput('0');
  handleKeyInput('.');
  handleKeyInput('2');
  handleKeyInput('0');
  console.log('After typing 0.20:', getDisplayState());

  handleKeyInput('=');
  const finalState3 = getDisplayState();
  console.log('After =:', finalState3);

  if (finalState3.calcDisplay === '2.30') {
    console.log('✅ Flow 3 PASS: calcDisplay = 2.30');
  } else {
    console.error(`❌ Flow 3 FAIL: Expected 2.30, got ${finalState3.calcDisplay}`);
    process.exit(1);
  }

  console.log('\n----------------------------------------\n');

  console.log('🧪 Simulating User Flow 4 (User Bug Case): 3.40 -> - -> 1 -> =');
  handleKeyInput('AC');
  handleKeyInput('3');
  handleKeyInput('.');
  handleKeyInput('4');
  handleKeyInput('0');
  console.log('After typing 3.40:', getDisplayState());

  handleKeyInput('-');
  console.log('After - Sub:', getDisplayState());

  handleKeyInput('1');
  console.log('After typing 1:', getDisplayState());

  handleKeyInput('=');
  const finalState4 = getDisplayState();
  console.log('After =:', finalState4);

  if (finalState4.calcDisplay === '3.00') {
    console.log('✅ Flow 4 PASS: 3.40 - 1 = 3.00 (4 Acres - 1 Acre = 3 Acres)');
  } else {
    console.error(`❌ Flow 4 FAIL: Expected 3.00, got ${finalState4.calcDisplay}`);
    process.exit(1);
  }
}

runUserFlowTest();
