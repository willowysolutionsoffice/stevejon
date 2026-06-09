"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "@/context/cartContext";
import { authClient } from "@/lib/auth-client";

export const LogoutDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
    const router = useRouter()
  const { updateCartCount } = useCart();

const handleLogout = async () => {
  try {
    await authClient.signOut();

    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    updateCartCount();
    toast.success("Logged out successfully");
    router.replace("/dashboard-login");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Failed to logout");
  }
};

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be redirected to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
