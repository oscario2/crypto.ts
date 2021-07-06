// https://infura.io/docs/ethereum/json-rpc/eth-getCode
import { cutils } from '../../deps.ts';
import { BlockEntity } from '../entities/block-entity.ts';
import { TDefaultBlock } from '../provider-types.ts';
import { RpcRequest, RpcResponse } from './rpc-message.ts';

// request
export class CodeRequest extends RpcRequest {
    constructor(address: string, block?: TDefaultBlock) {
        if (!cutils.validAddress(address)) throw new Error('Invalid value');
        super('eth_getCode', [address, BlockEntity.from(block)]);
    }
}

// response
export class CodeResponse extends RpcResponse {
    constructor(public readonly value: string) {
        super();
    }
}
