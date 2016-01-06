var O = {};

O.Canvas = function (w, h) {
  var inst = this;

  if (typeof(w) == "string") {
      inst.el = document.getElementById(w);
      inst.w = inst.el.width;
      inst.h = inst.el.height;
  } else {
      inst.el = document.createElement('canvas');
      inst.w = w;
      inst.h = h;
      inst.el.width = w;
      inst.el.height = h;
  }

  function getGL() {
    var gl;

    try {
      gl = inst.el.getContext("webgl") || inst.el.getContext("experimental-webgl");
      return gl;
    } catch(e) {
      console.error("problem initializing webgl.");
    }

    return null;
  }

  function setupGL() {
      inst.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      inst.gl.enable(inst.gl.DEPTH_TEST);
      inst.gl.depthFunc(inst.gl.LEQUAL);
  }

  inst.addChild = function (c) {
      inst.children.push(c);
  };

  inst.addChildAtIndex = function (c, index) {
      inst.children.splice(index, 0, c);
  };

  inst.removeChild = function (c) {
      var i;

      for (i = 0; i < inst.children.length; i += 1) {
          if (inst.children[i] == c) {
              inst.children.splice(i, 1);
          }
      }
  };

  inst.render = function () {
    inst.gl.viewport(0, 0, inst.gl.viewportWidth, inst.gl.viewportHeight);
    inst.gl.clear(inst.gl.COLOR_BUFFER_BIT | inst.gl.DEPTH_BUFFER_BIT);

    /*
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);

    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    */
  }

  inst.gl = getGL();

  if (!inst.gl) {
    console.error("Unable to initialize WebGL. Your browser may not support it.");
    return;
  }

  setupGL();
  //init shaders
  //init buffers

  inst.children = [];

};


O.Sprite = function (t) {

};
