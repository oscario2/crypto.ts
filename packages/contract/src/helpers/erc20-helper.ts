import { geckoService, TNetworkProvider } from '../../deps.ts';

class Erc20Helper {
    /**
     * get the USD value of ERC20 from coingecko
     * @param address
     * @param net
     * @returns
     */
    async getUsdValue(address: string | string[], net: TNetworkProvider) {
        // or create an LP pair with e.g USDC and get their ratio
        const res = await geckoService.getUsdValue(address, net);

        return Array.isArray(address)
            ? address.map(k => res[k.toLowerCase()].usd)
            : [res[address.toLowerCase()].usd];
    }
}

export const erc20Helper = new Erc20Helper();
