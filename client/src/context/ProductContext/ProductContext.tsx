import React, { createContext, useState, useEffect } from "react";
import api from "@/api/api";

interface User {
  _id: string;
}

interface Product {
  inStock: number;
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
  loading: boolean;
  updateProductStock: (
    productId: string,
    quantity: number,
    type: "purchase" | "sale"
  ) => void;
  revertProductStock: (
    productId: string,
    quantity: number,
    type: "purchase" | "sale"
  ) => void;
}

const ProductContext = createContext<ProductContextProps | undefined>(
  undefined
);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfileAndProducts = async () => {
      try {
        const userResponse = await api.getUserProfile();
        setUser(userResponse.data);

        const productsResponse = await api.getProductsByUserId(
          userResponse.data._id
        );
        setProducts(productsResponse);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndProducts();
  }, []);

  const updateProductStock = async (
    productId: string,
    quantity: number,
    type: "purchase" | "sale"
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              inStock:
                type === "purchase"
                  ? product.inStock + quantity
                  : product.inStock - quantity,
            }
          : product
      )
    );

    try {
      await api.updateProductStock(productId, quantity, type);
    } catch (err) {
      console.error("Failed to update product stock", err);
    }
  };

  const revertProductStock = async (
    productId: string,
    quantity: number,
    type: "purchase" | "sale"
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              inStock:
                type === "purchase"
                  ? product.inStock - quantity
                  : product.inStock + quantity,
            }
          : product
      )
    );

    try {
      await api.updateProductStock(
        productId,
        quantity,
        type === "purchase" ? "sale" : "purchase"
      );
    } catch (err) {
      console.error("Failed to revert product stock", err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        user,
        setUser,
        loading,
        updateProductStock,
        revertProductStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export { ProductContext };
