import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import {
  getNextMeeting,
  saveNextMeeting,
  getPastMeetings,
  savePastMeetings,
} from "@/lib/data";
import type { NextMeeting, PastMeeting } from "@/lib/types";

export async function PUT(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const data: NextMeeting = await req.json();
  await saveNextMeeting(data);
  return NextResponse.json({ success: true, meeting: data });
}

export async function POST(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const data: PastMeeting = await req.json();
  const existing = await getPastMeetings();
  const updated = [data, ...existing];
  await savePastMeetings(updated);
  return NextResponse.json({ success: true, meetings: updated });
}

export async function DELETE(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { id } = await req.json();
  const existing = await getPastMeetings();
  const updated = existing.filter((m) => m.id !== id);
  await savePastMeetings(updated);
  return NextResponse.json({ success: true, meetings: updated });
}
