import { AbiParser } from './abi-parser.ts';
import { IAbi, IAbiField } from './abi-types.ts';

export class AbiService {
    /**
     * storage to keep parsed ABIs in memory
     */
    private static storage: IAbi[] = [];

    public static addToStorage(abis: string | IAbi | (string | IAbi)[]) {
        abis = !Array.isArray(abis) ? [abis] : abis;
        this.storage = this.storage.concat(
            typeof abis[0] === 'string'
                ? AbiParser.parseAbi(abis as string[])
                : (abis as IAbi[])
        );
    }

    /**
     * match ABI bytecode with 'storage'
     * @param code bytecode of contract
     */
    public static getAbiFromCode(code: string) {
        const { storage } = this;
        const matches = {} as Record<string, IAbi>;

        // https://ethereum.stackexchange.com/a/60062
        // DUP1 [0x80], PUSH4 [0x63] [4-byte abi], EQ [0x14]
        const rpublic = Array.from(code.matchAll(/8063(\w{8})14/g)); // TODO: compile regex @oscario2

        // each method
        for (let i = 0; i < storage.length; i++) {
            const abi = storage[i];
            const hash = abi.hash.type;

            // each match
            for (let j = 0; j < rpublic.length; j++) {
                const match = rpublic[j][1];
                if (hash == match) {
                    // use hash as key to prevent duplicates
                    matches[hash] = abi;
                }
            }
        }

        return matches;
    }

    /**
     * generate .ts interface from abi
     * @param name name of interface
     * @param abi
     */
    public static toInterface(name: string, abi: IAbi[]) {
        const ts: string[] = [];

        /**
         * convert to js compatible types
         * @param type
         * @returns
         */
        const toType = (type: string) => {
            const isArray = type.indexOf('[');
            const brackets = ~isArray ? type.slice(isArray) : '';

            if (type == 'address') return 'string' + brackets;
            if (type.startsWith('uint') || type.startsWith('int')) {
                return 'number' + brackets;
            }
            return type;
        };

        /**
         * void, single or tuple
         * @param outputs
         * @returns
         */
        const getReturn = (outputs: IAbiField[]): string | string[] => {
            if (outputs.length == 0) return 'void';
            if (outputs.length == 1) return toType(outputs[0].type);
            return outputs.map(k => `${k.name}: ${toType(k.type)}`).join(', ');
        };

        abi.forEach(n => {
            // build inputs
            const inputs = n.inputs.map(k => `${k.name}: ${toType(k.type)}`);

            // build return
            const returns = getReturn(n.outputs);
            const isTuple = n.outputs.length > 1;

            // build line
            const line = `${n.method}(${inputs.join(', ')}): ${
                isTuple ? `[${returns}]` : returns
            };`;

            ts.push(line);
        });

        // render .ts file
        return `interface ${name} {\n\t${ts.join('\n\t')}\n}`;
    }
}
