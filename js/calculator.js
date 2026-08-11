/**
 * Land Calculator Engine
 * Core Land Dimension Decoding & Math Calculations (Acres.GuntasCents)
 * 
 * Rules & Unit Hierarchy:
 * - 1 Acre = 40 Guntas
 * - 1 Gunta = 100 Cents
 * - 1 Acre = 4,000 Cents
 * - 1 Acre = 43,560 Sq Ft (1 Gunta = 1,089 Sq Ft, 1 Cent = 10.89 Sq Ft)
 */

export const CalculatorEngine = {
  /**
   * Version information
   */
  info() {
    return {
      version: '2.0.0-core',
      status: 'Phase 2 Core Calculation Logic Active'
    };
  },

  /**
   * Parse an input string or number in A.GGCC format into total Cents (Integer representation).
   * 
   * Examples:
   * - "1.21"    => 1 Acre, 21 Guntas, 0 Cents   => 4000 + 2100 + 0    = 6100 Cents
   * - "1.2050"  => 1 Acre, 20 Guntas, 50 Cents  => 4000 + 2000 + 50   = 6050 Cents
   * - "0.39"    => 0 Acres, 39 Guntas, 0 Cents  => 3900 Cents
   * - "0.0050"  => 0 Acres, 0 Guntas, 50 Cents  => 50 Cents
   * 
   * @param {string|number} rawInput 
   * @returns {number} totalCents
   */
  parseLandInputToCents(rawInput) {
    if (rawInput === null || rawInput === undefined || rawInput === '') {
      return 0;
    }

    const str = String(rawInput).trim();
    if (!str || isNaN(Number(str))) {
      return 0;
    }

    const parts = str.split('.');
    const acresStr = parts[0] || '0';
    const acres = Math.abs(parseInt(acresStr, 10) || 0);

    let guntas = 0;
    let cents = 0;

    if (parts.length > 1 && parts[1]) {
      const decStr = parts[1];

      // Extract Guntas (digits 1-2)
      let guntasPart = '';
      if (decStr.length === 1) {
        // e.g. "1.2" => 20 Guntas
        guntasPart = decStr + '0';
      } else {
        guntasPart = decStr.substring(0, 2);
      }
      guntas = parseInt(guntasPart, 10) || 0;

      // Extract Cents (digits 3-4)
      if (decStr.length > 2) {
        let centsPart = decStr.substring(2, 4);
        if (centsPart.length === 1) {
          centsPart = centsPart + '0';
        }
        cents = parseInt(centsPart, 10) || 0;
      }
    }

    const isNegative = str.startsWith('-');
    const totalCents = (acres * 4000) + (guntas * 100) + cents;
    return isNegative ? -totalCents : totalCents;
  },

  /**
   * Decode total Cents back to formatted A.GGCC string and human breakdown object
   * 
   * @param {number} totalCents 
   * @returns {Object} decoded object
   */
  decodeCentsToLand(totalCents) {
    const isNegative = totalCents < 0;
    const absCents = Math.abs(Math.round(totalCents));

    const acres = Math.floor(absCents / 4000);
    const remCentsAfterAcres = absCents % 4000;

    const guntas = Math.floor(remCentsAfterAcres / 100);
    const cents = remCentsAfterAcres % 100;

    // Build standard numeric string result A.GGCC
    // If cents > 0, include cents part (e.g. 3.0150)
    // If cents == 0, display 2 digits for guntas (e.g. 3.02 or 3.01)
    const guntasPadded = String(guntas).padStart(2, '0');
    let decString = guntasPadded;
    if (cents > 0) {
      const centsPadded = String(cents).padStart(2, '0');
      decString += centsPadded;
    }

    const formattedCode = `${acres}.${decString}`;
    const signPrefix = isNegative ? '-' : '';

    // Calculate secondary conversions
    const totalSqFt = absCents * 10.89; // 1 Cent = 10.89 Sq Ft (43,560 / 4000)
    const totalSqYards = totalSqFt / 9;   // 1 Sq Yard = 9 Sq Ft
    const totalSqMeters = totalSqFt / 10.76391;

    // Human readable text label
    const textParts = [];
    textParts.push(`${acres} ${acres === 1 ? 'Acre' : 'Acres'}`);
    textParts.push(`${guntas} ${guntas === 1 ? 'Gunta' : 'Guntas'}`);
    if (cents > 0 || (acres === 0 && guntas === 0)) {
      textParts.push(`${cents} ${cents === 1 ? 'Cent' : 'Cents'}`);
    }
    const humanText = `${signPrefix}${textParts.join(', ')}`;

    return {
      rawTotalCents: totalCents,
      isNegative,
      acres,
      guntas,
      cents,
      formattedCode: `${signPrefix}${formattedCode}`,
      humanText,
      conversions: {
        totalSqFt: Math.round(totalSqFt * 100) / 100,
        totalSqYards: Math.round(totalSqYards * 100) / 100,
        totalSqMeters: Math.round(totalSqMeters * 100) / 100
      }
    };
  },

  /**
   * Add two land measurements formatted in A.GGCC
   */
  add(input1, input2) {
    const c1 = this.parseLandInputToCents(input1);
    const c2 = this.parseLandInputToCents(input2);
    return this.decodeCentsToLand(c1 + c2);
  },

  /**
   * Subtract input2 from input1 formatted in A.GGCC
   */
  subtract(input1, input2) {
    const c1 = this.parseLandInputToCents(input1);
    const c2 = this.parseLandInputToCents(input2);
    return this.decodeCentsToLand(c1 - c2);
  },

  /**
   * Calculate total summation of an array of parcel input strings/numbers
   * 
   * @param {Array<string|number>} parcelList 
   * @returns {Object} decoded total summary
   */
  calculateSum(parcelList = []) {
    let sumCents = 0;
    const items = [];

    for (const item of parcelList) {
      const cents = this.parseLandInputToCents(item);
      sumCents += cents;
      items.push({
        rawInput: item,
        decoded: this.decodeCentsToLand(cents)
      });
    }

    const totalDecoded = this.decodeCentsToLand(sumCents);
    return {
      items,
      total: totalDecoded
    };
  }
};
