import urllib.request

urls = {
    "sourdough": "https://images.unsplash.com/photo-1589367920969-18ba4d8d1e39?w=400&q=80",
    "cable": "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&q=80",
    "vitamins": "https://images.unsplash.com/photo-1550572017-edb79a831e5f?w=400&q=80",
    "coldbrew": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80",
}

for name, u in urls.items():
    try:
        req = urllib.request.Request(u, method='HEAD')
        urllib.request.urlopen(req)
        print(f"OK: {name}")
    except Exception as e:
        print(f"FAILED: {name} - {e}")
