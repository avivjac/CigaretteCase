"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
        {/* <div className="cart-actions">
          <button className="cta-button small" onClick={() => router.push("/purchase")}>קנה עכשיו</button>
          <button className="clear-cart-button" onClick={() => {
            localStorage.removeItem("cart");
            setCart([]);
          }}>נקה עגלה</button>
        </div> */}
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
      <th>סה"כ</th>
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


        <div className="cta-container">
          <button
           //onClick={} payment gateway
           className="cta-button"
          >
            <span>💳 שלם</span>
          </button>
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
