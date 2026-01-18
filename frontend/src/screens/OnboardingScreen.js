import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef(null);

  const pages = [
    {
      id: 1,
      title: 'Welcome to SymptomAI',
      subtitle: 'Your AI-powered health assistant',
      icon: '🤖',
      description: 'Get instant health insights and personalized care recommendations powered by advanced AI technology.',
    },
    {
      id: 2,
      title: 'Powerful Health Features',
      subtitle: 'Everything you need in one app',
      features: [
        { icon: '🔍', title: 'Symptom Analysis', color: ['#3B82F6', '#06B6D4'] },
        { icon: '❤️', title: 'Heart Health', color: ['#EF4444', '#EC4899'] },
        { icon: '🛡️', title: 'Preventive Care', color: ['#10B981', '#059669'] },
        { icon: '⏰', title: 'Medication Reminders', color: ['#8B5CF6', '#7C3AED'] },
      ],
    },
    {
      id: 3,
      title: 'Ready to Start?',
      subtitle: 'Join thousands of users',
      benefits: [
        '24/7 AI-powered assistance',
        'Instant symptom analysis',
        '100% secure and private',
      ],
    },
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const handleGetStarted = () => {
    navigation.replace('Signup');
  };

  const handleSignIn = () => {
    navigation.replace('Login');
  };

  const renderPage = (page, index) => {
    return (
      <View key={page.id} style={styles.page}>
        {page.id === 1 && (
          <View style={styles.pageContent}>
            <View style={styles.iconContainer}>
              <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.iconGradient}>
                <Text style={styles.pageIcon}>{page.icon}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.pageTitle}>{page.title}</Text>
            <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
            <Text style={styles.pageDescription}>{page.description}</Text>
          </View>
        )}

        {page.id === 2 && (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>{page.title}</Text>
            <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
            <View style={styles.featuresGrid}>
              {page.features.map((feature, idx) => (
                <View key={idx} style={styles.featureCard}>
                  <LinearGradient colors={feature.color} style={styles.featureGradient}>
                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        )}

        {page.id === 3 && (
          <View style={styles.pageContent}>
            <Text style={styles.pageTitle}>{page.title}</Text>
            <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
            <View style={styles.benefitsList}>
              {page.benefits.map((benefit, idx) => (
                <View key={idx} style={styles.benefitItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#F8FAFC', '#E0F2FE', '#E0E7FF']} style={styles.container}>
      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const page = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentPage(page);
        }}
        style={styles.scrollView}
      >
        {pages.map((page, index) => renderPage(page, index))}
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentPage < pages.length - 1 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.nextGradient}>
                <Text style={styles.nextText}>Next</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.finalButtons}>
              <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
                <LinearGradient colors={['#3B82F6', '#06B6D4']} style={styles.getStartedGradient}>
                  <Text style={styles.getStartedText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pageContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIcon: {
    fontSize: 64,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  pageSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  pageDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  featureCard: {
    width: '45%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitsList: {
    alignItems: 'flex-start',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    fontSize: 20,
    color: '#10B981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#3B82F6',
    width: 24,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  nextGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  finalButtons: {
    width: '100%',
    gap: 12,
  },
  getStartedButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  getStartedGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;