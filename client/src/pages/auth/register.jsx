import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { guestCartUtils } from "@/utils/guestCart";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",  // â† ADDED THIS
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function onSubmit(event) {
    event.preventDefault();

    // Validation
    if (!formData.userName.trim()) {
      toast({
        title: "Error",
        description: "Please enter username",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter email",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password) {
      toast({
        title: "Error",
        description: "Please enter password",
        variant: "destructive",
      });
      return;
    }

    if (!formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please confirm password",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Get guest cart before registration
    const guestCart = guestCartUtils.getGuestCart();

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Success",
          description: data?.payload?.message,
        });

        // Save guest cart info to session storage to merge after login
        if (guestCart.length > 0) {
          sessionStorage.setItem("pendingGuestCart", JSON.stringify(guestCart));
          toast({
            title: "Cart Saved",
            description: `Your ${guestCart.length} cart item${
              guestCart.length > 1 ? "s" : ""
            } will be merged after login`,
          });
        }

        // Redirect to login page
        navigate("/auth/login");
      } else {
        toast({
          title: "Registration Failed",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join Karupatti Shop today
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="userName" className="text-sm font-medium">
            Username
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            placeholder="choose a username"
            value={formData.userName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

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
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Must be 8+ characters with uppercase, lowercase, and number
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90"
        >
          Create Account
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>

      <Link
        to="/auth/login"
        className="w-full flex items-center justify-center px-4 py-2 border border-input rounded-md font-medium text-sm hover:bg-accent"
      >
        Sign In
      </Link>
    </div>
  );
}

export default AuthRegister;