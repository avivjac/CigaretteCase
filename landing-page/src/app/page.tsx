"use client";

import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <h1>🔥 דף הנחיתה שלי</h1>
//       <p>ברוך הבא! כאן תוכל לרכוש את המוצר שלי.</p>
//       <button 
//         onClick={() => router.push("/purchase")} 
//         style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}
//       >
//         קנה עכשיו
//       </button>
//     </div>
//   );
// }

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <h1>🔥 ברוך הבא לחנות שלנו!</h1>
      <p>המוצר הכי טוב בשוק - קנה עכשיו ותהנה מחוויית רכישה נוחה ובטוחה.</p>

      <div className="card">
        <h2>💡 מידע על המוצר</h2>
        <p>המוצר שלנו עשוי מחומרים איכותיים ויגרום לך לחוות נוחות מקסימלית.</p>
        <button
          onClick={() => router.push("/purchase")}
        >קנה עכשיו</button>
      </div>
    </div>
  );
}
