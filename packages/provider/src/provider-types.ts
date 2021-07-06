// deno-lint-ignore-file no-explicit-any
export type TDefaultBlock = number | 'latest' | 'earliest' | 'pending';
export type TNetworkProvider = 'erc20' | 'bep20' | 'matic';

export type TMethod =
    | 'eth_call'
    | 'eth_getBlockByNumber'
    | 'eth_getTransactionReceipt'
    | 'eth_getCode'
    | 'eth_getLogs';

export interface New<T> {
    new (...args: any[]): T;
}
