# train_model.py

import pandas as pd
import numpy as np
import matplotlib
# Use a non-interactive backend
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib

# Load your data
data = pd.read_csv('Historical_Data.csv')

# Identify numerical and categorical columns
numeric_columns = [
    'Sr no',
    'Slab Area (Sqft)',
    'Saleable Area (Sqft)',
    'Available FSI',
    'Number of Basements (numbers)',
    'Number of Podiums (numbers)',
    'Number of Ground floors (numbers)',
    'Number of typical Floors (numbers)',
    # Add other numerical cost columns if needed
]

categorical_columns = [
    'Project Name',
    'Type/Class of Project',
    'Project Location',
    'Type of Building',
    'Type of Structure',
    # Add other categorical columns if needed
]

# Remove commas and convert numeric columns to float
for column in numeric_columns:
    data[column] = data[column].astype(str).str.replace(',', '').astype(float)

# Fill missing numerical values with column mean
data[numeric_columns] = data[numeric_columns].fillna(data[numeric_columns].mean())

# Fill missing categorical values with 'Unknown'
data[categorical_columns] = data[categorical_columns].fillna('Unknown')

# Calculate total budget
budget_columns = [
    'TOTAL BUDGET FOR BUILDINGS',
    'TOTAL BUDGET FOR INFRA & AMENITIES',
    'TOTAL BUDGET FOR INDIRECT EXPENSES'
]

for column in budget_columns:
    data[column] = data[column].astype(str).str.replace(',', '').astype(float)

data[budget_columns] = data[budget_columns].fillna(0)
data['TOTAL BUDGET OF PROJECT CONSTRUCTION'] = data[budget_columns].sum(axis=1)

# Define features and target
X = data[numeric_columns + categorical_columns]
y = data['TOTAL BUDGET OF PROJECT CONSTRUCTION']

# Handle missing values in 'Available FSI' specifically
if data['Available FSI'].isnull().any():
    data['Available FSI'] = data['Available FSI'].fillna(data['Available FSI'].mean())

# One-Hot Encode categorical variables
encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
X_cat_encoded = encoder.fit_transform(X[categorical_columns])

# Scale numerical features
scaler = StandardScaler()
X_num_scaled = scaler.fit_transform(data[numeric_columns])

# Combine features
X_combined = np.hstack([X_num_scaled, X_cat_encoded])

# Update feature names
feature_names_num = numeric_columns
feature_names_cat = encoder.get_feature_names_out(categorical_columns).tolist()
feature_names = feature_names_num + feature_names_cat

# Check for NaNs in X_combined
if np.isnan(X_combined).any():
    print("Found NaNs in X_combined. Handling missing values...")
    X_combined = np.nan_to_num(X_combined, nan=0.0, posinf=0.0, neginf=0.0)

# Check for NaNs in y
if np.isnan(y).any():
    print("Found NaNs in y. Handling missing values...")
    y = np.nan_to_num(y, nan=0.0, posinf=0.0, neginf=0.0)

# Save encoder, scaler, and feature names
joblib.dump(encoder, 'encoder.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(feature_names, 'feature_names.pkl')

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_combined, y, test_size=0.2, random_state=42, shuffle=True
)

# Handle outliers in the target variable (Optional)
# Instead of removing outliers, we can cap them
from sklearn.preprocessing import QuantileTransformer

# Apply quantile transformation to reduce impact of outliers
qt = QuantileTransformer(output_distribution='normal', random_state=42)
y_train_transformed = qt.fit_transform(y_train.values.reshape(-1, 1)).flatten()
y_test_transformed = qt.transform(y_test.values.reshape(-1, 1)).flatten()

# Train a simple RandomForestRegressor
print("\nTraining a simple RandomForestRegressor...")
model = RandomForestRegressor(random_state=42)
model.fit(X_train, y_train_transformed)

# Evaluate the model
y_pred_transformed = model.predict(X_test)
# Inverse transform predictions
y_pred = qt.inverse_transform(y_pred_transformed.reshape(-1, 1)).flatten()
print("\nSimple Model Evaluation:")
print("MAE:", mean_absolute_error(y_test, y_pred))
print("MSE:", mean_squared_error(y_test, y_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred)))
print("R2 Score:", r2_score(y_test, y_pred))

# Analyze feature importances
importances = model.feature_importances_
indices = np.argsort(importances)[::-1]
print("\nTop 10 Feature Importances:")
for idx in indices[:10]:
    print(f"{feature_names[idx]}: {importances[idx]}")

# Cross-validation to assess model performance
print("\nPerforming cross-validation...")
cv_scores = cross_val_score(
    model, X_combined, qt.transform(y.values.reshape(-1, 1)).flatten(), cv=3, scoring='r2'
)
print("Cross-validation R² scores:", cv_scores)
print("Average R² score:", cv_scores.mean())

# Corrected parameter grid for hyperparameter tuning
param_grid = {
    'n_estimators': [50, 100],
    'max_depth': [None, 10],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False]
}

# Use GridSearchCV for exhaustive search
print("\nStarting hyperparameter tuning with GridSearchCV...")
grid_search = GridSearchCV(
    estimator=RandomForestRegressor(random_state=42),
    param_grid=param_grid,
    cv=3,
    n_jobs=-1,
    verbose=2,
    scoring='neg_mean_squared_error'  # Using MSE as the scoring metric
)

grid_search.fit(X_train, y_train_transformed)
best_model = grid_search.best_estimator_
print("\nBest Parameters:", grid_search.best_params_)

# Evaluate the best model
y_pred_best_transformed = best_model.predict(X_test)
y_pred_best = qt.inverse_transform(y_pred_best_transformed.reshape(-1, 1)).flatten()
print("\nTuned Model Evaluation:")
print("MAE:", mean_absolute_error(y_test, y_pred_best))
print("MSE:", mean_squared_error(y_test, y_pred_best))
print("RMSE:", np.sqrt(mean_squared_error(y_test, y_pred_best)))
print("R2 Score:", r2_score(y_test, y_pred_best))

# Save the best model
joblib.dump(best_model, 'model_tuned.pkl')
print("\nTuned model, scaler, encoder, and feature names saved.")

# Plot the distribution of the target variable
plt.figure()
plt.hist(y, bins=10, edgecolor='k')
plt.title("Distribution of Target Variable")
plt.xlabel("Total Budget of Project Construction")
plt.ylabel("Frequency")
plt.savefig('target_variable_distribution.png')  # Save the plot as an image file

# Plot feature importances
plt.figure(figsize=(10, 6))
plt.barh(range(len(indices[:10])), importances[indices[:10]], align='center')
plt.yticks(range(len(indices[:10])), [feature_names[i] for i in indices[:10]])
plt.gca().invert_yaxis()  # Invert y-axis to have the highest importance at the top
plt.xlabel('Feature Importance')
plt.title('Top 10 Feature Importances')
plt.tight_layout()
plt.savefig('feature_importances.png')
