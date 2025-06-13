import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Modal, Dropdown, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function ChatSystem() {
  const { user } = useAuth();
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isTyping, setIsTyping] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [fileUpload, setFileUpload] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    type: 'public',
    category: 'general'
  });

  useEffect(() => {
    initializeChat();
    loadRooms();
    loadOnlineUsers();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      simulateTyping();
      updateOnlineUsers();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeRoom) {
      loadMessages(activeRoom);
    }
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = () => {
    // Initialize with some mock messages
    const initialMessages = {
      general: [
        {
          id: '1',
          user: 'Dr. Rajesh Kumar',
          role: 'faculty',
          message: 'Welcome to the general discussion room!',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          reactions: { '👍': 5, '❤️': 2 }
        },
        {
          id: '2',
          user: 'Arjun Sharma',
          role: 'student',
          message: 'Thank you professor! Excited to be here.',
          timestamp: new Date(Date.now() - 3000000),
          type: 'text',
          reactions: { '👍': 3 }
        }
      ],
      'cs-students': [
        {
          id: '3',
          user: 'Priya Patel',
          role: 'student',
          message: 'Has anyone started working on the database assignment?',
          timestamp: new Date(Date.now() - 1800000),
          type: 'text',
          reactions: { '🤔': 4 }
        }
      ],
      'study-group': [
        {
          id: '4',
          user: 'Rahul Kumar',
          role: 'student',
          message: 'Study session for tomorrow\'s exam at 7 PM in library?',
          timestamp: new Date(Date.now() - 900000),
          type: 'text',
          reactions: { '📚': 6, '👍': 8 }
        }
      ]
    };
    setMessages(initialMessages);
  };

  const loadRooms = () => {
    const mockRooms = [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'General campus discussions',
        type: 'public',
        category: 'general',
        memberCount: 1247,
        isActive: true,
        lastActivity: new Date()
      },
      {
        id: 'cs-students',
        name: 'CS Students',
        description: 'Computer Science students discussion',
        type: 'public',
        category: 'academic',
        memberCount: 456,
        isActive: true,
        lastActivity: new Date(Date.now() - 1800000)
      },
      {
        id: 'study-group',
        name: 'Study Group',
        description: 'Collaborative study sessions',
        type: 'public',
        category: 'study',
        memberCount: 89,
        isActive: true,
        lastActivity: new Date(Date.now() - 900000)
      },
      {
        id: 'placement-prep',
        name: 'Placement Preparation',
        description: 'Job placement discussions and tips',
        type: 'public',
        category: 'career',
        memberCount: 234,
        isActive: true,
        lastActivity: new Date(Date.now() - 3600000)
      },
      {
        id: 'research-hub',
        name: 'Research Hub',
        description: 'Research discussions and collaborations',
        type: 'public',
        category: 'research',
        memberCount: 67,
        isActive: true,
        lastActivity: new Date(Date.now() - 7200000)
      }
    ];
    setRooms(mockRooms);
  };

  const loadOnlineUsers = () => {
    const mockUsers = [
      { id: '1', name: 'Dr. Rajesh Kumar', role: 'faculty', status: 'online', avatar: '👨‍🏫' },
      { id: '2', name: 'Arjun Sharma', role: 'student', status: 'online', avatar: '👨‍🎓' },
      { id: '3', name: 'Priya Patel', role: 'student', status: 'online', avatar: '👩‍🎓' },
      { id: '4', name: 'Prof. Sarah Wilson', role: 'faculty', status: 'away', avatar: '👩‍🏫' },
      { id: '5', name: 'Rahul Kumar', role: 'student', status: 'online', avatar: '👨‍🎓' },
      { id: '6', name: 'Sneha Reddy', role: 'student', status: 'busy', avatar: '👩‍🎓' }
    ];
    setOnlineUsers(mockUsers);
  };

  const loadMessages = (roomId) => {
    // Messages are already loaded in initializeChat
    // In a real app, this would fetch messages for the specific room
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileUpload) return;

    const message = {
      id: Date.now().toString(),
      user: user?.username || 'Anonymous',
      role: user?.role || 'student',
      message: newMessage,
      timestamp: new Date(),
      type: fileUpload ? 'file' : 'text',
      file: fileUpload ? {
        name: fileUpload.name,
        size: fileUpload.size,
        type: fileUpload.type
      } : null,
      reactions: {}
    };

    setMessages(prev => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), message]
    }));

    setNewMessage('');
    setFileUpload(null);
    
    // Simulate message delivery
    toast.success('Message sent!');
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev => ({
      ...prev,
      [activeRoom]: prev[activeRoom].map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...msg, reactions };
        }
        return msg;
      })
    }));
  };

  const createRoom = () => {
    if (!newRoom.name.trim()) {
      toast.error('Room name is required');
      return;
    }

    const room = {
      id: newRoom.name.toLowerCase().replace(/\s+/g, '-'),
      ...newRoom,
      memberCount: 1,
      isActive: true,
      lastActivity: new Date()
    };

    setRooms(prev => [...prev, room]);
    setShowCreateRoom(false);
    setNewRoom({ name: '', description: '', type: 'public', category: 'general' });
    toast.success('Room created successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setFileUpload(file);
      toast.info(`File "${file.name}" ready to send`);
    }
  };

  const simulateTyping = () => {
    const typingUsers = ['Arjun Sharma', 'Priya Patel'];
    const randomUser = typingUsers[Math.floor(Math.random() * typingUsers.length)];
    
    setIsTyping(prev => ({ ...prev, [activeRoom]: randomUser }));
    
    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [activeRoom]: null }));
    }, 2000);
  };

  const updateOnlineUsers = () => {
    // Simulate users going online/offline
    setOnlineUsers(prev => prev.map(user => ({
      ...user,
      status: Math.random() > 0.8 ? 'away' : user.status
    })));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getRoomIcon = (category) => {
    const icons = {
      general: 'fas fa-comments',
      academic: 'fas fa-graduation-cap',
      study: 'fas fa-book',
      career: 'fas fa-briefcase',
      research: 'fas fa-flask'
    };
    return icons[category] || 'fas fa-comments';
  };

  const getStatusColor = (status) => {
    const colors = {
      online: 'success',
      away: 'warning',
      busy: 'danger',
      offline: 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'];

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Sidebar - Rooms and Users */}
        <Col md={3}>
          {/* Room List */}
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                Chat Rooms
              </h6>
              <Button variant="light" size="sm" onClick={() => setShowCreateRoom(true)}>
                <i className="fas fa-plus"></i>
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Form.Control
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 border-bottom"
              />
              
              <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredRooms.map(room => (
                  <ListGroup.Item
                    key={room.id}
                    action
                    active={activeRoom === room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="d-flex align-items-center">
                        <i className={`${getRoomIcon(room.category)} me-2 text-primary`}></i>
                        <div>
                          <div className="fw-bold">{room.name}</div>
                          <small className="text-muted">{room.memberCount} members</small>
                        </div>
                      </div>
                    </div>
                    {messages[room.id] && messages[room.id].length > 0 && (
                      <Badge bg="danger" pill>
                        {messages[room.id].length}
                      </Badge>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Online Users */}
          <Card>
            <Card.Header className="bg-success text-white">
              <h6 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Online Users ({onlineUsers.filter(u => u.status === 'online').length})
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {onlineUsers.map(user => (
                  <ListGroup.Item
                    key={user.id}
                    action
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserProfile(true);
                    }}
                    className="d-flex align-items-center"
                  >
                    <div className="me-2" style={{ fontSize: '1.2rem' }}>
                      {user.avatar}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{user.name}</div>
                      <small className="text-muted">{user.role}</small>
                    </div>
                    <Badge bg={getStatusColor(user.status)} className="ms-2">
                      {user.status}
                    </Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Chat Area */}
        <Col md={9}>
          <Card style={{ height: '600px' }}>
            <Card.Header className="bg-info text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    <i className={`${getRoomIcon(rooms.find(r => r.id === activeRoom)?.category)} me-2`}></i>
                    {rooms.find(r => r.id === activeRoom)?.name || 'Select a room'}
                  </h5>
                  <small>
                    {rooms.find(r => r.id === activeRoom)?.memberCount} members
                  </small>
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm">
                    <i className="fas fa-cog"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <i className="fas fa-info-circle me-2"></i>
                      Room Info
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <i className="fas fa-bell me-2"></i>
                      Notifications
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <i className="fas fa-search me-2"></i>
                      Search Messages
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Leave Room
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>

            {/* Messages Area */}
            <Card.Body style={{ height: '450px', overflowY: 'auto' }} className="p-3">
              {messages[activeRoom]?.map(message => (
                <div key={message.id} className="mb-3">
                  <div className="d-flex align-items-start">
                    <div className="me-2">
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold`}
                        style={{ 
                          width: '40px', 
                          height: '40px', 
                          backgroundColor: message.role === 'faculty' ? '#28a745' : '#007bff'
                        }}
                      >
                        {message.user.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span className="fw-bold me-2">{message.user}</span>
                        <Badge bg={message.role === 'faculty' ? 'success' : 'primary'} className="me-2">
                          {message.role}
                        </Badge>
                        <small className="text-muted">
                          {message.timestamp.toLocaleTimeString()}
                        </small>
                      </div>
                      
                      <div className="message-content">
                        {message.type === 'text' ? (
                          <p className="mb-1">{message.message}</p>
                        ) : (
                          <div className="file-message p-2 border rounded">
                            <i className="fas fa-file me-2"></i>
                            <span>{message.file.name}</span>
                            <small className="text-muted ms-2">
                              ({(message.file.size / 1024).toFixed(1)} KB)
                            </small>
                          </div>
                        )}
                      </div>

                      {/* Reactions */}
                      <div className="d-flex align-items-center mt-1">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                          <Button
                            key={emoji}
                            variant="outline-secondary"
                            size="sm"
                            className="me-1 py-0 px-1"
                            onClick={() => addReaction(message.id, emoji)}
                          >
                            {emoji} {count}
                          </Button>
                        ))}
                        
                        <Dropdown>
                          <Dropdown.Toggle variant="link" size="sm" className="text-muted p-0">
                            <i className="fas fa-smile"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <div className="p-2" style={{ width: '200px' }}>
                              {emojis.map(emoji => (
                                <Button
                                  key={emoji}
                                  variant="link"
                                  className="p-1"
                                  onClick={() => addReaction(message.id, emoji)}
                                >
                                  {emoji}
                                </Button>
                              ))}
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping[activeRoom] && (
                <div className="text-muted small">
                  <i className="fas fa-circle text-success me-1" style={{ fontSize: '8px' }}></i>
                  {isTyping[activeRoom]} is typing...
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </Card.Body>

            {/* Message Input */}
            <Card.Footer>
              {fileUpload && (
                <Alert variant="info" className="py-2 mb-2">
                  <i className="fas fa-file me-2"></i>
                  Ready to send: {fileUpload.name}
                  <Button
                    variant="link"
                    size="sm"
                    className="text-danger p-0 ms-2"
                    onClick={() => setFileUpload(null)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </Alert>
              )}
              
              <Form onSubmit={sendMessage}>
                <div className="d-flex align-items-center">
                  <Button
                    variant="outline-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="me-2"
                  >
                    <i className="fas fa-paperclip"></i>
                  </Button>
                  
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="me-2"
                  />
                  
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" className="me-2">
                      <i className="fas fa-smile"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className="p-2" style={{ width: '200px' }}>
                        {emojis.map(emoji => (
                          <Button
                            key={emoji}
                            variant="link"
                            className="p-1"
                            onClick={() => setNewMessage(prev => prev + emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                  
                  <Button type="submit" variant="primary">
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </div>
              </Form>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Create Room Modal */}
      <Modal show={showCreateRoom} onHide={() => setShowCreateRoom(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus me-2"></i>
            Create New Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Room Name *</Form.Label>
              <Form.Control
                type="text"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                placeholder="Enter room name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                placeholder="Describe the purpose of this room"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Room Type</Form.Label>
                  <Form.Select
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newRoom.category}
                    onChange={(e) => setNewRoom({...newRoom, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="academic">Academic</option>
                    <option value="study">Study</option>
                    <option value="career">Career</option>
                    <option value="research">Research</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateRoom(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={createRoom}>
            <i className="fas fa-plus me-2"></i>
            Create Room
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Profile Modal */}
      <Modal show={showUserProfile} onHide={() => setShowUserProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user me-2"></i>
            User Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="text-center">
              <div style={{ fontSize: '4rem' }} className="mb-3">
                {selectedUser.avatar}
              </div>
              <h4>{selectedUser.name}</h4>
              <Badge bg={selectedUser.role === 'faculty' ? 'success' : 'primary'} className="mb-3">
                {selectedUser.role}
              </Badge>
              <div className="mb-3">
                <Badge bg={getStatusColor(selectedUser.status)}>
                  {selectedUser.status}
                </Badge>
              </div>
              <Button variant="primary" className="me-2">
                <i className="fas fa-comment me-2"></i>
                Send Message
              </Button>
              <Button variant="outline-primary">
                <i className="fas fa-user-plus me-2"></i>
                Add Friend
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ChatSystem;
