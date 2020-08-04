//chatbot code

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
  projectId: 'endless-beach-250210'
}); 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to Zenzu!`);
  }
  function getAgentNameHandler(agent) {
  agent.add('From fulfillment: My name is Zenzu!');
}
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
    agent.add(`Please contact our support team zenzu.co`);
  }
  //language function
  function languageHandler(agent) {
    const language = agent.parameters.language;
    const programmingLanguage = agent.parameters['language-programming'];
    if (language) {
        agent.add(`From fulfillment: Wow! I didn't know you knew ${language}`);
    } else if (programmingLanguage) {
        agent.add(`From fulfillment: ${programmingLanguage} is cool`);
    } else {
        agent.add(`From fulfillment: What language do you know?`);
    }
}
const Datastore = require('@google-cloud/datastore');
/*const datastore = new Datastore();
const keys = datastore.keys({  //save the single entity
  namespace: 'ns',
  path: ['Company', zenzu]
  
});
  const entity = {
  key: key,
  data: {
    name: 'zenzu',
    rating: 8
  }
};

datastore.save(entity, (err) => {
  console.log(key.path); // ['Company', 'zenzu']
  console.log(key.namespace); // 'my-namespace'
});*/
  
  // New entities can be created and persisted with {@link Datastore#save}.
// The entitiy must have a key to be saved. If you don't specify an
// identifier for the key, one is generated for you.
//
// We will create a key with a `name` identifier, "Zenzu chatbot".
//-
let key = datastore.key(['Company', 'Zenzu']);

const data = {
  name: 'Zenzu',
  location: 'us1'
  
};

datastore.save({
  key: key,
  data: data
}, (err) => {
  if (!err) {
    // Record saved successfully.
  }
});

//-
// We can verify the data was saved by using {@link Datastore#get}.
//-
/*datastore.get(key, (err, entity) => {
  entity = {
     name: 'Zenzu',
     location: 'us1',
    
   }
});*/

//-
// If we want to update this record, we can modify the data object and re-
// save it.
//-
data.symbol = 'GOOG';

datastore.save({
  key: key, // defined above (datastore.key(['Company', 'Google']))
  data: data
}, (err, entity) => {
  if (!err) {
    // Record updated successfully.
  }
});
 function zenzu(agent) {
      var security = agent.Trainingphrases.security;
      var zenzu = agent.Trainingphrases.zenzu;
      var number = agent.parameters.number;
      var time = agent.parameters.time;
      const taskKey = datastore.key('user_list');
      const entity = {
        key: taskKey,
        data: {
       list_name: 'zenzu',
       zenzu: zenzu,
       //zenzu-features: features,
       //suggestion: suggestion,
        
        time: time,
        user_time: new Date().toLocaleString(),
         }
       };
      return datastore.save(entity).then(() => {
                console.log(`Saved ${entity.key.name}: ${entity.data.list_name}`);
                //agent.add(` wlcome to Zenzu!` );

             });
     }

  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  /*function yourFunctionHandler(agent) {
     agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
     agent.add(new Card({
       title: `Title: this is a card title`,
        imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
         text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
         buttonText: 'This is a button',
         buttonUrl: 'https://assistant.google.com/'
       })
     );
     agent.add(new Suggestion(`Quick Reply`));
     agent.add(new Suggestion(`Suggestion`));
     agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
   }*/

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
 /*const app = dialogflow()
  app.intent('intent1', (conv) => {
  const lifespan = 5;
  const contextParameters = {
    color: 'red',
  };
  conv.contexts.set('context1', lifespan, contextParameters);
  // ...
  conv.ask('...');
});

app.intent('intent2', (conv) => {
  const context1 = conv.contexts.get('context1');
  const contextParameters = context1.parameters;
  // ...
  conv.ask('...');
});

app.intent('intent3', (conv) => {
  conv.contexts.delete('context1');
  // ...
  conv.ask('...');
});*/
  
  let intentMap = new Map();
  
  intentMap.set('set-language', languageHandler);
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('get-agent-name', getAgentNameHandler);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('zenzu', zenzu);
  
   //intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
