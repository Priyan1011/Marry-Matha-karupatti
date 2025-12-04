import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/Footer";

function ShoppingLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-karupatti-cream">
      {/* Header - fixed at top */}
      <ShoppingHeader />
      
      {/* Main content - grows to fill available space */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
