import React, { useEffect, useState } from "react";
import backgroundVideo from "../../assets/vecteezy_3d-virtual-tv-studio-news-backdrop-for-tv-shows-tv-on_13654649.mp4";
import { useLocation } from "react-router-dom";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Detail = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Extract the modalData from query parameters
  const image = queryParams.get("image");
  const details = queryParams.get("details");
  console.log("details", details);

  const containerStyle = {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  };

  const videoStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
    zIndex: -1,
  };

  const gridContainerStyle = {
    width: "80%",
    backgroundColor: "rgba(34, 34, 128, 0.743)",
    color: "rgba(127,255,255,0.75)",
    zIndex: 1000,
    position: "relative",
    padding: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    height: "auto",
    marginTop: "5rem",
  };

  const goBack = () => {
    window.location.href = `/`;
  };

  console.log("detail page");
  return (
    <div style={containerStyle}>
      <video autoPlay muted loop style={videoStyle}>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <IconButton
        onClick={goBack}
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "rgba(127, 255, 255, 0.75)",
          backgroundColor: "rgba(34, 34, 128, 0.743)",
          "&:hover": {
            backgroundColor: "rgba(34, 34, 128, 0.743)",
            transform: "scale(1.1)",
          },
          transition: "transform 0.3s ease, background-color 0.3s ease",
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "42px" }} />
      </IconButton>

      <Grid container spacing={2} sx={{...gridContainerStyle, borderRadius: "16px"}}>
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
          <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
            Details
          </Typography>
          <Typography sx={{ fontSize: "20px" }}>{details}</Typography>
          <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
            Produced by Nia Adurogbola, Lydia Jessup, Evan Grothjan, Ellen Lo,
            Daniel Mangosing, Noah Pisner and James Surdam. Produced by Nia
            Adurogbola, Lydia Jessup, Evan Grothjan, Ellen Lo.
          </Typography>
          <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
            As automakers go electric, the hunt for raw materials has
            intensified. This effect illustrates the elements required for
            different types of electric vehicle batteries.
          </Typography>
          <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
            Produced by Nia Adurogbola, Lydia Jessup, Evan Grothjan, Ellen Lo,
            Daniel Mangosing, Noah Pisner and James Surdam.
          </Typography>
          <Typography sx={{ marginTop: "1rem", fontSize: "20px" }}>
            We tell stories from the sports desk to the climate beat using a
            range of approaches from detailed.
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Detail;
