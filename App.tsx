import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store";
import RootNavigator from "./src/navigation/RootNavigator";
import CustomModal from "./src/components/CustomModal";
import "./src/i18n";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
          <CustomModal />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
