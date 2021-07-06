import { cutils } from '../../deps.ts';
import { BlockEntity } from '../entities/block-entity.ts';
import { TDefaultBlock } from '../provider-types.ts';
import { RpcRequest, RpcResponse } from './rpc-message.ts';

// request
export class BlockRequest extends RpcRequest {
    constructor(block?: TDefaultBlock, includeTx?: boolean) {
        super('eth_getBlockByNumber', [BlockEntity.from(block), includeTx]);
    }
}

// response
interface IBlockResponse {
    number: string;
    transactions: string[];
    timestamp: string;
}

export class BlockResponse extends RpcResponse {
    public readonly number!: number;
    public readonly transactions!: string[];
    public readonly timestamp!: number;

    constructor({ number, transactions, timestamp }: IBlockResponse) {
        super();
        Object.assign(this, {
            number: cutils.fromHex(number),
            transactions,
            timestamp: cutils.fromHex(timestamp)
        });
    }
}
