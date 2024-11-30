import { NextResponse } from 'next/server';
import { createSessionClient } from '@/lib/appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.APPWRITE_TRANSACTION_COLLECTION_ID!;

export async function POST(req: Request) {
  try {
    const { name, amount, date, category } = await req.json();

    // Validate fields
    if (!name || !amount || !date || !category) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const { account, database } = await createSessionClient();

    // Fetch the logged-in user's details
    const user = await account.get();
    const userId = user.$id; // Logged-in user's ID

  
    const transactionId = `txn_${Date.now()}`;

    // Add transaction to Appwrite database
    const response = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      'unique()',
      {
        transaction_id: transactionId, 
        name,
        amount,
        date,
        category,
        user_id: userId,
      }
    );

    return NextResponse.json(
      { message: 'Transaction added successfully', transaction: response },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: 'Failed to add transaction' }, { status: 500 });
  }
}
