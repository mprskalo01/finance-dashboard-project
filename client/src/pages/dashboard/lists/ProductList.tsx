import { useState } from "react";
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { Box, useTheme, IconButton, styled } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { ProductDialog, DeleteConfirmationDialog } from "./ProductDialog";
import Svgs from "@/assets/Svgs";
import { useProductContext } from "@/context/ProductContext/useProduct";
import api from "@/api/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  expense: number;
  inStock: number; // Add inStock to the Product interface
}

function ProductList() {
  const { palette } = useTheme();
  const { products, setProducts, user } = useProductContext();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAddProduct = async (productData: {
    name: string;
    price: number;
    expense: number;
    inStock: number; // Ensure inStock is handled
  }) => {
    if (user) {
      try {
        const response = await api.createProduct({
          userId: user._id,
          ...productData,
        });
        setProducts((prevProducts) => [...prevProducts, response.data]);
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
    inStock: number; // Ensure inStock is handled
  }) => {
    if (selectedProduct) {
      try {
        const response = await api.updateProduct(
          selectedProduct._id,
          productData
        );
        setProducts((prevProducts) =>
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
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p._id !== selectedProduct._id)
        );
        setOpenDeleteDialog(false);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const StyledCell = styled("div")({
    color: "white",
  });

  const productColumns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{params.value as string}</StyledCell>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{`$${params.value as number}`}</StyledCell>
      ),
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.25,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{`$${params.value as number}`}</StyledCell>
      ),
    },
    {
      field: "margin",
      headerName: "Margin",
      flex: 0.2,
      renderCell: (params: GridCellParams) => {
        const product = params.row as Product;
        const margin =
          ((product.price - product.expense) / product.price) * 100;
        return <StyledCell>{`${margin.toFixed(2)}%`}</StyledCell>;
      },
    },
    {
      field: "inStock",
      headerName: "Stock",
      flex: 0.2,
      renderCell: (params: GridCellParams) => (
        <StyledCell>{params.value as number}</StyledCell>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params: GridCellParams) => (
        <Box>
          <IconButton
            onClick={() => {
              setSelectedProduct(params.row as Product);
              console.log(params.row); // Log the selected product
              setOpenEditDialog(true);
            }}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", margin: "0 5px" }}
          >
            <Svgs.editSvg fillColor="#fff" size="12px" />
          </IconButton>
          <IconButton
            onClick={() => {
              setSelectedProduct(params.row as Product);
              setOpenDeleteDialog(true);
            }}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", margin: "0 5px" }}
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
        sideText={
          products?.length === 0
            ? "No products stored"
            : `${products.length} product${products.length > 1 ? "s" : ""}`
        }
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
        }}
      >
        <DataGrid
          columnHeaderHeight={25}
          rowHeight={35}
          hideFooter={true}
          rows={Array.isArray(products) ? products.slice().reverse() : []}
          columns={productColumns}
          getRowId={(row) => row._id || row.name}
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
                inStock: selectedProduct.inStock, // Ensure inStock is handled
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
