export interface FirebaseConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
  isMockMode: boolean;
}

export function getFirebaseConfig(): FirebaseConfig {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const isConfigured = Boolean(projectId && clientEmail && privateKey);

  return {
    projectId,
    clientEmail,
    privateKey,
    isMockMode: !isConfigured,
  };
}

export function isFirebaseConfigured(): boolean {
  return !getFirebaseConfig().isMockMode;
}
