from fastapi import APIRouter
from app.schemas.input_schema import DiabetesInput
from app.services.predictor import predict_diabetes

router = APIRouter()



@router.post("/predict")
def predict(data: DiabetesInput):
  try:
    prediction, probability = predict_diabetes(data)
    if probability < 0.3:
        risk = "Low Risk of Diabetes"
    elif 0.3 <= probability < 0.7:
        risk = "Moderate Risk of Diabetes"
    else:
        risk = "High Risk of Diabetes"

    return {
        "prediction": int(prediction),
        "probability": float(probability),
        "risk_level":risk
    }
  except Exception as e:
    return {
      "error":str(e)
    }