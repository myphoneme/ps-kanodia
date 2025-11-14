export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: string;
  password: string;
}

const BASE_URL = 'https://capsk.co.in/api/users';

const defaultHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

export async function getUsers(token: string): Promise<UserRecord[]> {
  // console.log("token: "+ token);
  const response = await fetch('https://capsk.co.in/api/users/read.php', {
    method: 'GET',
    headers: defaultHeaders(token)
  
  });

  if (!response.ok) {
    throw new Error('Unable to fetch users');
  }

  const data = await response.json();
  if (data?.status !== 'success') {
    throw new Error(data?.message || 'Failed to fetch users');
  }

  return (data.users || []) as UserRecord[];
}

export async function createUser(payload: CreateUserPayload, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/create.php`, {
    method: 'POST',
    headers: defaultHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || data?.status !== 'success') {
    throw new Error(data?.message || 'Failed to create user');
  }
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch('https://capsk.co.in/api/users/delete.php', {
    method: 'POST',
    headers: defaultHeaders(token),
    body: JSON.stringify({ id: parseInt(id, 10) }),
  });

  const data = await response.json();
  if (!response.ok || data?.status !== 'success') {
    throw new Error(data?.message || 'Failed to delete user');
  }
}


