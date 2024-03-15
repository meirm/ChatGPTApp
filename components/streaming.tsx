import { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import EventSource from "react-native-sse";

const OpenAIToken = '[Your OpenAI token]';

export default function Streaming() {
  const [text, setText] = useState<string>("Loading...");
  const initialized = useRef(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "What is the meaning of life?",
    },
  ]);
  useEffect(() => {
    if (initialized.current) {
      return; // If already initialized, do nothing
    }
    initialized.current = true; // Mark as initialized

    const es = new EventSource(
      "http://192.168.0.12:1234/v1/chat/completions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OpenAIToken}`,
        },
        method: "POST",
        // Remember to read the OpenAI API documentation to set the correct body
        body: JSON.stringify({
          model: "gpt-3.5-turbo-0125",
          messages: messages,
          max_tokens: 600,
          n: 1,
          temperature: 0.7,
          stream: true,
        }),
        pollingInterval: 0, // Remember to set pollingInterval to 0 to disable reconnections
      }
    );

    es.addEventListener("open", () => {
      console.log("Connection opened");
      setText("");
    });

    es.addEventListener("message", (event) => {
      console.log("Message received:", event.data);
      if (event.data !== "[DONE]") {
        const data = JSON.parse(event.data);
        if (data.choices[0].finish_reason === "stop"){
          setText((text) => text + "\n");
          console.log("Connection closing. Reason: Empty response.");
          es.removeAllEventListeners();
          es.close();
        }else{          
          if (data.choices[0].delta.content !== undefined) {
              setText((text) => text + data.choices[0].delta.content);
          }
        }
      }else{
        es.removeAllEventListeners();
        es.close();
        console.log("Connection closing.");
      }
    });

    // return () => {
    //   es.removeAllEventListeners();
    //   es.close();
    //   console.log("Connection closed.");
    // };
  }, []);

  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
}