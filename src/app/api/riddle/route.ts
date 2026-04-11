import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: NextRequest) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 401 });
  }

  const { hostName, hostCompany, industry, locationDescription, hints } =
    await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY er ikke konfigurert" },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = [
    `Vert: ${hostName}.`,
    `Firma: ${hostCompany}.`,
    `Bransje: ${industry}.`,
    `Sted: ${locationDescription}.`,
    hints ? `S\u00e6rtrekk: ${hints}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system:
      "Du er tekstforfatter for den eksklusive n\u00e6ringslivsklubbens Langbord sine m\u00f8testedsg\u00e5ter. Skriv en poetisk, presis og litt kryptisk g\u00e5te (3\u20135 setninger) som beskriver neste m\u00f8tested uten \u00e5 avsl\u00f8re det direkte. Stilen skal v\u00e6re nordisk, varm og intelligent \u2014 aldri barnslig. Unng\u00e5 klisj\u00e9er. Bruk detaljer fra bransjen, vertsmedlemmet og stedets s\u00e6rtrekk.",
    messages: [{ role: "user", content: userPrompt }],
  });

  const riddleText =
    message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ riddle: riddleText });
}
