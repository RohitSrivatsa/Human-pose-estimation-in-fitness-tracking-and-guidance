function click(val){
  console.log(val);
  var x= document.getElementById("location");
  
  let y= document.getElementsByName("gender"); 
  let gen;
       for (const radioButton of y) {
           if (radioButton.checked) {
               gen = radioButton.value;
             break;
           }
          }
  console.log(gen);
        if(val['id']!="")
         {var bp_e= val['id'] +" "+ gen;
         x.innerHTML= bp_e;}
        else{
          
         x.innerHTML= ""
        }
  // if (bp_e== "face Male"){
  //   window.location.href = "views/bp_ex.html";
  // }
}










