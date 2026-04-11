import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getMembers, saveMembers } from "@/lib/data";
import type { Member } from "@/lib/types";

export async function PUT(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const members: Member[] = await req.json();
  await saveMembers(members);
  return NextResponse.json({ success: true, members });
}

export async function POST(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const member: Member = await req.json();
  const existing = await getMembers();
  const updated = [...existing, member];
  await saveMembers(updated);
  return NextResponse.json({ success: true, members: updated });
}

export async function DELETE(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { id } = await req.json();
  const existing = await getMembers();
  const updated = existing.filter((m) => m.id !== id);
  await saveMembers(updated);
  return NextResponse.json({ success: true, members: updated });
}
