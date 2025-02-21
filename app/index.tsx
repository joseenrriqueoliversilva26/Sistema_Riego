// app/(auth)/login.tsx
import { LoginView } from "@/components/auntentication/login/loginView";
import { View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LoginView />
    </View>
  );
}

