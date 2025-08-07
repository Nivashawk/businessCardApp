// AnimatedCard.js
import React from 'react';
import { useAnimatedStyle, useDerivedValue, interpolate, withTiming } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { Card } from './CardStack'; // Assuming you extract the Card component
import { STACK_OFFSET_X, STACK_OFFSET_Y, STACK_ROTATE, STACK_SCALE_DIFF } from './CardStack';

const AnimatedCard = ({ card, index, totalCards, cards, translateX }) => {
  const { width: windowWidth } = useWindowDimensions();

  // useDerivedValue must be at the top level of a component
  const currentStackIndex = useDerivedValue(() => {
    return cards.findIndex(c => c.id === card.id);
  }, [cards, card.id]);

  const animatedStyle = useAnimatedStyle(() => {
    const isTopCard = currentStackIndex.value === 0;

    const topCardOffsetX = isTopCard ? translateX.value : 0;
    const topCardRotation = isTopCard ? interpolate(
      translateX.value,
      [-windowWidth / 2, windowWidth / 2],
      [-10, 10],
      'clamp'
    ) : 0;

    const stackTranslateX = interpolate(
      currentStackIndex.value,
      [0, 1, 2, totalCards],
      [0, STACK_OFFSET_X, STACK_OFFSET_X * 2, STACK_OFFSET_X * 2],
      'clamp'
    );
    const stackTranslateY = interpolate(
      currentStackIndex.value,
      [0, 1, 2, totalCards],
      [0, STACK_OFFSET_Y, STACK_OFFSET_Y * 2, STACK_OFFSET_Y * 2],
      'clamp'
    );
    const stackScale = interpolate(
      currentStackIndex.value,
      [0, 1, 2, totalCards],
      [1, 1 - STACK_SCALE_DIFF, 1 - STACK_SCALE_DIFF * 2, 1 - STACK_SCALE_DIFF * 2],
      'clamp'
    );
    const stackRotate = interpolate(
      currentStackIndex.value,
      [0, 1, 2, totalCards],
      [0, -STACK_ROTATE, -STACK_ROTATE * 2, -STACK_ROTATE * 2],
      'clamp'
    );
    const stackOpacity = interpolate(
      currentStackIndex.value,
      [0, 1, 2, totalCards],
      [1, 0.85, 0.7, 0.7],
      'clamp'
    );

    return {
      position: 'absolute',
      transform: [
        { translateX: stackTranslateX + topCardOffsetX },
        { translateY: stackTranslateY },
        { scale: stackScale },
        { rotateZ: `${stackRotate + topCardRotation}deg` },
      ],
      opacity: stackOpacity,
      zIndex: totalCards - currentStackIndex.value,
    };
  }, [cards, card, translateX, windowWidth, totalCards]);

  return (
    <ReanimatedAnimated.View style={animatedStyle}>
      <Card
        card={card}
        isActive={currentStackIndex.value === 0}
        index={index}
        totalCards={totalCards}
      />
    </ReanimatedAnimated.View>
  );
};

export default AnimatedCard;