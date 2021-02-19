const fetch = require("node-fetch");
var Token = "Your Token";
var url = "https://api.telegram.org/bot" + Token + "/";
var TelegramBot = require('node-telegram-bot-api');
telegram = new TelegramBot(Token, { polling: true });
var countries = [];
var listenerFlag = false;
var firstTimeFlag = true;
var  date; 
var ftotal = 0;
var factive = 0;
var frecover = 0;
var fdeath = 0;  
telegram.on("text", (message) => {
    mId = message.chat.id;
    mText = message.text;
    console.log(mText);
    $rows =[[]];
    getCountry(); //Update Country List
    for(i = 0 ; i < countries.length ; i++)
    {
        $rows[i] = [{"text":countries[i]}];     
        
    }
    opts = {
        reply_markup: {
            keyboard: 
            $rows
        }
    }
    optsRemove = {
        reply_markup:{
            remove_keyboard: true,
        }
    }


//Start function
    else if(mText =="/start" || mText.toLowerCase() == "start"){ 
        telegram.sendMessage(mId, "Hello my friend! you can use '/stats Country name' or simply type stats to see the country list and World stats!!\ne.g: /stats Iran" );  
        listenerFlag = false;      
    }
//Stats function
    else if (mText.split(" ")[0] == "/stats" || mText.split(" ")[0].toLowerCase() == "stats")
    {
        if(mText.split(" ")[1] == null)
        { 
            telegram.sendMessage(mId , getwrldStats());
           /* ftotal = 0;
            factive = 0;
            frecover = 0;
            fdeath = 0;
            */if(listenerFlag == false)
            {
                listenerFlag = true;
                telegram.sendMessage(mId, "Which country you want to choose?" , opts);
                getmessage();
            }
            else 
            {
                telegram.sendMessage(mId, "Which country you want to choose?");  
            }
        }
        else
        {
            mText1 = mText.split(" ")[1].toLowerCase();
            for(i = 0 ; i < mText1.length ; i++)
            {
                if(i == 0)
                mText2 = mText1.split("")[0].toUpperCase();
                else
                mText2 += mText1.split("")[i].toLowerCase();
            }
            showStats(mText2.toString());
            console.log(mText2.toString()); 
            
        }
    }
});


//To show errors on Consol
telegram.on("polling_error", (err) => console.log(err));

//To Get Countries from Server
  function getCountry(callback) {
    callback = callback || function(){};
    fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(
        data => {
        i = 0;
         for(x in data) {
            callback(null, x);
         }      
    });
  }

//Callback Function for getCountry()
 getCountry(function (data) {
      countries[i] = x;
      i++;
  });

  //Wait for response
  async function getmessage(){
    if(firstTimeFlag)
    await telegram.on("text", (message) => {
        if(listenerFlag)
            showStats(message.text);
            firstTimeFlag = false; 
    });
    console.log("I'm listening..");
  }

  //Show stats of country
  function showStats(country){
    fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
    data[country].forEach(({ date, confirmed, recovered, deaths }) =>
        $g = (`
Date: ${date}
Active Cases: ${confirmed - recovered - deaths}
Recovered Cases: ${recovered}
Deaths: ${deaths}
Total Cases: ${confirmed}`)
    );
    telegram.sendMessage(mId ,"Country: " + country.toUpperCase() + $g);
    });
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getwrldStats()
{
    for(i = 0 ; i < 5; i++)
    {
        wrldStats();
    }
    return ("Date: " + date + "\nActive Cases: " + factive + "\nRecovered Cases: " + frecover + "\nDeaths: " + fdeath + "\nTotal Cases: " + ftotal); 
}
  //World Stats
  function wrldStats(callback) {
        callback = callback || function(){};
        fetch("https://pomber.github.io/covid19/timeseries.json")
    .then(response => response.json())
    .then(data => {
    data["Iran"].forEach(({ date, confirmed, recovered, deaths }) =>
        $g = (`${date} ${confirmed - recovered - deaths} ${recovered} ${deaths} ${confirmed}`)
    );
         callback($g);
    });
       // return ("Date: " + date + "\nActive Cases: " + factive + "\nRecovered Cases: " + frecover + "\nDeaths: " + fdeath + "\nTotal Cases: " + ftotal) 
      }   

  wrldStats (function (a) {
        a = a.split(" ");
         date = a[0]; 
         factive = factive + parseInt(a[1]);
         fdeath = fdeath + parseInt(a[3]);
         ftotal = ftotal + parseInt(a[4]);
         frecover = frecover + parseInt(a[2]);
         console.log(factive);
  });