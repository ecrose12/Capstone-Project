import { NextResponse } from "next/server";
import { resolveFamilyContext } from "@/lib/familyContext";

export async function GET() {
  const { familyId, isParent } = await resolveFamilyContext();
  return NextResponse.json({ hasFamily: !!familyId, isParent });
}
