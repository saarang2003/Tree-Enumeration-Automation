# 🌲 ForestIQ

**ForestIQ** is a full-stack forest monitoring and analysis system that leverages **machine learning**, **computer vision**, and **geospatial data** to estimate green cover, count trees, and identify tree species.

The platform is built with a modular architecture combining **Python-based AI models**, **Flask and Express.js backends**, and a **React** frontend for seamless interaction and visualization.

---

## 🚀 Key Features

- 🌳 **Tree Counting** using aerial/satellite imagery
- 🧠 **Tree Species Classification** using ML/DL models
- 🖼️ **Image Preprocessing** with OpenCV
- 🔗 **Dual Backend System**:
  - Flask (for ML inference)
  - Node.js Express (for app logic/API routing)
- 🖥️ **Frontend** built in React for live visualization
- 📦 **Web-Compatible Models** for lightweight in-browser predictions (`web_model/`)

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (in `/client`)
- **Tailwind CSS**
- **Axios** for API calls

### Backends
- **Flask** (Python ML server)
- **Express.js** (Node.js API server)
- RESTful API design

### Machine Learning & Vision
- **Python** (OpenCV, NumPy, TensorFlow / PyTorch, scikit-learn)
- Custom-trained models for:
  - Tree detection
  - Tree species classification

### Data Handling
- **PostgreSQL** or **MongoDB** (optional, for persistence)
- **JSON/CSV** for input-output formats
