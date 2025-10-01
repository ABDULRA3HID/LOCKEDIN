import { supabase } from './supabase';
import type { UserRole } from './database.types';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  institutionId?: string;
  studentNumber?: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('Failed to create user');

  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    email: data.email,
    name: data.name,
    role: data.role,
    institution_id: data.institutionId || null,
    student_number: data.studentNumber || null,
    phone: data.phone || null,
    is_verified: false,
  });

  if (profileError) throw profileError;

  return authData;
}

export async function signIn(data: SignInData) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', authData.user.id);

  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return profile;
}

export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      callback(event, session);
    })();
  });
}
