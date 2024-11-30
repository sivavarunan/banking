"use server";

import { NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/appwrite";

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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    const { database } = await createSessionClient();

    await database.deleteDocument(DATABASE_ID, COLLECTION_ID, documentId);

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: `Failed to delete transaction: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, data } = await req.json(); // Destructure the id and data from the request body

    // Validate the required fields
    if (!id || !data) {
      return NextResponse.json(
        { error: "Missing id or data" },
        { status: 400 }
      );
    }

    const { database } = await createSessionClient();

    // Update the document using the $id of the document
    const response = await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      id, // The document $id
      data // The fields to update (name, amount, category, date)
    );

    return NextResponse.json({ updatedTransaction: response });
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update transaction" },
      { status: 500 }
    );
  }
}
