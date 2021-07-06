import JSBI from 'https://cdn.skypack.dev/jsbi?dts';

export type Bigish = Big | JSBI | number | string;
const MAX_SAFE_INTEGER = JSBI.BigInt(Number.MAX_SAFE_INTEGER);
const ONE = JSBI.BigInt(1);
const TWO = JSBI.BigInt(2);

// immutable
export class Big {
    private readonly bn: JSBI;

    constructor(n: Bigish) {
        if (Number(n.toString()) % 1 !== 0) {
            throw new Error('float not allowed');
        }

        this.bn = JSBI.BigInt(n);
    }

    private call(method: keyof typeof JSBI, n: Bigish) {
        const v = (JSBI[method] as (a: JSBI, b: JSBI) => JSBI)(
            this.toJSBI(),
            JSBI.BigInt(n)
        );
        return new Big(v);
    }

    // arithmetic
    public add(n: Bigish): Big {
        return this.call('add', n);
    }

    public sub(n: Bigish): Big {
        return this.call('subtract', n);
    }

    public div(n: Bigish): Big {
        return this.call('divide', n);
    }

    public mod(n: Bigish): Big {
        return this.call('remainder', n);
    }

    public mul(n: Bigish): Big {
        return this.call('multiply', n);
    }

    public pow(n: Bigish): Big {
        return this.call('exponentiate', n);
    }

    public eq(n: Bigish): boolean {
        return JSBI.equal(this.toJSBI(), JSBI.BigInt(n));
    }

    public lt(n: Bigish): boolean {
        return JSBI.lessThan(this.toJSBI(), JSBI.BigInt(n));
    }

    public lte(n: Bigish): boolean {
        return JSBI.lessThanOrEqual(this.toJSBI(), JSBI.BigInt(n));
    }

    public gt(n: Bigish): boolean {
        return JSBI.greaterThan(this.toJSBI(), JSBI.BigInt(n));
    }

    public gte(n: Bigish): boolean {
        return JSBI.greaterThanOrEqual(this.toJSBI(), JSBI.BigInt(n));
    }

    public lshift(shift: Bigish): Big {
        return this.call('leftShift', shift);
    }

    public rshift(shift: Bigish): Big {
        return this.call('signedRightShift', shift);
    }

    /**
     * computes floor(sqrt(value))
     * @param value the value for which to compute the square root, rounded down
     */
    public sqrt() {
        const v = new Big(this.bn);
        if (v.lte(0)) throw new Error('value cannot be zero or negative');

        // rely on built in sqrt if possible
        if (v.lt(MAX_SAFE_INTEGER)) {
            return new Big(Math.floor(Math.sqrt(v.toNumber())));
        }

        let z = v;
        let x = v.div(TWO).add(ONE);
        while (x.lt(z)) {
            z = x;
            x = v.div(x).add(x).div(TWO);
        }
        return z;
    }

    // helpers
    public toJSBI(): JSBI {
        return this.bn;
    }

    public toNumber(): number {
        return Number(this.bn.toString());
    }

    public toString(): string {
        return this.bn.toString();
    }

    /**
     * divide by 10 ** decimals
     * @param decimals
     * @returns
     */
    public toDecimal(decimals?: number): number {
        // TODO: doesn't account for pre-zeros e.g '0.008'
        const divisor = new Big(10).pow(decimals || 1);
        const beforeDecimal = this.div(divisor);
        const afterDecimal = this.mod(divisor);

        return Number(beforeDecimal.toString() + '.' + afterDecimal.toString());
    }

    // factory
    public static from(n: Bigish) {
        return new Big(n);
    }
}
