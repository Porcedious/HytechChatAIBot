const { ActivityHandler, MessageFactory } = require("botbuilder");
const { getChatCompletion } = require("./openaiservice");
const { searchDocuments } = require("./searchService");
const { getembeddingdata } = require("./textembeddingservice");
class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const userMessage = context.activity.text;

      const searchQuery = {
        search: userMessage,
      };

      try {
       
        const results = await getChatCompletion(userMessage);
        let replyText = "";

        if (results.length > 0) {
          replyText = `${results}`;
        } else {
          replyText = "Sorry, I couldn't find any relevant information.";
        }

        await context.sendActivity(MessageFactory.text(replyText, replyText));
      } catch (error) {
        console.log(error, "yha h");
        await context.sendActivity(
          "Sorry, there was an error processing your request."
        );
      }

      await next();
    });
  }
}

module.exports.MyBot = MyBot;
