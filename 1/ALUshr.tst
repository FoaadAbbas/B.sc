load ALUshr.hdl,
output-file ALUshr.out,
compare-to ALUshr.cmp,
output-list x%B1.16.1 y%B1.16.1 zx%B1.1.1 nx%B1.1.1 zy%B1.1.1 
            ny%B1.1.1 f%B1.1.1 no%B1.1.1 shiftAmount%B1.4.1
			out%B1.16.1 zr%B1.1.1 ng%B1.1.1;

set x %B1010010001000010;  

// Compute x>>0
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 0, eval, output;

// Compute x>>1
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 1, eval, output;

// Compute x>>2
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 2, eval, output;

// Compute x>>3
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 3, eval, output;

// Compute x>>4
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 4, eval, output;

// Compute x>>5
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 5, eval, output;

// Compute x>>6
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 6, eval, output;

// Compute x>>7
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 7, eval, output;

// Compute x>>8
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 8, eval, output;

// Compute x>>9
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 9, eval, output;

// Compute x>>10
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 10, eval, output;

// Compute x>>11
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 11, eval, output;

// Compute x>>12
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 12, eval, output;

// Compute x>>13
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 13, eval, output;

// Compute x>>14
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 14, eval, output;

// Compute x>>15
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 15, eval, output;


set x %B0010010001000010;  

// Compute x>>0
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 0, eval, output;

// Compute x>>1
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 1, eval, output;

// Compute x>>2
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 2, eval, output;

// Compute x>>3
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 3, eval, output;

// Compute x>>4
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 4, eval, output;

// Compute x>>5
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 5, eval, output;

// Compute x>>6
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 6, eval, output;

// Compute x>>7
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 7, eval, output;

// Compute x>>8
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 8, eval, output;

// Compute x>>9
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 9, eval, output;

// Compute x>>10
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 10, eval, output;

// Compute x>>11
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 11, eval, output;

// Compute x>>12
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 12, eval, output;

// Compute x>>13
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 13, eval, output;

// Compute x>>14
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 14, eval, output;

// Compute x>>15
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0, set shiftAmount 15, eval, output;


set x %B0000000000000000,  // x = 0
set y %B1111111111111111;  // y = -1
set shiftAmount 1;

// Compute 0
set zx 1, set nx 0, set zy 1, set ny 0, set f  1, set no 0,
eval, output;

// Compute 1
set zx 1, set nx 1, set zy 1, set ny 1, set f  1, set no 1,
eval, output;

// Compute -1
set zx 1, set nx 1, set zy 1, set ny 0, set f  1, set no 0,
eval, output;

// Compute x
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0,
eval, output;

// Compute y
set zx 1, set nx 1, set zy 0, set ny 0, set f  0, set no 0, 
eval, output;

// Compute !x
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 1, 
eval, output;

// Compute !y
set zx 1, set nx 1, set zy 0, set ny 0, set f  0, set no 1,
eval, output;

// Compute -x
set zx 0, set nx 0, set zy 1, set ny 1, set f  1, set no 1, 
eval, output;

// Compute -y
set zx 1, set nx 1, set zy 0, set ny 0, set f  1, set no 1,
eval, output;

// Compute x + 1
set zx 0, set nx 1, set zy 1, set ny 1, set f  1, set no 1,
eval, output;

// Compute y + 1
set zx 1, set nx 1, set zy 0, set ny 1, set f  1, set no 1,
eval, output;

// Compute x - 1
set zx 0, set nx 0, set zy 1, set ny 1, set f  1, set no 0, 
eval, output;

// Compute y - 1
set zx 1, set nx 1, set zy 0, set ny 0, set f  1, set no 0,
eval, output;

// Compute x + y
set zx 0, set nx 0, set zy 0, set ny 0, set f  1, set no 0,
eval, output;

// Compute x - y
set zx 0, set nx 1, set zy 0, set ny 0, set f  1, set no 1,
eval, output;

// Compute y - x
set zx 0, set nx 0, set zy 0, set ny 1, set f  1, set no 1,
eval, output;

// Compute x & y
set zx 0, set nx 0, set zy 0, set ny 0, set f  0, set no 0,
eval, output;

// Compute x | y
set zx 0, set nx 1, set zy 0, set ny 1, set f  0, set no 1, 
eval, output;

set x %B000000000010001,  // x = 17
set y %B000000000000011;  // y =  3

// Compute 0
set zx 1, set nx 0, set zy 1, set ny 0, set f  1, set no 0,
eval, output;

// Compute 1
set zx 1, set nx 1, set zy 1, set ny 1, set f  1, set no 1,
eval, output;

// Compute -1
set zx 1, set nx 1, set zy 1, set ny 0, set f  1, set no 0,
eval, output;

// Compute x
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 0,
eval, output;

// Compute y
set zx 1, set nx 1, set zy 0, set ny 0, set f  0, set no 0,
eval, output;

// Compute !x
set zx 0, set nx 0, set zy 1, set ny 1, set f  0, set no 1, 
eval, output;

// Compute !y
set zx 1, set nx 1, set zy 0, set ny 0, set f  0, set no 1,
eval, output;

// Compute -x
set zx 0, set nx 0, set zy 1, set ny 1, set f  1, set no 1,
eval, output;

// Compute -y
set zx 1, set nx 1, set zy 0, set ny 0, set f  1, set no 1,
eval, output;

// Compute x + 1
set zx 0, set nx 1, set zy 1, set ny 1, set f  1, set no 1,
eval, output;

// Compute y + 1
set zx 1, set nx 1, set zy 0, set ny 1, set f  1, set no 1,
eval, output;

// Compute x - 1
set zx 0, set nx 0, set zy 1, set ny 1, set f  1, set no 0,
eval, output;

// Compute y - 1
set zx 1, set nx 1, set zy 0, set ny 0, set f  1, set no 0,
eval, output;

// Compute x + y
set zx 0, set nx 0, set zy 0, set ny 0, set f  1, set no 0,
eval, output;

// Compute x - y
set zx 0, set nx 1, set zy 0, set ny 0, set f  1, set no 1,
eval, output;

// Compute y - x
set zx 0, set nx 0, set zy 0, set ny 1, set f  1, set no 1,
eval, output;

// Compute x & y
set zx 0, set nx 0, set zy 0, set ny 0, set f  0, set no 0,
eval, output;

// Compute x | y
set zx 0, set nx 1, set zy 0, set ny 1, set f  0, set no 1,
eval, output;
