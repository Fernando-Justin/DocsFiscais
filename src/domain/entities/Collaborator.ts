export interface Collaborator {
  id: string;
  nome: string;
  squad: string;
  papel: string; // mantenedor, dev, etc.
  email: string;
  created_at?: string;
  application_ids?: string[]; // Para facilitar manipulação na UI
}
