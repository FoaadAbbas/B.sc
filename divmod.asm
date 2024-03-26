//divmod.asm
//initializing SP (address 0)
@SCREEN
D=A
@SP
M=D
//R1 = 100...Ram[1]=100
@100
D=A
@R1
M=D
//Ram[2].value = 3
@3
D=A
@R2
M=D
//push arguments of the function from right to left
//push(&R4) in place sp+1
@R4
D=A
@SP
M=M-1
A=M
M=D
//push(&R3) in place sp + 2
@R3
D=A
@SP
M=M-1
A=M
M=D
//push(R2) in place sp + 3
@R2
D=M
@SP
M=M-1
A=M
M=D
//push(R1) in place sp + 4
@R1
D=M
@SP
M=M-1
A=M
M=D
//push(&RESULT) in place sp
@RES
D=A
@SP
M=M-1
A=M
M=D
//goto DIVMOD
@DIVMOD
0;JMP
(RES)
//R5=RESULT
@R5
M=D
//Sp+=5
@5
D=A
@SP
M=D+M
//while(1);
(INFLOOP)
@INFLOOP
0;JMP


//function divmod
// int divmod(int x, int y, int *resptr, int *modptr)
// return value –
//    *resptr =  x /y , *modptr = x % y
//    D = (y!=0)
// address - DIVMOD
//stack:
//retAddress <-SP
//x          <-SP + 1
//y          <-SP + 2
//&resptr    <-SP + 3
//&modptr    <-SP + 4



(DIVMOD)
//function implementation.
//function is writen with BP for accessing variables and alocate local variables on the stack.
//we dont learn it, so dont do it your self.
//parameters and variable relative to BP
// RetAddress, x,     y,     resptr, modptr
// [BP+1]      [BP+2] [BP+3] [BP+4]  [BP+5]
// local variables 
// int sum, pw,    i,     j;     BP old
// [BP-4]   [BP-3] [BP-2] [BP-1] [BP]
//   SP--; Stack[SP] = BP;
@BP
D=M
@SP
M=M-1
A=M
M=D
// BP = SP
@SP
D=M
@BP
M=D
// SP = SP - 4
@4
D=A
@SP
M=M-D
// y == 0 ?
@3
D=A
@BP
A=M+D
D=M
@ELSE1
D;JNE
//@RetAddress
@SP
M=M+1
M=M+1
M=M+1
M=M+1
A=M
D=M
@BP
M=D
@SP
M=M+1
A=M
A=M
D=0
0;JMP
(ELSE1)
//   i = x;
@2
D=A
@BP
A=M+D
D=M
@BP
A=M-1
A=A-1
M=D
//  j = y;
@3
D=A
@BP
A=M+D
D=M
@BP
A=M-1
M=D
//  sum = 0;
@4
D=A
@BP
A=M-D
M=0
//   while(i >= y) {
(WHILE1)
//@i
@BP
A=M-1
A=A-1
D=M
// y
@BP
A=M+1
A=A+1
A=A+1
D=D-M
@ENDWHILE
D;JLT
//   j = 1; @j
@BP
A=M-1
M=1
//   pw = y; @y
@3
D=A
@BP
A=M+D
D=M
//@pw
@BP
A=M-1
A=A-1
A=A-1
M=D
//   while((pw*2) <= i) {
(WHILE2)
//@pw
@BP
A=M-1
A=A-1
A=A-1
D=M
D=D+M
//@i
@BP
A=M-1
A=A-1
D=D-M
@ENDWHILE2
D;JGT
//     pw *= 2; 
//     @pw
@BP
A=M-1
A=A-1
A=A-1
D=M
M=D+M
//    j *= 2;
@BP
A=M-1
D=M
M=D+M
 // } while
@WHILE2
0;JMP
(ENDWHILE2)
//   sum = sum + j; 
//   @j
@BP
A=M-1
D=M
//@sum
@BP
A=M-1
A=A-1
A=A-1
A=A-1
M=M+D
//  i = i - pw; 
//  @pw
@BP
A=M-1
A=A-1
A=A-1
D=M
//@i
@BP
A=M-1
A=A-1
M=M-D
// } // while
@WHILE1
0;JMP
(ENDWHILE)
//*resptr = sum; 
// @sum
@BP
A=M-1
A=A-1
A=A-1
A=A-1
D=M
//@resptr
@BP
A=M+1
A=A+1
A=A+1
A=A+1
A=M
M=D
//*modptr = i; 
// @i
@2
D=A
@BP
A=M-D
D=M
//@modptr
@BP
A=M+1
A=A+1
A=A+1
A=A+1
A=A+1
A=M
M=D
//return 1;
@SP
M=M+1
M=M+1
M=M+1
M=M+1
A=M
D=M
@BP
M=D
@SP
M=M+1
A=M
A=M
D=1	
//@RetAddress
0;JMP