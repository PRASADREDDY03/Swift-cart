from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional
import asyncio
import random
import uuid

from models import OrderRequest, SupportMessage

app = FastAPI(title="Swift Cart Backend")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base Inventory
BASE_INVENTORY = {
    "groceries": [
        {"id": "g1", "name": "Organic Bananas (Bunch)", "price": 120.00, "stock_count": 45, "image": "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80"},
        {"id": "g2", "name": "Farm Fresh Whole Milk 1 Gal", "price": 280.00, "stock_count": 12, "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80"},
        {"id": "g3", "name": "Artisan Sourdough Loaf", "price": 350.00, "stock_count": 5, "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"},
        {"id": "g4", "name": "Hass Avocados (Pack of 4)", "price": 400.00, "stock_count": 25, "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80"},
        {"id": "g5", "name": "Free-Range Large Eggs", "price": 180.00, "stock_count": 18, "image": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80"},
        {"id": "g6", "name": "Organic Baby Spinach 16oz", "price": 220.00, "stock_count": 30, "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80"}
    ],
    "tech": [
        {"id": "t1", "name": "Braided USB-C Cable 6ft", "price": 499.00, "stock_count": 100, "image": "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&q=80"},
        {"id": "t2", "name": "Pro Wireless Noise-Cancelling Earbuds", "price": 4999.00, "stock_count": 15, "image": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80"},
        {"id": "t3", "name": "Ultra-Slim Power Bank 10000mAh", "price": 1499.00, "stock_count": 30, "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80"},
        {"id": "t4", "name": "Mechanical Keyboard (Blue Switches)", "price": 3999.00, "stock_count": 8, "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80"},
        {"id": "t5", "name": "4K Web Camera with Ring Light", "price": 2999.00, "stock_count": 22, "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80"}
    ],
    "pharmacy": [
        {"id": "p1", "name": "Ibuprofen 200mg (100 Caplets)", "price": 150.00, "stock_count": 50, "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"},
        {"id": "p2", "name": "Maximum Strength Allergy Relief", "price": 220.00, "stock_count": 20, "image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80"},
        {"id": "p3", "name": "Daily Multivitamin Gummies", "price": 450.00, "stock_count": 45, "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"},
        {"id": "p4", "name": "First Aid Medical Kit (Essentials)", "price": 899.00, "stock_count": 15, "image": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80"},
        {"id": "p5", "name": "Prescription Refill", "price": 0.00, "stock_count": 99, "image": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80", "requires_rx": True},
    ],
    "cafe": [
        {"id": "c1", "name": "Iced Caramel Macchiato", "price": 240.00, "stock_count": 20, "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80"},
        {"id": "c2", "name": "Butter Croissant", "price": 120.00, "stock_count": 15, "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"},
        {"id": "c3", "name": "Cold Brew Coffee", "price": 180.00, "stock_count": 30, "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80"}
    ],
    "meat": [
        {"id": "m1", "name": "Premium Ribeye Steak", "price": 850.00, "stock_count": 10, "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80"},
        {"id": "m2", "name": "Fresh Chicken Breast (500g)", "price": 220.00, "stock_count": 25, "image": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80"},
        {"id": "m3", "name": "Atlantic Salmon Fillet", "price": 650.00, "stock_count": 12, "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80"}
    ],
    "fresh": [
        {"id": "f1", "name": "Organic Strawberries", "price": 150.00, "stock_count": 40, "image": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80"},
        {"id": "f2", "name": "Vine Ripe Tomatoes (1kg)", "price": 60.00, "stock_count": 50, "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80"},
        {"id": "f3", "name": "Fresh Broccoli Crowns", "price": 80.00, "stock_count": 35, "image": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80"}
    ]
}

# Location Specific Inventories (Deep copy overrides)
INDIRANAGAR_INVENTORY = {
    **BASE_INVENTORY,
    "cafe": [
        {"id": "c1_ind", "name": "Indiranagar Special Filter Coffee", "price": 180.00, "stock_count": 50, "image": "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=400&q=80"},
        {"id": "c2_ind", "name": "Artisan Almond Croissant", "price": 250.00, "stock_count": 10, "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"},
        {"id": "c3", "name": "Cold Brew Coffee", "price": 180.00, "stock_count": 30, "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80"}
    ],
    "fresh": [
        {"id": "f4_ind", "name": "Exotic Dragonfruit", "price": 250.00, "stock_count": 15, "image": "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80"},
        *BASE_INVENTORY["fresh"]
    ]
}

KORAMANGALA_INVENTORY = {
    **BASE_INVENTORY,
    "tech": [
        {"id": "t6_kor", "name": "Koramangala Startup Kit (Notebook + Pen)", "price": 350.00, "stock_count": 100, "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80"},
        *BASE_INVENTORY["tech"]
    ]
}

LOCATION_DB = {
    "default": BASE_INVENTORY,
    "indiranagar": INDIRANAGAR_INVENTORY,
    "koramangala": KORAMANGALA_INVENTORY,
    "downtown": BASE_INVENTORY,
    "whitefield": BASE_INVENTORY,
    "hsr layout": BASE_INVENTORY
}

@app.get("/inventory/{category}")
async def get_inventory(category: str, location: Optional[str] = "default") -> Dict[str, Any]:
    cat_lower = category.lower()
    loc_lower = location.lower() if location else "default"
    
    # Fallback to default if location not found
    inventory_map = LOCATION_DB.get(loc_lower, LOCATION_DB["default"])
    
    if cat_lower not in inventory_map:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Simulate slight delay
    await asyncio.sleep(0.2)
    
    return {
        "category_type": cat_lower,
        "delivery_estimate": random.randint(8, 18),
        "location_used": loc_lower,
        "items": inventory_map[cat_lower]
    }

@app.post("/dispatch")
async def dispatch_order(order: OrderRequest):
    # Simulate processing time
    await asyncio.sleep(1.0)
    
    delivery_time = random.randint(8, 18)
    tracking_id = str(uuid.uuid4())
    
    return {
        "status": "dispatched",
        "tracking_uuid": tracking_id,
        "delivery_estimate_minutes": delivery_time,
        "message": f"Order dispatched. Arriving in ~{delivery_time} minutes."
    }

@app.post("/support-pilot")
async def support_pilot(msg: SupportMessage):
    await asyncio.sleep(0.5)
    content = msg.message.lower()
    
    # Intent Matching Logic
    if any(word in content for word in ["hi", "hello", "hey", "help"]):
        return {
            "response": "Hello! I am the Swift Cart Support Pilot. I can help you track your order, process cancellations, or modify items. What do you need?",
            "action": "chat"
        }
        
    elif any(word in content for word in ["where", "late", "track", "status", "eta"]):
        lat = 37.7749 + random.uniform(-0.01, 0.01)
        lng = -122.4194 + random.uniform(-0.01, 0.01)
        speed = random.randint(15, 35)
        return {
            "response": f"Your courier is zooming through traffic at {speed}mph! Current coordinates: {lat:.4f}, {lng:.4f}. They will be there soon.",
            "action": "location_update"
        }
        
    elif any(word in content for word in ["cancel", "stop", "refund"]):
        return {
            "response": "I understand you want to cancel. Since Swift Cart deliveries happen in under 20 minutes, orders can only be cancelled within 60 seconds of placement. Would you like me to check if it's still eligible?",
            "action": "chat"
        }
        
    elif any(word in content for word in ["modify", "add", "change"]):
        return {
            "response": "To ensure ultra-fast delivery, we lock orders immediately after dispatch. You cannot modify this order, but you can always place a new one with ₹0 delivery fee!",
            "action": "chat"
        }
        
    elif any(word in content for word in ["human", "agent", "person", "urgent", "emergency", "mad", "angry", "wrong"]):
        return {
            "response": "I apologize for the frustration. I'm escalating this to a human dispatcher immediately. Please hold while I connect you...",
            "action": "escalate"
        }
        
    else:
        return {
            "response": "I'm not quite sure how to help with that. Try asking me 'where is my order?', 'cancel order', or say 'human' to speak to an agent.",
            "action": "chat"
        }

# --- Frontend Serving ---
# Mount the frontend directory at the root
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
