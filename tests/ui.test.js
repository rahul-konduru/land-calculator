/**
 * Integration Test for Land Calculator Keypad & Engine Wiring
 */

import { CalculatorEngine } from '../js/calculator.js';

function runUiIntegrationTests() {
  console.log('🧪 Starting Land Calculator UI Integration Tests...\n');

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

  // Test 1: Simulating parcel addition sequence 1.21 + Add + 1.21 + =
  console.log('--- Test Suite 1: Parcel Addition Sequence ---');
  const parcels = ['1.21', '1.21'];
  const res1 = CalculatorEngine.calculateSum(parcels);
  assertEqual(res1.total.formattedCode, '3.02', '1.21 + 1.21 = 3.02');
  assertEqual(res1.total.humanText, '3 Acres, 2 Guntas', '3 Acres, 2 Guntas breakdown');
  assertEqual(res1.total.conversions.totalSqFt, 132858, '132,858 Sq Ft conversion (12,200 Cents * 10.89)');

  // Test 2: Simulating 3 land parcels 1.2050 + 1.2050 + 0.39 = 4.00
  console.log('\n--- Test Suite 2: Multi-Parcel Summation ---');
  const parcels2 = ['1.2050', '1.2050', '0.39'];
  const res2 = CalculatorEngine.calculateSum(parcels2);
  assertEqual(res2.total.formattedCode, '4.00', '1.2050 + 1.2050 + 0.39 = 4.00 (4 Acres)');
  assertEqual(res2.total.humanText, '4 Acres, 0 Guntas', '4 Acres, 0 Guntas breakdown');

  // Test 3: Deleting a parcel from array
  console.log('\n--- Test Suite 3: Parcel Item Deletion ---');
  parcels2.splice(2, 1); // remove '0.39'
  const res3 = CalculatorEngine.calculateSum(parcels2);
  assertEqual(res3.total.formattedCode, '3.01', 'After deleting 0.39, remaining sum = 3.01');

  // Test 4: Clearing all parcels
  console.log('\n--- Test Suite 4: AC Clear List ---');
  const res4 = CalculatorEngine.calculateSum([]);
  assertEqual(res4.total.formattedCode, '0.00', 'Cleared list total formatted code = 0.00');
  assertEqual(res4.total.humanText, '0 Acres, 0 Guntas, 0 Cents', 'Cleared list human breakdown');

  console.log(`\n========================================`);
  console.log(`UI Integration Test Execution Finished: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runUiIntegrationTests();
