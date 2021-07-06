// // https://infura.io/docs/ethereum/json-rpc/eth-call
import { log } from '../../deps.ts';
import { BlockEntity } from '../entities/block-entity.ts';
import { TDefaultBlock } from '../provider-types.ts';
import { RpcRequest, RpcResponse } from './rpc-message.ts';

// request
export interface ICallRequest {
    from?: string;
    to: string;
    data: string;
}

export class CallRequest extends RpcRequest {
    constructor(input: ICallRequest, block?: TDefaultBlock) {
        super('eth_call', [input, BlockEntity.from(block).toString()]);
    }
}

// response
export class CallResponse extends RpcResponse {
    constructor(public readonly value: string) {
        if (value == '0x') {
            log.warn('Response was "0x". Are you on the right network?');
        }
        super();
    }
}
