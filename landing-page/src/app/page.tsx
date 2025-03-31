"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const images = [
  "/img/IMG_2087.jpeg",
  "/img/IMG-20250330-WA0024.jpg",
  "/img/IMG-20250330-WA0025.jpg",
  "/img/IMG-20250330-WA0027.jpg",
];

export default function Home() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [cart, setCart] = useState([]);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const addToCart = () => {
    setCart((prevCart) => [...prevCart, { id: currentImage, price: 30 }]);
  };

  const totalPrice = cart.length >= 4 ? Math.floor(cart.length / 4) * 100 + (cart.length % 4) * 30 : cart.length * 30;

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <h1>קופסאות סיגריות</h1>
        <p className="subtitle">הגן על הסיגריות שלך עם סטייל ייחודי, עיצוב אישי וחומרים איכותיים.</p>
        <p className="highlight">עשרות לקוחות כבר רכשו והמליצו!</p>
      </header>
      
      {/* Product Showcase */}
      <div className="product-showcase">
        <div className="image-container">
          <button onClick={prevImage} className="arrow-button left">&#9665;</button>
          <img src={images[currentImage]} alt="תמונת מוצר" className="product-image" />
          <button onClick={nextImage} className="arrow-button right">&#9655;</button>
        </div>
        <h2>מבחר עיצובים חדשניים</h2>
        <p className="description">בחר מתוך מגוון רחב של עיצובים או צור את הקופסה הייחודית שלך בהתאמה אישית מלאה.</p>
        <p className="price">מחיר ליחידה: 30₪ | מבצע: 4 ב-100₪</p>
        <button className="add-to-cart" onClick={addToCart}>הוסף לעגלה</button>
      </div>

      {/* Call to Action */}
      <div className="cta-container">
        <button 
          className="cta-button"
          onClick={() => router.push("/purchase")}>
            הזמן עכשיו
          </button>
        <p className="shipping-info">משלוח חינם בכל הזמנה מעל 199₪</p>
      </div>
      {/* Cart Summary */}
      <div className="cart-summary">
        <h3>פריטים בעגלה: {cart.length}</h3>
        <p>מחיר כולל: {totalPrice}₪</p>
      </div>
    </div>
  );
}
