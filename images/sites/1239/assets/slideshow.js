var FadeDurationMS=1000;
var slideCache = new Array(), imageArray = new Array(), currIndex = 0, displaySecs, maxLength;

function SetOpacity(object,opacityPct)
{
  // IE.
  object.style.filter = 'alpha(opacity=' + opacityPct + ')';
  // Old mozilla and firefox
  object.style.MozOpacity = opacityPct/100;
  // Everything else.
  object.style.opacity = opacityPct/100;
}
function ChangeOpacity(id,msDuration,msStart,fromO,toO)
{
  var element=document.getElementById(id);
  var msNow = (new Date()).getTime();
  var opacity = fromO + (toO - fromO) * (msNow - msStart) / msDuration;
  if (opacity>=100)
  {
    SetOpacity(element,100);
    element.timer = undefined;
  }
  else if (opacity<=0)
  {
    SetOpacity(element,0);
    element.timer = undefined;
  }
  else 
  {
    SetOpacity(element,opacity);
    element.timer = window.setTimeout("ChangeOpacity('" + id + "'," + msDuration + "," + msStart + "," + fromO + "," + toO + ")",10);
  }
}
function FadeInImage(foregroundID,newImage,backgroundID)
{
  $$('#thumbs .currentThumb').each(function(s){
    s.removeClassName('currentThumb');
  });
  var foreground=document.getElementById(foregroundID);
  if (foreground.timer) window.clearTimeout(foreground.timer);
  if (backgroundID)
  {
    var background=document.getElementById(backgroundID);
    if (background)
    if (background.timer) window.clearTimeout(background.timer);
    {
      if (background.src)
      {
        foreground.src = background.src; 
        SetOpacity(foreground,100);
      }
      background.src = imageArray[newImage];
      background.style.backgroundImage = 'url(' + imageArray[newImage] + ')';
      background.style.backgroundRepeat = 'no-repeat';
      background.style.backgroundPosition = 'center';
      // background.style.backgroundSize = '410px 290px';
      
      currIndex = newImage;
      var startMS = (new Date()).getTime();
      foreground.timer = window.setTimeout("ChangeOpacity('" + foregroundID + "'," + FadeDurationMS + "," + startMS + ",100,0)",10);
      
      background.timer = window.setTimeout("FadeInImage('"+foregroundID+"',"+(currIndex+1)%maxLength+",'"+backgroundID+"')",displaySecs*1000);
      $('thumbs').childElements()[currIndex].addClassName('currentThumb');
    }
  } else {
    foreground.src = newImage;
  }
}

function RunSlideShow(pictureID,backgroundID,imageFiles,timerSecs) {
  for (i=0; i<imageFiles.length; i++) {
    slideCache[i] = new Image;
    slideCache[i].src = imageFiles[i];
  }
  imageArray = imageFiles;
  maxLength = imageFiles.length;
  
  displaySecs = timerSecs;
  
  var background=document.getElementById(backgroundID);
  
  $('thumbs').childElements().each(function(s,index){
    s.observe('click', function(event){
      FadeInImage(pictureID,index,backgroundID);
      event.preventDefault();
    });
  });
  
  background.timer = window.setTimeout("FadeInImage('"+pictureID+"',"+(currIndex+1)+",'"+backgroundID+"')",displaySecs*1000);
  
}