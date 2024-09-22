<BoxHeader
title={
<>
<span style={{ color: palette.primary[500] }}>
Monthly Profit
</span>
</>
}
// subtitle="graph representing the revenue month by month"
sideText={profitPercentageChange}
/>
<ResponsiveContainer width="100%" height="100%">
<BarChart
width={500}
height={300}
data={revenueProfit}
margin={{
              top: 17,
              right: 15,
              left: -5,
              bottom: 58,
            }} >
<defs>
<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
<stop
                  offset="5%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0.8}
                />
<stop
                  offset="95%"
                  stopColor={palette.primary[300]}
                  stopOpacity={0}
                />
</linearGradient>
</defs>
<CartesianGrid vertical={false} stroke={palette.grey[800]} />
<XAxis
dataKey="name"
axisLine={false}
tickLine={false}
style={{ fontSize: "10px" }}
/>
<YAxis
axisLine={false}
tickLine={false}
style={{ fontSize: "10px" }}
/>
<Tooltip />
<Bar dataKey="profit" fill="url(#colorProfit)" />
</BarChart>
</ResponsiveContainer>

row 3 dashboard j for recent orders :
<DashboardBox gridArea="h">
<BoxHeader
title="Recent Orders"
sideText={`${transactionData?.length} latest transactions`}
/>
<Box
mt="1rem"
p="0 0.5rem"
height="80%"
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
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }} >
<DataGrid
columnHeaderHeight={25}
rowHeight={35}
hideFooter={true}
rows={transactionData || []}
columns={transactionColumns}
/>
</Box>
</DashboardBox>

<DashboardBox gridArea="i">
<BoxHeader
title="Overall Summary & Explanation Data"
sideText={`${revenueChangePercentage}%`}
/>
<Tooltip
title={`Revenue: $${currentRevenue.toFixed(
            2
          )}, Expenses: $${currentExpenses.toFixed(2)}`}
arrow
placement="top" >
<Box
            height="15px"
            margin="1.25rem 1rem 0.4rem 1rem"
            bgcolor={palette.primary[800]}
            borderRadius="1rem"
          >
<Box
height="15px"
bgcolor={palette.primary[600]}
borderRadius="1rem"
width={`${
                (currentRevenue / (currentRevenue + currentExpenses)) * 100
              }%`} ></Box>
</Box>
</Tooltip>
<Typography margin="0 1rem" variant="h6">
{generateSummary()}
</Typography>
</DashboardBox>

const transactionColumns = [
{
field: "_id",
headerName: "id",
flex: 1,
},
{
field: "buyer",
headerName: "Buyer",
flex: 0.67,
},
{
field: "amount",
headerName: "Amount",
flex: 0.35,
renderCell: (params: GridCellParams) => `$${params.value}`,
},
{
field: "productIds",
headerName: "Count",
flex: 0.1,
renderCell: (params: GridCellParams) =>
(params.value as Array<string>).length,
},
];

      <DashboardBox gridArea="h">
        <BoxHeader
          title="List of Products"
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
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>
