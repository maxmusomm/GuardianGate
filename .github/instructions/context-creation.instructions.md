---
applyTo: "**"
---

When every you make a change updating, creating or deleting files in this repo, please ensure that you follow this process:

- Create a file in this format => <num>\_<short-name>-<type>.md and store it in the `../context` folder
  - <num> is a 3 digit number (001, 002, etc) that indicates the order in which the instructions should be applied
  - <short-name> is a short descriptive name of what the instruction does (e.g. add-user, update-config, etc)
  - <type> is one of the following:
    - `context-creation` for instructions that create or update context creation scripts
    - `environment-setup` for instructions that create or update environment setup scripts
    - `cleanup` for instructions that create or update cleanup scripts
    - `file-update` for instructions that update existing files without creating new scripts
    - minor tweaks or fixes that don't require a new instruction file can be made directly to existing files without creating a new instruction file
  # Example: `002_add-authjs-integration_code-update.md`
