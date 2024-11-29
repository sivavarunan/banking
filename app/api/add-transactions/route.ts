import { createSessionClient } from "@/lib/appwrite";

export async function addTransaction(transactionData: any) {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

  const { database } = await createSessionClient();

  console.log("Environment Variables in addTransaction:", {
    databaseId,
    collectionId,
    transactionData,
  });

  if (!databaseId || !collectionId) {
    throw new Error("Database ID or Collection ID is missing in environment variables.");
  }

  try {
    const response = await database.createDocument(
      databaseId,
      collectionId,
      "unique()",
      transactionData
    );
    return response;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw new Error("Failed to add transaction");
  }
}
