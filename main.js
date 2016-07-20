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
var gems=[];//Attack(2),CriticalChance(3),CriticalDamage(0.1),Health(30),Defence(3),HealthRegenerate(1),MovingDistance(50),MovingCoolDown(3),Dodge(3)
var equipedgems=[];
var gemequiplimit=7
var state=[];
var blade=[2,[-50,-50,0,-300,50,-50]];//BladeCount,[BladeX,BladeY,BladeX,BladeY...],[BladeX,BladeY,BladeX,BladeY...]...
function DrawAttack(x,y,width,height){//           (Blade1)                         (Blade2)                        ...
  ctx.fillStyle="rgb(255,100,100)";
  ctx.fillRect(x,y,width,height);
}
function DrawCriticalChance(x,y,width,height){
  ctx.fillStyle="rgb(255,0,0)";
  ctx.fillRect(x,y,width,height);
}
function DrawCriticalDamage(x,y,width,height){
  ctx.fillStyle="rgb(155,0,0)";
  ctx.fillRect(x,y,width,height);
}
function DrawHealth(x,y,width,height){
  ctx.fillStyle="rgb(100,255,100)";
  ctx.fillRect(x,y,width,height);
}
function DrawDefence(x,y,width,height){
  ctx.fillStyle="rgb(0,255,0)";
  ctx.fillRect(x,y,width,height);
}
function DrawHealthRegenerate(x,y,width,height){
  ctx.fillStyle="rgb(0,155,0)";
  ctx.fillRect(x,y,width,height);
}
function DrawMovingDistance(x,y,width,height){
  ctx.fillStyle="rgb(100,100,255)";
  ctx.fillRect(x,y,width,height);
}
function DrawMovingCoolDown(x,y,width,height){
  ctx.fillStyle="rgb(0,0,255)";
  ctx.fillRect(x,y,width,height);
}
function DrawDodge(x,y,width,height){
  ctx.fillStyle="rgb(0,0,155)";
  ctx.fillRect(x,y,width,height);
}
function DrawArtifact1(x,y,width,height){
  ctx.fillStyle="rgb(150,150,150)";
  ctx.fillRect(x,y,width,height);
}
function DrawArtifact2(x,y,width,height){
  ctx.fillStyle="rgb(75,75,75)";
  ctx.fillRect(x,y,width,height);
}
function DrawArtifact3(x,y,width,height){
  ctx.fillStyle="rgb(0,0,0)";
  ctx.fillRect(x,y,width,height);
}
function NewGem(){

}
function Random(max,min){
  var math=Math.floor((Math.random()*((max-min)+1))+min);
  while(math==(max+1)){
    math=Math.floor((Math.random()*((max-min)+1))+min);
  }
  return math;
}
function CoordinateToAngleTopClockwise(x,y){
  if(x==0&&y<0){
    return 0;
  }else if(x>0&&y<0){
    return (0.5*Math.PI)-Math.acos(x/GetDistance(0,0,x,y));
  }else if(x>0&&y==0){
    return (0.5*Math.PI);
  }else if(x>0&&y>0){
    return (0.5*Math.PI)+Math.acos(x/GetDistance(0,0,x,y));
  }else if(x==0&&y>0){
    return Math.PI;
  }else if(x<0&&y>0){
    return (1.5*Math.PI)-Math.acos(-1*x/GetDistance(0,0,x,y));
  }else if(x<0&&y==0){
    return (1.5*Math.PI);
  }else{
    return (1.5*Math.PI)+Math.acos(-1*x/GetDistance(0,0,x,y));
  }
}
function AngleToCoordinateRightCounterclockwise(angle,radius){
  if(angle==0){
    return {x:radius,y:0};
  }else if(angle<0.5*Math.PI){
    return {x:Math.cos(angle)*radius,y:-1*Math.sin(angle)*radius};
  }else if(angle==0.5*Math.PI){
    return {x:0,y:-1*radius};
  }else if(angle<1*Math.PI){
    return {x:-1*Math.cos(Math.PI-angle)*radius,y:-1*Math.sin(Math.PI-angle)*radius};
  }else if(angle==Math.PI){
    return {x:-1*radius,y:0};
  }else if(angle<1.5*Math.PI){
    return {x:-1*Math.cos(angle-Math.PI)*radius,y:Math.sin(angle-Math.PI)*radius};
  }else if(angle==1.5*Math.PI){
    return {x:0,y:radius};
  }else{
    return {x:Math.cos((2*Math.PI)-angle)*radius,y:Math.sin((2*Math.PI)-angle)*radius};
  }
}
function AngleToCoordinateTopClockwise(angle,radius){
  if(angle==0){
    return {x:0,y:-1*radius};
  }else if(angle<0.5*Math.PI){
    return {x:Math.cos((0.5*Math.PI)-angle)*radius,y:-1*Math.sin((0.5*Math.PI)-angle)*radius};
  }else if(angle==0.5*Math.PI){
    return {x:radius,y:0};
  }else if(angle<Math.PI){
    return {x:Math.cos(angle-(0.5*Math.PI))*radius,y:Math.sin(angle-(0.5*Math.PI))*radius};
  }else if(angle==Math.PI){
    return {x:0,y:radius};
  }else if(angle<1.5*Math.PI){
    return {x:-1*Math.cos((1.5*Math.PI)-angle)*radius,y:Math.sin((1.5*Math.PI)-angle)*radius};
  }else if(angle==1.5*Math.PI){
    return {x:-1*radius,y:0};
  }else{
    return {x:-1*Math.cos(angle-(1.5*Math.PI))*radius,y:-1*Math.sin(angle-(1.5*Math.PI))*radius};
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
function GetUnitVector(srcx,srcy,targetx,targety){
  return {
    x:(targetx-srcx)/Math.sqrt(Math.pow(targetx-srcx,2)+Math.pow(targety-srcy,2)),
    y:(targety-srcy)/Math.sqrt(Math.pow(targetx-srcx,2)+Math.pow(targety-srcy,2))
  };
}
function GetDistance(srcx,srcy,targetx,targety){
  return Math.sqrt(Math.pow(targetx-srcx,2)+Math.pow(targety-srcy,2));
}
document.onmousemove=function(event){
  cursor.x=event.offsetX;
  cursor.y=event.offsetY;
};
document.onclick=function(){
  if(flag==0){
    if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,25,250,200,200)){
      gems=[6,2,2,2,0,0,2,0,0];
      flag=1;
    }
    if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,250,250,200,200)){
      gems=[2,0,0,6,2,2,2,0,0];
      flag=1;
    }
    if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,475,250,200,200)){
      gems=[2,0,0,2,0,0,6,2,2];
      flag=1;
    }
  }
};
function DrawBlade(){//blade:[2,[-50,-50,0,-300,50,-50]]
  ctx.fillStyle="rgb(150,150,150)";
  for(var i=0;i<blade.length-1;i++){//Blade
    var thisblade=blade[i+1];
    for(var j=0;j<blade[0];j++){//BladeCount
      if(j==0){//DrawBlade
        ctx.beginPath();
        for(var k=0;k<blade[i+1].length/2;k++){
          if(k==0){
            ctx.moveTo(350+thisblade[0],350+thisblade[1]);
          }else{
            ctx.lineTo(350+thisblade[k*2],350+thisblade[k*2+1]);
          }
        }
        ctx.fill();
      }else{
        ctx.beginPath();
        for(var k=0;k<blade[i+1].length/2;k++){
          if(k==0){
            ctx.moveTo(350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/blade[0])%Math.PI*2,GetDistance(0,0,thisblade[0],thisblade[1])).x,350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/blade[0])%Math.PI*2,GetDistance(0,0,thisblade[0],thisblade[1])).y);
          }else{
            ctx.lineTo(350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/blade[0])%Math.PI*2,GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).x,350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/blade[0])%Math.PI*2,GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).y);
          }
        }
        ctx.fill();
      }
      console.log("x"+j);
    }
    console.log(i);
  }//
}
function draw(){
  ctx.drawImage(bg,0,0,700,750);
  if(flag==0){
    ctx.fillStyle="rgb(255,0,0)";
    ctx.fillRect(25,250,200,200);
    ctx.fillStyle="rgb(0,255,0)";
    ctx.fillRect(250,250,200,200);
    ctx.fillStyle="rgb(0,0,255)";
    ctx.fillRect(475,250,200,200);
  }
  if(flag==1){
    DrawBlade();
    ctx.strokeStyle="rgb(0,0,0)"
    ctx.lineWidth=2;
    ctx.arc(350,350,50,0,0,false);
    ctx.strokeStyle="rgb(200,200,200)"
    ctx.arc(350,350,350,0,0,false);
    var height0=equipedgems[0]*320/gemequiplimit;
    var height1=equipedgems[1]*320/gemequiplimit;
    var height2=equipedgems[2]*320/gemequiplimit;
    var height3=equipedgems[3]*320/gemequiplimit;
    var height4=equipedgems[4]*320/gemequiplimit;
    var height5=equipedgems[5]*320/gemequiplimit;
    var height6=equipedgems[6]*320/gemequiplimit;
    var height7=equipedgems[7]*320/gemequiplimit;
    var height8=equipedgems[8]*320/gemequiplimit;
    DrawAttack(320,320,60,height0);
    DrawCriticalChance(320,320+height0,60,height1);
    DrawCriticalDamage(320,320+height0+height1,60,height2);
    DrawHealth(320,320+height0+height1+height2,60,height3);
    DrawDefence(320,320+height0+height1+height2+height3,60,height4);
    DrawHealthRegenerate(320,320+height0+height1+height2+height3+height4,60,height5);
    DrawMovingDistance(320,320+height0+height1+height2+height3+height4+height5,60,height6);
    DrawMovingCoolDown(320,320+height0+height1+height2+height3+height4+height5+height6,60,height7);
    DrawDodge(320,320+height0+height1+height2+height3+height4+height5+height6+height7,60,height8);
  }
}
setInterval(draw,1000/FPS)
