"use client";
import Link from "next/link";
import { Handbag } from "lucide-react";
import { useCart } from "@/context/cartContext";

function CartIcon({
  color = "#8B1D3F",
  isLink = true,
}: {
  color?: string;
  isLink?: boolean;
}) {
  const { cartCount } = useCart();

  const content = (
    <>
      <Handbag
        strokeWidth={1.3}
        color={color}
        className="w-5 h-5 md:w-7 md:h-7 cursor-pointer hover:opacity-60 transition-all duration-200"
      />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded-full text-white bg-red-600 min-w-[14px] text-center">
          {cartCount}
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
      href="/cart"
      className="relative inline-flex items-center justify-center p-1"
      aria-label="Cart"
    >
      {content}
    </Link>
  );
}

export default CartIcon;
