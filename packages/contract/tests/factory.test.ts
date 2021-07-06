import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { log } from '../deps.ts';
import { FactoryContract } from '../src/contracts/factory-contract.ts';
import { LiquidPairContract } from '../src/contracts/lp-contract.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Contract');

await describe('Factory', async () => {
    const pancakeBdoBusd = '0xc5b0d73a7c0e4eaf66babf7ee16a2096447f7ad6';
    const lp = await LiquidPairContract.from(pancakeBdoBusd, 'bep20');
    let factory = {} as FactoryContract;

    it('should load pancake factory contract', async () => {
        factory = await FactoryContract.from(
            (await lp.factory()).toString(),
            'bep20'
        );
    });

    it('should enumerate pancake LP pairs', async () => {
        const allPairs = (await factory.allPairsLength()).toString();
        log.info('[allPairs]:', allPairs);

        // address of first indexes
        const batch = (await factory.batch(
            [1, 2, 3].map(i => {
                return { method: 'allPairs', args: [i] };
            })
        )) as [string, string];

        expect(batch.length).toBe(3);
    });
}).run();
