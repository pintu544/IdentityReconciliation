import express from 'express';
import {
  findContactByEmailOrPhone,
  createNewContact,
  assembleContactDetails,
} from '../services/contactService';

const router = express.Router();

router.post('/identify', async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Check if contact exists
    let contact = await findContactByEmailOrPhone(email, phoneNumber);

    if (!contact) {
      // If not, create a new contact
      contact = await createNewContact(email, phoneNumber);
    }

    if (!contact) {
      throw new Error('Failed to create new contact');
    }

    // Assemble contact details
    const contactDetails = await assembleContactDetails(contact.id);

    res.json({ contact: contactDetails });
  } catch (error) {
    console.error('Error identifying contact:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
