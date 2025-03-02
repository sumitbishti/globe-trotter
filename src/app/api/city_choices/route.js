import City from "@/models/City";
import { NextResponse } from "next/server";

const CITY_LIMIT = parseInt(process.env.CITY_LIMIT) || 100;

export async function POST(request) {
  try {
    const body = await request.json();
    let { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "City ID is required" },
        { status: 400 }
      );
    }

    id = parseInt(id);
    if (id <= 0 || id > CITY_LIMIT) {
      return NextResponse.json(
        { error: "City ID is out of bounds!" },
        { status: 400 }
      );
    }

    const randomIds = [];
    while (randomIds.length < 3) {
      const randomId = Math.floor(Math.random() * CITY_LIMIT) + 1;

      if (randomId === id || randomIds.includes(randomId)) continue;
      randomIds.push(randomId);
    }

    const randomCities = await City.find(
      { id: { $in: randomIds } },
      { city: 1 }
    );
    const cityNames = randomCities.map((city) => city.city);

    return NextResponse.json(cityNames);
  } catch (error) {
    console.error("Error fetching choices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
