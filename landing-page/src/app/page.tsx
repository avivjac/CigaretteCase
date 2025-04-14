"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

//database connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<
    { id: number; name: string; price: number; stock: number; image_url: string }[]
  >([]);
  const [cart, setCart] = useState<{
    id: number;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
  }[]>([]);  
  const badgeRef = useRef<HTMLSpanElement>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("שגיאה בשליפת מוצרים:", error.message);
      } else {
        setProducts(data);
      }
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const normalizedCart = storedCart.map((item: any) => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCart(normalizedCart);
    };

    fetchProducts();
  }, []);


  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  const calculateTotal = () => {
    const totalItems = getTotalQuantity();
    const setsOf4 = Math.floor(totalItems / 4);
    const remainder = totalItems % 4;
    return setsOf4 * 100 + remainder * 30;
  };
  
  const totalPrice =
    cart.length >= 4
      ? Math.floor(cart.length / 4) * 100 + (cart.length % 4) * 30
      : cart.length * 30;

  const addToCart = (product: any) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  
    const existingItemIndex = existingCart.findIndex(
      (item: any) => item.id === product.id
    );
  
    let updatedCart;
  
    if (existingItemIndex !== -1) {
      updatedCart = [...existingCart];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      };
      updatedCart = [...existingCart, newItem];
    }
  
    // ✅ שמירה בפועל!
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  
    // קריאה מחדש ועדכון הסטייט
    const latestCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(latestCart);
  
    // אפקט bounce
    if (badgeRef.current) {
      badgeRef.current.classList.remove("bounce");
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add("bounce");
    }
  };
      
  //arrows handling
  const goToNextProduct = () => {
    if (!selectedProduct) return;
    const index = products.findIndex(p => p.id === selectedProduct.id);
    const nextIndex = (index + 1) % products.length;
    setSelectedProduct(products[nextIndex]);
  };
  
  //arrows handling
  const goToPrevProduct = () => {
    if (!selectedProduct) return;
    const index = products.findIndex(p => p.id === selectedProduct.id);
    const prevIndex = (index - 1 + products.length) % products.length;
    setSelectedProduct(products[prevIndex]);
  };
  
      

  return (
    <div className="landing-container">
      <div className="sticky-cart-header">
        <div className="cart-info">
          <div className="cart-badge-wrapper">
            <span>🛒</span>
            <span className="cart-badge">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <span>💸 סך הכול: {calculateTotal()}₪</span>
        </div>
        <div className="cart-actions">
          <button className="cta-button small" onClick={() => router.push("/purchase")}>קנה עכשיו</button>
          <button className="clear-cart-button" onClick={() => {
            localStorage.removeItem("cart");
            setCart([]);
          }}>נקה עגלה</button>
        </div>
      </div>

      <header className="header">
        <h1>קופסאות סיגריות</h1>
        <p className="subtitle">הגן על הסיגריות שלך עם סטייל ייחודי, עיצוב אישי וחומרים איכותיים.</p>
        <p className="highlight">עשרות לקוחות כבר רכשו והמליצו!</p>
      </header>

      {/* קטלוג מוצרי כרטיסים */}
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-box" key={product.id} onClick={() => setSelectedProduct(product)}>
            <img src={product.image_url} alt={product.name} className="product-img" />
            <h3>{product.name}</h3>
          </div>
        ))}
      </div>

      <div className="cta-container">
        <button className="cta-button" onClick={() => router.push("/purchase")}>הזמן עכשיו</button>
        <button className="clear-cart-button-body" onClick={() => {
          localStorage.removeItem("cart");
          setCart([]);
          }}>נקה עגלה
        </button>
        <p className="shipping-info">משלוח חינם בכל הזמנה מעל 199₪</p>
      </div>

      {selectedProduct && (
      <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* חצים למעבר */}
          <div className="modal-nav">
            <div className="modal-image-container">
              <button className="modal-arrow left" onClick={goToPrevProduct}>◀</button>
              <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              <button className="modal-arrow right" onClick={goToNextProduct}>▶</button>
            </div>
          </div>
          
          <h2>{selectedProduct.name}</h2>
          <p>מחיר: {selectedProduct.price}₪</p>
          <p>כמות במלאי: {selectedProduct.stock}</p>
          <div className="modal-buttons">
            <button className="add" onClick={() => addToCart(selectedProduct)}>הוסף לעגלה</button>
            <button className="go" onClick={() => router.push("/purchase")}>מעבר לרכישה</button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}