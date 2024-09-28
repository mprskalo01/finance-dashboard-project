import React, { createContext, useState, useEffect } from "react";
import api from "@/api/api";

interface User {
  _id: string;
  username: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
}

interface ProductContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          const response = await api.getProductsByUserId(user._id);
          setProducts(response);
        } catch (err) {
          console.error("Failed to fetch products", err);
        }
      }
    };

    if (user) {
      fetchProducts();
    }
  }, [user]);

  return (
    <ProductContext.Provider value={{ products, setProducts, user, setUser }}>
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext };
