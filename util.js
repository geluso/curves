export default {
  randomRGB: () => {
    let red = Math.random() * 256
    let green = Math.random() * 256
    let blue = Math.random() * 256
    return `rgb(${red}, ${green}, ${blue})`
  }
}
