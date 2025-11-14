export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactRecord {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  created_at?: string;
}

const BASE = 'https://capsk.co.in/api/contacts';

export async function insertContact(payload: ContactPayload): Promise<{ status: string; message: string }> {
  const response = await fetch('https://capsk.co.in/api/contacts/insert.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (data?.status !== 'success') {
    throw new Error(data?.message || 'Failed to submit contact form');
  }
  return data;
}

export async function getContacts(token : string): Promise<ContactRecord[]> {
  const res = await fetch(`${BASE}/get.php`, { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
   });
  if (!res.ok) {
    throw new Error('Failed to fetch contacts');
  }
  const data = await res.json();
  if (data?.status !== 'success') {
    throw new Error(data?.message || 'Failed to fetch contacts');
  }
  return (data.data || []) as ContactRecord[];
}

export async function deleteContact(
  id: number | string, token?: string
  // token?: string
): Promise<{ status: string; message: string; deleted_id?: string }> {
  // const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  const res = await fetch(`${BASE}/delete.php`, {
    method: 'POST',
    headers: token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: typeof id === 'string' ? parseInt(id, 10) : id }),
  });
  if (!res.ok) {
    throw new Error('Failed to delete contact');
  }
  return res.json();
}


