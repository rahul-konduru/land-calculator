/**
 * Automated Unit Tests for Land Calculator Engine
 */

import { CalculatorEngine } from '../js/calculator.js';

function runTests() {
  console.log('🧪 Starting Land Calculator Engine Automated Tests...\n');

  let passed = 0;
  let failed = 0;

  function assertEqual(actual, expected, testName) {
    if (actual === expected) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      console.error(`     Expected: "${expected}", Got: "${actual}"`);
      failed++;
    }
  }

  // Test 1: Standard addition 1.21 + 1.21 = 3.02
  console.log('--- Test Suite 1: User Prompt Examples ---');
  const test1 = CalculatorEngine.add('1.21', '1.21');
  assertEqual(test1.formattedCode, '3.02', '1.21 + 1.21 = 3.02');
  assertEqual(test1.humanText, '3 Acres, 2 Guntas', '1.21 + 1.21 human text breakdown');

  // Test 2: Cents carryover 1.2050 + 1.2050 = 3.01
  const test2 = CalculatorEngine.add('1.2050', '1.2050');
  assertEqual(test2.formattedCode, '3.01', '1.2050 + 1.2050 = 3.01');
  assertEqual(test2.humanText, '3 Acres, 1 Gunta', '1.2050 + 1.2050 human text breakdown');

  // Test 3: Single digit shorthand 1.2 + 1.02
  console.log('\n--- Test Suite 2: Shorthand & Padding Edge Cases ---');
  const guntas12 = CalculatorEngine.parseLandInputToCents('1.2');
  assertEqual(guntas12, 6000, '1.2 parses as 1 Ac 20 Gn (6000 Cents)');
  const guntas102 = CalculatorEngine.parseLandInputToCents('1.02');
  assertEqual(guntas102, 4200, '1.02 parses as 1 Ac 2 Gn (4200 Cents)');

  const test3 = CalculatorEngine.add('1.2', '1.02');
  assertEqual(test3.formattedCode, '2.22', '1.2 + 1.02 = 2.22 (2 Ac 22 Gn)');

  // Test 4: Guntas rollover (39 Guntas + 1 Gunta = 1 Acre)
  console.log('\n--- Test Suite 3: Rollover Edge Cases ---');
  const test4 = CalculatorEngine.add('0.39', '0.01');
  assertEqual(test4.formattedCode, '1.00', '0.39 + 0.01 = 1.00 (1 Acre)');

  // Test 5: Cents rollover (39 Guntas 50 Cents + 0 Guntas 50 Cents = 1 Acre)
  const test5 = CalculatorEngine.add('0.3950', '0.0050');
  assertEqual(test5.formattedCode, '1.00', '0.3950 + 0.0050 = 1.00');

  // Test 6: Array summation of multiple land parcels
  console.log('\n--- Test Suite 4: Multi-parcel Array Summation ---');
  const parcelList = ['1.2050', '1.2050', '0.39', '0.01', '2.1525'];
  const summary = CalculatorEngine.calculateSum(parcelList);
  // Total = 3.01 + 1.00 + 2.1525 = 6.1625 (6 Acres, 16 Guntas, 25 Cents)
  assertEqual(summary.total.formattedCode, '6.1625', 'Multi-parcel sum = 6.1625');
  assertEqual(summary.total.humanText, '6 Acres, 16 Guntas, 25 Cents', 'Multi-parcel human text');
  assertEqual(summary.total.conversions.totalSqFt, 279056.25, 'Total Sq Ft conversion accuracy');

  // Test 7: Subtraction engine tests
  console.log('\n--- Test Suite 5: Subtraction Engine & Negative Parcels ---');
  const sub1 = CalculatorEngine.subtract('1.21', '0.21');
  assertEqual(sub1.formattedCode, '1.00', '1.21 - 0.21 = 1.00');
  assertEqual(sub1.humanText, '1 Acre, 0 Guntas', '1.21 - 0.21 human text breakdown');

  const sub2 = CalculatorEngine.subtract('3.02', '1.01');
  assertEqual(sub2.formattedCode, '2.01', '3.02 - 1.01 = 2.01');

  const subWithBorrow = CalculatorEngine.subtract('2.00', '0.20');
  assertEqual(subWithBorrow.formattedCode, '1.20', '2.00 - 0.20 = 1.20 (borrowing guntas from acre)');
  assertEqual(subWithBorrow.humanText, '1 Acre, 20 Guntas', '2.00 - 0.20 human text breakdown');

  const mixedList = ['2.00', '-0.50', '1.10', '-0.20'];
  const mixedSummary = CalculatorEngine.calculateSum(mixedList);
  // 2.00 (8000 Cents) - 0.50 (5000 Cents) + 1.10 (5000 Cents) - 0.20 (2000 Cents) = 6000 Cents = 1.20 (1 Ac 20 Gn)
  assertEqual(mixedSummary.total.formattedCode, '1.20', 'Multi-parcel sum with subtraction = 1.20');

  console.log(`\n========================================`);
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
