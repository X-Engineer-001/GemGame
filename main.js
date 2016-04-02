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
var character={
  x:0,
  y:0,
  skill:[{level:1,coordinate[0,-1]}],
  hp:100,
  point:10
};
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
function DrawCharacter(x,y){
  ctx.fillStyle="rgb(0,0,0)";
  ctx.fillRect(x,y,30,30);
}
function DrawHit(x,y,damage){
  if(damage>3825){
    ctx.fillStyle="rgb(255,0,0)";
  }else{
    ctx.fillStyle="rgb((damage-(damage%15))/15,0,0)";
  }
  ctx.fillRect(x,y,30,30);
}
function DrawSkill(x,y,damage){
  if(damage>3825){
    ctx.fillStyle="rgb(0,255,0)";
  }else{
    ctx.fillStyle="rgb(0,(damage-(damage%15))/15,0)";
  }
  ctx.fillRect(x,y,30,30);
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
