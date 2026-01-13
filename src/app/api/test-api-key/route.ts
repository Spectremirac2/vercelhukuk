import { NextRequest, NextResponse } from "next/server";

/**
 * API Key Test Endpoint
 * 
 * API anahtarlarının geçerliliğini test eder.
 */
export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, error: "Provider ve API key gerekli" },
        { status: 400 }
      );
    }

    if (provider === "gemini") {
      return await testGeminiKey(apiKey);
    }

    if (provider === "openai") {
      return await testOpenAIKey(apiKey);
    }

    return NextResponse.json(
      { success: false, error: "Bilinmeyen provider" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API key test error:", error);
    return NextResponse.json(
      { success: false, error: "Test sırasında hata oluştu" },
      { status: 500 }
    );
  }
}

/**
 * Gemini API key test
 */
async function testGeminiKey(apiKey: string): Promise<NextResponse> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: "GET" }
    );

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        provider: "gemini",
        models: data.models?.slice(0, 5).map((m: { name: string }) => m.name) || [],
      });
    }

    const error = await response.json();
    return NextResponse.json({
      success: false,
      error: error.error?.message || "Geçersiz API key",
    });
  } catch (_error) {
    return NextResponse.json({
      success: false,
      error: "Bağlantı hatası",
    });
  }
}

/**
 * OpenAI API key test
 */
async function testOpenAIKey(apiKey: string): Promise<NextResponse> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        provider: "openai",
        models: data.data?.slice(0, 5).map((m: { id: string }) => m.id) || [],
      });
    }

    const error = await response.json();
    return NextResponse.json({
      success: false,
      error: error.error?.message || "Geçersiz API key",
    });
  } catch (_error) {
    return NextResponse.json({
      success: false,
      error: "Bağlantı hatası",
    });
  }
}
