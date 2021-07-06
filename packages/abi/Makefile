DENO := deno run --allow-net

deno:
	@test $${PKG? error ": variable PKG not set"}
	${DENO} ./tests/${PKG}.test.ts

abi:
	@$(MAKE) -s PKG=$@ deno

all:
	@$(MAKE) -s abi