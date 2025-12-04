import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-karupatti-border overflow-hidden">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-karupatti-brown to-karupatti-brownDark p-6">
        <h2 className="text-2xl font-serif font-bold text-white">Filters</h2>
        <p className="text-karupatti-cream text-sm mt-1">Refine your selection</p>
      </div>

      <div className="p-6 space-y-6">
        {/* ONLY Category Filter - Brand Section Removed */}
        {Object.keys(filterOptions).map((keyItem) => {
          // Skip brand filter completely
          if (keyItem === "brand") return null;
          
          return (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-lg font-serif font-bold text-karupatti-brownDark mb-4 capitalize">
                  {keyItem}
                </h3>
                <div className="space-y-3">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-karupatti-cream transition-colors group"
                      key={option.id}
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      <span className="text-base font-medium text-karupatti-brown group-hover:text-karupatti-brownDark transition-colors">
                        {option.label}
                      </span>
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProductFilter;
