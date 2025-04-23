"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
 
//database connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

//main function
export default function PurchasePage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<
    { id: number; name: string; price: number; image_url: string; quantity: number }[]
  >([]);
  const [cart, setCart] = useState<{
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
  }[]>([]);  

  //modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  //form states
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  
  

  //remove item button
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    recalculateTotal(updatedCart);
  };
  
  //update quantity button
  const updateQuantity = (id: number, newQty: number) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    recalculateTotal(updatedCart);
  };

  //recalculate total price based on quantity
  const recalculateTotal = (items: typeof cartItems) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
    const setsOf4 = Math.floor(totalItems / 4);
    const remainder = totalItems % 4;
    const calculatedTotal = setsOf4 * 100 + remainder * 30;
  
    setTotal(calculatedTotal);
  };
  
  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const calculateTotal = () => {
    const totalItems = getTotalQuantity();
    const setsOf4 = Math.floor(totalItems / 4);
    const remainder = totalItems % 4;
    return setsOf4 * 100 + remainder * 30;
  };

  const [total, setTotal] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send email using nodemailer
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, address }),
    });

    // Update the database with the order details
    const resSQL = await fetch("/api/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartItems,
        fullName,
        address,
        email,
      }),
    });
  
    const result = await res.json();
    if (result.success) {
      alert("המייל נשלח בהצלחה!");
      setShowPaymentModal(false);
    } else {
      alert("שגיאה בשליחה");
    }
  };
    
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
    recalculateTotal(storedCart);
  }, []);
  

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);         // נקה גם את הסטייט כדי לעדכן את המסך
    setTotal(0);
  };

  return (
    <div className="landing-container">
      <div className="sticky-cart-header">
        <div className="cart-info">
          <div className="cart-badge-wrapper">
            <span>🛒</span>
            <span className="cart-badge">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span>💸 סך הכול: {total}₪</span>
        </div>
      </div>

      <div className="product-showcase">
        <h1>💳 עמוד רכישה</h1>
        <p className="description">כאן תוכל להשלים את הרכישה שלך!</p>

        <h2>סה"כ לתשלום: {total} ₪</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>מוצר</th>
              <th>תמונה</th>
              <th>כמות</th>
              <th>מחיר ליחידה</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <img src={item.image_url} alt={item.name} style={{ width: "50px", borderRadius: "8px" }} />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    style={{ width: "50px", textAlign: "center" }}
                  />
                </td>
                <td>{item.price * item.quantity} ₪</td>
                <td>
                  <button onClick={() => removeItem(item.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cta-container"/* modal for payment */> 
          <button
           onClick={() => setShowPaymentModal(true)} 
           className="cta-button"
          >
            <span>💳 שלם</span>
          </button>
          {showPaymentModal && (
            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>📝 פרטי ההזמנה</h2>
                <form className="checkout-form" onSubmit={(e) => {
                  handleSubmit(e); // backend function
                }}>
                  <input type="text" placeholder="שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <input type="text" placeholder="כתובת" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div style={{ marginTop: "10px" }}>
                    <button type="submit" className="cta-button">שלח הזמנה</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <button 
            onClick={() => router.push("/")} 
            className="cta-button"
          >
            חזרה לדף הבית
          </button>

          <button 
            className="clear-cart-button" 
            onClick={clearCart}
          >
            נקה עגלה
          </button>
        </div>
      </div>
    </div>
  );
}
