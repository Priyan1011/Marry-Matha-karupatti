import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { ChevronDown, Heart, Share2, ShoppingCart, CheckCircle } from "lucide-react";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedPacking, setSelectedPacking] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // ✅ LOGIC PRESERVED: Calculate effective price based on selected packing
  const getEffectivePrice = () => {
    if (selectedPacking) {
      return selectedPacking.salePrice > 0
        ? selectedPacking.salePrice
        : selectedPacking.price;
    }
    return productDetails?.salePrice > 0
      ? productDetails?.salePrice
      : productDetails?.price;
  };

  // ✅ LOGIC PRESERVED: Get base price for strikethrough
  const getBasePrice = () => {
    if (selectedPacking) {
      return selectedPacking.salePrice > 0 ? selectedPacking.price : null;
    }
    return productDetails?.salePrice > 0 ? productDetails?.price : null;
  };

  // ✅ LOGIC PRESERVED: Calculate discount percentage
  const getDiscountPercentage = () => {
    const basePrice = getBasePrice();
    const effectivePrice = getEffectivePrice();
    if (basePrice && effectivePrice) {
      return Math.round(((basePrice - effectivePrice) / basePrice) * 100);
    }
    return 0;
  };

  // ✅ LOGIC PRESERVED: Get stock status with color coding
  const getStockStatus = () => {
    let stock;
    if (selectedPacking) {
      stock = selectedPacking.stock;
    } else {
      stock = productDetails?.totalStock;
    }

    if (stock === 0) {
      return {
        text: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: "❌",
      };
    } else if (stock < 10) {
      return {
        text: `Only ${stock} left!`,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        icon: "⚡",
      };
    }

    return {
      text: `In Stock (${stock} available)`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: "✓",
    };
  };

  // ✅ LOGIC PRESERVED: Add to cart with validation
  function handleAddToCart() {
    if (productDetails?.packingSizes?.length > 0 && !selectedPacking) {
      toast({
        title: "Please select a packing size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) =>
          item.productId === productDetails?._id &&
          (!selectedPacking || item.packing?.size === selectedPacking.size)
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        const availableStock = selectedPacking
          ? selectedPacking.stock
          : productDetails?.totalStock;
        if (getQuantity + 1 > availableStock) {
          toast({
            title: `Only ${availableStock} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: productDetails?._id,
        quantity: 1,
        packing: selectedPacking
          ? { size: selectedPacking.size, price: selectedPacking.price }
          : null,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
    setSelectedPacking(null);
    setShowReviewForm(false);
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        setShowReviewForm(false);
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
      setSelectedPacking(null);
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const stockStatus = getStockStatus();

  if (!productDetails) return null;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-amber-100 px-6 py-4 flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-amber-900">
            {productDetails?.title}
          </DialogTitle>
          <button
            onClick={handleDialogClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 p-6">
          {/* LEFT: Image Section */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden bg-white shadow-lg border border-amber-100 h-96">
              <img
                src={productDetails?.image}
                alt={productDetails?.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Trust Badges */}
            <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium">100% Pure Karupatti</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium">No Added Sugar</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle size={18} className="text-green-600" />
                  <span className="font-medium">Natural & Traditional</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details Section */}
          <div className="flex flex-col gap-6">
            {/* Description Preview */}
            <div className="bg-white rounded-xl p-4 border border-amber-100">
              <p className="text-gray-600 text-sm leading-relaxed">
                {productDetails?.description}
              </p>
            </div>

            {/* Rating and Reviews Count */}
            <div className="bg-white rounded-xl p-3 border border-amber-100 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <StarRatingComponent
                  rating={averageReview}
                  handleRatingChange={() => {}}
                  readOnly
                />
              </div>
              <span className="font-semibold text-amber-900">
                {averageReview.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({reviews?.length || 0} reviews)
              </span>
            </div>

            {/* PACKING SIZE SELECTOR - Enhanced Design */}
            {productDetails?.packingSizes &&
              productDetails.packingSizes.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-amber-100 space-y-3">
                  <label className="block font-semibold text-amber-900 text-sm">
                    📦 Select Packing Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {productDetails.packingSizes.map((packing) => (
                      <button
                        key={packing.size}
                        onClick={() => setSelectedPacking(packing)}
                        disabled={packing.stock === 0}
                        className={`p-3 rounded-lg border-2 transition-all font-semibold text-sm flex flex-col items-center gap-1 ${
                          selectedPacking?.size === packing.size
                            ? "border-amber-600 bg-amber-100 text-amber-900 shadow-md"
                            : packing.stock === 0
                            ? "border-gray-200 bg-gray-50 text-gray-400 opacity-50 cursor-not-allowed"
                            : "border-amber-200 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50"
                        }`}
                      >
                        <span>{packing.size}</span>
                        <span className="text-xs">
                          ₹
                          {packing.salePrice > 0
                            ? packing.salePrice
                            : packing.price}
                        </span>
                        {selectedPacking?.size === packing.size && (
                          <span className="text-base">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {!selectedPacking && (
                    <div className="text-xs text-orange-600 font-medium bg-orange-50 p-2 rounded">
                      👆 Select a size to proceed
                    </div>
                  )}
                </div>
              )}

            {/* PRICE SECTION - Improved */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-200">
              {productDetails?.packingSizes &&
              productDetails.packingSizes.length > 0 ? (
                selectedPacking ? (
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-amber-900">
                      ₹{getEffectivePrice()}
                    </div>
                    {getBasePrice() && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="line-through text-gray-500">
                          ₹{getBasePrice()}
                        </span>
                        {getDiscountPercentage() > 0 && (
                          <span className="bg-green-500 text-white px-2 py-0.5 rounded font-semibold text-xs">
                            Save {getDiscountPercentage()}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-600 font-medium">
                    Select a size to see price
                  </div>
                )
              ) : (
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-amber-900">
                    ₹{getEffectivePrice()}
                  </div>
                  {getBasePrice() && (
                    <span className="line-through text-gray-500 text-sm">
                      ₹{getBasePrice()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* STOCK STATUS - Color Coded Pill */}
            <div className={`rounded-xl p-3 border ${stockStatus.bgColor} flex items-center gap-2`}>
              <span className="text-lg">{stockStatus.icon}</span>
              <span className={`font-semibold ${stockStatus.color}`}>
                {stockStatus.text}
              </span>
            </div>

            {/* ADD TO CART BUTTON */}
            <Button
              onClick={handleAddToCart}
              disabled={
                productDetails?.totalStock === 0 ||
                (selectedPacking && selectedPacking.stock === 0) ||
                (productDetails?.packingSizes?.length > 0 && !selectedPacking)
              }
              className={`w-full py-6 text-lg font-bold rounded-xl transition-all ${
                productDetails?.totalStock === 0 ||
                (selectedPacking && selectedPacking.stock === 0) ||
                (productDetails?.packingSizes?.length > 0 && !selectedPacking)
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
              }`}
            >
              <ShoppingCart className="mr-2" size={20} />
              {productDetails?.totalStock === 0 ||
              (selectedPacking && selectedPacking.stock === 0)
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>

            {/* Share & Wishlist Icons */}
            <div className="flex gap-3 justify-center">
              <button className="p-2 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition">
                <Heart size={20} className="text-amber-600" />
              </button>
              <button className="p-2 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition">
                <Share2 size={20} className="text-amber-600" />
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-amber-200" />

        {/* BOTTOM: Detailed Info & Reviews */}
        <div className="px-6 pb-6 space-y-6">
          {/* Expandable Details Section */}
          <div className="bg-white rounded-xl border border-amber-100 overflow-hidden">
            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="w-full p-4 flex justify-between items-center hover:bg-amber-50 transition"
            >
              <h3 className="font-bold text-amber-900">📋 Product Details</h3>
              <ChevronDown
                size={20}
                className={`text-amber-600 transition-transform ${
                  expandedDetails ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedDetails && (
              <div className="px-4 pb-4 border-t border-amber-100 text-sm text-gray-600 space-y-2">
                <p>{productDetails?.description}</p>
                <div className="pt-2 text-gray-500 text-xs">
                  <p>Product ID: {productDetails?._id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-amber-900">⭐ Reviews</h3>
              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  {showReviewForm ? "Hide" : "Write a Review"}
                </button>
              )}
            </div>

            {/* Review Form - Collapsible */}
            {showReviewForm && user && (
              <div className="bg-white rounded-xl p-4 border border-amber-100 space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-amber-900">
                    Your Rating
                  </label>
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-amber-900">
                    Your Review
                  </label>
                  <textarea
                    value={reviewMsg}
                    onChange={(e) => setReviewMsg(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                    rows="3"
                  />
                </div>
                <Button
                  onClick={handleAddReview}
                  disabled={!reviewMsg.trim() || rating === 0}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-lg"
                >
                  Submit Review
                </Button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {reviews && reviews.length > 0 ? (
                reviews.slice(0, 5).map((reviewItem) => (
                  <div
                    key={reviewItem._id}
                    className="bg-white rounded-xl p-4 border border-amber-100"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10 bg-amber-200 flex-shrink-0">
                        <AvatarFallback className="bg-amber-600 text-white font-bold">
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-semibold text-amber-900 text-sm">
                              {reviewItem?.userName}
                            </p>
                            <StarRatingComponent
                              rating={reviewItem.reviewValue}
                              readOnly
                            />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-2">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-6 border border-amber-100 text-center text-gray-500">
                  <p className="text-sm">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;