import { log } from '../../deps.ts';
import { Entity } from '../entities/entity.ts';
import { TMethod } from '../provider-types.ts';

// request
export abstract class RpcRequest {
    private static count = 0;

    private readonly jsonRpc = '2.0';
    private readonly id: number;
    private readonly method: TMethod;
    private readonly params: unknown[];

    constructor(method: TMethod, params: unknown[]) {
        // increment
        this.id = RpcRequest.count++;

        //
        this.method = method;

        // TODO: unpack nested entities @oscario2
        this.params = params.map(k => {
            return k instanceof Entity ? k.toString() : k;
        });

        log.debug(this);
    }
}

// response
export abstract class RpcResponse {
    constructor() {}
}
