import { Chat, MessageType } from '@flyerhq/react-native-chat-ui'
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { systemPrompts, fetchSystemPrompt } from './components/system_prompts';
import DropdownComponent from './components/system_messages';
import { Slider } from '@react-native-assets/slider'
import React, { useState, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import postDataStream from './components/streaming'
import postData from './components/openai'
import { loadSettings, saveSettings } from './components/settings'
// For the testing purposes, you should probably use https://github.com/uuidjs/uuid
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r % 4) + 8
    return v.toString(16)
  })
}


const App = () => {
  const useStreaming = true
  const [selectedSystemPrompt, setSelectedSystemPrompt] = useState(null);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const [messages, setMessages] = useState<MessageType.Any[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistance.')
  const [url, setUrl] = useState('http://192.168.1.1/v1')
  const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' }
  const bot =  { id: '02202200-e835-4736-80f4-63f44b66ff6d' }
  // const [data, setString] = useState('');


  const handleCopyToClipboard = () => {
    // Implement what happens when you press the copy button
    console.log('Copy button pressed');
    // Copy the system prompt to the clipboard
    // if (selectedSystemPrompt){
    //   // Clipboard.setString("hello");
    // }
  };

  const handleSystemPromptSelect = (selectedItem:any, index:number) => {
    setSelectedSystemPrompt(selectedItem);
    console.log('Fetching system prompt:', selectedItem);
    fetchSystemPrompt(selectedItem).then((prompt) => {
      setSystemPrompt(prompt);
      console.log('Selected system prompt:', prompt);
    })
  };

  const resetDefaultSettings = () => {
    setUrl('http://192.168.2.1/v1')
    saveSettings({"url":'http://192.168.2.1/v1'})
  }

  const loadDefaultSettings = async () => {
    const settings = await loadSettings();
    if (settings) {
      console.log('Loaded settings:', settings);
      // Here, you could set the settings in the state or do something else with them
      setUrl(settings.url)
      setSystemPrompt(settings.systemPrompt)
      setTemperature(settings.temperature)
    } else {
      console.log('No settings found, initializing with defaults.');
      // Here, you could call saveSettings with some default settings if necessary
    }
  };

  useEffect(() => {
    (async () => {
    await loadDefaultSettings()
    })()
  }, [])

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages])
  }

  const openSettings = () => {
    // Implement what happens when you press the settings button
    console.log('Settings button pressed');
    // For example, navigate to a settings screen if using a navigation library
  };

  const  handleSendPressStream = async(message: MessageType.PartialText) => {
    const model = "llama2:chat"
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }
    // addMessage(textMessage)
    const replyMessage: MessageType.Text = {
      author: bot,
      createdAt: Date.now(),
      id: uuidv4(),
      text: "...",
      type: 'text',
    }

    const updateReplyMessage = (done:boolean, delta: string) => {
      if (!done){
        replyMessage.text = delta
        setMessages((previousMessages)=>{ previousMessages[0] = replyMessage; return [...previousMessages]})
      }
    };
    setMessages((previousMessages)=>[replyMessage, textMessage, ...previousMessages])
    const response = await postDataStream(url, model, messages,textMessage, temperature, systemPrompt, updateReplyMessage);
    replyMessage.text = response
    // replace the first message with the new message

    setMessages((previousMessages)=>{ previousMessages[0] = replyMessage; return [...previousMessages]})
  }

  const  handleSendPress = async(message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }
    // addMessage(textMessage)
    const replyMessage: MessageType.Text = {
      author: bot,
      createdAt: Date.now(),
      id: uuidv4(),
      text: "...",
      type: 'text',
    }
    setMessages((previousMessages)=>[replyMessage, textMessage, ...previousMessages])
    const response = await postData(url, messages,textMessage, temperature, systemPrompt);
    replyMessage.text = response
    // replace the first message with the new message

    setMessages((previousMessages)=>{ previousMessages[0] = replyMessage; return [...previousMessages]})
  }
  if (showSettings) {
    // Implement what happens when the settings screen is shown
    console.log('Settings screen shown');
    // For example, show a modal if using a navigation library
    return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{setShowSettings(false)}} style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View><Text>System Prompt:</Text></View>
        <View><TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 300}} value={systemPrompt} onChangeText={prompt => setSystemPrompt(prompt)}/></View>
        <View><Text>Temperature:</Text></View>
        <View style={{flexDirection: 'row', paddingLeft: 20}}>
          <View style={{ flexDirection: 'col', justifyContent: 'space-around', alignItems: 'left', paddingBottom: 20 }}>
            <Slider
            style={{width: 200, height: 40}}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={temperature}
            onValueChange={value => setTemperature(value)}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000" />
          </View>
          <View style={{ flexDirection: 'col', justifyContent: 'space-around', alignItems: 'right', paddingBottom: 20 }}>
            <Text>    {temperature}</Text>
          </View>
        </View>
      <ScrollView>
        <View>
          <Text>LLM API URL:</Text>
        </View>
        <View  style={{flexDirection: 'row', padding: 20}}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 300}}
            onChangeText={text => setUrl(text)}
            value={url} />
        </View>
        <View>
            <Button title="Load Default" onPress={()=>{loadDefaultSettings()}}/>
            <Button title="Save as Default" onPress={()=>{saveSettings({"url":url, "systemPrompt": systemPrompt, "temperature": temperature})}}/>
            <Button title="Clear Chat History" onPress={()=>{setMessages([])}}/>
        </View>
        <View>
            <Text style={styles.title}>Info</Text>
            <Text>LLM Chatbot settings:</Text>
            <Text>The LLM chatbot uses OpenAI's api to talk to your local LLM.</Text>
            <Text>If you are running LM studio server on your PC, you can access it.</Text>
            <Text>You will ned to know the IP address of your PC and the port number it is listening at.</Text>
            <Text>For example: http://192.168.1.1:1234/v1</Text>
            <Text style={styles.title}>Notes</Text>
            <Text>At the moment the application is not saving your chat.</Text>
            <Text>You can change the llm url for just one session if you do not save it as default</Text>
            <Text>There is no authentication for the LLM chatbot</Text>
            <Text>There is no error handling for the LLM chatbot</Text>
            <Text>There is no input validation for the LLM chatbot</Text>
            <Text>There is no input sanitization for the LLM chatbot</Text>
        </View>
      </ScrollView>
        </View>
    </SafeAreaProvider>
  )
  }
  if (useStreaming){
    // Implement what happens when the chat screen is shown
    console.log('Chat screen shown');
    // For example, show a chat screen if using a navigation library
    return(<SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{setShowSettings(true)}} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>{url}</Text>
          </TouchableOpacity>
        </View>
          <DropdownComponent data={systemPrompts} label="SystemPrompt" onChange={handleSystemPromptSelect}/>
            <TouchableOpacity onPress={()=>{setShowSystemPrompt(!showSystemPrompt)}}><Text style={styles.title}>{selectedSystemPrompt}</Text></TouchableOpacity>
          {selectedSystemPrompt && showSystemPrompt?<View><ScrollView style={styles.sysprompt}><Text selectable={true}>{systemPrompt}</Text></ScrollView>
          </View>:null}          
        <Chat messages={messages} onSendPress={handleSendPressStream} user={user} />
      </View>
    </SafeAreaProvider>)
  }
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>{setShowSettings(true)}} style={styles.settingsButton}>
            <Text style={styles.settingsButtonText}>{url}</Text>
          </TouchableOpacity>
        </View>
          <DropdownComponent data={systemPrompts} label="SystemPrompt" onChange={handleSystemPromptSelect}/>
          <TouchableOpacity onPress={()=>{setShowSystemPrompt(!showSystemPrompt)}}><Text style={styles.title}>{selectedSystemPrompt}</Text></TouchableOpacity>
          {selectedSystemPrompt && showSystemPrompt?<View><ScrollView style={styles.sysprompt}><Text selectable={true}>{systemPrompt}</Text></ScrollView>
          </View>:null}          
        <Chat messages={messages} onSendPress={handleSendPress} user={user} />
      </View>
    </SafeAreaProvider>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  header: {
    height: 80, // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20, // Padding to the right for the settings button
    // Padding to the top for the settings button
    backgroundColor: '#f7f7f7', // Optional: change the background color as needed
  },
  settingsButton: {
    // Styles for the settings button
    paddingTop: 60, // Adjust the padding as needed
  },
  settingsButtonText: {
    fontSize: 18, // Adjust the font size as needed
    color: '#007bff', // Adjust the text color as needed
  },
  sysprompt:{
    fontSize: 12,
    color: '#007bff',
    maxHeight: '80%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
  }
});

export default App