import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import torch.nn.functional as F
from pathlib import Path

print(":white_check_mark: Imports successful!")
# =============================================================================
# 1. DEFINE THE MODEL ARCHITECTURE (MUST BE IDENTICAL TO TRAINING)
# =============================================================================
def ConvBlock(in_channels, out_channels, pool=False):
    layers = [nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
             nn.BatchNorm2d(out_channels),
             nn.ReLU(inplace=True)]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)
class CNN_NeuralNet(nn.Module):
    """CNN Architecture for Sonu"""
    # The parameter is 'num_diseases', not 'num_classes'
    def __init__(self, in_channels, num_diseases):
        super().__init__()
        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))
        self.conv3 = ConvBlock(128, 256, pool=True)
        self.conv4 = ConvBlock(256, 512, pool=True)
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))
        self.classifier = nn.Sequential(nn.AdaptiveAvgPool2d((1, 1)),
                                       nn.Flatten(),
                                       nn.Linear(512, num_diseases))
    def forward(self, x):
        out = self.conv1(x)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out
# =============================================================================
# 2. DEFINE HELPER FUNCTIONS AND CONFIGURATION
# =============================================================================
def get_default_device():
    return torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
def predict_single_image(model, image_path, transforms, class_names, device):
    try:
        img = Image.open(image_path).convert('RGB')
        img_tensor = transforms(img).unsqueeze(0)
        img_tensor = img_tensor.to(device)
        model.eval()
        with torch.no_grad():
            outputs = model(img_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            confidence, predicted_idx = torch.max(probabilities, 0)
            predicted_class = class_names[predicted_idx.item()]
            return predicted_class, confidence.item()
    except FileNotFoundError:
        return f"Error: Image file not found at {image_path}", 0.0
    except Exception as e:
        return f"An error occurred: {e}", 0.0
# =============================================================================
# 3. MAIN INFERENCE EXECUTION
# =============================================================================
if __name__ == "__main__":
    # --- IMPORTANT: UPDATE THESE PATHS ---
    CHECKPOINT_PATH = "/kaggle/working/Sonu_pytorch_output/Sonu_model_20250708_203930.pth"
    IMAGE_TO_TEST_PATH = "path/to/your/test/image.jpg" # <--- CHANGE THIS TO YOUR IMAGE
    # ------------------------------------
    device = get_default_device()
    print(f":desktop_computer:  Using device: {device}")
    print(f":arrows_counterclockwise: Loading checkpoint from: {CHECKPOINT_PATH}")
    if not Path(CHECKPOINT_PATH).exists():
        print(f":x: Error: Checkpoint file not found at {CHECKPOINT_PATH}")
    else:
        checkpoint = torch.load(CHECKPOINT_PATH, map_location=device)
        class_names = checkpoint['class_names']
        num_classes_from_checkpoint = checkpoint['num_classes']
        # --- THE FIX IS HERE ---
        # Instantiate the model using the correct keyword argument 'num_diseases'
        model = CNN_NeuralNet(in_channels=3, num_diseases=num_classes_from_checkpoint)
        model.load_state_dict(checkpoint['model_state_dict'])
        model.to(device)
        print(":white_check_mark: Model loaded successfully!")
        inference_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        print(f"\n:mag: Running inference on: {IMAGE_TO_TEST_PATH}")
        predicted_label, confidence_score = predict_single_image(
            model=model,
            image_path=IMAGE_TO_TEST_PATH,
            transforms=inference_transform,
            class_names=class_names,
            device=device
        )
        if "Error" not in predicted_label:
            print("\n" + "="*30)
            print(f":herb: Prediction: {predicted_label}")
            print(f":dart: Confidence: {confidence_score:.2%}")
            print("="*30)
        else:
            print(f"\n:x: {predicted_label}")