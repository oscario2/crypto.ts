import { BlockRequest, BlockResponse } from './messages/block-message.ts';
import { RpcRequest, RpcResponse } from './messages/rpc-message.ts';
import { New, TDefaultBlock, TNetworkProvider } from './provider-types.ts';
import { UrlHelper } from './helpers/url-helper.ts';
import {
    ILogsRequest,
    LogsRequest,
    LogsResponse
} from './messages/logs-message.ts';
import {
    CallRequest,
    CallResponse,
    ICallRequest
} from './messages/call-message.ts';
import { CodeRequest, CodeResponse } from './messages/code-message.ts';

export class ProviderService {
    private constructor(
        private readonly url: string,
        public readonly batchUrl: string
    ) {}

    // https://infura.io/docs/ethereum/json-rpc/eth-call
    public async call(input: ICallRequest, block?: TDefaultBlock) {
        const req = new CallRequest(input, block);
        return await this.dispatch(req, CallResponse);
    }

    // https://infura.io/docs/ethereum/json-dispatch/eth-getBlockByNumber
    public async getBlock(block?: TDefaultBlock, includeTx?: boolean) {
        const req = new BlockRequest(block, includeTx);
        return await this.dispatch(req, BlockResponse);
    }

    // https://infura.io/docs/ethereum/json-rpc/eth-getCode
    public async getCode(address: string) {
        const req = new CodeRequest(address);
        return await this.dispatch(req, CodeResponse);
    }

    // https://infura.io/docs/ethereum/json-rpc/eth-getLogs
    public async getLogs(logs: ILogsRequest) {
        const req = new LogsRequest(logs);
        return await this.dispatch(req, LogsResponse);
    }

    //
    private async dispatch<T extends RpcResponse>(
        body: RpcRequest,
        ctor: New<T>
    ): Promise<T> {
        const res = await fetch(this.url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        } as RequestInit);

        if (res.status != 200) {
            throw new Error(`RPC status ${res.status}`);
        }

        const json = (await res.json()) as { error: string; result: T };
        if (json.error) throw new Error(JSON.stringify(json));

        return new ctor(json.result);
    }

    //
    private static clients = {} as Record<TNetworkProvider, ProviderService>;

    //
    public static from(net: TNetworkProvider) {
        const { clients } = this;

        const url = UrlHelper.getUrl(net);
        const batch = UrlHelper.getBatchUrl(net);

        return (clients[net] = new ProviderService(url, batch));
    }
}
