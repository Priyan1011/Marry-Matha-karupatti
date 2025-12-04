import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { verifyEmail } from "@/store/auth-slice";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        toast({
          title: "Error",
          description: "No verification token found",
          variant: "destructive",
        });
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data.success) {
          toast({
            title: "Success!",
            description: "Email verified successfully. Redirecting to login...",
          });
          setTimeout(() => {
            navigate("/auth/login");
          }, 2000);
        } else {
          toast({
            title: "Verification Failed",
            description:
              data.message || "Token expired or invalid. Please register again.",
            variant: "destructive",
          });
          setTimeout(() => {
            navigate("/auth/register");
          }, 3000);
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmailToken();
  }, [token, dispatch, navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Complete!
            </h1>
            <p className="text-gray-600 mb-4">
              You will be redirected shortly. If not, click the link below.
            </p>
            <a
              href="/auth/login"
              className="text-primary font-semibold hover:underline"
            >
              Go to Login â†’
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;