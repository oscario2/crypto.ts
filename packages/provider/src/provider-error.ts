// deno-lint-ignore-file no-namespace
export namespace ErrorProvider {
    export class InvalidAddress extends Error {
        constructor() {
            super('Invalid address');
        }
    }

    export class InvalidType extends Error {
        constructor(value: unknown, type: string) {
            super(`${value} is invalid: '${type}'`);
        }
    }
}
