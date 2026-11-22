// Tiny stack VM for make.fun's tiny-stack-vm-01 ISA v1.
//
// A fresh, compact implementation written from ISA.md: 32-bit wrapping
// integers, a 256-value data stack, a 64-deep call stack, 256 words of
// memory, input/output, and traps 2-11 with their own exit codes.
// Runs every /input/<id>/program.bin on its input.bin and writes
// /output/<id>/stdout.bin + exit.txt. Plain JavaScript, Node 22.
import{mkdirSync,readFileSync,readdirSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of readdirSync(I).sort()){
const P=readFileSync(join(I,d,'program.bin')),B=readFileSync(join(I,d,'input.bin')),n=P.length;
const S=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
let s=0,c=0,pc=0,st=0,ip=0,ol=0,e=0,t,a,b,r,v,w;
L:for(;;){
if(st===1e6){e=10;break}
if(pc<0||pc>=n){e=9;break}
const q=P[pc],im=q===1?1:q===2?4:q>=48&&q<=51?2:0,bin=(q>=16&&q<=22)||(q>=24&&q<=26)||(q>=28&&q<=30)||(q>=32&&q<=34);
if(!(q<8||(q>=16&&q<=34&&q!==31)||(q>=48&&q<=52)||q===64||q===65||(q>=80&&q<=83))){e=5;break}
if(pc+im>=n){e=9;break}
st++;
const nx=pc+1+im;pc=nx;
const po=q===7?3:bin||q===5||q===6||q===65?2:(q===3||q===4||q===23||q===27||q===49||q===50||q===64||q===80||q===81||q===83)?1:0;
const pu=q===4?2:q===6||q===7?3:(q===1||q===2||q===82||bin||q===64||q===23||q===27)?1:0;
if(s<po){e=2;break}
if(s-po+pu>256){e=3;break}
switch(q){
case 0:break L;
case 1:S[s++]=(P[nx-1]<<24)>>24;break;
case 2:S[s++]=P[nx-4]|P[nx-3]<<8|P[nx-2]<<16|P[nx-1]<<24;break;
case 3:s--;break;
case 4:S[s]=S[s-1];s++;break;
case 5:t=S[s-1];S[s-1]=S[s-2];S[s-2]=t;break;
case 6:S[s]=S[s-2];s++;break;
case 7:a=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=a;break;
case 23:S[s-1]=-S[s-1]|0;break;
case 27:S[s-1]=~S[s-1];break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:
b=S[s-1];a=S[s-2];
switch(q){
case 16:r=(a+b)|0;break;
case 17:r=(a-b)|0;break;
case 18:r=Math.imul(a,b);break;
case 19:if(!b){e=4;break L}r=a===-2147483648&&b===-1?a:(a/b)|0;break;
case 20:if(!b){e=4;break L}r=b===-1?0:a%b|0;break;
case 21:if(!b){e=4;break L}r=Math.floor((a>>>0)/(b>>>0))|0;break;
case 22:if(!b){e=4;break L}r=(a>>>0)%(b>>>0)|0;break;
case 24:r=a&b;break;
case 25:r=a|b;break;
case 26:r=a^b;break;
case 28:r=a<<(b&31);break;
case 29:r=a>>(b&31);break;
case 30:r=(a>>>(b&31))|0;break;
case 32:r=a===b?1:0;break;
case 33:r=a<b?1:0;break;
case 34:r=(a>>>0)<(b>>>0)?1:0;break;
}
S[s-2]=r;s--;break;
case 48:pc=nx+((P[nx-2]|P[nx-1]<<8)<<16>>16);break;
case 49:v=S[--s];if(!v)pc=nx+((P[nx-2]|P[nx-1]<<8)<<16>>16);break;
case 50:v=S[--s];if(v)pc=nx+((P[nx-2]|P[nx-1]<<8)<<16>>16);break;
case 51:if(c===64){e=7;break L}C[c++]=nx;pc=P[nx-2]|P[nx-1]<<8;break;
case 52:if(!c){e=8;break L}pc=C[--c];break;
case 64:a=S[s-1];if(a<0||a>255){e=6;break L}S[s-1]=M[a];break;
case 65:a=S[s-1];if(a<0||a>255){e=6;break L}M[a]=S[s-2];s-=2;break;
case 80:v=S[s-1];w=String(v);if(ol+w.length>65536){e=11;break L}for(let i=0;i<w.length;i++)o[ol++]=w.charCodeAt(i);s--;break;
case 81:if(ol>65535){e=11;break L}o[ol++]=S[--s]&255;break;
case 82:S[s++]=ip<B.length?B[ip++]:-1;break;
case 83:e=S[--s]&255;break L;
}
}
mkdirSync(join(O,d),{recursive:true});
writeFileSync(join(O,d,'stdout.bin'),o.subarray(0,ol));
writeFileSync(join(O,d,'exit.txt'),e+'\n');
}
