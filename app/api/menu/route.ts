import { auth } from "@/lib/auth";
import { addMenuItem, deleteMenuItem, getMenu, getMenuByCategory } from "@/lib/queries/menu";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const items = category ? await getMenuByCategory(category) : await getMenu();
    return Response.json(items);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GET /api/menu error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "manager") return unauthorizedResponse();

  try {
    const body = await request.json();
    const itemName = String(body?.itemname ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const price = Number(body?.price);
    const ingredientMappingsRaw = Array.isArray(body?.ingredientMappings) ? body.ingredientMappings : [];

    const ingredientMappings = ingredientMappingsRaw
      .map((entry: unknown) => {
        if (!entry || typeof entry !== "object") return null;
        const obj = entry as { ingredientid?: unknown; quantity?: unknown };
        const ingredientid = Number(obj.ingredientid);
        const quantity = Number(obj.quantity);
        if (!Number.isInteger(ingredientid) || Number.isNaN(quantity) || quantity <= 0) return null;
        return { ingredientid, quantity };
      })
      .filter(
        (entry: { ingredientid: number; quantity: number } | null): entry is { ingredientid: number; quantity: number } =>
          entry !== null
      );

    if (
      !itemName ||
      !category ||
      !description ||
      Number.isNaN(price) ||
      price < 0 ||
      ingredientMappings.length === 0
    ) {
      return Response.json(
        { error: "itemname, category, description, price, and ingredientMappings are required" },
        { status: 400 }
      );
    }

    const created = await addMenuItem(itemName, category, price, description, ingredientMappings);
    return Response.json(created, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /api/menu error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "manager") return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const itemId = Number(searchParams.get("itemId"));

    if (!Number.isInteger(itemId)) {
      return Response.json({ error: "itemId query param is required" }, { status: 400 });
    }

    await deleteMenuItem(itemId);
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("DELETE /api/menu error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
