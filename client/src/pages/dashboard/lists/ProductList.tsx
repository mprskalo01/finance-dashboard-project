import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useState, useEffect } from "react";
import api from "@/api/api";

import { Box, useTheme, IconButton, styled } from "@mui/material";

import Svgs from "@/assets/Svgs";

import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { ProductDialog, DeleteConfirmationDialog } from "../ProductDialog";

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

function ProductList() {
  const { palette } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.getUserProfile();
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
  }, []);

  const [productData, setProductData] = useState<Product[]>([]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (user) {
        try {
          const response = await api.getProductsByUserId(user._id); // Fetch products by userId
          setProductData(response.data); // Set the fetched products to state
        } catch (error) {
          console.error("Failed to fetch products:", error);
        }
      }
    };

    fetchProducts();
  }, [user]);

  const handleAddProduct = async (productData: {
    name: string;
    price: number;
    expense: number;
  }) => {
    if (user) {
      try {
        const response = await api.createProduct({
          userId: user._id,
          ...productData,
        });

        // Assuming you have a state variable `products` that holds the list of products
        setProductData((prevProducts) => [...prevProducts, response.data]);
        setOpenAddDialog(false);
      } catch (error) {
        console.error("Failed to add product:", error);
      }
    }
  };

  const handleEditProduct = async (productData: {
    name: string;
    price: number;
    expense: number;
  }) => {
    if (selectedProduct) {
      try {
        const response = await api.updateProduct(
          selectedProduct._id,
          productData
        );

        // Assuming you have a state variable `productData` that holds the list of products
        setProductData((prevProducts) =>
          prevProducts.map((p) =>
            p._id === selectedProduct._id ? response.data : p
          )
        );
        setOpenEditDialog(false);
      } catch (error) {
        console.error("Failed to update product:", error);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await api.deleteProduct(selectedProduct._id);
        setProductData(
          productData.filter((p) => p._id !== selectedProduct._id)
        );
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };
  const StyledCell = styled("div")({
    color: "white", // Set text color to white
  });
  const productColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{params.value as string}</StyledCell> // Cast params.value to string
      ),
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{`$${params.value as number}`}</StyledCell> // Cast params.value to number
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{`$${params.value as number}`}</StyledCell> // Cast params.value to number
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: GridCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setSelectedProduct(params.row as Product);
              setOpenEditDialog(true);
            }}
          >
            <Svgs.editSvg fillColor="#fff" />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedProduct(params.row as Product);
              setOpenDeleteDialog(true);
            }}
          >
            <Svgs.deleteSvg fillColor="#fff" />
          </IconButton>
        </Box>
      ),
    },
  ];
  return (
    <DashboardBox gridArea="h">
      <BoxHeader
        title={
          <Box display="flex" gap="10px" alignItems="center">
            <span style={{ color: palette.tertiary[200] }}>
              List of products
            </span>
            <IconButton
              onClick={() => setOpenAddDialog(true)}
              size="small"
              sx={{
                backgroundColor: "rgba(136, 132, 216, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(136, 132, 216, 0.2)",
                },
                borderRadius: "4px",
              }}
            >
              <Svgs.addSvg strokeColor="#12efc8" />
            </IconButton>
          </Box>
        }
        sideText={`${productData?.length} products`}
      />
      <Box
        mt="0.5rem"
        p="0 0.5rem"
        height="75%"
        sx={{
          "& .MuiDataGrid-root": {
            color: palette.grey[300],
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${palette.grey[800]} !important`,
          },
          // "& .MuiDataGrid-columnSeparator": {
          //   visibility: "hidden",
          // },
        }}
      >
        <DataGrid
          columnHeaderHeight={25}
          rowHeight={35}
          hideFooter={true}
          rows={productData}
          columns={productColumns}
        />
      </Box>
      <ProductDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddProduct}
        title="Add Product"
      />

      <ProductDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onSubmit={handleEditProduct}
        initialData={
          selectedProduct
            ? {
                name: selectedProduct.name,
                price: selectedProduct.price,
                expense: selectedProduct.expense,
              }
            : undefined
        }
        title="Edit Product"
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteProduct}
      />
    </DashboardBox>
  );
}

export default ProductList;
