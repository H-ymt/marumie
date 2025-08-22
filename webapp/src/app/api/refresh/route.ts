import "server-only";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check for refresh token
    const refreshToken = request.headers.get("x-refresh-token");
    const expectedToken = process.env.DATA_REFRESH_TOKEN;

    if (!expectedToken) {
      console.error("DATA_REFRESH_TOKEN not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    if (!refreshToken || refreshToken !== expectedToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate the transactions page
    revalidatePath("/transactions");
    // Revalidate the main page
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      message: "Cache refreshed successfully",
    });
  } catch (error) {
    console.error("Cache refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh cache" },
      { status: 500 },
    );
  }
}
