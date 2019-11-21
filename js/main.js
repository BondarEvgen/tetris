 
 const CANVAS_BACKGROUND = '#ffffff'

 const CANVAS_WIDTH = 300
 const CANVAS_HEIGHT = 600
 const PADDING = 0

 const ROW_NOMBERS = 20
 const COLUMNS_NUMBERS = 10

 const START_BLOCK_NUMBERS = [1, 3, 6, 7, 10, 13, 19]
 const START_BLOCK_COLORS =['#a5c2f0', '#a0eba6', '#e2e6a1', '#ebb4a7', '#dfa9eb']


 const fieldWidth = CANVAS_WIDTH / COLUMNS_NUMBERS
 const fieldHeight = CANVAS_HEIGHT / ROW_NOMBERS

 const canvas = document.querySelector('canvas')
 const context = canvas.getContext('2d')


 const map = getMap()

 let scope = 0
 let level = 1
 let tetris = 0

 let block = getBlock(getRandomFrom(START_BLOCK_NUMBERS),
                        getRandomFrom(START_BLOCK_COLORS))

 let downTime = getDownTime()
 


 canvas.width = CANVAS_WIDTH
 canvas.height = CANVAS_HEIGHT

 start()

 function start () {
     requestAnimationFrame(tick)
 }

 function tick (timestamp) {
     if (timestamp >= downTime ) {
         const blockCopy = block.getCopy()
         blockCopy.y = blockCopy.y + 1
        

         if (canBlockExists(blockCopy)) {
             block = blockCopy
             
         }
         else {
             saveBlock()
             const lines = clearLines()
            console.log(lines)
             if (lines === 4) {
                 tetris++
             }

             scope = scope + lines * 100
             level = 1 + parseInt(scope / 300)
            
             block = getBlock( getRandomFrom(START_BLOCK_NUMBERS), getRandomFrom(START_BLOCK_COLORS))
            
            updateState()

            if(!canBlockExists(block)) {
                alert('FIN THE GAME')
                return
            }

             
         }

         downTime = timestamp + getDownTime()
     }
    clearCanvas()
    drawBlock()
    drawState()
    requestAnimationFrame(tick)
 }

 function getRandom (min, max) {
     return min + Math.floor(Math.random() * (max - min +1))

 }

 function getDownTime () {
     return 1000 
    //  + 900 / level
    }

function getRandomFrom( array) {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}

function updateState () {
    const element = document.querySelector('#status1')
    
    element.querySelector('[data-role="scope"]').textContent = scope
    element.querySelector('[data-role="level"]').textContent = level
    element.querySelector('[data-role="tetris"]').textContent = tetris
}

 function clearCanvas () {
     context.fillStyle = CANVAS_BACKGROUND
     context.strokeStyle = 'black'
     context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT )
     context.fill()
     context.stroke()

 }

 function drawField (x, y, color) {
     context.fillStyle = color

     context.fillRect(
         x * fieldWidth + PADDING,
         y * fieldHeight + PADDING,
         fieldWidth - 2,
         fieldHeight - 2

     )
 }

 function drawBlock () {
      
    for (part of block.getIncludedParts()) {
        drawField(part.x, part.y, block.color)
    }
 }
 
function clearLines () {
    let lines = 0
    
    for (let y = ROW_NOMBERS - 1; y >= 0; y-- ) {
        let flag = true

        for (let x = 0; x < COLUMNS_NUMBERS; x++) {
            if(!getField(x, y)) {
                flag = false
                break
            }
        }

        if (flag) {
            lines = lines + 1

            for (let t = y; t >= 1; t--) {
                for (let x = 0; x < COLUMNS_NUMBERS; x++) {
                    map[t][x] = map[t - 1][x]
                    map[t - 1][x] = null
                }
            }

            y = y + 1
        }
    }
    return lines
}

 function getMap () {

    const map = []

    for (let y = 0; y < ROW_NOMBERS; y++) {
        const row = []

        for (let x = 0; x < COLUMNS_NUMBERS; x++){
            row.push(null) 
        }
        map.push(row)    
    }
    return map
 }

 function saveBlock () {
     
     for ( const part of block.getIncludedParts()) {
        setField(part.x, part.y, block.color)
     }
}

 function drawState () {
     for(let y = 0; y < ROW_NOMBERS; y++) {
         for(let x = 0; x < COLUMNS_NUMBERS; x++) {
            const field = map[y][x]

            if (field) {
                drawField(x, y, field)
            }
         }
     }
 }

 

 function getBlock (type, color = 'black', x = 4, y = 0) {
     const block = {type, x, y, color}

     block.getIncludedParts = function () {
         const p =  (dx, dy) => ({ x: block.x + dx, y: block.y + dy })

        if (block.type === 1) {
            return [p(0, 0), p(1, 0), p(0, 1), p(1, 1)]
        }

        if (block.type === 2) {
            return [p(0, 0), p(-1, 0), p(1, 0), p(0, -1)]
        }

        if (block.type === 3) {
            return [p(0, 0), p(-1, 0), p(1, 0), p(0, 1)]
        }

        if (block.type === 4) {
            return [p(0, 0), p(0, -1), p(1, 0), p(0, 1)]
        }

        if (block.type === 5) {
            return [p(0, 0), p(0, -1), p(-1, 0), p(0, 1)]
        }

        if (block.type === 6) {
            return [p(0, 0), p(-1, 1), p(0, 1), p(1, 0)]
        }

        if (block.type === 7) {
            return [p(0, 0), p(-1, 0), p(0, 1), p(1, 1)]
        }

        if (block.type === 8) {
            return [p(0, 0), p(-1, -1), p(-1, 0), p(0, 1)]
        }

        if (block.type === 9) {
            return [p(0, 0), p(-1, 0), p(-1, 1), p(0, -1)]
        }

         if (block.type === 10) {
             return [p(0, 0), p(-1, 0), p(1, 0), p(2, 0)]
         }

         if (block.type === 11) {
            return [p(0, 0), p(0, -1), p(0, 1), p(0, 2)]
        }

        if (block.type === 12) {
            return [p(0, 0), p(0, 2), p(0, 1), p(1, 0)]
        }

        if (block.type === 13) {
            return [p(0, 0), p(-2, 0), p(-1, 0), p(0, 1)]
        }

        if (block.type === 14) {
            return [p(0, 0), p(0, -1), p(0, -2), p(-1, 0)]
        }

        if (block.type === 15) {
            return [p(0, 0), p(0, -1), p(1, 0), p(2, 0)]
        }

        if (block.type === 16) {
            return [p(0, 0), p(-1, 0), p(0, 1), p(0, 2)]
        }

        if (block.type === 17) {
            return [p(0, 0), p(-2, 0), p(-1, 0), p(0, -1)]
        }

        if (block.type === 18) {
            return [p(0, 0), p(0, -2), p(0, -1), p(1, 0)]
        }

        if (block.type === 19) {
            return [p(0, 0), p(0, -1), p(1, 0), p(2, 0)]
        }

         
     }

     block.getNextBlock = function () {
        const p = n => getBlock(n, block.color, block.x, block.y)

         if (block.type === 1) {
             return p(1)
         }


         if (block.type === 10) {
             return p(11)
         }
         if (block.type === 11) {
            return p(10)
        }

        if (block.type === 2) {
            return p(4)
        }
        if (block.type === 4) {
            return p(3)
        }
        if (block.type === 3) {
            return p(5)
        }
        if (block.type === 5) {
            return p(2)
        }


        if (block.type === 6) {
            return p(8)
        }
        if (block.type === 8) {
            return p(6)
        }

        if (block.type === 7) {
            return p(9)
        }
        if (block.type === 9) {
            return p(7)
        }

        if (block.type === 12) {
            return p(13)
        }
        if (block.type === 13) {
            return p(14)
        }
        if (block.type === 14) {
            return p(15)
        }
        if (block.type === 15) {
            return p(12)
        }

        if (block.type === 16) {
            return p(17)
        }
        if (block.type === 17) {
            return p(18)
        }
        if (block.type === 18) {
            return p(19)
        }
        if (block.type === 19) {
            return p(16)
        }
        
     }

     block.getCopy = function () {
        return getBlock(block.type, block.color, block.x, block.y)
     }

     return block
 }

function canBlockExists (block) {
    const parts = block.getIncludedParts()

    for ( const part of parts){
        if (getField(part.x, part.y)) {
            return false
        }
    }
    return true
}

 function getField (x, y) {
     if (map[y] === undefined || map[y][x] === undefined) {
         return 'black'
     }
     return map[y][x]
 }

 function setField (x, y, value) {
    if (map[y] === undefined || map[y][x] === undefined) {
        return 'black'
    }
    return map[y][x] = value
}



listen('KeyW', rotateBlock)
listen('KeyA', moveBlockLeft)
listen('KeyD', moveBlockRight)
listen('KeyS', moveBlockDown)

function rotateBlock() {
    const blockCopy = block.getNextBlock()
        

        if (canBlockExists(blockCopy)) {
            block = blockCopy
        }
} 



function moveBlockLeft() {
    const blockCopy = block.getCopy()
        blockCopy.x = blockCopy.x - 1

        if (canBlockExists(blockCopy)) {
            block = blockCopy
        }
} 



function moveBlockRight() {
    const blockCopy = block.getCopy()
        blockCopy.x = blockCopy.x + 1

        if (canBlockExists(blockCopy)) {
            block = blockCopy
        }
} 
    

function moveBlockDown() {
    const blockCopy = block.getCopy()

        blockCopy.y = blockCopy.y + 1

        if (canBlockExists(blockCopy)) {
            block = blockCopy
        }
} 

function listen (code, handler) {
    document.body.addEventListener('keydown', function (event) {
        if (event.code === code) {
            event.preventDefault()
            handler()
        }
    })
}
 
//  document.body.addEventListener('keydown', function(event) {
    

//     if (event.code === 'KeyA') {
//         const blockCopy = block.getCopy()
//        blockCopy.x = blockCopy.x - 1

//        if (canBlockExists(blockCopy)) {
//             block = blockCopy
//        }
       
//     }

//     if (event.code === 'KeyD') {
//         const blockCopy = block.getCopy()
//         blockCopy.x = blockCopy.x + 1

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }

//     if (event.code === 'KeyW') {
//         const blockCopy = block.getNextBlock()
        

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }

//     if (event.code === 'KeyS') {
//         const blockCopy = block.getCopy()

//         blockCopy.y = blockCopy.y + 1

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }

//     if (event.code === 'ArrowLeft') {
//         const blockCopy = block.getCopy()
//        blockCopy.x = blockCopy.x - 1

//        if (canBlockExists(blockCopy)) {
//             block = blockCopy
//        }
       
//     }

//     if (event.code === 'ArrowRight') {
//         const blockCopy = block.getCopy()
//         blockCopy.x = blockCopy.x + 1

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }

//     if (event.code === 'ArrowUp') {
//         const blockCopy = block.getNextBlock()
        

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }

//     if (event.code === 'ArrowDown') {
//         const blockCopy = block.getCopy()

//         blockCopy.y = blockCopy.y + 1

//         if (canBlockExists(blockCopy)) {
//             block = blockCopy
//         }
        
//     }
// })
 
// let x = canvas.width
// let y = canvas.height

// line(3)
// function line (step) {

//     console.log(step)
//     for(i = 0; i < x; i = i + step) {
        
        
//         context.strokeStyle = 'black'

//         context.moveTo(i, 0)
//         context.lineTo((x - i), y)
        
//         context.stroke()

//     }
// }
