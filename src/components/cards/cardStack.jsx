// CardStack.js
import React, {useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {formatCompanyName, truncateText} from '../../utlis/stringHandler';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import Editicon from '../../../assets/edit.svg';
import EmptyLogo from '../../../assets/emptylogo.svg';
import PhoneIcon from '../../../assets/phone.png';
import MailIcon from '../../../assets/mailIcon.png';
import Facebook from '../../../assets/socialIcons/facebook.svg';
import Instagram from '../../../assets/socialIcons/instagram.svg';
import LinkedIn from '../../../assets/socialIcons/linkedIn.svg';
import Telegram from '../../../assets/socialIcons/telegram.svg';
import Whatsapp from '../../../assets/socialIcons/whatsapp.svg';

const {width, height} = Dimensions.get('window');

const CARD_DATA = [
  {
    id: 1,
    company: 'ZEDBYTE SOFWARE SOLUTIONS',
    tagline:
      'entrust us with the management of your internet business and forget about it entrust us with the management of your internet business and forget about it',
    contact: '1234567890',
    email: 'tech@example.com',
  },
  {
    id: 2,
    company: 'Design Studio',
    tagline: 'Creativity Unleashed',
    contact: '9876543210',
    email: 'design@example.com',
  },
  {
    id: 3,
    company: 'Startup Inc.',
    tagline: 'Sky is the Limit',
    contact: '4561237890',
    email: 'startup@example.com',
  },
];

const Card = React.memo(({card, style}) => (
  <Animated.View style={[styles.card, style]}>
    <View style={[styles.header]}>
      <View style={[styles.headerLeft]}>
        <EmptyLogo width={50} height={50} />
        <Animated.Text
          style={[typography.heading, styles.title]}
          numberOfLines={2}
          ellipsizeMode="tail">
          {formatCompanyName(card.company)}
        </Animated.Text>
      </View>
      <Editicon width={20} height={20} />
    </View>
    <View style={styles.descriptionContainer}>
      <Animated.Text style={[typography.description, styles.tagline]}>
        {truncateText(card.tagline, 70)}
      </Animated.Text>
    </View>
    <View style={styles.contactContainer}>
      <View style={styles.contact1}>
        <Animated.Image source={PhoneIcon} />
        <Animated.Text style={[typography.inputText]}>{card.contact}</Animated.Text>
      </View>
      <View style={styles.contact2}>
        <Animated.Image source={MailIcon} />
        <Animated.Text style={[typography.inputText]}>{card.email}</Animated.Text>
      </View>
    </View>
    <View style={styles.socialContainer}>
      <Animated.View style={styles.socialleftContainer}>
        <View style={styles.socialBg}>
          <Facebook width={20} height={20} />
          <Instagram width={20} height={20} />
          <LinkedIn width={20} height={20} />
          <Telegram width={20} height={20} />
          <Whatsapp width={20} height={20} />
        </View>
      </Animated.View>
      <Animated.View style={styles.socialrightContainer}>
        <Animated.Text style={[typography.description]}>Primary</Animated.Text>
      </Animated.View>
    </View>
  </Animated.View>
));

const CardStack = () => {
  const [cards, setCards] = useState(CARD_DATA);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const moveTopCardToBack = useCallback(() => {
    setCards(prev => {
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  }, []);

  const rotateZ = useDerivedValue(() => `${offsetX.value / 20}deg`);

  const pan = Gesture.Pan()
    .onUpdate(e => {
      offsetX.value = e.translationX;
      offsetY.value = e.translationY;
    })
    .onEnd(e => {
      if (Math.abs(e.translationX) > 100) {
        offsetX.value = withTiming(
          e.translationX > 0 ? width : -width,
          {duration: 200},
          () => {
            offsetX.value = 0;
            offsetY.value = 0;
            runOnJS(moveTopCardToBack)();
          },
        );
      } else {
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
      }
    });

  const renderTopCard = () => {
    if (cards.length === 0) return null;
    const card = cards[0];

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {translateX: offsetX.value},
        {translateY: offsetY.value},
        {rotateZ: rotateZ.value},
      ],
    }));

    return (
      <GestureDetector gesture={pan}>
        <Card card={card} style={[animatedStyle, styles.topCard]} />
      </GestureDetector>
    );
  };

  return (
    <View style={styles.container}>
      {cards.slice(1).map((card, index) => (
        <Card
          key={card.id}
          card={card}
          style={[styles.card, {top: (index + 1) * -20, zIndex: -index}]}
        />
      ))}
      {renderTopCard()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.001,
    // flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  card: {
    marginTop: height * 0.06,
    width: width * 0.95,
    height: height * 0.3,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    height: '30%',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  descriptionContainer: {
    width:'80%',
    height: '30%',
    alignItems: 'flex-start',
    justifyContent:'center',
    // flexShrink: 1,
    // flexWrap: 'wrap',
    // backgroundColor: 'grey',
  },
  contactContainer: {
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems:'center',
    gap: 20,
  },
  contact1: {
    flexDirection: 'row',
    gap: 5,
  },
  contact2: {
    flexDirection: 'row',
    gap: 5,
  },
  socialContainer: {
    width: '100%',
    height: '25%',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-evenly',
    // backgroundColor: 'blue',
  },
  socialleftContainer: {
    width: '60%',
    // alignItems: 'center',
    // justifyContent:"flex-start",
    // backgroundColor: 'blue',
    flexWrap:'wrap'
  },
  socialBg: {
    padding: 8,
    borderRadius: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 15,
    backgroundColor: colors.primary,
  },
  socialrightContainer: {
    width: '40%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  topCard: {
    zIndex: 1,
  },
  title: {
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 25,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default CardStack;
