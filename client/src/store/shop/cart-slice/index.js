import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { guestCartUtils } from "@/utils/guestCart"; // Import guest cart utilities

const initialState = {
  cartItems: { items: [] }, // ✅ FIXED: Consistent structure with API response
  isLoading: false,
};

// ✅ UPDATED: Handle both authenticated and guest users
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, packing }) => {
    // If user is authenticated, use API
    if (userId) {
      const response = await axios.post(
        "http://localhost:5000/api/shop/cart/add",
        {
          userId,
          productId,
          quantity,
          packing,
        }
      );
      return response.data;
    } else {
      // If guest user, use localStorage
      const guestCart = guestCartUtils.addToGuestCart(productId, quantity, packing);
      return {
        success: true,
        data: { items: guestCart }
      };
    }
  }
);

// ✅ UPDATED: Handle both authenticated and guest users
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    // If user is authenticated, use API
    if (userId) {
      const response = await axios.get(
        `http://localhost:5000/api/shop/cart/get/${userId}`
      );
      return response.data;
    } else {
      // If guest user, use localStorage
      const guestCart = guestCartUtils.getGuestCart();
      return {
        success: true,
        data: { items: guestCart }
      };
    }
  }
);

// ✅ UPDATED: Handle both authenticated and guest users
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, packing }) => {
    // If user is authenticated, use API
    if (userId) {
      const response = await axios.delete(
        `http://localhost:5000/api/shop/cart/${userId}/${productId}${
          packing ? `?packing=${packing.size}` : ""
        }`
      );
      return response.data;
    } else {
      // If guest user, use localStorage
      const guestCart = guestCartUtils.removeFromGuestCart(productId, packing);
      return {
        success: true,
        data: { items: guestCart }
      };
    }
  }
);

// ✅ UPDATED: Handle both authenticated and guest users
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, packing }) => {
    // If user is authenticated, use API
    if (userId) {
      const response = await axios.put(
        "http://localhost:5000/api/shop/cart/update-cart",
        {
          userId,
          productId,
          quantity,
          packing,
        }
      );
      return response.data;
    } else {
      // If guest user, use localStorage
      const guestCart = guestCartUtils.updateGuestCartQuantity(productId, quantity, packing);
      return {
        success: true,
        data: { items: guestCart }
      };
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    // New reducer to merge guest cart with user cart after login
    mergeGuestCart: (state, action) => {
      state.cartItems = action.payload;
    },
    // Clear cart state
    clearCart: (state) => {
      state.cartItems = { items: [] };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || { items: [] };
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || { items: [] };
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || { items: [] };
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || { items: [] };
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { mergeGuestCart, clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;