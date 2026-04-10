import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Member, NextMeeting, PastMeeting } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function dataPath(file: string) {
  return path.join(DATA_DIR, file);
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(dataPath(file), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  const { mkdir } = await import("fs/promises");
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(dataPath(file), JSON.stringify(data, null, 2), "utf-8");
}

// Members
export async function getMembers(): Promise<Member[]> {
  return readJson<Member[]>("members.json", []);
}

export async function saveMembers(members: Member[]): Promise<void> {
  await writeJson("members.json", members);
}

// Next meeting
export async function getNextMeeting(): Promise<NextMeeting | null> {
  return readJson<NextMeeting | null>("next-meeting.json", null);
}

export async function saveNextMeeting(meeting: NextMeeting): Promise<void> {
  await writeJson("next-meeting.json", meeting);
}

// Past meetings
export async function getPastMeetings(): Promise<PastMeeting[]> {
  return readJson<PastMeeting[]>("past-meetings.json", []);
}

export async function savePastMeetings(meetings: PastMeeting[]): Promise<void> {
  await writeJson("past-meetings.json", meetings);
}
