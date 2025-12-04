import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { packingMethods } from "@/data/packing";

// Category data with real product images
const categoriesWithImage = [
  { id: "handcrafted", label: "Handcrafted", image: "/images/Palm Handcrafted.jpg" },
  { id: "block", label: "Palm Jaggery", image: "/images/palm jaggery.jpg" },
  { id: "kalkandu", label: "Palm Kalkandu", image: "/images/plam kalkandu.jpg" },
  { id: "powder", label: "Powder", image: "/images/powders.png" },
  { id: "syrup", label: "Syrup", image: "/images/syrup.jpg" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-karupatti-cream">
      {/* Hero/Banner Section - Mobile responsive */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] overflow-hidden bg-gradient-to-b from-karupatti-creamDark to-karupatti-cream">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                alt={`Banner ${index + 1}`}
              />
            ))
          : null}
        {/* Navigation buttons - hidden on very small screens */}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-karupatti-white/90 hover:bg-karupatti-accent hover:text-white border-karupatti-border transition-all hidden xs:flex"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-karupatti-white/90 hover:bg-karupatti-accent hover:text-white border-karupatti-border transition-all hidden xs:flex"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Shop by Category - Mobile responsive */}
      <section className="py-8 sm:py-10 md:py-12 bg-karupatti-creamDark">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center mb-6 sm:mb-8 text-karupatti-brownDark tracking-tight">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {categoriesWithImage.map((categoryItem) => (
              <div
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 rounded-full shadow-lg mb-2 sm:mb-3 md:mb-4 overflow-hidden bg-white border-2 border-karupatti-border group-hover:border-karupatti-accent transition-all duration-300 group-hover:shadow-xl">
                    <img 
                      src={categoryItem.image} 
                      alt={categoryItem.label} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-bold text-karupatti-brown text-center text-sm sm:text-base md:text-lg lg:text-xl group-hover:text-karupatti-accent transition-colors px-1">
                    {categoryItem.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Packing - Mobile responsive */}
      <section className="py-8 sm:py-10 md:py-12 bg-karupatti-cream">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center mb-6 sm:mb-8 text-karupatti-brownDark tracking-tight">
            Shop by Packing
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {packingMethods.map((packItem) => (
              <div
                key={packItem.id}
                onClick={() => navigate(`/shop/packing/${packItem.id}`)}
                className="cursor-pointer group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-56 lg:h-56 rounded-full shadow-lg mb-2 sm:mb-3 md:mb-4 overflow-hidden bg-white border-2 border-karupatti-border group-hover:border-karupatti-accent transition-all duration-300 group-hover:shadow-xl">
                    <img 
                      src={packItem.image} 
                      alt={packItem.label} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="font-bold text-karupatti-brown text-center text-sm sm:text-base md:text-lg lg:text-xl group-hover:text-karupatti-accent transition-colors px-1">
                    {packItem.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Products Section - Mobile responsive */}
      <section className="py-8 sm:py-10 md:py-12 bg-karupatti-creamDark">
        <div className="container mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-center mb-6 sm:mb-8 text-karupatti-brownDark tracking-tight">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem?._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;