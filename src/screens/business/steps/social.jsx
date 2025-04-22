import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SocialInputBox from '../../../components/inputs/socialInputBox';

import InstagramIcon from '../../../../assets/socialIcons/instagram.svg';
import TelegramIcon from '../../../../assets/socialIcons/telegram.svg';
import LinkedInIcon from '../../../../assets/socialIcons/linkedIn.svg';
import WhatsappIcon from '../../../../assets/socialIcons/whatsapp.svg';

const Social = () => {
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const [enabled, setEnabled] = useState({
    instagram: false,
    linkedin: false,
    telegram: false,
    whatsapp: false,
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SocialInputBox
        IconComponent={InstagramIcon}
        label="Instagram"
        placeholder="Enter Link"
        value={instagram}
        onChangeText={setInstagram}
        isEnabled={enabled.instagram}
        onToggle={() => setEnabled({ ...enabled, instagram: !enabled.instagram })}
      />

      <SocialInputBox
        IconComponent={LinkedInIcon}
        label="LinkedIn"
        placeholder="Enter Link"
        value={linkedin}
        onChangeText={setLinkedin}
        isEnabled={enabled.linkedin}
        onToggle={() => setEnabled({ ...enabled, linkedin: !enabled.linkedin })}
      />

      <SocialInputBox
        IconComponent={TelegramIcon}
        label="Telegram"
        placeholder="Enter Link"
        value={telegram}
        onChangeText={setTelegram}
        isEnabled={enabled.telegram}
        onToggle={() => setEnabled({ ...enabled, telegram: !enabled.telegram })}
      />

      <SocialInputBox
        IconComponent={WhatsappIcon}
        label="WhatsApp"
        placeholder="Enter Number"
        keyboardType="phone-pad"
        value={whatsapp}
        onChangeText={setWhatsapp}
        isEnabled={enabled.whatsapp}
        onToggle={() => setEnabled({ ...enabled, whatsapp: !enabled.whatsapp })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
});

export default Social;
