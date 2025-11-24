import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  PanResponder,
  StatusBar,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../theme/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;
const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.1;

const OCRDataBottomSheet = ({ 
  visible, 
  rawText, 
  extractedData, 
  onSave, 
  onClose,
  onEdit 
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(extractedData);

  useEffect(() => {
    if (visible) {
      showBottomSheet();
    } else {
      hideBottomSheet();
    }
  }, [visible]);

  useEffect(() => {
    setEditableData(extractedData);
  }, [extractedData]);

  const showBottomSheet = () => {
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const hideBottomSheet = () => {
    Animated.spring(translateY, {
      toValue: SCREEN_HEIGHT,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderMove: (_, gestureState) => {
      const newTranslateY = SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT + gestureState.dy;
      if (newTranslateY >= SCREEN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT) {
        translateY.setValue(newTranslateY);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        showBottomSheet();
      }
    },
  });

  const formatRawText = (text) => {
    return text.split('\n').map((line, index) => ({
      id: index,
      text: line.trim(),
      isEmpty: line.trim().length === 0
    })).filter(line => !line.isEmpty);
  };

  const getLineType = (line) => {
    const lowerLine = line.toLowerCase();
    
    // Email
    if (line.includes('@')) return 'email';
    
    // Phone numbers
    if (/\+?\d{2,3}[-.\s]?\d{3,5}[-.\s]?\d{3,5}/.test(line) || 
        /cell|mobile|phone|tel/i.test(line)) return 'phone';
    
    // Website
    if (/www\.|https?:\/\//.test(line)) return 'website';
    
    // Address (has numbers, commas, or location indicators)
    if (/\d+/.test(line) && 
        (/,/.test(line) || /road|market|street|nagar|colony/i.test(line))) return 'address';
    
    // Business terms
    if (/company|ltd|limited|pvt|corp|inc|solutions|systems|technologies/i.test(line)) return 'business';
    
    // Job titles
    if (/manager|director|agent|ceo|engineer|consultant|executive/i.test(line)) return 'job';
    
    // Person names (2-3 capitalized words)
    const words = line.split(' ');
    if (words.length >= 2 && words.length <= 3 && 
        words.every(word => word.length > 0 && word[0] === word[0].toUpperCase())) {
      return 'name';
    }
    
    return 'other';
  };

  const getLineIcon = (type) => {
    switch (type) {
      case 'email': return '📧';
      case 'phone': return '📱';
      case 'website': return '🌐';
      case 'address': return '📍';
      case 'business': return '🏢';
      case 'job': return '💼';
      case 'name': return '👤';
      default: return '📄';
    }
  };

  const getLineColor = (type) => {
    switch (type) {
      case 'email': return '#FF9800';
      case 'phone': return '#4CAF50';
      case 'website': return '#9C27B0';
      case 'address': return '#2196F3';
      case 'business': return colors.gold;
      case 'job': return '#FF5722';
      case 'name': return '#00BCD4';
      default: return colors.textSecondary;
    }
  };

  const formattedLines = formatRawText(rawText);

  const handleSave = () => {
    onSave(editableData);
  };

  const updateField = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        <View style={styles.handle} />
        
        {/* Header */}
        <LinearGradient
          colors={[colors.gold, colors.goldDark]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Business Card Data</Text>
              <Text style={styles.headerSubtitle}>
                {formattedLines.length} lines extracted
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Raw Data Display */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📄 Raw OCR Text</Text>
            <View style={styles.rawDataContainer}>
              {formattedLines.map((line, index) => {
                const type = getLineType(line.text);
                const icon = getLineIcon(type);
                const color = getLineColor(type);
                
                return (
                  <View key={line.id} style={styles.rawLine}>
                    <View style={styles.lineNumber}>
                      <Text style={styles.lineNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.lineIcon}>
                      <Text style={styles.lineIconText}>{icon}</Text>
                    </View>
                    <View style={styles.lineContent}>
                      <Text style={[styles.lineText, { color }]}>
                        {line.text}
                      </Text>
                      <Text style={styles.lineType}>{type.toUpperCase()}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Extracted Fields */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Extracted Information</Text>
              <TouchableOpacity 
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editToggle}
              >
                <Text style={styles.editToggleText}>
                  {isEditing ? '✓ Done' : '✏️ Edit'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.extractedContainer}>
              {[
                { key: 'name', label: 'Name', icon: '👤' },
                { key: 'businessName', label: 'Business', icon: '🏢' },
                { key: 'jobTitle', label: 'Job Title', icon: '💼' },
                { key: 'phone', label: 'Phone', icon: '📱' },
                { key: 'telephone', label: 'Telephone', icon: '☎️' },
                { key: 'email', label: 'Email', icon: '📧' },
                { key: 'website', label: 'Website', icon: '🌐' },
                { key: 'address', label: 'Address', icon: '📍' },
              ].map(({ key, label, icon }) => {
                const value = editableData[key];
                const confidence = extractedData.confidence?.[key] || 0;
                
                if (!value && !isEditing) return null;
                
                return (
                  <View key={key} style={styles.extractedField}>
                    <View style={styles.fieldHeader}>
                      <Text style={styles.fieldIcon}>{icon}</Text>
                      <Text style={styles.fieldLabel}>{label}</Text>
                      {confidence > 0 && (
                        <View style={[
                          styles.confidenceBadge,
                          { backgroundColor: confidence >= 0.8 ? colors.status_green : 
                                            confidence >= 0.6 ? colors.gold : colors.status_red }
                        ]}>
                          <Text style={styles.confidenceBadgeText}>
                            {Math.round(confidence * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                    
                    {isEditing ? (
                      <TextInput
                        style={[styles.fieldInput, key === 'address' && styles.addressInput]}
                        value={value || ''}
                        onChangeText={(text) => updateField(key, text)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        placeholderTextColor={colors.textSecondary}
                        multiline={key === 'address'}
                        numberOfLines={key === 'address' ? 3 : 1}
                      />
                    ) : (
                      <Text style={styles.fieldValue}>
                        {value || 'Not detected'}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Extraction Stats</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formattedLines.length}</Text>
                <Text style={styles.statLabel}>Lines Processed</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Object.values(editableData).filter(v => v && v.length > 0).length}
                </Text>
                <Text style={styles.statLabel}>Fields Extracted</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.round(
                    Object.values(extractedData.confidence || {})
                      .reduce((acc, val) => acc + val, 0) / 
                    Object.keys(extractedData.confidence || {}).length * 100
                  ) || 0}%
                </Text>
                <Text style={styles.statLabel}>Avg Confidence</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={onClose}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSave}
          >
            <LinearGradient
              colors={[colors.gold, colors.goldDark]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>💾 Save Contact</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: BOTTOM_SHEET_MAX_HEIGHT,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1001,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(26, 26, 26, 0.8)',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 26, 26, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.background,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1,
    marginBottom: 16,
  },
  editToggle: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editToggleText: {
    fontSize: 14,
    color: colors.text_color_1,
    fontWeight: '500',
  },
  rawDataContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rawLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lineNumber: {
    width: 30,
    alignItems: 'center',
  },
  lineNumberText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  lineIcon: {
    width: 30,
    alignItems: 'center',
  },
  lineIconText: {
    fontSize: 16,
  },
  lineContent: {
    flex: 1,
    marginLeft: 8,
  },
  lineText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  lineType: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  extractedContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  extractedField: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text_color_1,
    flex: 1,
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text_color_1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldInput: {
    fontSize: 16,
    color: colors.text_color_1,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gold,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1,
  },
  saveButton: {
    flex: 2,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  saveButtonGradient: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});

export default OCRDataBottomSheet;