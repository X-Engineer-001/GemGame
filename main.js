var FPS=60;
var flag=0;
var canvas=document.getElementById("gamecanvas");
var ctx=canvas.getContext("2d");
var bg=document.createElement("img");
bg.src="images/bg.png";
var cursor={
  x:0,
  y:0
};
var gems=[
  [[1,0,-1*cos(Math.PI/3),-1*sin(Math.PI/3),-1*cos(Math.PI/3),sin(Math.PI/3)]],
  [[1,0,-1*cos(Math.PI/3),-1*sin(Math.PI/3),-1*cos(Math.PI/3),sin(Math.PI/3)]],
  [[1,0,-1*cos(Math.PI/3),-1*sin(Math.PI/3),-1*cos(Math.PI/3),sin(Math.PI/3)]]
];
function AngleToCoordinate(angle,radius){
  if(angel==0){
    return {x:radius,y:0};
  }else if(angle<0.5*Math.PI){
    return {x:cos(angle)*radius,y:-1*sin(angle)*radius};
  }else if(angle==0.5*Math.PI){
    return {x:0,y:-1*radius};
  }else if(angle<1*Math.PI){
    return {x:-1*cos((1*Math.PI)-angle)*radius,y:-1*sin((1*Math.PI)-angle)*radius};
  }else if(angle==1*Math.PI){
    return {x:-1*radius,y:0};
  }else if(angle<1.5*Math.PI){
    return {x:-1*cos(angle-(1*Math.PI))*radius,y:sin(angle-(1*Math.PI))*radius};
  }else if(angle==1.5*Math.PI){
    return {x:0,y:radius};
  }else{
    return {x:cos((2*Math.PI)-angle)*radius,y:sin((2*Math.PI)-angle)*radius};
  }
}
function IsCollidedMovingPointToPointOrPointToSurface(x,y,targetx,targety,targetwidth,targetheight){
  if(x>=targetx&&
    x<=targetx+targetwidth&&
    y>=targety&&
    y<=targety+targetheight){
    return true;
  }else{
    return false;
  }
}
function IsCollidedMovingPointToSurfaceOrSurfaceToSurface(x,y,width,height,targetx,targety,targetwidth,targetheight){
  if(IsCollidedMovingPointToPointOrPointToSurface(x,y,targetx,targety,targetwidth,targetheight)||
    IsCollidedMovingPointToPointOrPointToSurface(x+width,y,targetx,targety,targetwidth,targetheight)||
    IsCollidedMovingPointToPointOrPointToSurface(x,y+height,targetx,targety,targetwidth,targetheight)||
    IsCollidedMovingPointToPointOrPointToSurface(x+width,y+height,targetx,targety,targetwidth,targetheight)||
    IsCollidedMovingPointToPointOrPointToSurface(targetx,targety,x,y,width,height)||
    IsCollidedMovingPointToPointOrPointToSurface(targetx+targetwidth,targety,x,y,width,height)||
    IsCollidedMovingPointToPointOrPointToSurface(targetx,targety+targetheight,x,y,width,height)||
    IsCollidedMovingPointToPointOrPointToSurface(targetx+targetwidth,targety+targetheight,x,y,width,height)
    ){
    return true;
  }else{
    return false;
  }
}
document.onmousemove=function(event){
  cursor.x=event.offsetX;
  cursor.y=event.offsetY;
};
document.onclick=function(){

};
function draw(){
  ctx.drawImage(bg,0,0,700,700);
  if(flag==0){
    
  }
}
setInterval(draw,1000/FPS)
