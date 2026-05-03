# 🛒 Swift Cart

Swift Cart is a hyper-local, rapid delivery web application designed to simulate lightning-fast (under 20 minutes) grocery and essential deliveries. It features a dynamic product inventory, location-based filtering, and a production-ready containerized architecture.

## 🚀 Live Demo
**Check out the live deployed project here:** [Swift Cart on Google Cloud Run](https://swift-cart-610819829261.us-central1.run.app)

*(This project was built and deployed as part of the Google Build With AI workshop in collaboration with GeeksforGeeks.)*

## 🛠️ Technologies Used
- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** Vanilla HTML, CSS, JavaScript (No heavy frameworks for maximum speed)
- **Architecture:** Consolidated backend serving frontend static files
- **Deployment:** Docker, Google Cloud Run
- **AI Integration:** Developed with the assistance of Antigravity (Google's agentic AI coding assistant)

## 📦 Features
- **Dynamic Quick View Modal:** Click on any product to see enlarged details, ratings, and instant add-to-cart functionality without reloading the page.
- **Location-Based Inventory:** Seamlessly filter the available product catalog based on the selected delivery location.
- **Cloud-Ready:** Fully Dockerized and configured to run on Google Cloud Run with scale-to-zero capabilities.

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PRASADREDDY03/Swift-cart.git
   cd Swift-cart
   ```

2. **Install the dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Start the server:**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

4. **View the app:**
   Open your browser and navigate to `http://localhost:8000`

---
*Built during the #googlewithgfg workshop.*
