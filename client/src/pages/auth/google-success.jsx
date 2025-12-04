import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAuth } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { guestCartUtils } from "@/utils/guestCart";
import { cartMerger } from "@/utils/cartMerger";

function GoogleSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        // Verify authentication
        const authResult = await dispatch(checkAuth());
        
        if (authResult.payload?.success) {
          const user = authResult.payload.user;
          
          toast({
            title: "Success!",
            description: "Logged in with Google successfully",
          });

          // Get guest cart items
          const guestCart = guestCartUtils.getGuestCart();
          
          // Merge guest cart if items exist
          if (guestCart.length > 0) {
            setTimeout(() => {
              cartMerger
                .mergeCarts(guestCart, user.id, dispatch)
                .then(() => {
                  // Refresh cart items after merge
                  dispatch(fetchCartItems(user.id));
                  
                  toast({
                    title: "Cart Merged",
                    description: `${guestCart.length} item${guestCart.length > 1 ? "s" : ""} added to your cart`,
                  });
                })
                .catch((error) => {
                  console.error("Cart merge failed:", error);
                });
            }, 500);
          }

          // Get redirect destination
          const redirectPath = sessionStorage.getItem("redirectAfterLogin") || 
                              (user?.role === "admin" ? "/admin/dashboard" : "/shop/home");
          sessionStorage.removeItem("redirectAfterLogin");

          // Redirect after short delay
          setTimeout(() => {
            navigate(redirectPath);
          }, 1000);
        } else {
          throw new Error("Authentication failed");
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast({
          title: "Login Failed",
          description: "Google login failed. Please try again",
          variant: "destructive",
        });
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      }
    };

    handleGoogleLogin();
  }, [dispatch, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Completing Google Login...
        </h1>
        <p className="text-gray-600">
          Please wait while we sign you in with Google.
        </p>
      </div>
    </div>
  );
}

export default GoogleSuccess;