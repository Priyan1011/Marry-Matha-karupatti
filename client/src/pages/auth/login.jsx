import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { guestCartUtils } from "@/utils/guestCart";
import { cartMerger } from "@/utils/cartMerger";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { error } = useSelector((state) => state.auth);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleGoogleLogin() {
    setIsSubmitting(true);

    // Store redirect destination
    if (location.state?.from) {
      sessionStorage.setItem("redirectAfterLogin", location.state.from);
    } else {
      sessionStorage.setItem("redirectAfterLogin", "/shop/home");
    }

    // Store guest cart before redirect
    const guestCart = guestCartUtils.getGuestCart();
    if (guestCart.length > 0) {
      sessionStorage.setItem("pendingGoogleCart", JSON.stringify(guestCart));
    }

    // Build redirect URI based on current origin (dev or prod)
    const redirectUri = `${window.location.origin}/auth/google-success`;

    // Redirect to Google OAuth endpoint with redirect_uri
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  }

  function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Get guest cart before login
    const guestCart = guestCartUtils.getGuestCart();

    // Check for pending cart from registration
    const pendingCart = JSON.parse(
      sessionStorage.getItem("pendingGuestCart") || "[]"
    );

    // Combine both cart sources
    const allGuestItems = [...guestCart, ...pendingCart];

    // If remember me is checked, store email in localStorage
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    dispatch(loginUser(formData)).then((data) => {
      setIsSubmitting(false);

      if (data?.payload?.success) {
        toast({
          title: "Success",
          description: data?.payload?.message,
        });

        // Merge guest cart with user cart if items exist
        if (allGuestItems.length > 0) {
          // Small delay to ensure user is fully authenticated
          setTimeout(() => {
            cartMerger
              .mergeCarts(allGuestItems, data?.payload?.user?.id, dispatch)
              .then(() => {
                // Refresh cart items after successful merge
                dispatch(fetchCartItems(data?.payload?.user?.id));

                // Clear pending cart from session storage
                sessionStorage.removeItem("pendingGuestCart");

                toast({
                  title: "Cart Merged",
                  description: `${allGuestItems.length} item${
                    allGuestItems.length > 1 ? "s" : ""
                  } merged to your account`,
                });
              })
              .catch((error) => {
                console.error("Cart merge failed:", error);
                toast({
                  title: "Warning",
                  description: "Cart merge had issues, but you're logged in",
                  variant: "destructive",
                });
              });
          }, 500);
        }

        // Check if user was redirected from checkout
        const fromCheckout = location.state?.from === "/shop/checkout";

        if (fromCheckout) {
          // Redirect to checkout with user info
          setTimeout(() => {
            navigate("/shop/checkout");
          }, 1000);
        } else {
          // Default redirect after login
          setTimeout(() => {
            navigate("/shop/home");
          }, 1000);
        }
      } else {
        // Handle specific error messages
        const errorMessage =
          data?.payload?.message || error || "Login failed. Please try again";

        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });

        // Clear password for security
        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      }
    });
  }

  // Load remembered email on component mount
  const handleEmailFieldClick = () => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: remembered,
      }));
      setRememberMe(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
      </div>

      <CommonForm
        handleSubmit={onSubmit}
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        buttonText={isSubmitting ? "Signing in..." : "Sign in"}
        isBtnDisabled={isSubmitting}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20"></span>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Remember me
          </label>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          className="font-semibold text-foreground underline-offset-4 hover:underline"
          to="/auth/register"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
