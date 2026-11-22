// Regenerates skills.json and INDEX.md from the skills/ folder. Run: npm run index
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const walk = (d, b = "") => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name), b + e.name + "/") : [b + e.name]);
const skills = readdirSync(join(root, "skills"), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => {
  const md = readFileSync(join(root, "skills", e.name, "SKILL.md"), "utf8");
  const fm = (md.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ""])[1];
  const f = (k) => ((fm.match(new RegExp("^" + k + ":\\s*(.*)$", "m")) || [, ""])[1] || "").trim();
  return { id: e.name, name: f("name") || e.name, description: f("description"), files: walk(join(root, "skills", e.name)).sort() };
});
writeFileSync(join(root, "skills.json"), JSON.stringify(skills, null, 2));
const short = (s) => (s.length > 150 ? s.slice(0, 147) + "..." : s);
writeFileSync(join(root, "INDEX.md"),
`# My skills

${skills.length} skills. Replace \`YOUR_USER/YOUR_REPO\` with your GitHub path.

| Skill | What it is for | Files |
|---|---|---|
${skills.map((s) => `| \`${s.id}\` | ${short(s.description)} | ${s.files.length} |`).join("\n")}

## Paste into any agent (Cline, Cursor, Copilot chat...)

${skills.map((s) => `**${s.id}**
\`\`\`
Read https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/skills/${s.id}/SKILL.md and follow it for this task: <describe the task>. Fetch the files it lists from the same folder.
\`\`\``).join("\n\n")}
`);
console.log("indexed", skills.length, "skills");
