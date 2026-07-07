import { NextRequest, NextResponse } from "next/server";
import contextData from "@/data/hrithik_context.json";
import { systemPrompt } from "@/ai/system-prompt";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const AIRTABLE_CHAT_SESSIONS_TABLE_ID = "tbli7PUC14lpGCw9C";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const knowledgeBase = JSON.stringify(contextData);

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "system",
        content:
          "Answer in concise bullet points. Avoid long paragraphs unless asked.",
      },
      {
        role: "system",
        content: `Knowledge Base:\n${knowledgeBase}`,
      },
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini", // updated
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);

      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn’t generate a response right now.";

    if (sessionId) {
      try {
        const transcript = [
          ...(history as ChatMessage[]),
          { role: "user", content: message },
          { role: "assistant", content: reply },
        ]
          .map((m) => `${m.role === "user" ? "Q" : "A"}: ${m.content}`)
          .join("\n\n");

        await fetch(
          `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${AIRTABLE_CHAT_SESSIONS_TABLE_ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
            },
            body: JSON.stringify({
              performUpsert: { fieldsToMergeOn: ["Session ID"] },
              records: [
                {
                  fields: {
                    "Session ID": sessionId,
                    Transcript: transcript,
                    "Message Count":
                      (history as ChatMessage[]).filter((m) => m.role === "user")
                        .length + 1,
                    "Last Message At": new Date().toISOString(),
                  },
                },
              ],
            }),
          }
        );
      } catch (err) {
        console.error("Airtable logging failed:", err);
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
