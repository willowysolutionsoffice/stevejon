"use client";

import React, { useState, useEffect } from "react";
import { Star, User, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

type Review = {
  id: string;
  userName: string;
  userImage?: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export default function ProductReviews({ 
  reviews, 
  productId 
}: { 
  reviews: Review[], 
  productId: string 
}) {
  const [showForm, setShowForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  useEffect(() => {
    async function checkPurchase() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`);
        const data = await res.json();
        setCanReview(data.canReview);
      } catch (error) {
        // finished checking
      }
    }
    checkPurchase();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Thank you for your review!");
      
      // Update local state to show the new review immediately
      const newReview: Review = {
        id: data.id,
        userName: data.user.name,
        userImage: data.user.image,
        rating: data.rating,
        comment: data.comment,
        createdAt: data.createdAt,
      };

      setLocalReviews([newReview, ...localReviews]);
      setShowForm(false);
      setCanReview(false); // Can't review again
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = localReviews.length > 0 
    ? localReviews.reduce((acc, r) => acc + r.rating, 0) / localReviews.length 
    : 0;

  return (
    <div className="border-t pt-10 mt-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Customer Reviews</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={s <= Math.round(averageRating) ? "text-amber-500 fill-amber-500" : "text-gray-200"}
                />
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500 font-medium">({localReviews.length} Verified Reviews)</span>
          </div>
        </div>
        
        {canReview && !showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 active:scale-95"
          >
            WRITE A REVIEW
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-12 bg-stone-50 p-6 md:p-8 rounded-3xl border border-stone-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-gray-900">Share Your Experience</h4>
            <button 
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-stone-700 ml-1">Rating</label>
                <div className="flex gap-2 p-3 bg-white border border-stone-200 rounded-2xl items-center justify-center md:justify-start">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={24}
                        className={star <= rating ? "text-amber-500 fill-amber-500" : "text-stone-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700 ml-1">Your Remark</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product?"
                rows={4}
                className="w-full px-5 py-3.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-stone-800 bg-white resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold text-lg hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Review
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {!localReviews || localReviews.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium italic">No reviews yet for this product. {canReview ? "Be the first to share your experience!" : ""}</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {localReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {review.userImage ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm font-bold">
                      <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{review.userName}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={s <= review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verified Purchase</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed pl-1">
                  &quot;{review.comment}&quot;
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
