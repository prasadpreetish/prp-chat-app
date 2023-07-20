import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null)

  const customToolbar = [
    ['bold', 'italic', 'strike'], // Add 'strike' for strikethrough
    // [{ 'script': 'sub' }, { 'script': 'super' }],
    ['blockquote'],
    [{ 'list': 'bullet' }, { 'list': 'ordered' }], // 'bullet' for bulleted list and 'ordered' for numbered list
    // [{ 'indent': '-1' }, { 'indent': '+1' }],
    // [{ 'align': [] }],
    ['link', 'image'],
    ['code', 'code-block'], // 'code' for inline code and 'code-block' for code block
    // ['file'], // Custom format for file upload
    // ['emoji'], // Custom format for emoji
    ['clean'],
  ];

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }

      console.log(messageData)

      await socket.emit("send_message", messageData)
      setCurrentMessage("")
    }

  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log(data)
      setMessageList((list) => {
        return [...list, data]
      })
    })
    return () => {
      socket.off("receive_message", (data) => {
        console.log(data)
      })
    }

  }, [socket])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [messageList])


  return (
    <div className='chat-page'>
      <div className="chat-header">
        <p>
          Live Chat
        </p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent) => {
          return (
            <div className='dialog-box'>
              <div dangerouslySetInnerHTML={{ __html: messageContent.message }} className="dialog-container" />
              <div className="dialog-details">
                <div className="dialog-author">
                  {messageContent.author.substring(0,1)}
                </div>
                <div>
                  &nbsp;
                </div>
                <div className="dialog-time">
                  {messageContent.time}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messageEndRef} className='forviewonly'/>
      </div>

      <div className="chat-footer">
        {/* <input type="text" placeholder='Hey... enter your message here' onChange={(e)=>{setCurrentMessage(e.target.value)}}/> */}

        <ReactQuill theme="snow" value={currentMessage} onChange={setCurrentMessage} modules={{
          toolbar: customToolbar,
          clipboard: {
            matchVisual: false, // Allows pasting formatted text without matching the toolbar
          },
        }} />
        <button onClick={sendMessage} className='send-chat-btn'>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat