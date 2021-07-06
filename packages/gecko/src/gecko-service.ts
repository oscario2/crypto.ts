import { TNetworkProvider } from '../deps.ts';
import { ITokenPrice } from './gecko-types.ts';

class GeckoService {
    private root = 'https://api.coingecko.com/api/v3';

    /**
     * string or array of token addresses
     * @param address
     * @param net
     * @returns
     */
    async getUsdValue(address: string | string[], net: TNetworkProvider) {
        const format = Array.isArray(address)
            ? address.join(',').toLowerCase()
            : address.toLowerCase();

        const chain = this.getChain(net);
        const url = `${this.root}/simple/token_price/${chain}?contract_addresses=${format}&vs_currencies=usd`;

        return await this.send<ITokenPrice>(url);
    }

    /**
     *
     * @param net
     * @returns
     */
    private getChain(net: TNetworkProvider) {
        switch (net) {
            case 'bep20':
                return 'binance-smart-chain';
        }
    }

    /**
     *
     * @param url
     * @returns
     */
    private async send<T>(url: string) {
        const res = await fetch(url, {
            method: 'GET',
            headers: { accept: 'application/json' }
        } as RequestInit);

        if (res.status != 200) {
            throw new Error(`HttpError: code ${res.status}`);
        }

        return (await res.json()) as T;
    }
}

export const geckoService = new GeckoService();
