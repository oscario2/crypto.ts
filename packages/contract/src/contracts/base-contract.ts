import { IBatch } from '../contract-types.ts';
import { ContractService } from '../services/contract-service.ts';

export abstract class BaseContract {
    constructor(private readonly service: ContractService) {}

    /**
     * call single contract function
     * @param method
     * @param args
     * @returns
     */
    protected async _get<T>(method: string, args?: unknown[]) {
        const output = await this.service.get(method, args);
        return this.flatten(output) as T;
    }

    /**
     * call aggregate contract
     * @param batch
     * @returns
     */
    protected async _batch(batch: IBatch<string>[]): Promise<unknown[]> {
        const output = (await this.service.batch(batch)) as unknown[][];
        return output.map(k => this.flatten(k));
    }

    /**
     * return value directly if single output or else keep tuple
     * @param entity
     * @returns
     */
    private flatten(entity: unknown[]): unknown | unknown[] {
        return entity.length > 1 ? entity : entity[0];
    }
}
