import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import PackingInput from "@/components/admin-view/packing-input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [packingSizes, setPackingSizes] = useState([]);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const calculateVariantStats = () => {
    if (!packingSizes || packingSizes.length === 0) {
      return {
        totalStock: 0,
        lowestPrice: 0,
        hasSaleTag: false,
      };
    }

    const totalStock = packingSizes.reduce(
      (sum, packing) => sum + (parseInt(packing.stock) || 0),
      0
    );

    const prices = packingSizes
      .map((p) => {
        const salePrice = parseInt(p.salePrice);
        const price = parseInt(p.price);
        return !isNaN(salePrice) && salePrice > 0 ? salePrice : price;
      })
      .filter((p) => !isNaN(p));

    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

    const hasSaleTag = packingSizes.some(
      (p) => parseInt(p.salePrice) > 0 && parseInt(p.salePrice) < parseInt(p.price)
    );

    return {
      totalStock,
      lowestPrice,
      hasSaleTag,
    };
  };

  const variantStats = calculateVariantStats();

  function onSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Product title is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Product description is required",
        variant: "destructive",
      });
      return;
    }

    if (packingSizes.length === 0) {
      toast({
        title: "Add at least one packing size",
        variant: "destructive",
      });
      return;
    }

    for (let packing of packingSizes) {
      if (!packing.size || !packing.price || packing.stock === "") {
        toast({
          title: "All packing sizes must have size, price, and stock",
          variant: "destructive",
        });
        return;
      }
    }

    const computedTotalStock = variantStats.totalStock;

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: {
            ...formData,
            totalStock: computedTotalStock,
          },
          packingSizes,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setPackingSizes([]);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          toast({
            title: "Product updated successfully",
          });
        }
      });
    } else {
      dispatch(
        addNewProduct({
          ...formData,
          image: uploadedImageUrl,
          totalStock: computedTotalStock,
          packingSizes,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setPackingSizes([]);
          toast({
            title: "Product added successfully",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

  function isFormValid() {
    return (
      formData.title.trim() &&
      formData.category &&
      formData.description.trim() &&
      uploadedImageUrl &&
      packingSizes.length > 0 &&
      packingSizes.every((p) => p.size && p.price && p.stock)
    );
  }

  function handleSheetClose() {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setPackingSizes([]);
    setUploadedImageUrl("");
    setImageFile(null);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>

      <Sheet open={openCreateProductsDialog} onOpenChange={handleSheetClose}>
        <SheetContent side="right" className="overflow-auto w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {currentEditedId !== null
                ? "Update product details and packing sizes below"
                : "Add a new karupatti product to your inventory"}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={onSubmit} className="space-y-8 mt-6">
            {/* ========== SECTION 1: PRODUCT INFORMATION ========== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                  1
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h2>
              </div>

              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
              />

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Product Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter product title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="handcrafted">Handcrafted</option>
                    <option value="block">Palm Jaggery</option>
                    <option value="palmkalkandu">Palm Kalkandu</option>
                    <option value="powder">Powder</option>
                    <option value="syrup">Syrup</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter product description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* ========== SECTION 2: PACKING SIZES & PRICING ========== */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                  2
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Packing Sizes & Pricing
                </h2>
              </div>

              <PackingInput
                packingSizes={packingSizes}
                setPackingSizes={setPackingSizes}
              />

              {packingSizes.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    📊 Auto-Calculated Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded p-3 border border-blue-100">
                      <p className="text-xs text-gray-600 font-medium">
                        Total Stock
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        {variantStats.totalStock}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">units</p>
                    </div>

                    <div className="bg-white rounded p-3 border border-blue-100">
                      <p className="text-xs text-gray-600 font-medium">
                        Lowest Price
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        ₹{variantStats.lowestPrice}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">starting</p>
                    </div>

                    <div className="bg-white rounded p-3 border border-blue-100">
                      <p className="text-xs text-gray-600 font-medium">
                        Sale Tag
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          variantStats.hasSaleTag
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {variantStats.hasSaleTag ? "✓ Yes" : "✗ No"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">discounts</p>
                    </div>
                  </div>
                </div>
              )}

              {packingSizes.length === 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">
                    ⚠ Add at least one packing size before saving
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* ========== SUBMIT BUTTON ========== */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSheetClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid()}
                className="flex-1"
              >
                {currentEditedId !== null ? "Update Product" : "Add Product"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;