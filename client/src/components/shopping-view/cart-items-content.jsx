import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";

function UserCartItemsContent({ cartItem }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [productDetails, setProductDetails] = useState(null);

  // Load product details for guest users
  useEffect(() => {
    if (!isAuthenticated && cartItem.productId) {
      const product = productList?.find(p => p._id === cartItem.productId);
      setProductDetails(product);
    }
  }, [cartItem.productId, isAuthenticated, productList]);

  // For authenticated users, cartItem has full product data
  // For guest users, we need to find product details from productList
  const getDisplayData = () => {
    if (isAuthenticated) {
      // Authenticated user - cartItem has full product data
      return {
        title: cartItem.title,
        image: cartItem.image,
        price: cartItem.price,
        salePrice: cartItem.salePrice,
        packing: cartItem.packing
      };
    } else {
      // Guest user - need to get data from productDetails
      return {
        title: productDetails?.title || "Product",
        image: productDetails?.image || "",
        price: productDetails?.price || 0,
        salePrice: productDetails?.salePrice || 0,
        packing: cartItem.packing
      };
    }
  };

  const displayData = getDisplayData();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    const newQuantity = typeOfAction === "plus" 
      ? getCartItem.quantity + 1 
      : getCartItem.quantity - 1;

    // Don't allow quantity less than 1
    if (newQuantity < 1) {
      handleCartItemDelete(getCartItem);
      return;
    }

    // Stock check for authenticated users
    if (typeOfAction === "plus" && isAuthenticated) {
      const productStock = displayData.totalStock || 999; // Fallback for guest users
      if (newQuantity > productStock) {
        toast({
          title: `Only ${productStock} items available`,
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: isAuthenticated ? user?.id : null,
        productId: getCartItem.productId,
        quantity: newQuantity,
        packing: getCartItem.packing,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(isAuthenticated ? user?.id : null));
        toast({
          title: "Cart updated",
        });
      } else {
        toast({
          title: data?.payload?.message || "Update failed",
          variant: "destructive",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: isAuthenticated ? user?.id : null,
        productId: getCartItem.productId,
        packing: getCartItem.packing,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(isAuthenticated ? user?.id : null));
        toast({
          title: "Item removed from cart",
        });
      } else {
        toast({
          title: data?.payload?.message || "Delete failed",
          variant: "destructive",
        });
      }
    });
  }

  // Calculate price - handle both guest and authenticated users
  const calculatePrice = () => {
    if (displayData.packing) {
      // Use packing price
      return displayData.packing.salePrice > 0 
        ? displayData.packing.salePrice 
        : displayData.packing.price;
    } else {
      // Use product price
      return displayData.salePrice > 0 ? displayData.salePrice : displayData.price;
    }
  };

  const unitPrice = calculatePrice();
  const totalPrice = unitPrice * cartItem.quantity;

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      {displayData.image && (
        <img
          src={displayData.image}
          alt={displayData.title}
          className="w-16 h-16 rounded object-cover"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-sm">
          {displayData.title}
          {displayData.packing?.size && ` - ${displayData.packing.size}`}
        </h3>
        <div className="flex items-center space-x-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            className="h-8 w-8 p-0"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="min-w-8 text-center font-medium">{cartItem.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">
          ₹{totalPrice.toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 mt-1"
        >
          <Trash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;