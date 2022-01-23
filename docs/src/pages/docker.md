# Local Docker Environment

This repo comes with a local docker environment that is quick to boot up and allows for local testing before deployment.

```bash
# startup docker containers
pnpm run up
# shut down docker containers
pnpm run down
```

> Note: you can of course just type in `docker compose up/down` too but all the key things you'll need to do here are represented as "scripts" in the `package.json`.