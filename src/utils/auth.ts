export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

const LOGIN_URL = 'https://capsk.co.in/api/login.php';

export async function login(email: string, password: string): Promise<LoginResponse> {
  // console.log("email: "+ email + " password: "+ password);
  // console.log("JSON: "+ JSON.stringify({ email, password }));
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Unable to parse server response');
  }

  if (!response.ok || data?.status !== 'success') {
    const message = data?.message || 'Invalid email or password';
    throw new Error(message);
  }

  return {
    token: data.token,
    user: data.user,
  };
}

