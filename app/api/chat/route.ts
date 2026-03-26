import { NextRequest, NextResponse } from "next/server";
import contextData from "@/data/hrithik_context.json";
import { systemPrompt } from "@/ai/system-prompt";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

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

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
