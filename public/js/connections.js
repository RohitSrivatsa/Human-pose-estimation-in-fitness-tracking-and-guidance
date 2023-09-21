
const videoElement = null;
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const controlsElement = document.getElementsByClassName('control-panel')[0];
const fpsControl = new FPS();
var pi = Math.PI;
var conpo = [[11,13],[12,14]]

/**function to calculate angle */
function calculate_angle(x,y,z)
{

  var a=x;
  var b=y;
  var c=z
  
  var radians= 
    Math.atan2(c[1]-b[1],c[0]-b[0])-Math.atan2(a[1]-b[1],a[0]-b[0]);
  var angle= radians * (180/pi)
  if(angle>180)
  {
    angle=360-angle;
  }

  return angle;
}


// var vidElement=null;
  function start() {
    var camAvailable= navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    if(camAvailable){
          videoElement= document.getElementsByClassName('input_video')[0];
     // vidElement=document.getElementById("vid")
      navigator.mediaDevices.getUserMedia({video:true}).then(function(stream){
        videoElement.srcObject=stream;
        videoElement.play();
      });
    }
    
  }
  function stop() {
    videoElement.pause();
    
  }


function onResults(results) {
  fpsControl.tick();
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image, 0, 0, canvasElement.width, canvasElement.height);
  drawConnectors(canvasCtx, results.poseLandmarks, conpo,
    { color: '#00FF00', lineWidth: 4 });
  drawLandmarks(canvasCtx, results.poseLandmarks,
    { color: '#FF0000', lineWidth: 2 });
  canvasCtx.font = "15px serif"
  canvasCtx.fillStyle = "#0000FF";
  var landmarks = results.poseLandmarks;


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


  

  canvasCtx.fillText(lSEW, lelbow[0]*401, lelbow[1]*401)
  canvasCtx.fillText(rSEW, relbow[0]*401,relbow[1]*401)
  canvasCtx.fillText(lESH, lshoulder[0]*401,lshoulder[1]*401)
  canvasCtx.fillText(rESH, rshoulder[0]*401,rshoulder[1]*401)
  canvasCtx.fillText(lSHK, lhip[0]*401, lhip[1]*401)
  canvasCtx.fillText(rSHK, rhip[0]*401, rhip[1]*401)
  canvasCtx.fillText(lHKA, lknee[0]*401,lknee[1]*401)
  canvasCtx.fillText(rHKA, rknee[0]*401,rknee[1]*401)
  canvasCtx.fillText("lNNS"+lNNS,10,110)
  canvasCtx.fillText("rNNS"+rNNS,10,130)
  canvasCtx.fillText("lNPH"+lNPH, 10, 150)
  canvasCtx.fillText("rNPH"+rNPH, 10, 170)
  canvasCtx.fillText("NNP"+NNP, 10, 190)

  
  /** BACKBONE */
  canvasCtx.beginPath();
  canvasCtx.moveTo(sc[0]*400,sc[1]*400);
  canvasCtx.lineTo(hc[0]*400,hc[1]*400); 
  canvasCtx.strokeStyle = '#ff0000';
  canvasCtx.lineWidth = 5;
  canvasCtx.stroke();


  /** NOSE TO NECK */
  canvasCtx.beginPath();
  canvasCtx.moveTo(nose[0]*400,nose[1]*400);
  canvasCtx.lineTo(sc[0]*400,sc[1]*400); 
  canvasCtx.strokeStyle = '#ff0000';
  canvasCtx.lineWidth = 5;
  canvasCtx.stroke();

  console.log(POSE_CONNECTIONS)
  canvasCtx.restore();
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
  width: 400,
  height: 400
});
camera.start();


new ControlPanel(controlsElement)
  .add([
    new StaticText({ title: 'MediaPipe Pose' }),
    fpsControl
  ]);





  