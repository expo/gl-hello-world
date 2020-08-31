import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';

const vertSrc = `
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;

const fragSrc = `
void main(void) {
  gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
`;

let _initialized = false;
// lol

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <GLView
          style={{ width: 300, height: 300 }}
          onContextCreate={this._onContextCreate}
        />
      </View>
    );
  }

  _onContextCreate = gl => {
    if (_initialized) {
      return;
    }

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 1, 1, 1);

    // Compile vertex and fragment shader
    const vert = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vert, vertSrc);
    gl.compileShader(vert);
    const frag = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(frag, fragSrc);
    gl.compileShader(frag);

    // Link together into a program
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

    gl.flush();
    gl.endFrameEXP();
    _initialized = true;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
