export const cleanResponse = (response: string) => {
  response = response.split(/<end_of_turn>/)[0];
  return response;
};

export const sanitizeText = (text: string) => {
  // Remove any character that is not a letter or a number
  return text.replace(/[^a-zA-Z0-9]/g, "");
};

const postData = async (url:string, history: any, message: any, temperature: number = 0.7, systemPrompt:string = "You are a helpful assistance.") => {
  let messages = [
    {
      role: "system",
      content: systemPrompt,
    },
  ];

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

    const response = await fetch(
      url + "/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
          temperature: temperature,
          max_tokens: -1,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.choices[0].message.content; // Return the full response data for further processing
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error; // Rethrow the error to handle it in the calling context
  }
};

export default postData;
