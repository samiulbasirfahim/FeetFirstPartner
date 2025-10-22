import { Redirect } from "expo-router";

export default function Screen() {
    const isLoggedIn = false;

    if (isLoggedIn) return <Redirect href={"/(tabs)/scan"} />;
    return <Redirect href={"/login"} />;
}
