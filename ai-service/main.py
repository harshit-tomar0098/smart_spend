from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest

app = FastAPI(title="SmartSpend AI Engine")

# Dummy models
spending_model = LinearRegression()
anomaly_detector = IsolationForest(contamination=0.05, random_state=42)

class Transaction(BaseModel):
    id: str
    amount: float
    category: str
    date: str

class PredictRequest(BaseModel):
    user_id: str
    history: List[float] # Monthly totals

class AnomalyRequest(BaseModel):
    transactions: List[Transaction]

@app.get("/")
def read_root():
    return {"status": "ok", "message": "SmartSpend AI Engine Running"}

@app.post("/predict/next-month")
def predict_next_month(req: PredictRequest):
    # Dummy ML inference: Linear Regression on past N months
    if len(req.history) < 2:
        return {"predicted_amount": req.history[-1] if req.history else 0.0}
    
    X = np.array(range(len(req.history))).reshape(-1, 1)
    y = np.array(req.history)
    
    spending_model.fit(X, y)
    next_month_idx = np.array([[len(req.history)]])
    pred = spending_model.predict(next_month_idx)
    
    return {"predicted_amount": round(float(pred[0]), 2)}

@app.post("/detect/anomalies")
def detect_anomalies(req: AnomalyRequest):
    if not req.transactions:
        return {"anomalies": []}
        
    amounts = np.array([t.amount for t in req.transactions]).reshape(-1, 1)
    
    if len(amounts) < 5:
        # Not enough data for isolation forest
        return {"anomalies": []}
        
    preds = anomaly_detector.fit_predict(amounts)
    
    anomalies = []
    for idx, is_inlier in enumerate(preds):
        if is_inlier == -1: # -1 indicates anomaly
            anomalies.append({
                "transaction_id": req.transactions[idx].id,
                "amount": req.transactions[idx].amount,
                "reason": "Unusual amount detected"
            })
            
    return {"anomalies": anomalies}

@app.post("/recommend/savings")
def recommend_savings():
    # Dummy recommendation engine
    tips = [
        "Cancel unused subscriptions: You haven't used Hulu in 2 months.",
        "Transfer $200 to savings: Based on your current run rate, you'll have extra cash.",
        "Switch energy providers: Average utility costs in your area are 15% lower."
    ]
    return {"recommendations": tips}
