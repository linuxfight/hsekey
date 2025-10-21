import * as jose from 'jose';
import 'dotenv/config';

export interface Claims extends jose.JWTPayload {
    id: number
}

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET!
);

export async function verifyAndParse(token: string): Promise<Claims | null> {
    try {
        const { payload } = await jose.jwtVerify(token, secret, {
            algorithms: ['HS256']
        });

        return payload as Claims;
    } catch (e) {
        return null;
    }
}

export async function create(id: number): Promise<string> {
    const claims: Claims = {
        id: id
    }

    return await new jose.SignJWT(claims).setProtectedHeader({alg: 'HS256'}).sign(secret);
}

