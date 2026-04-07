import { NextResponse } from "next/server";

// TODO: implement in step 7-8 (payment integration)
// בקרוב — webhook מ-Meshulam/CardCom, אימות חתימה, עדכון order.deposit_paid=true
export async function POST() {
  return NextResponse.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
