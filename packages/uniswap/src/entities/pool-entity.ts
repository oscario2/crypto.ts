import { Big, Erc20Contract } from '../../deps.ts';
import { getAmount1ForLiquidity } from '../math/liquidity-math.ts';
import {
    computeSurroundingTicks,
    EDirection,
    fetchSurroundingTicks,
    ITickProcessed
} from '../services/tick-service.ts';
import { EFeeAmount, TICK_SPACINGS } from '../uniswap-types.ts';
import { getSqrtRatioAtTick } from '../math/tick-math.ts';
import { TokenEntity } from './token-entity.ts';
import { decodeSqrtRatioX96 } from '../math/ratio-math.ts';

interface IPoolTickState {
    tick0: number;
    tick1: number;
    price0: number;
    price1: number;
    token0Amount: number;
    token1Amount: number;
}

export class PoolEntity {
    // map of processed ticks
    private tickMap!: Record<number, ITickProcessed>;

    // currently active tick of pool
    private activeTickIdx!: number;

    // reserves of each tick (virtual liquidity)
    private reserves!: Record<string, IPoolTickState>;

    // since last request for ticks
    private lastUpdated: number;

    private constructor(
        public readonly address: string,
        public readonly token0: TokenEntity,
        public readonly token1: TokenEntity,
        private fee: EFeeAmount
    ) {
        this.lastUpdated = 0;
        this.reserves = {};
    }

    /**
     * total amount of locked tokens in pool
     */
    public async getTotalLocked() {
        const { address, token0, token1 } = this;
        const erc20 = await Erc20Contract.from(token0.address, 'erc20');

        const [tvlToken0, tvlToken1] = (await erc20.batch([
            { to: token0.address, method: 'balanceOf', args: [address] },
            { to: token1.address, method: 'balanceOf', args: [address] }
        ])) as [Big, Big]; // bignumber.js

        return {
            tvlToken0: Math.round(tvlToken0.toNumber() / 1e18),
            tvlToken1: Math.round(tvlToken1.toNumber() / 1e18)
        };
    }

    /**
     * the liquidity for a tick as presented in 'info.uniswap.com'
     * @param numSurroundingTicks
     */
    public async getReserves(numSurroundingTicks?: number) {
        const minutes = 2 * 60e3; // refresh every 2nd minute
        if (this.lastUpdated < Date.now() - minutes) {
            Object.assign(this, await this.loadTicks(numSurroundingTicks || 5));
        }
        const { token0, token1, tickMap, fee } = this;

        const decimals0 = 10 ** token0.decimals;
        const decimals1 = 10 ** token1.decimals;

        //
        const spacing = TICK_SPACINGS[fee];

        // decimals for price
        const mod =
            decimals0 > decimals1
                ? decimals0 / decimals1
                : decimals1 / decimals0;

        //
        this.lastUpdated = Date.now();

        // https://uniswap.org/docs/v2/advanced-topics/understanding-returns/
        return Object.keys(tickMap).map(idx => {
            const tickIdx = Number(idx);
            if (!tickMap[tickIdx + spacing]) return [];

            const a = tickMap[tickIdx];
            const b = tickMap[tickIdx + spacing];

            // getSqrtRatio with BigNumber?
            const sqrtRatioAX96 = getSqrtRatioAtTick(a.tickIdx);
            const sqrtRatioBX96 = getSqrtRatioAtTick(b.tickIdx);
            const liquidity = a.liquidityActive; // if negative ticks, use b liquidity

            const amount1 = Number(
                getAmount1ForLiquidity(sqrtRatioAX96, sqrtRatioBX96, liquidity)
            ); // JSBI rounds -amount1 * -1

            // x * y = k
            const space0 = decodeSqrtRatioX96(sqrtRatioAX96).toNumber() / 1e18;
            const space1 = 1 / space0;

            // amount of tokens required from A to B
            let price0 = decodeSqrtRatioX96(sqrtRatioBX96).toNumber() / 1e18;
            let price1 = 1 / price0;
            const _ratio = price0 * price1;

            // site does arithmetic on price with 3 decimals
            price0 = Number((price0 / mod).toFixed(4));
            price1 = Number((price1 * mod).toFixed(4));

            const token0Amount = (amount1 * price1) / decimals1;
            const token1Amount = amount1 / decimals1;

            // sites round tvl > 100 to nearest 10 significand (mantissa)
            // numbro(num).format({ average: true,  mantissa: num > 1000 ? 2 : 2 })
            const token0Mantissa =
                token0Amount >= 1000
                    ? Math.round(token0Amount / 100) * 100
                    : token0Amount;

            //
            const token1Mantissa =
                token1Amount >= 1000
                    ? Math.round(token1Amount / 100) * 100
                    : token1Amount;

            //
            const state = {
                sqrt0X96: sqrtRatioAX96.toString(),
                sqrt1X96: sqrtRatioBX96.toString(),
                tick0: a.tickIdx,
                tick1: b.tickIdx,
                price0: Number((space0 / mod).toFixed(4)),
                price1: Number((space1 * mod).toFixed(4)),
                token0Amount: Number(token0Mantissa.toFixed(2)),
                token1Amount: Number(token1Mantissa.toFixed(2))
            };

            //
            this.reserves[a.tickIdx] = state;

            return state;
        });
    }

    /**
     * fetch N amount of ticks
     * @param numSurroundingTicks num of ticks before and after active
     */
    private async loadTicks(numSurroundingTicks?: number) {
        const numTicks = (numSurroundingTicks ?? 5) as number;
        const { activeTickIdx, tickSpacing, tickMap } =
            await fetchSurroundingTicks(this.address, numTicks);

        const [subsequentTicks, previousTicks] = [
            EDirection.Asc,
            EDirection.Des
        ].map(direction => {
            return computeSurroundingTicks(
                activeTickIdx,
                numTicks,
                tickSpacing,
                tickMap,
                direction
            );
        });

        // pre, active, post
        const processedTicks = previousTicks
            .concat(tickMap[activeTickIdx])
            .concat(subsequentTicks);

        // object.keys always casts to string
        this.tickMap = {} as Record<string, ITickProcessed>;
        for (const tick of processedTicks) {
            tickMap[tick.tickIdx] = tick;
        }

        return { tickMap, activeTickIdx };
    }

    //
    public static async from(token0: string, token1: string, fee: EFeeAmount) {
        const tokenA = await TokenEntity.from(token0);
        const tokenB = await TokenEntity.from(token1);
        const pair = tokenA.getPairAddress(tokenB, fee);

        return new PoolEntity(pair, tokenA, tokenB, fee);
    }
}
