"use server";

import { createSessionClient } from "../appwrite";
import { ID } from "node-appwrite";

export async function addTransaction(transactionData: { amount: number; description: string; type: string }) {
  try {
    const { account, database } = await createSessionClient();

    // Get logged-in user's details
    const user = await account.get();

    if (!user) throw new Error("No logged-in user");

    // Define database and collection IDs
    const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!;

    // Validate environment variables
    if (!DATABASE_ID || !COLLECTION_ID) {
      throw new Error("Database or collection ID is missing in environment variables.");
    }

    // Add the transaction to the user's collection
    const response = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id, // Link the transaction to the user's ID
        amount: transactionData.amount,
        description: transactionData.description,
        type: transactionData.type, // e.g., "income" or "expense"
        date: new Date().toISOString(), // Ensure ISO format
      }
    );

    return response; // Return transaction details
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw new Error("Failed to add transaction");
  }
}
