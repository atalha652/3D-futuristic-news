import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Define CSS3DObject as a class
export class CSS3DObject extends THREE.Object3D {
    constructor(element) {
      super();
      this.element = element;
      this.element.style.position = 'absolute';
  
      this.addEventListener('removed', function () {
        if (this.element.parentNode !== null) {
          this.element.parentNode.removeChild(this.element);
        }
      });
    }
  }

CSS3DObject.prototype = Object.create(THREE.Object3D.prototype);
CSS3DObject.prototype.constructor = CSS3DObject;

// Define CSS3DSprite
const CSS3DSprite = function (element) {
  CSS3DObject.call(this, element);
};

CSS3DSprite.prototype = Object.create(CSS3DObject.prototype);
CSS3DSprite.prototype.constructor = CSS3DSprite;

// Define CSS3DRenderer
const CSS3DRenderer = function () {
  console.log('THREE.CSS3DRenderer', THREE.REVISION);

  let _width, _height;
  let _widthHalf, _heightHalf;

  const matrix = new THREE.Matrix4();

  const cache = {
    camera: { fov: 0, style: '' },
    objects: {},
  };

  const domElement = document.createElement('div');
  domElement.style.overflow = 'hidden';

  this.domElement = domElement;

  const cameraElement = document.createElement('div');
  cameraElement.style.WebkitTransformStyle = 'preserve-3d';
  cameraElement.style.MozTransformStyle = 'preserve-3d';
  cameraElement.style.transformStyle = 'preserve-3d';
  domElement.appendChild(cameraElement);

  const isIE = /Trident/i.test(navigator.userAgent);

  this.setClearColor = function () {};

  this.getSize = function () {
    return { width: _width, height: _height };
  };

  this.setSize = function (width, height) {
    _width = width;
    _height = height;
    _widthHalf = _width / 2;
    _heightHalf = _height / 2;

    domElement.style.width = width + 'px';
    domElement.style.height = height + 'px';

    cameraElement.style.width = width + 'px';
    cameraElement.style.height = height + 'px';
  };

  function epsilon(value) {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  function getCameraCSSMatrix(matrix) {
    const elements = matrix.elements;
    return (
      'matrix3d(' +
      epsilon(elements[0]) +
      ',' +
      epsilon(-elements[1]) +
      ',' +
      epsilon(elements[2]) +
      ',' +
      epsilon(elements[3]) +
      ',' +
      epsilon(elements[4]) +
      ',' +
      epsilon(-elements[5]) +
      ',' +
      epsilon(elements[6]) +
      ',' +
      epsilon(elements[7]) +
      ',' +
      epsilon(elements[8]) +
      ',' +
      epsilon(-elements[9]) +
      ',' +
      epsilon(elements[10]) +
      ',' +
      epsilon(elements[11]) +
      ',' +
      epsilon(elements[12]) +
      ',' +
      epsilon(-elements[13]) +
      ',' +
      epsilon(elements[14]) +
      ',' +
      epsilon(elements[15]) +
      ')'
    );
  }

  function getObjectCSSMatrix(matrix, cameraCSSMatrix) {
    const elements = matrix.elements;
    const matrix3d =
      'matrix3d(' +
      epsilon(elements[0]) +
      ',' +
      epsilon(elements[1]) +
      ',' +
      epsilon(elements[2]) +
      ',' +
      epsilon(elements[3]) +
      ',' +
      epsilon(-elements[4]) +
      ',' +
      epsilon(-elements[5]) +
      ',' +
      epsilon(-elements[6]) +
      ',' +
      epsilon(-elements[7]) +
      ',' +
      epsilon(elements[8]) +
      ',' +
      epsilon(elements[9]) +
      ',' +
      epsilon(elements[10]) +
      ',' +
      epsilon(elements[11]) +
      ',' +
      epsilon(elements[12]) +
      ',' +
      epsilon(elements[13]) +
      ',' +
      epsilon(elements[14]) +
      ',' +
      epsilon(elements[15]) +
      ')';

    if (isIE) {
      return (
        'translate(-50%,-50%)' +
        'translate(' +
        _widthHalf +
        'px,' +
        _heightHalf +
        'px)' +
        cameraCSSMatrix +
        matrix3d
      );
    }

    return 'translate(-50%,-50%)' + matrix3d;
  }

  function renderObject(object, camera, cameraCSSMatrix) {
    if (object instanceof CSS3DObject) {
      let style;
      if (object instanceof CSS3DSprite) {
        matrix.copy(camera.matrixWorldInverse);
        matrix.transpose();
        matrix.copyPosition(object.matrixWorld);
        matrix.scale(object.scale);
        matrix.elements[3] = 0;
        matrix.elements[7] = 0;
        matrix.elements[11] = 0;
        matrix.elements[15] = 1;
        style = getObjectCSSMatrix(matrix, cameraCSSMatrix);
      } else {
        style = getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix);
      }

      const element = object.element;
      const cachedStyle = cache.objects[object.id] && cache.objects[object.id].style;

      if (cachedStyle === undefined || cachedStyle !== style) {
        element.style.WebkitTransform = style;
        element.style.MozTransform = style;
        element.style.transform = style;

        cache.objects[object.id] = { style: style };

        if (isIE) {
          cache.objects[object.id].distanceToCameraSquared = getDistanceToSquared(camera, object);
        }
      }

      if (element.parentNode !== cameraElement) {
        cameraElement.appendChild(element);
      }
    }

    for (let i = 0, l = object.children.length; i < l; i++) {
      renderObject(object.children[i], camera, cameraCSSMatrix);
    }
  }

  const getDistanceToSquared = (function () {
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();

    return function (object1, object2) {
      a.setFromMatrixPosition(object1.matrixWorld);
      b.setFromMatrixPosition(object2.matrixWorld);

      return a.distanceToSquared(b);
    };
  })();

  function zOrder(scene) {
    const order = Object.keys(cache.objects).sort(function (a, b) {
      return cache.objects[a].distanceToCameraSquared - cache.objects[b].distanceToCameraSquared;
    });
    const zMax = order.length;

    scene.traverse(function (object) {
      const index = order.indexOf(object.id + '');
      if (index !== -1) {
        object.element.style.zIndex = zMax - index;
      }
    });
  }

  this.render = function (scene, camera) {
    const fov = camera.projectionMatrix.elements[5] * _heightHalf;

    if (cache.camera.fov !== fov) {
      domElement.style.WebkitPerspective = fov + 'px';
      domElement.style.MozPerspective = fov + 'px';
      domElement.style.perspective = fov + 'px';
      cache.camera.fov = fov;
    }

    scene.updateMatrixWorld();

    if (camera.parent === null) camera.updateMatrixWorld();

    const cameraCSSMatrix = 'translateZ(' + fov + 'px)' + getCameraCSSMatrix(camera.matrixWorldInverse);
    const style = cameraCSSMatrix + 'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

    if (cache.camera.style !== style && !isIE) {
      cameraElement.style.WebkitTransform = style;
      cameraElement.style.MozTransform = style;
      cameraElement.style.transform = style;
      cache.camera.style = style;
    }

    renderObject(scene, camera, cameraCSSMatrix);

    if (isIE) {
      zOrder(scene);
    }
  };
};

const ThreeCSS3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
    camera.position.set(0, 0, 500);

    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    containerRef.current.appendChild(renderer.domElement);

    const element = document.createElement('div');
    element.textContent = 'Hello CSS3D!';
    element.style.fontSize = '40px';
    element.style.color = 'red';
    const css3DObject = new CSS3DObject(element);
    css3DObject.position.set(0, 0, 0);
    scene.add(css3DObject);

    const animate = function () {
      requestAnimationFrame(animate);
      css3DObject.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeCSS3D;
