import { AnonymousSession } from './types';

export interface AnimalIdentity {
  name: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
}

export const ANIMAL_IDENTITIES: AnimalIdentity[] = [
  { name: 'Kucing Oren', emoji: '🐱', color: '#f97316', bgLight: '#ffedd5', bgDark: '#431407' },
  { name: 'Bebek Santai', emoji: '🦆', color: '#eab308', bgLight: '#fef9c3', bgDark: '#422006' },
  { name: 'Hiu Galau', emoji: '🦈', color: '#0ea5e9', bgLight: '#e0f2fe', bgDark: '#082f49' },
  { name: 'Monyet Pensi', emoji: '🐵', color: '#d97706', bgLight: '#fef3c7', bgDark: '#451a03' },
  { name: 'Capybara Chill', emoji: '🦫', color: '#84cc16', bgLight: '#ecfccb', bgDark: '#1a2e05' },
  { name: 'Panda Ngantuk', emoji: '🐼', color: '#64748b', bgLight: '#f1f5f9', bgDark: '#0f172a' },
  { name: 'Penguin Rajin', emoji: '🐧', color: '#3b82f6', bgLight: '#dbeafe', bgDark: '#172554' },
  { name: 'Rubah Cerdik', emoji: '🦊', color: '#ea580c', bgLight: '#ffedd5', bgDark: '#431407' },
  { name: 'Koala Malas', emoji: '🐨', color: '#94a3b8', bgLight: '#f8fafc', bgDark: '#1e293b' },
  { name: 'Berang-berang', emoji: '🦦', color: '#a855f7', bgLight: '#f3e8ff', bgDark: '#3b0764' },
  { name: 'Singa Kalem', emoji: '🦁', color: '#f59e0b', bgLight: '#fef3c7', bgDark: '#451a03' },
  { name: 'Burung Hantu', emoji: '🦉', color: '#6366f1', bgLight: '#e0e7ff', bgDark: '#1e1b4b' },
  { name: 'Kelinci Panik', emoji: '🐰', color: '#ec4899', bgLight: '#fce7f3', bgDark: '#500724' },
  { name: 'Lumba-lumba', emoji: '🐬', color: '#06b6d4', bgLight: '#cffafe', bgDark: '#083344' },
  { name: 'Kura-kura Slow', emoji: '🐢', color: '#10b981', bgLight: '#d1fae5', bgDark: '#022c22' },
];

export function generateRandomSession(existingSessionId?: string): AnonymousSession {
  const randomIdentity = ANIMAL_IDENTITIES[Math.floor(Math.random() * ANIMAL_IDENTITIES.length)];
  const sessionId = existingSessionId || `session_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

  return {
    sessionId,
    pseudonym: `Anonymous ${randomIdentity.name}`,
    avatar: randomIdentity.emoji,
    color: randomIdentity.color,
    createdAt: new Date().toISOString(),
  };
}

export function getRandomIdentity(): AnimalIdentity {
  return ANIMAL_IDENTITIES[Math.floor(Math.random() * ANIMAL_IDENTITIES.length)];
}
