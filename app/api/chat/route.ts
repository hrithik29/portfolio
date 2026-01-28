import { NextRequest, NextResponse } from "next/server";
import profileData from "@/data/profile.json";
import experienceData from "@/data/experience.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import interestsData from "@/data/interests.json";
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

    // Import JSON files directly (they'll be bundled)
    const profile = JSON.stringify(profileData);
    const experience = JSON.stringify(experienceData);
    const projects = JSON.stringify(projectsData);
    const skills = JSON.stringify(skillsData);
    const interests = JSON.stringify(interestsData);

    const knowledgeBase = `## Profile
${profile}

## Experience
${experience}

## Projects
${projects}

## Skills
${skills}

## Interests
${interests}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt + "\n\nKnowledge Base:\n" + knowledgeBase,
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
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.4,
      }),
    });

    console.log("api key", apiKey);
    console.log("response", response);

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "No response generated";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
