const API_BASE_URL = window.location.origin;

const api = {
    async getInventory(category, location = "default") {
        try {
            const url = new URL(`${API_BASE_URL}/inventory/${category}`);
            url.searchParams.append('location', location);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Error fetching inventory:", error);
            return null;
        }
    },

    async dispatchOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/dispatch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });
            if (!response.ok) throw new Error('Failed to dispatch order');
            return await response.json();
        } catch (error) {
            console.error("Error dispatching:", error);
            return null;
        }
    },

    async sendSupportMessage(message, orderId = null) {
        try {
            const response = await fetch(`${API_BASE_URL}/support-pilot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, order_id: orderId })
            });
            if (!response.ok) throw new Error('Support pilot failed');
            return await response.json();
        } catch (error) {
            console.error("Support pilot error:", error);
            return { response: "Sorry, I'm currently offline. Please try again later." };
        }
    }
};

window.api = api;
