



import pool from '../utils/database';
import { Contact } from '../models/contact';

export async function findContactByEmailOrPhone(
  email: string | undefined,
  phoneNumber: string | undefined
): Promise<Contact | null> {
  if (!email && !phoneNumber) {
    throw new Error('At least one of email or phoneNumber must be provided');
  }

  const query = `
      SELECT * FROM Contact
      WHERE (email = $1 OR phoneNumber = $2) AND deletedAt IS NULL
  `;
  const values = [email || null, phoneNumber || null]; // Provide null for undefined values

  const result = await pool.query(query, values);

  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function createNewContact(
  email: string | undefined,
  phoneNumber: string | undefined
): Promise<Contact> {
  const query = `
        INSERT INTO Contact (email, phoneNumber, linkPrecedence) 
        VALUES ($1, $2, 'primary') 
        RETURNING * 
    `;
  const values = [email || null, phoneNumber || null]; // Provide null for undefined values

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0]; // Return the created contact
    } else {
      throw new Error('Failed to create new contact');
    }
  } catch (error) {
    // Handle the error appropriately (e.g., logging, re-throwing)
    throw error;
  }
}

export async function assembleContactDetails(
  primaryContactId: number
): Promise<ContactDetails> {
  try {
    // 1. Fetch primary contact
    const primaryContact = await findContactById(primaryContactId);
    if (!primaryContact) {
      throw new Error(`Primary contact with ID ${primaryContactId} not found`);
    }

    // 2. Fetch linked contacts
    const linkedContacts = await fetchLinkedContacts(primaryContactId);

    // 3. Assemble response
    const response: ContactDetails = {
      primaryContactId: primaryContact.id,
      emails: [
        primaryContact.email || '', // Provide default value for undefined email
        ...linkedContacts.map((c) => c.email || '').filter(Boolean), // Filter out empty strings
      ],
      phoneNumbers: [
        primaryContact.phoneNumber || '', // Provide default value for undefined phoneNumber
        ...linkedContacts.map((c) => c.phoneNumber || '').filter(Boolean), // Filter out empty strings
      ],
      secondaryContactIds: linkedContacts.map((c) => c.id),
    };

    return response;
  } catch (error) {
    // Handle errors appropriately
    throw error;
  }
}

// Helper function

async function findContactById(contactId: number): Promise<Contact | null> {
  const query = `
        SELECT * FROM Contact
        WHERE id = $1 AND deletedAt IS NULL
    `;
  const values = [contactId];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    // Handle the error appropriately (e.g., logging, re-throwing)
    throw error;
  }
}

export async function fetchLinkedContacts(primaryContactId: number): Promise<Contact[]> {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * 
      FROM contact 
      WHERE linkedId = $1
    `;
    const result = await client.query<Contact>(query, [primaryContactId]);
    return result.rows;
  } finally {
    client.release();
  }
}

// Type for the assembled contact details
interface ContactDetails {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
