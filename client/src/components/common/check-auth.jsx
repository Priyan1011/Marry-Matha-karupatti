import { Navigate, useLocation } from "react-router-dom"; // Make sure this import exists

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log("Auth Check:", location.pathname, isAuthenticated);

  // Routes that ALWAYS require authentication
  const protectedRoutes = [
    "/shop/checkout",
    "/shop/account",
    "/admin/dashboard",
    "/admin/products", 
    "/admin/orders",
    "/admin/features"
  ];

  // Routes that should redirect to home if already authenticated
  const authRoutes = [
    "/auth/login",
    "/auth/register"
  ];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    location.pathname.includes(route)
  );

  // Check if current route is auth route (login/register)
  const isAuthRoute = authRoutes.some(route => 
    location.pathname.includes(route)
  );

  // If user tries to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    // For checkout, redirect to login but remember the intended destination
    if (location.pathname.includes("/shop/checkout")) {
      return <Navigate to="/auth/login" state={{ from: location.pathname }} />;
    }
    // For other protected routes (admin, account), redirect to home
    return <Navigate to="/shop/home" />;
  }

  // If user is authenticated but tries to access login/register
  if (isAuthenticated && isAuthRoute) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  // Admin role restrictions
  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("shop") && !location.pathname.includes("admin")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Default root path redirect
  if (location.pathname === "/") {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        return <Navigate to="/admin/dashboard" />;
      } else {
        return <Navigate to="/shop/home" />;
      }
    } else {
      // Guest users go directly to home page
      return <Navigate to="/shop/home" />;
    }
  }

  return <>{children}</>;
}

export default CheckAuth;