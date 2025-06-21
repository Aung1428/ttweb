export interface User {
  role: string;
  fullName: string;
  email: string;
  password?: string;
  department?: string;
}

export function getLoggedInUser(): User | null {
  try {
    const raw = localStorage.getItem('user');
    const parsed = JSON.parse(raw || '');
    return typeof parsed === 'object' && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem('user');
}
