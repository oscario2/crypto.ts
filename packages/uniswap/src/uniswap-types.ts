import { Big } from '../deps.ts';

// from fixedPoint.sol
export class FixedPoint96 {
    public static readonly RESOLUTION = 96;
    public static readonly Q96 = new Big(2).pow(96);
}

// the default factory enabled fee amounts, denominated in hundredths of bips.
export enum EFeeAmount {
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000
}

// the default factory tick spacings by fee amount.
export const TICK_SPACINGS: { [amount in EFeeAmount]: number } = {
    [EFeeAmount.LOW]: 10,
    [EFeeAmount.MEDIUM]: 60,
    [EFeeAmount.HIGH]: 200
};

/////////////////////
// TICKS
/////////////////////

// computed from log base 1.0001 of 2**-128
export const MIN_TICK = -887272;

// computed from log base 1.0001 of 2**128
export const MAX_TICK = -MIN_TICK;

//
export const DEFAULT_SURROUNDING_TICKS = 300;

//
export const UINT256 = new Big(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

export const ZERO = new Big(0);
export const ONE = new Big(1);
export const TWO = new Big(2);
export const Q32 = new Big(2).pow(32);
