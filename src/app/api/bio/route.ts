import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { rawText, name } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY er ikke konfigurert" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    system:
      "Du er redakt\u00f8r for n\u00e6ringslivsklubbens Langbord sine medlemsprofiler. Skriv en kort bio (2\u20133 setninger) basert p\u00e5 LinkedIn-teksten under. V\u00e6r presis og konkret \u2014 hva har personen gjort, hvilken erfaring har de. Ingen superlativer, ingen fyllord, ingen klisj\u00e9er. Skriv p\u00e5 norsk.",
    messages: [
      {
        role: "user",
        content: `Navn: ${name}\n\nLinkedIn-tekst:\n${rawText}`,
      },
    ],
  });

  const bio =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ bio });
}
