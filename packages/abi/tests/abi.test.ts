// deno-lint-ignore-file
import { X2 } from 'https://raw.githubusercontent.com/oscario2/x2/v0.0.1/index.ts';
import { AbiParser, AbiService } from '../index.ts';

// to debug, set "debug.javascript.usePreview" to false
const { describe, it, expect } = new X2('Conract');

describe('ABI', () => {
    it('should parse function', () => {
        const methods: string[] = [
            'uint8 public constant i = 18;',
            'function a()',
            'function b(string name)',
            'function c(string memory name)',
            'function d() returns(address)',
            'function e() returns (address)',
            'function f() returns (address pool)',
            'function g() returns (IErc20 token)',
            'function h(uint256[] nums) returns(address pool, uint256 liquidity)'
        ];

        const abi = AbiParser.parseAbi(methods);
        expect(Object.keys(abi).length).toEqual(methods.length);

        const ts = AbiService.toInterface('Test', abi);
        expect(ts.split('\n').length - 2).toEqual(methods.length);
    });

    it('should get ABI from code', () => {
        AbiService.addToStorage('function name() returns (string)');

        // snippet of ERC20 contract containing public 'name' function
        const code = '35761012c565b806306fdde0314610131578063095ea7b314';
        const match = AbiService.getAbiFromCode(code);

        expect(Object.keys(match).length).toEqual(1);
    });
}).run();
