import React, { useState } from 'react';
import styles from './Chat.module.scss';
import { Message } from '../../@types/types';

function MyMessage({ msg }: { msg: Message }) {
  
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const timeString = new Date(msg.createdAt).toLocaleTimeString('ko-KR', options);
  const formattedTime = timeString.replace('오전', '오전 ').replace('오후', '오후 ');
  return (
    <div className={styles.myFlex}>
      <div className={styles.myMessage}>
        <span>{formattedTime}</span>
        <div className={styles.content}>{msg.text}</div>
      </div>
    </div>
  );
}

export default MyMessage;
