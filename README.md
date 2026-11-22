# My skills library

All my front-end skills in one place, served as an **MCP server**. Any MCP-capable agent (Cline, VS Code Copilot,
Cursor, Claude Code, Claude Desktop) can ask it to **list my skills**, search them, and fetch a skill with its files.

| Skill | For |
|---|---|
| `frontend-motion-kit` | Design baseline, Google Fonts, motion recipes (GSAP, Lenis, View Transitions) |
| `headline-motion-kit` | Giant hero headline motion: line reveal, hyphen-split word, struck-out word, scroll drift, page wipe |
| `immersive-media-kit` | Image turn viewer, text on images, opt-in sound, giant-wordmark footer, consent panel |
| `registration-landing-kit` | Registration/booking landing pages: form, slot picker, address block, full-screen menu |

`INDEX.md` has the same list with ready-to-paste prompts. `dist/` holds the `.skill` files for Claude apps.

## 1. Put it on GitHub (once)

1. Create an empty **public** repository on github.com, for example `my-skills-library`.
2. In this folder:
   ```bash
   git init
   git add .
   git commit -m "My skills library"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/my-skills-library.git
   git push -u origin main
   ```
3. Your link is `https://github.com/YOUR_USER/my-skills-library`. Keep it; this is the link you paste later.

A private repo also works, but agents then need your GitHub credentials to fetch it.

## 2. Add it to your agent (once per agent)

**Cline: paste the link in chat**
```
Add the MCP server from https://github.com/YOUR_USER/my-skills-library
```
Cline clones the repo and sets the server up. (If it asks how to run it: `node server.js` in the cloned folder.)

**Cline, Cursor, Claude Desktop: config file** (Cline: MCP Servers icon > Configure > Configure MCP Servers)
```json
{
  "mcpServers": {
    "my-skills-library": {
      "command": "npx",
      "args": ["-y", "github:YOUR_USER/my-skills-library"],
      "disabled": false,
      "alwaysAllow": ["list_skills", "search_skills", "get_skill", "list_skill_files", "get_skill_file"]
    }
  }
}
```
Or run it from a local copy (no install step needed):
```json
{ "mcpServers": { "my-skills-library": { "command": "node", "args": ["/ABSOLUTE/PATH/my-skills-library/server.js"] } } }
```

**VS Code Copilot** (Command Palette > *MCP: Open User Configuration*)
```json
{ "servers": { "my-skills-library": { "type": "stdio", "command": "npx", "args": ["-y", "github:YOUR_USER/my-skills-library"] } } }
```

**Claude Code**
```bash
claude mcp add my-skills-library --scope user -- npx -y github:YOUR_USER/my-skills-library
```

## 3. Use it

Say to the agent:

- `list my skills`
- `search my skills for a booking form`
- `Use my registration-landing-kit skill to build a landing page for my registration system`

The agent calls `list_skills`, then `get_skill`, then `get_skill_file` for the files it needs.

**No MCP in your agent?** Paste this instead (raw files work from a public repo):
```
Read https://raw.githubusercontent.com/YOUR_USER/my-skills-library/main/skills/registration-landing-kit/SKILL.md
and follow it for this task: <describe the task>. Fetch the files it lists from the same folder.
```

## Add or change a skill

1. Put a folder in `skills/<name>/` with a `SKILL.md` that starts with `name:` and `description:` front matter.
2. Run `npm run index` to refresh `skills.json` and `INDEX.md` (the server reads the folder at start, no rebuild needed).
3. Commit and push. Restart the server in your agent.

Changing `src/server.js`? Run `npm install` then `npm run build` to regenerate the bundled `server.js`.

## Notes

- `server.js` is a single bundled file; Node 18 or newer is the only requirement.
- Some skills say which reference sites could not be read (see each skill's `references/sources.md`).
