export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: 'secondary' | 'primary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

  