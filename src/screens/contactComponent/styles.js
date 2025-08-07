// components/common/styles.js
import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../theme/colors'; // Your dark theme colors

const {width} = Dimensions.get('window');

export const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, // Changed from white to dark surface
    paddingHorizontal: 16,
    paddingTop: 8,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: colors.gold, // Using accent color for active tab
    elevation: 2,
    shadowColor: colors.goldDark,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary, // Using secondary text color
  },
  activeTabText: {
    color: colors.text_color_1, // White text for active tab
    fontWeight: '600',
  },
});

export const listStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, // Dark surface instead of white
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 72,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border, // Dark border color
    marginLeft: 64, // Align with content, not avatar
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.goldDark, // Using accent color for avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text_color_1, // White text
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1, // White text for business name
    flex: 1,
    marginRight: 8,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  eventBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  eventText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text_color_1, // White text for event badge
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary, // Secondary text color
    flex: 1,
    marginRight: 8,
  },
  recipientText: {
    fontSize: 12,
    color: colors.textSecondary, // Secondary text color
    fontStyle: 'italic',
  },
  senderText: {
    fontSize: 12,
    color: colors.textSecondary, // Secondary text color
    fontStyle: 'italic',
  },
  chevron: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 18,
    color: colors.textSecondary, // Secondary text color
    fontWeight: '300',
  },
});

export const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Dark background
  },
  header: {
    backgroundColor: colors.surface, // Dark surface
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Dark border
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text_color_1, // White text
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary, // Secondary text
  },
  searchFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface, // Dark surface
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary, // Dark card color for search
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text_color_1, // White text
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 16,
    color: colors.textSecondary, // Secondary text
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.secondary, // Dark card color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.accent, // Accent color when active
    borderColor: colors.accent,
  },
  filterIcon: {
    fontSize: 16,
  },
  activeFilterIcon: {
    color: colors.text_color_1, // White when active
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.status_red, // Red badge
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: colors.text_color_1, // White text
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    backgroundColor: colors.background, // Dark background
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: colors.background,
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1, // White text
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary, // Secondary text
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export const filterStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface, // Dark surface
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Dark border
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text_color_1, // White text
  },
  closeButton: {
    fontSize: 18,
    color: colors.textSecondary, // Secondary text
    fontWeight: '500',
    padding: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1, // White text
    marginBottom: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.secondary, // Dark card color
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.accent, // Accent color when selected
    borderColor: colors.accent,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary, // Secondary text
  },
  selectedOptionText: {
    color: colors.text_color_1, // White when selected
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border, // Dark border
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text_color_1, // White text
    backgroundColor: colors.secondary, // Dark card background
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: colors.secondary, // Dark card color
    borderWidth: 1,
    borderColor: colors.border,
  },
  applyButton: {
    backgroundColor: colors.accent, // Accent color
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary, // Secondary text
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text_color_1, // White text
  },
});

// Additional styles for manual contact modal to match dark theme
export const manualModalStyles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.surface, // Dark surface
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  imagePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 10,
  },
  imagePlaceholder: {
    width: '48%',
    height: 120,
    backgroundColor: colors.secondary, // Dark card color
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imagePlaceholderText: {
    color: colors.textSecondary, // Secondary text
    fontSize: 14,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clearImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearImageText: {
    color: colors.text_color_1, // White text
    fontSize: 14,
    fontWeight: 'bold',
  },
});

// Additional styles for manual contact list item thumbnails
export const manualListItemStyles = StyleSheet.create({
  imageThumbnailContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  imageThumbnail: {
    width: 50,
    height: 30,
    borderRadius: 4,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: colors.border, // Dark border instead of light gray
  },
});