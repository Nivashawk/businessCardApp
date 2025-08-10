import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const NFCCardPage = () => {
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.back(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    startShimmerAnimation();
    startPulseAnimation();
    startRotateAnimation();
    startFloatAnimation();
  }, []);

  const startShimmerAnimation = () => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startRotateAnimation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const startFloatAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleBuyNow = () => {
    const purchaseURL = 'https://thumps.app/shop';
    
    Alert.alert(
      'Visit Our Store',
      'You will be redirected to our online store where you can explore all NFC card options, customize your design, and complete your purchase.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Visit Store',
          onPress: () => Linking.openURL(purchaseURL),
        },
      ]
    );
  };

  const features = [
    {
      icon: '⚡',
      title: 'Instant Sharing',
      description: 'Share your complete business profile with just one tap on any smartphone',
    },
    {
      icon: '📱',
      title: 'No App Required',
      description: 'Works with all NFC-enabled devices without requiring any special apps',
    },
    {
      icon: '🔄',
      title: 'Always Updated',
      description: 'Update your information anytime and it reflects instantly on your card',
    },
    {
      icon: '🎨',
      title: 'Custom Design',
      description: 'Personalize your card with your brand colors, logo, and unique design',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your data is encrypted and you control what information to share',
    },
    {
      icon: '🌍',
      title: 'Global Compatibility',
      description: 'Works worldwide with all modern smartphones and devices',
    },
  ];

  const benefits = [
    {
      title: 'Professional First Impression',
      description: 'Stand out at networking events and meetings with cutting-edge technology',
      emoji: '💼',
    },
    {
      title: 'Eco-Friendly Solution',
      description: 'Replace hundreds of paper business cards with one reusable NFC card',
      emoji: '🌱',
    },
    {
      title: 'Never Run Out',
      description: 'Always have your business card ready - no more "sorry, I ran out of cards"',
      emoji: '♾️',
    },
    {
      title: 'Track Your Networking',
      description: 'Get insights on how often your card is shared and accessed',
      emoji: '📊',
    },
  ];

  const cardOptions = [
    {
      name: 'Standard NFC Card',
      price: '₹500',
      originalPrice: '₹1,500',
      features: ['Premium NFC chip', 'Professional finish', 'Custom design', 'Basic analytics', 'Instant setup'],
      color: ['#2d2d2d', '#1a1a1a'],
      popular: true,
      savings: '67% OFF',
    },
    // {
    //   name: 'Bulk Order (10+ Cards)',
    //   price: '₹450',
    //   priceNote: 'per card',
    //   originalPrice: '₹500',
    //   features: ['All standard features', 'Volume discount', 'Team management', 'Priority support', 'Custom packaging'],
    //   color: [colors.gold, colors.goldDark],
    //   savings: '10% OFF',
    // },
    {
      name: 'Enterprise Package',
      price: 'Custom Pricing',
      priceNote: 'contact us',
      features: ['Unlimited cards', 'White-label solution', 'Advanced analytics', 'API integration', '24/7 dedicated support', 'Custom features'],
      color: ['#C0C0C0', '#808080'],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>NFC Business Cards</Text>
            <Text style={styles.headerSubtitle}>Starting at just ₹500 per card</Text>
          </View>
        </Animated.View>

        {/* Hero Section with Demo Card */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.15)', 'rgba(146, 141, 171, 0.1)', 'transparent']}
            style={styles.heroGradient}
          >
            <Text style={styles.heroTitle}>
              Share Your Business{'\n'}
              <Text style={styles.heroHighlight}>In One Tap</Text>
            </Text>
            <Text style={styles.heroSubtitle}>
              Revolutionary NFC technology that transforms how you network and share your professional information
            </Text>

            {/* Price Highlight */}
            <View style={styles.priceHighlight}>
              <Text style={styles.priceHighlightText}>Starting at just</Text>
              <Text style={styles.priceHighlightAmount}>₹500</Text>
              <Text style={styles.priceHighlightNote}>per card</Text>
            </View>

            {/* Demo NFC Card */}
            <Animated.View
              style={[
                styles.demoCard,
                {
                  transform: [
                    {scale: pulseAnim},
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[colors.gold, colors.goldDark]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.demoCardGradient}
              >
                {/* Shimmer effect */}
                <Animated.View
                  style={[
                    styles.shimmerOverlay,
                    {
                      transform: [
                        {
                          translateX: shimmerAnim.interpolate({
                            inputRange: [-1, 1],
                            outputRange: [-200, 200],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                <View style={styles.demoCardContent}>
                  <View style={styles.demoCardHeader}>
                    <Text style={styles.demoCardTitle}>Your Business</Text>
                    <Text style={styles.demoCardSubtitle}>Professional Card</Text>
                  </View>

                  <View style={styles.nfcChip}>
                    <Animated.View
                      style={[
                        styles.chipIndicator,
                        {
                          transform: [
                            {
                              rotate: rotateAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                              }),
                            },
                          ],
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.cardWaves}>
                    <View style={[styles.wave, styles.wave1]} />
                    <View style={[styles.wave, styles.wave2]} />
                    <View style={[styles.wave, styles.wave3]} />
                  </View>

                  <Text style={styles.nfcText}>TAP TO CONNECT</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* How It Works */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionDescription}>
            Experience the simplest way to share your professional information
          </Text>
          
          <View style={styles.stepsContainer}>
            {[
              {icon: '📱', title: '1. Tap', description: 'Simply tap your NFC card on any smartphone', color: colors.gold},
              {icon: '⚡', title: '2. Connect', description: 'Your profile opens instantly on their device', color: colors.status_green},
              {icon: '🤝', title: '3. Network', description: 'Build meaningful business relationships', color: colors.accent},
            ].map((step, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.stepItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        scale: scaleAnim,
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[`${step.color}20`, `${step.color}10`]}
                  style={styles.stepGradient}
                >
                  <View style={[styles.stepIcon, {backgroundColor: `${step.color}30`}]}>
                    <Text style={styles.stepIconText}>{step.icon}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Key Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <Text style={styles.sectionDescription}>
            Everything you need for professional networking in the digital age
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureItem,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: Animated.multiply(slideAnim, 0.1),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Why Choose NFC Cards?</Text>
          <Text style={styles.sectionDescription}>
            Transform your networking experience with smart technology
          </Text>
          
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.benefitItem,
                  {
                    opacity: fadeAnim,
                    transform: [{scale: scaleAnim}],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255, 215, 0, 0.1)', 'rgba(146, 141, 171, 0.05)']}
                  style={styles.benefitGradient}
                >
                  <Text style={styles.benefitEmoji}>{benefit.emoji}</Text>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Card Options with New Pricing */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Choose Your Package</Text>
          <Text style={styles.sectionDescription}>
            Affordable pricing for professionals and businesses of all sizes
          </Text>
          
          <View style={styles.optionsGrid}>
            {cardOptions.map((option, index) => (
              <View key={index} style={styles.optionCard}>
                <LinearGradient
                  colors={option.color}
                  style={styles.optionCardGradient}
                >
                  {option.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}
                  
                  {option.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{option.savings}</Text>
                    </View>
                  )}
                  
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    
                    <View style={styles.priceContainer}>
                      <View style={styles.priceRow}>
                        <Text style={styles.optionPrice}>{option.price}</Text>
                        {option.priceNote && (
                          <Text style={styles.priceNote}>{option.priceNote}</Text>
                        )}
                      </View>
                      {option.originalPrice && (
                        <Text style={styles.originalPrice}>
                          Was {option.originalPrice}
                        </Text>
                      )}
                    </View>
                    
                    <View style={styles.optionFeatures}>
                      {option.features.map((feature, idx) => (
                        <View key={idx} style={styles.optionFeature}>
                          <View style={styles.optionFeatureDot} />
                          <Text style={styles.optionFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {[
            {
              q: 'What devices are compatible with NFC cards?',
              a: 'NFC cards work with all modern smartphones (iPhone 7+ and Android devices with NFC). No special app installation required.',
            },
            {
              q: 'Can I update my information after purchase?',
              a: 'Yes! You can update your information anytime through your account dashboard, and changes reflect instantly.',
            },
            {
              q: 'How durable are the cards?',
              a: 'Our cards are made with premium materials and are water-resistant, scratch-resistant, and designed to last for years.',
            },
            {
              q: 'Do I need internet to use the card?',
              a: 'The recipient needs internet to view your full profile, but the initial tap and basic contact sharing works offline.',
            },
            {
              q: 'Is there any additional cost after purchase?',
              a: 'No hidden fees! The ₹500 is a one-time payment. You can update your information unlimited times at no extra cost.',
            },
          ].map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>

        {/* Purchase CTA */}
        <Animated.View
          style={[
            styles.purchaseSection,
            {
              opacity: fadeAnim,
              transform: [{scale: scaleAnim}],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 215, 0, 0.1)', 'transparent']}
            style={styles.purchaseGradient}
          >
            <Text style={styles.purchaseTitle}>Ready to Transform Your Networking?</Text>
            <Text style={styles.purchaseSubtitle}>
              Join thousands of professionals who've upgraded to smart business cards
            </Text>
            
            <View style={styles.finalPriceBox}>
              <Text style={styles.finalPriceLabel}>Starting Price</Text>
              <Text style={styles.finalPrice}>₹500</Text>
              <Text style={styles.finalPriceNote}>per NFC card • One-time payment</Text>
            </View>
            
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={handleBuyNow}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.gold, colors.goldDark, colors.gold]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.purchaseButtonGradient}
              >
                <Text style={styles.purchaseButtonText}>Order Your NFC Card</Text>
                <Text style={styles.purchaseButtonIcon}>🛍️</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* <Text style={styles.purchaseNote}>
              Free shipping • 30-day money-back guarantee • 24/7 support
            </Text> */}
          </LinearGradient>
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.text_color_1,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '800',
    color: colors.text_color_1,
  },
  headerSubtitle: {
    ...typography.body2,
    fontSize: 14,
    color: colors.gold,
    marginTop: 4,
    fontWeight: '600',
  },
  heroSection: {
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.heading,
    fontSize: 32,
    fontWeight: '900',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  heroHighlight: {
    color: colors.gold,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  heroSubtitle: {
    ...typography.body,
    fontSize: 16,
    color: colors.text_color_2,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 24,
  },
  priceHighlight: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  priceHighlightText: {
    fontSize: 14,
    color: colors.text_color_2,
    marginBottom: 4,
  },
  priceHighlightAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.gold,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  priceHighlightNote: {
    fontSize: 12,
    color: colors.text_color_2,
    opacity: 0.8,
  },
  demoCard: {
    width: width * 0.7,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  demoCardGradient: {
    flex: 1,
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{skewX: '-20deg'}],
  },
  demoCardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  demoCardHeader: {
    alignItems: 'center',
  },
  demoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    textAlign: 'center',
  },
  demoCardSubtitle: {
    fontSize: 12,
    color: colors.background,
    opacity: 0.8,
    textAlign: 'center',
  },
  nfcChip: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  cardWaves: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  wave: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  wave1: {width: 20},
  wave2: {width: 30},
  wave3: {width: 25},
  nfcText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background,
    textAlign: 'center',
    letterSpacing: 2,
    opacity: 0.9,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text_color_1,
    marginHorizontal: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    ...typography.body,
    fontSize: 16,
    color: colors.text_color_2,
    marginHorizontal: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  howItWorksSection: {
    marginVertical: 32,
  },
  stepsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  stepItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  stepGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepIconText: {
    fontSize: 24,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    color: colors.text_color_2,
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresSection: {
    marginVertical: 32,
    marginHorizontal: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  featureIconText: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text_color_2,
    lineHeight: 20,
    opacity: 0.9,
  },
  benefitsSection: {
    marginVertical: 32,
    marginHorizontal: 16,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  benefitItem: {
    width: (width - 48) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  benefitGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(146, 141, 171, 0.2)',
    borderRadius: 16,
    minHeight: 140,
  },
  benefitEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitDescription: {
    fontSize: 12,
    color: colors.text_color_2,
    textAlign: 'center',
    lineHeight: 16,
  },
  optionsSection: {
    marginVertical: 32,
    marginHorizontal: 16,
  },
  optionsGrid: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionCardGradient: {
    padding: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.status_green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.background,
    letterSpacing: 1,
  },
  savingsBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.status_red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text_color_1,
    letterSpacing: 1,
  },
  optionContent: {
    paddingTop: 8,
  },
  optionName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text_color_1,
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  optionPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gold,
  },
  priceNote: {
    fontSize: 14,
    color: colors.text_color_2,
    fontStyle: 'italic',
  },
  originalPrice: {
    fontSize: 14,
    color: colors.text_color_2,
    textDecorationLine: 'line-through',
    opacity: 0.7,
    marginTop: 2,
  },
  optionFeatures: {
    gap: 8,
  },
  optionFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionFeatureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
  },
  optionFeatureText: {
    fontSize: 13,
    color: colors.text_color_2,
    flex: 1,
  },
  faqSection: {
    marginVertical: 32,
    marginHorizontal: 16,
  },
  faqItem: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(146, 141, 171, 0.2)',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 8,
    lineHeight: 22,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.text_color_2,
    lineHeight: 20,
    opacity: 0.9,
  },
  purchaseSection: {
    marginHorizontal: 16,
    marginVertical: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  purchaseGradient: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 20,
  },
  purchaseTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text_color_1,
    textAlign: 'center',
    marginBottom: 8,
  },
  purchaseSubtitle: {
    fontSize: 16,
    color: colors.text_color_2,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    opacity: 0.9,
  },
  finalPriceBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    width: '100%',
  },
  finalPriceLabel: {
    fontSize: 14,
    color: colors.text_color_2,
    marginBottom: 4,
  },
  finalPrice: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.gold,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  finalPriceNote: {
    fontSize: 12,
    color: colors.text_color_2,
    opacity: 0.8,
    marginTop: 4,
  },
  purchaseButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.gold,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  purchaseButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.5,
  },
  purchaseButtonIcon: {
    fontSize: 18,
  },
  purchaseNote: {
    fontSize: 14,
    color: colors.text_color_2,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default NFCCardPage;