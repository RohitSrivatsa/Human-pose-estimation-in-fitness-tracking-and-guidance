const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.style.display = "none";
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
var pi = Math.PI;

var status=0;
// var msg = new SpeechSynthesisUtterance('please stand back');
var label="";
var stat2=0




function find_distance(x,y)
{
      return (Math.sqrt((x[1]-y[1])**2+(x[0]-y[0])**2))*100;
}





/**function to calculate angle */
function calculate_angle(x,y,z)
{
  var a=x;
  var b=y;
  var c=z;
  
  var radians= 
    Math.atan2(c[1]-b[1],c[0]-b[0])-Math.atan2(a[1]-b[1],a[0]-b[0]);
  var angle= Math.abs(radians * (180/pi))
  if(angle>180)
  {
    angle=360-angle;
  }
  return angle;
}






function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.font = "15px serif"
  canvasCtx.fillStyle = "#0000FF";
  var landmarks = results.poseLandmarks;
  
  if(landmarks==null)
  { 
 
    document.getElementById("error").innerHTML ="Make yourself visible in front of the Camera";
    console.log("Make yourself visible in front of the Camera");
    status=1;

  }

  if(status==0)
  {
    document.getElementById("error").innerHTML ="";

  }



  if(landmarks!=null)
  {
    // drawing landmarks only if landmarks are detected
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#FFFFFF', lineWidth: 4 });
    var custom_landmarks = [results.poseLandmarks[11],results.poseLandmarks[12],results.poseLandmarks[13],results.poseLandmarks[14],results.poseLandmarks[15],results.poseLandmarks[16],results.poseLandmarks[23],results.poseLandmarks[24],results.poseLandmarks[25],results.poseLandmarks[26],results.poseLandmarks[27],results.poseLandmarks[28],results.poseLandmarks[29],results.poseLandmarks[30],results.poseLandmarks[31],results.poseLandmarks[32]]
    drawLandmarks(canvasCtx, custom_landmarks,
      { color: '#000000', lineWidth: 2 });
    // drawing landmarks only if landmarks are detected


    status=0;


  /**LEFT SIDE OF THE BODY */
  var lshoulder=[landmarks[POSE_LANDMARKS.LEFT_SHOULDER].x,landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y]
  var lelbow=[landmarks[POSE_LANDMARKS.LEFT_ELBOW].x,landmarks[POSE_LANDMARKS.LEFT_ELBOW].y]
  var lwrist=[landmarks[POSE_LANDMARKS.LEFT_WRIST].x,landmarks[POSE_LANDMARKS.LEFT_WRIST].y]
  var lhip=[landmarks[POSE_LANDMARKS.LEFT_HIP].x,landmarks[POSE_LANDMARKS.LEFT_HIP].y]
  var lknee=[landmarks[POSE_LANDMARKS.LEFT_KNEE].x,landmarks[POSE_LANDMARKS.LEFT_KNEE].y]
  var lankle=[landmarks[POSE_LANDMARKS.LEFT_ANKLE].x,landmarks[POSE_LANDMARKS.LEFT_ANKLE].y]

  /**RIGHT SIDE OF THE BODY */
  var rshoulder=[landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].x,landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y]
  var relbow=[landmarks[POSE_LANDMARKS.RIGHT_ELBOW].x,landmarks[POSE_LANDMARKS.RIGHT_ELBOW].y]
  var rwrist=[landmarks[POSE_LANDMARKS.RIGHT_WRIST].x,landmarks[POSE_LANDMARKS.RIGHT_WRIST].y]
  var rhip=[landmarks[POSE_LANDMARKS.RIGHT_HIP].x,landmarks[POSE_LANDMARKS.RIGHT_HIP].y]
  var rknee=[landmarks[POSE_LANDMARKS.RIGHT_KNEE].x,landmarks[POSE_LANDMARKS.RIGHT_KNEE].y]
  var rankle=[landmarks[POSE_LANDMARKS.RIGHT_ANKLE].x,landmarks[POSE_LANDMARKS.RIGHT_ANKLE].y]


  /** NOSE */
  var nose=[landmarks[POSE_LANDMARKS.NOSE].x,landmarks[POSE_LANDMARKS.NOSE].y]



  /**CUSTOM KEYPOINTS  HIP CENETER AND SHOULDER CENTER*/
  var hc=[(rhip[0]+lhip[0])/2,(rhip[1]+lhip[1])/2]
  var sc=[(rshoulder[0]+lshoulder[0])/2,(rshoulder[1]+lshoulder[1])/2]



  /** ANGLES CALCULATION */
  var lSEW=Math.abs(Math.round(calculate_angle(lshoulder,lelbow,lwrist)))
  var lESH=Math.abs(Math.round(calculate_angle(lelbow,lshoulder,lhip)))
  var lSHK=Math.abs(Math.round(calculate_angle(lshoulder,lhip,lknee)))
  var lHKA=Math.abs(Math.round(calculate_angle(lhip,lknee,lankle)))
  var rSEW=Math.abs(Math.round(calculate_angle(rshoulder,relbow,rwrist)))
  var rESH=Math.abs(Math.round(calculate_angle(relbow,rshoulder,rhip)))
  var rSHK=Math.abs(Math.round(calculate_angle(rshoulder,rhip,rknee)))
  var rHKA=Math.abs(Math.round(calculate_angle(rhip,rknee,rankle)))
  
  /**CUSTOM KEYPOINTS ANGLE */
  var rNNS=Math.abs(Math.round(calculate_angle(nose,sc,rshoulder))) //NOSE NECK SHOULDER RIGHT
  var lNNS=Math.abs(Math.round(calculate_angle(nose,sc,lshoulder))) //NOSE NECK SHOULDER LEFT
   

  var rNPH=Math.abs(Math.round(calculate_angle(sc,hc,rhip))) //NECK PELVIC HIP RIGHT
  var lNPH=Math.abs(Math.round(calculate_angle(sc,hc,lhip))) //NECK PELVIC HIP LEFT

  var NNP=Math.abs(Math.round(calculate_angle(nose,sc,hc))) //NOSE NECK PELVIC


  
  /** Angle between hip center and elbow */
  var middle_angle= Math.abs(Math.round(calculate_angle(rknee,hc,lknee)))
  canvasCtx.restore();
  var distance=find_distance(rshoulder,lshoulder)
  console.log('Distance',distance);

if(distance > 3 && distance <15){
  stat2=0
  document.getElementById("error").innerHTML =""
      
  /**Trikonasana  */
  if(middle_angle>25 && middle_angle<65){
    {  if(((rESH>120 && rESH<150) && (lESH>75 && lESH<95)) | ((lESH>120 && lESH<150) && (rESH>75 && rESH<95)))
      { 
        if((rSHK>130 && rSHK<170) | (lSHK>20 && lSHK<50)){
        document.getElementById("error").innerHTML ='Trikonasana'
      stat2=1}}
    }}
  /** ardha chandrasana */    

  if(middle_angle>90 && middle_angle<110)
  {
  if(((rESH>85 && rESH<120) && (lESH>85 && lESH<115)) | ((lESH>85 && lESH<120) && (rESH>85 && rESH<115)))
  {
      if((rSHK>165 && rSHK<190 && lSHK>65 && lSHK<90) | (lSHK>165 && lSHK<190 && rSHK>65 && rSHK<90))
      {document.getElementById("error").innerHTML ='ardha chandrasana';
      stat2=1;}
  }}

  /**parsvakonasana */
  if(middle_angle>85 && middle_angle<115){
  if(((rESH>165 && rESH<185) && (lESH>25 && lESH<55)) | ((lESH>165 && lESH<185) && (rESH>25 && rESH<55))){
      if((lHKA>150 && lHKA<190) | (rHKA>80 && rHKA<125)){
        document.getElementById("error").innerHTML ='Parsvakonasana';
        stat2=1;
      }}}


  /**tree pose */  
  
  if ((lHKA > 25 && lHKA < 40) | (rHKA > 25 && rHKA < 40)){
        if ((lHKA > 170 && lHKA < 185) | (rHKA > 170 && rHKA < 185)){
          document.getElementById("error").innerHTML ='Tree Pose';
          stat2=1;
        }}

/** T and Warrior Pose */
if (lSEW > 165 && lSEW < 195 && rSEW > 165 && rSEW < 195){
        if (lESH > 80 && lESH < 110 && rESH > 80 && rESH < 110){
            if ((lHKA > 165 && lHKA < 195) | (rHKA > 165 && rHKA < 195)){
                if ((lHKA > 80 && lHKA < 120) | (rHKA > 80 && rHKA < 120)){
                  document.getElementById("error").innerHTML ='Warrior II Pose';
                  stat2=1; 
                }} 
            if (lHKA > 160 && lHKA < 195 && rHKA > 160 && rHKA < 195 && rSHK > 160 && rSHK < 195 && lSHK > 160 && lSHK < 195 ){
              document.getElementById("error").innerHTML ='T Pose';
              stat2=1;
            }}}

/**Plank Pose */

if (lSEW > 80 && lSEW < 120 | rSEW > 80 && rSEW < 120 ){
  if (lESH > 65 && lESH < 100 | rESH > 65 && rESH < 100){
    if (lSHK > 150 && lSHK < 200 | rSHK > 150 && rSHK < 200){
      if ((lHKA > 160 && lHKA < 195) | (rHKA > 160 && rHKA < 195)){
        document.getElementById("error").innerHTML ='Plank Pose';
          stat2=1;
    }}}}

/**Urdhva Hastasana */

if (lSHK > 165 && lSHK < 195 && rSHK > 165 && rSHK < 195 ){
  if (lESH > 165 && lESH < 195 && rESH > 165 && rESH < 195){
    if ((lHKA > 165 && lHKA < 195) | (rHKA > 165 && rHKA < 195)){
      document.getElementById("error").innerHTML ='Urdhva Hastasana Pose';
        stat2=1;
    }}}

/** Sunbird Pose */
if ((lSEW > 150 && lSEW < 190) && (rSEW > 95 && rSEW < 190)){
  if (((lESH > 50 && lESH < 120) && (rESH > 100 && rESH < 195)) |
    ((rESH > 50 && rESH < 120) && (lESH > 100 && lESH < 195))){
    if (((lSHK > 155 && lSHK < 195) && (rSHK > 85 && rSHK < 120)) |
      ((rSHK > 155 && rSHK < 195) && (lSHK > 85 && lSHK < 120))){
      if (((lHKA > 150 && lHKA < 190) && (rHKA > 75 && rHKA < 130)) |
      ((rHKA > 135 && rHKA < 190) && (lHKA > 75 && lHKA < 130))){
        document.getElementById("error").innerHTML ='Sunbird Pose';
          stat2=1;
    }}}}


/** Bhujangasana */
if(lESH>2 && lESH<60){
  if ((lSEW > 80 && lSEW < 190) && (rSEW > 80 && rSEW < 190)){
          if ((lSHK > 100 && lSHK < 145) && (rSHK > 100 && rSHK < 145)){
        if ((lHKA > 160 && lHKA < 190) && (rHKA > 160 && rHKA < 190)){
                  document.getElementById("error").innerHTML ='Bhujangasana';
            stat2=1;
      }}}}

  /**empty statement */
      if(stat2==0)
      {
      document.getElementById("error").innerHTML =""
      
      }
    }
    else{
      document.getElementById("error").innerHTML ="please Stand back"
    }

  // canvasCtx.fillText(middle_angle, lelbow[0]*1201-100, lelbow[1]*601-100)
  // canvasCtx.fillText(lSEW, lelbow[0]*1201, lelbow[1]*601)
  // canvasCtx.fillText(rSEW, relbow[0]*1201,relbow[1]*601)
  // canvasCtx.fillText(lESH, lshoulder[0]*1201,lshoulder[1]*601)
  // canvasCtx.fillText(rESH, rshoulder[0]*1201,rshoulder[1]*601)
  // canvasCtx.fillText(lSHK, lhip[0]*1201, lhip[1]*601)
  // canvasCtx.fillText(rSHK, rhip[0]*1201, rhip[1]*601)
  // canvasCtx.fillText(lHKA, lknee[0]*1201,lknee[1]*601)
  // canvasCtx.fillText(rHKA, rknee[0]*1201,rknee[1]*601)
  // canvasCtx.fillText("lNNS"+lNNS,10,110)
  // canvasCtx.fillText("rNNS"+rNNS,10,130)
  // canvasCtx.fillText("lNPH"+lNPH, 10, 150)
  // canvasCtx.fillText("rNPH"+rNPH, 10, 170)
  // canvasCtx.fillText("NNP"+NNP, 10, 190)

  
  /** BACKBONE */
  // canvasCtx.beginPath();
  // canvasCtx.moveTo(sc[0]*1200,sc[1]*600);
  // canvasCtx.lineTo(hc[0]*1200,hc[1]*600); 
  // canvasCtx.strokeStyle = '#ff0000';
  // canvasCtx.lineWidth = 5;
  // canvasCtx.stroke();


  /** NOSE TO NECK */
  // canvasCtx.beginPath();
  // canvasCtx.moveTo(nose[0]*1200,nose[1]*600);
  // canvasCtx.lineTo(sc[0]*1200,sc[1]*600); 
  // canvasCtx.strokeStyle = '#ff0000';
  // canvasCtx.lineWidth = 5;
  // canvasCtx.stroke();
  
  // console.log(POSE_CONNECTIONS)

}
}

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5

});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
  width: 1200,
  height: 600
});
camera.start();

