var MAX_STATE = 2
var colorcode = 46

var width = 512
var height = 512
var cv = new Canvas(width, height)

var line = [1]

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
        color = U.hsv2rgb((line[x] * colorcode % 256) / 256, 1, 1)
        index = (y + x) * 4
        pixels[index + 0] = color.r
        pixels[index + 1] = color.g
        pixels[index + 2] = color.b
        pixels[index + 3] = 255
    }

    cv.putPixels()
}

function step() {
    var newline = [],
        look, say
    while (line.length > 0) {
        look = line.shift()
        say = 1
        while (line[0] === look) {
            line.shift()
            ++say
        }
        newline.push(say, look)
    }

    line = modline(newline, width)
    //line = newline.splice(0, width)
}

function modline(arr, modulo) {
    if (modulo < 1) {
        return arr
    }

    var index = 0
    while (arr.length > modulo) {
        arr[index] += arr.splice(modulo, 1)[0]
        index = (index + 1) % modulo
    }

    for (let i = 0; i < arr.length; ++i) {
        arr[i] = arr[i] % MAX_STATE
    }

    return arr
}

// UI //

function onInputNumberMaxState(value) {
    MAX_STATE = U.clamp(parseInt(value), 1, 256)
}

function onClickButtonReset() {
    cv.clearWhite()
    cv.CurrentPixels
    line = [1]
}