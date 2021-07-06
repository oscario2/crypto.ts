// deno-lint-ignore-file no-explicit-any
import { Big, defaultAbiCoder, ProviderService } from '../../deps.ts';
import { IEncodedBatch } from '../contract-types.ts';

export abstract class BatchService {
    constructor(protected readonly provider: ProviderService) {}

    protected async sendBatch(batch: IEncodedBatch[]) {
        if (batch.length == 0) {
            throw new Error('Batch is empty');
        }
        // TODO: make use of 'evmHelper' instead @oscario2

        // map each call
        const calls = batch.map(c => [c.to, c.data]) as string[][];

        // encode bytes32
        const bytes = defaultAbiCoder
            .encode(['tuple(address,bytes)[]'], [calls])
            .slice(2);

        // aggregate((address,bytes)[])
        const aggregate = '0x252dba42';

        // call
        const { value } = await this.provider.call({
            to: this.provider.batchUrl,
            data: aggregate + bytes
        });

        // return
        const [_block, data] = defaultAbiCoder.decode(
            ['uint256', 'bytes[]'],
            value
        ) as [block: number, data: string[]];

        // not every call returned
        if (data.length != batch.length) {
            throw new Error('Not all calls returned');
        }

        // decode to 2d array
        const decode = batch.map(({ outputs }, i) =>
            defaultAbiCoder.decode(outputs, data[i]).map(v => {
                // hack past ethers.js BigNumber
                if (!Array.isArray(v) && typeof v === 'object') {
                    return new Big((v as any).toString());
                }
                return v;
            })
        ) as unknown[][];

        return decode;
    }
}
