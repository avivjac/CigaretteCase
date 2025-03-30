"use client";  // עמוד זה הוא Client Component

import { useRouter } from "next/navigation";

export default function PurchasePage() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>💳 עמוד רכישה</h1>
      <p>כאן תוכל להשלים את הרכישה שלך!</p>
      <button 
        onClick={() => router.push("/")} 
        style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}
      >
        חזרה לדף הבית
      </button>
    </div>
  );
}
