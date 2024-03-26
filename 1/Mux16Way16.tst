load Mux16Way16.hdl,
output-file Mux16Way16.out,
compare-to Mux16Way16.cmp,
output-list a%B1.16.1 b%B1.16.1 c%B1.16.1 d%B1.16.1 e%B1.16.1 f%B1.16.1 g%B1.16.1 h%B1.16.1 i%B1.16.1 j%B1.16.1 k%B1.16.1 l%B1.16.1 m%B1.16.1 n%B1.16.1 o%B1.16.1 p%B1.16.1 sel%B2.4.2 out%B1.16.1;

set a 0,
set b 0,
set c 0,
set d 0,
set e 0,
set f 0,
set g 0,
set h 0,
set i 0,
set j 0,
set k 0,
set l 0,
set m 0,
set n 0,
set o 0,
set p 0,
set sel 0,
eval,
output;

set sel 1,
eval,
output;

set sel 2,
eval,
output;

set sel 3,
eval,
output;

set a %B0001001000110100,
set b %B1001100001110110,
set c %B1010101010101010,
set d %B0101010101010101,
set e %B0101010101010101,
set f %B0101010101010101,
set g %B0101010101010101,
set h %B0101010101010101,
set i %B0101010101010101,
set j %B0101010101010101,
set k %B0101010101010101,
set l %B0101010101010101,
set m %B0101010101010101,
set n %B0101010101010101,
set o %B0101010101010101,
set p %B0101010101010101,
set sel 0,
eval,
output;

set sel 1,
eval,
output;

set sel 2,
eval,
output;

set sel 3,
eval,
output;
