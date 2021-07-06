import { keccak256 } from 'https://cdn.skypack.dev/js-sha3?dts';

export class CryptoUtils {
    private rbyte = new RegExp(/.{1,2}/g);

    /**
     * hash and return all 32-bytes with 0x prefix
     * @param hash
     * @returns
     */
    public keccak256(hash: string | Uint8Array) {
        if (hash instanceof Uint8Array) return '0x' + keccak256(hash);
        if (hash.startsWith('0x')) return hash;
        return '0x' + keccak256(hash);
    }

    /**
     * hash and return first 4 bytes
     * @param method
     * @returns
     */
    public getHashSignature(method: string) {
        return this.keccak256(method).slice(2, 10);
    }

    /**
     * is string valid address format
     * @param address
     * @returns
     */
    public validAddress(address: string): boolean {
        if (!address.startsWith('0x') || address.length != 42) {
            return false;
        }
        return true;
    }

    /**
     * is string valid bytes32 format
     * @param bytes
     * @returns
     */
    public validBytes32(bytes: string): boolean {
        if (!bytes.startsWith('0x') || bytes.length != 66) {
            return false;
        }
        return true;
    }

    /**
     * convert number to '0x*'
     * @param hex
     */
    public toHex(number: number): string {
        return '0x' + number.toString(16);
    }

    /**
     * convert '0x*' hex to number
     * @param hex
     */
    public fromHex(hex: string): number {
        return parseInt(hex, 16);
    }

    /**
     * convert value to typed array
     * @param v
     */
    public arrayify(v: string | number | Uint8Array): Uint8Array {
        if (v instanceof Uint8Array) return v;
        if (typeof v === 'number') return new Uint8Array([v]);

        const str2hex = v
            .toString()
            .replace('0x', '')
            .match(this.rbyte) as string[];

        const uint8 = new Uint8Array(str2hex.length);
        str2hex.forEach((k, i) => (uint8[i] = parseInt(k, 16)));

        return uint8;
    }

    /**
     * concat N items into a typed array with 32 byte padding
     * @param items
     */
    abiEncode(items: (string | number | Uint8Array)[]) {
        const uint8 = new Uint8Array(items.length * 32).fill(0);

        for (let i = 0; i < items.length; i++) {
            let v = items[i];
            if (typeof v === 'number') {
                v = v.toString(16).padStart(64, '00');
            }
            const insert = this.arrayify(v);

            // right align insert
            uint8.set(insert, (i + 1) * 32 - insert.length);
        }

        return uint8;
    }

    /**
     * concat N items to an typed array
     * @param items
     */
    abiEncodePacked(items: (string | number | Uint8Array)[]) {
        const bytes = [];
        for (let v of items) {
            if (typeof v === 'number') {
                v = v.toString(16);
            }
            bytes.push(...this.arrayify(v));
        }
        const uint8 = new Uint8Array(bytes.length);
        bytes.forEach((k, i) => (uint8[i] = k));

        return uint8;
    }
}

export const cutils = new CryptoUtils();
