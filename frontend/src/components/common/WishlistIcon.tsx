"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/cartContext";

function WishlistIcon({
  color = "#8B1D3F",
  userLoggedIn,
  isLink = true,
}: {
  color?: string;
  userLoggedIn: boolean;
  isLink?: boolean;
}) {
  const { wishlistCount } = useWishlist();

  const content = (
    <>
      <Heart
        strokeWidth={1.3}
        color={color}
        className="w-5 h-5 md:w-7 md:h-7 cursor-pointer hover:opacity-60 transition-all duration-200"
      />

      {/* ✅ show badge if wishlistCount > 0 */}
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded-full text-white bg-red-600 min-w-[14px] text-center">
          {wishlistCount}
        </span>
      )}
    </>
  );

  if (!isLink) {
    return (
      <div className="relative inline-flex items-center justify-center p-1">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={userLoggedIn ? "/wishlist" : "/login"}
      className="relative inline-flex items-center justify-center p-1"
      aria-label="Wishlist"
    >
      {content}
    </Link>
  );
}

export default WishlistIcon;
