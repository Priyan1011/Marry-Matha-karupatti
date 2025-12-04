import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";  // Add this

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Add this

  function handleLogout() {
    dispatch(logoutUser())
      .then(() => {
        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("persist:root");
        
        // Redirect to the CORRECT login page: /auth/login
        navigate("/auth/login");
        
        // Optional: Force reload to clear all state
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 100);
      })
      .catch(() => {
        // Even on error, redirect to login
        navigate("/auth/login");
      });
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
        >
          <AlignJustify className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </header>
  );
}

export default AdminHeader;