# Project rules

## Deploying: one project per site, never a new one (owner's standing rule)

These sites are going on sale and into production, so their links must not change.

- **Never create a new Vercel project** (`create_project`, `create_git_project`, a fresh `vercel` link, a new name or a suffixed copy) to ship a change. Every change goes to the site's **existing** project, as a **production** deployment.
- Look the project up by name first (`list_projects`) and reuse it. If it is not found or the call is refused (403, wrong scope), **stop and tell the owner** — do not "fix" it by creating another project.
- Give the owner only the project's **stable production URL**. Per-deployment hashes (`…-abc123.vercel.app`) and branch previews (`…-git-<branch>-….vercel.app`) change on every push and are never what gets shared.
- Do not rename a project, remove its domains or aliases, or move it to another team: that changes the link too.
- Other sites (Dijital Kartım, Socialp Media) are separate projects: do not touch them unless asked.
- Same rule for every website project the owner has us build, whichever repo it lives in.

| Site | Vercel project | Stable link |
|---|---|---|
| VELMO | `velmo` | https://velmo-aviorluxuryshop-5586.vercel.app (production alias `velmo-navy.vercel.app` also live) |
| Dijital Kartım | `dijital-kartim` | https://dijital-kartim-aviorluxuryshop-5586.vercel.app |
| Socialp Media | `socialpmedia-web` | https://socialpmedia-web-aviorluxuryshop-5586.vercel.app |

For a link that survives any future move or rename, attach a custom domain to the project (the owner buys it; do not purchase on their behalf).

## Git

- Develop and push only on the branch the session names (here `claude/premium-ecommerce-design-muxrhn`). Never touch `main`. Do not open pull requests unless asked.
- No invented company or legal details: use editable placeholders. On-screen copy comes from the site's own copy.
- Video work: see `.claude/skills/video-production/SKILL.md`.
