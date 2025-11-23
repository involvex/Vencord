# Additional React Type Compatibility Fixes - Phase 2

## Current Status: 74 Errors Remaining in 46 Files

Based on the latest TypeScript compilation feedback, I need to fix additional React type compatibility issues. The main patterns of errors are:

### 1. **ReactNode vs React.ReactNode Type Conflicts**

- Type mismatches between @types/react@19.2.6 and @types/react@19.0.12
- JSX children prop type incompatibilities

### 2. **Component Type Issues**

- Components can't be used as JSX components due to type signature mismatches
- Function component return type incompatibilities

### 3. **CSS Properties Conflicts**

- CSS type mismatches between different csstype versions
- Style prop type incompatibilities

## Files to Fix Next

### High Priority Component Files:

1. `src/components/settings/tabs/BaseTab.tsx` (lines 28, 36)
2. `src/components/settings/tabs/plugins/components/Common.tsx` (line 77)
3. `src/components/settings/tabs/plugins/PluginModal.tsx` (line 145)
4. `src/components/Span.tsx` (line 13)

### Plugin Files:

1. `src/plugins/_api/badges/index.tsx` (line 182)
2. `src/plugins/betterFolders/index.tsx` (line 365)
3. `src/plugins/experiments/index.tsx` (line 125)
4. `src/plugins/fakeNitro/index.tsx` (line 932)
5. `src/plugins/fullUserInChatbox/index.tsx` (line 41)
6. `src/plugins/spotifyControls/PlayerComponent.tsx` (line 390)
7. `src/plugins/startupTimings/StartupTimingPage.tsx` (lines 51, 160)
8. `src/plugins/textReplace/index.tsx` (line 136)
9. `src/plugins/typingTweaks/index.tsx` (lines 60, 183)
10. `src/plugins/userVoiceShow/components.tsx` (line 60)

### CSS/Style Issues:

1. `src/plugins/betterSessions/components/icons.tsx` (multiple SVG style issues)
2. `src/plugins/betterSettings/index.tsx` (line 82)

## Fix Strategy

I'll continue applying the same solutions as before:

1. Fix React type imports and usage
2. Resolve ComponentType compatibility issues
3. Fix CSS property type conflicts
4. Update component prop types for consistency
