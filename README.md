# AI Root Cause Analysis Chatbot – Automobile Industry  

## Overview
This project is an *AI-powered Root Cause Analysis (RCA) chatbot* built specifically for the *automobile and two-wheeler manufacturing industry*.  
It helps engineers and maintenance teams identify machine problems, analyze probable root causes, and suggest corrective actions efficiently.

The chatbot uses a *local dataset of 100 industrial machine issues* for instant responses, and automatically connects to *Gemini AI* for new or unseen problems.

---

## Features
- ⚡ *Instant responses* from a local 100-problem dataset  
- 🌐 *Gemini API fallback* for unknown queries  
- 🧠 *Semantic similarity search* for related issues  
- 🎙 *Voice input* support (microphone integration)  
- 📄 *Downloadable diagnostic reports (PDF)*  
- 🚀 *Optimized for speed* using caching and token limits  
- 🦺 *Safety-aware* — includes standard maintenance safety notes  

---

## Domain Coverage
Covers machines used in the *automobile and two-wheeler industries*, including:
- CNC Machines  
- Hydraulic Presses  
- Robotic Welders  
- Conveyors  
- Electric Motors  
- Paint Booth Equipment  
- Air Compressors  
- Battery Assembly Systems  

---

## Dataset
- *Entries:* 100 common industrial machine problems  
- *Format:* JSON / CSV  
- *Fields:*
  ```json
  {
    "issue": "Electric motor overheating",
    "rootCauses": [
      "Poor ventilation",
      "Overloading",
      "Phase imbalance",
      "Bearing failure"
    ],
    "actions": [
      "Clean air vents and ensure airflow",
      "Reduce mechanical load",
      "Check voltage balance",
      "Lubricate or replace bearings"
    ],
    "severity": "High",
    "machineType": "Motor"
  }
