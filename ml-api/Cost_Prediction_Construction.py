from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import logging

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

# Load model components
model = joblib.load('model_tuned.pkl')
scaler = joblib.load('scaler.pkl')
encoder = joblib.load('encoder.pkl')
feature_names = joblib.load('feature_names.pkl')

# Define numerical and categorical features
numerical_features = [
    'Slab Area (Sqft)',
    'Saleable Area (Sqft)',
    'Available FSI',
    'Number of Basements (numbers)',
    'Number of Podiums (numbers)',
    'Number of Ground floors (numbers)',
    'Number of typical Floors (numbers)',
    # Include any other numerical features used during training
]

categorical_features = [
    'Type/Class of Project',
    'Type of Building',
    'Type of Structure',
    # Include any other categorical features used during training
]

def preprocess_input(data):
    # Convert input data to DataFrame
    input_df = pd.DataFrame([data])

    # Ensure all expected columns are present
    for feature in numerical_features + categorical_features:
        if feature not in input_df.columns:
            input_df[feature] = np.nan

    # Handle missing numerical features
    input_df[numerical_features] = input_df[numerical_features].fillna(0).astype(float)

    # Handle missing categorical features
    input_df[categorical_features] = input_df[categorical_features].fillna('Unknown')

    # Separate numerical and categorical data
    X_num = input_df[numerical_features]
    X_cat = input_df[categorical_features]

    # Transform numerical features using the loaded scaler
    X_num_scaled = scaler.transform(X_num)

    # Transform categorical features using the loaded encoder
    X_cat_encoded = encoder.transform(X_cat)

    # Combine numerical and encoded categorical features
    input_features = np.hstack([X_num_scaled, X_cat_encoded])

    return input_features

@app.route('/', methods=['GET'])
def home():
    return "Flask server is running.", 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        app.logger.debug(f"Received data: {data}")

        # Preprocess the input
        input_features = preprocess_input(data)
        app.logger.debug(f"Input features shape: {input_features.shape}")

        # Make prediction
        total_budget_construction = model.predict(input_features)[0]
        app.logger.debug(f"Total Budget of Project Construction: {total_budget_construction}")

        # Rates per sqft
        slab_area = float(data.get('Slab Area (Sqft)', 1))
        saleable_area = float(data.get('Saleable Area (Sqft)', 1))
        rate_per_sqft_slab = total_budget_construction / slab_area
        rate_per_sqft_saleable = total_budget_construction / saleable_area

        # Define the percentages for each budget head
        # Ensure that the percentages sum up appropriately within each section
        budget_breakdown = [
            {
                'section': 'A. CONSTRUCTION BUDGET: ALL BUILDINGS',
                'items': [
                    {'sr_no': 1, 'head': 'Earth Work', 'percentage': 0.0121},
                    {'sr_no': 2, 'head': 'RCC Work', 'percentage': 0.4088},
                    {'sr_no': 3, 'head': 'Masonry, Plaster Work', 'percentage': 0.0427},
                    {'sr_no': 4, 'head': 'Waterproofing Work', 'percentage': 0.0154},
                    {'sr_no': 5, 'head': 'Doors & Wooden Works', 'percentage': 0.0130},
                    {'sr_no': 6, 'head': 'Windows & Sliding Doors', 'percentage': 0.0577},
                    {'sr_no': 7, 'head': 'Flooring and Tiling works', 'percentage': 0.0604},
                    {'sr_no': 8, 'head': 'MS & SS Works- Grills & Railings', 'percentage': 0.0147},
                    {'sr_no': 9, 'head': 'Painting & Polishing Works', 'percentage': 0.0305},
                    {'sr_no': 10, 'head': 'Plumbing, Drainage Work', 'percentage': 0.0425},
                    {'sr_no': 11, 'head': 'Electrical Work', 'percentage': 0.0340},
                    {'sr_no': 12, 'head': 'Lift Work', 'percentage': 0.0409},
                    {'sr_no': 13, 'head': 'Buildings Fire Fighting Work', 'percentage': 0.0278},
                    {'sr_no': 14, 'head': 'Elevation, Glazing, Facade Work', 'percentage': 0.0049},
                    {'sr_no': 15, 'head': 'Bldg Amenities', 'percentage': 0.0154},
                    {'sr_no': 16, 'head': 'Misc, Dep. Labour, Cleaning', 'percentage': 0.0132},
                ],
                'total_percentage': 0.8330,
                'total_head': 'BUDGET FOR BUILDINGS'
            },
            {
                'section': 'B. PROJECT INFRASTRUCTURE & AMENITIES',
                'items': [
                    {'sr_no': 17, 'head': 'Civil Infrastructure', 'percentage': 0.0148},
                    {'sr_no': 18, 'head': 'Services Civil Infrastructure', 'percentage': 0.0171},
                    {'sr_no': 19, 'head': 'Plumbing Services', 'percentage': 0.0174},
                    {'sr_no': 20, 'head': 'Electrical Services', 'percentage': 0.0210},
                    {'sr_no': 21, 'head': 'Project Amenities', 'percentage': 0.0353},
                ],
                'total_percentage': 0.1056,
                'total_head': 'BUDGET FOR INFRA & AMENITIES'
            },
            {
                'section': 'C. TECHNICAL OVERHEADS',
                'items': [
                    {'sr_no': 22, 'head': 'Technical Consultants', 'percentage': 0.0096},
                    {'sr_no': 23, 'head': 'Site Overhead Expenses', 'percentage': 0.0550},
                ],
                'total_percentage': 0.0646,
                'total_head': 'BUDGET FOR INDIRECT EXPENSES'
            },
            {
                'section': 'TOTAL BUDGET OF PROJECT CONSTRUCTION',
                'items': [],
                'total_percentage': 1.0,
                'total_head': 'TOTAL BUDGET OF PROJECT CONSTRUCTION'
            },
            {
                'section': 'D. OTHER NON TECHNICAL EXPENSES',
                'items': [
                    {'sr_no': 24, 'head': 'Marketing, Sales, Sample Flat and Challans', 'percentage': 0.0525},
                    {'sr_no': 25, 'head': 'Statutory Charges', 'percentage': 0.1375},
                    {'sr_no': 26, 'head': 'Non Technical Overheads', 'percentage': 0.0518},
                    {'sr_no': 27, 'head': 'Land,TDR, FSI Cost', 'percentage': 0.0},
                ],
                'total_percentage': 0.2418,
                'total_head': 'BUDGET FOR OTHER NON TECHNICAL'
            },
            {
                'section': 'TOTAL PROJECT EXECUTION & SALES BUDGET',
                'items': [],
                'total_percentage': 1.2418,
                'total_head': 'TOTAL PROJECT EXECUTION & SALES BUDGET'
            },
        ]

        # Calculate amounts for each budget head
        breakdown = []
        for section in budget_breakdown:
            section_total_amount = total_budget_construction * section['total_percentage']
            section_total_rate_slab = section_total_amount / slab_area
            section_total_rate_saleable = section_total_amount / saleable_area

            # Items within the section
            items = []
            for item in section['items']:
                amount = total_budget_construction * item['percentage']
                rate_slab = amount / slab_area
                rate_saleable = amount / saleable_area

                items.append({
                    'sr_no': item['sr_no'],
                    'head': item['head'],
                    'amount': amount,
                    'rate_slab': rate_slab,
                    'rate_saleable': rate_saleable,
                })

            # Append section data
            breakdown.append({
                'section': section['section'],
                'items': items,
                'section_total': {
                    'head': section['total_head'],
                    'amount': section_total_amount,
                    'rate_slab': section_total_rate_slab,
                    'rate_saleable': section_total_rate_saleable,
                }
            })

        response = {
            'project_name': data.get('Project Name', ''),
            'total_budget_construction': total_budget_construction,
            'rate_per_sqft_slab': rate_per_sqft_slab,
            'rate_per_sqft_saleable': rate_per_sqft_saleable,
            'breakdown': breakdown,
        }

        return jsonify(response)
    except Exception as e:
        app.logger.error(f'Error during prediction: {str(e)}', exc_info=True)
        return jsonify({'error': f'Error during prediction: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
