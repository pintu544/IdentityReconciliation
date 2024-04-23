// tests/services/contactService.test.ts

import { 
  findContactByEmailOrPhone, 
  createNewContact,
  assembleContactDetails,
  fetchLinkedContacts
} from "../../src/services/contactService";

describe("Contact Service Tests", () => {
  it("should find contact by email or phone number", async () => {
    const contactByEmail = await findContactByEmailOrPhone('test@example.com', undefined);
    const contactByPhone = await findContactByEmailOrPhone(undefined, '1234567890');
    expect(contactByEmail).toBeNull();
    expect(contactByPhone).toBeNull();
  });

  it("should create new contact", async () => {
    const newContact = await createNewContact('new@example.com', undefined); // Change null to undefined
    expect(newContact.email).toEqual('new@example.com');
    expect(newContact.phoneNumber).toBeNull(); // Change '' to null
  });

  it("should fetch linked contacts", async () => {
    const newContact = await createNewContact('new@example.com', undefined);
    const linkedContacts = await fetchLinkedContacts(newContact.id);
    expect(linkedContacts).toHaveLength(0);
  });

  it("should assemble contact details", async () => {
    const testContact = await createNewContact('test@example.com', undefined); // Change null to undefined
    const contactDetails = await assembleContactDetails(testContact.id);
    expect(contactDetails.primaryContactId).toEqual(testContact.id);
    expect(contactDetails.emails).toContain('test@example.com');
    expect(contactDetails.phoneNumbers).toHaveLength(0);
    expect(contactDetails.secondaryContactIds).toHaveLength(0);
  });
});
