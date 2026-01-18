import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  TextInput, 
  Modal, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import QuickActionModal from '../components/QuickActionModal';

const { width, height } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const scrollViewRef = useRef(null);
  const sidebarAnimation = useRef(new Animated.Value(-width * 0.8)).current;

  const conversations = [
    { 
      id: 1, 
      title: 'Headache symptoms', 
      lastMessage: 'Based on your symptoms, it could be tension headache...', 
      time: '2h ago',
      messages: [
        { id: 1, text: 'I have been having headaches for the past 3 days', sender: 'user', timestamp: '10:30 AM' },
        { id: 2, text: 'I understand you\'re experiencing headaches. Can you describe the pain - is it throbbing, sharp, or dull? And where exactly do you feel it?', sender: 'ai', timestamp: '10:31 AM' },
        { id: 3, text: 'It\'s a dull pain on both sides of my head, feels like pressure', sender: 'user', timestamp: '10:32 AM' },
        { id: 4, text: 'Based on your symptoms, it could be tension headache. Have you been under stress lately or spending long hours at a computer?', sender: 'ai', timestamp: '10:33 AM' }
      ]
    },
    { 
      id: 2, 
      title: 'Heart health check', 
      lastMessage: 'Your heart rate seems normal for your age group...', 
      time: '1d ago',
      messages: [
        { id: 1, text: 'I want to check my heart health', sender: 'user', timestamp: 'Yesterday 2:15 PM' },
        { id: 2, text: 'I\'d be happy to help you with heart health information. Can you tell me your age and if you have any specific concerns?', sender: 'ai', timestamp: 'Yesterday 2:16 PM' }
      ]
    },
    { 
      id: 3, 
      title: 'Medication reminder', 
      lastMessage: 'Don\'t forget to take your medication at 8 PM...', 
      time: '3d ago',
      messages: [
        { id: 1, text: 'Can you help me set up medication reminders?', sender: 'user', timestamp: '3 days ago 11:20 AM' },
        { id: 2, text: 'Of course! I can help you set up medication reminders. What medication do you need reminders for?', sender: 'ai', timestamp: '3 days ago 11:21 AM' }
      ]
    },
  ];

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

  const emergencyContacts = [
    { 
      name: 'Emergency Services', 
      phone: '911', 
      description: 'Life-threatening emergencies', 
      urgent: true,
      icon: '🚨'
    },
    { 
      name: 'Rwanda Emergency', 
      phone: '912', 
      description: 'National emergency line', 
      urgent: true,
      icon: '🇷🇼'
    },
    { 
      name: 'Poison Control', 
      phone: '1-800-222-1222', 
      description: 'Poisoning emergencies', 
      urgent: false,
      icon: '☠️'
    },
    { 
      name: 'Mental Health Crisis', 
      phone: '988', 
      description: '24/7 crisis support', 
      urgent: false,
      icon: '🧠'
    },
  ];

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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand you're experiencing symptoms. Let me help you analyze them. Can you provide more details about when these symptoms started and their severity?",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const handleQuickAction = (action) => {
    setShowQuickAction(action);
  };

  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversation(null);
    setShowSidebar(false);
    setShowProfile(false); // Reset profile dropdown
  };

  const handleSelectConversation = (conversation) => {
    setMessages(conversation.messages);
    setCurrentConversation(conversation);
    setShowSidebar(false);
    setShowProfile(false); // Reset profile dropdown
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
            
            <ScrollView style={styles.conversationsList}>
              {conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={[
                    styles.conversationItem,
                    currentConversation?.id === conversation.id && styles.activeConversation
                  ]}
                  onPress={() => handleSelectConversation(conversation)}
                >
                  <Text style={styles.conversationTitle}>{conversation.title}</Text>
                  <Text style={styles.conversationPreview} numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                  <Text style={styles.conversationTime}>{conversation.time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Bottom section with proper spacing */}
            <View style={styles.bottomSection}>
              {/* Emergency button */}
              <TouchableOpacity 
                style={styles.sidebarEmergencyButton}
                onPress={() => {
                  setShowEmergency(true);
                  setShowSidebar(false);
                }}
              >
                <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.sidebarEmergencyGradient}>
                  <Text style={styles.sidebarEmergencyText}>🚨 Emergency Contacts</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Profile dropdown menu items - only show when profile is clicked */}
              {showProfile && (
                <View style={styles.profileDropdown}>
                  <TouchableOpacity style={styles.dropdownItem}>
                    <Text style={styles.dropdownIcon}>📱</Text>
                    <Text style={styles.dropdownText}>Download mobile App</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => setShowSettings(true)}
                  >
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
              
              {/* User info at very bottom - clickable to show dropdown */}
              <TouchableOpacity 
                style={styles.userInfoContainer}
                onPress={() => setShowProfile(!showProfile)}
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
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  const renderEmergencyModal = () => (
    <Modal
      visible={showEmergency}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEmergency(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.emergencyModal}>
          <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.emergencyHeader}>
            <Text style={styles.emergencyIcon}>⚠️</Text>
            <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowEmergency(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>
          
          <ScrollView style={styles.emergencyContent}>
            <View style={styles.emergencyInfo}>
              <Text style={styles.emergencyInfoTitle}>When to Call Emergency Services</Text>
              <Text style={styles.emergencyInfoText}>
                Call immediately if you experience: chest pain, difficulty breathing, severe bleeding, 
                loss of consciousness, severe allergic reactions, or any life-threatening emergency.
              </Text>
            </View>
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity key={index} style={styles.emergencyContact}>
                <View style={styles.emergencyContactHeader}>
                  <Text style={styles.emergencyContactIcon}>{contact.icon}</Text>
                  <View style={styles.emergencyContactInfo}>
                    <Text style={styles.emergencyContactName}>{contact.name}</Text>
                    {contact.urgent && (
                      <Text style={styles.urgentBadge}>URGENT</Text>
                    )}
                    <Text style={styles.emergencyContactDesc}>{contact.description}</Text>
                    <Text style={styles.emergencyContactPhone}>{contact.phone}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            
            <View style={styles.additionalResources}>
              <Text style={styles.resourcesTitle}>Additional Resources</Text>
              <TouchableOpacity style={styles.resourceButton}>
                <Text style={styles.resourceButtonText}>🏥 Find Nearest Hospital</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resourceButton}>
                <Text style={styles.resourceButtonText}>🚑 Urgent Care Locator</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.rwandaNote}>
              Emergency services in Rwanda: Police (112), Fire (113), Medical (114)
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
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

          {/* Modals */}
          {renderSidebar()}
          {renderEmergencyModal()}
          
          {/* Quick Action Modal */}
          <QuickActionModal
            visible={showQuickAction !== null}
            actionType={showQuickAction}
            onClose={() => setShowQuickAction(null)}
            onSubmit={(data) => {
              // Handle quick action submission
              console.log('Quick action data:', data);
              setShowQuickAction(null);
            }}
          />
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
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    padding: 8,
    width: 40,
  },
  menuIcon: {
    fontSize: 18,
    color: '#374151',
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
    fontSize: 18,
    marginRight: 6,
  },
  headerLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 11,
    color: '#6B7280',
  },
  headerRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    backgroundColor: '#3B82F6',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  brandBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
    gap: 12,
  },
  quickActionCard: {
    width: '47%',
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  quickActionGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  quickActionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: '#6B7280',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    maxHeight: 80,
    paddingVertical: 6,
  },
  heartButton: {
    padding: 6,
    marginLeft: 6,
  },
  heartIcon: {
    fontSize: 18,
  },
  sendButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginLeft: 6,
  },
  sendGradient: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  // Sidebar Styles
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#1F2937',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#9CA3AF',
    fontSize: 20,
  },
  newConversationButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newConversationGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  newConversationText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  activeConversation: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  conversationTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  conversationPreview: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  conversationTime: {
    color: '#6B7280',
    fontSize: 10,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 20,
    marginTop: 20,
  },
  sidebarEmergencyButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sidebarEmergencyGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  sidebarEmergencyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileDropdown: {
    backgroundColor: '#374151',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#4B5563',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#374151',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  },
  userStatus: {
    color: '#10B981',
    fontSize: 12,
  },
  expandButton: {
    padding: 4,
  },
  expandIcon: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  // Emergency Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  emergencyContent: {
    padding: 20,
  },
  emergencyInfo: {
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emergencyInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  emergencyInfoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  emergencyContact: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  emergencyContactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emergencyContactIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 4,
  },
  emergencyContactInfo: {
    flex: 1,
    gap: 4,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  emergencyContactDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  emergencyContactPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  additionalResources: {
    marginTop: 20,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  resourceButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resourceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  rwandaNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default DashboardScreen;