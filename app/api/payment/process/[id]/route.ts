import { NextResponse } from "next/server";

export async function POST(req: any, context: any) {
  const id = context?.params?.id;
  const body = await req.json();

  try {
    const res = await fetch(`http://localhost:8080/api/payment/process/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Optionally add authorization header if required
        // "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ success: false, message: errorText }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
