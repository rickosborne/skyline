# template

Digs through source directories for files with embedded sections and regenerates them.
The operation _should_ be idempotent.

# Usage

From the root, run:

    npm run template

It will scan Markdown (`.md`) files for HTML pseudo-comments:

    <!-- +template machine lancehorn dnd5e-npc-stats -->
    ...
    <!-- -template machine lancehorn dnd5e-npc-stats -->

The syntax is pretty straightforward:

1. `+template` and `-template` start and end a block, respectively
2. then the data type (just `machine` for now)
3. then the data identifier, which will be combined with the data type like `${dataId}.${type}.yaml`
4. then the template identifier, which can be found in [data/template](../../data/template) with a `.md` extension

The template will be rendered with the specified data, replacing the existing text.
Obviously you should commit your work before running this, as it will destroy the existing text!

# Scope

The following directories are scanned:

* [adapter](../../adapter)

Templates can be found in [data/template](../../data/template).

Data files can be found in:

* [data/machine](../../data/machine)

You'll probably also want to look at [data/schema](../../data/schema).
