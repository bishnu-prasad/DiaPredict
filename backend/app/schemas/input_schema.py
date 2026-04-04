from pydantic import BaseModel,Field

# class DiabetesInput(BaseModel):
#   gender:int
#   age:float
#   hypertension:int
#   heart_disease: int
#   bmi: float
#   HbA1c_level: float
#   blood_glucose_level: float
#   smoking_history_ever: int
#   smoking_history_former: int
#   smoking_history_never: int
#   smoking_history_not_current: int
class DiabetesInput(BaseModel):
    gender: int = Field(..., ge=0, le=1)
    age: float = Field(..., ge=1, le=120)
    hypertension: int = Field(..., ge=0, le=1)
    heart_disease: int = Field(..., ge=0, le=1)
    bmi: float = Field(..., ge=10, le=60)
    HbA1c_level: float = Field(..., ge=3, le=15)
    blood_glucose_level: float = Field(..., ge=50, le=300)
    smoking_history: str
