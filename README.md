# BioMinute Shorts Studio 🎬

> AI-powered health-science YouTube Shorts production pipeline — from master plan spreadsheet to published video, fully automated.

[![Version](https://img.shields.io/badge/version-v0.2.0-blue.svg)](VERSION.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node-24-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-workspaces-orange.svg)](https://pnpm.io)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![Automation](https://img.shields.io/badge/Automation-Custom-blue)](https://github.com/0utLawzz)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com/0utLawzz/biominute-shorts-studio)

## Topics / Keywords
`biominute` `youtube-shorts` `health` `ai-pipeline` `react` `typescript` `pnpm` `video-production` `automation` `custom-automation`

## What is this?
**BioMinute Shorts Studio** is a monorepo production system for the **BioMinute** health channel — a YouTube Shorts series delivering 60-second, science-backed health insights. Full episode lifecycle from spreadsheet master plan → animated video → publish.

See the full architecture, pipeline, commands, and documentation in the sections below and in the `docs/` folder.

## Author
**Nadeem (OutLawZ)**  
Custom Automation Specialist  

📧 Contact: [net2outlawzz@gmail.com](mailto:net2outlawzz@gmail.com)  
🔗 GitHub: [0utLawzz](https://github.com/0utLawzz)

---

*Need custom YouTube Shorts / content production automation? Contact me.*

---

## Pipeline Flow

```mermaid
flowchart LR
    A[📄 Master Plan<br/>XLSX] --> B[🎬 biominute-reels<br/>React/Framer Motion scenes]
    B --> C[📦 export-video<br/>Playwright + ffmpeg]
    C --> D[💾 exports/Episode-NN-slug/<br/>episode.mp4 + thumbnail.png]
    D --> E[📊 publishing-dashboard<br/>Review + approve + metadata]
    E --> F[🔌 api-server<br/>Drizzle + YouTube Data API]
    F --> G[📺 YouTube Shorts]
```

## Quick Start
```bash
pnpm install
pnpm --filter @workspace/db push-force
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts
# Start api-server, publishing-dashboard, biominute-reels in separate terminals
```

Full docs: [`docs/INSTALL.md`](docs/INSTALL.md) · [`docs/RUN.md`](docs/RUN.md) · [`docs/USAGE.md`](docs/USAGE.md)

## License
MIT © BioMinute Studio / Nadeem (OutLawZ)
