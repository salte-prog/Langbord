import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getMembers, getNextMeeting, getPastMeetings } from "@/lib/data";

export async function GET() {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const [members, nextMeeting, pastMeetings] = await Promise.all([
    getMembers(),
    getNextMeeting(),
    getPastMeetings(),
  ]);

  return NextResponse.json({ members, nextMeeting, pastMeetings });
}
