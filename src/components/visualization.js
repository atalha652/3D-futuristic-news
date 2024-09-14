import React, { Fragment, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { extend, useThree, useFrame } from "@react-three/fiber";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/examples/jsm/renderers/CSS3DRenderer";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import TWEEN from "@tweenjs/tween.js";
import { table } from "../utils/jsonNew";
import { Box, Modal, Typography, IconButton, Grid, Grow } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { element } from "three/examples/jsm/nodes/Nodes.js";

extend({ CSS3DObject, TrackballControls });

const Visualization = React.memo(() => {
  console.log("table", table);
  const containerRef = useRef();
  const cameraRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const objectsRef = useRef([]);
  const targetsRef = useRef({ table: [], sphere: [], helix: [], grid: [] });
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  // const [modalHandle, setModalHandle] = useState(false);
  console.log("modalData", modalData);
  const [expandContent, setExpandContent] = useState(false);

  const modalHandle = useRef();
  console.log("modalHandle", modalHandle.current);

  useEffect(() => {
    init();
    animate();
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("click", toggleModal);
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", toggleModal);
      controlsRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1500, // Duration of the animation
    });
  }, []);

  const init = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.z = 11900;
    cameraRef.current = camera;

    sceneRef.current = scene;

    // Grid layout parameters
    const cols = 1; // Number of columns
    const rows = Math.ceil(table.length / (cols * 5)); // Number of rows
    const spacingX = 140; // Horizontal spacing between cards
    const spacingY = 180; // Vertical spacing between cards

    // Determine how many rows to exclude (e.g., exclude last 2 rows)
    const rowsToExclude = 50;
    const elementsToExclude = rowsToExclude * cols * 5;

    // table
    for (let i = 0; i < table.length - elementsToExclude; i += 5) {
      const element = document.createElement("div");
      element.className = "element";
      element.id = "box";
      element.style.backgroundColor = `rgba(34, 34, 128,${
        Math.random() * 0.4 + 0.15
      })`;
      element.style.height = "150px";
      element.style.cursor = "pointer";
      element.style.borderRadius = "6px";
      element.style.transition = "all 0.3s ease";

      const number = document.createElement("div");
      number.className = "number";
      number.textContent = table[i + 2];
      element.appendChild(number);
      number.style.color = "#FFFFFF";

      const symbol = document.createElement("div");
      symbol.className = "symbol";
      symbol.innerHTML = `<a href="${
        table[i].split("|")[0]
      }" target="_blank"><img src="${table[i].split("|")[1]}"></a>`;
      element.appendChild(symbol);

      const details = document.createElement("div");
      details.className = "details"; // Start with the blur class
      details.innerHTML = table[i + 1];
      details.style.backgroundColor = "rgba(0,255,255, 0.04)";
      details.style.color = "#FFFFFF";
      element.appendChild(details);

      const objectCSS = new CSS3DObject(element);
      objectCSS.position.x = (i % cols) * spacingX - cols * spacingX;
      objectCSS.position.y = Math.floor(i / cols) * spacingY + rows * spacingY;
      objectCSS.position.z = 0; // Set initial Z position to 0
      scene.add(objectCSS);

      objectsRef.current.push(objectCSS);

      // Add hover animationssss
      objectCSS.scale.set(1, 1, 1); // Ensure initial scale is 1 (normal size)

      objectCSS.element.addEventListener("mouseenter", () => {
        new TWEEN.Tween(objectCSS.scale)
          .to({ x: 1.2, y: 1.2, z: 1.2 }, 200)
          .start();
        setModalData({
          image: table[i].split("|")[1],
          details: table[i + 1],
        });
      });

      objectCSS.element.addEventListener("mouseleave", () => {
        new TWEEN.Tween(objectCSS.scale).to({ x: 1, y: 1, z: 1 }, 200).start();
      });

      const object3D = new THREE.Object3D();
      object3D.position.x = table[i + 3] * 140 - 1330;
      object3D.position.y = -(table[i + 4] * 180) + 990;
      targetsRef.current.table.push(object3D);
    }

    // grid
    for (let i = 0; i < objectsRef.current.length; i++) {
      const object = new THREE.Object3D();

      // Create zigzag effect
      object.position.x = (i % 2) * 250 - 110;

      // Adjust y position
      object.position.y = (-Math.floor(i / 5) % 1) * 400 + 10;

      // Move left layer backward
      if (i % 2 === 0) {
        object.position.z = Math.floor(i / 2) * 320 - 370; // Move left layer backward
        object.rotation.x = -Math.PI / 20; // Tilt left layer from bottom to top
      } else {
        object.position.z = Math.floor(i / 2) * 320 - 170; // Original position for right layer
        object.rotation.x = Math.PI / -20;
      }

      targetsRef.current.grid.push(object);
    }

    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = 0; // Set renderer to top-left corner
    renderer.domElement.style.left = 0;
    document.body.appendChild(renderer.domElement); // Append directly to the document body
    rendererRef.current = renderer;

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.3;
    controls.minDistance = 0;
    controls.maxDistance = 11900;
    controls.noRotate = true; // Disable rotation
    controls.zoomSpeed = 0.1; // Decrease zoom speed
    controls.addEventListener("change", render);
    controls.addEventListener("change", updateBlurEffect);
    controlsRef.current = controls;

    const button = document.getElementById("grid");
    // button.addEventListener(
    //   "click",
    //   () => {
    //     transform(targetsRef.current.grid, 2000);
    //   },
    //   false
    // );
    transform(targetsRef.current.grid, 2000);
  };

  const updateBlurEffect = () => {
    const blurThreshold = 1700; // Define the maximum distance for full blur effect
    const minBlurThreshold = 550; // Define the minimum distance for no blur effect
    const detailsElements = document.querySelectorAll(".details");

    objectsRef.current.forEach((object, index) => {
      const details = detailsElements[index];
      const distance = cameraRef.current.position.distanceTo(object.position);

      if (distance < minBlurThreshold) {
        details.classList.remove("blurred-details");
        details.classList.add("clear-details");
        zoomInCard(object); // Trigger zoom-in effect
      } else if (distance > blurThreshold) {
        details.classList.remove("clear-details");
        details.classList.add("blurred-details");
        zoomOutCard(object); // Reset zoom-out effect
      } else {
        const blurAmount =
          ((distance - minBlurThreshold) / (blurThreshold - minBlurThreshold)) *
          6;
        details.style.filter = `blur(${blurAmount}px)`;
        details.classList.remove("clear-details");
        details.classList.add("blurred-details");
        zoomOutCard(object); // Reset zoom-out effect for partially blurred cards
      }
    });
  };

  const zoomInCard = (object) => {
    new TWEEN.Tween(object.scale).to({ x: 1.2, y: 1.2, z: 1.2 }, 200).start();
  };

  const zoomOutCard = (object) => {
    new TWEEN.Tween(object.scale).to({ x: 1, y: 1, z: 1 }, 200).start();
  };

  const transform = (targets, duration) => {
    TWEEN.removeAll();
    for (let i = 0; i < objectsRef.current.length; i++) {
      const object = objectsRef.current[i];
      const target = targets[i];
      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();
    }
    new TWEEN.Tween({})
      .to({}, duration * 2)
      .onUpdate(render)
      .start();
  };

  // scrolling through the mouse wheel navigates to a specific point (every two cards)
  const onScrollZoom = (event) => {
    const newIndex = visibleIndex + (event.deltaY > 0 ? 2 : -2);
    if (newIndex >= 0 && newIndex < objectsRef.current.length) {
      setVisibleIndex(newIndex);
    }
  };

  const onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
    render();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    TWEEN.update(); // Ensure TWEEN animations are updated
    controlsRef.current.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const render = () => {
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  const toggleModal = () => {
    setModalOpen(true);
    modalHandle.current = true;
    setTimeout(() => {
      setExpandContent(true);
    }, [500]);
    // localStorage.setItem("modalData", JSON.stringify(modalData));
  };

  // Handle modal close
  const handleModalClose = (event) => {
    event.stopPropagation();
    setModalOpen(false);
    setTimeout(() => {
      setExpandContent(false);
      modalHandle.current = false;
    }, 200);
  };

  const encodeDataToQueryString = (data) => {
    return new URLSearchParams(data).toString();
  };

  return (
    <Fragment>
      <div ref={containerRef} />
      <>
        <Modal open={expandContent} duration={2000}>
          <Grid
            data-aos="zoom-in"
            data-aos-offset="100"
            data-aos-duration="900"
            container
            sx={{
              width: "auto",
              maxWidth: "80rem",
              // height: "65vh",
              marginLeft: "22rem",
              marginTop: "10rem",
              backgroundColor: "rgba(34, 34, 128, 0.743)",
              color: "rgba(127,255,255,0.75)",
              zIndex: 1000,
              position: "relative",
              borderRadius: "16px",
            }}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "rgba(127,255,255,0.75)",
              }}
            >
              <CloseIcon data-aos="flip-down" />
            </IconButton>
            <div style={{ padding: "2rem", width: "65rem" }}>
              <Grid container>
                <Grid item xs={6}>
                  {modalData && (
                    <div
                      className="element"
                      style={{
                        backgroundColor: `rgba(34, 34, 128, ${
                          Math.random() * 0.4 + 0.15
                        })`,
                        height: "54vh",
                        width: "27.7rem",
                        // padding: "1rem",
                        paddingTop: "1rem",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        borderRadius: "16px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "24px",
                          color: "#FFFFFF",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          marginRight: "1rem",
                          letterSpacing: "0.1em",
                        }}
                      >
                        26/Sep
                      </Typography>
                      <Box
                        component="img"
                        src={modalData.image}
                        alt="Card Image"
                        sx={{ width: 400, height: 300, marginTop: "1rem" }}
                      />
                      <div
                        style={{
                          backgroundColor: "rgba(0,255,255, 0.04)",
                          fontSize: "28px",
                          marginTop: "1rem",
                          color: "#FFFFFF",
                          letterSpacing: "0.020em",
                        }}
                      >
                        {modalData.details}
                      </div>
                    </div>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{  color: "#FFFFFF",}}>E.V. Battery Breakdown</Typography>
                  <Typography
                    sx={{
                      marginTop: "1.3rem",
                      fontSize: "20px",
                      color: "#ffffffbf",
                    }}
                  >
                    As automakers go electric, the hunt for raw materials has
                    intensified. This effect illustrates the elements required
                    for different types of electric vehicle batteries.
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "1rem",
                      fontSize: "20px",
                      color: "#ffffffbf",
                    }}
                  >
                    August 19, 2022
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "1rem",
                      fontSize: "20px",
                      width: "40rem",
                      color: "#ffffffbf",
                    }}
                  >
                    As automakers go electric, the hunt for raw materials has
                    intensified. This effect illustrates the elements required
                    for different types of electric vehicle batteries.
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "1rem",
                      fontSize: "20px",
                      width: "40rem",
                      color: "#ffffffbf",
                    }}
                  >
                    Produced by Nia Adurogbola, Lydia Jessup, Evan Grothjan,
                    Ellen Lo, Daniel Mangosing, Noah Pisner and James Surdam.
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "1rem",
                      fontSize: "20px",
                      width: "40rem",
                      color: "#ffffffbf",
                    }}
                  >
                    We tell stories from the sports desk to the climate beat
                    using a range of approaches from detailed.
                  </Typography>
                  <Link
                    to={{
                      pathname: "/detail",
                      search: `?${encodeDataToQueryString({
                        image: modalData?.image,
                        details: modalData?.details,

                      })}}`,
                    }}
                    style={{
                      position: "absolute",
                      bottom: "45px",
                      fontSize: "20px",
                      width: "40rem",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      textDecoration: "underline",
                      letterSpacing: "0.09rem",
                    }}
                  >
                    Learn more...
                  </Link>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Modal>
      </>
    </Fragment>
  );
});

export default Visualization;
