import {
    AbiParser,
    AbiService,
    IAbi,
    ProviderService,
    TNetworkProvider
} from '../../deps.ts';
import { IBatch } from '../contract-types.ts';
import { evmHelper } from '../helpers/evm-helper.ts';
import { BatchService } from './batch-service.ts';

export class ContractService extends BatchService {
    // allow constructor to be initialized when extended
    protected constructor(
        private readonly address: string,
        private readonly abi: IAbi[],
        protected readonly provider: ProviderService
    ) {
        super(provider);
    }

    /**
     * match method and arguments to prevent ambiguous match
     * @param method
     * @param args
     * @returns
     */
    private matchAbi(method: string, args: unknown[]) {
        const abi = this.abi.filter(
            k => k.method == method && k.inputs.length == (args || []).length
        )[0];
        if (!abi) throw new Error(`No ABI found for ${method}(${args})`);

        return abi;
    }
    /**
     * accumulate and run 'get' call
     * @param input
     */
    public async batch(input: IBatch<string>[]) {
        const batch = input.map(({ to, method, args }) => {
            const abi = this.matchAbi(method, args || []);

            // encode
            const data = evmHelper.encode(args || [], abi);

            // map return types for decoding
            const outputs = abi.outputs.map(k => k.type);

            // add to batch, if no 'to' provided, use this contract address
            return { to: to ? to : this.address, data, outputs };
        });

        return await this.sendBatch(batch);
    }

    /**
     * call 'get' method of contract, no signer needed
     * @param method
     * @param args
     * @returns
     */
    public async get(method: string, ...args: unknown[]): Promise<unknown[]> {
        // revert spread syntax
        args = args[0] as unknown[];

        const abi = this.matchAbi(method, args);

        // encode
        const data = evmHelper.encode(args, abi);

        // call
        const { value } = await this.provider.call(
            { to: this.address, data },
            'latest'
        );

        // decode
        return evmHelper.decode(value, abi);
    }

    /**
     * factory from abi
     * @param address
     * @param net
     * @param abi
     * @returns
     */
    public static fromAbi(
        address: string,
        net: TNetworkProvider,
        abi: (string | IAbi)[]
    ) {
        if (!abi.length) throw new Error('ABI is empty');
        if (typeof abi[0] === 'string') {
            abi = AbiParser.parseAbi(abi as string[]);
        }
        const provider = ProviderService.from(net);

        return new ContractService(address, abi as IAbi[], provider);
    }

    /**
     * factory from code identification (requires abi storage)
     * @param address
     * @param net
     */
    public static async fromCode(address: string, net: TNetworkProvider) {
        const provider = ProviderService.from(net);
        const { value } = await provider.getCode(address);
        const _code = AbiService.getAbiFromCode(value);
    }
}
