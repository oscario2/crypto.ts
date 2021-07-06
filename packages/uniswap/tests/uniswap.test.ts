import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { UniswapV3Contract } from '../deps.ts';
import { PoolEntity } from '../src/entities/pool-entity.ts';
import { getAmount1ForLiquidity } from '../src/math/liquidity-math.ts';
import { decodeSqrtRatioX96 } from '../src/math/ratio-math.ts';
import { getSqrtRatioAtTick } from '../src/math/tick-math.ts';
import { EFeeAmount, TICK_SPACINGS } from '../src/uniswap-types.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Uniswap');

await describe('Math', () => {
    it('should get price from tick', () => {
        const decimals0 = 1e8; // btc
        const decimals1 = 1e18; // eth

        // decimals for price
        const decimals =
            decimals0 > decimals1
                ? decimals0 / decimals1
                : decimals1 / decimals0;

        const tick = 258480;
        const sqrtRatioX96 = getSqrtRatioAtTick(tick);

        const decode = decodeSqrtRatioX96(sqrtRatioX96).toNumber() / 1e18;

        const price0 = decode / decimals;
        const price1 = 1 / price0;
        const ratio = price0 * price1;

        // x * y = k
        expect(ratio.toString()).toEqual('1');
        expect(sqrtRatioX96.toString()).toEqual(
            '32465406531468680041045365772906921'
        );
    });

    it('should get amount', () => {
        const sqrtRatioAX96 = '7451758278155965926652426830';
        const sqrtRatioBX96 = '7474145998413514579387510241';
        const liquidity = '1276745866900433153354959';

        const amount1 = getAmount1ForLiquidity(
            sqrtRatioAX96,
            sqrtRatioBX96,
            liquidity
        );

        expect(amount1.toString()).toEqual('360773598693547219585');
    });
}).run();

await describe('Pool', async () => {
    const btcEth = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed';
    const contract = await UniswapV3Contract.from(btcEth, 'erc20');

    it('should get tick spacing', async () => {
        const fee = (await contract.fee()) as EFeeAmount;
        const spacing = TICK_SPACINGS[fee as EFeeAmount];

        expect(fee).toEqual(3000);
        expect(spacing).toEqual(60);
    });

    it('should get pool address from 2 tokens', async () => {
        const token0 = '0x514910771af9ca656af840dff83e8264ecf986ca';
        const token1 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

        const pool = await PoolEntity.from(token0, token1, 3000);
        await pool.getReserves();

        const tvl = await pool.getTotalLocked();
        console.log(tvl);
    });
}).run();
