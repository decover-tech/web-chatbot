import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SendOutlined } from '@ant-design/icons';

type ChatbotProps = {
    decoverId: string;
};

type MessageType = {
    text: string;
    isSentByBot: boolean;
};

export const Chatbot: React.FC<ChatbotProps> = ({ decoverId }) => {
    const endpoint = 'https://app-api.decoverapp.com/api/v1/chat';
    const messagesEndRef: React.MutableRefObject<HTMLDivElement | null> = useRef<null | HTMLDivElement>(null);
    const [newMessage, setNewMessage] = useState<MessageType>({
        text: '',
        isSentByBot: true
    });
    const [listOfMessages, setListOfMessages] = useState<MessageType[]>([]);
    const [mode] = useState<string>('chatgpt');

    console.log('Initalized with decoverId: ', decoverId);

    useEffect(() => {
        scrollToBottom();
    }, [listOfMessages]);

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNewMessage = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value: message }: { value: string } = event.target;
        setNewMessage({ text: message, isSentByBot: false });
    };

    const sendMessageToChatGpt3 = (message: MessageType): void => {
        // Step I: Add the message to the list of messages.
        listOfMessages.push(message);
        setListOfMessages(listOfMessages);

        // Step II: Hit the OpenAI Chat API and get the response.
        const openai_api_key = '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';
        const endpoint = 'https://api.openai.com/v1/chat/completions';
        const xhr: XMLHttpRequest = new XMLHttpRequest();

        // Step II(a): Prepare the request headers.
        xhr.open('POST', endpoint);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + openai_api_key);

        // Step II(b): Prepare the data to be sent to the API.
        const messages = listOfMessages.map((message) => {
            return {
                role: message.isSentByBot ? 'assistant' : 'user',
                content: message.text
            };
        });
        const data = {
            model: 'gpt-3.5-turbo',
            messages: messages
        };
        // Add data to the body of the request.
        xhr.send(JSON.stringify(data));

        // Step III: Get the response and add it to the list of messages.
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response: any = JSON.parse(xhr.responseText);
                setListOfMessages((prevListOfMessages) => [...prevListOfMessages, { text: response.choices[0].message.content, isSentByBot: true }]);
            }
        };
    };

    const sendMessage = (message: MessageType): void => {
        const { text }: { text: string } = message;
        if (text.trim().length === 0) return;

        setListOfMessages((prevListOfMessages) => [...prevListOfMessages, message]);

        const xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open('POST', endpoint);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const response: any = JSON.parse(xhr.responseText);
                setListOfMessages((prevListOfMessages) => [...prevListOfMessages, { text: response.message, isSentByBot: true }]);
            }
        };

        setNewMessage({ text: '', isSentByBot: true });
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (mode === 'chatgpt') {
            sendMessageToChatGpt3(newMessage);
        } else {
            sendMessage(newMessage);
        }
    };

    const isNewMessageEmpty = (): boolean => newMessage.text.trim().length === 0;

    return (
        <ChatbotContainer>
            <ListOfMessagesContainer>
                {listOfMessages?.map((message, index) =>
                    message.isSentByBot ? <MessageSentByBot key={index}>{message.text}</MessageSentByBot> : <MessageSentByUser key={index}>{message.text}</MessageSentByUser>
                )}
                <div ref={messagesEndRef} />
            </ListOfMessagesContainer>
            <SendMessageForm onSubmit={handleFormSubmit}>
                <MessageInputContainer type="text" value={newMessage.text} placeholder="Ask something..." onChange={handleNewMessage} autoComplete="off" />
                <MessageSubmitButton type="submit" disabled={isNewMessageEmpty()}>
                    <SendOutlined
                        style={{
                            fontSize: '20px',
                            color: !isNewMessageEmpty() ? '#3E54AC' : '#BDCDD6'
                        }}
                    />
                </MessageSubmitButton>
            </SendMessageForm>
        </ChatbotContainer>
    );
};

const ChatbotContainer = styled.div`
    position: fixed;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 350px;
    height: 400px;
    margin-right: 35px;
    margin-bottom: 35px;
    border-radius: 25px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`;

const ListOfMessagesContainer = styled.div`
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const MessageSentByBot = styled.div`
    display: inline-block;
    background-color: #f5f5f5;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 15px;
    max-width: 200px;
`;

const MessageSentByUser = styled.div`
    display: inline-block;
    margin-left: auto;
    background-color: #3e54ac;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 15px;
    max-width: 200px;
`;

const SendMessageForm = styled.form`
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 15px 0;
    height: 45px;
`;

const MessageInputContainer = styled.input`
    border: none;
    margin-left: 20px;
    outline: none;
    width: 260px;
`;

const MessageSubmitButton = styled.button`
    display: flex;
    justify-content: center;
    margin: 0 10px;
    float: right;
    border: none;
    background-color: white;
    cursor: pointer;
`;
