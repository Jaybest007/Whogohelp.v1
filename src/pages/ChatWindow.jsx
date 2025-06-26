import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BsSendFill } from 'react-icons/bs';
import { RiCheckDoubleLine } from 'react-icons/ri';

import bg from '../assets/bgg.png';
import pic from '../assets/profile_pic.jpg';

function ChatWindow() {
  const { chat_id, receiver } = useParams();
  const { dashboardData, setChatActive } = useDashboard();
  const loggedInUser = dashboardData?.username;

  const [chatDetail, setChatDetail] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState({ sender: '', text: '' });
  const [error, setError] = useState({ sender: '', text: '' });
  const [status, setStatus] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const messagesEndRef = useRef(null);
  const errandTitle = dashboardData?.ongoingErrands.find(errand => errand.errand_Id === chatDetail?.errand_id)?.title
  const reward = dashboardData?.ongoingErrands.find(errand => errand.errand_Id === chatDetail?.errand_id)?.reward


  // Set document title
  useEffect(() => {
    document.title = 'Chat - WhoGoHelp';
  }, []);


  // Fetch chat detail on mount
  useEffect(() => {
    if (!chat_id || !loggedInUser) return;

    fetchConversation();

    axios
      .post('http://localhost/api//messages.php', {
        action: 'fetch_by_chat_id',
        chat_id,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => setChatDetail(res.data))
      .catch((err) => console.error('Chat fetch error:', err));
  }, [chat_id, loggedInUser]);

  // Scroll to bottom on conversation update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Poll presence status
  useEffect(() => {
    if (!receiver || !loggedInUser) return;

    const intervalId = setInterval(() => {
      axios
        .post('http://localhost/api//messages.php', {
          action: 'update_status',
          username: loggedInUser,
          receiver,
        }, {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
          setStatus(res.data.status);
          setLastSeen(res.data.last_seen);
        })
        .catch(() => toast.error('Error fetching status'));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [loggedInUser, receiver]);

 useEffect(() => {
  if (!chat_id || chatDetail?.status !== "active") return;

  const intervalId = setInterval(() => {
    fetchConversation();
    markAsRead();
  }, 5000);

  return () => clearInterval(intervalId);
}, [chat_id, chatDetail?.status]);


  // Mark as read once on mount
  useEffect(() => {
    markAsRead();
  }, []);



  //==fetch conversationb(messages)
  function fetchConversation() {
    axios
      .post('http://localhost/api//messages.php', {
        action: 'fetch_conversation',
        chat_id,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setConversations(res.data);
        } else {
          toast.error('Unexpected server response');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        toast.error('Failed to load messages');
      });
  }


  // ===mark as read
  function markAsRead() {
    axios
      .post('http://localhost/api//messages.php', {
        action: 'mark_as_read',
        chat_id,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .catch((err) =>
        console.log('Failed to mark notifications as read:', err)
      );
  }


  // ==== send messages====
  function sendMessage() {

    if(chatDetail?.status === "closed") return;
    const { sender, text } = message;
    const newError = {
      sender: sender.trim() ? '' : 'Sender is required!!',
      text: text.trim() ? '' : 'Write a message to send',
    };
    setError(newError);

    if (Object.values(newError).some((e) => e !== '')) return;

    axios
      .post('http://localhost/api//messages.php', {
        action: 'send_message',
        chat_id,
        sender,
        receiver,
        message: text,
        user_status: status,
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => {
        if (res.data?.success) {
          setMessage({ sender: '', text: '' });
          setTimeout(() => fetchConversation(), 300);
        } else {
          toast.error(`Message failed to send: ${res.data?.message}`);
        }
      })
      .catch((err) => {
        console.error('Send message error:', err);
        toast.error('Send message error');
      });
  }


  return (
    <div className="flex justify-center bg-gray-100 min-h-screen ">
      <div className="w-full max-w-2xl flex flex-col h-screen bg-orange-50 text-black shadow-lg border border-gray-200"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top Bar */}
       <div className="fixed top-16 left-0 right-0 z-40 px-4 py-3 bg-white border-b border-gray-300 shadow-sm">
          <Link
            to={`/profile/${
              chatDetail?.poster_username === loggedInUser
                ? chatDetail?.helper_username
                : chatDetail?.poster_username
            }`}
            className="flex items-center gap-3"
          >
            <img
              src={pic}
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-orange-600">
                {chatDetail?.poster_username === loggedInUser
                  ? chatDetail?.helper_username
                  : chatDetail?.poster_username}
              </span>
              <span className="text-sm flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span className={status === "online" ? "text-green-500" : "text-gray-500"}>
                  {status === "online"
                    ? "Online"
                    : lastSeen
                      ? `Last seen at ${new Date(lastSeen).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}`
                      : "Offline"}

                </span>
              </span>
            </div>
          </Link>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col p-4 space-y-4 pt-37">
          <div className="bg-gray-800 text-gray-100 rounded-lg px-4 py-3 mb-4 text-sm shadow-sm max-w-xl mx-auto">
              <p className="text-orange-400 font-semibold">Chat Room for errand • {chatDetail?.errand_id}</p>
              <p>{errandTitle || "Untitled Errand"} — <span className="text-green-400 font-medium">₦{Number(reward || 0).toLocaleString()}</span></p>
            </div>

            {[...conversations]
              .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at)) 
              .slice(-30)
              .map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender_username === loggedInUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg shadow text-sm ${
                      msg.sender_username === loggedInUser
                        ? "bg-gray-100 text-black"
                        : "bg-orange-200 text-black"
                    }`}
                  >
                    <p>{msg.message_text}</p>

                    {msg.sent_at && (
                      <span className="text-[10px] text-gray-500 mt-1 flex items-center justify-end space-x-1">
                        <span>
                          {
                            (() => {
                              const [hours, minutes] = msg.sent_at.split(' ')[1].split(':');
                              const h = parseInt(hours);
                              const ampm = h >= 12 ? 'PM' : 'AM';
                              const formattedHour = h % 12 || 12;
                              return `${formattedHour}:${minutes} ${ampm}`;
                            })()
                          }
                        </span>
                        {msg.sender_username === loggedInUser && (
                          <RiCheckDoubleLine
                            className={`inline-block ${msg.is_read ? 'text-blue-700' : 'text-gray-400'}`}
                            size={15}
                          />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}

            <div ref={messagesEndRef}></div>
        </div>



        {/* Input Section */}
        <div className="px-4 py-3 bg-white border-t border-gray-300 flex items-center space-x-2">
          {chatDetail?.status === 'active' ? 
          <>
          <input
            type="text"
            placeholder="Type your message..."
            value={message.text}
            onChange={(event) =>
              setMessage(prev => ({
                ...prev,
                text: event.target.value,
                sender: loggedInUser,
                
              }))
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400"
          /> 

          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            onClick={sendMessage}
          >
            <BsSendFill size={25} />
          </button>
          </>
          : <input type='text' disabled value="Chat closed" />  }
          
          
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
