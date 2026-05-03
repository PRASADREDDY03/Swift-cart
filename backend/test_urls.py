import json
import urllib.request

urls = [
    "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&q=80",
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80",
    "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80",
    "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80",
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
    "https://images.unsplash.com/photo-1584002652431-d81ff074b8ff?w=400&q=80",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
    "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&q=80",
    "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80",
    "https://images.unsplash.com/photo-1616671285412-dfa6b637996a?w=400&q=80",
    "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&q=80",
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&q=80",
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80",
    "https://images.unsplash.com/photo-1555507036-ab1e4006aa07?w=400&q=80",
    "https://images.unsplash.com/photo-1461023058943-07cb128f115a?w=400&q=80",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80",
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80",
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80",
    "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80",
    "https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=400&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
    "https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80",
    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80",
    "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=200&q=80"
]

bad = []
for u in urls:
    try:
        req = urllib.request.Request(u, method='HEAD')
        urllib.request.urlopen(req)
    except Exception as e:
        print(f"FAILED: {u}")
        bad.append(u)

if not bad:
    print("ALL OK")
