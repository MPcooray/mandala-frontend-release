import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: any) {
  const id = context?.params?.id;

  try {
    const res = await fetch(`http://localhost:8080/api/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Add credentials or tokens if needed
      },
    });

    if (!res.ok) {
      return new Response("Failed to fetch order", { status: res.status });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Server error:", err);
    return new Response("Server error", { status: 500 });
  }
}
