import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import SocialInputBox from '../../../components/inputs/socialInputBox';
import {useSelector} from 'react-redux';

import InstagramIcon from '../../../../assets/socialIcons/instagram.svg';
import LinkedInIcon from '../../../../assets/socialIcons/linkedIn.svg';
import TwitterIcon from '../../../../assets/socialIcons/twitter.svg';
import FacebookIcon from '../../../../assets/socialIcons/facebook.svg';
import YoutubeIcon from '../../../../assets/socialIcons/youtube.svg';
import BusinessIcon from '../../../../assets/socialIcons/business.svg';

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
    }
  }, [businessData]);

  // 👇 This exposes the getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => ({
      instagram,
      linkedin,
      twitter,
      facebook,
      youtube,
      business,
    }),
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SocialInputBox
        IconComponent={InstagramIcon}
        label="Instagram"
        placeholder="Enter Link"
        value={instagram}
        onChangeText={setInstagram}
        isEnabled={enabled.instagram}
        onToggle={() => setEnabled({...enabled, instagram: !enabled.instagram})}
      />
      <SocialInputBox
        IconComponent={LinkedInIcon}
        label="LinkedIn"
        placeholder="Enter Link"
        value={linkedin}
        onChangeText={setLinkedin}
        isEnabled={enabled.linkedin}
        onToggle={() => setEnabled({...enabled, linkedin: !enabled.linkedin})}
      />
      <SocialInputBox
        IconComponent={TwitterIcon}
        label="Twitter"
        placeholder="Enter Link"
        value={twitter}
        onChangeText={setTwitter}
        isEnabled={enabled.twitter}
        onToggle={() => setEnabled({...enabled, twitter: !enabled.twitter})}
      />
      <SocialInputBox
        IconComponent={FacebookIcon}
        label="Facebook"
        placeholder="Enter Link"
        keyboardType="phone-pad"
        value={facebook}
        onChangeText={setFacebook}
        isEnabled={enabled.facebook}
        onToggle={() => setEnabled({...enabled, facebook: !enabled.facebook})}
      />
      <SocialInputBox
        IconComponent={YoutubeIcon}
        label="youtube"
        placeholder="Enter Link"
        value={youtube}
        onChangeText={setYoutube}
        isEnabled={enabled.youtube}
        onToggle={() => setEnabled({...enabled, youtube: !enabled.youtube})}
      />
      <SocialInputBox
        IconComponent={BusinessIcon}
        label="business"
        placeholder="Enter Link"
        keyboardType="phone-pad"
        value={business}
        onChangeText={setBusiness}
        isEnabled={enabled.business}
        onToggle={() => setEnabled({...enabled, business: !enabled.business})}
      />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
});

export default Social;
