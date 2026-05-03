from pydantic import BaseModel, model_validator
from typing import List, Optional

class CartItem(BaseModel):
    id: str
    name: str
    price: float
    quantity: int

class OrderRequest(BaseModel):
    category: str
    items: List[CartItem]
    zip_code: str
    prescription_id: Optional[str] = None

    @model_validator(mode='after')
    def check_prescription_id(self):
        if self.category.lower() == 'pharmacy' and not self.prescription_id:
            raise ValueError('prescription_id is required for pharmacy orders')
        return self

class SupportMessage(BaseModel):
    message: str
    order_id: Optional[str] = None
