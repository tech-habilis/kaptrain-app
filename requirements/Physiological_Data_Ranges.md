
# Kaptrain – Mobile App
## Mes données physiologiques (Functional Requirements)

### Scope
This document defines functional requirements, validation rules, and acceptable data ranges
for physiological metrics used to personalize training zones and calculations.

---

## Metrics & Validation Rules

### FC Max (bpm)
- Range: 120–230 bpm
- Typical: 160–205 bpm
- Error if outside range

### VMA (km/h)
- Range: 6–30 km/h
- Typical: 8–25 km/h
- Error if <6 or >30

### FTP (W)
- Range: 80–600 W
- Typical: 120–380 W
- Error if <80 or >600

### PMA (W)
- Range: 120–900 W
- Typical: 180–700 W
- Must be ≥ FTP
