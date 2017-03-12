var FadeDurationMS=1000;
var slideCache = new Array();
var displaySecs = 5;

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
  var element=$$(id).first();
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
function FadeInImage(foregroundID,newImage,backgroundID,linkID,thumbsID, imageFiles, imageLinks)
{

  $$(thumbsID).first().childElements().each(function(s){
    s.removeClassName('currentThumb');
  });
  
  imageArray = new Array();
  imageArray = imageFiles;
  linkArray = new Array();
  linkArray = imageLinks;
  
  var foreground=$$(foregroundID).first();
  
  if (foreground.timer) window.clearTimeout(foreground.timer);
  if (backgroundID){
    var background=$$(backgroundID).first();
    var link=$$(linkID).first();
    if (background.timer){window.clearTimeout(background.timer);}
    
    if (background.src){
      foreground.src = background.src; 
      SetOpacity(foreground,100);
    }
    
    background.src = imageArray[newImage];
    background.style.backgroundImage = 'url(' + imageArray[newImage] + ')';
    background.style.backgroundRepeat = 'no-repeat';
    background.style.backgroundPosition = 'center';
    
    if(linkArray[newImage] == ''){
      link.style.display = 'none'
    }
    else{
    link.href = linkArray[newImage];
    link.style.display = ''
    }
    
    var currIndex = newImage;
    currIndex = (currIndex+1)%imageArray.length
    
    var startMS = (new Date()).getTime();
    foreground.timer = window.setTimeout("ChangeOpacity('" + foregroundID + "'," + FadeDurationMS + "," + startMS + ",100,0)",10);
    background.timer = window.setTimeout("FadeInImage('"+foregroundID+"',"+currIndex+",'"+backgroundID+"','"+linkID+"','"+thumbsID+"',"+ imageArray.inspect()+","+linkArray.inspect()+")", 5000);
    if ($('thums'))
      $('thumbs').childElements()[currIndex].addClassName('currentThumb');
  }
  else {
    foreground.src = newImage;
  }
}

function RunSlideShow(pictureID,backgroundID,linkID,thumbsID,imageFiles,imageLinks,index) {

  var background=$$(backgroundID).first();

  
  imageArray = new Array();
  imageArray = imageFiles;
  linkArray = new Array();
  linkArray = imageLinks;

  $$(thumbsID).first().childElements().each(function(s,index){
    s.observe('click', function(event){
      FadeInImage(pictureID,index,backgroundID,linkID,thumbsID, imageFiles, imageLinks);
      event.preventDefault();
    });
  });
  background.timer = window.setTimeout("FadeInImage('"+pictureID+"',"+(index+1)+",'"+backgroundID+"','"+linkID+"','"+thumbsID+"',"+ imageArray.inspect()+","+linkArray.inspect()+")",5000);
     
}