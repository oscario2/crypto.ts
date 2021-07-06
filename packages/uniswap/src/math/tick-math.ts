import { Big, Bigish } from '../../deps.ts';
import invariant from '../utils/invariant.ts';
import { MAX_TICK, MIN_TICK, ONE, UINT256, ZERO } from '../uniswap-types.ts';

function mulShift(ratio: Big, mulBy: string): Big {
    // (ratio * mulBy) >> 128;
    return ratio.mul(mulBy).rshift(new Big(128));
}

/**
 * sqrt ratio as Q64.96, sqrt ratio is computed as sqrt(1.0001)^tick
 * 0.01% is one tick basis point = 1.0001
 * @param tick the tick for which to compute the sqrt ratio
 */
export function getSqrtRatioAtTick(tick: number) {
    invariant(
        tick >= MIN_TICK && tick <= MAX_TICK && Number.isInteger(tick),
        'TICK'
    );
    const absTick: number = tick < 0 ? tick * -1 : tick;

    let ratio =
        (absTick & 0x1) != 0
            ? new Big('0xfffcb933bd6fad37aa2d162d1a594001')
            : new Big('0x100000000000000000000000000000000');

    // lookup table for 1/sqrt(1.0001)^1, 1/sqrt(1.0001)^2, 1/sqrt(1.0001)^4
    // const sqrt = toBig(1.0001).sqrt().pow(tick);
    if ((absTick & 0x2) != 0)
        ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a');
    if ((absTick & 0x4) != 0)
        ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc');
    if ((absTick & 0x8) != 0)
        ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0');
    if ((absTick & 0x10) != 0)
        ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644');
    if ((absTick & 0x20) != 0)
        ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0');
    if ((absTick & 0x40) != 0)
        ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861');
    if ((absTick & 0x80) != 0)
        ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053');
    if ((absTick & 0x100) != 0)
        ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4');
    if ((absTick & 0x200) != 0)
        ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54');
    if ((absTick & 0x400) != 0)
        ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3');
    if ((absTick & 0x800) != 0)
        ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9');
    if ((absTick & 0x1000) != 0)
        ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825');
    if ((absTick & 0x2000) != 0)
        ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5');
    if ((absTick & 0x4000) != 0)
        ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7');
    if ((absTick & 0x8000) != 0)
        ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6');
    if ((absTick & 0x10000) != 0)
        ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9');
    if ((absTick & 0x20000) != 0)
        ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604');
    if ((absTick & 0x40000) != 0)
        ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98');
    if ((absTick & 0x80000) != 0)
        ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2');

    if (tick > 0) ratio = UINT256.div(ratio);

    // ratio >> 32
    const n1 = ratio.rshift(new Big(32));

    // ratio % (1 << 32)
    const n2 = ratio.mod(ONE.lshift(new Big(32)));

    // downcast Q128 to Q96
    // sqrtPriceX96 = uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
    return n2.gt(0) ? n1.add(ONE) : n1.add(ZERO);
}

/**
 * invert of pow(1.0001) log with 1.0001 as base
 * @param sqrtPriceX96
 */
function _getTickAtSqrtRatio(_sqrtPriceX96: Bigish) {
    throw new Error('Not implemented');
    // 32 << 4 = 32 * (2 ** 4)
    // 32 >> 4 = 32 / (2 ** 4)

    // find most significant bit with binary search in YUL code
    // each lookup is Math.log2(0xFFF) = 128 or a power of 2
    // solidity implementation in BitMath.sol
}
