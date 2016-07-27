var FPS=60;
var flag=0;//flag
var editflag=0;
var canvas=document.getElementById("gamecanvas");//canvas
var ctx=canvas.getContext("2d");
var bg=document.createElement("img");//images
bg.src="images/bg.png";
var sell=document.createElement("img");
sell.src="images/sell.png";
var equip=document.createElement("img");
equip.src="images/equip.png";
var unequip=document.createElement("img");
unequip.src="images/unequip.png";
var fight=document.createElement("img");
fight.src="images/fight.png";
var cursor={//all
  x:0,
  y:0
};
var editingbladepoint={};//edit
var money=0;
var artifact=[0,0,0];//+1BladePoint&BoostAllBasicGemsEffectBy10%,+1BladeCount&BoostAllAdvancedGemsEffectBy10%,+1Blade&BoostAllGemsEffectBy10%
var enemyartifact=[0,0,0];
var gems=[0,0,0,0,0,0,0,0,0];//Attack(2),CriticalChance(3),CriticalDamage(0.1),Health(30),Defence(3),HealthRegenerate(Health/30),MovingDistance(20),MovingCoolDown(3),Dodge(3)
var equipedgems=[0,0,0,0,0,0,0,0,0];
var gemequiplimit=7
var blade=[2,[-200,-200,0,-340,200,-200]];//BladeCount,[BladeX,BladeY,BladeX,BladeY...](Blade1),[BladeX,BladeY,BladeX,BladeY...](Blade2)...
var enemyequipedgems=[0,0,0,0,0,0,0,0,0];//fight
var enemyblade=[];
var player={};
var enemy={};
var uisorce=['','CRITICAL','regenerate','dodge'];
var uiclock=[];//[x,y,event(uisorce),value,clock]
function DrawAttack(x,y,width,height){
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
  if(x==0&&y<=0){
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
function CoordinateToAngleRightClockwise(x,y){
  if(x==0&&y<0){
    return (1.5*Math.PI);
  }else if(x>0&&y<0){
    return (2*Math.PI)-Math.acos(x/GetDistance(0,0,x,y));
  }else if(x>=0&&y==0){
    return 0;
  }else if(x>0&&y>0){
    return Math.acos(x/GetDistance(0,0,x,y));
  }else if(x==0&&y>0){
    return (0.5*Math.PI);
  }else if(x<0&&y>0){
    return Math.PI-Math.acos(-1*x/GetDistance(0,0,x,y));
  }else if(x<0&&y==0){
    return Math.PI;
  }else{
    return Math.PI+Math.acos(-1*x/GetDistance(0,0,x,y));
  }
}
function AngleToCoordinateRightCounterclockwise(angle,radius){
  if(angle==0){
    return {x:radius,y:0};
  }else if(angle<0.5*Math.PI){
    return {x:Math.cos(angle)*radius,y:-1*Math.sin(angle)*radius};
  }else if(angle==0.5*Math.PI){
    return {x:0,y:-1*radius};
  }else if(angle<Math.PI){
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
function AngleToCoordinateRightclockwise(angle,radius){
  if(angle==0){
    return {x:radius,y:0};
  }else if(angle<0.5*Math.PI){
    return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius};
  }else if(angle==0.5*Math.PI){
    return {x:0,y:radius};
  }else if(angle<Math.PI){
    return {x:-1*Math.cos(Math.PI-angle)*radius,y:Math.sin(Math.PI-angle)*radius};
  }else if(angle==Math.PI){
    return {x:-1*radius,y:0};
  }else if(angle<1.5*Math.PI){
    return {x:-1*Math.cos(angle-Math.PI)*radius,y:-1*Math.sin(angle-Math.PI)*radius};
  }else if(angle==1.5*Math.PI){
    return {x:0,y:-1*radius};
  }else{
    return {x:Math.cos((2*Math.PI)-angle)*radius,y:-1*Math.sin((2*Math.PI)-angle)*radius};
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
  }
  return false;
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
function IsCollidedPointToIrregularSurface(pointarray,targetx,targety){//pointarray:[pointx,pointy,pointx,pointy...]
  var array=[];
  if((pointarray[pointarray.length-2]>=targetx&&pointarray[0]<=targetx)||(pointarray[0]>=targetx&&pointarray[pointarray.length-2]<=targetx)){
    var unitvector=GetUnitVector(pointarray[pointarray.length-2],pointarray[pointarray.length-1],pointarray[0],pointarray[1]);
    array.push(pointarray[pointarray.length-1]+unitvector.y*(targetx-pointarray[pointarray.length-2])/unitvector.x);
  }
  for(var i=0;i<pointarray.length/2-1;i++){
    if((pointarray[i*2]>=targetx&&pointarray[i*2+2]<=targetx)||(pointarray[i*2+2]>=targetx&&pointarray[i*2]<=targetx)){
      var unitvector=GetUnitVector(pointarray[i*2],pointarray[i*2+1],pointarray[i*2+2],pointarray[i*2+3]);
      array.push(pointarray[i*2+1]+unitvector.y*(targetx-pointarray[i*2])/unitvector.x);
    }
  }
  array.sort(function(a,b){return a-b;});
  for(var i=0;i<array.length/2;i++){
    if(array[i*2]<=targety&&array[i*2+1]>=targety){
      return true;
    }
  }
  return false;
}
function GetAbsoluteValue(value){
  if(value>=0){
    return value;
  }
  if(value<0){
    return (-1*value);
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
function GetVerticalDistanceAndLeftOrRight(srcx,srcy,unitvectorx,unitvectory,targetx,targety){//left:-1,Right:1,Center:0
  var verticaldistancevalue=GetAbsoluteValue((unitvectory*srcx-unitvectorx*srcy-unitvectory*targetx+unitvectorx*targety)/(Math.pow(unitvectorx,2)+Math.pow(unitvectory,2)));
  var leftorrightvalue;
  if(verticaldistancevalue<=0.0000000001){
    verticaldistancevalue=0;
    leftorrightvalue=0;
  }else if(unitvectorx==1){
    leftorrightvalue=(targety-srcy)/GetAbsoluteValue(targety-srcy);
  }else if(unitvectory==1){
    leftorrightvalue=(srcx-targetx)/GetAbsoluteValue(srcx-targetx);
  }else if(unitvectorx==-1){
    leftorrightvalue=(srcy-targety)/GetAbsoluteValue(srcy-targety);
  }else if(unitvectory==-1){
    leftorrightvalue=(targetx-srcx)/GetAbsoluteValue(targetx-srcx);
  }else if(unitvectorx>0){
    leftorrightvalue=(targety-srcy-unitvectory*(targetx-srcx)/unitvectorx)/GetAbsoluteValue(targety-srcy-unitvectory*(targetx-srcx)/unitvectorx);
  }else{
    leftorrightvalue=(unitvectory*(targetx-srcx)/unitvectorx-targety+srcy)/GetAbsoluteValue(unitvectory*(targetx-srcx)/unitvectorx-targety+srcy);
  }
  return {verticaldistance:verticaldistancevalue,leftorright:leftorrightvalue};
}
function GetNodeUnitVectorToCircle(srcx,srcy,unitvectorx,unitvectory,centerx,centery,radius){
  var a=Math.pow(unitvectorx,2)+Math.pow(unitvectory,2);
  var b=(srcx-centerx)*unitvectorx*2+(srcy-centery)*unitvectory*2;
  var c=Math.pow(srcx-centerx,2)+Math.pow(srcy-centery,2)-Math.pow(radius,2);
  var discriminant=Math.pow(b,2)-4*a*c;
  var z1=(-1*b+Math.sqrt(discriminant))/a/2;
  var z2=(-1*b-Math.sqrt(discriminant))/a/2;
  if(discriminant<0){
    return false;
  }else{
    return {x1:srcx+(unitvectorx*z1),y1:srcy+(unitvectory*z1),x2:srcx+(unitvectorx*z2),y2:srcy+(unitvectory*z2)};
  }
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
    }else if(editflag==2&&IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,700,100,50,450)&&equipedgems[0]+equipedgems[1]+equipedgems[2]+equipedgems[3]+equipedgems[4]+equipedgems[5]+equipedgems[6]+equipedgems[7]+equipedgems[8]<gemequiplimit){
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
    }else if(editflag==0&&IsCollidedMovingPointToPointOrPointToSurface(cursor.x,cursor.y,0,650,50,50)){
      enemyequipedgems=[0,0,0,0,0,0,0,0,0];
      enemyartifact=[0,0,0];
      enemyblade=[];
      for(var i=0;i<equipedgems[0]+equipedgems[1]+equipedgems[2]+equipedgems[3]+equipedgems[4]+equipedgems[5]+equipedgems[6]+equipedgems[7]+equipedgems[8];i++){
        var gemequip=Random(8,0);
        enemyequipedgems[gemequip]=enemyequipedgems[gemequip]+1;
      }
      for(var i=0;i<artifact[0]+artifact[1]+artifact[2];i++){
        var artifactequip=Random(2,0);
        enemyartifact[artifactequip]=enemyartifact[artifactequip]+1;
      }
      enemyblade.push(enemyartifact[1]+2);
      for(var i=0;i<enemyartifact[2]+1;i++){//Blade
        var thissrcx;
        var thissrcy;
        var thistargetx;
        var thistargety;
        var creatingblade=[];
        for(var j=0;j<enemyartifact[0]+3;j++){//BladePoint
          var point=AngleToCoordinateTopClockwise(Random(359,0)*2*Math.PI/360,Random(350,200));
          if(j>=2){
            thissrcx=creatingblade[creatingblade.length-4];
            thissrcy=creatingblade[creatingblade.length-3];
            thistargetx=creatingblade[0];
            thistargety=creatingblade[1];
            var width=6000/GetDistance(thissrcx,thissrcy,thistargetx,thistargety)
            if(width<20){
              width=20;
            }
            var unitvector=GetUnitVector(thissrcx,thissrcy,thistargetx,thistargety);
            for(var k=0;k<10;k++){
              if(GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,point.x,point.y).verticaldistance<width){
                point=AngleToCoordinateTopClockwise(Random(359,0)*2*Math.PI/360,Random(350,200));
              }
            }
          }
          creatingblade.push(point.x);
          creatingblade.push(point.y);
        }
        enemyblade.push(creatingblade);
      }
      player={x:600,y:600,cooldownclock:0,Attack:equipedgems[0]*2*(10+artifact[0]+artifact[2])/10,CriticalChance:Math.floor(equipedgems[1]*3*(10+artifact[1]+artifact[2])/10),CriticalDamage:equipedgems[2]*0.1*(10+artifact[1]+artifact[2])/10,Health:equipedgems[3]*30*(10+artifact[0]+artifact[2])/10,Defence:Math.floor(equipedgems[4]*3*(10+artifact[1]+artifact[2])/10),HealthRegenerate:equipedgems[3]*equipedgems[5]/(equipedgems[5]+100)*(10+artifact[1]+artifact[2])/10,MovingDistance:equipedgems[6]*20*(10+artifact[0]+artifact[2])/10,MovingCoolDown:Math.floor(FPS*200/(equipedgems[7]*3+100)*(10+artifact[1]+artifact[2])/10),Dodge:Math.floor(equipedgems[8]*3*(10+artifact[1]+artifact[2])/10)};
      enemy={x:100,y:100,cooldownclock:0,Attack:enemyequipedgems[0]*2*(10+enemyartifact[0]+enemyartifact[2])/10,CriticalChance:Math.floor(enemyequipedgems[1]*3*(10+enemyartifact[1]+enemyartifact[2])/10),CriticalDamage:enemyequipedgems[2]*0.1*(10+enemyartifact[1]+enemyartifact[2])/10,Health:enemyequipedgems[3]*30*(10+enemyartifact[0]+enemyartifact[2])/10,Defence:Math.floor(enemyequipedgems[4]*3*(10+enemyartifact[1]+enemyartifact[2])/10),HealthRegenerate:enemyequipedgems[3]*enemyequipedgems[5]/(enemyequipedgems[5]+100)*(10+enemyartifact[1]+enemyartifact[2])/10,MovingDistance:enemyequipedgems[6]*20*(10+enemyartifact[0]+enemyartifact[2])/10,MovingCoolDown:Math.floor(FPS*200/(enemyequipedgems[7]*3+100)*(10+enemyartifact[1]+enemyartifact[2])/10),Dodge:Math.floor(enemyequipedgems[8]*3*(10+enemyartifact[1]+enemyartifact[2])/10)};
      flag=2;
    }else{
      editflag=0;
    }
  }
};
function DrawBlade(x,y,scaling,array,spin){//blade:[2,[-50,-50,0,-300,50,-50]]
  if(!spin){
    ctx.fillStyle="rgb(150,150,150)";
    for(var i=0;i<array.length-1;i++){//Blade
      var thisblade=array[i+1];
      for(var j=0;j<array[0];j++){//BladeCount
        if(j==0){//DrawBlade
          ctx.beginPath();
          for(var k=0;k<array[i+1].length/2;k++){
            if(k==0){
              ctx.moveTo((x+thisblade[0])*scaling,(y+thisblade[1])*scaling);
            }else{
              ctx.lineTo((x+thisblade[k*2])*scaling,(y+thisblade[k*2+1])*scaling);
            }
          }
          ctx.fill();
        }else{
          ctx.beginPath();
          for(var k=0;k<array[i+1].length/2;k++){//x:350-70.71067811865476y:3501.25607396694702e-13,(*2)x:350-70.71067811865476y:3501.25607396694702e-13
            if(k==0){
              ctx.moveTo((x+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/array[0])%(Math.PI*2),GetDistance(0,0,thisblade[0],thisblade[1])).x)*scaling,(y+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[0],thisblade[1])+Math.PI*2*j/array[0])%(Math.PI*2),GetDistance(0,0,thisblade[0],thisblade[1])).y)*scaling);
            }else{
              ctx.lineTo((x+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/array[0])%(Math.PI*2),GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).x)*scaling,(y+AngleToCoordinateTopClockwise((CoordinateToAngleTopClockwise(thisblade[k*2],thisblade[k*2+1])+Math.PI*2*j/array[0])%(Math.PI*2),GetDistance(0,0,thisblade[k*2],thisblade[k*2+1])).y)*scaling);
            }
          }
          ctx.fill();
        }
      }
    }//
  }else{
    ctx.fillStyle="rgba(150,150,150,0.5)";
    for(var i=0;i<array.length-1;i++){//Blade
      var thisblade=array[i+1];//DrawBlade
      var outerradius=GetDistance(thisblade[0],thisblade[1],0,0);
      var innerradius=GetDistance(thisblade[0],thisblade[1],0,0);
      innerradius=Math.min(GetVerticalDistanceAndLeftOrRight(thisblade[0],thisblade[1],GetUnitVector(thisblade[0],thisblade[1],thisblade[thisblade.length-2],thisblade[thisblade.length-1]).x,GetUnitVector(thisblade[0],thisblade[1],thisblade[thisblade.length-2],thisblade[thisblade.length-1]).y,0,0).verticaldistance,innerradius);
      for(var j=0;j<thisblade.length/2-1;j++){
        outerradius=Math.max(GetDistance(thisblade[j*2+2],thisblade[j*2+3],0,0),outerradius);
        innerradius=Math.min(GetDistance(thisblade[j*2+2],thisblade[j*2+3],0,0),innerradius);
        innerradius=Math.min(GetVerticalDistanceAndLeftOrRight(thisblade[j*2+2],thisblade[j*2+3],GetUnitVector(thisblade[j*2+2],thisblade[j*2+3],thisblade[j*2],thisblade[j*2+1]).x,GetUnitVector(thisblade[j*2+2],thisblade[j*2+3],thisblade[j*2],thisblade[j*2+1]).y,0,0).verticaldistance,innerradius);
      }
      ctx.beginPath();
      ctx.arc(x,y,outerradius*scaling,0,Math.PI*2,false);
      // var recordflag=true;
      // if()
      // for(i=0,i<){
      //
      // }
      if(!IsCollidedPointToIrregularSurface(thisblade,0,0)){
        ctx.arc(x,y,innerradius*scaling,Math.PI*2,0,true);
      }
      ctx.closePath();
      ctx.fill();
    }//
  }
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
  ctx.fillText("／",x-font/4,y+font);
}
function DrawCore(x,y,scaling,array){
  ctx.strokeStyle="rgb(0,0,0)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(x,y,150*scaling,0,Math.PI*2,false);
  ctx.stroke();
  var height0=array[0]*200*scaling/gemequiplimit;
  var height1=array[1]*200*scaling/gemequiplimit;
  var height2=array[2]*200*scaling/gemequiplimit;
  var height3=array[3]*200*scaling/gemequiplimit;
  var height4=array[4]*200*scaling/gemequiplimit;
  var height5=array[5]*200*scaling/gemequiplimit;
  var height6=array[6]*200*scaling/gemequiplimit;
  var height7=array[7]*200*scaling/gemequiplimit;
  var height8=array[8]*200*scaling/gemequiplimit;
  DrawAttack(x-100*scaling,y-100*scaling,200*scaling,height0);
  DrawCriticalChance(x-100*scaling,y-100*scaling+height0,200*scaling,height1);
  DrawCriticalDamage(x-100*scaling,y-100*scaling+height0+height1,200*scaling,height2);
  DrawHealth(x-100*scaling,y-100*scaling+height0+height1+height2,200*scaling,height3);
  DrawDefence(x-100*scaling,y-100*scaling+height0+height1+height2+height3,200*scaling,height4);
  DrawHealthRegenerate(x-100*scaling,y-100*scaling+height0+height1+height2+height3+height4,200*scaling,height5);
  DrawMovingDistance(x-100*scaling,y-100*scaling+height0+height1+height2+height3+height4+height5,200*scaling,height6);
  DrawMovingCoolDown(x-100*scaling,y-100*scaling+height0+height1+height2+height3+height4+height5+height6,200*scaling,height7);
  DrawDodge(x-100*scaling,y-100*scaling+height0+height1+height2+height3+height4+height5+height6+height7,200*scaling,height8);
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
  }else if(flag==1){
    if(editflag==4){
      ctx.fillStyle="rgba(255,0,0,0.3)";
      ctx.fillRect(0,0,700,700);
      ctx.fillStyle="rgb(255,255,255)";
      ctx.beginPath();
      ctx.arc(350,350,350,0,Math.PI*2,false);
      ctx.fill();
      var thisblade=blade[editingbladepoint.blade];
      var thissrcx;
      var thissrcy;
      var thistargetx;
      var thistargety;
      if(editingbladepoint.x==0){
        thissrcx=thisblade[thisblade.length-2];
        thissrcy=thisblade[thisblade.length-1];
        thistargetx=thisblade[2];
        thistargety=thisblade[3];
      }else if(editingbladepoint.x==thisblade.length-2){
        thissrcx=thisblade[thisblade.length-4];
        thissrcy=thisblade[thisblade.length-3];
        thistargetx=thisblade[0];
        thistargety=thisblade[1];
      }else{
        thissrcx=thisblade[editingbladepoint.x-2];
        thissrcy=thisblade[editingbladepoint.y-2];
        thistargetx=thisblade[editingbladepoint.x+2];
        thistargety=thisblade[editingbladepoint.y+2];
      }
      var width=6000/GetDistance(thissrcx,thissrcy,thistargetx,thistargety)
      if(width<20){
        width=20;
      }
      var unitvector=GetUnitVector(thissrcx,thissrcy,thistargetx,thistargety);
      var rightnode=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*-1*width+350,thissrcy+unitvector.x*width+350,unitvector.x,unitvector.y,350,350,350);
      var leftnode=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*width+350,thissrcy+unitvector.x*-1*width+350,unitvector.x,unitvector.y,350,350,350);
      ctx.fillStyle="rgba(255,0,0,0.3)";
      ctx.beginPath();
      if(!rightnode){
        ctx.arc(350,350,350,CoordinateToAngleRightClockwise(leftnode.x1-350,leftnode.y1-350),CoordinateToAngleRightClockwise(leftnode.x2-350,leftnode.y2-350),false);
      }else if(!leftnode){
        ctx.arc(350,350,350,CoordinateToAngleRightClockwise(rightnode.x2-350,rightnode.y2-350),CoordinateToAngleRightClockwise(rightnode.x1-350,rightnode.y1-350),false);
      }else{
        ctx.arc(350,350,350,CoordinateToAngleRightClockwise(leftnode.x1-350,leftnode.y1-350),CoordinateToAngleRightClockwise(rightnode.x1-350,rightnode.y1-350),false);
        ctx.lineTo(rightnode.x2,rightnode.y2);
        ctx.arc(350,350,350,CoordinateToAngleRightClockwise(rightnode.x2-350,rightnode.y2-350),CoordinateToAngleRightClockwise(leftnode.x2-350,leftnode.y2-350),false);
      }
      ctx.fill();
      ctx.fillStyle="rgb(255,255,255)";
      ctx.beginPath();
      ctx.arc(350,350,200,0,Math.PI*2,false);
      ctx.fill();
      ctx.fillStyle="rgba(255,0,0,0.3)";
      ctx.beginPath();
      ctx.arc(350,350,200,0,Math.PI*2,false);
      ctx.fill();
      var x=0;
      var y=0;
      var cursorunitvector=GetUnitVector(350,350,cursor.x,cursor.y);
      x=cursor.x-350;
      y=cursor.y-350;
      var leftorright=GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).leftorright;
      var frontorback;
      if(GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance<width){
        var record=x;
        x=x+unitvector.y*leftorright*(-1*width+GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance);
        y=y+unitvector.x*leftorright*(width-GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,record,y).verticaldistance);
        if(GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance==0){
          x=x+unitvector.y*-1*width;
          y=y+unitvector.x*width;
        }
        leftorright=GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).leftorright;
        // if(GetDistance(x,y,0,0)>350){
        //   if(!rightnode){
        //     if(frontorback<=0){
        //       x=leftnode.x1-350;
        //       y=leftnode.y1-350;
        //     }else{
        //       x=leftnode.x2-350;
        //       y=leftnode.y2-350;
        //     }
        //   }else if(!leftnode){
        //     if(frontorback<=0){
        //       x=rightnode.x1-350;
        //       y=rightnode.y1-350;
        //     }else{
        //       x=rightnode.x2-350;
        //       y=rightnode.y2-350;
        //     }
        //   }else if(leftorright>=0){
        //     if(frontorback<=0){
        //       x=rightnode.x1-350;
        //       y=rightnode.y1-350;
        //     }else{
        //       x=rightnode.x2-350;
        //       y=rightnode.y2-350;
        //     }
        //   }else{
        //     if(frontorback<=0){
        //       x=leftnode.x1-350;
        //       y=leftnode.y1-350;
        //     }else{
        //       x=leftnode.x2-350;
        //       y=leftnode.y2-350;
        //     }
        //   }
        // }else if(GetDistance(x,y,0,0)<200){
        //   if(leftorright>=0){
        //     var rightnode200=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*(-1)*width+350,thissrcy+unitvector.x*width+350,unitvector.x,unitvector.y,350,350,200);
        //     if(frontorback<=0){
        //       x=rightnode200.x1-350;
        //       y=rightnode200.y1-350;
        //     }else{
        //       x=rightnode200.x2-350;
        //       y=rightnode200.y2-350;
        //     }
        //   }else{
        //     var leftnode200=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*width+350,thissrcy+unitvector.x*(-1)*width+350,unitvector.x,unitvector.y,350,350,200);
        //     if(frontorback<=0){
        //       x=leftnode200.x1-350;
        //       y=leftnode200.y1-350;
        //     }else{
        //       x=leftnode200.x2-350;
        //       y=leftnode200.y2-350;
        //     }
        //   }
        // }
      }
      if(GetDistance(x,y,0,0)>350){
        var record=x;
        x=cursorunitvector.x*350;
        y=cursorunitvector.y*350;
        // console.log("1 x"+x+"y"+y);
        if(GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance<width){
          if(!rightnode){
            frontorback=GetVerticalDistanceAndLeftOrRight((leftnode.x1+leftnode.x2)/2-350,(leftnode.y1+leftnode.y2)/2-350,unitvector.y*(-1),unitvector.x,x,y).leftorright;
          }else{
            frontorback=GetVerticalDistanceAndLeftOrRight((rightnode.x1+rightnode.x2)/2-350,(rightnode.y1+rightnode.y2)/2-350,unitvector.y*(-1),unitvector.x,x,y).leftorright;
          }
          // console.log(frontorback);
          if(leftorright==-1){
            if(!leftnode){
              var record=x;
              x=x+unitvector.y*leftorright*(width+GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance);
              y=y+unitvector.x*leftorright*(-1*width-GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,record,y).verticaldistance);
            }else{
              if(frontorback<=0){
                x=leftnode.x1-350;
                y=leftnode.y1-350;
              }else{
                x=leftnode.x2-350;
                y=leftnode.y2-350;
              }
            }
          }else{
            if(!rightnode){
              var record=x;
              x=x+unitvector.y*leftorright*(width+GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance);
              y=y+unitvector.x*leftorright*(-1*width-GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,record,y).verticaldistance);
            }else{
              if(frontorback<=0){
                x=rightnode.x1-350;
                y=rightnode.y1-350;
              }else{
                x=rightnode.x2-350;
                y=rightnode.y2-350;
              }
            }
          }
        }
        // console.log("2 x"+x+"y"+y);
      }
      if(GetDistance(x,y,0,0)<200){
        var record=x;
        x=cursorunitvector.x*200;
        y=cursorunitvector.y*200;
        // console.log("3 x"+x+"y"+y);
        if(GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).verticaldistance<width){
          leftorright=GetVerticalDistanceAndLeftOrRight(thissrcx,thissrcy,unitvector.x,unitvector.y,x,y).leftorright;
          if(!rightnode){
            frontorback=GetVerticalDistanceAndLeftOrRight((leftnode.x1+leftnode.x2)/2-350,(leftnode.y1+leftnode.y2)/2-350,unitvector.y*(-1),unitvector.x,x,y).leftorright;
          }else{
            frontorback=GetVerticalDistanceAndLeftOrRight((rightnode.x1+rightnode.x2)/2-350,(rightnode.y1+rightnode.y2)/2-350,unitvector.y*(-1),unitvector.x,x,y).leftorright;
          }
          if(leftorright==-1){
            var leftnode200=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*width+350,thissrcy+unitvector.x*(-1)*width+350,unitvector.x,unitvector.y,350,350,200);
            if(frontorback<=0){
              x=leftnode200.x1-350;
              y=leftnode200.y1-350;
            }else{
              x=leftnode200.x2-350;
              y=leftnode200.y2-350;
            }
          }else{
            var rightnode200=GetNodeUnitVectorToCircle(thissrcx+unitvector.y*(-1)*width+350,thissrcy+unitvector.x*width+350,unitvector.x,unitvector.y,350,350,200);
            if(frontorback<=0){
              x=rightnode200.x1-350;
              y=rightnode200.y1-350;
            }else{
              x=rightnode200.x2-350;
              y=rightnode200.y2-350;
            }
          }
        }
        // console.log("4 x"+x+"y"+y);
      }
      thisblade[editingbladepoint.x]=x;
      thisblade[editingbladepoint.y]=y;
    }
    DrawBlade(350,350,1,blade,false);
    ctx.strokeStyle="rgb(200,200,200)";
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(350,350,350,0,Math.PI*2,false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(350,350,200,0,Math.PI*2,false);
    ctx.stroke();
    DrawCore(350,350,1,equipedgems)
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
    ctx.drawImage(fight,0,650,50,50);
    DrawBladePoint();
  }else if(flag==2){
    DrawBlade(player.x,player.y,0.1,blade,true);
    DrawBlade(enemy.x,enemy.y,0.1,enemyblade,true);
  }
}
setInterval(draw,1000/FPS);
