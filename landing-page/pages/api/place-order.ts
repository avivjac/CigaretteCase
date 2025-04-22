import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cartItems, total, customer_name, address } = req.body;

  try {
    const orderID: number = await generateOrderId();

    await addOrderDB1(orderID, customer_name, address, total);

    for (const item of cartItems) {
      await addOrderDB2(orderID, item.id, item.quantity);
      await addOrderDB3(item.id, item.quantity);
    }

    return res.status(200).json({ success: true, orderId: orderID });
  } catch (error: any) {
    console.error("Order error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function addOrderDB1(orderID: number, customer_name: string, address: string, total: number) {
  const { error } = await supabase.from("orders").insert([
    {
      order_id: orderID,
      order_date: new Date().toISOString(),
      customer_name,
      address,
      total_price: total,
    },
  ]);

  if (error) throw new Error(error.message);
}

async function addOrderDB2(orderID: number, productID: number, qty: number) {
  const { error } = await supabase.from("order_items").insert([
    {
      order_id: orderID,
      product_id: productID,
      quantity: qty,
    },
  ]);

  if (error) throw new Error(error.message);
}

async function addOrderDB3(productID: number, qty: number) {
  const { error } = await supabase.rpc("decrease_stock", {
    pid: productID,
    qty,
  });

  if (error) throw new Error(error.message);
}

async function checkUnique(orderId: number): Promise<boolean> {
  const { data, error } = await supabase.from("orders").select("order_id").eq("order_id", orderId);
  if (error) throw new Error(error.message);
  return data.length === 0;
}

async function generateOrderId(): Promise<number> {
  let orderId = Math.floor(Math.random() * 1000000);
  while (!(await checkUnique(orderId))) {
    orderId = Math.floor(Math.random() * 1000000);
  }
  return orderId;
}
