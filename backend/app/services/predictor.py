import joblib 
import numpy as np 

#Load model and scaler
model = joblib.load("app/model/logistic_model.pkl")
scaler = joblib.load("app/model/scaler.pkl")


def encode_smoking(value):
    value = value.strip().lower()
    return {
        "ever": [1, 0, 0, 0],
        "former": [0, 1, 0, 0],
        "never": [0, 0, 1, 0],
        "not current": [0, 0, 0, 1],
        "current": [0, 0, 0, 0],
    }.get(value, [0, 0, 0, 0])


def predict_diabetes(data):
    # convert single dropdown value -> one-hot encoded features
    smoke = encode_smoking(data.smoking_history)

    input_data = np.array([[
        data.gender,
        data.age,
        data.hypertension,
        data.heart_disease,
        data.bmi,
        data.HbA1c_level,
        data.blood_glucose_level,
        smoke[0],  # ever
        smoke[1],  # former
        smoke[2],  # never
        smoke[3],  # not current
    ]], dtype=float)

    input_scaled = scaler.transform(input_data)

    prediction = model.predict(input_scaled)[0]
    probability = model.predict_proba(input_scaled)[0][1]

    return prediction, probability