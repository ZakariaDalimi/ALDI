In dieser Datei wird erläutert, wie Visual Studio das Projekt erstellt hat.

Folgende Tools wurden zur Erstellung dieses Projekts verwendet:
- create-vite

Folgende Schritte wurden zur Erstellung dieses Projekts verwendet:
- Erstellen Sie ein React-Projekt mit create-vite: `npm init --yes vite@latest Client -- --template=react  --no-rolldown --no-immediate`..
- Aktualisieren Sie `vite.config.js`, um Proxys und Zertifikate einzurichten.
- Aktualisieren Sie `App`, um Wetterinformationen abzurufen und anzuzeigen.
- Projektdatei (`Client.esproj`) erstellen.
- Erstellen Sie `launch.json`, um das Debuggen zu aktivieren.
- Projekt zur Projektmappe hinzufügen.
- Aktualisieren Sie den Proxyendpunkt als Backend-Serverendpunkt.
- Fügen Sie das Projekt zur Liste der Startprojekte hinzu.
- Schreiben Sie diese Datei.
