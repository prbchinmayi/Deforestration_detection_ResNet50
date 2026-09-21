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

Data Splits
Training Set: 70% (18,900 images)   
Validation Set: 15% (4,050 images)   
Test Set: 15% (4,050 images)

The pipeline uses transfer learning by repurposing a pretrained ResNet-50 backbone, where feature extraction layers remain frozen while a custom 10-class linear classification head is trained using Adam optimization and cross-entropy loss. Incoming satellite images are standardized through resizing to 224×224 pixels and normalizing with ImageNet statistics. Across five training epochs, the classifier converges to a 93.31% test accuracy. For temporal change detection, two geo-registered satellite snapshots of identical coordinates taken at distinct time intervals are evaluated. By computing inference labels and confidence scores for each timestamp, the system identifies land cover shifts, specifically flagging instances where initial forest coverage transitions into an alternate non-forest classification to verify deforestation.
