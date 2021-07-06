import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { Big } from '../deps.ts';
import { Erc20Contract } from '../index.ts';
import { IBatch } from '../src/contract-types.ts';
import { TErc20Contract } from '../src/contracts/erc20-contract.ts';
import { UniswapV3Contract } from '../src/contracts/uniswapv3-contract.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Contract');

describe('UniswapV3', () => {
    let contract = {} as UniswapV3Contract;
    const btcEth = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed';

    it('should load pool contract', async () => {
        contract = await UniswapV3Contract.from(btcEth, 'erc20');
    });

    it('should get slot', async () => {
        const { tick } = await contract.slot0();
        expect(tick).notZero();
    });

    it('should get tick', async () => {
        const { secondsOutside } = await contract.ticks(257400);
        expect(secondsOutside).notZero();
    });

    it('should get TVL', async () => {
        const [token0, token1] = (await contract.batch([
            { method: 'token0' },
            { method: 'token1' }
        ])) as [string, string];

        //
        const erc20 = await Erc20Contract.from(token0, 'erc20');

        //
        const send = [token0, token1].flatMap(to => {
            return [
                { to, method: 'name' },
                { to, method: 'balanceOf', args: [btcEth] },
                { to, method: 'decimals' }
            ] as IBatch<TErc20Contract>[];
        });

        //
        const batch = await erc20.batch(send);

        //
        const step = batch.length / 2;
        for (let i = 0; i < batch.length; i += step) {
            const [name, balanceOf, decimals] = batch.slice(i, i + step) as [
                string,
                Big,
                number
            ];
            console.log(name, balanceOf.div(10 ** decimals).toNumber());
        }
    });
}).run();
