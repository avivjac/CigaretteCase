"use client";  // עמוד זה הוא Client Component

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PurchasePage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    // חישוב מחיר כולל לפי מבצע: 4 ב-100, כל יחידה אחרת ב-30
    const count = storedCart.length;
    const setsOf4 = Math.floor(count / 4);
    const remainder = count % 4;
    const calculatedTotal = setsOf4 * 100 + remainder * 30;

    setTotal(calculatedTotal);
  }, []);

  return (
    <div className="landing-container">
      <div className="product-showcase">
        <h1>💳 עמוד רכישה</h1>
        <p className="description">כאן תוכל להשלים את הרכישה שלך!</p>
        <h2>סה"כ לתשלום: {total} ₪</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
           {cartItems.map((item, index) => (
              <li key={index}>
                {/* {item.name} - {item.price} ₪ */}
              </li>
            ))}
          </ul>
        <button 
          onClick={() => router.push("/")} 
          className="cta-button"
        >
          חזרה לדף הבית
        </button>
        <button onClick={() => localStorage.removeItem("cart")}>
          נקה עגלה
        </button>
      </div>
    </div>
  );
}
