# MYTHOS — Claude Code with OpenCode's TUI

## Mission

You are transforming the terminal UI of a Claude Code fork (React + Ink) into a TUI that looks and feels identical to **OpenCode** (https://github.com/anomalyco/opencode). The project is called **Mythos**.

The backend stays untouched — the agentic loop (`query.ts`, `QueryEngine.ts`), all 40+ tools, MCP, memory, skills, commands, and API layer remain as-is. You are ONLY rewriting the **terminal UI layer** in `src/components/` and the relevant parts of `src/main.tsx` that render the TUI.

The rendering engine stays as **React + Ink** (we are NOT switching to OpenTUI/SolidJS — that would require rewriting 512k lines). Instead, we restyle and restructure the Ink components to visually and functionally match OpenCode.

---

## Reference Architecture

### What We Keep (DO NOT TOUCH)
```
src/
├── QueryEngine.ts        # Core LLM API engine — DO NOT MODIFY
├── query.ts              # Agentic loop — DO NOT MODIFY
├── Tool.ts               # Tool types — DO NOT MODIFY
├── tools.ts              # Tool registry — DO NOT MODIFY
├── tools/                # All tool implementations — DO NOT MODIFY
├── services/             # API, MCP, external integrations — DO NOT MODIFY
├── memdir/               # Memory system — DO NOT MODIFY
├── skills/               # Skill system — DO NOT MODIFY
├── coordinator/          # Multi-agent — DO NOT MODIFY
├── commands.ts           # Command registry — DO NOT MODIFY (but we hook into it)
└── context.ts            # System prompt — DO NOT MODIFY
```

### What We Rewrite
```
src/
├── main.tsx              # CLI entrypoint — MODIFY (TUI init, theme detection)
├── components/           # REWRITE ENTIRELY to match OpenCode layout
│   ├── App.tsx           # Root app — new layout structure
│   ├── Session/          # NEW — main chat session view
│   │   ├── index.tsx     # Session container with split-pane layout
│   │   ├── Messages.tsx  # Message list with markdown rendering
│   │   ├── Sidebar.tsx   # Right sidebar (context, tokens, MCP status, diffs)
│   │   ├── Header.tsx    # Top bar (model, agent, session info)
│   │   └── Footer.tsx    # Bottom bar (keybind hints, status)
│   ├── Prompt/           # NEW — input area
│   │   ├── index.tsx     # Prompt container with border styling
│   │   ├── Autocomplete.tsx  # @ file completion, / command completion
│   │   └── Extmarks.tsx  # Inline attachment display
│   ├── Home/             # NEW — session list / home screen
│   │   └── index.tsx     # Session picker when no active session
│   ├── Dialogs/          # NEW — modal dialogs
│   │   ├── CommandPalette.tsx  # Ctrl+K command palette
│   │   ├── ModelSelector.tsx   # Model picker
│   │   ├── SessionList.tsx     # Session switcher
│   │   ├── Permissions.tsx     # Tool permission prompts
│   │   └── ThemeSelector.tsx   # Theme picker
│   ├── shared/           # NEW — shared primitives
│   │   ├── Box.tsx       # Styled box with border options
│   │   ├── ScrollBox.tsx # Scrollable container with sticky-scroll
│   │   ├── Toast.tsx     # Toast notifications
│   │   ├── Spinner.tsx   # Loading spinner
│   │   └── Markdown.tsx  # Markdown renderer with syntax highlighting
│   └── theme/            # NEW — theming system
│       ├── index.tsx     # Theme context provider
│       ├── themes.ts     # Built-in themes (dark, light, catppuccin, etc.)
│       └── detect.ts     # Terminal background color detection (OSC 11)
└── hooks/                # MODIFY — add new hooks
    ├── useTheme.ts       # Theme hook
    ├── useKeybinds.ts    # Keybind system
    ├── useAutocomplete.ts # File/command autocomplete
    └── useScroll.ts      # Scroll acceleration
```

---

## OpenCode TUI Layout Specification

### Overall Layout (when sidebar is visible, terminal > 120 cols)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Header: [agent_icon] build · model_name              session_title  │
├───────────────────────────────────────────────┬─────────────────────┤
│                                               │   SIDEBAR           │
│   MESSAGE AREA                                │                     │
│                                               │   Context: 45.2k    │
│   user                                        │   Cost: $0.23       │
│   > How is auth handled in this project?      │                     │
│                                               │   MCP Servers        │
│   assistant                                   │   ✓ filesystem       │
│   The authentication system uses JWT tokens   │   ✓ github           │
│   stored in...                                │                     │
│                                               │   Modified Files     │
│   ┌─ Read file ──────────────────────────┐    │   ~ src/auth.ts      │
│   │ src/auth/jwt.ts (1-45)               │    │   + src/middleware.ts │
│   └──────────────────────────────────────┘    │                     │
│                                               │   TODOs              │
│                                               │   □ Add rate limiting │
│                                               │                     │
├───────────────────────────────────────────────┴─────────────────────┤
│ ┌─ Prompt ────────────────────────────────────────────────────────┐ │
│ │ > Type your message... (@file, /command, !shell)                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ Footer: ctrl+x h help · Tab switch agent · ctrl+c interrupt        │
└─────────────────────────────────────────────────────────────────────┘
```

### Layout (no sidebar, terminal < 120 cols)
```
┌─────────────────────────────────────────────┐
│ Header: build · claude-sonnet-4-20250514    │
├─────────────────────────────────────────────┤
│                                             │
│   MESSAGE AREA (full width)                 │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─ Prompt ────────────────────────────────┐ │
│ │ >                                       │ │
│ └─────────────────────────────────────────┘ │
├─────────────────────────────────────────────┤
│ Footer: keybind hints                       │
└─────────────────────────────────────────────┘
```

---

## Theming System

### Theme Detection
On startup, detect terminal background color using OSC 11 escape sequence. Classify as dark or light. Default to dark if detection fails.

### Theme Structure
```typescript
interface MythosTheme {
  name: string
  isDark: boolean
  colors: {
    primary: string        // Main accent (e.g., blue/cyan)
    secondary: string      // Secondary accent
    background: string     // Terminal bg (usually transparent)
    foreground: string     // Default text
    muted: string          // Dimmed text
    border: string         // Box borders
    borderFocused: string  // Focused element borders (primary color)
    error: string          // Red
    warning: string        // Yellow
    success: string        // Green
    info: string           // Blue
  }
  syntax: {               // Code block syntax highlighting
    keyword: string
    string: string
    comment: string
    function: string
    number: string
    operator: string
  }
}
```

### Built-in Themes
Implement at minimum: `catppuccin-mocha` (default dark), `catppuccin-latte` (default light), `dracula`, `tokyonight`, `gruvbox`, `solarized`. Match the theme names and feel from OpenCode.

### Theme Loading
Support loading custom themes from:
1. `~/.config/mythos/theme/*.json`
2. Project root `theme/*.json`
3. Current directory `theme/*.json`

---

## Prompt Component

### Features
1. **Multi-line input** — Enter sends, Shift+Enter or Ctrl+Enter for newline
2. **@ autocomplete** — Typing `@` triggers fuzzy file search overlay above prompt
3. **/ commands** — Typing `/` as first char triggers command autocomplete
4. **! shell mode** — Typing `!` as first char switches to shell command mode (border changes to primary color, placeholder changes)
5. **Attachments** — Display attached files as inline pills/tags above the input
6. **History** — Up/Down arrows cycle through previous prompts
7. **Extmarks** — Show compact representations of images, files in the input area
8. **Border styling** — Rounded border, label shows agent name, highlights on focus

### Prompt Border
```
┌─ build ─────────────────────────────────────┐
│ > your message here                         │
│                                             │
│   @src/auth.ts  📎 screenshot.png           │
└─────────────────────────────────────────────┘
```

---

## Message Rendering

### User Messages
```
  you

  How is auth handled in @src/auth/jwt.ts?
```

### Assistant Messages
```
  assistant

  The authentication system uses JWT tokens...

  ┌─ Read src/auth/jwt.ts (lines 1-45) ──────────┐
  │ // JWT verification middleware                  │
  │ export function verifyToken(req, res, next) {   │
  │   ...                                           │
  └─────────────────────────────────────────────────┘

  ┌─ Write src/middleware/auth.ts ────────────────┐
  │ + import { verifyToken } from '../auth/jwt'    │
  │ + export const authMiddleware = ...             │
  └────────────────────────────────────────────────┘
```

### Tool Call Rendering
Each tool call gets a collapsible bordered box:
- **Read file** — Show filename, line range, collapsed by default
- **Write file** — Show diff with +/- coloring, collapsed by default
- **Bash** — Show command and output, collapsed by default
- **Search** — Show query and match count, collapsed by default
- **MCP tool** — Show server name, tool name, collapsed by default

The toggle details command (`/details` or keybind) expands/collapses all tool blocks.

### Markdown Rendering
- Full markdown support: headers, bold, italic, code, links, lists, tables
- Fenced code blocks with syntax highlighting using theme colors
- Inline code with background tint

### Diff Rendering
- Side-by-side when terminal is wide enough (configurable via `diff_style: "auto" | "stacked"`)
- Single column (stacked) for narrow terminals
- Green for additions, red for deletions

---

## Sidebar

Shown when terminal width > 120 columns. Toggle with keybind (default: `ctrl+x b`).

### Sections
1. **Session title** — editable
2. **Context** — Token count (e.g., "45.2k / 200k")
3. **Cost** — Running cost for session (e.g., "$0.23")
4. **Model** — Current model name
5. **MCP Servers** — List with status indicators (✓ connected, ✗ error, ◌ connecting)
6. **LSP** — Language server statuses
7. **Modified Files** — List of files changed in session with +/~/- indicators
8. **TODOs** — Extracted TODO items from conversation

---

## Keybinds

Use `ctrl+x` as the leader key (matching OpenCode convention).

### Global
| Key | Action |
|-----|--------|
| `ctrl+c` | Interrupt (double-press to exit) |
| `ctrl+x ctrl+c` | Exit |
| `ctrl+x n` | New session |
| `ctrl+x s` | Session list |
| `ctrl+k` | Command palette |
| `ctrl+x b` | Toggle sidebar |
| `ctrl+x h` | Help dialog |
| `Tab` | Switch agent (build ↔ plan) |
| `ctrl+t` | Cycle model variants (thinking on/off) |

### Prompt
| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift+Enter` | Newline |
| `ctrl+e` | Open external editor |
| `Up/Down` | Prompt history |
| `Escape` | Clear input / exit mode |

### Message Area
| Key | Action |
|-----|--------|
| `j/k` or `Up/Down` | Scroll |
| `g/G` | Top/bottom |
| `ctrl+x u` | Undo last message |
| `y` | Copy selected text |

---

## Slash Commands

Hook into existing `commands.ts` registry and add TUI-specific commands:

| Command | Aliases | Description |
|---------|---------|-------------|
| `/new` | `/clear` | New session |
| `/sessions` | `/s` | Session list dialog |
| `/models` | `/m` | Model selector dialog |
| `/compact` | `/summarize` | Compact session history |
| `/connect` | | Add provider / API key |
| `/details` | | Toggle tool detail visibility |
| `/editor` | | Open external editor |
| `/export` | | Export session to markdown |
| `/help` | `/h` | Help dialog |
| `/init` | | Generate AGENTS.md |
| `/review` | | Code review |
| `/share` | | Share session link |
| `/theme` | | Theme selector |
| `/undo` | | Undo last message + revert files |
| `/quit` | `/q`, `/exit` | Exit |

---

## Home Screen (Session List)

When Mythos starts with no active session, show:

```
┌─────────────────────────────────────────────┐
│                                             │
│           M Y T H O S                       │
│                                             │
│   Recent Sessions                           │
│                                             │
│   > Fix auth middleware bug     2 min ago   │
│     Add rate limiting to API    1 hour ago  │
│     Refactor database queries   yesterday   │
│     Setup CI/CD pipeline        3 days ago  │
│                                             │
│   ctrl+n new · ctrl+s sessions · ? help     │
│                                             │
└─────────────────────────────────────────────┘
```

Arrow keys to navigate, Enter to resume, `ctrl+n` for new session.

---

## Command Palette

Triggered by `ctrl+k`. Renders as a centered overlay dialog with fuzzy search:

```
┌─ Commands ──────────────────────────────────┐
│ > search...                                 │
│                                             │
│   New Session              ctrl+x n         │
│   Session List             ctrl+x s         │
│   Switch Model             ctrl+x m         │
│   Toggle Sidebar           ctrl+x b         │
│   Export Session            —                │
│   Toggle Theme              —                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Toast System

Non-blocking notifications that appear in the top-right corner, auto-dismiss after 3 seconds:

```
                          ┌─────────────────────┐
                          │ ✓ Session exported   │
                          └─────────────────────┘
```

Types: success (green), error (red), warning (yellow), info (blue).

---

## Scroll Behavior

- **Sticky scroll** — auto-scroll to bottom when new content arrives
- **Scroll pause** — scrolling up pauses auto-scroll
- **Resume** — scrolling to bottom resumes auto-scroll
- **Acceleration** — macOS-style scroll acceleration (optional, configurable)
- **Configurable speed** — `scroll_speed` in config (minimum: 1, default: 3)

---

## Configuration

Mythos reads config from `mythos.json` (or `.mythosrc`, or `~/.config/mythos/config.json`):

```json
{
  "$schema": "https://mythos.dev/config.json",
  "theme": "catppuccin-mocha",
  "tui": {
    "scroll_speed": 3,
    "scroll_acceleration": { "enabled": true },
    "diff_style": "auto",
    "show_thinking": true,
    "show_tool_details": false
  },
  "keybinds": {
    "leader": "ctrl+x",
    "new_session": "ctrl+x n",
    "session_list": "ctrl+x s",
    "command_palette": "ctrl+k",
    "toggle_sidebar": "ctrl+x b"
  }
}
```

---

## Agents

Mythos has two built-in agents switchable with Tab:
1. **build** — Default, full-access agent for development work (all tools enabled)
2. **plan** — Read-only agent for analysis and code exploration (read tools only)

The prompt border label changes to show the active agent. The agent icon in the header also updates.

---

## Implementation Order

Phase 1 — Foundation:
1. Theme system (`src/components/theme/`)
2. Shared primitives (`Box`, `ScrollBox`, `Spinner`, `Markdown`)
3. App shell with layout (`Header`, `Footer`, split-pane structure)
4. Basic message rendering

Phase 2 — Core Interaction:
5. Prompt component with send/newline/history
6. @ file autocomplete
7. / command autocomplete
8. ! shell mode

Phase 3 — Polish:
9. Sidebar
10. Tool call rendering (collapsible boxes, diffs)
11. Toast notifications
12. Command palette (ctrl+k)
13. Session list / home screen
14. Dialog system (model selector, permissions, theme picker)

Phase 4 — UX:
15. Keybind system
16. Scroll acceleration
17. Terminal background detection
18. External editor integration
19. Session export

---

## Critical Implementation Notes

1. **DO NOT break the agentic loop.** The UI is a view layer. All tool execution, API calls, and state changes flow through the existing `query.ts` async generator. The TUI subscribes to events and renders them.

2. **Use Ink's built-in components** — `<Box>`, `<Text>`, `<Newline>`, `<Static>`, `useInput`, `useApp`, `useStdout`. For text input, use `ink-text-input`. For scrolling, implement a custom `ScrollBox` using `useStdout` dimensions.

3. **Performance matters.** Cache rendered messages. Only re-render what changed. The OpenCode TUI renders at 60fps — Ink won't match that, but minimize unnecessary re-renders.

4. **The prompt is the most important component.** Users spend 90% of their time typing and reading. Nail the prompt UX first.

5. **Branding** — Replace all references to "Claude Code" with "Mythos" in the UI. Keep the CLI command as `mythos`. Update the ASCII art/logo on the home screen.

6. **Respect the existing tool permission system.** When a tool needs permission (file write, bash, etc.), render the permission dialog as an overlay matching OpenCode's style, but delegate the actual permission logic to the existing system.

7. **The OpenCode repo is in the project folder for reference.** Study its TUI components in `packages/opencode/src/cli/cmd/tui/` — particularly `routes/session/index.tsx` (session layout), `component/prompt/` (prompt), `context/theme.tsx` (theming), and `routes/session/sidebar.tsx` (sidebar). Adapt the UX patterns, not the rendering code (since they use OpenTUI/SolidJS and we use Ink/React).

---

## Summary

- **What**: Rewrite Mythos (Claude Code fork) TUI to look/feel like OpenCode
- **How**: Replace `src/components/` with new Ink components matching OpenCode's layout
- **Keep**: All backend (tools, agentic loop, MCP, memory, API) untouched
- **Stack**: TypeScript, React, Ink, Bun (no change)
- **Reference**: OpenCode repo in project folder, specifically `packages/opencode/src/cli/cmd/tui/`
- **Priority**: Prompt → Messages → Layout → Sidebar → Dialogs → Polish