# Automating KYC & AML @ JPMorgan Chase  

![KYC](https://img.shields.io/badge/KYC-Compliance-blue) 
![AML](https://img.shields.io/badge/AML-Monitoring-orange)
![OCR](https://img.shields.io/badge/OCR-Document%20Processing-green)
![AML-Compliance](https://img.shields.io/badge/Compliance-Automation-lightgrey)
![Machine-Learning](https://img.shields.io/badge/Machine%20Learning-Python-yellow)

![pexels-davegarcia-32642491](https://github.com/user-attachments/assets/e1a388a3-e73a-439a-bdb8-bd8303b1ffb0)


### 🚀 Project Overview  
This project automates Know Your Customer (KYC) and Anti-Money Laundering (AML) checks using OCR and Machine Learning techniques.  
It was designed to help financial institutions streamline document verification, detect anomalies, and improve regulatory compliance.  

## Business Impact  
- **58 % reduction** in KYC review time (95 → 40 days)  
- **41 % drop** in false-positive alerts (93 % → 55 %)  
- **\$1 200 cost/file** vs. \$2 500 baseline (prototype)  
- Projected **\$78 M annual savings** at 60 k monthly files

## Data & Tools  
- **Document data:** ID scans, OCR text, entity matches  
- **Transaction data:** sender/receiver, amounts, geo, AML flags  
- **External:** sanctions & PEP lists  
- **Tech stack:** Python (Tesseract, scikit-learn, XGBoost), AWS Textract (future), SHAP for explainability

## Methodology  
1. **OCR & NLP:** Tesseract OCR (89 % passport accuracy) → extract fields  
2. **Rule engine:** initial filters on transaction thresholds  
3. **ML models:** XGBoost + Isolation Forest for anomaly detection  
4. **Risk scoring:** 60 % document + 40 % transaction blend  
5. **Explainability:** SHAP reports for audit-ready insights

## Next Steps
	•	Swap Tesseract for AWS Textract
	•	Expand ML to deep-learning OCR
	•	Deploy as serverless API for real-time checks

## Authors
Akram Mohammed • Pooja Pillay Shivakumar • Amarjeet

Capstone Project for MSc Business Analytics, CSU East Bay
