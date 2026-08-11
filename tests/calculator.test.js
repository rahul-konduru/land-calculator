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

  console.log(`\n========================================`);
  console.log(`Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
