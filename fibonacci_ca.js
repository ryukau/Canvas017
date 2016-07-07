var MAX_STATE = 10
var colorcode = 46

var width = 512
var height = 512
var cv = new Canvas(width, height)
var x = 3, y = -4
console.log(`(x: ${ x }, y: ${ y }, norm: ${ Math.sqrt(x * x + y * y) }`)

var line = initLine()

animate()

function animate() {
    updateCanvas()
    step()
    requestAnimationFrame(animate)
}

function updateCanvas() {
    var pixels = cv.CurrentPixels,
        x, y, index, prev_index, color

    // 縦にスライド。
    for (x = 0; x < width; ++x) {
        for (y = 0; y < height - 1; ++y) {
            index = (y * width + x) * 4
            prev_index = ((y + 1) * width + x) * 4
            pixels[index + 0] = pixels[prev_index + 0]
            pixels[index + 1] = pixels[prev_index + 1]
            pixels[index + 2] = pixels[prev_index + 2]
            pixels[index + 3] = pixels[prev_index + 3]
        }
    }

    y = (height - 1) * width
    for (x = 0; x < line.length; ++x) {
        color = U.hsv2rgb((line[x] * colorcode % 256) / 256, 0.7, 0.95)
        index = (y + x) * 4
        pixels[index + 0] = color.r
        pixels[index + 1] = color.g
        pixels[index + 2] = color.b
        pixels[index + 3] = 255
    }

    cv.putPixels()
}

function step() {
    var newline = []
    for (let i = 0; i < line.length; ++i) {
        newline.push((line[i] + line[(i + 1) % line.length]) % MAX_STATE)
    }
    line = newline
}

function initLine() {
    line = new Array(width).fill(0)
    line[0] = 0
    line[1] = 1
    return line
}

function randomLine() {
    line = []
    for (let i = 0; i < width; ++i) {
        line.push(Math.floor(2 * Math.random()))
    }
    return line
}

// UI //

function onInputNumberMaxState(value) {
    MAX_STATE = U.clamp(parseInt(value), 1, 256)
}

function onClickButtonReset() {
    cv.clearWhite()
    cv.CurrentPixels
    line = initLine()
}

function onClickButtonRandom() {
    cv.clearWhite()
    cv.CurrentPixels
    line = randomLine()
}