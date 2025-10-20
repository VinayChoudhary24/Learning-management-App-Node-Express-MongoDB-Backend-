import { ErrorHandler } from '../../../utils/errors/errorHandler.util';

interface PricingDetails {
  subTotalAmount: number;
  taxes: number;
  discountAmount: number;
  totalAmount: number;
}

export const validateEnrollmentAmount = (subTotalAmount: number): PricingDetails => {
  // Validate subtotal
  if (subTotalAmount < 0) {
    throw new ErrorHandler(400, 'Subtotal amount cannot be negative');
  }

  if (subTotalAmount === 0) {
    throw new ErrorHandler(400, 'Subtotal amount must be greater than zero');
  }

  // Constants
  const TAX_RATE = 0.07; // 7%
  const DISCOUNT_RATE = 0.17; // 17%

  // Calculate discount
  const discountAmount = parseFloat((subTotalAmount * DISCOUNT_RATE).toFixed(2));

  // Calculate amount after discount
  const amountAfterDiscount = subTotalAmount - discountAmount;

  // Calculate tax on discounted amount
  const taxes = parseFloat((amountAfterDiscount * TAX_RATE).toFixed(2));

  const decimalAmount = parseFloat((amountAfterDiscount + taxes).toFixed(2));

  // Calculate total amount
  const totalAmount = Math.round(decimalAmount);

  return {
    subTotalAmount: parseFloat(subTotalAmount.toFixed(2)),
    taxes,
    discountAmount,
    totalAmount,
  };
};
