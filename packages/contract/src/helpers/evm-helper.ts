// deno-lint-ignore-file no-explicit-any
import { Big, defaultAbiCoder, IAbi } from '../../deps.ts';

export class EvmHelper {
    encode(args: unknown[], { inputs, hash }: IAbi) {
        // encode
        const encode = defaultAbiCoder
            .encode(
                // each input type
                inputs.map(k => k.type),
                // each input value
                args ? args : []
            )
            .slice(2); // remove 0x

        // method + each argument as 32-bytes
        return '0x' + hash.type + encode;
    }

    decode(data: string, abi: IAbi): unknown[] {
        // decode response
        const decode = defaultAbiCoder.decode(
            abi.outputs.map(k => k.type),
            data
        ) as unknown[];

        return decode.map(v => {
            // hack past ethers.js BigNumber
            if (!Array.isArray(v) && typeof v === 'object') {
                return new Big((v as any).toString());
            }
            return v;
        });
    }
}

export const evmHelper = new EvmHelper();
