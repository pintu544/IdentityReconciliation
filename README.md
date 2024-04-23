```markdown
# Bitespeed Customer Identification Service

Bitespeed needs a way to identify and keep track of a customer's identity across multiple purchases. We know that orders on FluxKart.com will always have either an email or phoneNumber in the checkout event. Bitespeed keeps track of the collected contact information in a relational database table named Contact.

## Database Schema

```typescript
{
  id: number;
  phoneNumber?: string;
  email?: string;
  linkedId?: number | null; // the ID of another Contact linked to this one
  linkPrecedence: "secondary" | "primary"; // "primary" if it's the first Contact in the link
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
```

One customer can have multiple Contact rows in the database against them. All of the rows are linked together with the oldest one being treated as "primary” and the rest as “secondary”. Contact rows are linked if they have either of email or phone as common.

For example:

If a customer placed an order with:

- email=lorraine@hillvalley.edu & phoneNumber=123456 
- and later came back to place another order with 
- email=mcfly@hillvalley.edu & phoneNumber=123456,

the database will have the following rows:

```json
[
  {
    "id": 1,
    "phoneNumber": "123456",
    "email": "lorraine@hillvalley.edu",
    "linkedId": null,
    "linkPrecedence": "primary",
    "createdAt": "2023-04-01T00:00:00.374Z",
    "updatedAt": "2023-04-01T00:00:00.374Z",
    "deletedAt": null
  },
  {
    "id": 23,
    "phoneNumber": "123456",
    "email": "mcfly@hillvalley.edu",
    "linkedId": 1,
    "linkPrecedence": "secondary",
    "createdAt": "2023-04-20T05:30:00.110Z",
    "updatedAt": "2023-04-20T05:30:00.110Z",
    "deletedAt": null
  }
]
```

## Requirements

You are required to design a web service with an endpoint `/identify` that will receive HTTP POST requests with a JSON body of the following format:

```typescript
{
  "email"?: string;
  "phoneNumber"?: string;
}
```

The service should:

- Accept requests with either email or phoneNumber, but at least one of them must be provided.
- Identify the customer based on the provided email or phoneNumber.
- If the customer is found, return the details of the customer including all linked contacts.
- If the customer is not found, create a new contact with the provided email or phoneNumber.
- If a customer is identified and a different email or phoneNumber is provided in subsequent requests, update the contact details and link them to the existing customer.

## Endpoint

### `POST /identify`

#### Request Body

```typescript
{
  "email"?: string;
  "phoneNumber"?: string;
}
```

#### Response

```typescript
{
  "customer": {
    "id": number;
    "primaryContactId": number;
    "emails": string[];
    "phoneNumbers": string[];
    "secondaryContactIds": number[];
  }
}
```

## Project Structure

```
bitespeed-customer-identification/
├── src/                     # Source code
│   ├── models/              # TypeScript models/interfaces
│   │   └── contact.ts
│   ├── services/            # Business logic
│   │   └── contactService.ts
│   ├── utils/               # Helper functions
│   │   └── database.ts
│   ├── controllers/         # Endpoint route handlers
│   │   └── identifyController.ts
│   ├── app.ts               # Application entry point
├── tests/                   # Unit and integration tests
│   ├── services/
│   │   └── contactService.test.ts
├── .env                     # Environment variables
├── ormconfig.json           # ORM configuration (if using an ORM)
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install dependencies:

```bash
cd bitespeed-customer-identification
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory of your project and add the following:

```plaintext
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=pintu123
DB_NAME=postgres
```

4. Start the application:

```bash
npm start
```

## Testing

To run tests, use the following command:

```bash
npm test
```

