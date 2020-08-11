const colors = [
  '#673ab7',
  '#a93ab7',
  '#b73a9c',
  '#b73a57',
  '#b33737',
  '#ef5e27',
  '#c17322',
  '#d08b24',
  '#c19a0d',
  '#b1ad3f',
  '#878c42',
  '#739018',
  '#6a8a2c',
  '#5d9e16',
  '#3c880c',
  '#308e51',
  '#34825e',
  '#3f9474',
  '#39a28f',
  '#399da2',
  '#398aa2',
  '#397ba2',
  '#3968a2',
  '#114d96',
  '#1360bd',
  '#0941bd',
  '#3a4c8c',
  '#1036bd',
  '#3137dc',
  '#513bcc',
  '#5829b5',
  '#551586',
  '#601586',
  '#c839da',
  '#903e9a',
  '#a0399d',
  '#981e73',
  '#a53779',
  '#ad164e',
  '#d0193b',
  '#b52c46',
  '#e44949',
  '#da0014'
]

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = {
  colors,
  getRandomColor
}