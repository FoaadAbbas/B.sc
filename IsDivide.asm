@R2
D=M
@arr
M=D
@R3
D=M
@len
M=D
@R4
D=M
@x
M=D

@RETURN_ADRESS_MAIN
D=A
@SUM_OF_DEVISORS_RETURN_ADRESS_MAIN
M=D
@SUM_OF_DEVISORS
0;JMP
(RETURN_ADRESS_MAIN)
@res
D=M
@R1
M=D
(END_PROGRAM)
@END_PROGRAM
0;JMP

(IS_DEVIDED)
// int powoftwo=2,i=1
@powoftwo
M=1
D=M+1
M=D
@i
M=1
//if x==0 goto ZERO
@x
D=M
@ZERO
D;JEQ
//(WHILE) (i<x)
(LOOP0)
@i
D=M
@x
D=D-M
// goto EXIT
@EXIT0//OUT
D;JGE
// powoftwo+=powoftwo
@powoftwo
D=M
M=M+D
// i++
@i
M=M+1
// goto LOOP
@LOOP0
0;JMP
(EXIT0)
//if num>0 goto LOOP1
@num
D=M
@LOOP1
D;JGT
//if num==0 goto ZERO
@num
D=M
@ZERO
D;JEQ
//if num<0,num=abs(num)
@num
M=-M
// (WHILE) (num>0)
(LOOP1)
@powoftwo
D=M
//num-=powoftwo
@num
M=M-D
D=M
//if num<=0 goto EXIT1
@EXIT1
D;JLE
// goto LOOP1
@LOOP1
0;JMP
(EXIT1)
// if (num!=0) goto ELSE
@num
D=M
@ELSE
D;JNE
//if num%2**x==0
//D=1
(ZERO)
D=1
// goto END_IS_DEVIDED
@END_IS_DEVIDED
0;JMP
(ELSE)
D=0
// goto END_IS_DEVIDED
@END_IS_DEVIDED
0;JMP
(END_IS_DEVIDED)
@SUM_OF_DEVISORS_RETURN_ADRESS
A=M
0;JMP

(SUM_OF_DEVISORS)
//int index=0,sum=0;
@sum//cursum
M=0
@index//infunc2
M=0
// WHILE (index<len)
(LOOP2)
@index
D=M
@len
D=D-M
//if index>len goto EXIT
@EXIT2
D;JGT
//num=arr[index]
//temp=arr[index]
@index
D=M    
@arr
A=M+D //arr[jindex]
D=M 
@num
M=D
@temp
M=D
//goto IS_DEVIDED(num,arr[index]);
@RETURN_ADRESS
D=A
@SUM_OF_DEVISORS_RETURN_ADRESS
M=D
@IS_DEVIDED
0;JMP
(RETURN_ADRESS)
//if (D!=0)goto D_NOT_ZERO
@flag1
M=D
@D_NOT_ZERO
D;JNE
//if (D==0)goto D_ZERO
@D_ZERO
0;JMP
(D_NOT_ZERO)
@temp
D=M
@sum
M=M+D //sum+=temp
@index
M=M+1 
@LOOP2 // goto WHILE
0;JMP
//if (D==0)
(D_ZERO)
@index
M=M+1 
@LOOP2 // goto WHILE
0;JMP 
(EXIT2)
@sum
D=M
@res
M=D // *res=sum
(END)
@SUM_OF_DEVISORS_RETURN_ADRESS_MAIN //return to main
A=M
0;JMP