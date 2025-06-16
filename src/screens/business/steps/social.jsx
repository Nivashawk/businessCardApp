import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
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
import {useSelector, useDispatch} from 'react-redux';
import {colors} from '../../../theme/colors';
import {typography} from '../../../theme/typography';
import {updateBusinessSocialData} from '../../../redux/slices/business/businessBasic';

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
  console.log(`🎯 SocialInputBox render - ${label}: enabled=${isEnabled}, value="${value}"`);
  
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
  const dispatch = useDispatch();
  const renderCount = useRef(0);
  renderCount.current += 1;

  console.log(`🔄 COMPONENT RENDER #${renderCount.current}`);

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

  // Track Redux data changes
  const prevBusinessData = useRef();
  useEffect(() => {
    if (JSON.stringify(prevBusinessData.current) !== JSON.stringify(businessData)) {
      console.log('🔥 REDUX DATA CHANGED');
      console.log('Previous:', prevBusinessData.current);
      console.log('Current:', businessData);
      prevBusinessData.current = businessData;
    }
  }, [businessData]);

 

  // Initialize from props.initialData if available
  useEffect(() => {
    if (props.initialData) {
      console.log('=== PROPS DATA INITIALIZATION ===');
      console.log('Social component - initialData:', props.initialData);
      
      setInstagram(props.initialData.instagram || '');
      setLinkedin(props.initialData.linkedin || '');
      setTwitter(props.initialData.twitter || '');
      setFacebook(props.initialData.facebook || '');
      setYoutube(props.initialData.youtube || '');
      setBusiness(props.initialData.business || '');
      
      // Set enabled states from initialData
      if (props.initialData.enabled) {
        console.log('Setting enabled from props:', props.initialData.enabled);
        setEnabled(prevEnabled => ({
          ...prevEnabled,
          ...props.initialData.enabled
        }));
      }
    }
  }, [props.initialData]);

  // SIMPLIFIED: Input change handlers WITHOUT Redux dispatch for testing
  const handleInputChange = useCallback((platform, value) => {
    console.log(`=== INPUT CHANGE: ${platform} ===`);
    console.log('New value:', value);
    console.log('Current enabled state for', platform, ':', enabled[platform]);
    
    switch(platform) {
      case 'instagram': 
        setInstagram(value);
        // TEMPORARILY DISABLED FOR TESTING:
        // dispatch(updateBusinessSocialData({ social_insta: value }));
        break;
      case 'linkedin': 
        setLinkedin(value);
        // dispatch(updateBusinessSocialData({ social_linkedin: value }));
        break;
      case 'twitter': 
        setTwitter(value);
        // dispatch(updateBusinessSocialData({ social_twitter: value }));
        break;
      case 'facebook': 
        setFacebook(value);
        // dispatch(updateBusinessSocialData({ social_fb: value }));
        break;
      case 'youtube': 
        setYoutube(value);
        // dispatch(updateBusinessSocialData({ social_youtube: value }));
        break;
      case 'business': 
        setBusiness(value);
        // dispatch(updateBusinessSocialData({ social_google_business: value }));
        break;
    }
  }, [enabled]);

  // SIMPLIFIED: Toggle handler WITHOUT Redux dispatch for testing
  const handleToggle = useCallback((platform) => {
    console.log(`=== TOGGLE EVENT: ${platform} ===`);
    console.log('Current enabled state:', enabled);
    console.log(`Current ${platform} enabled:`, enabled[platform]);
    
    setEnabled(prevEnabled => {
      const newEnabledState = !prevEnabled[platform];
      console.log(`Toggling ${platform} from ${prevEnabled[platform]} to ${newEnabledState}`);
      
      const newEnabled = {...prevEnabled, [platform]: newEnabledState};
      console.log('Previous enabled state:', prevEnabled);
      console.log('New enabled state will be:', newEnabled);
      
      // Clear the input if toggling off
      if (!newEnabledState) {
        console.log(`Clearing ${platform} input because toggling off`);
        switch(platform) {
          case 'instagram': 
            setInstagram('');
            break;
          case 'linkedin': 
            setLinkedin('');
            break;
          case 'twitter': 
            setTwitter('');
            break;
          case 'facebook': 
            setFacebook('');
            break;
          case 'youtube': 
            setYoutube('');
            break;
          case 'business': 
            setBusiness('');
            break;
        }
      }
      
      return newEnabled;
    });
    
    // TEMPORARILY DISABLED FOR TESTING:
    /*
    // Prepare Redux update with enabled state
    const reduxUpdate = {
      [`social_${platform === 'business' ? 'google_business' : platform}_enabled`]: !enabled[platform]
    };
    
    // Update Redux with both enabled state and cleared values
    console.log('Updating Redux with:', reduxUpdate);
    dispatch(updateBusinessSocialData(reduxUpdate));
    */
  }, []);

  // Add effect to log enabled state changes
  useEffect(() => {
    console.log('=== ENABLED STATE CHANGED ===');
    console.log('New enabled state:', enabled);
    console.log('Count of enabled platforms:', Object.values(enabled).filter(Boolean).length);
  }, [enabled]);

  // This exposes the getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => {
      const data = {
        // Social media URLs (only return if enabled)
        instagram: enabled.instagram ? instagram : '',
        linkedin: enabled.linkedin ? linkedin : '',
        twitter: enabled.twitter ? twitter : '',
        facebook: enabled.facebook ? facebook : '',
        youtube: enabled.youtube ? youtube : '',
        business: enabled.business ? business : '',
        // Also return enabled states for persistence
        enabled: enabled,
      };
      
      console.log('Social getData called, returning:', data);
      return data;
    },
    
    validate: () => {
      console.log('=== VALIDATION ===');
      console.log('Social validate called');
      console.log('Current enabled states:', enabled);
      console.log('Current values:', {
        instagram, linkedin, twitter, facebook, youtube, business
      });
      
      // TEMPORARILY DISABLED FOR TESTING:
      /*
      // Update Redux with final data
      const finalData = {
        social_insta: enabled.instagram ? instagram : '',
        social_linkedin: enabled.linkedin ? linkedin : '',
        social_twitter: enabled.twitter ? twitter : '',
        social_fb: enabled.facebook ? facebook : '',
        social_youtube: enabled.youtube : '',
        social_google_business: enabled.business ? business : '',
        // Store enabled states
        social_insta_enabled: enabled.instagram,
        social_linkedin_enabled: enabled.linkedin,
        social_twitter_enabled: enabled.twitter,
        social_fb_enabled: enabled.facebook,
        social_youtube_enabled: enabled.youtube,
        social_google_business_enabled: enabled.business,
      };
      
      console.log('Social validation passed, dispatching data:', finalData);
      dispatch(updateBusinessSocialData(finalData));
      */
      
      return true; // Always valid for social links
    },
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Social Media Links</Text>
        <Text style={styles.sectionSubtitle}>
          Enable and add links to your social media profiles (Redux DISABLED for testing)
        </Text>
      </View>

      {/* Test Controls
      <View style={styles.testContainer}>
        <Text style={styles.testTitle}>🧪 Test Controls</Text>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            console.log('🧪 TEST: Enabling Instagram and LinkedIn');
            setEnabled(prev => ({
              ...prev,
              instagram: true,
              linkedin: true
            }));
          }}
        >
          <Text style={styles.testButtonText}>Enable Instagram + LinkedIn</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={() => {
            console.log('🧪 TEST: Enabling ALL platforms');
            setEnabled({
              instagram: true,
              linkedin: true,
              twitter: true,
              facebook: true,
              youtube: true,
              business: true,
            });
          }}
        >
          <Text style={styles.testButtonText}>Enable ALL</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.testButtonDanger]}
          onPress={() => {
            console.log('🧪 TEST: Disabling ALL platforms');
            setEnabled({
              instagram: false,
              linkedin: false,
              twitter: false,
              facebook: false,
              youtube: false,
              business: false,
            });
          }}
        >
          <Text style={styles.testButtonText}>Disable ALL</Text>
        </TouchableOpacity>
      </View>

      {/* Enhanced Debug Info */}
      {/* <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>🐛 Debug Info</Text>
        <Text style={styles.debugText}>
          Render Count: {renderCount.current}
        </Text>
        <Text style={styles.debugText}>
          Enabled Count: {Object.values(enabled).filter(Boolean).length}/6
        </Text>
        <Text style={styles.debugText}>
          Enabled Details: {JSON.stringify(enabled, null, 2)}
        </Text>
        <Text style={styles.debugText}>
          Values: IG: "{instagram}", LI: "{linkedin}", TW: "{twitter}", 
          FB: "{facebook}", YT: "{youtube}", GB: "{business}"
        </Text>
      </View> */} 

      <SocialInputBox
        IconComponent={InstagramIcon}
        label="Instagram"
        placeholder="https://instagram.com/username"
        value={instagram}
        onChangeText={(value) => handleInputChange('instagram', value)}
        isEnabled={enabled.instagram}
        onToggle={() => handleToggle('instagram')}
      />
      
      <SocialInputBox
        IconComponent={LinkedInIcon}
        label="LinkedIn"
        placeholder="https://linkedin.com/in/username"
        value={linkedin}
        onChangeText={(value) => handleInputChange('linkedin', value)}
        isEnabled={enabled.linkedin}
        onToggle={() => handleToggle('linkedin')}
      />
      
      <SocialInputBox
        IconComponent={TwitterIcon}
        label="Twitter"
        placeholder="https://twitter.com/username"
        value={twitter}
        onChangeText={(value) => handleInputChange('twitter', value)}
        isEnabled={enabled.twitter}
        onToggle={() => handleToggle('twitter')}
      />
      
      <SocialInputBox
        IconComponent={FacebookIcon}
        label="Facebook"
        placeholder="https://facebook.com/username"
        value={facebook}
        onChangeText={(value) => handleInputChange('facebook', value)}
        isEnabled={enabled.facebook}
        onToggle={() => handleToggle('facebook')}
      />
      
      <SocialInputBox
        IconComponent={YoutubeIcon}
        label="YouTube"
        placeholder="https://youtube.com/channel/..."
        value={youtube}
        onChangeText={(value) => handleInputChange('youtube', value)}
        isEnabled={enabled.youtube}
        onToggle={() => handleToggle('youtube')}
      />
      
      <SocialInputBox
        IconComponent={BusinessIcon}
        label="Google Business"
        placeholder="https://business.google.com/..."
        value={business}
        onChangeText={(value) => handleInputChange('business', value)}
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
  testContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 12,
  },
  testButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  testButtonDanger: {
    backgroundColor: '#f44336',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
  // Enhanced debug styles
  debugContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 11,
    color: '#856404',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
});

export default Social;