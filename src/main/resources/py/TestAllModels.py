import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import warnings
import sys

# Suppress warnings
warnings.filterwarnings("ignore")

# Load the dataset
randomized_dataset = pd.read_csv("C:\\Users\\ahmad\\OneDrive\\Desktop\\LIVER_CANCER\\src\\main\\resources\\py\\h.csv")
data = randomized_dataset.sample(frac=1, random_state=7).reset_index(drop=True)

# Target variable: Map "Symbol" column to numbers
target = data.loc[:, "Symbol"]
target = np.where(target == "sl", 0,
         np.where(target == "lgdn", 1,
         np.where(target == "hgdn", 2,
         np.where(target == "ehcc", 3, 
         np.where(target == "phcc", 4, 0)))))

# Select only the five specific predictor columns
selected_genes = ["COLEC10", "ZBTB43", "DNAJB14", "CTBS", "MSH3"]  
data_predictors = data.loc[:, selected_genes]

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(data_predictors, target, test_size=0.22, random_state=44)

# Scale the data using StandardScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Initialize classifiers
classifiers = {
    "Gradient Boosting": GradientBoostingClassifier(random_state=44, max_depth=1, n_estimators=100),
}

# Train models and calculate metrics
results = {}
for name, clf in classifiers.items():
    # Use scaled data for SVC
    if name == "SVC":
        clf.fit(X_train_scaled, y_train)
        y_train_pred = clf.predict(X_train_scaled)
        y_test_pred = clf.predict(X_test_scaled)
    else:
        clf.fit(X_train, y_train)
        y_train_pred = clf.predict(X_train)
        y_test_pred = clf.predict(X_test)


    

# Display results

# Function to take input from the terminal and make predictions
def predict_from_terminal():
    if len(sys.argv) != len(selected_genes) + 1:
        print(f"Usage: {sys.argv[0]} <value1> <value2> ... <value{len(selected_genes)}>")
        sys.exit(1)

    try:
        # Parse input values from command line arguments
        input_values = list(map(float, sys.argv[1:]))
    except ValueError:
        print("Error: All input values must be numeric.")
        sys.exit(1)

    # Ensure the number of inputs matches the number of selected genes
    if len(input_values) != len(selected_genes):
        print(f"Error: Expected {len(selected_genes)} values but received {len(input_values)}.")
        sys.exit(1)

    # Create a DataFrame with the input data
    input_data = pd.DataFrame([dict(zip(selected_genes, input_values))])

    # Iterate over classifiers and make predictions
    for name, clf in classifiers.items():
        if name == "SVC":
            input_scaled = scaler.transform(input_data)
            prediction = clf.predict(input_scaled)
        else:
            prediction = clf.predict(input_data)

        # Map numerical predictions back to class names
        symbol_mapping = {0: "sl", 1: "lgdn", 2: "hgdn", 3: "ehcc", 4: "phcc"}
        predicted_class = symbol_mapping.get(prediction[0], "Unknown")
        print(f"\n{name} Prediction: {predicted_class}")

# Execute if called from terminal
if __name__ == "__main__":
    predict_from_terminal()