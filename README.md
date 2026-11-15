# learn.flisk.si

One page in the look of chat.flisk.si with a three-way switch.

| Mode | What it does | Needs |
| --- | --- | --- |
| Learn | Answers a question from the Flisk docs and names the pages. Offers the lab that practises it. | Nothing. Inference writes the answer; without it the learner gets the docs passages. |
| Practice | The 29 labs of practice.flisk.si. A lab opens a computer, and each step's check runs on it: a step passes when its command exits with 0 there. | GitHub sign-in and Fleet. |
| Exam | Not built yet. The page says what it will be: timed tasks on a fresh Fleet computer, scored out of 100 by Flisk Wolf. | Fleet and Inference. |

## Run it

```bash
bun run dev
```

Opens on http://localhost:8894 with a pretend Fleet and a pretend model, signed in as `dev-learner`.
`LEARN_DEV_MODEL=off` shows Learn without written answers; `LEARN_DEV_SIGNED_OUT=1` shows it to a visitor.

```bash
bun test test
```

## Content

The docs and the labs are copied into `src/data/` by a script, from the `origin/main` of two local checkouts:

```bash
bun scripts/sync-content.mjs ~/tdk-pr-work/flisk ~/tdk-pr-work/learn-ai-work/flisk-labs
```

Run it again when the docs or the labs change, then deploy. The docs search index is built here, not in the Worker,
so a question costs the Worker a lookup and nothing more.

## Deploy

`wrangler.toml` lists the address, the Inference binding and the five secrets. Fleet has to trust this site: today
that means `FLEET_SERVICE_SECRET` holds the same value as Fleet's `CHAT_SERVICE_SECRET`.

## Limits to know

- A written answer is capped at 60 a day for everyone and 12 a day per visitor (`LEARN_AI_PER_DAY`).
- A command on a computer may run for 60 seconds at most (Fleet's limit).
- Each command is a new shell. A `.env` file in the lab's folder is loaded before every command.
- Passed steps are kept in the learner's browser, not on the server.

## Licence

MIT. See [LICENSE](LICENSE).

## Git hooks

`bun install` turns them on (`git config core.hooksPath .githooks`). Before a commit, `bun run check` makes sure every module parses and imports. Before a push, `bun test test` runs.

## End-to-end tests

`bun run e2e` runs the Playwright suite in `e2e/` against https://learn.flisk.si with your installed Chrome. Set `BASE_URL` to test another build.
