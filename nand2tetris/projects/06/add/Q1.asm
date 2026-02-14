@R2
D = M
@R1
M = M - D
@ELSE
D ; JLE
@R0
M = D
(ELSE)
@R0
M = D + M
@END
0;JMP