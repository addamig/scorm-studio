# SCORM Studio

AI-driven kursbyggare som genererar kompletta SCORM 2004-paket redo för ditt LMS.

## Funktioner

- 🤖 **AI-genererade kurser** — Beskriv din utbildning i fritext, AI:n bygger allt
- 🎭 **Interaktiva scenarion** — Realistiska arbetsplatsscenarier med feedback
- ❓ **Quiz med resultat** — Automatisk rättning och godkäntgräns
- 📦 **SCORM 2004-export** — Ladda ner .zip redo för Moodle, Learnster, TalentLMS m.fl.
- ✨ **AI-redigering** — Ändra kursen med naturligt språk
- 🌙 **Dark/Light mode** — Automatisk eller manuell

## Kom igång

```bash
npm install
npm run dev
```

## Bygga för produktion

```bash
npm run build
```

## Teknisk stack

- React 18 + Vite
- Claude API (Sonnet) för kursgenerering
- JSZip för SCORM-paketexport
- Ren CSS (inga externa UI-libs)

## SCORM-kompatibilitet

Exporterade paket följer SCORM 2004 4th Edition och fungerar med:
- Moodle
- Learnster
- TalentLMS
- Cornerstone
- SAP SuccessFactors
- Och andra SCORM 2004-kompatibla LMS

## Licens

MIT
