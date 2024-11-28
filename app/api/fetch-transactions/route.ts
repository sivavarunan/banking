"use server";

import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

// Enforce that the environment variables are set
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.APPWRITE_TRANSACTION_COLLECTION_ID!;

export async function GET(req: NextRequest) {
  try {
    console.log("Fetching transactions...");
    console.log(`DATABASE_ID: ${DATABASE_ID}`);
    console.log(`COLLECTION_ID: ${COLLECTION_ID}`);

    const { database } = await createSessionClient();

    console.log("Calling database.listDocuments...");

    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID);

    console.log("Fetched transactions:", response.documents);

    return NextResponse.json({ transactions: response.documents });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    console.error("Error message:", error.message);

    // Provide more detailed error handling
    return NextResponse.json(
      { error: `Failed to fetch transactions: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
