import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const getDisplayPrice = () => {
    if (product?.packingSizes && product.packingSizes.length > 0) {
      return product.price;
    }
    return product?.price;
  };

  const getDisplaySalePrice = () => {
    if (product?.packingSizes && product.packingSizes.length > 0) {
      return product.salePrice;
    }
    return product?.salePrice;
  };

  const displayPrice = getDisplayPrice();
  const displaySalePrice = getDisplaySalePrice();

  const getStockBadgeText = () => {
    if (product?.totalStock === 0) {
      return "Out Of Stock";
    } else if (product?.totalStock < 10) {
      return `Only ${product?.totalStock} left`;
    } else if (displaySalePrice > 0) {
      return "Sale";
    }
    return null;
  };

  const calculateDiscount = () => {
    if (displaySalePrice > 0 && displayPrice > 0) {
      return Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100);
    }
    return 0;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-amber-200 group hover:border-amber-400 hover:scale-[1.02]">
      <CardContent
        className="p-0 cursor-pointer relative overflow-hidden h-64 bg-gradient-to-b from-amber-50 to-amber-100"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        {/* Stock/Sale Badge */}
        {getStockBadgeText() && (
          <Badge
            className={`absolute top-3 right-3 z-10 px-3 py-1.5 font-bold shadow-lg ${
              product?.totalStock === 0
                ? "bg-red-600 hover:bg-red-700 text-white"
                : product?.totalStock < 10
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : displaySalePrice > 0
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-amber-800 hover:bg-amber-900 text-white"
            }`}
          >
            {getStockBadgeText()}
          </Badge>
        )}

        {/* Discount Badge */}
        {displaySalePrice > 0 && displayPrice > displaySalePrice && (
          <Badge className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-800 text-white font-bold shadow-lg">
            -{calculateDiscount()}%
          </Badge>
        )}

        {/* Image Container */}
        <div className="relative h-full overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Quick View Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/90 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium text-center">Quick View</p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 bg-white">
        {/* Category Tag */}
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-gradient-to-r from-amber-100 to-amber-200 rounded text-amber-800 text-xs font-semibold border border-amber-300">
            {product?.category || "Traditional"}
          </span>
        </div>

        {/* Product Title */}
        <div
          className="cursor-pointer hover:text-amber-700 transition-colors"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight min-h-[40px]">
            {product?.title}
          </h3>
        </div>

        {/* Pricing Section */}
        <div className="flex items-center gap-2 mt-1">
          {product?.packingSizes && product.packingSizes.length > 0 ? (
            <>
              <span className="text-xs text-gray-600 font-medium">From</span>
              <div className="flex items-center gap-2">
                {displaySalePrice > 0 ? (
                  <>
                    <span className="text-lg font-bold text-amber-900">
                      ₹{displaySalePrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{displayPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-amber-900">
                    ₹{displayPrice}
                  </span>
                )}
              </div>
            </>
          ) : (
            <>
              {displaySalePrice > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-900">
                    ₹{displaySalePrice}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{displayPrice}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-amber-900">
                  ₹{displayPrice}
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        {product?.totalStock === 0 ? (
          <Button
            disabled
            className="w-full bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 font-semibold py-2 rounded-lg border border-gray-300"
            variant="outline"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Restocking Soon
            </span>
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add to Basket
            </span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;