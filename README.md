![KYC] ![AML] ![OCR] ![AML-Compliance] ![Machine-Learning]
# Automating KYC & AML @ JPMorgan Chase

## 1 Overview  
This capstone project delivers an end-to-end pipeline that speeds up Know Your Customer (KYC) document checks and cuts false-positive Anti-Money Laundering (AML) alerts using OCR, rules, and ML models.

## 2 Business Impact  
- **58 % reduction** in KYC review time (95 → 40 days)  
- **41 % drop** in false-positive alerts (93 % → 55 %)  
- **\$1 200 cost/file** vs. \$2 500 baseline (prototype)  
- Projected **\$78 M annual savings** at 60 k monthly files

## 3 Data & Tools  
- **Document data:** ID scans, OCR text, entity matches  
- **Transaction data:** sender/receiver, amounts, geo, AML flags  
- **External:** sanctions & PEP lists  
- **Tech stack:** Python (Tesseract, scikit-learn, XGBoost), AWS Textract (future), SHAP for explainability

## 4 Methodology  
1. **OCR & NLP:** Tesseract OCR (89 % passport accuracy) → extract fields  
2. **Rule engine:** initial filters on transaction thresholds  
3. **ML models:** XGBoost + Isolation Forest for anomaly detection  
4. **Risk scoring:** 60 % document + 40 % transaction blend  
5. **Explainability:** SHAP reports for audit-ready insights

## 5 Next Steps
	•	Swap Tesseract for AWS Textract
	•	Expand ML to deep-learning OCR
	•	Deploy as serverless API for real-time checks

## 6 Authors
Akram Mohammed • Pooja Pillay Shivakumar • Amarjeet

MSc Business Analytics, CSU East Bay
