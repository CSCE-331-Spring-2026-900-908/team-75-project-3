import Link from "next/link";

const interfaces = [
  { name: "Customer Kiosk", href: "/customer", desc: "Self-service ordering" },
  { name: "Cashier", href: "/cashier", desc: "Point-of-sale terminal" },
  { name: "Manager", href: "/manager", desc: "Admin dashboard" },
];

export default function PortalPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-display tracking-tight mb-5">Taro Root</h1>
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 w-full max-w-3xl">
        {interfaces.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-border bg-card px-5 py-4 hover:border-accent hover:shadow-sm transition"
          >
            <div className="font-semibold">{item.name}</div>
            <div className="text-sm text-muted">{item.desc}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
