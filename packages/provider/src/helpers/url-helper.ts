import { TNetworkProvider } from '../provider-types.ts';

export class UrlHelper {
    /**
     * aggregate contract @ https://github.com/makerdao/multicall
     * @param net
     * @returns
     */
    public static getBatchUrl(net: TNetworkProvider): string {
        switch (net) {
            case 'erc20':
                return '0xeefba1e63905ef1d7acba5a8513c70307c1ce441';
            case 'bep20':
                return '0x41263cba59eb80dc200f3e2544eda4ed6a90e76c';
            case 'matic':
                return '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507';
        }
    }

    /**
     * @param net
     * @param archive
     * @returns
     */
    public static getUrl(net: TNetworkProvider, archive?: boolean): string {
        const id = '16210e2a239e7d8357775fff';
        const base = 'https://speedy-nodes-nyc.moralis.io/' + id;
        const node = archive ? '/archive' : '';

        switch (net) {
            case 'erc20':
                // return 'https://mainnet.infura.io/v3/b9d4eea182a74136bad8d67fdd187160';
                return base + '/eth/mainnet' + node;
            case 'bep20':
                // return 'https://bsc-dataseed.binance.org/';
                return base + '/bsc/mainnet' + node;
            case 'matic':
                // return 'https://rpc-mainnet.maticvigil.com/v1/0652a5baba0f29666852e4925ab415f1b7297fd4';
                return base + '/polygon/mainnet/archive';
        }
    }
}
