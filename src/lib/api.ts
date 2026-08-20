/**
 * Lightweight API client for the BVoice backend.
 * Calls the /api/* Vercel serverless functions, same-origin in both
 * `vercel dev` and production.
 */

export interface Division {
  id: number;
  name: string;
  description: string;
}

export interface Candidate {
  nim: string;
  name: string;
  email: string;
  status: 'passed' | 'failed';
  division: Division | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getCandidateByNim(nim: string): Promise<Candidate | null> {
  const res = await fetch(`/api/candidates/${encodeURIComponent(nim)}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Lookup failed (${res.status})`);
  }

  const body: ApiResponse<Candidate> = await res.json();
  return body.data;
}

export async function getDivisions(): Promise<Division[]> {
  const res = await fetch('/api/divisions');

  if (!res.ok) {
    throw new Error(`Failed to load divisions (${res.status})`);
  }

  const body: ApiResponse<Division[]> = await res.json();
  return body.data;
}
