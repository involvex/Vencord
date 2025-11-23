# Additional TypeScript Fixes Required

## Status Update
- **Previous fixes**: ✅ Core webpack components resolved  
- **Current issue**: ❌ 76 additional errors in 48 plugin files
- **Root cause**: Same React type version conflicts spreading to plugins

## Remaining Critical Errors to Fix

### src/utils/settingsSync.ts:120
- Issue: `Uint8Array<ArrayBufferLike>` not assignable to `BodyInit`
- Fix needed: Cast body to proper type for fetch

### Plugin Files with React Type Conflicts
1. **src/api/** - Badges, ChatButtons, MessageAccessories, Notices, etc.
2. **src/components/** - BaseText, Button, Divider, ErrorCard, Grid, etc.  
3. **src/components/settings/** - AddonCard, QuickAction, SpecialCard, etc.
4. **src/plugins/** - Multiple plugins with React.Fragment and component type issues

### Error Patterns Identified
- `ReactNode` vs `import("...@types/react@19.2.6...").ReactNode` conflicts
- `React.Fragment` cannot be used as JSX component
- ComponentType not assignable to JSX element type
- Children property missing in ReactElement

## Next Actions Required
1. Fix remaining `settingsSync.ts` issue
2. Apply systematic fixes to plugin files with similar patterns
3. Consider creating a type-shim approach for React conflicts
