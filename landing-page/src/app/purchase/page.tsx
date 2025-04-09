"use client";  // עמוד זה הוא Client Component

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function PurchasePage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);

    // חישוב מחיר כולל לפי מבצע: 4 ב-100, כל יחידה אחרת ב-30
    const count = storedCart.length;
    const setsOf4 = Math.floor(count / 4);
    const remainder = count % 4;
    const calculatedTotal = setsOf4 * 100 + remainder * 30;

    const total = cartItems.length >= 4
    ? Math.floor(cartItems.length / 4) * 100 + (cartItems.length % 4) * 30
    : cartItems.length * 30;


    setTotal(calculatedTotal);
  }, []);

  return (
    <div className="landing-container">
      <div className="product-showcase">
        <h1>💳 עמוד רכישה</h1>
        <p className="description">כאן תוכל להשלים את הרכישה שלך!</p>
        <h2>סה"כ לתשלום: {total} ₪</h2>
        <table className="cart-table">
          <thead>
            <tr>
              <th>מוצר</th>
              <th>מחיר</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button 
          onClick={() => router.push("/")} 
          className="cta-button"
        >
          חזרה לדף הבית
        </button>
        <button className="clear-cart-button-body" onClick={() => {
            localStorage.removeItem("cart");
            setCart([]);
          }}>נקה עגלה</button>
      </div>
    </div>
  );
}
