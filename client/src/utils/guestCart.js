// Utility functions for guest cart management
export const guestCartUtils = {
  // Get guest cart from localStorage
  getGuestCart: () => {
    try {
      return JSON.parse(localStorage.getItem('guestCart') || '[]');
    } catch (error) {
      console.error('Error reading guest cart:', error);
      return [];
    }
  },

  // Add item to guest cart
  addToGuestCart: (productId, quantity = 1, packing = null) => {
    try {
      const guestCart = guestCartUtils.getGuestCart();
      const existingItemIndex = guestCart.findIndex(item => 
        item.productId === productId && 
        JSON.stringify(item.packing) === JSON.stringify(packing)
      );

      if (existingItemIndex > -1) {
        guestCart[existingItemIndex].quantity += quantity;
      } else {
        guestCart.push({
          productId,
          quantity,
          packing,
          addedAt: new Date().toISOString()
        });
      }

      localStorage.setItem('guestCart', JSON.stringify(guestCart));
      return guestCart;
    } catch (error) {
      console.error('Error adding to guest cart:', error);
      return [];
    }
  },

  // Remove item from guest cart
  removeFromGuestCart: (productId, packing = null) => {
    try {
      const guestCart = guestCartUtils.getGuestCart();
      const updatedCart = guestCart.filter(item => 
        !(item.productId === productId && JSON.stringify(item.packing) === JSON.stringify(packing))
      );
      
      localStorage.setItem('guestCart', JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing from guest cart:', error);
      return [];
    }
  },

  // Update quantity in guest cart
  // In /src/utils/guestCart.js - fix the updateGuestCartQuantity function:
updateGuestCartQuantity: (productId, quantity, packing = null) => {
  try {
    const guestCart = guestCartUtils.getGuestCart();
    const itemIndex = guestCart.findIndex(item => 
      item.productId === productId && 
      JSON.stringify(item.packing) === JSON.stringify(packing)
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        guestCart.splice(itemIndex, 1);
      } else {
        guestCart[itemIndex].quantity = quantity;
      }
    }

    localStorage.setItem('guestCart', JSON.stringify(guestCart)); // Fixed variable name
    return guestCart;
  } catch (error) {
    console.error('Error updating guest cart:', error);
    return [];
  }
},

  // Clear guest cart
  clearGuestCart: () => {
    localStorage.removeItem('guestCart');
  },

  // Get guest cart count
  getGuestCartCount: () => {
    const guestCart = guestCartUtils.getGuestCart();
    return guestCart.reduce((total, item) => total + item.quantity, 0);
  }
};