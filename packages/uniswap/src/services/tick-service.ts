import { Big } from '../../deps.ts';
import {
    IBatch,
    IUniswapSlot0,
    IUniswapTick,
    TUniswapV3Contract,
    UniswapV3Contract
} from '../../deps.ts';
import {
    EFeeAmount,
    MAX_TICK,
    MIN_TICK,
    TICK_SPACINGS
} from '../uniswap-types.ts';

export enum EDirection {
    Asc,
    Des
}

export interface ITickProcessed {
    liquidityActive: Big;
    liquidityGross: Big;
    liquidityNet: Big;
    tickIdx: number;
}

/**
 * computes the numSurroundingTicks above or below the active tick
 * @param activeTickProcessed current active tick in pool
 * @param numSurroundingTicks the number of ticks we'd like to process either up or down
 * @param tickSpacing the space between each tick in pool
 * @param tickMap tick data with tickIdx as key
 * @param direction if we're iterating up or down from activeTickProcessed
 */
export function computeSurroundingTicks(
    activeTickIdx: number,
    numSurroundingTicks: number,
    tickSpacing: number,
    tickMap: Record<number, ITickProcessed>,
    direction: EDirection
) {
    // active tick is the one which holds the active liquidity
    let previousTickProcessed: ITickProcessed = {
        ...tickMap[activeTickIdx]
    };
    let processedTicks: ITickProcessed[] = [];

    for (let i = 0; i < numSurroundingTicks; i++) {
        // traverse up or down
        const currentTickIdx =
            direction == EDirection.Asc
                ? previousTickProcessed.tickIdx + tickSpacing
                : previousTickProcessed.tickIdx - tickSpacing;

        if (currentTickIdx < MIN_TICK || currentTickIdx > MAX_TICK) {
            break;
        }

        // set previous liquidity to current tick id, if i = 0 it's the pools current liquidity
        const currentTickProcessed: ITickProcessed = {
            liquidityActive: previousTickProcessed.liquidityActive,
            tickIdx: currentTickIdx,
            liquidityNet: new Big(0),
            liquidityGross: new Big(0)
        };

        // is current tick is initialized
        const currentTick: ITickProcessed = tickMap[currentTickIdx];
        if (!currentTick) {
            console.log(`Tick ${currentTickIdx} not intialized`);
            continue;
        }

        // if so copy gross and net liquidity
        if (currentTick) {
            currentTickProcessed.liquidityGross = currentTick.liquidityGross;
            currentTickProcessed.liquidityNet = currentTick.liquidityNet;
        }

        // apply net liquidity from current tick if iterating ASC
        if (direction == EDirection.Asc && currentTick) {
            currentTickProcessed.liquidityActive =
                previousTickProcessed.liquidityActive.add(
                    currentTick.liquidityNet
                );
        } else if (
            direction == EDirection.Des &&
            !previousTickProcessed.liquidityNet.eq(0)
        ) {
            // apply net liquidity from previous tick if iterating DES;
            currentTickProcessed.liquidityActive =
                previousTickProcessed.liquidityActive.sub(
                    previousTickProcessed.liquidityNet
                );
        }

        //
        processedTicks.push(currentTickProcessed);

        // prepare for next tick
        previousTickProcessed = currentTickProcessed;
    }

    // keep the order in unison despite the direction
    if (direction == EDirection.Des) {
        processedTicks = processedTicks.reverse();
    }

    return processedTicks;
}

/**
 * fetch N amount of ticks in 2 rpc calls
 * @param address address to LP pair
 * @param numSurroundingTicks
 */
export async function fetchSurroundingTicks(
    address: string,
    numSurroundingTicks: number
) {
    //
    const contract = await UniswapV3Contract.from(address, 'erc20');

    // get pool state
    const [fee, _slot0, liquidity] = (await contract.batch([
        { method: 'fee' },
        { method: 'slot0' },
        { method: 'liquidity' }
    ])) as [EFeeAmount, unknown[], Big, string, string];

    //
    const tickSpacing = TICK_SPACINGS[fee];
    const { tick } = new IUniswapSlot0(_slot0);

    // pools current tick isn't necessarily a tick that can be intialized
    // find nearest tick valid tick given the tick spacing
    const activeTickIdx = Math.floor(tick / tickSpacing) * tickSpacing;

    // search bounds must take into account fee spacing
    let tickLow = activeTickIdx - numSurroundingTicks * tickSpacing;
    let tickHigh = activeTickIdx + numSurroundingTicks * tickSpacing;

    // prevent under/overflow
    tickLow = tickLow < MIN_TICK ? MIN_TICK : tickLow;
    tickHigh = tickHigh > MAX_TICK ? MAX_TICK : tickHigh;

    // batch request info for each tick
    const batchTicks = [] as number[];
    const send = [] as IBatch<TUniswapV3Contract>[];

    // + tickSpacing to exclude activeTick's iteration
    for (let i = tickLow; i <= tickHigh + tickSpacing; i += tickSpacing) {
        batchTicks.push(i);
        send.push({ to: address, method: 'ticks', args: [i] });
    }

    // send batch and map return to class
    const result = (await contract.batch(send)).map(
        k => new IUniswapTick(k as unknown[])
    );

    // order is preserved from batch
    const tickMap = {} as Record<number, ITickProcessed>;

    for (const i in result) {
        const { liquidityGross, liquidityNet } = result[i];
        const tickIdx = batchTicks[i];

        // virtual liquidity for surrounding ticks are delta from the pools current liquidity
        const liquidityActive =
            tickIdx == activeTickIdx ? liquidity : new Big(0);

        // keep format identical to thegraph
        tickMap[tickIdx] = {
            liquidityActive,
            liquidityGross: new Big(liquidityGross.toString()),
            liquidityNet: new Big(liquidityNet.toString()),
            tickIdx
        };
    }

    return { activeTickIdx, tickSpacing, tickMap };
}
