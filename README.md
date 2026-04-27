# Oh My OpenAgent GPT Fork

This repository is a small fork of [oh-my-openagent / oh-my-opencode](https://github.com/code-yeongyu/oh-my-openagent). It is intentionally not a full rewrite of the upstream README.

For the complete feature list, setup flow, and project documentation, read the upstream project and the docs in this repository:

- [Overview](docs/guide/overview.md)
- [Installation](docs/guide/installation.md)
- [Features](docs/reference/features.md)
- [Configuration](docs/reference/configuration.md)

## What Is Different Here

- Agents are tuned around GPT and subscription-based model access.
- The default OpenCode `Builder` agent is kept instead of being deleted.

More changes are coming soon.

## Local Installation

Clone this repository and reference it from your OpenCode config:

```bash
git clone https://github.com/code-yeongyu/oh-my-openagent.git /Documents/sources/oh-my-openagent-gpt
```

Then add the local plugin path to `~/.config/opencode/opencode.json` or `opencode.jsonc`:

```json
{
  "plugin": [
    "file:///Documents/sources/oh-my-openagent-gpt"
  ]
}
```

If you cloned it somewhere else, replace the `file://` path with the path to your clone.
