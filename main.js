var FPS=60;
var flag=0;
var editflag=0;
var canvas=document.getElementById("gamecanvas");
var ctx=canvas.getContext("2d");
var bg=document.createElement("img");
bg.src="images/bg.png";
var sell=document.createElement("img");
sell.src="images/sell.png";
var equip=document.createElement("img");
equip.src="images/equip.png";
var unequip=document.createElement("img");
unequip.src="images/unequip.png";
var cursor={
  x:0,
  y:0
};
var editingbladepoint={};
var money=0;
var artifact=[0,0,0];//+1BladePoint,+1Blade,BoostAllGemsEffectBy10%
var gems=[0,0,0,0,0,0,0,0,0];//Attack(2),CriticalChance(3),CriticalDamage(0.1),Health(30),Defence(3),HealthRegenerate(1),MovingDistance(50),MovingCoolDown(3),Dodge(3)
var equipedgems=[0,0,0,0,0,0,0,0,0];
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
function IsCollidedCursorToBladePoint(){
  for(var i=0;i<blade.length-1;i++){//Blade
    var thisblade=blade[i+1];
    for(var k=0;k<blade[i+1].length/2;k++){
      if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,345+thisblade[k*2],345+thisblade[k*2+1],10,10)){
        return {blade:i+1,x:k*2,y:k*2+1};
      }
    }
    return false
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
    }else if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,250,250,200,200)){
      gems=[2,0,0,6,2,2,2,0,0];
      flag=1;
    }else if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,475,250,200,200)){
      gems=[2,0,0,2,0,0,6,2,2];
      flag=1;
    }
  }else if(flag==1){
    if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,0,50,33)){
      if(editflag==1){
        editflag=0;
      }else{
        editflag=1;
      }
    }else if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,33,50,33)){
      if(editflag==2){
        editflag=0;
      }else{
        editflag=2;
      }
    }else if(IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,66,50,33)){
      if(editflag==3){
        editflag=0;
      }else{
        editflag=3;
      }
    }else if(editflag==1&&IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,100,50,450)){
      if(gems[(cursor.y-100-(cursor.y%50))/50]>0){
        gems[(cursor.y-100-(cursor.y%50))/50]=gems[(cursor.y-100-(cursor.y%50))/50]-1;
        money=money+1;
      }
    }else if(editflag==2&&IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,100,50,450)){
      if(gems[(cursor.y-100-(cursor.y%50))/50]>equipedgems[(cursor.y-100-(cursor.y%50))/50]){
        equipedgems[(cursor.y-100-(cursor.y%50))/50]=equipedgems[(cursor.y-100-(cursor.y%50))/50]+1;
      }
    }else if(editflag==3&&IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,100,50,450)){
      if(equipedgems[(cursor.y-100-(cursor.y%50))/50]>0){
        equipedgems[(cursor.y-100-(cursor.y%50))/50]=equipedgems[(cursor.y-100-(cursor.y%50))/50]-1;
      }
    }else if(IsCollidedCursorToBladePoint()!=false){
      if(editflag==4){
        editflag=0;
      }else{
        editingbladepoint=IsCollidedCursorToBladePoint();
        editflag=4;
      }
    }else{
      editflag=0;
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
        for(var k=0;k<blade[i+1].length/2;k++){//x:350-70.71067811865476y:3501.25607396694702e-13,(*2)x:350-70.71067811865476y:3501.25607396694702e-13
          if(k==0){
            ctx.moveTo(350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/blade[0])%(Math.PI*2),GetDistance(0,0,thisblade[0],thisblade[1])).x,350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/blade[0])%(Math.PI*2),GetDistance(0,0,thisblade[0],thisblade[1])).y);
          }else{
            ctx.lineTo(350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/blade[0])%(Math.PI*2),GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).x,350+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/blade[0])%(Math.PI*2),GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).y);
          }
        }
        ctx.fill();
      }
    }
  }//
}
function DrawBladePoint(){//blade:[2,[-50,-50,0,-300,50,-50]]
  ctx.fillStyle="rgb(150,150,150)";
  for(var i=0;i<blade.length-1;i++){//Blade
    var thisblade=blade[i+1];//DrawBladePoint
    ctx.beginPath();
    for(var k=0;k<blade[i+1].length/2;k++){
      ctx.fillStyle="rgb(0,0,0)";
      ctx.fillRect(345+thisblade[k*2],345+thisblade[k*2+1],10,10);
    }
    ctx.fill();
  }
}//
function WriteFraction(numerator,denominator,x,y,font,color){
  ctx.fillStyle=color;
  ctx.font=font/String(numerator).length/2+"px Arial";
  ctx.fillText(numerator,x,y+font/2);
  ctx.font=font/String(numerator).length/2+"px Arial";
  ctx.fillText(denominator,x+font/2,y+font);
  ctx.font=font+"px Arial";
  ctx.fillText("/",x,y+font);
}
function draw(){
  ctx.drawImage(bg,0,0,750,700);
  if(flag==0){
    ctx.fillStyle="rgb(255,0,0)";
    ctx.fillRect(25,250,200,200);
    ctx.fillStyle="rgb(0,255,0)";
    ctx.fillRect(250,250,200,200);
    ctx.fillStyle="rgb(0,0,255)";
    ctx.fillRect(475,250,200,200);
  }
  if(flag==1){
    if(editflag==4){
      var thisblade=blade[editingbladepoint.blade];
      if(GetDistance(cursor.x,cursor.y,350,350)>350){
        var unitVector=GetUnitVector(350,350,cursor.x,cursor.y);
        thisblade[editingbladepoint.x]=unitVector.x*350;
        thisblade[editingbladepoint.y]=unitVector.y*350;
      }else{
        thisblade[editingbladepoint.x]=cursor.x-350;
        thisblade[editingbladepoint.y]=cursor.y-350;
      }
    }
    DrawBlade();
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(350,350,50,0,Math.PI*2,true);
    ctx.stroke();
    ctx.strokeStyle="rgb(200,200,200)";
    ctx.beginPath();
    ctx.arc(350,350,350,0,Math.PI*2,true);
    ctx.stroke();
    var height0=equipedgems[0]*60/gemequiplimit;
    var height1=equipedgems[1]*60/gemequiplimit;
    var height2=equipedgems[2]*60/gemequiplimit;
    var height3=equipedgems[3]*60/gemequiplimit;
    var height4=equipedgems[4]*60/gemequiplimit;
    var height5=equipedgems[5]*60/gemequiplimit;
    var height6=equipedgems[6]*60/gemequiplimit;
    var height7=equipedgems[7]*60/gemequiplimit;
    var height8=equipedgems[8]*60/gemequiplimit;
    DrawAttack(320,320,60,height0);
    DrawCriticalChance(320,320+height0,60,height1);
    DrawCriticalDamage(320,320+height0+height1,60,height2);
    DrawHealth(320,320+height0+height1+height2,60,height3);
    DrawDefence(320,320+height0+height1+height2+height3,60,height4);
    DrawHealthRegenerate(320,320+height0+height1+height2+height3+height4,60,height5);
    DrawMovingDistance(320,320+height0+height1+height2+height3+height4+height5,60,height6);
    DrawMovingCoolDown(320,320+height0+height1+height2+height3+height4+height5+height6,60,height7);
    DrawDodge(320,320+height0+height1+height2+height3+height4+height5+height6+height7,60,height8);
    ctx.drawImage(sell,700,0,50,33);
    ctx.drawImage(equip,700,33,50,33);
    ctx.drawImage(unequip,700,66,50,33);
    DrawAttack(700,100,50,50);
    DrawCriticalChance(700,150,50,50);
    DrawCriticalDamage(700,200,50,50);
    DrawHealth(700,250,50,50);
    DrawDefence(700,300,50,50);
    DrawHealthRegenerate(700,350,50,50);
    DrawMovingDistance(700,400,50,50);
    DrawMovingCoolDown(700,450,50,50);
    DrawDodge(700,500,50,50);
    DrawArtifact1(700,550,50,50);
    DrawArtifact2(700,600,50,50);
    DrawArtifact3(700,650,50,50);
    ctx.font="50px Arial";
    ctx.fillStyle="rgb(150,150,150)";
    ctx.fillText("$"+money,0,50);
    WriteFraction(equipedgems[0],gems[0],700,100,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[1],gems[1],700,150,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[2],gems[2],700,200,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[3],gems[3],700,250,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[4],gems[4],700,300,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[5],gems[5],700,350,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[6],gems[6],700,400,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[7],gems[7],700,450,50,"rgb(255,255,255)");
    WriteFraction(equipedgems[8],gems[8],700,500,50,"rgb(255,255,255)");
    ctx.font="33px Arial";
    ctx.fillStyle="rgb(255,255,255)";
    ctx.fillText(artifact[0],700,600);
    ctx.fillText(artifact[1],700,650);
    ctx.fillText(artifact[2],700,700);
    if(editflag==1){
      ctx.strokeStyle="rgb(255,0,0)";
      ctx.lineWidth=5;
      ctx.strokeRect(705,5,40,23);
    }
    if(editflag==2){
      ctx.strokeStyle="rgb(0,0,0)";
      ctx.lineWidth=5;
      ctx.strokeRect(705,38,40,23);
    }
    if(editflag==3){
      ctx.strokeStyle="rgb(0,0,0)";
      ctx.lineWidth=5;
      ctx.strokeRect(705,71,40,23);
    }
    DrawBladePoint();
  }
}
setInterval(draw,1000/FPS)
