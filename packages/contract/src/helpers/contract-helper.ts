import { IAbi } from '../../deps.ts';

export class ContractHelper {
    /**
     * if ABI match 'class' prototype
     * @param prototype
     * @param abi
     * @returns
     */
    public isContractType<T>(prototype: T, abi: IAbi[]): boolean {
        // methods of prototype
        const methods = Object.keys(
            Object.getOwnPropertyDescriptors(prototype)
        ).filter(k => ['constructor', 'get', 'batch'].indexOf(k) == -1);

        const known = abi.filter(k => ~methods.indexOf(k.method));

        // if match fails, it could be that 'method(uint)' should be 'method(uint256)'
        if (methods.length != known.length) {
            console.log(`Matched ${known.length}/${methods.length}`, methods);
        }

        return methods.length == known.length;
    }

    /**
     * if contract uses delegatecall
     */
    isProxyContract() {
        // TODO
    }
}

export const contractHelper = new ContractHelper();
