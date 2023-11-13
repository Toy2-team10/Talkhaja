import { useState } from 'react';
import styles2 from '../../components/chat/Chat.module.scss';

interface MessageContainerProps {
  socket: any;
}

export default function Footer(props: MessageContainerProps) {

  const [message, setMessage] = useState<string>('');

    function MessageSend(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (message != '') {
            props.socket.emit('message-to-server', message);
            setMessage('');
        }
    }
  return (
    <form className={styles2.footer} onSubmit={MessageSend}>
        <input
          type="text"
          placeholder="대화를 시작해보세요!"
          className={styles2.chatInput}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className={styles2.triangle_button}
          type="submit"
          aria-label="Submit"
        />
      </form>
  );
}
