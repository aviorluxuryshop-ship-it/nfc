# Deployment rules (from the site owner — apply to every website project)

- One Vercel project per website, created once. Never create a new Vercel
  project when changing a site: deploy to the existing project so the
  public link never changes. These sites are sold and go live for clients.
- Socialp Media site (`socialp-media/`): Vercel project `socialpmedia-web`
  (id prj_JDyCDwfDZtOhSyCuyt3rdzo8qvak). Fixed link:
  https://socialpmedia-web.vercel.app (later the client's own domain).
- Changes are pushed to the project's branch; Vercel builds them into the
  same project. Production (the fixed link) is updated only when the owner
  says "yayınla".
