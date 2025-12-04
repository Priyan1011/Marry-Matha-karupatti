import { guestCartUtils } from './guestCart';
import { addToCart } from '@/store/shop/cart-slice'; // Add this import

export const cartMerger = {
  // Merge guest cart with user cart after login
  mergeCarts: async (guestCart, userId, dispatch) => {
    if (!guestCart || guestCart.length === 0) return;

    try {
      // Add each guest cart item to user cart
      for (const item of guestCart) {
        await dispatch(
          addToCart({
            userId: userId,
            productId: item.productId,
            quantity: item.quantity,
            packing: item.packing,
          })
        ).unwrap();
      }
      
      // Clear guest cart after successful merge
      guestCartUtils.clearGuestCart();
      
    } catch (error) {
      console.error('Error merging carts:', error);
      throw error; // Re-throw to handle in component
    }
  }
};