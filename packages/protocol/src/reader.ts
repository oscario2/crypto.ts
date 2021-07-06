export abstract class Reader {
    // remove leading or trailing zeros
    protected readonly nzero = new RegExp(/(^00+|00+$)/);

    // EVM byte size
    protected readonly evm = 32;

    // buffer split into 32-bit args
    protected readonly args: string[];

    constructor(buffer: string) {
        buffer = buffer.replace('0x', '');

        if (buffer.length % this.evm !== 0) {
            throw new Error('Not a valid length');
        }

        // split into 32-byte array
        this.args = buffer.match(/.{1,64}/g) as string[];
    }

    /**
     * convert bytes to UTF8
     * @param hex
     */
    protected hex2str(hex: string) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex[i] + hex[i + 1], 16));
        }
        return str;
    }

    /**
     * convert bytes string to int
     * @param hex
     */
    protected hex2int(hex: string) {
        return parseInt(hex, 16);
    }

    /**
     * dump buffer
     */
    public hexdump() {
        const { args, evm } = this;
        const bytes = args.join('').match(/.{1,2}/g) as string[];

        for (let i = 0; i < bytes.length; i += evm) {
            const row = [];
            for (let j = 0; j < evm; j++) {
                row.push(bytes[i + j]);
            }
            const offset = i.toString(16).padStart(4);
            console.log(offset, row.join(''));
        }
    }
}
