import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Trash2Icon, PlusIcon } from "lucide-react";

function PackingInput({ packingSizes, setPackingSizes }) {
  function handleAddPacking() {
    setPackingSizes([
      ...packingSizes,
      { size: "", price: "", salePrice: "", stock: "" },
    ]);
  }

  function handlePackingChange(index, field, value) {
    const updatedSizes = [...packingSizes];
    updatedSizes[index][field] =
      field === "price" || field === "salePrice" || field === "stock"
        ? value
          ? Number(value)
          : ""
        : value;
    setPackingSizes(updatedSizes);
  }

  function handleRemovePacking(index) {
    const updatedSizes = packingSizes.filter((_, i) => i !== index);
    setPackingSizes(updatedSizes);
  }

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="packing-section" className="text-base font-semibold">
          Packing Sizes & Pricing
        </Label>
        <Button
          type="button"
          size="sm"
          onClick={handleAddPacking}
          className="gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Size
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Add different packing sizes with individual pricing (e.g., 250g @₹300,
        500g @₹600, 1kg @₹1100)
      </p>

      {/* Column Headers */}
      {packingSizes && packingSizes.length > 0 && (
        <div className="grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-t-lg border border-b-0">
          <div className="text-xs font-semibold text-gray-700">Size</div>
          <div className="text-xs font-semibold text-gray-700">Price (₹)</div>
          <div className="text-xs font-semibold text-gray-700">Sale Price (₹)</div>
          <div className="text-xs font-semibold text-gray-700">Stock</div>
          <div className="text-xs font-semibold text-gray-700"></div>
        </div>
      )}

      <div className="space-y-2 max-h-56 overflow-auto border rounded-lg p-3 bg-gray-50">
        {packingSizes && packingSizes.length > 0 ? (
          packingSizes.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-5 gap-3 items-center p-3 bg-white border rounded-lg shadow-sm"
            >
              {/* Size Field */}
              <Input
                placeholder="e.g., 250g"
                value={item.size}
                onChange={(e) =>
                  handlePackingChange(index, "size", e.target.value)
                }
              />

              {/* Price Field */}
              <Input
                type="number"
                placeholder="300"
                value={item.price}
                onChange={(e) =>
                  handlePackingChange(index, "price", e.target.value)
                }
              />

              {/* Sale Price Field */}
              <Input
                type="number"
                placeholder="Optional"
                value={item.salePrice}
                onChange={(e) =>
                  handlePackingChange(index, "salePrice", e.target.value)
                }
              />

              {/* Stock Field */}
              <Input
                type="number"
                placeholder="100"
                value={item.stock}
                onChange={(e) =>
                  handlePackingChange(index, "stock", e.target.value)
                }
              />

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemovePacking(index)}
                className="h-10"
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-6">
            No packing sizes added yet. Click Add Size to start.
          </p>
        )}
      </div>

      {packingSizes && packingSizes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-blue-900">
            ✓ {packingSizes.length} packing size(s) configured
          </p>
          <p className="text-xs text-blue-800 mt-1">
            Customers will see these options on the product page with dynamic
            pricing
          </p>
        </div>
      )}
    </div>
  );
}

export default PackingInput;