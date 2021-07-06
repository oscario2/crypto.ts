// properties of an abstract contract
type TAbstract<T> = T extends { prototype: infer U } ? U : never;

// exclude methods from extended abstract class - 'batch
export type TExclude<C, A> = keyof Omit<C, keyof TAbstract<A> | 'batch'>;

// batch call
export interface IBatch<T> {
    to?: string; // which address
    method: T; // which method to call
    args?: unknown[]; // parameters
}

// batch call post abi encoding
export interface IEncodedBatch {
    to: string; // which address
    data: string; // encoded byte[]
    outputs: string[]; // return types to decode
}

export interface IPairInfoToken {
    address: string;
    reserve: number;
    ratio: number; // t0 / t1
    usd: number;
}

// v2 pair
export interface IPairInfo {
    tokens: IPairInfoToken[];
    totalSupply: number;
    totalValueLocked: number;
    pricePerToken: number;
}
