// // @flow
// import React from "react";
// import { ScrollView, View, StyleSheet, TextInput } from "react-native";
// import Text from "../../sharedComponents/Text";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { defineMessages, useIntl, FormattedMessage } from "react-intl";

// import LocationField from "../../sharedComponents/LocationField";
// import BottomSheet from "./BottomSheet";
// import Field from "./Field";
// import {
//   CameraIcon,
//   DetailsIcon,
//   CategoryCircleIcon,
// } from "../../sharedComponents/icons";
// import { useDraftObservation } from "../../hooks/useDraftObservation";
// import useSettingsValue from "../../hooks/useSettingsValue";
// import ThumbnailScrollView from "../../sharedComponents/ThumbnailScrollView";
// import TextButton from "../../sharedComponents/TextButton";
// import { BLACK, LIGHT_GREY, LIGHT_BLUE } from "../../lib/styles";

// import type { PresetWithFields, TextField } from "../../context/ConfigContext";
// import {
//   FormattedPresetName,
//   FormattedCoords,
// } from "../../sharedComponents/FormattedData";

// const m = defineMessages({
//   searching: {
//     id: "screens.ObservationEdit.ObservationEditView.searching",
//     defaultMessage: "Searching…",
//     description: "Shown in new observation screen whilst looking for GPS",
//   },
//   changePreset: {
//     id: "screens.ObservationEdit.ObservationEditView.changePreset",
//     defaultMessage: "Change",
//     description: "Button to change a category / preset",
//   },
//   descriptionPlaceholder: {
//     id: "screens.ObservationEdit.ObservationEditView.descriptionPlaceholder",
//     defaultMessage: "What is happening here?",
//     description: "Placeholder for description/notes field",
//   },
//   ,
//   detailsButton: {
//     id: "screens.ObservationEdit.ObservationEditView.detailsButton",
//     defaultMessage: "Add Details",
//     description: "Button label to add details",
//   },
// });

// const CategoryView = ({
//   preset = {},
//   onPress,
// }: {
//   preset?: PresetWithFields,
//   onPress: () => void,
// }) => {
//   const { formatMessage: t } = useIntl();
//   return (
//     <View style={styles.categoryContainer}>
//       <View style={styles.categoryIcon}>
//         <CategoryCircleIcon iconId={preset.icon} color={preset.color} />
//       </View>
//       <Text style={styles.categoryName}>
//         <FormattedPresetName preset={preset} />
//       </Text>
//       <TextButton
//         containerStyle={styles.changeButton}
//         textStyle={styles.changeButtonText}
//         onPress={onPress}
//         title={t(m.changePreset)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     alignContent: "stretch",
//   },
//   scrollViewContent: {
//     flexDirection: "column",
//     alignContent: "stretch",
//   },
//   locationContainer: {
//     flex: 0,
//     backgroundColor: LIGHT_GREY,
//     minHeight: 48,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 5,
//     paddingBottom: 5,
//   },
//   locationText: {
//     color: BLACK,
//     fontWeight: "bold",
//   },
//   accuracy: {
//     fontWeight: "bold",
//   },
//   categoryContainer: {
//     flex: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     alignContent: "stretch",
//     paddingLeft: 15,
//     paddingRight: 15,
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   categoryIcon: {
//     flex: 0,
//   },
//   categoryName: {
//     color: BLACK,
//     fontSize: 20,
//     marginLeft: 10,
//     fontWeight: "bold",
//     flex: 1,
//   },
//   changeButton: {
//     padding: 0,
//   },
//   changeButtonText: {
//     color: LIGHT_BLUE,
//     paddingTop: 5,
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   textInput: {
//     flex: 1,
//     minHeight: 100,
//     fontSize: 20,
//     padding: 20,
//     color: "black",
//     alignItems: "flex-start",
//     justifyContent: "flex-start",
//     textAlignVertical: "top",
//   },
// });
