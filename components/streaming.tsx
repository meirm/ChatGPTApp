import EventSource from "react-native-sse";

const OpenAIToken = '[Your OpenAI token]';
//http://localhost:11434/v1
const postDataStream = async (url:string, model:string, max_tokens: number, history: any, message: any, temperature: number = 0.7, systemPrompt:string = "You are a helpful assistance.", callback: any) => {
  let messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];
  let text = "";

  try {
    // Construct messages array from history and the new message
    if (history.length > 0) {
      // Directly concatenate the filtered and mapped history messages to the existing messages
      const historyMessages = history
        .map((msg: { author: { id: string; }; text: any; }) => (
             {
          role:
            msg.author.id === "06c33e8b-e835-4736-80f4-63f44b66666c"
              ? "user"
              : "assistant",
          content: msg.text,
        }));
        // we need to reverse the order of the history messages
        historyMessages.reverse();
      messages = [...messages, ...historyMessages]; // Correctly spread historyMessages
      console.log("History", messages);
    }else{
        console.log("No history")
    }

    // Add the new message at the end of messages array
    if (message.text) {
      messages.push({ role: "user", content: message.text });
    }

    const es = new EventSource(
      url + "/chat/completions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OpenAIToken}`,
        },
        method: "POST",
        // Remember to read the OpenAI API documentation to set the correct body
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: max_tokens,
          n: 1,
          temperature: temperature,
          stream: true,
        }),
        pollingInterval: 0, // Remember to set pollingInterval to 0 to disable reconnections
      }
    );

    es.addEventListener("open", () => {
      console.log("Connection opened");
      text = "";
    });

    es.addEventListener("message", (event) => {
      console.log("Message received:", event.data);
      if (event.data !== "[DONE]") {
        const data = JSON.parse(event.data);
        if (data.choices[0].finish_reason === "stop"){
          text += "\n";
          callback(true, null);
          console.log("Connection closing. Reason: Empty response.");
          es.removeAllEventListeners();
          es.close();
        }else{          
          if (data.choices[0].delta.content !== undefined) {
               const delta =  data.choices[0].delta.content;
              text += delta;
               callback(false, text);
          }
        }
      }else{
        es.removeAllEventListeners();
        es.close();
        console.log("Connection closing.");
      }
    });

    return text;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error; // Rethrow the error to handle it in the calling context
  }
}

export default postDataStream;