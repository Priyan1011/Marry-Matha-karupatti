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
      // Store default redirect
      sessionStorage.setItem("redirectAfterLogin", "/shop/home");
    }

    // Store guest cart before redirect
    const guestCart = guestCartUtils.getGuestCart();
    if (guestCart.length > 0) {
      sessionStorage.setItem("pendingGoogleCart", JSON.stringify(guestCart));
    }

    // Redirect to Google OAuth endpoint (backend handles callback)
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
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
          data?.payload?.message ||
          error ||
          "Login failed. Please try again";

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
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Login to your Karupatti Shop account
        </p>
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-input rounded-md font-medium text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={handleEmailFieldClick}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border border-input"
            disabled={isSubmitting}
          />
          <label htmlFor="rememberMe" className="text-sm cursor-pointer">
            Remember me for 30 days
          </label>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Logging in..." : "Login with Email"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            New to Karupatti?
          </span>
        </div>
      </div>

      <Link
        to="/auth/register"
        className="w-full flex items-center justify-center px-4 py-2 border border-input rounded-md font-medium text-sm hover:bg-accent"
      >
        Create an account with email
      </Link>
    </div>
  );
}

export default AuthLogin;
