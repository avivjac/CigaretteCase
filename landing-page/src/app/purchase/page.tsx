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

  // //SQL QUERYS
  // //insert new order to database
  // const handleOrderSQL = async () => {
  //   try {
  //     const orderID : number = await generateOrderId(); // Generate a random order ID
  //     await addOrderDB1(orderID); // Add order to orders table
  //     //await addOrderDB2(orderID); // Add items to order_items table
  //     cartItems.forEach((item) => {
  //       addOrderDB2(orderID, item.id, item.quantity); // Add each item to order_items table
  //       addOrderDB3(item.id, item.quantity); // Update stock for each item
  //     });
  //     console.log("Order placed successfully with ID:", orderID); 
  //   }
  //   catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  //   //clearCart(); // Clear the cart after placing the order
  // };


  // //add new order to orders table
  // const addOrderDB1 = async (orderID : number) => {
  //   const { data, error } = await supabase
  //     .from("orders")
  //       .insert([
  //         {
  //           order_id: orderID, 
  //           order_date: new Date().toISOString(), // Current date and time
  //           customer_name: "", 
  //           address: "",
  //           total_price: total,
  //         },
  //       ]);

  //       // Check for errors
  //       if (error) {
  //         console.error("❌ שגיאה בהוספה:", error.message);
  //       } else {
  //         console.log("✅ הוזן בהצלחה:", data);
  //       }
  // };

  // //add the ordered items to ordered items table
  // const addOrderDB2 = async (orderID : number, productID : number, qty : number) => {
  //   const { data, error } = await supabase
  //     .from("order_items")
  //     .insert([
  //     {
  //         order_id: orderID, 
  //         product_id: productID,
  //         quantity: qty,
  //     },
  //       ]);

  //     // Check for errors
  //     if (error) {
  //       console.error("❌ שגיאה בהוספה:", error.message);
  //     } else {
  //       console.log("✅ הוזן בהצלחה:", data);
  //     }
  // };

  // //check with database if the orderID is unique
  // const checkUnique = async (orderId: number): Promise<boolean> => {
  //   const { data, error } = await supabase
  //     .from("orders")
  //     .select("order_id")
  //     .eq("order_id", orderId);

  //   if (error) {
  //     console.error("❌ Error checking uniqueness:", error.message);
  //     return false; // Return false in case of an error
  //   }

  //   return data.length === 0; // Return true if the order ID is unique
  // };

  // //generating random and unique orderID
  // const generateOrderId = async (): Promise<number> => {
  //   let orderId = Math.floor(Math.random() * 1000000);
  //   let isUnique = await checkUnique(orderId);
  //   while (!isUnique) {
  //     orderId = Math.floor(Math.random() * 1000000);
  //     isUnique = await checkUnique(orderId);
  //   }
  //   return orderId;
  // };

  // //update the stock in the database
  // const addOrderDB3 = async (productID : number, qty : number) => {
  //   const { data, error } = await supabase.rpc("decrease_stock", {
  //     pid: productID,
  //     qty: qty,
  //   });

  //   // Check for errors
  //   if (error) {
  //     console.error("שגיאה בעדכון המלאי:", error.message);
  //   } else {
  //     console.log("עודכן בהצלחה", data);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, address }),
    });

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
  
//   //mail sending function
//   const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false, // TLS
//     auth: {
//       user: "avivj2012@gmail.com", // זה האימייל שלך ב־Brevo
//       pass: process.env.SMTP_PASSWORD, //SMTP API Key
//     },
//   });
  
//   /**
//  * שולח מייל לכתובת נתונה
//  * @param {string} toEmail - כתובת היעד
//  */
//   function sendEmail(toEmail : string) {
//     transporter.sendMail({
//       from: '"האתר שלי" <youremail@yourdomain.com>', // אותו מייל מה־user
//       to: toEmail,
//       subject: "ברוך הבא!",
//       text: "שלום וברוך הבא לאתר שלנו.",
//       html: "<h1>שלום וברוך הבא!</h1><p>שמחים שהצטרפת אלינו 🎉</p>",
//     })
//     .then(() => console.log("✅ מייל נשלח בהצלחה ל:", toEmail))
//     .catch((err : any) => console.error("❌ שגיאה בשליחת מייל:", err));
//   }
    
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


        <div className="cta-container">
          <button
           onClick={() => setShowPaymentModal(true)} //payment gateway
           className="cta-button"
          >
            <span>💳 שלם</span>
          </button>
          {showPaymentModal && (
            <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>📝 פרטי ההזמנה</h2>
                <form className="checkout-form" onSubmit={(e) => {
                  handleSubmit(e); // Send email after order is placed
                  // e.preventDefault();
                  // handleOrderSQL(); // Place the order in the database
                  // //sendEmail(email); // Send email after order is placed
                  // setShowPaymentModal(false); // Close the modal after sending the email
                }}>
                  <input type="text" placeholder="שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  <input type="text" placeholder="כתובת" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div style={{ marginTop: "10px" }}>
                    <button type="submit" className="cta-button">שלח הזמנה</button>
                  </div>
                  
                {/* <input type="text" placeholder="שם מלא" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input type="text" placeholder="כתובת" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <input type="email" placeholder="אימייל" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div style={{ marginTop: "10px" }}>
                    <button type="submit" className="cta-button">שלח הזמנה</button>
                  </div> */}
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
