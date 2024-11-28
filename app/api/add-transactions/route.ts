import { NextApiRequest, NextApiResponse } from 'next';
import { createSessionClient, createAdminClient } from "@/lib/appwrite";

const DATABASE_ID = "process.env.APPWRITE_DATABASE_ID"; 
const COLLECTION_ID = "process.env.APPWRITE_TRANSACTION_COLLECTION_ID";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { database } = await createSessionClient();
      const { name, amount, date, category } = req.body;

      // Validate fields
      if (!name || !amount || !date || !category) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Add transaction to Appwrite database
      const response = await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'unique()', // Auto-generate document ID
        { name, amount, date, category } // Document data
      );

      // Respond with success
      res.status(201).json({ message: 'Transaction added successfully', transaction: response });
    } catch (error) {
      console.error('Error adding transaction:', error);
      res.status(500).json({ error: 'Failed to add transaction' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
