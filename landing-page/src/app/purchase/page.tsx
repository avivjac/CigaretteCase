"use client";  // עמוד זה הוא Client Component

import { useRouter } from "next/navigation";

export default function PurchasePage() {
  const router = useRouter();

  return (
    <div className="landing-container">
      <div className="product-showcase">
        <h1>💳 עמוד רכישה</h1>
        <p className="description">כאן תוכל להשלים את הרכישה שלך!</p>
        <button 
          onClick={() => router.push("/")} 
          className="cta-button"
        >
          חזרה לדף הבית
        </button>
      </div>
    </div>
  );
}
