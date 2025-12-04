import { StarIcon } from "lucide-react";

import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange }) {
  console.log(rating, "rating");
  
  return [1, 2, 3, 4, 5].map((star) => (
    <Button
      key={star}
      variant="ghost"
      size="icon"
      onClick={() => handleRatingChange(star)}
    >
      <StarIcon
        className={`w-6 h-6 ${
          star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-200"
        }`}
      />
    </Button>
  ));
}

export default StarRatingComponent;
