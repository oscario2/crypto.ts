DENO := deno run --allow-net

deno:
	@test $${PKG? error ": variable PKG not set"}
	${DENO} ./tests/${PKG}.test.ts

uniswap:
	@$(MAKE) -s PKG=$@ deno

all:
	@$(MAKE) -s uniswap