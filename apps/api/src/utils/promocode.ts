import { randomBytes } from "node:crypto";

export function generatePromoCode(
    length = 8,
    group = 4,
    separator = "-"
): string {
    if (length <= 0) throw new Error("length must be > 0");

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0,O,1,I,L
    const bytes = randomBytes(length); // Bun's crypto.randomBytes -> securely-random bytes
    let code = "";

    for (let i = 0; i < length; i++) {
        const idx = bytes[i] % chars.length;
        code += chars.charAt(idx);
    }

    if (!group) return code;
    return code.match(new RegExp(`.{1,${group}}`, "g"))!.join(separator);
}
