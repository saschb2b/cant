import { NextResponse } from "next/server";
import { createSession } from "@/lib/retro/store";
import {
  buildCustomTemplate,
  getTemplate,
  TEMPLATES,
} from "@/lib/retro/templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    templateId?: unknown;
    customColumns?: unknown;
  } | null;

  const name = typeof body?.name === "string" ? body.name : "";
  const templateId =
    typeof body?.templateId === "string" ? body.templateId : "";

  let template = null;
  if (templateId === "custom") {
    if (!Array.isArray(body?.customColumns)) {
      return NextResponse.json({ error: "missing-columns" }, { status: 400 });
    }
    template = buildCustomTemplate(
      body.customColumns as { name: unknown; hint?: unknown }[],
    );
  } else {
    template = getTemplate(templateId);
  }

  if (!template) {
    return NextResponse.json({ error: "invalid-template" }, { status: 400 });
  }

  const { session, participant } = createSession(name, template);
  return NextResponse.json({
    sessionId: session.id,
    participantId: participant.id,
    templateId: template.id,
    availableTemplates: Object.keys(TEMPLATES),
  });
}
