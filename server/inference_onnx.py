import onnxruntime
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
import torch.nn.functional as F
import torch
from pathlib import Path

print("✅ Imports successful!")

# =============================================================================
# 1. DEFINE HELPER FUNCTIONS AND CONFIGURATION
# =============================================================================

def softmax(x):
    """Compute softmax values for each sets of scores in x."""
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=1)

def predict_onnx(session, image_path, transforms, class_names):
    """Runs inference on a single image using an ONNX model."""
    try:
        img = Image.open(image_path).convert('RGB')
        img_tensor = transforms(img).unsqueeze(0).cpu().numpy()

        # Get the name of the input node
        input_name = session.get_inputs()[0].name

        # Run inference
        ort_inputs = {input_name: img_tensor}
        ort_outs = session.run(None, ort_inputs)
        
        # The output is a list, get the first element which is the logits array
        logits = ort_outs[0]

        # Apply softmax to get probabilities
        probabilities = softmax(logits)[0]
        
        # Get the predicted class index and confidence
        predicted_idx = np.argmax(probabilities)
        confidence = probabilities[predicted_idx]
        predicted_class = class_names[predicted_idx]

        return predicted_class, confidence

    except FileNotFoundError:
        return f"Error: Image file not found at {image_path}", 0.0
    except Exception as e:
        return f"An error occurred: {e}", 0.0

# =============================================================================
# 2. MAIN INFERENCE EXECUTION
# =============================================================================

if __name__ == "__main__":

    # --- IMPORTANT: UPDATE THESE VALUES ---
    ONNX_MODEL_PATH = r"C:\Users\mecha\Documents\revision\Sonu-ai-frontend\server\mobilenet_mobile.onnx"
    IMAGE_TO_TEST_PATH = r"C:\Users\mecha\Documents\revision\Sonu-ai-frontend\CCMT Dataset\Tomato\leaf curl\leaf curl2_.jpg"
    
    # You MUST provide the class names in the exact same order as during training
    CLASS_NAMES = [
        'Cashew_anthracnose',
        'Cashew_gumosis',
        'Cashew_healthy',
        'Cashew_leaf miner',
        'Cashew_red rust',
        'Cassava_bacterial blight',
        'Cassava_brown spot',
        'Cassava_green mite',
        'Cassava_healthy',
        'Cassava_mosaic',
        'Maize_fall armyworm',
        'Maize_grasshoper',
        'Maize_healthy',
        'Maize_leaf beetle',
        'Maize_leaf blight',
        'Maize_leaf spot',
        'Maize_streak virus',
        'Tomato_healthy',
        'Tomato_leaf blight',
        'Tomato_leaf curl',
        'Tomato_septoria leaf spot',
        'Tomato_verticulium wilt'
    ]
    # -------------------------------------

    print(f":arrows_counterclockwise: Loading ONNX model from: {ONNX_MODEL_PATH}")
    if not Path(ONNX_MODEL_PATH).exists():
        print(f":x: Error: ONNX model not found at {ONNX_MODEL_PATH}")
    else:
        # Create an inference session
        ort_session = onnxruntime.InferenceSession(ONNX_MODEL_PATH)
        print(":white_check_mark: ONNX model loaded successfully!")

        # Define the same transformations as used in training
        inference_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        print(f"\n:mag: Running inference on: {IMAGE_TO_TEST_PATH}")
        predicted_label, confidence_score = predict_onnx(
            session=ort_session,
            image_path=IMAGE_TO_TEST_PATH,
            transforms=inference_transform,
            class_names=CLASS_NAMES
        )

        if "Error" not in predicted_label:
            print("\n" + "="*30)
            print(f":herb: Prediction: {predicted_label}")
            print(f":dart: Confidence: {confidence_score:.2%}")
            print("="*30)
        else:
            print(f"\n:x: {predicted_label}")