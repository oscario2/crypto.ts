import { cutils } from '../deps.ts';
import { IAbi } from './abi-types.ts';

export class AbiParser {
    /**
     * parse slot of arg or return
     */
    private static parseSlots(line: string) {
        if (!line) return [];

        // gets 'field' and 'name' and removes possible tags like 'indexed' or 'memory'
        return line.split(',').map(arg => {
            arg = arg.replace(' indexed ', ' ').replace(' memory ', ' ');
            const split = arg.trim().split(' ');

            // naively assume starting with capital I is an interface
            const type = split[0].startsWith('I') ? 'address' : split[0];

            return {
                type,
                name: split[1] ? split[1] : ''
            };
        });
    }

    /**
     * parse public state variable to get function
     */
    private static parseStateVariable(line: string) {
        // 'uint a;' or 'uint a = 8;'
        const split = line.split('=')[0].trim().split(' ');
        if (!split || split.length <= 2) {
            throw new Error(`${split.length}/2 matches for ${line}`);
        }

        // make function of variable; 'view' is required for ethers.js 'read' calls
        const name = split[split.length - 1].replace(';', '');

        // build function line to parse
        return `function ${name}() public view returns (${split[0]})`;
    }

    /**
     * parse 'function' line
     * @param abi
     * @returns
     */
    public static parseAbi(abi: string | string[]) {
        abi = Array.isArray(abi) ? abi : [abi];

        return abi.map((line): IAbi => {
            // remove trailing symbols and make ethers.js compatible
            line = line.trim();

            // public 'state' variables are compiled to 'get accessors'
            if (!line.includes('function') && line.includes(' public ')) {
                line = this.parseStateVariable(line);
            }

            // map each value in function
            const input = line.match(/(function|event) (\w+)\((.*?)\)/);
            if (!input) return {} as IAbi;

            if (input.length != 4) {
                throw new Error(`${input.length}/4 matches for ${line}`);
            }
            const [, _type, method, inputs] = input;

            // optional 'args' field
            const slots = this.parseSlots(inputs);

            // optional 'return' field
            const output = line.match(/returns\s?\((.*?)\)/);
            const outputs = this.parseSlots(
                output?.length == 2 ? output[1] : ''
            );

            // hash signature
            const prehash = `${method}(${slots.map(k => k.type).join(',')})`;
            return {
                method,
                inputs: slots,
                outputs,
                hash: { name: prehash, type: cutils.getHashSignature(prehash) }
            };
        });
    }
}
