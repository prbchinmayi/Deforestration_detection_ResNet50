"use client";

import { useEffect, useState } from "react";
import { getOverview } from "../../lib/api";

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOverview()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <p className="error-text">
        Couldn&apos;t reach the backend at the configured API URL. Is it running? ({error})
      </p>
    );
  }

  if (!data) return <p className="hero-label">Loading…</p>;

  const { baseline_accuracy, optimized_accuracy, best_hyperparameters, classes, dataset_size } = data;

  return (
    <>
      <p className="hero-label" style={{ marginBottom: 40 }}>
        An image classification and temporal analysis pipeline built with PyTorch. Fine-tunes a
        pretrained ResNet-50 on the EuroSAT dataset to categorize satellite imagery into 10 land
        cover classes and detect potential deforestation between multi-temporal image pairs.
      </p>

      <section className="block" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
        <h2>Dataset &amp; classes</h2>
        <dl className="hyperparams">
          <div>
            <dt>Total images</dt>
            <dd>{dataset_size.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Training</dt>
            <dd>70% — 18,900 images</dd>
          </div>
          <div>
            <dt>Validation</dt>
            <dd>15% — 4,050 images</dd>
          </div>
          <div>
            <dt>Testing</dt>
            <dd>15% — 4,050 images</dd>
          </div>
        </dl>
        <p style={{ marginTop: 16 }}>{classes.join(", ")}</p>
      </section>

      <section className="block">
        <h2>Implementation</h2>
        <p>
          The original implementation used a pretrained ResNet-50 with the backbone completely
          frozen, training only the final classification layer with a fixed learning rate.
        </p>
        <p>
          The model was then improved with a genetic algorithm that automatically optimizes
          learning rates, dropout, weight decay, and how many ResNet-50 layers to fine-tune.
          Rather than freezing the entire backbone, the improved model selectively fine-tunes the
          deeper layers (layer3 and layer4) so pretrained features adapt better to satellite
          imagery. The optimizer changed from Adam to AdamW with added weight decay, and the
          backbone and classification head use separate learning rates. A smaller proxy training
          process was used during GA search to reduce computation, followed by full training on
          the best configuration found.
        </p>
      </section>

      <section className="block">
        <h2>Results</h2>
        <p className="hero-number">{optimized_accuracy.toFixed(2)}%</p>
        <p className="hero-label">
          GA-optimized test accuracy, up from a {baseline_accuracy.toFixed(2)}% frozen-backbone
          baseline &mdash; an improvement of{" "}
          {(optimized_accuracy - baseline_accuracy).toFixed(2)} percentage points
        </p>

        <div>
          <div className="bar-row">
            <span className="label">Baseline</span>
            <div className="bar-track">
              <div className="bar-fill baseline" style={{ width: `${baseline_accuracy}%` }} />
            </div>
            <span className="value">{baseline_accuracy.toFixed(2)}%</span>
          </div>
          <div className="bar-row">
            <span className="label">GA-optimized</span>
            <div className="bar-track">
              <div className="bar-fill optimized" style={{ width: `${optimized_accuracy}%` }} />
            </div>
            <span className="value">{optimized_accuracy.toFixed(2)}%</span>
          </div>
        </div>

        <dl className="hyperparams" style={{ marginTop: 28 }}>
          <div>
            <dt>Unfreeze depth</dt>
            <dd>{best_hyperparameters.unfreeze_depth}</dd>
          </div>
          <div>
            <dt>Head learning rate</dt>
            <dd>{best_hyperparameters.head_lr}</dd>
          </div>
          <div>
            <dt>Backbone learning rate</dt>
            <dd>{best_hyperparameters.backbone_lr}</dd>
          </div>
          <div>
            <dt>Dropout</dt>
            <dd>{best_hyperparameters.dropout}</dd>
          </div>
          <div>
            <dt>Weight decay</dt>
            <dd>{best_hyperparameters.weight_decay}</dd>
          </div>
        </dl>
      </section>

      <section className="block">
        <h2>Deforestation detection</h2>
        <p>
          For basic deforestation detection, the model classifies two images and compares their
          predicted land-cover classes. If an image classified as Forest is followed by an image
          classified as a non-forest class, the system reports a possible deforestation event.
        </p>
        <p>
          This is an image-level classification approach rather than direct geographic change
          detection, so the two images should ideally represent the same location at different
          points in time.
        </p>
      </section>

      <section className="block">
        <h2>Future work</h2>
        <ul className="future-work">
          <li>Use temporal satellite image pairs comparing the same location across different dates</li>
          <li>Add data augmentation — random rotations, flips, crops and color transformations</li>
          <li>Add precision, recall, F1-score and a confusion matrix rather than relying only on accuracy</li>
          <li>Increase the GA search space with more generations and a larger population</li>
          <li>Use dedicated change-detection models instead of comparing two classification outputs</li>
        </ul>
      </section>
    </>
  );
}