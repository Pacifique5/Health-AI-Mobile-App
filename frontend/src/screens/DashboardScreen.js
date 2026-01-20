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
import { BlurView } from 'expo-blur';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
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
    navigation.navigate('QuickAction', { actionType: action });
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
              {/* Emergency Contacts Button - Separate from admin user */}
              <TouchableOpacity 
                style={styles.emergencyContactsButton}
                onPress={() => {
                  setShowEmergency(true);
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
              
              {/* User info at very bottom - clickable to show dropdown */}
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
      <BlurView intensity={20} style={styles.modalOverlay}>
        <View style={styles.emergencyModal}>
          <LinearGradient colors={['#DC2626', '#EF4444']} style={styles.emergencyHeader}>
            <Text style={styles.emergencyIcon}>🚨</Text>
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
              <Text style={styles.emergencyInfoTitle}>⚠️ When to Call Emergency Services</Text>
              <Text style={styles.emergencyInfoText}>
                Call immediately if you experience: chest pain, difficulty breathing, severe bleeding, 
                loss of consciousness, severe allergic reactions, or any life-threatening emergency.
              </Text>
            </View>
            
            {emergencyContacts.map((contact, index) => (
              <TouchableOpacity key={index} style={styles.emergencyContact}>
                <View style={styles.emergencyContactInfo}>
                  <Text style={styles.emergencyContactName}>{contact.name}</Text>
                  {contact.urgent && (
                    <Text style={styles.urgentBadge}>URGENT</Text>
                  )}
                  <Text style={styles.emergencyContactDesc}>{contact.description}</Text>
                </View>
                <View style={styles.emergencyContactPhoneBadge}>
                  <Text style={styles.emergencyContactPhoneText}>{contact.phone}</Text>
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
            
            <View style={styles.rwandaNote}>
              <Text style={styles.rwandaNoteText}>
                🏥 For immediate life-threatening emergencies, call 116 immediately.
                Emergency services in Rwanda: Police (112), Fire (113), Medical (114)
              </Text>
            </View>
          </ScrollView>
        </View>
      </BlurView>
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
  // Sidebar Styles - Clean and Professional
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sidebar: {
    width: width * 0.90,
    height: '100%',
    backgroundColor: '#1E293B',
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sidebarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    color: '#94A3B8',
    fontSize: 24,
    padding: 4,
  },
  newConversationButton: {
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  newConversationGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  newConversationText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  conversationItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
  },
  activeConversation: {
    backgroundColor: '#334155',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  conversationTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  conversationPreview: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  conversationTime: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  bottomSection: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  emergencyContactsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#334155',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 80,
  },
  emergencyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emergencyDetails: {
    flex: 1,
  },
  emergencyName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  emergencyStatus: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  profileDropdown: {
    backgroundColor: '#334155',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(71, 85, 105, 0.5)',
    minHeight: 60,
  },
  dropdownIcon: {
    fontSize: 20,
    marginRight: 20,
    width: 28,
    textAlign: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
    flex: 1,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#475569',
    marginVertical: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#334155',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 80,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  userStatus: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  expandButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  expandIcon: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Emergency Modal Styles - Full Screen
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  emergencyModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: 10,
  },
  emergencyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  emergencyTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalCloseButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emergencyContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emergencyInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderLeftWidth: 6,
    borderLeftColor: '#F59E0B',
  },
  emergencyInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
  },
  emergencyInfoText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  emergencyContact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 6,
    borderLeftColor: '#EF4444',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 100,
  },
  emergencyContactInfo: {
    flex: 1,
  },
  emergencyContactName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  emergencyContactDesc: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  emergencyContactPhoneBadge: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emergencyContactPhoneText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  additionalResources: {
    marginTop: 40,
    paddingTop: 32,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  resourcesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  resourceButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 28,
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minHeight: 64,
    justifyContent: 'center',
  },
  resourceButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  rwandaNote: {
    backgroundColor: '#DBEAFE',
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
    marginBottom: 60,
    borderLeftWidth: 6,
    borderLeftColor: '#3B82F6',
  },
  rwandaNoteText: {
    fontSize: 16,
    color: '#1E40AF',
    lineHeight: 24,
  },
});

export default DashboardScreen;