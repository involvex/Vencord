# Vencord Path Resolution Fixes

## Task: Fix import statements with missing forward slashes

The build is failing because import statements contain backslashes (`\`) instead of forward slashes (`/`) in path aliases. This prevents the module resolver from correctly resolving paths like:

- `"@utils\quickCss"` → `"@utils/quickCss"`
- `"@main\cspmanager"` → `"@main/csp/manager"`
- `"@webpack/common\internal"` → `"@webpack/common/internal"`

## Steps:

- [ ] Search for all import statements with backslashes in path aliases
- [ ] Replace backslashes with forward slashes in import statements
- [ ] Test build process to ensure fixes work
- [ ] Run lint and format commands
- [ ] Verify the build completes successfully

## Error Pattern Analysis:

The errors show patterns like:

- Missing forward slashes after alias prefixes (@api, @utils, @components, @main, @webpack)
- Backslashes being used instead of forward slashes
- Missing path components in some imports
