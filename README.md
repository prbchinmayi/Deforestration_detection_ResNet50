# Deforestation Detection using ResNet50
An image classification and temporal analysis pipeline built with PyTorch. The project fine-tunes a pretrained ResNet-50 on the EuroSAT dataset to categorize satellite imagery into 10 land cover classes and detect potential deforestation between multi-temporal image pairs.

This project fine-tunes a pretrained ResNet-50 on 27,000 EuroSAT images via transfer learning across 10 land cover classes, using pairwise image comparison to detect deforestation by tracking forest-to-non-forest transitions.

Dataset & Classes

no of images:27000

no of classes:10

Classes:
  AnnualCrop;
  Forest;
  HerbaceousVegetation;
  Highway;
  Industrial;
  Pasture;
  PermanentCrop;
  Residential;
  River;
  SeaLake

The dataset is divided into:
Training   → 70% → 18,900 images; Validation → 15% → 4,050 images; Testing    → 15% → 4,050 images


Implementation

The original implementation used a pretrained ResNet-50 model with the backbone completely frozen and only the final classification layer trained using a fixed learning rate. The model achieved **93.31% test accuracy**.

The model was improved by introducing a **Genetic Algorithm (GA)** to automatically optimize important hyperparameters, including learning rates, dropout, weight decay, and the number of ResNet-50 layers to fine-tune. Instead of freezing the entire backbone, the improved model selectively fine-tunes deeper layers (`layer3` and `layer4`) so that the pretrained features can better adapt to satellite imagery.

The optimizer was changed from **Adam to AdamW**, with weight decay added for regularization. Separate learning rates were also used for the pretrained backbone and newly added classification head. A smaller proxy training process was used during GA optimization to reduce computation, followed by full training using the best configuration.

Results

The changes resulted in an improvement in the recorded test accuracy. The original model used fixed transfer learning with a fully frozen ResNet-50 backbone, Adam optimizer, a fixed learning rate of 0.001, and 5 training epochs, achieving a test accuracy of **93.31%**. The modified model uses **Genetic Algorithm-based hyperparameter optimization**, selective fine-tuning, AdamW optimizer, and optimized learning rate, dropout, and weight decay, with 6 training epochs. It achieved a test accuracy of **98.10%**, representing an improvement of **4.79 percentage points** over the original model.

The optimized model achieved **98.10% test accuracy**, compared with **93.31%** for the original model, representing an improvement of **4.79 percentage points** in the recorded experiments.

The selected configuration used an unfreezing depth of **2**, a head learning rate of approximately **0.004625**, a backbone learning rate of approximately **0.0000917**, dropout of approximately **0.18**, and weight decay of approximately **0.00068**.

Deforestation Detection

For basic deforestation detection, the model classifies two images and compares their predicted land-cover classes. If an image classified as **Forest** is followed by an image classified as a **non-forest class**, the system reports a possible deforestation event.

This is an image-level classification approach rather than direct geographic change detection, so the two images should ideally represent the **same location at different points in time**.


Future work 

Use temporal satellite image pairs: Compare the same location across different dates.
Add data augmentation: Random rotations, flips, crops and color transformations could improve robustness.
Use additional evaluation metrics: Include precision, recall, F1-score and a confusion matrix rather than relying only on accuracy.
Increase GA search space: More generations and a larger population could explore additional configurations, at the cost of increased computation.
Use dedicated change-detection models: Instead of comparing two classification outputs, a change-detection model could directly learn the difference between two satellite images.


