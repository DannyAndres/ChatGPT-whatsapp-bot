/**
 * Add example_whatsapp_config to a json file called "whatsapp-config.json"
 */

const example_whatsapp_config = {
  allowedChats: [], // Array<String> - array of id's of every one to one chat the bot is allowed to write a response
  allowedGroups: [], // Array<String> - array of id's of every group chat the bot is allowed to write a response
  phone: 'XXXXXXX', // String - phone number from the account added to Whatsapp web client
  // It will be use to know when the bot got mentioned in a chat group - only then it will talk
};
