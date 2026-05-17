# Anush Choudhary — Portfolio

Personal portfolio website built with vanilla HTML, CSS, and JavaScript. Features GSAP scroll animations, a Bayer-dithered canvas blob on the hero, and a custom cursor.

Live: **https://anush2712.github.io/anush-website/**

---

## Projects

### 01 — Rizzume · AI Resume Tailoring Platform
Chrome MV3 extension that auto-detects LinkedIn job postings and triggers a tailored resume + cover letter pipeline. FastAPI backend integrates FAISS vector search (RAG over resume chunks), LLM-driven bullet rewriting, ATS keyword scoring, and pdflatex compilation. Documented the API contract before implementation so frontend and backend could progress in parallel.

- **Stack:** Chrome Extension, FastAPI, RAG / FAISS, LLM, LaTeX, Docker
- **Impact:** ~90% reduction in application turnaround time
- **Repo:** [Anush2712/Rizzume](https://github.com/Anush2712/Rizzume)

---

### 02 — DublinBusNet · Real-Time Distributed Transit Tracker
Microservices system tracking Dublin Bus in real time. Python ingestion service polls GTFS-RT feeds every 30 s and writes to Redis; TypeScript/Express backend serves the REST API; React + MapLibre frontend renders live bus positions on a map. Built as UCD COMP41720 Distributed Systems capstone demonstrating fault tolerance and async communication patterns.

- **Stack:** Python, TypeScript, GTFS-RT, Redis, React, MapLibre, Docker
- **Role:** Team project — capstone for COMP41720 Distributed Systems
- **Repo:** [frederick2003/DublinBusNet](https://github.com/frederick2003/DublinBusNet-A-Distributed-Real-Time-Public-Transport-Tracker)

---

### 03 — Dublin Bikes Forecasting · Demand Prediction & Live Dashboard
Production demand-forecasting service for Dublin Bikes. Built a Python ingestion pipeline over the live JCDecaux API, engineered features for weather and public holidays, and trained regression models achieving R² ≈ 0.99 on hold-out data. Deployed behind a Flask endpoint with weekly stakeholder accuracy reporting.

- **Stack:** Python, Pandas, scikit-learn, Flask, Time-Series forecasting
- **Impact:** R² ≈ 0.99 on hold-out test data
- **Repo:** [xiaoxiajin/Dublin_Bikes](https://github.com/xiaoxiajin/Dublin_Bikes)

---

### 04 — Taximize · Taxi Demand Operations Platform
Cross-functional Agile build of a predictive platform for taxi demand in high-demand zones. Coordinated delivery in JIRA through sprints and retrospectives; contributed to the Python ML model and Flask service layer. Used AI-assisted tooling (Claude, GitHub Copilot) to accelerate prototyping without dropping review quality.

- **Stack:** Python, scikit-learn, Flask, Agile / JIRA
- **Impact:** Full delivery from requirements to deployment
- **Repo:** [matiasenrique/Taximize](https://github.com/matiasenrique/Taximize)

---

## Tech

- HTML · CSS · JavaScript (no framework)
- GSAP + ScrollTrigger for animations
- Bayer ordered-dithering on Canvas 2D
- GitHub Pages for hosting
