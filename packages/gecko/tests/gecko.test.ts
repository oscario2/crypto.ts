import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { geckoService as service } from '../src/gecko-service.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2();

await describe('Gecko', () => {
    it('get erc20 usd price', async () => {
        const cake = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';
        const res = await service.getUsdValue(cake, 'bep20');
        expect(res[cake].usd).moreThen(0);
    });
}).run();
