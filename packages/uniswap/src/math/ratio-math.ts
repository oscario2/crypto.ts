import { Big, Bigish } from '../../deps.ts';

/**
 * return the sqrt ratio as a Q64.96 corresponding to a given ratio of amount1 and amount0
 * @param amount1 the numerator amount, i.e. amount of token1
 * @param amount0 the denominator amount, i.en amount of token0
 */
export function encodeSqrtRatioX96(amount1: Bigish, amount0: Bigish): Big {
    const numerator = new Big(amount1).lshift(192);
    const denominator = new Big(amount0);
    const ratioX192 = numerator.div(denominator);
    return ratioX192.sqrt();
}

/**
 * decode sqrt(token1/token0) * Q64.96
 * @param sqrtRatioX96
 */
export function decodeSqrtRatioX96(sqrtRatioX96: Bigish) {
    const denominator = new Big(1e18); // n decimals to expand to
    const ratioX96 = new Big(sqrtRatioX96)
        .mul(denominator)
        .div(new Big(2).pow(96));
    return ratioX96.mul(ratioX96).div(denominator); // downcast
}
