# TryHackMe-Statistik auf /about/

TryHackMe blockt Anfragen aus Rechenzentren (also auch GitHub Actions). Deshalb holt ein kleiner Job im Homelab die Werte einmal pro Woche ab und schreibt sie per GitHub-API nach `_data/tryhackme.yml`. Der Commit löst den normalen Pages-Build aus. Ändert sich nichts, wird auch nichts committet.

Solange `updated` in `_data/tryhackme.yml` leer ist, zeigt die About-Seite keine Statistik an.

## Einrichtung (Debian/Ubuntu-LXC auf Proxmox)

1. **GitHub-Token anlegen:** GitHub → Settings → Developer settings → Fine-grained tokens → Repository access: nur `jkuehnemundt.github.io` → Permissions: *Contents: Read and write*. Ablaufdatum setzen (z. B. 1 Jahr).
2. **Im Container:**
   ```bash
   apt install -y python3-venv
   mkdir -p /opt/tryhackme-stats
   cp update.py /opt/tryhackme-stats/
   python3 -m venv /opt/tryhackme-stats/venv
   /opt/tryhackme-stats/venv/bin/pip install curl_cffi
   ```
3. **Zugangsdaten** in `/etc/tryhackme-stats.env` (danach `chmod 600`):
   ```
   THM_USERNAME=1ntrusvsVatic4n1.0x7
   GITHUB_TOKEN=github_pat_…
   ```
4. **Timer aktivieren:**
   ```bash
   cp tryhackme-stats.service tryhackme-stats.timer /etc/systemd/system/
   systemctl daemon-reload
   systemctl enable --now tryhackme-stats.timer
   systemctl start tryhackme-stats.service   # einmal sofort ausführen
   journalctl -u tryhackme-stats -n 20       # Ergebnis ansehen
   ```

Läuft der Job wöchentlich sonntags um 18 Uhr. Schlägt der Abruf fehl (z. B. weil TryHackMe die Schnittstelle ändert), bleibt einfach der letzte Stand auf der Seite stehen.

Ohne Homelab geht es auch einmalig vom eigenen Rechner: dieselben zwei Variablen setzen und `python update.py` ausführen.
