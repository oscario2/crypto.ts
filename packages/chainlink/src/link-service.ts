import { ContractService, TNetworkProvider } from '../deps.ts';
import { ELinkBsc } from './enums/bsc-link.ts';
import { TLinkReturn } from './link-types.ts';

export class LinkService {
    private static link = {} as Record<TNetworkProvider, ContractService>;

    // from AggregatorProxy
    private static abi = [
        'function description() external view returns (string memory)',
        'function latestAnswer() external view returns (int256)',
        'function decimals() external view returns (uint8)'
    ];

    /**
     * load chainlink instance
     */
    private static load(net: TNetworkProvider) {
        if (!this.link[net]) {
            this.link[net] = ContractService.fromAbi('', net, this.abi);
        }
        return this.link[net];
    }

    /**
     * get the USD value of ERC20 from chainlink
     * @param links
     */
    public static async getUsdValue(links: ELinkBsc[], net: TNetworkProvider) {
        const methods = ['description', 'latestAnswer', 'decimals'];
        const contract = this.load(net);

        // send N methods to each K link contract
        const value = (
            await contract.batch(
                // [[{ to, method }]] > [{ to, method }]
                links.flatMap(to =>
                    methods.map(method => {
                        return { to, method };
                    })
                )
            )
        ).flatMap(k => k) as TLinkReturn;

        const calls = methods.length;
        const total = calls * links.length;

        // slice into batches of methods.length
        const result = {} as Record<string, number>;
        for (let i = 0; i < total; i += calls) {
            const slice = value.slice(i, calls * (i + 1));
            const [name, usd, decimal] = slice as TLinkReturn;

            const key = name.toString().split(' / ')[0];
            result[key] = usd.div(10 ** decimal).toNumber();
        }
        return result;
    }
}
