import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);

  // ✅ FIXED: Ensure we always have an array of items
  const itemsArray = cartItems?.items || cartItems || [];

  // Calculate total amount - handle both guest and authenticated users
  const calculateTotal = () => {
    if (!itemsArray || itemsArray.length === 0) return 0;

    return itemsArray.reduce((total, currentItem) => {
      let unitPrice = 0;

      if (isAuthenticated) {
        // Authenticated user - cartItem has full product data
        if (currentItem.packing) {
          unitPrice = currentItem.packing.salePrice > 0 
            ? currentItem.packing.salePrice 
            : currentItem.packing.price;
        } else {
          unitPrice = currentItem.salePrice > 0 ? currentItem.salePrice : currentItem.price;
        }
      } else {
        // Guest user - need to find product in productList
        const product = productList?.find(p => p._id === currentItem.productId);
        if (product) {
          if (currentItem.packing) {
            // Find the specific packing price
            const packing = product.packingSizes?.find(p => p.size === currentItem.packing.size);
            unitPrice = packing ? (packing.salePrice > 0 ? packing.salePrice : packing.price) : 0;
          } else {
            unitPrice = product.salePrice > 0 ? product.salePrice : product.price;
          }
        }
      }

      return total + (unitPrice * currentItem.quantity);
    }, 0);
  };

  const totalCartAmount = calculateTotal();

  return (
    <SheetContent className="sm:max-w-lg" aria-describedby={undefined}>
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      
      <div className="mt-6 max-h-96 overflow-y-auto">
        {itemsArray && itemsArray.length > 0 ? (
          itemsArray.map((item, index) => (
            <UserCartItemsContent 
              key={`${item.productId}_${item.packing?.size || "default"}_${index}`}
              cartItem={item} 
            />
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">Your cart is empty</p>
        )}
      </div>

      {itemsArray && itemsArray.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">₹{totalCartAmount.toFixed(2)}</span>
          </div>
          
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/auth/login", { state: { from: "/shop/checkout" } });
              } else {
                navigate("/shop/checkout");
              }
              setOpenCartSheet(false);
            }}
            className="w-full py-2 text-base"
          >
            {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;