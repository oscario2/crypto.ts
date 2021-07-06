import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { EBscToken } from '../src/enums/bsc-token.ts';
import { lpHelper } from '../src/helpers/lp-helper.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Contract');

await describe('LiquidPair', () => {
    let address = '';

    it('should create LP from 2 ERC20', () => {
        const bdoBusd = '0xc5b0d73a7c0e4eaf66babf7ee16a2096447f7ad6';
        const { BDO, BUSD } = EBscToken;

        const create = lpHelper.getCreationCode('pancake');
        address = lpHelper.getPairAddress(BDO, BUSD, ...create);
        expect(address).toEqual(bdoBusd);
    });

    it('should load our created LP', async () => {
        const pool = await lpHelper.getPoolInfo(address, 'bep20');
        expect(pool.totalSupply).notZero();
    });
}).run();
