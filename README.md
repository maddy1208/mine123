# 🐞 Bug Hunter | Web Developer

**Welcome.** This repository is a personal vault of my learning notes, practice code, mini-projects, automation tools, and my own scripts. It’s the place where I break things, build them back, and sharpen my skills in web development and security.

> Owner: **maddy1208**
> Contact: **[madhanmohanr1208@gmail.com](mailto:madhanmohanr1208@gmail.com)**

---

## 📚 What’s in this repo


1. BUG HUNTING / PENTESTING
```
1_phase — Target selection: scripts, notes, and selection heuristics I use to pick targets.

2_phase_recon_autom — Reconnaissance and full automation: scans, passive/active enumeration, automated collectors and parsers.

3_pre_hunt — Pre-hunt checks and quick triage: fingerprinting, interesting endpoints, quick vulnerability heuristics.

4_phase_manual_hunt — Manual hunting: interactive testing, proof-of-concept development, and validation.

403_bypass — Techniques, PoCs and scripts specifically for bypassing access control or 403 restrictions (for authorized tests only).

bin_deps — Binaries and dependencies required by my tools (prebuilt or downloaded), with README for provenance and license notes.

programs — My program list.

reports — Saved reports, write-up templates and historical findings.

tools_to_install.txt — Tools that has to be installed

update_tools.sh — Self-updating script to refresh or install tools from this repo.

```
2. WEB DEV
 ```
css/ — Utilities, layout experiments, and advanced CSS patterns.

html/ — Static pages, templates, and markup best-practices.

js/ — Vanilla JS snippets, patterns, and small widgets.

node_express/ — Backend examples, node js code and middleware examples.

react/ — Components, hooks, notes, and small React apps — includes examples, tests, and architecture notes.

```
## 🧭 Quick start (for contributors / future-you)

> This repo is private and used for personal learning. If you ever open parts of it, follow the responsible-use guidelines below.


## ✨ Highlights

* **Notes:** In-depth notes for React (hooks, context, router patterns), Node & Express best practices, and a dedicated `web-security.md` covering common vulnerability classes (XSS, CSRF, SSRF, auth issues, misconfigurations).
* **Tools:** Recon & automation tools written by me (small CLI utilities and scripts). Each tool includes example usage and minimal safety checks.
* **Mini-projects:** Lightweight full-stack and front-end projects to demonstrate features, build portfolios, and test integrations.
* **Bug bounty content:** Templates, checklists, known payloads (for learning only), and my personal workflow for triaging/validating findings.

---

## ✅ How I organize notes (so you can find things fast)

* **Topics first:** One file per major topic (e.g., `react.md`, `web-security.md`).
* **Examples:** Minimal, runnable examples are included inline (or in `/practice/`).
* **Indexing:** Use the repo search or `grep`/`ripgrep` for quick lookup.

---

## 🚦 Safety & Responsible Use

This repo contains code and security-related notes intended for learning and safe testing in authorized environments only.

* Do **not** run pentest or exploit code against systems you do not own or have explicit permission to test.
* Sanitize and isolate testing environments — use VMs, containers, or dedicated test accounts.
* If you discover a real vulnerability in a third-party system, follow their responsible disclosure policy.

**Reporting security issues in this repo:** see [SECURITY.md](./SECURITY.md) or email **[madhanmohanr1208@gmail.com](mailto:madhanmohanr1208@gmail.com)**.

---

## 🧪 How to run tools & scripts

Each tool or script folder includes a short `USAGE.md`. General rules:

1. Inspect the code before running.
2. Run in a sandbox (Docker/VM) when network or system changes are involved.
3. Use `--help` or open the tool `README` for examples.

## 🧰 Tech & Skills

* **Languages / Frameworks:** HTML, CSS, JavaScript, React, Node.js, Express
* **Security / Pentesting:** Reconnaissance, XSS/CSRF/IDOR/RCE discovery patterns, automated scanning, manual validation, exploit crafting (learning/testing only)
* **Tools I use:** Node, npm/yarn, Docker, curl, nmap, burp suite (notes), custom automation scripts

---

---

## 🧾 Notes on bug bounty content

* I keep a folder of templates for write-ups and reproducible steps.
* Tools in `/tools/` should include a `README` explaining whether they are PoC, automation helpers, or full tools.
* Anything that interacts with third-party services must have a clear note: **only use against targets you are authorized to test**.

---

## 🧭 Contribution & personal workflow

This is primarily a personal repo. If you ever share it or accept collaborators:

* Use feature branches and small PRs.
* Add tests or basic assertions for automation tools.
* Always include a short `CHANGELOG.md` entry for any change that affects tooling or security-related behavior.

---

## 📬 Contact & Responsible Disclosure

If you need to contact me about anything related to this repository (questions, security reports, or collaboration):

* **Email:** [madhanmohanr1208@gmail.com](mailto:madhanmohanr1208@gmail.com)

I will respond to responsible reports and questions—please allow time for investigation.

---

> *Personal note:* This repo is my learning playground. It contains experimental code and notes; treat it as an evolving collection rather than a polished product.

---
