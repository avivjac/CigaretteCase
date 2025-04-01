"use client";

import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

//connect to supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [cart, setCart] = useState<{ name: string; price: number }[]>([]);

  const [products, setProducts] = useState<
    { id: number; name: string; price: number; image_url: string }[]
  >([]);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const nextImage = () => {
    setCurrentProductIndex((prev) => (prev + 1) % products.length);
  };
  
  const prevImage = () => {
    setCurrentProductIndex((prev) => (prev - 1 + products.length) % products.length);
  };
  

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url");
  
      if (error) {
        console.error("שגיאה בשליפת מוצרים:", error.message);
      } else {
        setProducts(data);
      }
  
      // טען עגלה מה-localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCart(storedCart);
    };
  
    fetchProducts();
  }, []);
  
  const totalPrice = cart.length >= 4 ? Math.floor(cart.length / 4) * 100 + (cart.length % 4) * 30 : cart.length * 30;

  const addToCart = () => {
    if (typeof window !== "undefined" && products.length > 0) {
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const selectedProduct = products[currentProductIndex];
      const newItem = {
        name: selectedProduct.name,
        price: selectedProduct.price,
      };
      const updatedCart = [...existingCart, newItem];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  };
  
  
  

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <h1>קופסאות סיגריות</h1>
        <p className="subtitle">הגן על הסיגריות שלך עם סטייל ייחודי, עיצוב אישי וחומרים איכותיים.</p>
        <p className="highlight">עשרות לקוחות כבר רכשו והמליצו!</p>
      </header>
      
      {/* Product Showcase */}
      {products.length > 0 && (
      <div className="product-showcase">
        <div className="image-container">
          <button onClick={prevImage} className="arrow-button left">&#9665;</button>
            <img
              src={products[currentProductIndex].image_url}
              alt={products[currentProductIndex].name}
              className="product-image"
            />
          <button onClick={nextImage} className="arrow-button right">&#9655;</button>
        </div>
        <h2>{products[currentProductIndex].name}</h2>
        <p className="description">בחר מתוך מגוון רחב של עיצובים בהתאמה אישית מלאה.</p>
        <p className="price">
          מחיר ליחידה: {products[currentProductIndex].price}₪ | מבצע: 4 ב-100₪
        </p>
        <button className="add-to-cart" onClick={addToCart}>
          הוסף לעגלה
        </button>
      </div>
)}
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
        <button
          onClick={() => {
            localStorage.removeItem("cart");
            setCart([]); // נקה את הסטייט גם
          }}
        >
          נקה עגלה
        </button>

      </div>
    </div>
  );
}

