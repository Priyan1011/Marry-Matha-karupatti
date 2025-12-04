import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import logo from "@/assets/logo.png";
import { guestCartUtils } from "@/utils/guestCart"; // Add this import

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "about" && 
      getCurrentMenuItem.id !== "contact" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center lg:justify-center gap-8 lg:flex-row lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-lg font-bold cursor-pointer text-karupatti-brown hover:text-karupatti-accent transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    } else {
      // Load guest cart for non-authenticated users
      dispatch(fetchCartItems(null));
    }
  }, [dispatch, user]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        
<Button
  onClick={() => setOpenCartSheet(true)}
  variant="outline"
  size="icon"
  className="relative"
>
  <ShoppingCart className="w-6 h-6" />
  <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
    {isAuthenticated 
      ? (cartItems?.items?.length || 0)
      : guestCartUtils.getGuestCartCount()
    }
  </span>
  <span className="sr-only">User cart</span>
</Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")}>
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // Show login/signup buttons for guest users
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/auth/login")}
            className="text-karupatti-brown border-karupatti-brown hover:bg-karupatti-brown hover:text-white"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/auth/register")}
            className="bg-karupatti-brown hover:bg-karupatti-brownDark text-white"
          >
            Sign Up
          </Button>
        </div>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-karupatti-cream">
      <div className="flex h-20 items-center justify-between px-4 md:px-6 relative">
        {/* Logo + Brand Name */}
        <Link to="/shop/home" className="flex items-center gap-4">
          <img
            src={logo}
            alt="Marry Matha Karupatti Logo"
            className="w-20 h-20 md:w-22 md:h-22 object-contain flex-shrink-0"
          />
          <div className="flex flex-col justify-center leading-none">
            <span className="font-serif font-normal text-xl md:text-2xl text-karupatti-brownDark tracking-tight">
              Marry Matha
            </span>
            <span className="font-serif font-normal text-xl md:text-2xl text-karupatti-brownDark tracking-tight">
              Karupatti
            </span>
          </div>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right Side Content */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;