import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import MyChat from '@/components/chat/mychat';
import OtherChat from '@/components/chat/otherchat';
import EntryNotice from '@/components/chat/entryNotice';
import ExitNotice from '@/components/chat/exitNotice';
import ChatAlert from '@/components/chat/chatAlert';
import { JoinersData, LeaverData, Message } from '@/@types/types';
import { useRouter } from 'next/router';
import { CLIENT_URL } from '../../apis/constant';
import styles from './Chat.module.scss';
import styles2 from '../../components/chat/Chat.module.scss';
import ChatroomHeader from '../../components/chat/header';
import Footer from '@/components/chat/footer';

export default function Chat() {
  const router = useRouter();
  const { chatId } = router.query;

  const [, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiN2ZiMTExZTpmaXJlIiwiaWF0IjoxNjk5ODU5NzQ0LCJleHAiOjE3MDA0NjQ1NDR9.6HgHtjDxO6trBsxj-BCVTCHlE69zt05uEn2Mn7OhQNY';
    //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiN2ZiMTExZTp1c2VyMyIsImlhdCI6MTY5OTUzMzExMiwiZXhwIjoxNzAwMTM3OTEyfQ.4eslctzcBGQAwkcKT97IbF0i-9-MZ0kvhjY4A6sK8Wo';

    useEffect(() => {
      socketInit();
  }, []);

  const socket = io(`wss://fastcampus-chat.net/chat?chatId=${chatId}`, {
      extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
          serverId: `${process.env.NEXT_PUBLIC_API_KEY}`,
      },
  });

  const socketInit = () => {
      socket.on('connect', () => {
          console.log('Socket connected');
      });

      socket.emit('fetch-messages');

      socket.on('messages-to-client', (messageObject) => {
          setMessages(messageObject.messages);
      });

      socket.on('message-to-client', (messageObject) => {
          setMessages((prevMessages) => [...prevMessages, messageObject]);
      });

      socket.on('disconnect', () => {
          console.log('Socket disconnected');
      });

      //socket.emit('users');

      // socket.on('users-to-client', (data) => {
      //     console.log(data, 'users-to-client');
      // });

      // socket.on('join', (data) => {
      //     console.log(data, 'join');
      //     
      // });
      // socket.on('leave', (data) => {
      //     console.log(data, 'leave');
      //     
      // });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <ChatroomHeader chatId={chatId} />
      <div className={styles.container}>
        <div className={styles.container}>
          <EntryNotice />
          <ExitNotice />
          <div>
            {messages.map(msg => (
              <MyChat key={msg.id} msg={msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
          {showAlert && <ChatAlert />}
        </div>
      </div>
      <Footer socket={socket}/>
    </>
  );
}
