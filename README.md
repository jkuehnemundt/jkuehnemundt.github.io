# kuehnemundt.com – Theme „Notes from my desk“

Schlichtes, warmes Jekyll-Theme mit Tag-/Nachtmodus (Nacht als Standard), getippter Headline auf der Startseite, Topics, Tools-Filter, About-Seite mit Git-Graph und Bleistift-Diagrammen für Notizen. Läuft mit dem normalen GitHub-Pages-Build, ohne GitHub Actions.

## Inhalt

```
_config.yml            Titel, Untertitel, URL, Plugins
_data/
  social.yml           GitHub, LinkedIn, E-Mail
  topics.yml           Themen (id + Anzeigename)
  tools.yml            Tools-Seite (Gruppe, Name, Link, Satz, OS)
  experience.yml       Werdegang als Commit-Graph auf /about/
_layouts/              default, home, post, page, about, tools, topics, notes
_includes/             head, header, footer, note-row, sketch-defs, sketch/…
_posts/                Notizen (dein bestehender Post kommt hier hinein)
_drafts/               Entwürfe, werden nicht veröffentlicht (Beispiel: Strangler Fig)
assets/css/main.css    Gesamtes Styling, Farben als CSS-Variablen
assets/js/site.js      Tag/Nacht, getippte Headline, Tools-Filter
assets/fonts/          Schriften (per Skript befüllen, siehe unten)
scripts/fetch-fonts.sh Lädt die Schriften einmalig herunter
index.html, notes.html, topics.html, tools.html, about.md, privacy.md, 404.html
```

## Umstieg vom alten Klise-Theme

1. **Neuen Branch anlegen**, z. B. `redesign`, damit die live Seite unberührt bleibt.
2. **Behalten:** `_posts/`, `CNAME`, deine Bilder unter `assets/img/` und die Impressum-Seite (`legalnotice.md` o. ä.).
3. **Entfernen:** die Theme-Dateien von Klise (`_layouts/`, `_includes/`, `_sass/`, altes CSS/JS, alte `_config.yml`, `about.md`, `tools.md`, Archiv-Seite).
4. **Diese Dateien hineinkopieren.** Beim Impressum im Front Matter `layout: page` setzen und sicherstellen, dass es unter `/legalnotice/` erreichbar ist (`permalink: /legalnotice/`).
5. **Schriften holen** (braucht Node.js):
   ```bash
   bash scripts/fetch-fonts.sh
   ```
   Danach liegen fünf `.woff2`-Dateien in `assets/fonts/`. Die Schriften werden so von deiner eigenen Domain geladen, nicht von Google (DSGVO).
6. **Lokal testen:**
   ```bash
   bundle install
   bundle exec jekyll serve
   ```
   → http://localhost:4000
7. **Profilfoto:** dein Foto als `assets/img/portrait.jpg` ablegen (quadratisch, mind. 264 × 264 px). Ohne Foto die Zeile `photo:` in `about.md` auskommentieren.
8. **Platzhalter füllen:** alles in `[eckigen Klammern]`, vor allem `_data/social.yml` (E-Mail), `_data/experience.yml` (Jahre, Stationen), `about.md` (Stack, optional Foto) und `privacy.md`.
9. Branch nach `main` mergen. GitHub Pages baut automatisch.

## Bestehende Posts anpassen

Damit alte Beiträge in Listen und Topics richtig erscheinen, im Front Matter ergänzen:

```yaml
---
title: Comments in Code – Necessary or Redundant?
description: Why the why belongs in comments, the business context in Git, and the rest in readable code.
topics: [clean-code]
---
```

Die URLs bleiben gleich (`permalink: /:title/`), z. B. `/comments-in-code/`. Der RSS-Feed liegt wie bisher unter `/feed.xml`.

## Neue Notiz schreiben (auch aus Obsidian)

Datei `_posts/JJJJ-MM-TT-slug.md`:

```yaml
---
title: Building an MCP server for Proxmox
description: What went wrong, and how I got it working.
topics: [homelab, ai]
status: draft          # optional: draft | evergreen
tldr: One or two sentences.   # optional, erscheint als Kasten oben
sources:               # optional
  - title: Name der Quelle
    url: https://…
---
Text in Markdown …

<div class="practice" markdown="1">

## From practice

Hervorgehobener Erfahrungs-Kasten.

</div>
```

**Obsidian-Workflow:** Lege in deinem Vault einen Ordner an, der direkt auf `_posts/` im Repo zeigt (Repo als Vault-Unterordner klonen oder Symlink), und nutze das Plugin *Obsidian Git* zum Committen. Verwende in öffentlichen Notizen normale Markdown-Links statt `[[Wikilinks]]`. Wikilinks und Backlinks bräuchten ein zusätzliches Plugin und den Build über GitHub Actions; das kann man später ergänzen.

## Neues Thema / neues Tool

- Thema: Eintrag in `_data/topics.yml`, dann die `id` in Notizen verwenden. Themen ohne Notizen werden automatisch ausgeblendet.
- Tool: Eintrag in `_data/tools.yml` mit `os: windows | macos | both`.

## Bleistift-Diagramme

`_includes/sketch/strangler-fig.html` ist die Vorlage. Kästen (`sketch-box`, Varianten `--accent`, `--secondary`, `--dashed`) und Pfeile (`sketch-arrow`) bekommen den Bleistift-Look automatisch über den SVG-Filter in `sketch-defs.html`, die Farben passen sich Tag und Nacht an. In einer Notiz einbinden mit:

```liquid
{% include sketch/strangler-fig.html %}
```

## Farben ändern

Alle Farben stehen oben in `assets/css/main.css` als Variablen, einmal für `data-theme="dark"` und einmal für `"light"`.

## Bücherregal „On my desk“

Die Bücher auf der Startseite stehen in `_data/books.yml` (Titel, Autor, Verlag, Link, Farbe und Höhe des Buchrückens, optional `subtitle` und `note`). Es werden bewusst keine Cover verwendet, sondern typografische Buchrücken, damit keine Bildrechte nötig sind.

## Schalter in `_config.yml`

- `show_notes: true` zeigt „Notes“ im Menü und „Latest notes“ auf der Startseite. Auf `false` stellen, falls keine Notizen da sind.
- „Coming soon“ auf der Startseite kommt aus `_data/upcoming.yml`. Leere Datei = Block verschwindet.
- `show_topics: false` blendet „Topics“ aus.

## Vorschaubild und Favicon

- `assets/img/og-image.png` (1200 × 630) erscheint, wenn der Link auf LinkedIn, Slack usw. geteilt wird. Gesetzt über `defaults` → `image` in `_config.yml`; einzelne Notizen können im Front Matter ein eigenes `image:` angeben.
- `favicon-32.png`, `icon-512.png` und `apple-touch-icon.png` sind das JK-Icon für Browser-Tab und Homescreen.
- Die Rolle unter der Headline steht in `_config.yml` unter `author.role`.

## Suchmaschinen

Eingebaut: Titel, Beschreibung, Canonical-URL, Open-Graph-/Twitter-Vorschau und strukturierte Daten (jekyll-seo-tag), `sitemap.xml`, `robots.txt`, RSS-Feed, Person-Verknüpfung zu GitHub und LinkedIn (`social` in `_config.yml`) und eine Weiterleitung der alten `/archive/`-Seite auf `/notes/`.

Selbst erledigen:
1. **www-Variante:** `url` ist auf `https://www.kuehnemundt.com` gesetzt. Deine bestehende `CNAME`-Datei muss entsprechend `www.kuehnemundt.com` enthalten.
2. **Google Search Console:** Domain hinzufügen, Verifizierungscode als `google_site_verification` in `_config.yml` eintragen, danach `https://…/sitemap.xml` einreichen.
3. **Jede Notiz bekommt eine `description`** im Front Matter. Sie wird zum Suchergebnis-Text.
4. **Profile verlinken:** auf LinkedIn und GitHub die Website als Link eintragen.

## Automatisch bauen mit GitHub Actions

`.github/workflows/pages.yml` baut die Seite bei jedem Push auf `main` und veröffentlicht sie. Die Schriften werden dabei automatisch geladen, du musst `fetch-fonts.sh` also nicht selbst ausführen.

Einmalig einstellen: im Repo **Settings → Pages → Build and deployment → Source: „GitHub Actions“**. Danach reicht es, eine Markdown-Datei in `_posts/` zu ändern und zu pushen. Den Fortschritt siehst du im Tab **Actions**.
