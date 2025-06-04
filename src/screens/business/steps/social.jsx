import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity,
  Switch
} from 'react-native';
import {useSelector} from 'react-redux';
import {colors} from '../../../theme/colors';
import {typography} from '../../../theme/typography';

import InstagramIcon from '../../../../assets/socialIcons/instagram.svg';
import LinkedInIcon from '../../../../assets/socialIcons/linkedIn.svg';
import TwitterIcon from '../../../../assets/socialIcons/twitter.svg';
import FacebookIcon from '../../../../assets/socialIcons/facebook.svg';
import YoutubeIcon from '../../../../assets/socialIcons/youtube.svg';
import BusinessIcon from '../../../../assets/socialIcons/business.svg';

// Enhanced SocialInputBox component with visible toggle
const SocialInputBox = ({
  IconComponent,
  label,
  placeholder,
  value,
  onChangeText,
  isEnabled,
  onToggle,
  keyboardType = 'default'
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputHeader}>
        <View style={styles.labelContainer}>
          <IconComponent width={24} height={24} />
          <Text style={styles.label}>{label}</Text>
        </View>
        
        {/* Toggle Switch - Now Clearly Visible */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={onToggle}
            trackColor={{
              false: '#E0E0E0',
              true: colors.primary + '80' // 50% opacity
            }}
            thumbColor={isEnabled ? colors.primary : '#F4F3F4'}
            ios_backgroundColor="#E0E0E0"
          />
        </View>
      </View>
      
      {/* Input Field - Only enabled when toggle is on */}
      <TextInput
        style={[
          styles.textInput,
          !isEnabled && styles.disabledInput
        ]}
        placeholder={placeholder}
        placeholderTextColor={isEnabled ? '#999' : '#CCC'}
        value={value}
        onChangeText={isEnabled ? onChangeText : undefined}
        editable={isEnabled}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const Social = forwardRef((props, ref) => {
  const businessData = useSelector(state => state.businessData);

  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [business, setBusiness] = useState('');

  const [enabled, setEnabled] = useState({
    instagram: false,
    linkedin: false,
    twitter: false,
    facebook: false,
    youtube: false,
    business: false,
  });

  useEffect(() => {
    if (businessData) {
      setInstagram(businessData.social_insta || '');
      setLinkedin(businessData.social_linkedin || '');
      setTwitter(businessData.social_twitter || '');
      setFacebook(businessData.social_fb || '');
      setYoutube(businessData.social_youtube || '');
      setBusiness(businessData.social_google_business || '');

      // Auto-enable toggles if there's existing data
      setEnabled({
        instagram: !!businessData.social_insta,
        linkedin: !!businessData.social_linkedin,
        twitter: !!businessData.social_twitter,
        facebook: !!businessData.social_fb,
        youtube: !!businessData.social_youtube,
        business: !!businessData.social_google_business,
      });
    }
  }, [businessData]);

  // Clear input when toggle is disabled
  const handleToggle = (platform) => {
    const newEnabled = {...enabled, [platform]: !enabled[platform]};
    setEnabled(newEnabled);
    
    // Clear the input if toggling off
    if (!newEnabled[platform]) {
      switch(platform) {
        case 'instagram': setInstagram(''); break;
        case 'linkedin': setLinkedin(''); break;
        case 'twitter': setTwitter(''); break;
        case 'facebook': setFacebook(''); break;
        case 'youtube': setYoutube(''); break;
        case 'business': setBusiness(''); break;
      }
    }
  };

  // This exposes the getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => ({
      instagram: enabled.instagram ? instagram : '',
      linkedin: enabled.linkedin ? linkedin : '',
      twitter: enabled.twitter ? twitter : '',
      facebook: enabled.facebook ? facebook : '',
      youtube: enabled.youtube ? youtube : '',
      business: enabled.business ? business : '',
    }),
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Social Media Links</Text>
        <Text style={styles.sectionSubtitle}>
          Enable and add links to your social media profiles
        </Text>
      </View>

      <SocialInputBox
        IconComponent={InstagramIcon}
        label="Instagram"
        placeholder="https://instagram.com/username"
        value={instagram}
        onChangeText={setInstagram}
        isEnabled={enabled.instagram}
        onToggle={() => handleToggle('instagram')}
      />
      
      <SocialInputBox
        IconComponent={LinkedInIcon}
        label="LinkedIn"
        placeholder="https://linkedin.com/in/username"
        value={linkedin}
        onChangeText={setLinkedin}
        isEnabled={enabled.linkedin}
        onToggle={() => handleToggle('linkedin')}
      />
      
      <SocialInputBox
        IconComponent={TwitterIcon}
        label="Twitter"
        placeholder="https://twitter.com/username"
        value={twitter}
        onChangeText={setTwitter}
        isEnabled={enabled.twitter}
        onToggle={() => handleToggle('twitter')}
      />
      
      <SocialInputBox
        IconComponent={FacebookIcon}
        label="Facebook"
        placeholder="https://facebook.com/username"
        value={facebook}
        onChangeText={setFacebook}
        isEnabled={enabled.facebook}
        onToggle={() => handleToggle('facebook')}
      />
      
      <SocialInputBox
        IconComponent={YoutubeIcon}
        label="YouTube"
        placeholder="https://youtube.com/channel/..."
        value={youtube}
        onChangeText={setYoutube}
        isEnabled={enabled.youtube}
        onToggle={() => handleToggle('youtube')}
      />
      
      <SocialInputBox
        IconComponent={BusinessIcon}
        label="Google Business"
        placeholder="https://business.google.com/..."
        value={business}
        onChangeText={setBusiness}
        isEnabled={enabled.business}
        onToggle={() => handleToggle('business')}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
    color: '#999',
  },
});

export default Social;