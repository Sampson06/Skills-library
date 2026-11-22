import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "skills");
const walk = (dir, base = "") =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name), base + e.name + "/") : [base + e.name]);

const skills = readdirSync(root, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("."))
  .map((e) => {
    const dir = join(root, e.name);
    const md = readFileSync(join(dir, "SKILL.md"), "utf8");
    const fm = (md.match(/^---\r?\n([\s\S]*?)\r?\n---/) || [, ""])[1];
    const field = (k) => ((fm.match(new RegExp("^" + k + ":\\s*(.*)$", "m")) || [, ""])[1] || "").trim();
    return { id: e.name, name: field("name") || e.name, description: field("description"), dir, files: walk(dir).sort(), body: md.replace(/^---[\s\S]*?---\s*/, "") };
  });
const byId = Object.fromEntries(skills.map((s) => [s.id, s]));
const ids = skills.map((s) => s.id);
const text = (t) => ({ content: [{ type: "text", text: t }] });
const brief = (d) => (d.split(/\.\s/)[0] || d).replace(/\.?$/, ".");

const server = new McpServer({ name: "my-skills-library", version: "1.0.0" });

server.registerTool("list_skills", {
  title: "List my skills",
  description: "Lists every skill in the library with its description and file count. Call this when the user says 'list my skills' or asks what skills are available. Then call get_skill for the one that fits the task.",
}, async () => text(
  `My skills library (${skills.length} skills)\n\n` +
  skills.map((s, i) => `${i + 1}. **${s.id}**: ${brief(s.description)}\n   Files: ${s.files.length}`).join("\n\n") +
  "\n\nNext: call get_skill with the skill id, then get_skill_file for any reference or asset it points to."
));

server.registerTool("search_skills", {
  title: "Search skills",
  description: "Finds skills relevant to a task by keywords, for example 'booking form', 'image gallery', 'page transition', 'sound toggle'.",
  inputSchema: { query: z.string().describe("Keywords describing the task") },
}, async ({ query }) => {
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = skills.map((s) => {
    const hay = (s.id + " " + s.description + " " + s.files.join(" ") + " " + s.body).toLowerCase();
    return { s, score: terms.reduce((n, t) => n + (hay.split(t).length - 1), 0) };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score);
  return text(scored.length
    ? scored.map((x) => `- **${x.s.id}** (score ${x.score}): ${brief(x.s.description)}`).join("\n")
    : "No skill matched. Call list_skills to see everything.");
});

server.registerTool("get_skill", {
  title: "Get a skill",
  description: "Returns a skill's main instructions (SKILL.md body) and its file list. Follow the instructions, and fetch referenced files with get_skill_file.",
  inputSchema: { name: z.enum(ids) },
}, async ({ name }) => {
  const s = byId[name];
  return text(`# Skill: ${s.id}\n\n${s.description}\n\n---\n\n${s.body}\n\n---\nFiles in this skill (use get_skill_file):\n${s.files.map((f) => "- " + f).join("\n")}`);
});

server.registerTool("list_skill_files", {
  title: "List a skill's files",
  description: "Lists every reference and asset file in a skill.",
  inputSchema: { name: z.enum(ids) },
}, async ({ name }) => text(byId[name].files.join("\n")));

server.registerTool("get_skill_file", {
  title: "Get a file from a skill",
  description: "Returns one file from a skill, for example references/booking-and-registration.md or assets/booking-widget.js. Copy asset files into the user's project.",
  inputSchema: { name: z.enum(ids), path: z.string().describe("Path exactly as listed by get_skill or list_skill_files") },
}, async ({ name, path }) => {
  const s = byId[name];
  const clean = normalize(path).replace(/\\/g, "/");
  if (!s.files.includes(clean)) return text(`File not found. Available:\n${s.files.join("\n")}`);
  return text(readFileSync(join(s.dir, clean), "utf8"));
});

for (const s of skills) {
  server.registerResource(s.id, `skill://${s.id}`, { title: s.id, description: s.description, mimeType: "text/markdown" },
    async (uri) => ({ contents: [{ uri: uri.href, text: s.body }] }));
}

server.registerPrompt("use_skill", {
  title: "Use one of my skills for a task",
  description: "Starts a task with a chosen skill.",
  argsSchema: { skill: z.enum(ids), task: z.string().describe("What to build") },
}, ({ skill, task }) => ({
  messages: [{ role: "user", content: { type: "text", text:
    `Task: ${task}\n\nUse the "${skill}" skill from my-skills-library. Call get_skill first, follow its workflow, fetch only the files you need with get_skill_file, and finish with the skill's checklist.` } }],
}));

await server.connect(new StdioServerTransport());
