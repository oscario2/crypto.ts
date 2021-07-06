import { Reader } from './reader.ts';

// https://docs.soliditylang.org/en/v0.8.4/abi-spec.html
// https://medium.com/@hayeah/how-to-decipher-a-smart-contract-method-call-8ee980311603

export class Decoder extends Reader {
    constructor(buffer: string) {
        super(buffer);
    }

    /**
     * dynamic types uses head-tail encoding
     * size = args[i]
     * string = args[i + 1]
     * @param ptr row index of 'head' offset
     */
    private readString(ptr: number) {
        const { args, nzero, evm, hex2int, hex2str } = this;

        // read 'head' offset
        const offset = hex2int(args[ptr]);

        // jump to start of data
        const jmp = offset / evm;

        // string size
        const size = hex2int(args[jmp]);

        // size is dynamic and may expand beyond 32-bytes
        const rows = Math.ceil((size / evm) * 2);

        // concat string over N 32-byte rows
        let string = '';
        for (let i = 0; i < rows; i++) {
            const row = jmp + (i + 1);
            string += args[row].replace(nzero, '');
        }

        return hex2str(string);
    }

    /**
     * string[3]
     * array with fixed amount of slots
     * @param ptr row index of 'head' offset
     * @param size size of array
     */
    private readFixedArray(ptr: number, size: number, type: string) {
        console.log(ptr);
        this.parseArray(ptr + 1, size, type);
    }

    /**
     * string[]
     * array with N amount of slots
     * @param ptr row index of 'head' offset
     * @param type array type
     */
    private readDynamicArray(ptr: number, type: string) {
        const { args, evm, hex2int } = this;

        // read 'head' offset
        const offset = hex2int(args[ptr]);

        // jump to array size
        const jmp = offset / evm;

        // array size, skipped if fixed size array
        const size = hex2int(args[jmp]);

        // pointers to each list starts after size
        const listPtr = jmp + 1;

        this.parseArray(listPtr, size, type);
    }

    /**
     * nested array with N depth
     */
    private readNestedArray() {}

    /**
     * parse array data
     * @param listPtr start of slot pointers
     * @param size size of array
     * @param type type of array
     */
    private parseArray(listPtr: number, size: number, type: string) {
        const { args, evm, hex2int } = this;
        const output = [] as (string | number)[];

        for (let i = 0; i < size; i++) {
            // row with offset pointer
            const row = listPtr + i;

            // convert to bigint
            if (type == 'uint256') {
                output.push(hex2int(args[row]));
                continue;
            }

            // adjust relative offset to absolute
            const relative = hex2int(args[row]);
            const absolute = (relative + listPtr * evm).toString(16);
            console.log(relative.toString(16), '>', absolute);

            // pad for consistency
            args[row] = absolute.padStart(evm * 2, '00');

            if (type == 'string') {
                output.push(this.readString(row));
            }
        }
        console.log(output);
    }

    /**
     * read and parse buffer
     * @param types each evm type
     */
    public read(types: string[]) {
        for (let ptr = 0; ptr < types.length; ptr++) {
            const type = types[ptr];

            //
            if (type.includes('tuple')) {
                // break off and iterate over all nested vars
                continue;
            }

            // array
            if (type.includes('[') && type.includes(']')) {
                const depth = type.match(/\[\w?\]+/g) as string[];
                const primitive = type.split('[')[0];

                // nested
                if (depth.length > 2) {
                    continue;
                }

                // fixed
                if (depth[0].length > 2) {
                    const size = Number(
                        depth[0].replace('[', '').replace(']', '')
                    );
                    this.readFixedArray(ptr, size, primitive);
                    continue;
                }

                // dynamic
                this.readDynamicArray(ptr, primitive);

                continue;
            }
        }
    }
}

// external
import { defaultAbiCoder } from 'https://cdn.skypack.dev/@ethersproject/abi?dts';

const payload = defaultAbiCoder.encode(
    ['string', 'string', 'string[]', 'string[3]'],
    ['hello', 'bye', ['first', 'second', 'third'], ['1', '2', '3']]
);
const decode = new Decoder(payload);
decode.hexdump();
decode.read(['string', 'string', 'string[]', 'string[3]']);
