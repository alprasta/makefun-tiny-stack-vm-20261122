# Tiny Stack VM

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/alprasta/makefun-tiny-stack-vm-20261122/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/alprasta/makefun-tiny-stack-vm-20261122/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A compact, correct interpreter for make.fun's tiny stack ISA (v1),
built for the **"Build a tiny stack virtual machine, 22 November 2026"**
bounty (`tiny-stack-vm-01-run-20261122`).

One file, `main.ts` (plain JavaScript, Node 22, no dependencies): it runs
all 40 programs of a set in one run, writing each instance's output bytes
to `/output/<id>/stdout.bin` and its exit code to `/output/<id>/exit.txt`.

What it implements, per `generator/subject/ISA.md`:

- 32-bit two's-complement integers that wrap (`Math.imul` for MUL)
- 256-value data stack, 64-deep call stack, 256 words of memory
- Branches, calls and returns; `IN`, `PRINT`, `PUTC`, `EXIT`
- All ten traps with their own exit codes (2–11), keeping the output
  written before the trap
- The hard edges: `-2147483648 / -1`, `x % -1`, remainder signs, unsigned
  `DIVU`/`MODU`/`LTU` on negative values, shifts masked to 5 bits,
  `PUSH8` sign extension, `EXIT`'s low byte, the 1,000,000-step and
  65,536-byte output limits, falling off the end of a program, and `IN`
  past the end of the input

## Verify

Practice set, graded locally with the kit (score 1,000,000 on all 40
instances, verified twice deterministically, plus 43 hand-built edge
cases and 500 randomized programs checked byte-for-byte against the
kit's reference VM):

```sh
node cli/makefun.mjs grade-local --kit . --bot /path/to/this/repo --driver process
```

## License

MIT — see `LICENSE`.
