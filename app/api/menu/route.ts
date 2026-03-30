import { getMenu, getMenuByCategory } from "@/lib/queries/menu";

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
