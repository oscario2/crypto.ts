import { Big, Bigish } from '../../deps.ts';
import { FixedPoint96 } from '../uniswap-types.ts';

/**
 * calculates floor((a * b) / denominator)
 * https://docs.uniswap.org/reference/core/libraries/FullMath#muldiv
 * @param number
 * @param numerator
 * @param denominator
 */
function mulDiv(number: Big, numerator: Big, denominator: Big) {
    return number.mul(numerator).div(denominator);
}

/**
 * computes the amount of token0 for a given amount of liquidity and a price range
 * @param sqrtRatioAX96 a sqrt price representing the first tick boundary
 * @param sqrtRatioBX96 a sqrt price representing the second tick boundary
 * @param liquidity amount of usable liquidity
 * @returns amount of token0 required to cover a position of size liquidity between the two passed prices
 */
// https://github.com/Uniswap/uniswap-v3-core/blob/main/contracts/libraries/SqrtPriceMath.sol#L153
export function getAmount0ForLiquidity(
    sqrtRatioAX96: Big,
    sqrtRatioBX96: Big,
    liquidity: Big
): Big {
    if (sqrtRatioAX96.toString() > sqrtRatioBX96.toString()) {
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    sqrtRatioAX96 = new Big(sqrtRatioAX96);
    sqrtRatioBX96 = new Big(sqrtRatioBX96);
    liquidity = new Big(liquidity);

    const numerator1 = liquidity.lshift(FixedPoint96.RESOLUTION);
    const numerator2 = sqrtRatioBX96.sub(sqrtRatioAX96);

    return mulDiv(numerator1, numerator2, sqrtRatioBX96).div(sqrtRatioAX96);
}

/**
 * computes the amount of token1 for a given amount of liquidity and a price range
 * @param sqrtRatioAX96 a sqrt price representing the first tick boundary
 * @param sqrtRatioBX96 a sqrt price representing the second tick boundary
 * @param liquidity the liquidity being valued
 */
export function getAmount1ForLiquidity(
    sqrtRatioAX96: Bigish,
    sqrtRatioBX96: Bigish,
    liquidity: Bigish
): Big {
    if (sqrtRatioAX96.toString() > sqrtRatioBX96.toString()) {
        [sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96];
    }

    return mulDiv(
        new Big(liquidity),
        new Big(sqrtRatioBX96).sub(sqrtRatioAX96),
        FixedPoint96.Q96
    );
}
