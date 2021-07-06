// deno-lint-ignore-file no-explicit-any
export default function invariant(
    condition: any,
    message?: string
): asserts condition {
    if (condition) {
        return;
    }
    throw new Error(message);
}
