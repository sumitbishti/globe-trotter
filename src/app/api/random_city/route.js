import { NextResponse } from "next/server";
import City from "@/models/City";

const CITY_LIMIT = parseInt(process.env.CITY_LIMIT) || 100;

export async function GET() {
  try {
    const randomId = Math.floor(Math.random() * CITY_LIMIT) + 1;
    const randomCity = await City.findOne({ id: randomId });

    if (!randomCity) {
      return NextResponse.json({ error: "No city found" }, { status: 404 });
    }

    return NextResponse.json(randomCity);
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
