import { cookies } from 'next/headers';

export async function getServerLanguage(): Promise<'en' | 'id'> {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get('language');
  
  if (languageCookie?.value === 'id') {
    return 'id';
  }
  return 'en'; // Default fallback
}