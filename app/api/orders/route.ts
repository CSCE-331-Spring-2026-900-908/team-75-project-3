import { submitOrder } from "@/lib/queries/orders";

export async function POST(request: Request) {
  const body = await request.json();
  const { items, total, source, customerName, employeeId } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Items are required" }, { status: 400 });
  }

  const orderId = await submitOrder(
    items,
    total,
    source ?? "kiosk",
    customerName ?? null,
    employeeId ?? null
  );

  return Response.json({ orderId });
}
