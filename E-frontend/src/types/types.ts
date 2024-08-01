export interface User {
   name: string;
   email: string;
   photo: string;
   gender: string;
   role: string;
   dob: string;
   _id: string;
}

export interface Product {
   name: string;
   price: number;
   photo: string;
   stock: number;
   category: string;
   _id: string;
}

export type ShippingInfo = {
   address: string;
   city: string;
   state: string;
   country: string;
   pinCode: string;
};

export type CartItem = {
   productId: string;
   photo: string;
   name: string;
   price: number;
   quantity: number;
   stock: number;
};

// all properties of "CartItem" except "stock". and add "_id" property
export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = {
   orderItems: OrderItem[];
   shippingInfo: ShippingInfo;
   subtotal: number;
   tax: number;
   shippingCharges: number;
   discount: number;
   total: number;
   status: string;
   user: {
      name: string;
      _id: string;
   };
   _id: string;
};

type CountAndChange = {
   revenue: number;
   product: number;
   user: number;
   order: number;
};

type LatestTransaction = {
   _id: string;
   amount: number;
   discount: number;
   quantity: number;
   status: string;
};

export type Stats = {
   categoryCount: Record<string, number>[];
   changePercent: CountAndChange;
   count: CountAndChange;
   chart: {
      order: number[];
      revenue: number[];
   };
   userRatio: {
      male: number;
      female: number;
   };
   latestTransaction: LatestTransaction[];
};

export type Amount = {
   netMargin: number;
   totalTax: number;
   totalShippingCharges: number;
   totalDiscount: number;
   marketingCost: number;
};

export type OrderFulfillment = {
   shipped: number;
   delivered: number;
   processing: number;
};

export type UserAgeGroup = { teen: number; adult: number; old: number };

export type Charts = {
   amount: Amount;
   orderFulfillment: OrderFulfillment;
   productStock: {
      outOfStock: number;
      inStock: number;
   };
   userAgeGroup: UserAgeGroup;
   adminCustomer: {
      admin: number;
      customer: number;
   };
   categoryCount: Record<string, number>[];
};

