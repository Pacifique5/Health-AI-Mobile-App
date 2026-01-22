import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  TextInput, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Animated
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { 
  getConversations, 
  createConversation, 
  addMessage, 
  deleteConversation,
  analyzeSymptoms 
} from '../config/api';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation, route }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const sidebarAnimation = useRef(new Animated.Value(-width * 0.8)).current;

  const quickActions = [
    { 
      id: 1, 
      title: 'Check symptoms', 
      icon: '🔍', 
      color: ['#3B82F6', '#06B6D4'], 
      type: 'symptoms' 
    },
    { 
      id: 2, 
      title: 'Heart health', 
      icon: '❤️', 
      color: ['#EF4444', '#EC4899'], 
      type: 'heart' 
    },
    { 
      id: 3, 
      title: 'Preventive care', 
      icon: '🛡️', 
      color: ['#10B981', '#059669'], 
      type: 'preventive' 
    },
    { 
      id: 4, 
      title: 'Medication reminder', 
      icon: '⏰', 
      color: ['#8B5CF6', '#7C3AED'], 
      type: 'medication' 
    },
  ];


  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (showSidebar) {
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarAnimation, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSidebar]);

  useEffect(() => {
    // Handle navigation from sidebar
    if (route.params?.newConversation) {
      setMessages([]);
      setCurrentConversation(null);
      setShowSidebar(false);
      // Clear the parameter to prevent repeated execution
      navigation.setParams({ newConversation: undefined });
    } else if (route.params?.selectedConversation) {
      const conversation = route.params.selectedConversation;
      setMessages(conversation.messages);
      setCurrentConversation(conversation);
      setShowSidebar(false);
      // Clear the parameter to prevent repeated execution
      navigation.setParams({ selectedConversation: undefined });
    }
  }, [route.params]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data.map(conv => ({
        ...conv,
        time: formatTime(conv.updatedAt),
        messages: conv.messages || []
      })));
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1d ago';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, newMessage]);
    const userInput = inputText;
    setInputText('');
    setIsTyping(true);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      let conversationId = currentConversation?.id;
      
      // Create new conversation if none exists
      if (!conversationId) {
        const title = userInput.length > 30 ? userInput.substring(0, 30) + '...' : userInput;
        const newConv = await createConversation(title);
        conversationId = newConv.id;
        setCurrentConversation(newConv);
        await loadConversations(); // Refresh conversations list
      }

      // Add user message to conversation
      await addMessage(conversationId, userInput, 'user');

      // Get AI response from symptom analysis
      const aiResponse = await analyzeSymptoms(userInput);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.message,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Add AI message to conversation
      await addMessage(conversationId, aiResponse.message, 'ai');
      
      setMessages(prev => [...prev, aiMessage]);
      await loadConversations(); // Refresh conversations list
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickAction = (action) => {
    navigation.navigate('QuickAction', { actionType: action });
  };

  const handleNewConversation = async () => {
    setMessages([]);
    setCurrentConversation(null);
    setShowSidebar(false);
    setShowProfile(false);
  };

  const handleSelectConversation = async (conversation) => {
    try {
      // Convert backend message format to frontend format
      const formattedMessages = conversation.messages.map(msg => ({
        id: msg.id,
        text: msg.content,
        sender: msg.sender,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      
      setMessages(formattedMessages);
      setCurrentConversation(conversation);
      setShowSidebar(false);
      setShowProfile(false);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      Alert.alert('Error', 'Failed to load conversation');
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteConversation(conversationId);
              await loadConversations();
              if (currentConversation?.id === conversationId) {
                setMessages([]);
                setCurrentConversation(null);
              }
            } catch (error) {
              console.error('Error deleting conversation:', error);
              Alert.alert('Error', 'Failed to delete conversation');
            }
          }
        },
      ]
    );
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
            navigation.replace('Login');
          }
        },
      ]
    );
  };

  const renderSidebar = () => (
    <Modal
      visible={showSidebar}
      transparent
      animationType="none"
      onRequestClose={() => setShowSidebar(false)}
    >
      <TouchableOpacity 
        style={styles.sidebarOverlay}
        activeOpacity={1}
        onPress={() => setShowSidebar(false)}
      >
        <Animated.View 
          style={[
            styles.sidebar,
            { transform: [{ translateX: sidebarAnimation }] }
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>All Conversations</Text>
              <TouchableOpacity onPress={() => setShowSidebar(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.newConversationButton}
              onPress={handleNewConversation}
            >
              <LinearGradient colors={['#10B981', '#059669']} style={styles.newConversationGradient}>
                <Text style={styles.newConversationText}>+ New Conversation</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading conversations...</Text>
                </View>
              ) : conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <View key={conversation.id} style={styles.conversationItemContainer}>
                    <TouchableOpacity
                      style={[
                        styles.conversationItem,
                        currentConversation?.id === conversation.id && styles.activeConversation
                      ]}
                      onPress={() => handleSelectConversation(conversation)}
                    >
                      <Text style={styles.conversationTitle}>{conversation.title}</Text>
                      <Text style={styles.conversationPreview} numberOfLines={1}>
                        {conversation.lastMessage || 'No messages yet'}
                      </Text>
                      <Text style={styles.conversationTime}>{conversation.time}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteConversation(conversation.id)}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.noConversations}>
                  <Text style={styles.noConversationsText}>No conversations yet</Text>
                  <Text style={styles.noConversationsSubtext}>Start a new conversation to see it here</Text>
                </View>
              )}
            </ScrollView>
            
            {/* Bottom section */}
            <View style={styles.bottomSection}>
              {/* Emergency Contacts Button */}
              <TouchableOpacity 
                style={styles.emergencyContactsButton}
                onPress={() => {
                  navigation.navigate('EmergencyContacts');
                  setShowSidebar(false);
                }}
              >
                <View style={styles.emergencyAvatar}>
                  <Text style={styles.emergencyAvatarText}>🚨</Text>
                </View>
                <View style={styles.emergencyDetails}>
                  <Text style={styles.emergencyName}>Emergency Contacts</Text>
                  <Text style={styles.emergencyStatus}>Available 24/7</Text>
                </View>
              </TouchableOpacity>
              
              {/* User info - clickable to show dropdown */}
              <TouchableOpacity 
                style={styles.userInfoContainer}
                onPress={toggleProfile}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user?.username || 'Admin User'}</Text>
                  <Text style={styles.userStatus}>Online</Text>
                </View>
                <View style={styles.expandButton}>
                  <Text style={[styles.expandIcon, { transform: [{ rotate: showProfile ? '180deg' : '0deg' }] }]}>⌃</Text>
                </View>
              </TouchableOpacity>
              
              {/* Profile dropdown menu items */}
              {showProfile && (
                <View style={styles.profileDropdown}>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text style={styles.dropdownIcon}>⚙️</Text>
                    <Text style={styles.dropdownText}>Settings</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text style={styles.dropdownIcon}>✉️</Text>
                    <Text style={styles.dropdownText}>Contact us</Text>
                  </TouchableOpacity>
                  <View style={styles.dropdownDivider} />
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={handleLogout}
                  >
                    <Text style={styles.dropdownIcon}>🚪</Text>
                    <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Log out</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.messageAvatar}>
        <Text style={styles.messageAvatarText}>🤖</Text>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <Animated.View style={[styles.typingDot]} />
          <Animated.View style={[styles.typingDot]} />
          <Animated.View style={[styles.typingDot]} />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.background}>
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setShowSidebar(true)}
            >
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>🤖</Text>
                <Text style={styles.headerLogo}>SymptomAI</Text>
              </View>
              <View style={styles.onlineIndicator}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Online</Text>
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandBadgeText}>FIQUE'S-AI</Text>
              </View>
            </View>
          </View>

          {/* Chat Area */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
          >
            {messages.length === 0 ? (
              // Empty State
              <ScrollView contentContainerStyle={styles.emptyState} showsVerticalScrollIndicator={false}>
                <View style={styles.welcomeSection}>
                  <View style={styles.welcomeIconContainer}>
                    <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.welcomeIconGradient}>
                      <Text style={styles.welcomeIconText}>💬</Text>
                    </LinearGradient>
                  </View>
                  <Text style={styles.welcomeTitle}>Welcome to SymptomAI</Text>
                  <Text style={styles.welcomeSubtitle}>
                    I'm here to help you understand your symptoms and provide health insights. 
                    How can I assist you today?
                  </Text>
                </View>
                
                <View style={styles.quickActionsGrid}>
                  {quickActions.map((action) => (
                    <TouchableOpacity
                      key={action.id}
                      style={styles.quickActionCard}
                      onPress={() => handleQuickAction(action)}
                    >
                      <LinearGradient colors={action.color} style={styles.quickActionGradient}>
                        <Text style={styles.quickActionIcon}>{action.icon}</Text>
                        <Text style={styles.quickActionTitle}>{action.title}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            ) : (
              // Messages
              <ScrollView 
                ref={scrollViewRef}
                style={styles.messagesContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.messagesContent}
              >
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageWrapper,
                      message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
                    ]}
                  >
                    <View style={styles.messageAvatar}>
                      <Text style={styles.messageAvatarText}>
                        {message.sender === 'user' ? '👤' : '🤖'}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.messageBubble,
                        message.sender === 'user' ? styles.userMessage : styles.aiMessage,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          message.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
                        ]}
                      >
                        {message.text}
                      </Text>
                      <Text style={[
                        styles.messageTime,
                        message.sender === 'user' ? styles.userMessageTime : styles.aiMessageTime
                      ]}>
                        {message.timestamp}
                      </Text>
                    </View>
                  </View>
                ))}
                {isTyping && renderTypingIndicator()}
              </ScrollView>
            )}
          </KeyboardAvoidingView>

          {/* Input Footer */}
          <View style={styles.inputFooter}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                multiline
              />
              <TouchableOpacity style={styles.heartButton}>
                <Text style={styles.heartIcon}>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSendMessage}
              >
                <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.sendGradient}>
                  <Text style={styles.sendIcon}>➤</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>
              SymptomAI provides health information, not medical advice. Consult healthcare professionals for medical concerns.
            </Text>
          </View>

          {/* Sidebar */}
          {renderSidebar()}
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  logoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: 0.5,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    backgroundColor: '#3B82F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  chatContainer: {
    flex: 1,
  },
  emptyState: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeIconContainer: {
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 20,
  },
  welcomeIconGradient: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeIconText: {
    fontSize: 35,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  quickActionCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 16,
  },
  quickActionGradient: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userMessage: {
    backgroundColor: '#8B5CF6',
  },
  aiMessage: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiMessageTime: {
    color: '#9CA3AF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '70%',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 2,
  },
  inputFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 8,
  },
  heartButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  heartIcon: {
    fontSize: 18,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 8,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
    fontStyle: 'italic',
  },
  // Sidebar Styles - Slide from left, 80% width with curves
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#1E293B',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    color: '#94A3B8',
    fontSize: 20,
    padding: 4,
  },
  newConversationButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  newConversationGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  newConversationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  conversationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  conversationItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  activeConversation: {
    backgroundColor: '#334155',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  conversationTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  conversationPreview: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  conversationTime: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '500',
  },
  noConversations: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  noConversationsText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noConversationsSubtext: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  emergencyContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#334155',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 60,
  },
  emergencyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyDetails: {
    flex: 1,
  },
  emergencyName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  emergencyStatus: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 60,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userStatus: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  expandButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  expandIcon: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileDropdown: {
    backgroundColor: '#334155',
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 85, 105, 0.5)',
    minHeight: 48,
  },
  dropdownIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
    flex: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#475569',
    marginVertical: 2,
  },
});

export default DashboardScreen;