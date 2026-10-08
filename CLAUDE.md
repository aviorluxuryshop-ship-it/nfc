# Deployment rule — READ BEFORE ANY VERCEL CHANGE

These sites are live and being sold to customers. **Never create a new Vercel
project for an update.** Links must stay stable — a new project means a new
URL, which breaks whatever the client already shared/printed/used.

When asked to change a site that's already deployed:
1. Find the existing Vercel project for it (see table below).
2. Commit the change to the branch that project already deploys from.
3. Let it redeploy (push to the tracked branch, or trigger a deployment on
   the existing project) — same project, same domain.
4. Never call `create_project` / `create_git_project` for a site that
   already has a project. Only use those for a genuinely new site that has
   never been deployed before.

## Live projects on this repo (team_PxFGsBSajcv5Hv7qwU48fSYX)

| Project (Vercel) | Domain | Branch it deploys | Content |
|---|---|---|---|
| `dijital-kartim` (prj_jMaAra0lcSEEB23W5bt9CF7F01X2) | dijital-kartim.vercel.app | `main` | Marmara Gıda Kahvaltı order site |
| `marmara-gida-kahvalti` (prj_WGmJjD2hqxbh0UQ88ZpiuiAQGGP5) | marmara-gida-kahvalti.vercel.app | `main` | Marmara Gıda Kahvaltı order site (same content as above) |
| `nfc-kartvizit` (prj_3NP6qoOuqoeW9ClKbFPDaeRapumm) | nfc-kartvizit-ruby.vercel.app | `nfc-kartvizit` | NFC business-card catalog (Dijital Kartım) |

- Changes to the **NFC catalog** → commit to the `nfc-kartvizit` branch and
  push. The `nfc-kartvizit` project auto-deploys from it.
- Changes to **Marmara Gıda** → commit to `main` and push. Both
  `dijital-kartim` and `marmara-gida-kahvalti` projects auto-deploy from it
  (they're duplicates of the same content on purpose, for now).
- If a client's project isn't in this table, ask before creating anything —
  it may already exist under a name that doesn't obviously match.
