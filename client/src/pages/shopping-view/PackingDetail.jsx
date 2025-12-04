import { useParams, useNavigate } from "react-router-dom";
import { packingMethods } from "@/data/packing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

function PackingDetail() {
  const { packingId } = useParams();
  const navigate = useNavigate();

  // Find the packing method by ID
  const packing = packingMethods.find((p) => p.id === packingId);

  // If packing not found, show error
  if (!packing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-karupatti-cream">
        <h1 className="text-2xl font-bold text-karupatti-brownDark mb-4">
          Packing method not found
        </h1>
        <Button onClick={() => navigate("/shop/home")} className="bg-karupatti-accent hover:bg-karupatti-accentHover">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-karupatti-cream">
      {/* Header with Back Button */}
      <div className="bg-karupatti-creamDark border-b border-karupatti-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/shop/home")}
            className="text-karupatti-brown hover:text-karupatti-accent hover:bg-karupatti-creamDark"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="aspect-square rounded-2xl shadow-2xl overflow-hidden bg-white border-4 border-karupatti-border">
                <img
                  src={packing.image}
                  alt={packing.label}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-karupatti-brownDark mb-2">
                {packing.label}
              </h1>
              <p className="text-lg text-karupatti-brownLight italic">
                {packing.shortDesc}
              </p>
            </div>

            <div className="bg-karupatti-white rounded-lg p-6 border border-karupatti-border shadow-md">
              <h2 className="text-xl font-bold text-karupatti-brownDark mb-3">
                About This Packing
              </h2>
              <p className="text-karupatti-brown leading-relaxed">
                {packing.fullDesc}
              </p>
            </div>

            <div className="bg-karupatti-creamDark rounded-lg p-6 border border-karupatti-border">
              <h3 className="text-lg font-bold text-karupatti-brownDark mb-3 flex items-center">
                <span className="bg-karupatti-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                  ✓
                </span>
                Best For
              </h3>
              <p className="text-karupatti-brown font-medium">
                {packing.bestFor}
              </p>
            </div>

            <div className="bg-karupatti-white rounded-lg p-6 border border-karupatti-border shadow-md">
              <h3 className="text-lg font-bold text-karupatti-brownDark mb-4">
                Key Features
              </h3>
              <ul className="space-y-3">
                {packing.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-karupatti-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-karupatti-brown">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => navigate("/shop/listing")}
                className="w-full bg-karupatti-accent hover:bg-karupatti-accentHover text-white font-bold py-6 text-lg"
              >
                Browse Products with This Packing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PackingDetail;
