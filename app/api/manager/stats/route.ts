import { auth } from "@/lib/auth";
import { getInventoryUsageHistory, getSalesHistory, hasZReportToday } from "@/lib/queries/reports";

function unauthorizedResponse() {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "manager") return unauthorizedResponse();

    try {
        const [salesHistory, inventoryUsageHistory, zGeneratedToday] = await Promise.all([
            getSalesHistory(14),
            getInventoryUsageHistory(14),
            hasZReportToday(),
        ]);

        return Response.json({ salesHistory, inventoryUsageHistory, zGeneratedToday });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("GET /api/manager/stats error:", message);
        return Response.json({ error: message }, { status: 500 });
    }
}
