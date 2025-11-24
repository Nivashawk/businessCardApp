import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const BusinessCardDisplay = ({ 
  extractedData, 
  rawText, 
  onEdit, 
  onSave, 
  onShare 
}) => {
  const {
    name,
    businessName,
    jobTitle,
    phone,
    telephone,
    fax,
    email,
    website,
    address,
    confidence
  } = extractedData;

  const formatPhoneForCall = (phoneNumber) => {
    return phoneNumber.replace(/[^\d+]/g, '');
  };

  const handlePhonePress = (phoneNumber) => {
    const formattedPhone = formatPhoneForCall(phoneNumber);
    Linking.openURL(`tel:${formattedPhone}`);
  };

  const handleEmailPress = (emailAddress) => {
    Linking.openURL(`mailto:${emailAddress}`);
  };

  const handleWebsitePress = (websiteUrl) => {
    let url = websiteUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url);
  };

  const handleShare = async () => {
    const shareText = `
Contact: ${name || 'N/A'}
Company: ${businessName || 'N/A'}
Position: ${jobTitle || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
Website: ${website || 'N/A'}
Address: ${address || 'N/A'}
    `.trim();

    try {
      await Share.share({
        message: shareText,
        title: `Contact: ${name || businessName}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getConfidenceColor = (confidenceLevel) => {
    if (confidenceLevel >= 0.8) return colors.status_green;
    if (confidenceLevel >= 0.6) return colors.gold;
    return colors.status_red;
  };

  const getConfidenceText = (confidenceLevel) => {
    if (confidenceLevel >= 0.8) return 'High';
    if (confidenceLevel >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <LinearGradient
        colors={colors.cardGradient}
        style={styles.headerCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName}>
              {businessName || 'Business Name'}
            </Text>
            <Text style={styles.personName}>
              {name || 'Contact Name'}
            </Text>
            {jobTitle && (
              <Text style={styles.jobTitle}>{jobTitle}</Text>
            )}
          </View>
          
          {confidence?.name > 0 && (
            <View style={styles.confidenceIndicator}>
              <View 
                style={[
                  styles.confidenceDot, 
                  { backgroundColor: getConfidenceColor(confidence.name) }
                ]}
              />
              <Text style={styles.confidenceText}>
                {getConfidenceText(confidence.name)}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Contact Information Grid */}
      <View style={styles.contactGrid}>
        {/* Phone Numbers */}
        {phone && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handlePhonePress(phone)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.contactItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.iconText}>📱</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Mobile</Text>
                <Text style={styles.contactValue}>{phone}</Text>
              </View>
              <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>TAP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {telephone && telephone !== phone && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handlePhonePress(telephone)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#2196F3', '#1976D2']}
              style={styles.contactItemGradient}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.iconText}>☎️</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Telephone</Text>
                <Text style={styles.contactValue}>{telephone}</Text>
              </View>
              <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>TAP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Email */}
        {email && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleEmailPress(email)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#FF9800', '#F57C00']}
              style={styles.contactItemGradient}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.iconText}>📧</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue} numberOfLines={1}>
                  {email}
                </Text>
              </View>
              <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>TAP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Website */}
        {website && (
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleWebsitePress(website)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#9C27B0', '#7B1FA2']}
              style={styles.contactItemGradient}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.iconText}>🌐</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue} numberOfLines={1}>
                  {website}
                </Text>
              </View>
              <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>TAP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Fax */}
        {fax && (
          <View style={styles.contactItem}>
            <LinearGradient
              colors={['#607D8B', '#455A64']}
              style={styles.contactItemGradient}
            >
              <View style={styles.contactIcon}>
                <Text style={styles.iconText}>📠</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Fax</Text>
                <Text style={styles.contactValue}>{fax}</Text>
              </View>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Address Section */}
      {address && (
        <View style={styles.addressSection}>
          <LinearGradient
            colors={colors.cardGradient}
            style={styles.addressCard}
          >
            <View style={styles.addressHeader}>
              <Text style={styles.addressIcon}>📍</Text>
              <Text style={styles.addressTitle}>Address</Text>
              {confidence?.address > 0 && (
                <View 
                  style={[
                    styles.confidenceBadge,
                    { backgroundColor: getConfidenceColor(confidence.address) }
                  ]}
                >
                  <Text style={styles.confidenceBadgeText}>
                    {getConfidenceText(confidence.address)}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.addressText}>{address}</Text>
          </LinearGradient>
        </View>
      )}

      {/* Raw OCR Data Section */}
      <View style={styles.rawDataSection}>
        <TouchableOpacity 
          style={styles.rawDataHeader}
          onPress={() => {/* Toggle raw data visibility */}}
        >
          <Text style={styles.rawDataTitle}>📄 Raw OCR Text</Text>
          <Text style={styles.rawDataToggle}>▼</Text>
        </TouchableOpacity>
        <View style={styles.rawDataContainer}>
          <Text style={styles.rawDataText}>{rawText}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
        >
          <Text style={styles.actionButtonText}>✏️ Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.shareButton]}
          onPress={handleShare}
        >
          <Text style={styles.actionButtonText}>📤 Share</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.saveButton]}
          onPress={onSave}
        >
          <LinearGradient
            colors={[colors.gold, colors.goldDark]}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>💾 Save Contact</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Confidence Summary */}
      {confidence && (
        <View style={styles.confidenceSection}>
          <Text style={styles.confidenceSectionTitle}>Extraction Confidence</Text>
          <View style={styles.confidenceList}>
            {Object.entries(confidence).map(([field, level]) => (
              level > 0 && (
                <View key={field} style={styles.confidenceItem}>
                  <Text style={styles.confidenceField}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Text>
                  <View style={styles.confidenceBar}>
                    <View 
                      style={[
                        styles.confidenceProgress,
                        { 
                          width: `${level * 100}%`,
                          backgroundColor: getConfidenceColor(level)
                        }
                      ]}
                    />
                  </View>
                  <Text style={styles.confidencePercentage}>
                    {Math.round(level * 100)}%
                  </Text>
                </View>
              )
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 4,
  },
  personName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  confidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.text_color_1,
    fontWeight: '500',
  },
  contactGrid: {
    marginBottom: 20,
  },
  contactItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  contactItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  actionIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  addressSection: {
    marginBottom: 20,
  },
  addressCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 16,
    color: colors.text_color_1,
    lineHeight: 24,
  },
  rawDataSection: {
    marginBottom: 20,
  },
  rawDataHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rawDataTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text_color_1,
  },
  rawDataToggle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rawDataContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rawDataText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  editButton: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
  confidenceSection: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  confidenceSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 12,
  },
  confidenceList: {
    gap: 8,
  },
  confidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confidenceField: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 80,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceProgress: {
    height: '100%',
    borderRadius: 3,
  },
  confidencePercentage: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
});

export default BusinessCardDisplay;