import { cutils } from '../../deps.ts';
import { BlockEntity } from '../entities/block-entity.ts';
import { TDefaultBlock } from '../provider-types.ts';
import { RpcRequest, RpcResponse } from './rpc-message.ts';

// request
export interface ILogsRequest {
    fromBlock: TDefaultBlock;
    toBlock: TDefaultBlock;
    topics: unknown[];
    address?: string;
}

export class LogsRequest extends RpcRequest {
    constructor({ fromBlock, toBlock, topics, address }: ILogsRequest) {
        if (fromBlock > toBlock) {
            throw new Error('fromBlock larger than toBlock');
        }
        super('eth_getLogs', [
            {
                fromBlock: BlockEntity.from(fromBlock).toString(),
                toBlock: BlockEntity.from(toBlock).toString(),
                topics: topics.map((k, i) => {
                    if (i == 0) {
                        // first topic is method
                        return cutils.keccak256(k as string);
                    }
                    // if OR filter
                    const topic = Array.isArray(k) ? k : [k];
                    return topic.map(
                        // expand each topic to 32-bytes
                        k => '0x' + k.padStart(66, '0').replace('0x', '')
                    );
                }),
                address: address
            }
        ]);
    }
}

// response
export class ILog {
    address!: string;
    topics!: string[];
    data!: string;
    transactionHash!: string;
}

export class LogsResponse extends RpcResponse {
    public logs: ILog[];

    constructor(logs: ILog[]) {
        super();
        this.logs = logs;
    }
}
