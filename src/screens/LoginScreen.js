import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useState } from "react";

import Icon from "react-native-vector-icons/FontAwesome";

import { authentication } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
WebBrowser.maybeCompleteAuthSession();
const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [userInfo, setUserInfo] = useState("");

  const [request, response, promptAync] = Google.useAuthRequest({
    iosClientId:
      "399353246920-633rv0ng9i34t945dvbf8afth6cm65h7.apps.googleusercontent.com",
    androidClientId:
      "399353246920-m2aaht1pg4ptof9mglftidg2ldgef37i.apps.googleusercontent.com",
  });

  const { setLoggedInUser } = useAuth();

  const { setAdminLoggedIn } = useAuth();

  const inputRef = React.useRef();
  const passwordRef = React.useRef();

  React.useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credenttials = GoogleAuthProvider.credential(id_token);
      signInWithCredential(authentication, credenttials);
    }
  }, [response]);

  const handleSignIn = async () => {
    if (email === "admin@gmail.com" && password === "admin123") {
      setAdminLoggedIn(true);
    } else {
      setIsLoading(true);

      signInWithEmailAndPassword(authentication, email, password)
        .then((res) => {
          console.log("successful");
          setLoggedInUser(res.user);
        })

        .catch((err) => {
          console.log(err);
          setError("Incorrect Email/Password");
        })

        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor="#5E8D48" barStyle="light-content" />
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headingLabel}>Log in</Text>

        <TouchableOpacity
          onPress={() => inputRef.current.focus()}
          style={styles.inputView}
        >
          <TextInput
            ref={inputRef}
            style={styles.TextInput}
            placeholder="Email"
            defaultValue="admin@gmail.come"
            placeholderTextColor="#303030"
            onChangeText={(email) => setEmail(email)}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => passwordRef.current.focus()}
          style={styles.inputView2}
        >
          <TextInput
            ref={passwordRef}
            style={styles.TextInput}
            placeholder="Password"
            defaultValue="admin1234"
            placeholderTextColor="#303030"
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            style={{ position: "absolute", right: 15, top: 20 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="#303030"
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgot2}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn} style={styles.button}>
          <Text style={styles.text}>Login</Text>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="white"
              style={{
                alignSelf: "center",
                justifyContent: "center",
                paddingLeft: 10,
              }}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>
        <View style={styles.socialLogin}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => promptAync()}
          >
            <Icon name="google" size={20} color="#303030" />
          </TouchableOpacity>
        </View>

        <View style={styles.signupText}>
          <Text style={styles.downText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("signup")}>
            <Text style={styles.signup}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginTop: 20,
  },
  headingLabel: {
    fontSize: 30,
    marginVertical: 20,
    color: "#331ece",
    fontFamily: "UbuntuBold",
  },
  inputView: {
    borderWidth: 1,
    borderColor: "#331ece",
    borderRadius: 24,
    width: "80%",
    height: 60,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  inputView2: {
    borderWidth: 1,
    borderColor: "#331ece",
    borderRadius: 24,
    width: "80%",
    height: 60,
    marginBottom: 10,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  TextInput: {
    height: 50,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },

  button: {
    backgroundColor: "#302298",
    borderRadius: 20,
    padding: 10,
    margin: 14,
    width: "78%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    alignSelf: "center",
    fontFamily: "UbuntuBold",
  },
  forgot: {
    alignSelf: "flex-start",
    marginLeft: 50,
    textDecorationLine: "underline",
    color: "#331ece",
    fontSize: 16,
    fontFamily: "UbuntuMedium",
  },
  forgot2: {
    textDecorationLine: "underline",
    color: "#331ece",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "UbuntuMedium",
  },
  downText: {
    color: "#331ece",
    fontSize: 16,
    marginTop: 10,
    textDecorationLine: "underline",
    fontFamily: "UbuntuMedium",
    marginRight: 5,
  },
  signup: {
    alignSelf: "flex-start",
    color: "#331ece",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "UbuntuMedium",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 2,
    marginBottom: 2,
    fontFamily: "UbuntuMedium",
  },
  orText: {
    color: "#303030",
    fontSize: 18,
    marginVertical: 10,
    fontFamily: "UbuntuBold",
  },
  socialLogin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  signupText: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});
