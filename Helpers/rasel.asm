//int ResultPow=1
@1
D=A
@ResultPow
M=D
A8%JHfJ7p@G+yBz
//if (x==0):  ResultPow=1 & D=1
@x
D=M
D;JEQ  //x==0?
@1
D=A
@ResultPow
M=D
@EQUAL_ZERO //D=1
0;JMP

//if (x>0):
@x
D=M
D;JGT //x>0?
@LOOP //goto LOOP
0;JMP

//calculate the value of 2^x while x>0
(LOOP)
  @0
  D=A
  @i
  M=D //i=0 
  @x
  D=M
  @i
  D=M-D //D=i-x
  D;JGE // i-x>=0
  @LOOP_CALC  //goto LOOP_CALC
  D;JLT // i-x<0 ?
  @2
  D=A
  @ResultPow
  D=M
  @ResultPow
  D=M+D
  @i
  M=M+1 //i++
  @LOOP //goto LOOP
  0;JMP

//calculate the value of num%2^x
(LOOP_CALC)
  @ResultPow
  D=A
  @num
  D=M-D //D=num-ResultPow
  //D=M
  D;JLT //num<0?
  @NOT_EQUAL //goto NOT_EQUAL
  D;JEQ  //num=0?
  @EQUAL_ZERO //goto EQUAL_ZERO
  @num
  M=D // num=num-ResultPow
  @LOOP_CALC //goto LOOP_CALC
  0;JMP

//if num%2^x==1
(NOT_EQUAL)
  @0
  D=A
  @END
//if num%2^x==0
(EQUAL_ZERO)
  @1
  D=A
  @END
 
(END)
  0;JMP