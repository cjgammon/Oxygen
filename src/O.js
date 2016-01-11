var mat4 = {
  scalar: {},
  SIMD: {},
};
mat4.create = function() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
mat4.identity = function(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
mat4.perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
mat4.translate = function (out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

var O = {};
O.SHADERS = {
  vert: "\
      attribute vec3 aVertexPosition;\
  \
      uniform mat4 uMVMatrix;\
      uniform mat4 uPMatrix;\
  \
      void main(void) {\
          gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\
      }",
  frag: "\
      precision mediump float;\
  \
      void main(void) {\
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\
      }"
};

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
    inst.gl.viewportWidth = inst.el.width;
    inst.gl.viewportHeight = inst.el.height;
    inst.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    inst.gl.enable(inst.gl.DEPTH_TEST);
    inst.gl.depthFunc(inst.gl.LEQUAL);
  }

  function getShader(type, str) {

    var shader;

    if (type == 'frag') {
      shader = inst.gl.createShader(inst.gl.FRAGMENT_SHADER);
    } else if (type == 'vert') {
      shader = inst.gl.createShader(inst.gl.VERTEX_SHADER);
    }

    inst.gl.shaderSource(shader, str);
    inst.gl.compileShader(shader);

    if (!inst.gl.getShaderParameter(shader, inst.gl.COMPILE_STATUS)) {
      alert(inst.gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  var shaderProgram;
  var mvMatrix = mat4.create();
  var pMatrix = mat4.create();
  var spriteVertexPositionBuffer;

  function initShaders() {
    var fragmentShader = getShader('frag', O.SHADERS.frag);
    var vertexShader = getShader('vert', O.SHADERS.vert);

    shaderProgram = inst.gl.createProgram();
    inst.gl.attachShader(shaderProgram, vertexShader);
    inst.gl.attachShader(shaderProgram, fragmentShader);
    inst.gl.linkProgram(shaderProgram);

    if (!inst.gl.getProgramParameter(shaderProgram, inst.gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    inst.gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = inst.gl.getAttribLocation(shaderProgram, "aVertexPosition");
    inst.gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = inst.gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = inst.gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }

  function setMatrixUniforms() {
    inst.gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    inst.gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  }

  /*
  function initBuffers() {
    spriteVertexPositionBuffer = inst.gl.createBuffer();
    inst.gl.bindBuffer(inst.gl.ARRAY_BUFFER, spriteVertexPositionBuffer);
    vertices = [
        0.5,  0.5,  0.0,
       -0.5,  0.5,  0.0,
        0.5, -0.5,  0.0,
       -0.5, -0.5,  0.0
    ];
    */
    inst.gl.bufferData(inst.gl.ARRAY_BUFFER, new Float32Array(vertices), inst.gl.STATIC_DRAW);
    spriteVertexPositionBuffer.itemSize = 3;
    spriteVertexPositionBuffer.numItems = 4;
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
    var i;

    inst.gl.viewport(0, 0, inst.gl.viewportWidth, inst.gl.viewportHeight);
    inst.gl.clear(inst.gl.COLOR_BUFFER_BIT | inst.gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, inst.gl.viewportWidth / inst.gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);

    inst.gl.bindBuffer(inst.gl.ARRAY_BUFFER, spriteVertexPositionBuffer);
    inst.gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, spriteVertexPositionBuffer.itemSize, inst.gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    inst.gl.drawArrays(inst.gl.TRIANGLE_STRIP, 0, spriteVertexPositionBuffer.numItems);

    //TODO:: loop through and draw sprites
    for (i = 0; i < inst.children.length; i += 1) {
        inst.children[i].render(inst.ctx);
    }
  }

  function init() {
    inst.gl = getGL();

    if (!inst.gl) {
      console.error("Unable to initialize WebGL. Your browser may not support it.");
      return;
    }

    setupGL();
    initShaders();
    initBuffers();

    inst.children = [];
  }

  init();

};


O.Sprite = function (t) {
  var inst = this,
      vertexPositionBuffer;

  function init() {
    vertexPositionBuffer = inst.gl.createBuffer();
    inst.gl.bindBuffer(inst.gl.ARRAY_BUFFER, vertexPositionBuffer);
    vertices = [
        0.5,  0.5,  0.0,
       -0.5,  0.5,  0.0,
        0.5, -0.5,  0.0,
       -0.5, -0.5,  0.0
    ];

    inst.gl.bufferData(inst.gl.ARRAY_BUFFER, new Float32Array(vertices), inst.gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3;
    vertexPositionBuffer.numItems = 4;
  }

  inst.render = function () {
    //draw sprite
  }


};
