import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import backgroundVideo from "../../assets/vecteezy_3d-virtual-tv-studio-news-backdrop-for-tv-shows-tv-on_13654649.mp4";
import zIndex from "@mui/material/styles/zIndex";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { log } from "three/examples/jsm/nodes/Nodes.js";

const Detail = () => {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const image = queryParams.get("image");
  const details = queryParams.get("details");

   const navigate = useNavigate();
   const goBack = () => {
    const url = window.location
    window.location.href = `${url.origin}/`
  };

  const containerStyle = {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    zIndex: 100,
  };

  const videoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  };

  return (
    <>
      <div style={containerStyle}>
        <video autoPlay muted loop style={videoStyle} preload="auto">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div>
          
            <IconButton
            onClick={() => goBack()} 
              sx={{
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "rgba(127, 255, 255, 0.75)",
                backgroundColor: "rgba(34, 34, 128, 0.743)",
                zIndex: 100,
                "&:hover": {
                  backgroundColor: "rgba(34, 34, 128, 0.743)",
                  transform: "scale(1.1)",
                },
                transition: "transform 0.3s ease, background-color 0.3s ease",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "42px" }} />
            </IconButton>
          

          <Grid
            container
            spacing={2}
            sx={{
              width: "80%",
              backgroundColor: "rgba(34, 34, 128, 0.743)",
              color: "#ffffffbf",
              zIndex: 1000,
              position: "relative",
              padding: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              height: "100%",
              marginTop: "5rem",
              borderRadius: "16px",
            }}
          >
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={image}
                alt="Card Image"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={image}
                alt="Card Image"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src={image}
                alt="Card Image"
                sx={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography
                variant="h4"
                sx={{
                  marginBottom: "0.9rem",
                  fontSize: 40,
                  color: "#FFFFFF",
                }}
              >
                Details
              </Typography>
              <Typography sx={{ fontSize: "20px" }}>{details}</Typography>
              <Typography
                sx={{
                  marginTop: "1rem",
                  fontSize: "20px",
                  overflowY: "scroll",
                  overflowY: "hidden",
                }}
              >
                Produced by Nia Adurogbola, Lydia Jessup, Evan Grothjan, Ellen
                Lo, Daniel Mangosing, Noah Pisner and James Surdam. Produced by
                Nia Adurogbola, Lydia Jessup, Evan Grothjan, Ellen Lo.
              </Typography>
              <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
                As automakers go electric, the hunt for raw materials has
                intensified. This effect illustrates the elements required for
                different types of electric vehicle batteries.
              </Typography>
              <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
                Produced by Nia Adurogbola, Lydia Jessup, Evan Grothjan, Ellen
                Lo, Daniel Mangosing, Noah Pisner and James Surdam.
              </Typography>
              <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
                We tell stories from the sports desk to the climate beat using a
                range of approaches from detailed.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default Detail;
