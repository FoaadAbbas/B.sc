(gcd)
@numArr
A = M
D = M //D = ARR[0]
A = A + 1 // M = ARR[1]
D = D - M 
@arr0IsBigger
D;JGT
@numArr
A = M
D = M
@n2
M = D // N2 = numArr[0](הקטן)
@numArr
A = M + 1
D = M
@n1
M = D
@WHILE
0;JMP
(arr0IsBigger)
@numArr
A = M
@n1
M = D
@numArr
A = M + 1
D = M
@n2
M = D
(WHILE)
@n2
D = M 
@temp
M = D
@RETADD
D = A
@modulORetAdd
M = D
@n2
D = M
@y
 M = D
 @n1
 D = M
 @x
 M = D
@modulO
0;JMP
(RETADD)
@n2
M = D
@temp
D = M
@n1
M = D
@n2
D = M
@ENDWHILE
D ; JEQ
@WHILE
0 ; JMP
(ENDWHILE)
@n1
D = M
@gcdRetAdd
A = M
0;JMP

