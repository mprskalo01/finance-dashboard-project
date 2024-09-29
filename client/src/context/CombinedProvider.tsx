import React from "react";
import { AccountProvider } from "@/context/AccountContext/AccountContext";
import { ProductProvider } from "@/context/ProductContext/ProductContext";

const CombinedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AccountProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </AccountProvider>
  );
};

export default CombinedProvider;