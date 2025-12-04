import Address from "@/components/shopping-view/address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, ShoppingBag, MessageCircle } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // ✅ Calculate total using packing-specific price
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const unitPrice = currentItem.packing
            ? currentItem.packing.salePrice > 0
              ? currentItem.packing.salePrice
              : currentItem.packing.price
            : currentItem.salePrice > 0
            ? currentItem.salePrice
            : currentItem.price;
          return sum + unitPrice * currentItem.quantity;
        }, 0)
      : 0;

  // ✅ WHATSAPP MESSAGE GENERATOR WITH EMOJIS
  const generateWhatsAppMessage = () => {
    if (!currentSelectedAddress || !cartItems?.items?.length) return "";

    const itemsList = cartItems.items
      .map((item) => {
        const size = item.packing?.size || "Default";
        const price =
          item.packing?.salePrice ||
          item.packing?.price ||
          item.salePrice ||
          item.price;
        const lineTotal = price * item.quantity;
        return `• ${item.title} (${size}) x ${item.quantity} = ₹${lineTotal.toLocaleString()}`;
      })
      .join("\n");

    const now = new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const phoneText =
      currentSelectedAddress.phone || user?.phone || "Not provided";

    // ✅ MESSAGE WITH EMOJIS
    const message = `Hi Marry Matha Karupatti Team! 😊

*NEW ORDER REQUEST* 🧾
Phone: ${phoneText}

*ORDER ITEMS:* 🛒
${itemsList}

*TOTAL: ₹${totalCartAmount.toLocaleString()}* 💰

*DELIVERY ADDRESS:* 📍
${currentSelectedAddress.address || ""}
${currentSelectedAddress.city || ""}, ${
      currentSelectedAddress.state || "Tamil Nadu"
    }
PIN: ${currentSelectedAddress.pincode || ""}

*Order Time:* ${now} ⏰

Please confirm order & share payment details! 🙏

#KarupattiOrder`;

    return encodeURIComponent(message);
  };

  // ✅ SAVE WHATSAPP LEAD TO DATABASE
  const saveWhatsappOrderToDatabase = async () => {
    try {
      // ✅ FIX: Use import.meta.env for Vite
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const whatsappOrderData = {
        userId: user?.id,
        customerName: user?.userName || "Guest",
        customerPhone: currentSelectedAddress.phone || user?.phone,
        cartItems: cartItems.items.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          price: item.packing?.salePrice || item.packing?.price || item.price,
          quantity: item.quantity,
          packing: item.packing,
        })),
        addressInfo: {
          addressId: currentSelectedAddress._id,
          address: currentSelectedAddress.address,
          city: currentSelectedAddress.city,
          pincode: currentSelectedAddress.pincode,
          state: currentSelectedAddress.state || "Tamil Nadu",
          phone: currentSelectedAddress.phone,
          notes: currentSelectedAddress.notes,
        },
        totalAmount: totalCartAmount,
        whatsappMessage: generateWhatsAppMessage(),
      };

      const response = await fetch(
        `${apiUrl}/api/shop/whatsapp-orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(whatsappOrderData),
        }
      );

      const data = await response.json();

      if (!data.success) {
        console.error("Failed to save WhatsApp order:", data.message);
      }

      return data.success;
    } catch (error) {
      console.error("Error saving WhatsApp order:", error);
      return false;
    }
  };

  // ✅ HANDLE WHATSAPP ORDER
  const handleWhatsAppOrder = async () => {
    if (!cartItems?.items?.length) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select delivery address",
        description: "Address is required for order",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Save to database first
      const savedSuccessfully = await saveWhatsappOrderToDatabase();

      if (!savedSuccessfully) {
        toast({
          title: "Warning",
          description:
            "Order recorded locally. Please check your WhatsApp orders later.",
          variant: "destructive",
        });
      }

      // ✅ Then open WhatsApp
      const whatsappNumber = "917092337624"; // ✅ Test number
      const message = generateWhatsAppMessage();
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

      window.open(whatsappURL, "_blank");

      // ✅ Success notification
      toast({
        title: "Order sent to WhatsApp! 💬",
        description: "Our team will confirm your order shortly.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 py-12 px-4 max-w-7xl mx-auto">
      {/* ✅ LEFT SIDE: ADDRESS SELECTION */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="w-6 h-6 text-karupatti-accent" />
            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Address
            </h2>
          </div>
          <Address
            setCurrentSelectedAddress={setCurrentSelectedAddress}
            selectedId={currentSelectedAddress?._id}
          />
        </div>
      </div>

      {/* ✅ RIGHT SIDE: ORDER SUMMARY + WHATSAPP BUTTON */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
          {/* ✅ ORDER SUMMARY */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-karupatti-accent" />
              <h2 className="text-2xl font-bold text-gray-900">
                Order Summary
              </h2>
            </div>

            {/* ✅ CART ITEMS */}
            <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
              {cartItems?.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <UserCartItemsContent cartItem={item} />
                </div>
              ))}
            </div>

            {/* ✅ PRICE BREAKDOWN */}
            <div className="space-y-3 mb-8 p-4 bg-gradient-to-r from-karupatti-cream/50 to-karupatti-accent/10 rounded-xl">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{totalCartAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Free Delivery</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total</span>
                <span>₹{totalCartAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ✅ WHATSAPP ORDER BUTTON - GREEN */}
          <Button
            onClick={handleWhatsAppOrder}
            disabled={isProcessing}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 text-lg transform hover:scale-105 transition-all disabled:opacity-50"
            size="lg"
          >
            <MessageCircle className="w-6 h-6" />
            {isProcessing ? "Processing..." : "Order via WhatsApp"}
          </Button>

          {/* ✅ INFO TEXT */}
          <p className="text-sm text-gray-500 mt-4 text-center">
            After clicking, your order details will open in WhatsApp. Send the
            message to confirm.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;