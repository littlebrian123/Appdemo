

 import React, {useRef, useState} from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
   FlatList,
   Alert,
   TouchableOpacity,
   Image,
   Platform
 } from 'react-native';
 import {
   Colors,
   DebugInstructions,
   Header,
   LearnMoreLinks,
   ReloadInstructions,
 } from 'react-native/Libraries/NewAppScreen';
 //rncamera problem exception error in android 12 （Error: Camera capture failed. Camera is already capturing.）
 //If possible, try the react-native-vision-camera to see if the problem solved.
 import {RNCamera} from 'react-native-camera';
 import { Buffer } from 'buffer';
 
 const App = () => {
  const ailist= new Object();
  const BANKNOTEAI={  
    url:'https://wevision-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/49bb4634-439f-4063-a85d-6488745b29db/classify/iterations/Iteration6/image',
    key:'66af57421ee24b9a96d26066408e18e6'
  }
  ailist.BANKNOTEAI=BANKNOTEAI;
   const isDarkMode = useColorScheme() === 'dark';
   const camref=useRef(null);
   const [disabled,setdisabled]=useState(false);

  function sorting(payload){
    if(payload.predictions!==undefined){
      let result='';
      let maxprobability=0.0;
      payload.predictions.map((element)=>{
        if(element.probability>maxprobability){
          maxprobability=element.probability;
          result=element.tagName;
        }
      });
      return result;
    }
    return 0;
  }


  async function prediction(mode,source){
    console.log(ailist[mode].url+'\n'+ailist[mode].key);
    const url=ailist[mode].url;

  //  when using image url, change the prediction ai url and uncomment the codes 

  //   try{
  //   const config={ 
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Prediction-Key":ailist[mode].key
  //   },
  //   body: JSON.stringify({
  //     Url: "https://lh3.googleusercontent.com/_M14NRTYPPQYgdKReeicOfwYJfHI-USHThCxb3buQ8dKJ_XBIjR1lnzdLQ3vjYrDVdOn79de6u_JkxB0D44hBrZ88olRx1fU8QIe7Cq_VzxUWalNeQ=w2880-l80-sg-rj-c0xffffff"
  //   })};
  //   let response=await fetch(url,config)
  //   response=await response.json();
  //    console.log(JSON.stringify(response));
  //    sorting(response);
  // }catch(err){
  //   console.error("error: network problem");
  // }

  
//when using the local photo , change the prediction ai url and uncomment the codes

      try {
      const data= Buffer.from(source,'base64');
      const config={ 
        method: 'POST',
        headers: {
          "Content-Type": "application/octet-stream",
          "Prediction-Key":ailist[mode].key,
        },
        body: data
        };
      let response=await fetch(url,config)
        response=await response.json();
       console.log(JSON.stringify(response));
       let result= sorting(response);
       console.log(result); 
      }catch (error) {
        console.error("error: network problem");
      }
    }



  async function takepicture(camref){
    if (camref.current) {
      // Quality = 1 ; Image size: 4MB
      // Quality = 0.2 ; Image size: 298KB
      // Quality = 0.1 ; Image size: 254KB
      setdisabled(true);
      const options = {quality: 0.2, base64: true, exif: true};
      console.log("entering takepicture");
      let data=await camref.current.takePictureAsync(options);
      console.log("entering prediction");
      await prediction('BANKNOTEAI',data.base64);
      setdisabled(false);
    } 
  }
 
   
   return (
     <View style={styles.container}>
       <StatusBar
         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
       />
        <RNCamera
              //  ref={(cam)=>{camref.current=cam}}
               ref={camref}
               captureAudio={false}
               style={styles.preview}
               type={RNCamera.Constants.Type.back}
               flashMode={RNCamera.Constants.FlashMode.auto}
               androidCameraPermissionOptions={{
                 title: 'Reminder',
                 message: 'No_Camera_Permission',
                 buttonPositive: 'OK',
                 buttonNegative: 'Cancel',
               }}
           />
           <View
             style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'transparent',
              marginTop: 16
            }}
           >
<TouchableOpacity
        style={
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }
        }
        accessibilityLabel={'CameraShutterButton'}
        onPress={()=>{takepicture(camref);}}
        disabled={disabled}
        >         
           <View
          style={[{
            width: '100%',
          },disabled ? {opacity: 0.5} : {}]}>
          <Image
            style={{
              width: '100%',
            }}
            resizeMode={'contain'}
            source={require('./btnShutterBase1.png')}
          />
        </View>
      </TouchableOpacity>
      </View>   
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
   preview: {
     flex: 1,
     justifyContent: 'flex-end',
     alignItems: 'center',
   },
     container: {
     flex: 1,
     flexDirection: 'column',
     backgroundColor: 'black',
   },
 });

 export default App;
 