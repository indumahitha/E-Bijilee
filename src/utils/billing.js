// Billing calculation utility
// Implements slab-based pricing for utility bills

/**
 * Calculate bill amount based on units used
 * @param {number} unitsUsed - Number of units consumed
 * @returns {number} Total bill amount
 */
const calculateBillAmount = (unitsUsed) => {
  let amount = 0;

  if (unitsUsed <= 100) {
    // First 100 units: 5 per unit
    amount = unitsUsed * 5;
  } else if (unitsUsed <= 300) {
    // Next 200 units (101-300): 7 per unit
    amount = 100 * 5 + (unitsUsed - 100) * 7;
  } else {
    // Above 300 units: 10 per unit
    amount = 100 * 5 + 200 * 7 + (unitsUsed - 300) * 10;
  }

  return amount;
};

/**
 * Get billing slab details for a given usage
 * @param {number} unitsUsed - Number of units consumed
 * @returns {object} Billing breakdown
 */
const getBillingBreakdown = (unitsUsed) => {
  const amount = calculateBillAmount(unitsUsed);
  const slabs = [];

  if (unitsUsed <= 100) {
    slabs.push({
      range: '0-100 units',
      units: unitsUsed,
      rate: 5,
      amount: unitsUsed * 5
    });
  } else if (unitsUsed <= 300) {
    slabs.push(
      { range: '0-100 units', units: 100, rate: 5, amount: 500 },
      { range: '101-300 units', units: unitsUsed - 100, rate: 7, amount: (unitsUsed - 100) * 7 }
    );
  } else {
    slabs.push(
      { range: '0-100 units', units: 100, rate: 5, amount: 500 },
      { range: '101-300 units', units: 200, rate: 7, amount: 1400 },
      { range: 'Above 300 units', units: unitsUsed - 300, rate: 10, amount: (unitsUsed - 300) * 10 }
    );
  }

  return {
    unitsUsed,
    totalAmount: amount,
    slabs
  };
};

module.exports = {
  calculateBillAmount,
  getBillingBreakdown
};
