import { Box, useMediaQuery } from "@mui/material";
import Row1 from "@/pages/dashboard/Row1";
import Row2 from "@/pages/dashboard/Row2";
import Row3 from "@/pages/dashboard/Row3";
import Navbar from "@/components/navbar";

const gridTemplateLargeScreens = `
"a a a a b b b b c c c c"
"a a a a b b b b c c c c"
"a a a a b b b b c c c c"
"a a a a b b b b c c c c"
"d d d d d e e e f f f f"
"d d d d d e e e f f f f"
"d d d d d e e e f f f f"
"d d d d d h h h h i i i"
"d d d d d h h h h i i i"
"d d d d d h h h h i i i"
`;

const gridTemplateSmallScreens = `
  "i"
  "i"
  "i"
  "e"
  "e"
  "e"
  "a"
  "a"
  "a"
  "a"
  "b"
  "b"
  "b"
  "b"
  "c"
  "c"
  "c"
  "c"
  "d"
  "d"
  "d"
  "d"
  "d"
  
  "f"
  "f"
  "f"
  "h"
  "h"
  "h"
  "h"
  
`;

function Dashboard() {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1280px)");
  return (
    <>
      <Navbar />
      <Box
        width="100%"
        height="100%"
        display="grid"
        gap="1.5rem"
        sx={
          isAboveMediumScreens
            ? {
                gridTemplateColumns: "repeat(12, minmax(60px, 1fr))",
                gridTemplateRows: "repeat(10, minmax(60px,1fr))",
                gridTemplateAreas: gridTemplateLargeScreens,
              }
            : {
                gridAutoColumns: "100%",
                gridAutoRows: "80px",
                gridTemplateAreas: gridTemplateSmallScreens,
              }
        }
      >
        <Row1 />
        <Row2 />
        <Row3 />
      </Box>
    </>
  );
}

export default Dashboard;
