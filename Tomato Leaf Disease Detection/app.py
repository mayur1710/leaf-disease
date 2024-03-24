from __future__ import division, print_function
from pathlib import Path
import numpy as np
import tensorflow
from tensorflow import model_from_json
from tensorflow import image
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
MODEL_ARCHITECTURE_PATH = BASE_DIR / 'model_mobilenetv2.json'
MODEL_WEIGHTS_PATH = BASE_DIR / 'model_mobilenetv2_weights.h5'

# Load model architecture from JSON file
with open(MODEL_ARCHITECTURE_PATH, 'r') as json_file:
    loaded_model_json = json_file.read()

# Load model from JSON
model = model_from_json(loaded_model_json)

# Load model weights
model.load_weights(MODEL_WEIGHTS_PATH)

diseases = [
    # Your diseases list...
]

def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = x / 255
    x = np.expand_dims(x, axis=0)
    predictionValues = np.round(model.predict(x), 2)
    prediction_array = []
    for i in range(len(diseases)):
        prediction_array.append([(predictionValues[0][i]) * 100, *diseases[i]])
    prediction_array = sorted(prediction_array, key=lambda x: x[0], reverse=True)
    return prediction_array

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        f = request.files['file']
        file_path = BASE_DIR / 'uploads' / secure_filename(f.filename)
        f.save(file_path)
        preds = model_predict(file_path, model)
        result = preds
        return str(result)  # Return as string since Flask response must be string or tuple
    return "[]"

if __name__ == '__main__':
    app.run(port=8000, debug=True)
