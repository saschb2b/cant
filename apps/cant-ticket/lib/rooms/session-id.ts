const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const chars: string[] = [];
  for (let i = 0; i < length; i += 1) {
    const byte = bytes[i] ?? 0;
    chars.push(ALPHABET.charAt(byte % ALPHABET.length));
  }
  return chars.join("");
}

export function generateSessionId(): string {
  return randomCode(8);
}

export function generateParticipantId(): string {
  return crypto.randomUUID();
}
